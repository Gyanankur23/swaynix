"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { SocialCohortCard } from "./social-cohort-card";
import { PostCard } from "./post-card";
import { ImageGallery, MasonryGallery } from "./image-gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, SlidersHorizontal, TrendingUp, Sparkles, 
  Compass, Hash, Users, Zap, Flame, Star, Filter,
  ChevronDown, MapPin, Globe, Briefcase, Image as ImageIcon
} from "lucide-react";

const categories = [
  { name: "All Hubs", icon: Globe, count: 1240 },
  { name: "Technology", icon: Zap, count: 342 },
  { name: "Creative", icon: Sparkles, count: 189 },
  { name: "Business", icon: Briefcase, count: 156 },
  { name: "Lifestyle", icon: Users, count: 267 },
  { name: "Learning", icon: Star, count: 198 },
];

const trendingTags = [
  "AI_Horizon", "Web3_Pulse", "Human_Design", "Strategy", "Growth", 
  "Deep_Tech", "Community_Core", "Indian_Innovators"
];

const mockCohorts = [
  {
    id: "1",
    name: "Tech Enthusiasts",
    description: "A community for passionate technologists to discuss the latest innovations, share insights, and collaborate on projects.",
    memberCount: 15234,
    postCount: 4567,
    growthRate: 23,
    tags: ["Technology", "Innovation", "Programming"],
    color: "#F97316",
    isTrending: true,
    matchScore: 95,
    topContributors: [
      { initials: "JD", level: 8 },
      { initials: "SC", level: 12 },
      { initials: "AR", level: 6 },
    ],
  },
  {
    id: "2",
    name: "AI Innovation",
    description: "Exploring the frontiers of artificial intelligence, machine learning, and their impact on society.",
    memberCount: 8934,
    postCount: 2341,
    growthRate: 45,
    tags: ["AI", "Machine Learning", "Future Tech"],
    color: "#F97316",
    isTrending: true,
    isNew: true,
    matchScore: 88,
    topContributors: [
      { initials: "MP", level: 15 },
      { initials: "TK", level: 9 },
    ],
  },
  {
    id: "3",
    name: "Design Systems",
    description: "Building scalable, consistent, and beautiful design systems for modern applications.",
    memberCount: 5678,
    postCount: 1234,
    growthRate: 12,
    tags: ["Design", "UI/UX", "Frontend"],
    color: "#F97316",
    matchScore: 82,
    topContributors: [
      { initials: "LM", level: 11 },
      { initials: "JC", level: 7 },
    ],
  },
];

const mockPosts = [
  {
    id: "1",
    author: {
      name: "Alex Rivera",
      handle: "arivera",
      level: 12,
    },
    cohort: {
      name: "AI Innovation",
      color: "#F97316",
    },
    content: "Just published a deep dive on GPT-5's reasoning capabilities. The improvements in chain-of-thought are remarkable. Thread below 🧵👇",
    engagement: {
      likes: 1247,
      comments: 234,
      shares: 89,
    },
    timestamp: "3h ago",
  },
];

