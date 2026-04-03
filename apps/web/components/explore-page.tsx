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
  { name: "All", icon: Globe, count: 1240 },
  { name: "Technology", icon: Zap, count: 342 },
  { name: "Creative", icon: Sparkles, count: 189 },
  { name: "Business", icon: Briefcase, count: 156 },
  { name: "Lifestyle", icon: Users, count: 267 },
  { name: "Learning", icon: Star, count: 198 },
];

const trendingTags = [
  "AI", "Web3", "Design", "Marketing", "Startup", 
  "Productivity", "MentalHealth", "Sustainability"
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
    color: "#3B82F6",
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
    color: "#8B5CF6",
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
    color: "#EC4899",
    matchScore: 82,
    topContributors: [
      { initials: "LM", level: 11 },
      { initials: "JC", level: 7 },
    ],
  },
  {
    id: "4",
    name: "Web3 Builders",
    description: "Decentralized web enthusiasts building the future of the internet with blockchain and crypto.",
    memberCount: 4567,
    postCount: 987,
    growthRate: 34,
    tags: ["Web3", "Blockchain", "Crypto"],
    color: "#10B981",
    isNew: true,
    matchScore: 75,
    topContributors: [
      { initials: "RW", level: 13 },
      { initials: "ND", level: 8 },
    ],
  },
  {
    id: "5",
    name: "Product Minds",
    description: "Product managers, designers, and developers shaping the future of digital products.",
    memberCount: 12345,
    postCount: 3456,
    growthRate: 18,
    tags: ["Product", "Strategy", "Leadership"],
    color: "#F59E0B",
    matchScore: 71,
    topContributors: [
      { initials: "EP", level: 14 },
      { initials: "SK", level: 10 },
    ],
  },
  {
    id: "6",
    name: "Indie Hackers",
    description: "Solo founders and indie makers building profitable businesses without VC funding.",
    memberCount: 7890,
    postCount: 2134,
    growthRate: 28,
    tags: ["Entrepreneurship", "SaaS", "Bootstrapping"],
    color: "#EF4444",
    isTrending: true,
    matchScore: 68,
    topContributors: [
      { initials: "PB", level: 16 },
      { initials: "AM", level: 9 },
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
      color: "#8B5CF6",
    },
    content: "Just published a deep dive on GPT-5's reasoning capabilities. The improvements in chain-of-thought are remarkable. Thread below 🧵👇",
    engagement: {
      likes: 1247,
      comments: 234,
      shares: 89,
    },
    timestamp: "3h ago",
  },
  {
    id: "2",
    author: {
      name: "Sarah Chen",
      handle: "schen",
      level: 8,
    },
    cohort: {
      name: "Tech Enthusiasts",
      color: "#3B82F6",
    },
    content: "The new React Server Components pattern is changing how we think about data fetching. Here's what I've learned building with it for 6 months...",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    engagement: {
      likes: 892,
      comments: 156,
      shares: 67,
    },
    timestamp: "5h ago",
  },
];

export function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"cohorts" | "posts" | "images">("cohorts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Discover Your
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              {" "}Community
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
            Explore cohorts based on your interests. Find your people, share your passion, grow together.
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search cohorts, topics, or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="py-6 px-6 rounded-xl"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <Button
                variant={viewMode === "cohorts" ? "default" : "ghost"}
                onClick={() => setViewMode("cohorts")}
                className="rounded-lg"
              >
                <Compass className="w-4 h-4 mr-2" />
                Cohorts
              </Button>
              <Button
                variant={viewMode === "posts" ? "default" : "ghost"}
                onClick={() => setViewMode("posts")}
                className="rounded-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Posts
              </Button>
              <Button
                variant={viewMode === "images" ? "default" : "ghost"}
                onClick={() => setViewMode("images")}
                className="rounded-lg"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </Button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {["Relevance", "Trending", "Newest", "Most Active"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort" className="accent-amber-500" />
                        <span className="text-slate-600 dark:text-slate-400">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    Member Count
                  </h3>
                  <div className="space-y-2">
                    {["Any size", "1-100 members", "100-1K members", "1K-10K members", "10K+ members"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="size" className="accent-amber-500" />
                        <span className="text-slate-600 dark:text-slate-400">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                    Activity Level
                  </h3>
                  <div className="space-y-2">
                    {["Any activity", "Very Active", "Active", "Moderate"].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="activity" className="accent-amber-500" />
                        <span className="text-slate-600 dark:text-slate-400">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;
              return (
                <motion.button
                  key={category.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                  <Badge 
                    variant={isActive ? "secondary" : "outline"}
                    className={`ml-1 ${isActive ? "bg-white/20 text-white" : ""}`}
                  >
                    {category.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Trending Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Trending Topics
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm hover:border-amber-500 hover:text-amber-600 transition-colors"
              >
                <Hash className="w-3 h-3 inline mr-1" />
                {tag}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {viewMode === "cohorts" ? (
            <>
              {/* Featured Cohort */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500" />
                  Featured for You
                </h2>
                <SocialCohortCard cohort={mockCohorts[0]} variant="featured" />
              </div>

              {/* Cohorts Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {activeCategory === "All" ? "All Cohorts" : `${activeCategory} Cohorts`}
                  </h2>
                  <Badge variant="outline" className="text-slate-500">
                    {mockCohorts.length} results
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCohorts.map((cohort, index) => (
                    <motion.div
                      key={cohort.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <SocialCohortCard cohort={cohort} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : viewMode === "posts" ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Trending Posts
              </h2>
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-amber-500" />
                  Community Gallery
                </h2>
                <Badge variant="outline" className="text-slate-500">
                  Random feeds from Picsum
                </Badge>
              </div>
              <MasonryGallery count={24} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
