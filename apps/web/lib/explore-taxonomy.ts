/** Top-level interest tiles on Explore → each links to `/explore/categories/[id]` for sub-niches. */
export const EXPLORE_PARENT_CATEGORIES = [
  { id: "travel", label: "Travel & Explore", icon: "✈️", color: "#FF6B9D", posts: 1234 },
  { id: "coding", label: "Coding & Tech", icon: "💻", color: "#00D4FF", posts: 5678 },
  { id: "music", label: "Music & Beats", icon: "🎵", color: "#9D4EDD", posts: 3456 },
  { id: "dance", label: "Dance & Perform", icon: "💃", color: "#FF006E", posts: 2345 },
  { id: "cooking", label: "Cooking & Food", icon: "🍳", color: "#FB8500", posts: 4567 },
  { id: "photography", label: "Photography", icon: "📸", color: "#38B000", posts: 1890 },
  { id: "fitness", label: "Fitness & Yoga", icon: "🧘", color: "#06FFB4", posts: 2341 },
  { id: "art", label: "Art & Design", icon: "🎨", color: "#C77DFF", posts: 1234 },
  { id: "movies", label: "Movies & Cinema", icon: "🎬", color: "#E63946", posts: 3456 },
  { id: "reading", label: "Books & Reading", icon: "📚", color: "#F4A261", posts: 1876 },
  { id: "gaming", label: "Gaming & Esports", icon: "🎮", color: "#7209B7", posts: 2987 },
  { id: "startups", label: "Startups & Biz", icon: "🚀", color: "#00F5FF", posts: 1456 },
  { id: "sports", label: "Sports & Cricket", icon: "🏏", color: "#1D4ED8", posts: 5678 },
  { id: "fashion", label: "Fashion & Style", icon: "👗", color: "#EC4899", posts: 2345 },
  { id: "pets", label: "Pets & Animals", icon: "🐕", color: "#10B981", posts: 1890 },
  { id: "career", label: "Career & Jobs", icon: "💼", color: "#6366F1", posts: 3456 },
  { id: "eco", label: "Sustainability", icon: "🌱", color: "#059669", posts: 1123 },
  { id: "finance", label: "Finance & Stocks", icon: "💰", color: "#F59E0B", posts: 2234 },
  { id: "parenting", label: "Parenting India", icon: "👶", color: "#8B5CF6", posts: 3345 },
  { id: "home", label: "Home & Decor", icon: "🏠", color: "#D946EF", posts: 4456 },
] as const;

export type ParentCategoryId = (typeof EXPLORE_PARENT_CATEGORIES)[number]["id"];

export type CategorySubniche = {
  slug: string;
  title: string;
  description: string;
  /** Hub ids in `EXPLORE_COHORTS` to join or browse for this niche */
  cohortIds: string[];
};

