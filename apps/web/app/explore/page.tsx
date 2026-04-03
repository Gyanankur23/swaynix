"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LocationMap } from "@/components/location-map";
import {
  Search, Sparkles, Users, TrendingUp, MessageSquare,
  Heart, MapPin, Compass, Flame, Crown, Check
} from "lucide-react";
import Link from "next/link";

// 20+ Interest categories
const CATEGORIES = [
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
  { id: "environment", label: "Green Living", icon: "🌱", color: "#059669", posts: 1234 },
  { id: "finance", label: "Finance & Money", icon: "💰", color: "#F59E0B", posts: 4567 },
  { id: "parenting", label: "Parenting", icon: "👶", color: "#8B5CF6", posts: 2345 },
  { id: "lifestyle", label: "Lifestyle", icon: "🏠", color: "#D946EF", posts: 1890 },
];

// Cohorts with Indian themes - 20+ diverse communities
const COHORTS = [
  { id: "travel-india", name: "Travel India", category: "travel", members: 45600, color: "#FF6B9D", description: "Discover hidden gems across India", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400" },
  { id: "code-mumbai", name: "Code Mumbai", category: "coding", members: 12300, color: "#00D4FF", description: "Mumbai's developer community", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400" },
  { id: "bollywood-beats", name: "Bollywood Beats", category: "music", members: 78900, color: "#9D4EDD", description: "Desi music lovers unite", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400" },
  { id: "dance-bhangra", name: "Bhangra & Dance", category: "dance", members: 23400, color: "#FF006E", description: "Punjabi beats and moves", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400" },
  { id: "foodie-delhi", name: "Delhi Foodies", category: "cooking", members: 56700, color: "#FB8500", description: "Street food to fine dining", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
  { id: "shutterbugs", name: "Indian Shutterbugs", category: "photography", members: 18900, color: "#38B000", description: "Capture India's beauty", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400" },
  { id: "yoga-wellness", name: "Yoga & Wellness", category: "fitness", members: 34500, color: "#06FFB4", description: "Mind, body & soul", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400" },
  { id: "art-culture", name: "Art & Culture", category: "art", members: 12300, color: "#C77DFF", description: "Traditional to contemporary", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400" },
  { id: "cinema-club", name: "Cinema Club", category: "movies", members: 45600, color: "#E63946", description: "Bollywood to Hollywood", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
  { id: "book-worms", name: "Book Worms", category: "reading", members: 23400, color: "#F4A261", description: "Reading circles & discussions", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
  { id: "game-on", name: "Game On", category: "gaming", members: 56700, color: "#7209B7", description: "Esports & casual gaming", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400" },
  { id: "startup-hub", name: "Startup Hub", category: "startups", members: 12300, color: "#00F5FF", description: "Founders & innovators", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400" },
  // New communities
  { id: "cricket-fans", name: "Cricket Fans India", category: "sports", members: 89000, color: "#1D4ED8", description: "Bleed blue! Cricket discussions", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400" },
  { id: "fashion-desi", name: "Desi Fashion", category: "fashion", members: 34500, color: "#EC4899", description: "Ethnic to modern Indian fashion", image: "https://images.unsplash.com/photo-1583391733950-3bd0a0bd955e?w=400" },
  { id: "pets-india", name: "Pet Parents India", category: "pets", members: 27800, color: "#10B981", description: "Dogs, cats & desi pets", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400" },
  { id: "career-growth", name: "Career Growth", category: "career", members: 45600, color: "#6366F1", description: "Jobs, skills & mentorship", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400" },
  { id: "sustainability", name: "Green India", category: "environment", members: 18900, color: "#059669", description: "Sustainable living & climate action", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400" },
  { id: "finance-tips", name: "Finance & Investing", category: "finance", members: 52300, color: "#F59E0B", description: "Stocks, crypto & savings", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400" },
  { id: "parenting-india", name: "Indian Parents", category: "parenting", members: 41200, color: "#8B5CF6", description: "Parenting tips & support", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400" },
  { id: "home-decor", name: "Home Decor India", category: "lifestyle", members: 29800, color: "#D946EF", description: "Interior design & DIY", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400" },
  { id: "language-learn", name: "Language Learners", category: "education", members: 15600, color: "#3B82F6", description: "Hindi, regional & foreign languages", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400" },
  { id: "mental-health", name: "Mental Wellness", category: "health", members: 23400, color: "#14B8A6", description: "Mental health support & awareness", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400" },
];

// Indian users
const TRENDING_USERS = [
  { name: "Priya Sharma", handle: "priya_travels", category: "travel", avatar: "PS", color: "#FF6B9D" },
  { name: "Rohan Gupta", handle: "rohan_codes", category: "coding", avatar: "RG", color: "#00D4FF" },
  { name: "Ananya Singh", handle: "ananya_dances", category: "dance", avatar: "AS", color: "#FF006E" },
  { name: "Vikram Reddy", handle: "vikram_cooks", category: "cooking", avatar: "VR", color: "#FB8500" },
  { name: "Neha Kumar", handle: "neha_shots", category: "photography", avatar: "NK", color: "#38B000" },
];

// Community discussions
const DISCUSSIONS = [
  {
    id: 1,
    title: "Best monsoon destinations in India?",
    author: "Arjun Mehta",
    category: "travel",
    replies: 24,
    likes: 156,
    preview: "Planning a trip this July. Thinking about Munnar or Coorg...",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Remote work cafes in Bangalore",
    author: "Sanya Patel",
    category: "coding",
    replies: 18,
    likes: 89,
    preview: "Looking for good WiFi and coffee. Any recommendations?",
    time: "4 hours ago",
  },
  {
    id: 3,
    title: "Learning Kathak as an adult - tips?",
    author: "Divya Nair",
    category: "dance",
    replies: 32,
    likes: 234,
    preview: "Started classes last month. Any advice for footwork?",
    time: "6 hours ago",
  },
  {
    id: 4,
    title: "Authentic Hyderabadi Biryani recipe",
    author: "Karthik Iyer",
    category: "cooking",
    replies: 45,
    likes: 567,
    preview: "Grandma's secret recipe with that perfect aroma...",
    time: "8 hours ago",
  },
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [joinedCohorts, setJoinedCohorts] = useState<Set<string>>(new Set());

  // Load joined cohorts from "backend" (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("joined_communities");
    if (saved) {
      setJoinedCohorts(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleJoin = (cohortId: string) => {
    setJoinedCohorts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cohortId)) {
        newSet.delete(cohortId);
      } else {
        newSet.add(cohortId);
      }
      // Save to "backend"
      localStorage.setItem("joined_communities", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">Communities</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Discover 12+ interest groups across India</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search communities, topics, or people..."
              className="pl-12 h-14 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-lg"
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" /> Search
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { id: "discover", label: "Discover", icon: Compass },
            { id: "categories", label: "Categories", icon: Search },
            { id: "nearby", label: "Nearby", icon: MapPin },
            { id: "discussions", label: "Discussions", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "discover" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" /> Featured Communities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {COHORTS.map((cohort, idx) => (
                  <Link key={cohort.id} href={`/cohort/${cohort.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="group cursor-pointer"
                    >
                      <Card className="overflow-hidden bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-all">
                        <div className="h-32 relative overflow-hidden">
                          <img src={cohort.image} alt={cohort.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <span className="text-3xl">{CATEGORIES.find(c => c.id === cohort.category)?.icon}</span>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-slate-900 dark:text-white">{cohort.name}</h3>
                          <p className="text-gray-500 text-sm line-clamp-1">{cohort.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Users className="w-4 h-4" /> {(cohort.members / 1000).toFixed(1)}K
                            </span>
                            <Button 
                            size="sm" 
                            className="rounded-full transition-all"
                            style={{ 
                              backgroundColor: joinedCohorts.has(cohort.id) ? "#10B981" : cohort.color 
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleJoin(cohort.id);
                            }}
                          >
                            {joinedCohorts.has(cohort.id) ? (
                              <><Check className="w-4 h-4 mr-1" /> Joined</>
                            ) : (
                              "Join"
                            )}
                          </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" /> Trending Creators
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {TRENDING_USERS.map((user, idx) => (
                  <motion.div key={user.handle} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="flex-shrink-0">
                    <Card className="w-48 bg-white dark:bg-slate-800 border-0 shadow-lg">
                      <CardContent className="p-4 text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-3" style={{ backgroundColor: user.color + "30" }}>
                          <AvatarFallback style={{ backgroundColor: user.color, color: "white" }} className="font-bold text-xl">{user.avatar}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-slate-900 dark:text-white">{user.name}</h3>
                        <p className="text-gray-500 text-sm">@{user.handle}</p>
                        <Badge className="mt-2" style={{ backgroundColor: user.color + "20", color: user.color, borderColor: user.color }}>
                          {CATEGORIES.find(c => c.id === user.category)?.label}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all ${selectedCategory === cat.id ? "ring-2 ring-offset-2 ring-offset-slate-950 ring-white" : ""}`}
                style={{ background: `linear-gradient(135deg, ${cat.color}20, ${cat.color}05)`, borderColor: selectedCategory === cat.id ? cat.color : "transparent", borderWidth: "2px" }}
              >
                <span className="text-4xl mb-3 block">{cat.icon}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cat.label}</h3>
                <p className="text-gray-500 text-sm">{cat.posts.toLocaleString()} posts</p>
              </motion.button>
            ))}
          </div>
        )}

        {activeTab === "nearby" && <LocationMap />}

        {activeTab === "discussions" && (
          <div className="space-y-4">
            {DISCUSSIONS.map((discussion) => (
              <Card key={discussion.id} className="bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                        {discussion.author.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge style={{ backgroundColor: CATEGORIES.find(c => c.id === discussion.category)?.color + "20", color: CATEGORIES.find(c => c.id === discussion.category)?.color }}>
                          {CATEGORIES.find(c => c.id === discussion.category)?.icon} {CATEGORIES.find(c => c.id === discussion.category)?.label}
                        </Badge>
                        <span className="text-gray-500 text-sm">{discussion.time}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{discussion.title}</h3>
                      <p className="text-gray-500 mt-1">{discussion.preview}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {discussion.replies} replies</span>
                        <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {discussion.likes} likes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
