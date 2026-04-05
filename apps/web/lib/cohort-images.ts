/**
 * Domain-specific hub cover art (Unsplash).
 * Uses fit=max + width only (fixed h+crop was breaking a few assets in the browser).
 */
const u = (photoPath: string) =>
  `https://images.unsplash.com/${photoPath}?w=1200&auto=format&fit=max&q=85`;

/** Curated thematic image per cohort slug (Explore + cohort header). */
export const COHORT_COVER_URLS: Record<string, string> = {
  "travel-india": u("photo-1476514525535-07fb3b4ae5f1"),
  "code-mumbai": u("photo-1498050108023-c5249f4df085"),
  /* Music / instruments (replaces concert photo that failed to load for some clients). */
  "bollywood-beats": u("photo-1511379938547-c1f69419868d"),
  "dance-bhangra": u("photo-1504609773096-104ff2c73ba4"),
  "foodie-delhi": u("photo-1563379091339-03b21ab4a4f8"),
  "shutterbugs": u("photo-1452587925148-ce544e77e70d"),
  "cricket-fans": u("photo-1531415074968-036ba1b575da"),
  "startup-hub": u("photo-1559136555-9303baea8ebd"),
  "yoga-wellness": u("photo-1544367567-0f2fcb009e0b"),
  /* Museum / gallery interior. */
  "art-culture": u("photo-1561214115-f2f134cc4912"),
  "cinema-club": u("photo-1485846234645-a62644f84728"),
  "book-worms": u("photo-1521587760476-6c12a4b040da"),
  "game-on": u("photo-1542751371-adc38448a05e"),
  "fashion-desi": u("photo-1490481651871-ab68de25d43d"),
  "pets-india": u("photo-1450778869180-41d0601e046e"),
  "career-growth": u("photo-1522071820081-009f0129c71c"),
  "sustainability": u("photo-1542601906990-b4d3fb778b09"),
  "finance-tips": u("photo-1611974789855-9c2a0a7236a3"),
  "parenting-india": u("photo-1491438590914-bc09fcaaf77a"),
  /* Bright living space (replaces previous home asset that 404’d / failed crop). */
  "home-decor": u("photo-1600210492486-724fe5c67fb0"),
  "language-learn": u("photo-1434030216411-0b793f4b4173"),
  "mental-health": u("photo-1506126613408-eca07ce68773"),
};

const DEFAULT_COMMUNITY_COVER = u("photo-1529156069898-49953e39b3ac");

export function cohortCoverImage(cohortId: string, _width = 800, _height = 480): string {
  return COHORT_COVER_URLS[cohortId] ?? DEFAULT_COMMUNITY_COVER;
}
