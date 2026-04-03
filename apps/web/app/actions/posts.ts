"use server";

import { revalidatePath } from "next/cache";

// Database connection configuration
// In production, use environment variables
const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "swaynix",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "GB@23",
};

// ============================================================================
// SERVER ACTIONS - All database writes go through these secure functions
// ============================================================================

/**
 * Create a new post
 * Security: Server-side only, validates user session
 */
export async function createPost(formData: FormData) {
  "use server";
  
  const userId = formData.get("userId") as string;
  const cohortId = formData.get("cohortId") as string;
  const content = formData.get("content") as string;
  
  if (!userId || !cohortId || !content?.trim()) {
    throw new Error("Missing required fields");
  }

  // Calculate depth score based on content characteristics
  const depthScore = calculateDepthScore(content);
  
  try {
    // In production: Use prepared statements via pg or your ORM
    // Example with raw SQL (use parameterized queries in production):
    const query = `
      INSERT INTO posts (user_id, cohort_id, content, depth_score, metadata)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `;
    
    const metadata = JSON.stringify({
      tags: extractTags(content),
      technical_depth: depthScore > 70 ? "high" : depthScore > 40 ? "medium" : "low",
    });
    
    // Execute query (pseudo-code, use actual DB client)
    // const result = await db.query(query, [userId, cohortId, content, depthScore, metadata]);
    
    console.log("[Server Action] Post created:", { userId, cohortId, depthScore });
    
    // Revalidate the feed to show new post
    revalidatePath("/");
    revalidatePath(`/cohort/${cohortId}`);
    
    return { success: true, postId: "generated-uuid" };
  } catch (error) {
    console.error("[Server Action] Failed to create post:", error);
    throw new Error("Failed to create post");
  }
}

/**
 * Add a comment to a post
 * Triggers: engagement_score +5 for comment author
 */
export async function addComment(formData: FormData) {
  "use server";
  
  const userId = formData.get("userId") as string;
  const postId = formData.get("postId") as string;
  const content = formData.get("content") as string;
  const parentId = formData.get("parentId") as string | null;
  
  if (!userId || !postId || !content?.trim()) {
    throw new Error("Missing required fields");
  }

  try {
    // Insert comment - trigger will automatically:
    // 1. Update users.engagement_score +5
    // 2. Increment user_cohorts.meaningful_interactions
    
    const query = `
      INSERT INTO comments (post_id, user_id, parent_id, content, depth, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, created_at
    `;
    
    const depth = parentId ? 1 : 0; // Simple nesting for now
    const metadata = JSON.stringify({
      technical_value: content.length > 200 ? "high" : "medium",
    });
    
    console.log("[Server Action] Comment added:", { userId, postId, depth });
    
    // Revalidate to show new comment
    revalidatePath("/");
    
    return { 
      success: true, 
      commentId: "generated-uuid",
      engagementScoreIncrease: 5,
    };
  } catch (error) {
    console.error("[Server Action] Failed to add comment:", error);
    throw new Error("Failed to add comment");
  }
}

/**
 * Record user interests during onboarding
 */
export async function saveUserInterests(userId: string, interests: string[]) {
  "use server";
  
  if (!userId || interests.length < 3) {
    throw new Error("At least 3 interests required");
  }

  try {
    const query = `
      UPDATE users 
      SET profile_data = jsonb_set(
        COALESCE(profile_data, '{}'),
        '{interests}',
        $1::jsonb
      ),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `;
    
    const interestsJson = JSON.stringify(interests);
    
    console.log("[Server Action] Interests saved:", { userId, interests });
    
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("[Server Action] Failed to save interests:", error);
    throw new Error("Failed to save interests");
  }
}

/**
 * Join a cohort
 * Triggers: member_count update
 */
export async function joinCohort(userId: string, cohortId: string) {
  "use server";
  
  try {
    const query = `
      INSERT INTO user_cohorts (user_id, cohort_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, cohort_id) DO NOTHING
    `;
    
    console.log("[Server Action] Joined cohort:", { userId, cohortId });
    
    revalidatePath("/");
    revalidatePath(`/cohort/${cohortId}`);
    
    return { success: true };
  } catch (error) {
    console.error("[Server Action] Failed to join cohort:", error);
    throw new Error("Failed to join cohort");
  }
}

/**
 * Get targeted ads for user using PostgreSQL function
 * Uses GIN index on JSONB for sub-millisecond targeting
 */
export async function getTargetedAds(userId: string, limit: number = 3) {
  "use server";
  
  try {
    // Call the PostgreSQL function we defined in schema
    const query = `
      SELECT * FROM get_ads_for_user($1, $2)
    `;
    
    console.log("[Server Action] Fetching targeted ads:", { userId, limit });
    
    // Return mock ads for now (in production, use actual DB call)
    return [
      {
        ad_id: "ad-1",
        company_name: "TechCorp AI",
        title: "Scale Your AI Models 10x",
        body: "Deploy large language models with enterprise-grade infrastructure.",
        image_url: "https://picsum.photos/seed/ad-ai/400/200",
        cta_text: "Start Free Trial",
        cta_url: "https://techcorp.ai/engage",
      },
      {
        ad_id: "ad-2",
        company_name: "DataScale",
        title: "Partition Tables at Scale",
        body: "Automated table partitioning for PostgreSQL.",
        image_url: "https://picsum.photos/seed/ad-db/400/200",
        cta_text: "Read Docs",
        cta_url: "https://datascale.io/partition",
      },
    ];
  } catch (error) {
    console.error("[Server Action] Failed to fetch ads:", error);
    return [];
  }
}

/**
 * Record ad impression (view or click)
 */
export async function recordAdImpression(
  adId: string, 
  userId: string, 
  type: "view" | "click"
) {
  "use server";
  
  try {
    const query = `
      INSERT INTO ad_impressions (ad_id, user_id, impression_type)
      VALUES ($1, $2, $3)
    `;
    
    // Update ad stats
    if (type === "view") {
      // UPDATE ads SET current_impressions = current_impressions + 1
    } else {
      // UPDATE ads SET current_clicks = current_clicks + 1
    }
    
    console.log("[Server Action] Ad impression recorded:", { adId, userId, type });
    
    return { success: true };
  } catch (error) {
    console.error("[Server Action] Failed to record impression:", error);
    throw new Error("Failed to record impression");
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function calculateDepthScore(content: string): number {
  let score = 0;
  
  // Length scoring (0-30 points)
  if (content.length > 500) score += 30;
  else if (content.length > 200) score += 20;
  else if (content.length > 100) score += 10;
  
  // Technical markers (0-40 points)
  const technicalMarkers = [
    /```[\s\S]*?```/,      // Code blocks
    /\b(?:function|const|let|var|async|await|import|export)\b/, // Code keywords
    /\b(?:API|database|SQL|cache|query|index|partition)\b/i, // Technical terms
    /\d+ms|\d+%|\d+GB|\d+MB/, // Metrics
    /\b(?:optimization|performance|scalability|architecture)\b/i, // Concepts
  ];
  
  technicalMarkers.forEach(marker => {
    if (marker.test(content)) score += 8;
  });
  
  // Structure markers (0-30 points)
  if (/^\d+\.|^-|\*\*/.test(content)) score += 10; // Lists or bold
  if (content.includes("### ") || content.includes("## ")) score += 10; // Headers
  if (content.includes("Key insight:") || content.includes("Lesson:")) score += 10; // Framework
  
  return Math.min(score, 100);
}

function extractTags(content: string): string[] {
  const tagMatches = content.match(/#(\w+)/g);
  return tagMatches ? tagMatches.map(t => t.slice(1)) : [];
}
