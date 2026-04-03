/**
 * Express Server with CSP Security Headers
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');

const { DB_CONFIG } = require('./config/database');
const { MatcherService } = require('./services/matcher');
const { ScoringEngine } = require('./logic/scoring');

const app = express();
const pool = new Pool(DB_CONFIG);
const matcher = new MatcherService(pool);
const scorer = new ScoringEngine();

// =============================================
// Security Middleware: Helmet with Strict CSP
// =============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Next.js requires inline scripts
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  crossOriginEmbedderPolicy: false // Allow for Next.js
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// =============================================
// API Routes
// =============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Get user recommendations (cohort matching)
app.get('/api/users/:userId/recommendations', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    
    const recommendations = await matcher.matchUserToCohorts(userId, limit);
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Discover cohorts by interests
app.get('/api/cohorts/discover', async (req, res) => {
  try {
    const interests = req.query.interests ? req.query.interests.split(',') : [];
    const limit = parseInt(req.query.limit) || 15;
    
    if (interests.length === 0) {
      // Return trending cohorts if no interests specified
      const trending = await matcher.getTrendingCohorts(limit);
      return res.json({ success: true, data: trending });
    }
    
    const cohorts = await matcher.discoverByInterests(interests, limit);
    
    res.json({
      success: true,
      data: cohorts
    });
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find cohorts by metadata
app.post('/api/cohorts/search', 
  body('criteria').isObject(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { criteria } = req.body;
      const limit = parseInt(req.query.limit) || 20;
      
      const cohorts = await matcher.findCohortsByMetadata(criteria, limit);
      
      res.json({
        success: true,
        data: cohorts
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Get cohort details
app.get('/api/cohorts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const { rows } = await pool.query(
      `SELECT 
        c.*,
        COUNT(DISTINCT uc.user_id) as actual_member_count,
        COUNT(DISTINCT p.id) as post_count,
        MAX(p.created_at) as last_post_at
      FROM cohorts c
      LEFT JOIN user_cohorts uc ON uc.cohort_id = c.id
      LEFT JOIN posts p ON p.cohort_id = c.id
      WHERE c.slug = $1
      GROUP BY c.id`,
      [slug]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Cohort not found' });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Cohort fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user engagement score
app.get('/api/users/:userId/score', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { rows } = await pool.query(
      `SELECT 
        u.id,
        u.username,
        u.engagement_score,
        u.level,
        COALESCE(SUM(uc.post_depth_score), 0) as total_post_depth,
        COALESCE(SUM(uc.meaningful_interactions), 0) as total_interactions
      FROM users u
      LEFT JOIN user_cohorts uc ON uc.user_id = u.id
      WHERE u.id = $1
      GROUP BY u.id, u.username, u.engagement_score, u.level`,
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const user = rows[0];
    const levelProgress = scorer.getLevelProgress(user.engagement_score);
    
    res.json({
      success: true,
      data: {
        ...user,
        levelProgress,
        contributionLevel: scorer.getContributionLevel(user.engagement_score)
      }
    });
  } catch (error) {
    console.error('Score fetch error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user cohort engagement (scoring)
app.post('/api/user-cohorts/:userId/:cohortId/score',
  body('postDepthScore').isInt({ min: 0 }),
  body('meaningfulInteractions').isInt({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const { userId, cohortId } = req.params;
      const { postDepthScore, meaningfulInteractions } = req.body;
      
      await pool.query(
        `UPDATE user_cohorts 
         SET post_depth_score = $1, 
             meaningful_interactions = $2
         WHERE user_id = $3 AND cohort_id = $4`,
        [postDepthScore, meaningfulInteractions, userId, cohortId]
      );
      
      // Calculate new score
      const newScore = scorer.calculateScore({
        postDepthScore,
        meaningfulInteractions
      });
      
      res.json({
        success: true,
        data: {
          calculatedScore: newScore,
          level: scorer.calculateLevel(newScore)
        }
      });
    } catch (error) {
      console.error('Score update error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Get trending cohorts
app.get('/api/cohorts/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const trending = await matcher.getTrendingCohorts(limit);
    
    res.json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get queue stats (for admin/monitoring)
app.get('/api/admin/queue-stats', async (req, res) => {
  try {
    const { RevenueWorker } = require('./workers/revenue_worker');
    const worker = new RevenueWorker();
    const stats = await worker.getQueueStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Queue stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =============================================
// Error Handling
// =============================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// =============================================
// Server Start
// =============================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Swaynix Server running on port ${PORT}`);
  console.log(`📊 API Documentation:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/users/:userId/recommendations`);
  console.log(`   GET  /api/cohorts/discover`);
  console.log(`   GET  /api/cohorts/:slug`);
  console.log(`   GET  /api/cohorts/trending`);
  console.log(`   POST /api/cohorts/search`);
  console.log(`   GET  /api/users/:userId/score`);
});

module.exports = { app };
