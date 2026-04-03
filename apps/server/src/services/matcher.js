/**
 * Matcher Service
 * Uses raw SQL with JSONB containment operators for sub-millisecond cohort matching
 */

class MatcherService {
  constructor(pool) {
    this.pool = pool;
  }

  /**
   * Match users to cohorts based on overlapping JSONB interest keys
   * Uses @> (contains) and && (overlap) operators with GIN indexes
   * 
   * @param {string} userId - The user ID to match
   * @param {number} limit - Maximum cohorts to return
   * @returns {Promise<Array>} - Matching cohorts with match scores
   */
  async matchUserToCohorts(userId, limit = 10) {
    const query = `
      WITH user_interests AS (
        SELECT jsonb_object_keys(profile_data->'interests') as interest
        FROM users 
        WHERE id = $1
      ),
      matching_cohorts AS (
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.description,
          c.metadata,
          c.member_count,
          -- Calculate match score based on overlapping topics
          (
            SELECT COUNT(*)::float 
            FROM user_interests ui 
            WHERE c.metadata->'tags' ? ui.interest
          ) as match_score,
          -- Get the matching topics
          (
            SELECT jsonb_agg(ui.interest)
            FROM user_interests ui 
            WHERE c.metadata->'tags' ? ui.interest
          ) as matching_topics
        FROM cohorts c
        WHERE EXISTS (
          SELECT 1 FROM user_interests ui
          WHERE c.metadata->'tags' ? ui.interest
        )
        -- Exclude cohorts user already joined
        AND NOT EXISTS (
          SELECT 1 FROM user_cohorts uc 
          WHERE uc.user_id = $1 AND uc.cohort_id = c.id
        )
      )
      SELECT 
        id,
        name,
        slug,
        description,
        metadata,
        member_count,
        match_score,
        matching_topics,
        -- Rank by match score and engagement potential
        ROW_NUMBER() OVER (
          ORDER BY match_score DESC, member_count DESC
        ) as recommendation_rank
      FROM matching_cohorts
      ORDER BY match_score DESC, member_count DESC
      LIMIT $2
    `;

    const { rows } = await this.pool.query(query, [userId, limit]);
    return rows;
  }

  /**
   * Find cohorts by exact metadata containment
   * Uses GIN index for sub-millisecond @> queries
   * 
   * @param {Object} criteria - JSONB criteria to match against cohort metadata
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>} - Matching cohorts
   */
  async findCohortsByMetadata(criteria, limit = 20) {
    const query = `
      SELECT 
        id,
        name,
        slug,
        description,
        metadata,
        member_count,
        created_at
      FROM cohorts
      WHERE metadata @> $1::jsonb
      ORDER BY member_count DESC, created_at DESC
      LIMIT $2
    `;

    const { rows } = await this.pool.query(query, [JSON.stringify(criteria), limit]);
    return rows;
  }

  /**
   * Match multiple users by shared interests (for cohort suggestions)
   * Uses JSONB overlap operator && for interest matching
   * 
   * @param {string[]} userIds - Array of user IDs
   * @returns {Promise<Array>} - Users with shared interests
   */
  async findUsersWithSharedInterests(userIds) {
    const query = `
      WITH user_profiles AS (
        SELECT 
          id,
          username,
          profile_data->'interests' as interests,
          jsonb_object_keys(profile_data->'interests') as interest_key
        FROM users
        WHERE id = ANY($1::uuid[])
      )
      SELECT 
        up1.id as user_id_1,
        up2.id as user_id_2,
        up1.username as user_1,
        up2.username as user_2,
        jsonb_agg(DISTINCT up1.interest_key) as shared_interests
      FROM user_profiles up1
      JOIN user_profiles up2 ON up1.interest_key = up2.interest_key AND up1.id < up2.id
      GROUP BY up1.id, up2.id, up1.username, up2.username
      HAVING COUNT(*) >= 2  -- At least 2 shared interests
      ORDER BY COUNT(*) DESC
    `;

    const { rows } = await this.pool.query(query, [userIds]);
    return rows;
  }

  /**
   * Discover cohorts by partial interest match
   * Allows flexible discovery even with partial profile data
   * 
   * @param {string[]} interests - Array of interest keys
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>} - Matching cohorts
   */
  async discoverByInterests(interests, limit = 15) {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.metadata,
        c.member_count,
        -- Count of matching interests
        (
          SELECT COUNT(*)::int
          FROM jsonb_array_elements_text(c.metadata->'tags') tag
          WHERE tag = ANY($1)
        ) as interest_overlap_count
      FROM cohorts c
      WHERE metadata->'tags' ?| $1
      ORDER BY interest_overlap_count DESC, member_count DESC
      LIMIT $2
    `;

    const { rows } = await this.pool.query(query, [interests, limit]);
    return rows;
  }

  /**
   * Get trending cohorts based on recent activity and engagement
   * 
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>} - Trending cohorts
   */
  async getTrendingCohorts(limit = 10) {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.metadata,
        c.member_count,
        c.last_activity_at,
        COUNT(DISTINCT p.id) as recent_posts,
        COUNT(DISTINCT uc.user_id) as active_members
      FROM cohorts c
      LEFT JOIN posts p ON p.cohort_id = c.id AND p.created_at > NOW() - INTERVAL '7 days'
      LEFT JOIN user_cohorts uc ON uc.cohort_id = c.id AND uc.meaningful_interactions > 0
      GROUP BY c.id, c.name, c.slug, c.description, c.metadata, c.member_count, c.last_activity_at
      ORDER BY recent_posts DESC, active_members DESC
      LIMIT $1
    `;

    const { rows } = await this.pool.query(query, [limit]);
    return rows;
  }
}

module.exports = { MatcherService };
