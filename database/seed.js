import { faker } from '@faker-js/faker';
import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/swaynix',
});

// Interest categories for realistic data
const INTEREST_CATEGORIES = [
  'technology', 'programming', 'design', 'art', 'music', 'gaming',
  'fitness', 'wellness', 'cooking', 'travel', 'photography', 'writing',
  'entrepreneurship', 'investing', 'sustainability', 'science', 'history',
  'philosophy', 'psychology', 'education', 'languages', 'crafts', 'diy'
];

const COHORT_THEMES = [
  { name: 'Deep Tech Discussions', topics: ['technology', 'programming', 'science'] },
  { name: 'Creative Minds Collective', topics: ['design', 'art', 'photography', 'writing'] },
  { name: 'Mindful Living Circle', topics: ['wellness', 'fitness', 'philosophy', 'psychology'] },
  { name: 'Indie Builders Hub', topics: ['entrepreneurship', 'programming', 'design'] },
  { name: 'Sustainable Future', topics: ['sustainability', 'science', 'education'] },
  { name: 'Global Explorers', topics: ['travel', 'photography', 'languages', 'history'] },
  { name: 'Creative Coding', topics: ['programming', 'art', 'design', 'technology'] },
  { name: 'Conscious Creators', topics: ['wellness', 'writing', 'art', 'diy'] },
  { name: 'Future of Work', topics: ['entrepreneurship', 'technology', 'psychology'] },
  { name: 'Lifelong Learners', topics: ['education', 'science', 'languages', 'history'] }
];

/**
 * Generate a user's profile_data JSONB with random interests
 */
function generateUserProfile() {
  // Select 2-6 random interests
  const numInterests = faker.number.int({ min: 2, max: 6 });
  const interests = faker.helpers.arrayElements(INTEREST_CATEGORIES, numInterests);
  
  // Generate experience levels for each interest
  const profile = {
    interests: interests.reduce((acc, interest) => {
      acc[interest] = {
        level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced', 'expert']),
        years_experience: faker.number.int({ min: 0, max: 20 }),
        seeking: faker.helpers.arrayElement(['mentorship', 'collaboration', 'learning', 'teaching'])
      };
      return acc;
    }, {}),
    preferences: {
      notification_frequency: faker.helpers.arrayElement(['daily', 'weekly', 'minimal']),
      content_depth: faker.helpers.arrayElement(['casual', 'thoughtful', 'deep']),
      interaction_style: faker.helpers.arrayElement(['observer', 'contributor', 'leader'])
    },
    timezone: faker.location.timeZone(),
    languages: faker.helpers.arrayElements(['en', 'es', 'fr', 'de', 'zh', 'ja'], faker.number.int({ min: 1, max: 3 }))
  };
  
  return profile;
}

/**
 * Generate cohort metadata JSONB
 */
function generateCohortMetadata(cohortTheme) {
  return {
    topics: cohortTheme.topics,
    engagement_model: faker.helpers.arrayElement(['discussion', 'project_based', 'event_driven']),
    rules: {
      no_self_promo: true,
      depth_first: true,
      constructive_feedback: true
    },
    tags: cohortTheme.topics,
    difficulty: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
    meeting_frequency: faker.helpers.arrayElement(['daily', 'weekly', 'biweekly', 'async']),
    max_members: faker.number.int({ min: 50, max: 500 }),
    created_reason: faker.lorem.sentence()
  };
}

/**
 * Seed 1,000 users
 */
