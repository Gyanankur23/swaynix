/** Lightweight public profiles for Explore / Nearby / profile-by-handle (client-side demo data). */
export type PublicProfile = {
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  city: string;
  interests: string[];
};

const PROFILES: PublicProfile[] = [
  {
    handle: "priya_travels",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    bio: "Weekend backpacker · Kerala monsoon chaser · Always planning the next hill station.",
    city: "Bangalore · ~2 km",
    interests: ["Travel", "Photography", "Food"],
  },
  {
    handle: "rohan_codes",
    name: "Rohan Gupta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    bio: "Full-stack dev · React & Node · Mumbai meetups every month.",
    city: "Mumbai · ~1 km",
    interests: ["Coding", "Startups", "Open source"],
  },
  {
    handle: "ananya_dances",
    name: "Ananya Singh",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80",
    bio: "Contemporary + Bollywood fusion · Teaching weekend batches.",
    city: "Delhi NCR · ~4 km",
    interests: ["Dance", "Fitness", "Music"],
  },
  {
    handle: "aarav_mumbai",
    name: "Aarav Patel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    bio: "Film & OTT threads · Coffee shop regular in Bandra.",
    city: "Mumbai · ~800 m",
    interests: ["Movies", "Music", "Writing"],
  },
  {
    handle: "kavya_reads",
    name: "Kavya Iyer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286ad2?w=200&auto=format&fit=crop&q=80",
    bio: "Book clubs · Regional lit in translation · Chennai.",
    city: "Chennai · ~3 km",
    interests: ["Reading", "Art", "Coffee"],
  },
  {
    handle: "vikram_fin",
    name: "Vikram Desai",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    bio: "Index funds & tax planning · No hype, just spreadsheets.",
    city: "Hyderabad · ~5 km",
    interests: ["Finance", "Career", "Cricket"],
  },
  {
    handle: "meera_yoga",
    name: "Meera Nambiar",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    bio: "Yoga instructor · Mental wellness advocate · Small group sessions.",
    city: "Bangalore · ~6 km",
    interests: ["Yoga", "Wellness", "Parenting"],
  },
  {
    handle: "sidd_pets",
    name: "Siddharth Rao",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    bio: "Two indies and a foster · Adoption drives every quarter.",
    city: "Pune · ~2 km",
    interests: ["Pets", "Volunteering", "Home decor"],
  },
  {
    handle: "tara_startup",
    name: "Tara Khanna",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    bio: "B2B SaaS founder · Hiring designers & PMs.",
    city: "Bangalore · ~3 km",
    interests: ["Startups", "Product", "Networking"],
  },
  {
    handle: "rahul_cricket",
    name: "Rahul Menon",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    bio: "Club cricket · IPL fantasy (for fun) · Match threads.",
    city: "Kochi · ~7 km",
    interests: ["Cricket", "Sports", "Travel"],
  },
];

const BY_HANDLE = Object.fromEntries(PROFILES.map((p) => [p.handle.toLowerCase(), p]));

export function getPublicProfile(handle: string): PublicProfile | undefined {
  return BY_HANDLE[handle.toLowerCase()];
}

export function listNearbyPeople(): PublicProfile[] {
  return [...PROFILES];
}
