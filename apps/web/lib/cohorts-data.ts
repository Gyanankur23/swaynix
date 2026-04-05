import { cohortCoverImage } from "@/lib/cohort-images";

/** Explore grid + cohort detail header — covers are domain-specific Unsplash art via cohortCoverImage. */
const COHORTS_BASE = [
  { id: "travel-india", name: "Travel India", category: "travel", members: 45600, color: "#FF6B9D", description: "Discover hidden gems across India" },
  { id: "code-mumbai", name: "Code Mumbai", category: "coding", members: 12300, color: "#00D4FF", description: "Mumbai's developer community" },
  { id: "bollywood-beats", name: "Bollywood Beats", category: "music", members: 78900, color: "#9D4EDD", description: "Desi music lovers unite" },
  { id: "dance-bhangra", name: "Bhangra & Dance", category: "dance", members: 23400, color: "#FF006E", description: "Punjabi beats and moves" },
  { id: "foodie-delhi", name: "Delhi Foodies", category: "cooking", members: 56700, color: "#FB8500", description: "Street food to fine dining" },
  { id: "shutterbugs", name: "Indian Shutterbugs", category: "photography", members: 18900, color: "#38B000", description: "Capture India's beauty" },
  { id: "cricket-fans", name: "Cricket Fans India", category: "sports", members: 89000, color: "#1D4ED8", description: "Bleed blue! Cricket discussions" },
  { id: "startup-hub", name: "Startup Hub", category: "startups", members: 15600, color: "#00F5FF", description: "Founders & innovators" },
  { id: "yoga-wellness", name: "Yoga & Wellness", category: "fitness", members: 34500, color: "#06FFB4", description: "Mind, body & soul" },
  { id: "art-culture", name: "Art & Culture", category: "art", members: 12300, color: "#C77DFF", description: "Traditional to contemporary" },
  { id: "cinema-club", name: "Cinema Club", category: "movies", members: 45600, color: "#E63946", description: "Bollywood to Hollywood" },
  { id: "book-worms", name: "Book Worms", category: "reading", members: 9800, color: "#F4A261", description: "Reading circles & discussions" },
  { id: "game-on", name: "Game On", category: "gaming", members: 67800, color: "#7209B7", description: "Esports & casual gaming" },
  { id: "fashion-desi", name: "Desi Fashion", category: "fashion", members: 34500, color: "#EC4899", description: "Ethnic to modern Indian fashion" },
  { id: "pets-india", name: "Pet Parents India", category: "pets", members: 12300, color: "#10B981", description: "Dogs, cats & desi pets" },
  { id: "career-growth", name: "Career Growth", category: "career", members: 56700, color: "#6366F1", description: "Jobs, skills & mentorship" },
  { id: "sustainability", name: "Green India", category: "eco", members: 8900, color: "#059669", description: "Sustainable living & climate action" },
  { id: "finance-tips", name: "Finance & Investing", category: "finance", members: 123400, color: "#F59E0B", description: "Stocks, crypto & savings" },
  { id: "parenting-india", name: "Indian Parents", category: "parenting", members: 45600, color: "#8B5CF6", description: "Parenting tips & support" },
  { id: "home-decor", name: "Home Decor India", category: "home", members: 23400, color: "#D946EF", description: "Interior design & DIY" },
  { id: "language-learn", name: "Language Learners", category: "travel", members: 12300, color: "#3B82F6", description: "Hindi, regional & foreign languages" },
  { id: "mental-health", name: "Mental Wellness", category: "fitness", members: 34500, color: "#14B8A6", description: "Mental health support & awareness" },
] as const;

export type CohortBase = (typeof COHORTS_BASE)[number];

export const EXPLORE_COHORTS = COHORTS_BASE.map((c) => ({
  ...c,
  image: cohortCoverImage(c.id),
}));

const CATEGORY_ICONS: Record<string, string> = {
  travel: "✈️",
  coding: "💻",
  music: "🎵",
  dance: "💃",
  cooking: "🍳",
  photography: "📸",
  fitness: "🧘",
  art: "🎨",
  movies: "🎬",
  reading: "📚",
  gaming: "🎮",
  startups: "🚀",
  sports: "🏏",
  fashion: "👗",
  pets: "🐕",
  career: "💼",
  eco: "🌱",
  finance: "💰",
  parenting: "👶",
  home: "🏠",
};

export function cohortIconFor(id: string, category: string): string {
  if (id === "mental-health") return "🧠";
  return CATEGORY_ICONS[category] ?? "🌟";
}

/** Default detail row for any hub id (merged under richer manual entries on the cohort page). */
export function defaultCohortDetail(c: CohortBase & { image: string }) {
  return {
    id: c.id,
    name: c.name,
    slug: c.id,
    description: c.description,
    member_count: c.members,
    color: c.color,
    icon: cohortIconFor(c.id, c.category),
    image: c.image,
    tags: ["Community", "India", c.name.split(" ")[0] ?? "Hub"],
    location: "India",
    admins: ["Community Team"],
  };
}

export function exploreCohortById(id: string) {
  return EXPLORE_COHORTS.find((c) => c.id === id);
}
