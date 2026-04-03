"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Users, Clock, Zap, Target, Sparkles,
  Hash, Flame, Star, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AdCard } from "./ad-card";

// Types for Anti-FOMO Feed
interface Post {
  id: string;
  type: "post";
  author: {
    id: string;
    name: string;
    handle: string;
    level: number;
    avatar?: string;
  };
  cohort: {
    id: string;
    name: string;
    color: string;
    slug: string;
  };
  content: string;
  image?: string;
  metadata: {
    tags: string[];
    technical_depth: "low" | "medium" | "high";
  };
  depthScore: number;
  createdAt: string;
  // Anti-FOMO: No public like/comment counts
  // Only show engagement to author
}

interface Ad {
  id: string;
  type: "ad";
  companyName: string;
  title: string;
  body: string;
  imageUrl?: string;
  ctaText: string;
  ctaUrl: string;
}

interface CohortRecommendation {
  id: string;
  type: "cohort";
  name: string;
  description: string;
  memberCount: number;
  matchScore: number;
  color: string;
  tags: string[];
}

type FeedItem = Post | Ad | CohortRecommendation;

interface AntiFomoFeedProps {
  userId: string;
  userInterests: string[];
}

// Mock data generator for development
function generateMockFeed(userInterests: string[]): FeedItem[] {
  const items: FeedItem[] = [];
  
  // Generate 15 posts with 1 ad every 5 posts
  for (let i = 0; i < 15; i++) {
    // Insert ad every 5th item
    if (i > 0 && i % 5 === 0) {
      items.push({
        id: `ad-${i}`,
        type: "ad",
        companyName: ["TechCorp AI", "DataScale", "Reactify Pro"][Math.floor(Math.random() * 3)],
        title: ["Scale Your AI Models", "Partition Tables at Scale", "Debug React Like a Pro"][Math.floor(Math.random() * 3)],
        body: "Enterprise-grade solutions for modern development teams.",
        imageUrl: `https://picsum.photos/seed/ad-${i}/400/200`,
        ctaText: "Learn More",
        ctaUrl: "#",
      });
    }
    
    // Add cohort recommendation every 7th item
    if (i === 7) {
      items.push({
        id: `cohort-rec-${i}`,
        type: "cohort",
        name: "Database Architects",
        description: "Advanced database design, partitioning strategies, and scaling techniques.",
        memberCount: 2340,
        matchScore: 94,
        color: "#3B82F6",
        tags: ["sql", "architecture", "scaling"],
      });
    }
    
    // Add post
    const topics = ["python", "react", "ai", "sql", "architecture", "scaling"];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    
    items.push({
      id: `post-${i}`,
      type: "post",
      author: {
        id: `user-${i}`,
        name: ["Alex Chen", "Jordan Smith", "Taylor Wong", "Morgan Lee"][Math.floor(Math.random() * 4)],
        handle: ["alexc", "jordans", "taylorw", "morganl"][Math.floor(Math.random() * 4)],
        level: Math.floor(Math.random() * 10) + 1,
      },
      cohort: {
        id: `cohort-${topic}`,
        name: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Enthusiasts`,
        color: ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"][Math.floor(Math.random() * 5)],
        slug: topic,
      },
      content: [
        "Just implemented a distributed caching layer with Redis Cluster. Latency dropped from 450ms to 12ms. The key insight: cache invalidation is harder than caching itself.",
        "The async/await pattern that saved our scraping infrastructure: semaphore-based concurrency limiting. 10 parallel requests, zero rate limits.",
        "After partitioning our 500M row events table by date ranges, query time dropped from 4.2s to 180ms. Your partition key MUST match your most common WHERE clause.",
        "Real-world RSC bundle size reduction: 247KB -> 89KB. The mental model shift: Data fetching happens ONCE on the server. No useEffect waterfall.",
        "QLoRA fine-tuning on RTX 4090 with 7B parameters. VRAM usage: 14GB -> 6GB. Same accuracy, consumer GPU accessible.",
      ][Math.floor(Math.random() * 5)],
      image: Math.random() > 0.5 ? `https://picsum.photos/seed/post-${i}/800/400` : undefined,
      metadata: {
        tags: [topic, "performance", "architecture"],
        technical_depth: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
      },
      depthScore: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
    });
  }
  
  return items;
}

// Post Card Component
function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showEngagementGlow, setShowEngagementGlow] = useState(false);

  const handleEngage = () => {
    setShowEngagementGlow(true);
    setTimeout(() => setShowEngagementGlow(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className="bg-gray-900 border-gray-800 overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-start gap-3">
            <Link href={`/profile/${post.author.handle}`}>
              <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-offset-gray-900 ring-[#00FF85]/30">
                <AvatarFallback className="bg-gradient-to-br from-[#00FF85]/20 to-[#00FF85]/5 text-[#00FF85] font-bold">
                  {post.author.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/profile/${post.author.handle}`}>
                  <span className="font-bold text-white hover:underline">
                    {post.author.name}
                  </span>
                </Link>
                <Badge className="bg-[#00FF85]/10 text-[#00FF85] border-[#00FF85]/30 text-xs">
                  Lvl {post.author.level}
                </Badge>
                <span className="text-gray-500 text-sm">@{post.author.handle}</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-500 text-sm">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <Link href={`/cohort/${post.cohort.slug}`}>
                <Badge 
                  className="mt-1 text-white border-0 hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: post.cohort.color }}
                >
                  {post.cohort.name}
                </Badge>
              </Link>
            </div>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {post.metadata.tags.map((tag) => (
                <span key={tag} className="text-[#00FF85]/60 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Image */}
          {post.image && (
            <div className="relative overflow-hidden">
              <img 
                src={post.image} 
                alt="Post content"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Engagement Bar - Anti-FOMO: No public counts */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Like - Anonymous, no count shown */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsLiked(!isLiked);
                    handleEngage();
                  }}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked ? "text-rose-500" : "text-gray-500 hover:text-rose-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span className="text-sm font-medium">{isLiked ? "Liked" : "Like"}</span>
                </motion.button>

                {/* Comment - No count shown publicly */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEngage}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#00FF85] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Reply</span>
                </motion.button>

                {/* Share */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </motion.button>
              </div>

              {/* Save */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`transition-colors ${
                  isSaved ? "text-[#00FF85]" : "text-gray-500 hover:text-[#00FF85]"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </motion.button>
            </div>
          </div>

          {/* Engagement Score Glow Effect */}
          <AnimatePresence>
            {showEngagementGlow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none border-2 border-[#00FF85] rounded-xl"
                style={{ boxShadow: "0 0 30px rgba(0,255,133,0.3)" }}
              />
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Cohort Recommendation Card
function CohortRecCard({ cohort }: { cohort: CohortRecommendation }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4"
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
          style={{ backgroundColor: cohort.color }}
        >
          {cohort.name.charAt(0)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold">{cohort.name}</span>
            <Badge className="bg-[#00FF85]/10 text-[#00FF85] text-xs">
              <Target className="w-3 h-3 mr-1" />
              {cohort.matchScore}% Match
            </Badge>
          </div>
          
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {cohort.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {cohort.memberCount.toLocaleString()} members
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 bg-[#00FF85] text-black hover:bg-[#00FF85]/90 font-bold"
            >
              Join Cohort
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-400">
              Skip
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Feed Component
export function AntiFomoFeed({ userId, userInterests }: AntiFomoFeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeedItems(generateMockFeed(userInterests));
      setIsLoading(false);
    }, 800);
  }, [userInterests]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-900 rounded-xl h-48 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Feed Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00FF85]" />
            Recommended For You
          </h2>
          <Badge variant="outline" className="border-[#00FF85]/30 text-[#00FF85]">
            Anti-FOMO Mode
          </Badge>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          Content ranked by relevance to your interests, not popularity
        </p>
      </div>

      {/* Feed Items */}
      <div className="space-y-4 p-4">
        <AnimatePresence mode="popLayout">
          {feedItems.map((item, index) => (
            <motion.div
              key={`${item.type}-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              {item.type === "post" && <PostCard post={item} />}
              {item.type === "ad" && <AdCard ad={item} />}
              {item.type === "cohort" && <CohortRecCard cohort={item} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      <div className="p-4 text-center">
        <Button variant="outline" className="border-gray-700 text-gray-400 hover:text-white">
          Load More
        </Button>
      </div>
    </div>
  );
}