async function seedUsers() {
  console.log('Seeding 1,000 users...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    for (let i = 0; i < 1000; i++) {
      const profile = generateUserProfile();
      
      await client.query(
        `INSERT INTO users (email, username, profile_data, engagement_score, level)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          faker.internet.email(),
          faker.internet.userName() + faker.number.int({ min: 100, max: 9999 }),
          JSON.stringify(profile),
          faker.number.int({ min: 0, max: 5000 }), // Random engagement score
          faker.number.int({ min: 1, max: 8 })
        ]
      );
      
      if (i % 100 === 0) {
        console.log(`  Created ${i} users...`);
      }
    }
    
    await client.query('COMMIT');
    console.log('  ✓ 1,000 users created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed cohorts
 */
async function seedCohorts() {
  console.log('Seeding cohorts...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    for (const theme of COHORT_THEMES) {
      const metadata = generateCohortMetadata(theme);
      const slug = theme.name.toLowerCase().replace(/\s+/g, '-');
      
      await client.query(
        `INSERT INTO cohorts (name, description, slug, metadata, member_count)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          theme.name,
          faker.lorem.paragraphs(2),
          slug,
          JSON.stringify(metadata),
          faker.number.int({ min: 10, max: 300 })
        ]
      );
    }
    
    await client.query('COMMIT');
    console.log('  ✓ 10 cohorts created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed user-cohort memberships with engagement data
 */
async function seedUserCohorts() {
  console.log('Seeding user-cohort memberships...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get all user and cohort IDs
    const usersResult = await client.query('SELECT id, profile_data FROM users');
    const cohortsResult = await client.query('SELECT id, metadata FROM cohorts');
    
    const users = usersResult.rows;
    const cohorts = cohortsResult.rows;
    
    let memberships = 0;
    
    // For each user, potentially join 1-5 cohorts based on interest overlap
    for (const user of users) {
      const userInterests = Object.keys(user.profile_data.interests || {});
      
      // Find cohorts with overlapping topics
      const matchingCohorts = cohorts.filter(cohort => {
        const cohortTopics = cohort.metadata.tags || [];
        return userInterests.some(interest => cohortTopics.includes(interest));
      });
      
      // Join 1-5 matching cohorts (or random if no match)
      const cohortsToJoin = matchingCohorts.length > 0 
        ? faker.helpers.arrayElements(matchingCohorts, faker.number.int({ min: 1, max: Math.min(5, matchingCohorts.length) }))
        : faker.helpers.arrayElements(cohorts, faker.number.int({ min: 1, max: 3 }));
      
      for (const cohort of cohortsToJoin) {
        const postDepthScore = faker.number.int({ min: 0, max: 100 });
        const meaningfulInteractions = faker.number.int({ min: 0, max: 50 });
        
        await client.query(
          `INSERT INTO user_cohorts (user_id, cohort_id, post_depth_score, meaningful_interactions)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id, cohort_id) DO NOTHING`,
          [user.id, cohort.id, postDepthScore, meaningfulInteractions]
        );
        memberships++;
      }
      
      if (memberships % 100 === 0) {
        console.log(`  Created ${memberships} memberships...`);
      }
    }
    
    await client.query('COMMIT');
    console.log(`  ✓ ${memberships} user-cohort memberships created`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed some posts for activity
 */
async function seedPosts() {
  console.log('Seeding posts...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Get user-cohort relationships
    const membershipsResult = await client.query(
      'SELECT user_id, cohort_id FROM user_cohorts LIMIT 500'
    );
    
    let posts = 0;
    
    for (const membership of membershipsResult.rows) {
      // Create 0-3 posts per member
      const numPosts = faker.number.int({ min: 0, max: 3 });
      
      for (let i = 0; i < numPosts; i++) {
        const content = faker.lorem.paragraphs(faker.number.int({ min: 1, max: 5 }));
        const depthScore = Math.min(content.length, 1000); // Longer = deeper
        
        await client.query(
          `INSERT INTO posts (user_id, cohort_id, content, depth_score, metadata)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            membership.user_id,
            membership.cohort_id,
            content,
            depthScore,
            JSON.stringify({
              type: faker.helpers.arrayElement(['discussion', 'question', 'resource', 'reflection']),
              tags: faker.helpers.arrayElements(INTEREST_CATEGORIES, faker.number.int({ min: 1, max: 3 }))
            })
          ]
        );
        posts++;
      }
    }
    
    await client.query('COMMIT');
    console.log(`  ✓ ${posts} posts created`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Seed ad payout queue
 */
async function seedPayoutQueue() {
  console.log('Seeding ad payout queue...');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const usersResult = await client.query('SELECT id FROM users LIMIT 200');
    
    for (const user of usersResult.rows) {
      const amount = faker.number.int({ min: 100, max: 10000 }); // $1.00 - $100.00 in cents
      
      await client.query(
        `INSERT INTO ad_payout_queue (user_id, amount_cents, status)
         VALUES ($1, $2, $3)`,
        [user.id, amount, faker.helpers.arrayElement(['pending', 'pending', 'pending', 'completed'])]
      );
    }
    
    await client.query('COMMIT');
    console.log('  ✓ 200 ad payout queue entries created');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main seed function
 */
async function seed() {
  console.log('\n🌱 Swaynix Database Seeder\n');
  
  try {
    await seedUsers();
    await seedCohorts();
    await seedUserCohorts();
    await seedPosts();
    await seedPayoutQueue();
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\nSummary:');
    console.log('  - 1,000 users with randomized JSONB profiles');
    console.log('  - 10 cohorts with metadata');
    console.log('  - User-cohort memberships with engagement scores');
    console.log('  - Posts with depth scoring');
    console.log('  - Ad payout queue for worker testing');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
