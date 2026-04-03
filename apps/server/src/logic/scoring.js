/**
 * Scoring Logic
 * Anti-FOMO weighted algorithm: (Post_Depth * 5) + (Meaningful_Interactions * 2)
 * NO follower counts - pure engagement quality
 */

class ScoringEngine {
  constructor() {
    // Weights for engagement calculation
    this.WEIGHTS = {
      POST_DEPTH: 5,           // Character count / complexity
      MEANINGFUL_INTERACTION: 2, // Quality replies, insights, collaborations
      REPLY_RECEIVED: 3,         // Getting thoughtful responses
      COLLABORATION: 10          // Working with others
    };
    
    // Level thresholds
    this.LEVEL_THRESHOLDS = [
      0,      // Level 1
      10,     // Level 2
      50,     // Level 3
      100,    // Level 4
      250,    // Level 5
      500,    // Level 6
      1000,   // Level 7
      2500,   // Level 8
      5000,   // Level 9
      10000   // Level 10
    ];
  }

  /**
   * Calculate user engagement score
   * Formula: (Post_Depth * 5) + (Meaningful_Interactions * 2)
   * 
   * @param {Object} data - User activity data
   * @param {number} data.postDepthScore - Total post depth (character count proxy)
   * @param {number} data.meaningfulInteractions - Count of quality interactions
   * @returns {number} - Calculated engagement score
   */
  calculateScore({ postDepthScore = 0, meaningfulInteractions = 0 }) {
    const score = 
      (postDepthScore * this.WEIGHTS.POST_DEPTH) + 
      (meaningfulInteractions * this.WEIGHTS.MEANINGFUL_INTERACTION);
    
    return Math.floor(score);
  }

  /**
   * Calculate score from database record
   * 
   * @param {Object} record - Database record with post_depth_score and meaningful_interactions
   * @returns {number} - Calculated score
   */
  calculateFromRecord(record) {
    return this.calculateScore({
      postDepthScore: record.post_depth_score || 0,
      meaningfulInteractions: record.meaningful_interactions || 0
    });
  }

  /**
   * Determine user level based on engagement score
   * 
   * @param {number} score - Engagement score
   * @returns {number} - Level (1-10)
   */
  calculateLevel(score) {
    for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (score >= this.LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Get level progress percentage
   * 
   * @param {number} score - Current score
   * @returns {Object} - Current level, next level, and progress percentage
   */
  getLevelProgress(score) {
    const currentLevel = this.calculateLevel(score);
    const nextLevelThreshold = this.LEVEL_THRESHOLDS[currentLevel] || this.LEVEL_THRESHOLDS[this.LEVEL_THRESHOLDS.length - 1] * 2;
    const currentLevelThreshold = this.LEVEL_THRESHOLDS[currentLevel - 1] || 0;
    
    const progressInLevel = score - currentLevelThreshold;
    const levelRange = nextLevelThreshold - currentLevelThreshold;
    const percentage = Math.min(100, Math.floor((progressInLevel / levelRange) * 100));
    
    return {
      level: currentLevel,
      nextLevel: currentLevel + 1,
      progressPercentage: percentage,
      scoreToNextLevel: nextLevelThreshold - score,
      currentThreshold: currentLevelThreshold,
      nextThreshold: nextLevelThreshold
    };
  }

  /**
   * Calculate post depth score based on content metrics
   * Considers length, complexity, and structure
   * 
   * @param {string} content - Post content
   * @returns {number} - Depth score (0-1000)
   */
  calculatePostDepth(content) {
    if (!content || content.length === 0) return 0;
    
    const length = content.length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0).length;
    const questions = (content.match(/\?/g) || []).length;
    
    // Base score from length (capped at 500 chars)
    const lengthScore = Math.min(length, 500) / 5; // 0-100
    
    // Structure bonus
    const structureScore = Math.min(paragraphs * 10, 50);
    
    // Engagement markers (questions indicate discussion intent)
    const engagementScore = questions * 20;
    
    // Complexity factor (sentence variety)
    const complexityScore = Math.min(sentences * 2, 50);
    
    const total = lengthScore + structureScore + engagementScore + complexityScore;
    return Math.min(Math.floor(total), 1000);
  }

  /**
   * Calculate interaction weight based on type
   * 
   * @param {string} type - Interaction type
   * @returns {number} - Weight value
   */
  getInteractionWeight(type) {
    const weights = {
      'thoughtful_reply': 2,
      'insight': 3,
      'collaboration': 5,
      'resource_share': 2,
      'constructive_feedback': 2,
      'like': 0  // Likes don't count - they encourage FOMO
    };
    
    return weights[type] || 1;
  }

  /**
   * Batch calculate scores for multiple users
   * 
   * @param {Array} records - Array of user activity records
   * @returns {Array} - Records with calculated scores
   */
  batchCalculate(records) {
    return records.map(record => ({
      ...record,
      calculatedScore: this.calculateFromRecord(record),
      level: this.calculateLevel(this.calculateFromRecord(record))
    }));
  }

  /**
   * Generate leaderboard data sorted by engagement score
   * NO follower counts displayed - pure engagement quality
   * 
   * @param {Array} users - User records with engagement data
   * @param {number} limit - Maximum results
   * @returns {Array} - Sorted leaderboard
   */
  generateLeaderboard(users, limit = 50) {
    const scored = this.batchCalculate(users);
    
    return scored
      .sort((a, b) => b.calculatedScore - a.calculatedScore)
      .slice(0, limit)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        level: user.level,
        engagementScore: user.calculatedScore,
        // Anti-FOMO: Only show relative contribution, never absolute follower counts
        contributionLevel: this.getContributionLevel(user.calculatedScore)
      }));
  }

  /**
   * Get contribution level label
   * 
   * @param {number} score - Engagement score
   * @returns {string} - Contribution level label
   */
  getContributionLevel(score) {
    if (score >= 5000) return 'Community Luminary';
    if (score >= 2500) return 'Valued Contributor';
    if (score >= 1000) return 'Active Participant';
    if (score >= 500) return 'Regular Contributor';
    if (score >= 100) return 'Engaged Member';
    return 'Newcomer';
  }
}

module.exports = { ScoringEngine };
