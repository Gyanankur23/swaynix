/**
 * Content Moderation Module for Swaynix (TypeScript)
 * Use this in React components to validate posts/messages before submission.
 */

export type ViolationCategory = 
  | "hate_speech" 
  | "harassment" 
  | "profanity" 
  | "discrimination" 
  | "threats" 
  | "self_harm";

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
  category?: ViolationCategory;
  message: string;
  blockedWord?: string;
  suggestion?: string;
}

// Hate speech patterns (case-insensitive regex)
const HARMFUL_PATTERNS: Record<ViolationCategory, RegExp[]> = {
  hate_speech: [
    /\bhate\b/i, /\bkill\b/i, /\bdie\b/i, /\bdeath\b/i,
    /\bviolence\b/i, /\battack\b/i, /\bdestroy\b/i,
    /\bracist\b/i, /\bracism\b/i, /\bnazi\b/i, /\bhitler\b/i,
    /\bterrorist\b/i, /\bterrorism\b/i, /\bbomb\b/i,
  ],
  harassment: [
    /\bstupid\b/i, /\bidiot\b/i, /\bmoron\b/i, /\bdumb\b/i,
    /\bretard\b/i, /\bretarded\b/i, /\bfool\b/i,
    /\bshut\s*up\b/i, /\bget\s*lost\b/i, /\bgo\s*away\b/i,
    /\bharrass\b/i, /\bbully\b/i, /\btorture\b/i,
  ],
  profanity: [
    /\bf\s*[*\u00b7]*\s*u\s*[*\u00b7]*\s*c\s*[*\u00b7]*\s*k\b/i,
    /\bs\s*h\s*[*\u00b7]*\s*i\s*t\b/i, /\ba\s*s\s*s\b/i,
    /\bb\s*i\s*t\s*c\s*h\b/i, /\bb\s*a\s*s\s*t\s*a\s*r\s*d\b/i,
    /\bd\s*a\s*m\s*n\b/i, /\bh\s*e\s*l\s*l\b/i,
  ],
  discrimination: [
    /\bs\s*l\s*u\s*r\b/i, /\bh\s*o\s*m\s*o\b/i,
    /\bf\s*a\s*g\b/i, /\bn\s*i\s*g\b/i, /\bc\s*h\s*i\s*n\s*k\b/i,
    /\bk\s*y\s*k\b/i, /\bw\s*h\s*o\s*r\s*e\b/i,
    /\bs\s*h\s*e\s*m\s*a\s*l\s*e\b/i, /\bt\s*r\s*a\s*n\s*n\s*y\b/i,
  ],
  threats: [
    /\bwill\s+kill\b/i, /\bgoing\s+to\s+kill\b/i,
    /\bshould\s+die\b/i, /\bdeserve\s+to\s+die\b/i,
    /\bhurt\s+you\b/i, /\bcome\s+for\s+you\b/i,
    /\bwatch\s+your\s+back\b/i, /\bremember\s+this\b/i,
  ],
  self_harm: [
    /\bsuicide\b/i, /\bkill\s+myself\b/i, /\bend\s+it\s+all\b/i,
    /\bcut\s+myself\b/i, /\bhurt\s+myself\b/i,
    /\bwant\s+to\s+die\b/i, /\bbetter\s+off\s+dead\b/i,
  ],
};

const ERROR_MESSAGES: Record<ViolationCategory, string> = {
  hate_speech: "Your message contains hate speech which violates our community guidelines.",
  harassment: "Harassment and insults are not allowed in our community.",
  profanity: "Please keep your language clean and respectful.",
  discrimination: "Discriminatory language is not tolerated here.",
  threats: "Threats of violence are strictly prohibited.",
  self_harm: "If you're struggling, please reach out for help. This type of content is not allowed.",
};

/**
 * Validates content for harmful language
 */
export function validateContent(text: string): {
  isValid: boolean;
  category?: ViolationCategory;
  blockedWord?: string;
} {
  if (!text || typeof text !== "string") {
    return { isValid: true };
  }

  const normalizedText = text.replace(/\s+/g, " ").trim();

  for (const [category, patterns] of Object.entries(HARMFUL_PATTERNS)) {
    for (const pattern of patterns) {
      const match = normalizedText.match(pattern);
      if (match) {
        return {
          isValid: false,
          category: category as ViolationCategory,
          blockedWord: match[0],
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Moderates a post (title + content)
 */
export function moderatePost(title: string, content: string): ModerationResult {
  // Check title
  const titleCheck = validateContent(title);
  if (!titleCheck.isValid) {
    return {
      allowed: false,
      reason: "title_violation",
      category: titleCheck.category,
      blockedWord: titleCheck.blockedWord,
      message: `⚠️ ${ERROR_MESSAGES[titleCheck.category!]}`,
      suggestion: "Please revise your post title to remove inappropriate language.",
    };
  }

  // Check content
  const contentCheck = validateContent(content);
  if (!contentCheck.isValid) {
    return {
      allowed: false,
      reason: "content_violation",
      category: contentCheck.category,
      blockedWord: contentCheck.blockedWord,
      message: `⚠️ ${ERROR_MESSAGES[contentCheck.category!]}`,
      suggestion: "Please revise your post content to remove inappropriate language.",
    };
  }

  return {
    allowed: true,
    message: "Content approved",
  };
}

/**
 * Moderates a chat message
 */
export function moderateMessage(messageText: string): ModerationResult {
  const check = validateContent(messageText);

  if (!check.isValid) {
    return {
      allowed: false,
      reason: "message_violation",
      category: check.category,
      blockedWord: check.blockedWord,
      message: `⚠️ ${ERROR_MESSAGES[check.category!]}`,
      suggestion: "Please revise your message.",
    };
  }

  return {
    allowed: true,
    message: "Message approved",
  };
}

/**
 * React Hook for content moderation
 * Usage in components:
 * const { validatePost, error, clearError } = useContentModeration();
 */
export function useContentModeration() {
  return {
    validatePost: moderatePost,
    validateMessage: moderateMessage,
    validateContent,
  };
}