/** More specific picks under each parent category */
export const CATEGORY_SUBNICHES: Record<ParentCategoryId, CategorySubniche[]> = {
  travel: [
    { slug: "weekend-monsoon", title: "Weekend & monsoon trips", description: "Short breaks, rains, and quick escapes across states.", cohortIds: ["travel-india"] },
    { slug: "hidden-gems", title: "Hidden gems & slow travel", description: "Offbeat towns, homestays, and local experiences.", cohortIds: ["travel-india"] },
    { slug: "languages-travel", title: "Language for travellers", description: "Pick up Hindi, regional phrases, or prep for abroad.", cohortIds: ["language-learn", "travel-india"] },
  ],
  coding: [
    { slug: "web-mobile", title: "Web & mobile engineering", description: "React, Next.js, native apps, and shipping to prod.", cohortIds: ["code-mumbai"] },
    { slug: "meetups-oss", title: "Meetups & open source", description: "City meetups, PRs, and collaboration.", cohortIds: ["code-mumbai"] },
    { slug: "tech-career", title: "Breaking into tech", description: "Interviews, system design, and mentorship.", cohortIds: ["code-mumbai", "career-growth"] },
  ],
  music: [
    { slug: "bollywood-film", title: "Bollywood & film music", description: "Soundtracks, classics, and new releases.", cohortIds: ["bollywood-beats"] },
    { slug: "live-gigs", title: "Gigs & festivals", description: "Where to go, who’s playing, and setlists.", cohortIds: ["bollywood-beats"] },
    { slug: "indie-fusion", title: "Indie & fusion", description: "Artists blending Indian roots with global sounds.", cohortIds: ["bollywood-beats"] },
  ],
  dance: [
    { slug: "bhangra-folk", title: "Bhangra & folk", description: "Punjabi beats, steps, and culture.", cohortIds: ["dance-bhangra"] },
    { slug: "choreo-contemporary", title: "Choreo & contemporary", description: "Studios, covers, and collabs.", cohortIds: ["dance-bhangra"] },
    { slug: "dance-fitness", title: "Dance fitness", description: "Zumba, cardio dance, and fun workouts.", cohortIds: ["dance-bhangra", "yoga-wellness"] },
  ],
  cooking: [
    { slug: "street-fine", title: "Street food to fine dining", description: "Reviews, recs, and hidden stalls.", cohortIds: ["foodie-delhi"] },
    { slug: "home-kitchen", title: "Home kitchen", description: "Recipes, meal prep, and regional cooking.", cohortIds: ["foodie-delhi"] },
    { slug: "baking-dessert", title: "Baking & desserts", description: "Cakes, mithai experiments, and cafes.", cohortIds: ["foodie-delhi"] },
  ],
  photography: [
    { slug: "landscape-street", title: "Landscape & street", description: "India through your lens—cities and vistas.", cohortIds: ["shutterbugs"] },
    { slug: "portrait-mobile", title: "Portrait & mobile", description: "Phoneography and people shoots.", cohortIds: ["shutterbugs"] },
    { slug: "photo-walks", title: "Photo walks", description: "Meet others and shoot together.", cohortIds: ["shutterbugs", "travel-india"] },
  ],
  fitness: [
    { slug: "yoga-ayurveda", title: "Yoga & Ayurveda", description: "Asanas, breathwork, and holistic habits.", cohortIds: ["yoga-wellness"] },
    { slug: "mind-wellbeing", title: "Mind & emotional wellbeing", description: "Support, journaling, and balance.", cohortIds: ["mental-health", "yoga-wellness"] },
    { slug: "strength-cardio", title: "Strength & cardio", description: "Gyms, runs, and training tips.", cohortIds: ["yoga-wellness"] },
  ],
  art: [
    { slug: "gallery-museum", title: "Galleries & museums", description: "Exhibitions and cultural spaces.", cohortIds: ["art-culture"] },
    { slug: "digital-studio", title: "Digital & studio practice", description: "Illustration, sculpture, and process.", cohortIds: ["art-culture"] },
    { slug: "heritage-craft", title: "Heritage crafts", description: "Traditional art forms and makers.", cohortIds: ["art-culture"] },
  ],
  movies: [
    { slug: "bollywood-hollywood", title: "Bollywood & world cinema", description: "Reviews, debates, and watchlists.", cohortIds: ["cinema-club"] },
    { slug: "ott-series", title: "OTT & series", description: "What to binge this week.", cohortIds: ["cinema-club"] },
    { slug: "indie-docs", title: "Indie & documentaries", description: "Festivals and hidden films.", cohortIds: ["cinema-club"] },
  ],
  reading: [
    { slug: "fiction-bookclubs", title: "Fiction & book clubs", description: "Novels, circles, and read-alongs.", cohortIds: ["book-worms"] },
    { slug: "nonfiction-career", title: "Non-fiction & skills", description: "Biographies, productivity, and learning.", cohortIds: ["book-worms", "career-growth"] },
    { slug: "regional-lit", title: "Regional literature", description: "Indian languages and translations.", cohortIds: ["book-worms"] },
  ],
  gaming: [
    { slug: "esports-competitive", title: "Esports & competitive", description: "Tournaments, teams, and ranked play.", cohortIds: ["game-on"] },
    { slug: "casual-mobile", title: "Casual & mobile", description: "Co-op, party games, and wind-downs.", cohortIds: ["game-on"] },
    { slug: "indie-streaming", title: "Indie & streaming", description: "Small studios and creators.", cohortIds: ["game-on"] },
  ],
  startups: [
    { slug: "founders-idea", title: "Founders & ideation", description: "Validation, MVPs, and early users.", cohortIds: ["startup-hub"] },
    { slug: "fundraising-growth", title: "Fundraising & growth", description: "Pitching, metrics, and scale.", cohortIds: ["startup-hub", "finance-tips"] },
    { slug: "hiring-culture", title: "Hiring & culture", description: "Building teams that last.", cohortIds: ["startup-hub", "career-growth"] },
  ],
  sports: [
    { slug: "cricket-india", title: "Cricket India", description: "Tests, IPL, and gully cricket stories.", cohortIds: ["cricket-fans"] },
    { slug: "football-others", title: "Football & more", description: "Global leagues and Indian athletes.", cohortIds: ["cricket-fans"] },
    { slug: "fitness-sports", title: "Fitness crossover", description: "Training for your sport.", cohortIds: ["cricket-fans", "yoga-wellness"] },
  ],
  fashion: [
    { slug: "ethnic-wedding", title: "Ethnic & wedding", description: "Lehengas, sarees, and celebrations.", cohortIds: ["fashion-desi"] },
    { slug: "street-contemporary", title: "Street & contemporary", description: "Urban fits and brands.", cohortIds: ["fashion-desi"] },
    { slug: "sustainable-style", title: "Sustainable style", description: "Slow fashion and swaps.", cohortIds: ["fashion-desi", "sustainability"] },
  ],
  pets: [
    { slug: "dogs-cats", title: "Dogs & cats", description: "Training, food, and vets.", cohortIds: ["pets-india"] },
    { slug: "indie-pets", title: "Indie & community animals", description: "Feeders, adoption, and care.", cohortIds: ["pets-india"] },
    { slug: "pet-travel", title: "Travel with pets", description: "Trips and pet-friendly spots.", cohortIds: ["pets-india", "travel-india"] },
  ],
  career: [
    { slug: "jobs-switch", title: "Jobs & switching", description: "Offers, notice periods, and negotiation.", cohortIds: ["career-growth"] },
    { slug: "skills-learning", title: "Skills & learning", description: "Courses, certs, and side projects.", cohortIds: ["career-growth", "book-worms"] },
    { slug: "mentorship-network", title: "Mentorship & network", description: "Coffee chats and referrals.", cohortIds: ["career-growth"] },
  ],
  eco: [
    { slug: "climate-action", title: "Climate action", description: "Policy, volunteering, and awareness.", cohortIds: ["sustainability"] },
    { slug: "zero-waste", title: "Zero waste & home", description: "Reduce, reuse in daily life.", cohortIds: ["sustainability", "home-decor"] },
    { slug: "green-travel", title: "Green travel", description: "Low-impact trips.", cohortIds: ["sustainability", "travel-india"] },
  ],
  finance: [
    { slug: "stocks-mf", title: "Stocks & mutual funds", description: "Long-term investing basics.", cohortIds: ["finance-tips"] },
    { slug: "crypto-alts", title: "Crypto & alternatives", description: "Risk, regulation, and research.", cohortIds: ["finance-tips"] },
    { slug: "personal-finance", title: "Personal finance", description: "Budgeting, tax, and savings.", cohortIds: ["finance-tips"] },
  ],
  parenting: [
    { slug: "early-years", title: "Early years", description: "Toddlers, routines, and health.", cohortIds: ["parenting-india"] },
    { slug: "school-teens", title: "School & teens", description: "Boards, hobbies, and screen time.", cohortIds: ["parenting-india"] },
    { slug: "parent-community", title: "Parent support circles", description: "Share wins and ask for help.", cohortIds: ["parenting-india"] },
  ],
  home: [
    { slug: "interior-reno", title: "Interiors & renovation", description: "Layouts, paint, and furniture.", cohortIds: ["home-decor"] },
    { slug: "diy-decor", title: "DIY decor", description: "Budget upgrades and crafts.", cohortIds: ["home-decor"] },
    { slug: "plants-lighting", title: "Plants & lighting", description: "Make a space feel alive.", cohortIds: ["home-decor", "sustainability"] },
  ],
};

export function getParentCategory(id: string) {
  return EXPLORE_PARENT_CATEGORIES.find((c) => c.id === id);
}