export function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All Hubs");
  const [viewMode, setViewMode] = useState<"cohorts" | "posts" | "images">("cohorts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 font-jakarta">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
             <Badge className="bg-primary/30 text-foreground border-primary/20 font-black italic text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Global Discovery Hub</Badge>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic text-foreground tracking-tighter leading-none mb-4">
            Discover Your
            <span className="text-primary italic"> Hubs</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-medium italic">
            Explore community sectors based on your human signals. Find your people, share your passion, grow the intensity.
          </p>
        </motion.div>

        {/* Search & Filters - Light Horizon Edition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-8 bg-white/40 backdrop-blur-md rounded-[3rem] border border-primary/10 shadow-premium"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                <Input
                type="text"
                placeholder="Sector scan active..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 py-8 text-xl rounded-[2rem] border-primary/5 bg-white shadow-inner focus:shadow-2xl focus:border-primary/30 transition-all font-black italic tracking-tight"
              />
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-16 px-8 rounded-[2rem] border-primary/10 bg-white hover:bg-primary/5 font-black italic"
              >
                <SlidersHorizontal className="w-5 h-5 mr-3 text-primary" />
                Filters
                <ChevronDown className={`w-5 h-5 ml-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </Button>
              
              <div className="flex bg-white/60 p-2 rounded-[2rem] border border-primary/5 shadow-sm">
                <Button
                  variant={viewMode === "cohorts" ? "default" : "ghost"}
                  onClick={() => setViewMode("cohorts")}
                  className={`rounded-[1.5rem] px-6 font-black italic h-12 transition-all ${viewMode === 'cohorts' ? 'bg-swaynix-gradient text-foreground border border-black/5 shadow-lg' : 'text-muted-foreground'}`}
                >
                  <Compass className="w-5 h-5 mr-2" />
                  Hubs
                </Button>
                <Button
                  variant={viewMode === "posts" ? "default" : "ghost"}
                  onClick={() => setViewMode("posts")}
                  className={`rounded-[1.5rem] px-6 font-black italic h-12 transition-all ${viewMode === 'posts' ? 'bg-swaynix-gradient text-foreground border border-black/5 shadow-lg' : 'text-muted-foreground'}`}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Signals
                </Button>
                <Button
                  variant={viewMode === "images" ? "default" : "ghost"}
                  onClick={() => setViewMode("images")}
                  className={`rounded-[1.5rem] px-6 font-black italic h-12 transition-all ${viewMode === 'images' ? 'bg-swaynix-gradient text-foreground border border-black/5 shadow-lg' : 'text-muted-foreground'}`}
                >
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Vision
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories - Premium Scroller */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.name;
            return (
              <motion.button
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] whitespace-nowrap transition-all font-black italic shadow-premium ${
                  isActive
                    ? "bg-swaynix-gradient text-foreground border border-black/5"
                    : "bg-white text-muted-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{category.name}</span>
                <Badge className={`ml-2 font-black italic ${isActive ? "bg-white/30 text-foreground" : "bg-primary/10 text-primary"}`}>{category.count}</Badge>
              </motion.button>
            );
          })}
        </div>

        {/* Trending Tags - High Intensity */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Flame className="w-6 h-6 text-primary" />
            <span className="font-black italic text-xl text-foreground uppercase tracking-tighter">
              Active Sync Signals
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {trendingTags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
                className="px-6 py-3 rounded-full bg-white border border-primary/5 text-foreground text-sm font-black italic hover:border-primary/30 hover:shadow-xl hover:translate-y-[-2px] transition-all shadow-sm"
              >
                <Hash className="w-4 h-4 inline mr-2 text-primary" />
                {tag}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-16">
          {viewMode === "cohorts" ? (
            <>
              {/* Featured Section */}
              <div className="space-y-8">
                 <div className="flex items-center gap-4">
                    <Star className="w-8 h-8 text-primary" />
                    <h2 className="text-4xl font-black italic tracking-tighter text-foreground leading-none">Primary Identity Sync</h2>
                 </div>
                 <SocialCohortCard cohort={mockCohorts[0]} variant="featured" />
              </div>

              {/* Grid Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-3xl font-black italic tracking-tighter text-foreground leading-none">Global Hub Matrix</h2>
                  <Badge className="bg-primary/10 text-primary border-none font-black italic px-4 py-1.5 rounded-full">{mockCohorts.length} Sectors Detected</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mockCohorts.map((cohort, index) => (
                    <motion.div
                      key={cohort.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <SocialCohortCard cohort={cohort} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8 py-10">
               <div className="text-center space-y-4">
                  <h2 className="text-5xl font-black italic text-foreground tracking-tighter">Signal Stream</h2>
                  <p className="text-muted-foreground font-medium italic">Synchronizing real-time community pulses across the hub.</p>
               </div>
               {mockPosts.map((post) => (
                 <PostCard key={post.id} post={post} />
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
