"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Users, Clock, Zap, Target, Sparkles,
  Hash, Flame, Star, ArrowRight, ShieldCheck, MapPin
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AdCard } from "./ad-card";

interface Post {
  id: string;
  type: "post";
  author: {
    id: string;
    name: string;
    handle: string;
    level: number;
    avatar: string;
  };
  cohort: {
    id: string;
    name: string;
    color: string;
    slug: string;
    icon: string;
  };
  content: string;
  image?: string;
  metadata: {
    tags: string[];
    technical_depth: "low" | "medium" | "high";
  };
  depthScore: number;
  createdAt: string;
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
  icon: string;
}

type FeedItem = Post | Ad | CohortRecommendation;

interface AntiFomoFeedProps {
  userId: string;
  userInterests: string[];
}

const HUMAN_IMAGES = [
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
  "https://images.unsplash.com/photo-1522071823991-b9671f9d6f8c?w=800",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
  "https://images.unsplash.com/photo-1573164773974-77e802a86036?w=800",
  "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=800",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200",
];

function generateMockFeed(userInterests: string[]): FeedItem[] {
  const items: FeedItem[] = [];
  const cohorts = [
    { name: "Travel India Hub", icon: "✈️", slug: "travel-india" },
    { name: "Code Mumbai Hub", icon: "💻", slug: "code-mumbai" },
    { name: "Bhangra Beats Hub", icon: "💃", slug: "dance-bhangra" },
    { name: "Delhi Foodies Hub", icon: "🍳", slug: "foodie-delhi" },
    { name: "Startup Founder Central", icon: "🚀", slug: "startup-hub" },
  ];

  for (let i = 0; i < 20; i++) {
    if (i > 0 && i % 4 === 0) {
      items.push({
        id: `ad-${i}`,
        type: "ad",
        companyName: ["Decathlon India", "Tata Digital", "Reliance Hub", "Zomato Gold"][Math.floor(Math.random() * 4)],
        title: ["Human Potential Unlocked", "Global Scaling Signal", "Direct Human Connection", "Authentic Flavor Streams"][Math.floor(Math.random() * 4)],
        body: "Experience the next evolution of human connectivity in the platform hub.",
        imageUrl: HUMAN_IMAGES[Math.floor(Math.random() * HUMAN_IMAGES.length)],
        ctaText: "Synchronize",
        ctaUrl: "#",
      });
    }

    if (i === 6) {
      items.push({
        id: `cohort-rec-${i}`,
        type: "cohort",
        name: "Sustainable Living India",
        description: "Join 4.2k citizens synchronizing on zero-waste living and organic farming signals.",
        memberCount: 4230,
        matchScore: 98,
        icon: "🌱",
        color: "#10B981",
        tags: ["eco", "organic", "future"],
      });
    }

    const cohort = cohorts[Math.floor(Math.random() * cohorts.length)];
    items.push({
      id: `post-${i}`,
      type: "post",
      author: {
        id: `user-${i}`,
        name: ["Gyanankur Baruah", "Aaditya Khanna", "Ishan Sharma", "Meera Nair", "Priya Sen"][Math.floor(Math.random() * 5)],
        handle: ["gyan_hub", "aaditya_signal", "ishan_pulse", "meera_live", "priya_discovery"][Math.floor(Math.random() * 5)],
        level: Math.floor(Math.random() * 20) + 5,
        avatar: AVATARS[i % AVATARS.length],
      },
      cohort: {
        id: `cohort-${cohort.slug}`,
        name: cohort.name,
        color: "#F97316",
        slug: cohort.slug,
        icon: cohort.icon,
      },
      content: [
        "Just reached the high-intensity phase of our scaling initiative. The human latency in our discovery feed has dropped significantly. Pure human connectivity! 🚀",
        "Exploring the hidden signal points in Himachal today. The energy here is unmatched by any bot-logic. Genuine human discovery at its peak! ⛰️",
        "Authentic flavor synchronization in Old Delhi today. No filters, just high-bandwidth human taste experiences. You MUST try the Chandni Chowk stream! 🍲",
        "Implementing a new governance protocol for our community hub. Focused on identity verification and signal integrity. The future follows human rules.",
        "Beautiful moment captured during our traditional dance sync. Every movement is a high-intensity signal of our shared culture. Stay synchronized! 💃",
      ][Math.floor(Math.random() * 5)],
      image: i % 1.2 === 0 ? HUMAN_IMAGES[i % HUMAN_IMAGES.length] : undefined, // ~80% images
      metadata: {
        tags: [cohort.slug, "human", "discovery"],
        technical_depth: "high",
      },
      depthScore: 85 + Math.floor(Math.random() * 15),
      createdAt: new Date(Date.now() - Math.random() * 100000000).toISOString(),
    });
  }
  return items;
}

function PostCard({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showEngagementGlow, setShowEngagementGlow] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative">
      <Card className="bg-white border-primary/5 overflow-hidden shadow-premium rounded-[3.5rem] hover:shadow-2xl transition-all group border-t-8 border-t-primary/5">
        <CardContent className="p-0">
          <div className="p-10 flex items-start gap-6">
            <Link href={`/profile`}>
              <Avatar className="w-18 h-18 border-4 border-white shadow-xl transition-transform group-hover:scale-105 active:scale-95">
                <AvatarImage src={post.author.avatar} className="object-cover" />
                <AvatarFallback className="bg-swaynix-gradient text-foreground font-black italic">
                   {post.author.name[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <Link href={`/profile`}>
                  <span className="font-black italic text-2xl text-foreground hover:text-primary transition-colors tracking-tighter leading-none">
                    {post.author.name}
                  </span>
                </Link>
                <Badge className="bg-primary/20 text-foreground border-none font-black italic text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full leading-none shadow-sm">
                   CITIZEN LVL {post.author.level}
                </Badge>
                <div className="w-full mt-2 flex items-center gap-3">
                   <span className="text-muted-foreground font-black italic text-[10px] uppercase tracking-widest opacity-60">SIGNAL: @{post.author.handle}</span>
                   <span className="text-muted-foreground/30 font-black italic text-sm">·</span>
                   <span className="text-muted-foreground font-black italic text-[10px] uppercase tracking-widest opacity-60">
                     {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                   </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[9px] font-black italic text-primary uppercase tracking-[0.2em] leading-none mb-1">INTENSITY</span>
                  <span className="text-foreground font-black italic text-lg leading-none">{post.depthScore}%</span>
               </div>
               <Button variant="ghost" size="icon" className="h-14 w-14 text-muted-foreground hover:bg-primary/5 rounded-2xl transition-all">
                 <MoreHorizontal className="w-8 h-8" />
               </Button>
            </div>
          </div>

          <div className="px-10 pb-8">
             <Link href={`/cohort/${post.cohort.slug}`}>
                <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/5 hover:bg-white hover:shadow-xl rounded-full border border-primary/5 transition-all mb-6 group/badge">
                   <div className="text-2xl transition-transform group-hover/badge:scale-125">{post.cohort.icon}</div>
                   <span className="font-black italic text-sm text-foreground uppercase tracking-widest leading-none">Synchronization Point: {post.cohort.name}</span>
                </div>
             </Link>
            <p className="text-foreground text-3xl font-black italic leading-[1.3] tracking-tighter">
              "{post.content}"
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {post.metadata.tags.map((tag) => (
                <span key={tag} className="px-4 py-1.5 bg-primary/5 rounded-full text-primary font-black italic text-[10px] uppercase tracking-widest flex items-center gap-2 border border-primary/5 shadow-sm">
                  <Hash className="w-3.5 h-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {post.image && (
            <div className="px-10 pb-10">
               <motion.div whileHover={{ scale: 1.01 }} className="relative overflow-hidden rounded-[3rem] shadow-premium border-8 border-white ring-1 ring-primary/5 lg:h-[500px]">
                <img src={post.image} alt="High Intensity Image Signal" className="w-full h-full object-cover" />
                <div className="absolute top-6 right-6 p-4 bg-white/40 backdrop-blur-3xl rounded-3xl border border-white/50 text-foreground font-black italic text-[10px] flex items-center gap-3 uppercase tracking-widest shadow-xl">
                   <MapPin className="w-4 h-4 text-primary" />
                   Location Sync Active
                </div>
              </motion.div>
            </div>
          )}

          <div className="p-8 bg-primary/[0.04] border-t border-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-10">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                onClick={() => { setIsLiked(!isLiked); setShowEngagementGlow(true); setTimeout(() => setShowEngagementGlow(false), 1000); }}
                className={`flex items-center gap-4 transition-all ${isLiked ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"}`}
              >
                <div className={`p-4 rounded-full transition-all ${isLiked ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-white shadow-premium"}`}>
                   <Heart className={`w-8 h-8 ${isLiked ? "fill-current" : ""}`} />
                </div>
                <span className="font-black italic text-xl tracking-tighter leading-none">{isLiked ? "Synchronized" : "Synchronize"}</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-all group"
              >
                <div className="p-4 bg-white rounded-full shadow-premium transition-all group-hover:shadow-xl">
                   <MessageCircle className="w-8 h-8" />
                </div>
                <span className="font-black italic text-xl tracking-tighter leading-none">Join Stream</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-all group"
              >
                <div className="p-4 bg-white rounded-full shadow-premium transition-all group-hover:shadow-xl">
                   <Share2 className="w-8 h-8" />
                </div>
                <span className="font-black italic text-xl tracking-tighter leading-none">Export Signal</span>
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSaved(!isSaved)}
              className={`transition-all p-5 rounded-2xl ${isSaved ? "bg-swaynix-gradient text-foreground shadow-2xl border border-black/5" : "bg-white text-muted-foreground hover:text-primary shadow-premium hover:shadow-xl border border-primary/5"}`}
            >
              <Bookmark className={`w-8 h-8 ${isSaved ? "fill-current" : ""}`} />
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CohortRecCard({ cohort }: { cohort: CohortRecommendation }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-t-8 border-t-primary border border-primary/5 rounded-[4rem] p-12 shadow-premium hover:shadow-2xl transition-all relative overflow-hidden group">
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="flex items-start gap-10 relative z-10">
        <div className="w-24 h-24 rounded-[2rem] bg-swaynix-gradient flex items-center justify-center text-foreground font-black italic text-5xl shrink-0 shadow-2xl border-4 border-white transition-transform group-hover:rotate-12">
          {cohort.icon}
        </div>
        <div className="flex-1 space-y-6">
          <div>
             <div className="flex items-center gap-4">
                <span className="text-5xl font-black italic text-foreground tracking-tighter leading-none">{cohort.name}</span>
                <Badge className="bg-primary/20 text-foreground border-none font-black italic text-[10px] uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-xl">REC: 100% MATCH</Badge>
             </div>
             <p className="text-muted-foreground font-black italic text-xs uppercase tracking-widest mt-4 opacity-40">COMMUNITY SYNCHRONIZATION POINT</p>
          </div>
          <p className="text-muted-foreground font-medium text-2xl leading-relaxed italic line-clamp-3">"{cohort.description}"</p>
          <div className="flex items-center gap-8 py-2">
             <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <span className="font-black italic text-2xl text-foreground tracking-tighter leading-none">{cohort.memberCount.toLocaleString()} <span className="text-muted-foreground opacity-40">Citizens</span></span>
             </div>
             <div className="w-1.5 h-1.5 bg-primary/20 rounded-full" />
             <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <span className="font-black italic text-2xl text-foreground tracking-tighter leading-none">{cohort.matchScore}% <span className="text-muted-foreground opacity-40">Signal Match</span></span>
             </div>
          </div>
          <div className="flex gap-6 pt-4">
            <Button className="flex-1 h-20 bg-swaynix-gradient text-foreground border border-black/5 font-black italic rounded-[2rem] shadow-2xl hover:translate-y-[-4px] transition-all text-2xl tracking-tighter group/btn">
               <Zap className="w-8 h-8 mr-4 group-hover/btn:animate-pulse" />
               Initialize Synchronization
            </Button>
            <Button variant="ghost" className="px-10 h-20 rounded-[2rem] text-muted-foreground font-black italic text-xl hover:bg-primary/5 transition-all">Dismiss Signal</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function AntiFomoFeed({ userId, userInterests }: AntiFomoFeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFeedItems(generateMockFeed(userInterests));
      setIsLoading(false);
    }, 1200);
  }, [userInterests]);

  if (isLoading) {
    return (
      <div className="space-y-12 p-10 max-w-5xl mx-auto">
        <div className="text-center py-20 space-y-6">
           <div className="w-20 h-20 bg-primary/10 rounded-full border border-primary/20 mx-auto animate-spin flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
           </div>
           <p className="text-2xl font-black italic text-primary animate-pulse tracking-tighter">Calibrating High-Intensity Signals...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-primary/[0.03] rounded-[4rem] h-[500px] animate-pulse border border-primary/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="pb-40 font-jakarta bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[1000px] bg-primary/[0.01] blur-[150px] rounded-full pointer-events-none" />
      
      {/* Stream Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-3xl border-b border-primary/10 px-12 py-10 shadow-premium relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-swaynix-gradient" />
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="space-y-2">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-swaynix-gradient rounded-2xl shadow-xl border border-black/5"><Sparkles className="w-8 h-8 text-foreground" /></div>
                <h2 className="text-5xl font-black italic text-foreground tracking-tighter leading-none">Universal <span className="text-primary italic">Signal</span> Stream</h2>
             </div>
             <p className="text-muted-foreground font-black italic text-xs uppercase tracking-[0.3em] opacity-40 ml-20">HUMAN RELEVANCE FILTER: ENGAGEMENT LOCKED</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end border-r border-primary/10 pr-8">
                <span className="text-[10px] font-black italic text-muted-foreground uppercase tracking-widest leading-none mb-2">CALIBRATION POINT</span>
                <span className="text-foreground font-black italic text-2xl leading-none">BOMBAY-DELHI-BLR</span>
             </div>
             <Badge className="bg-swaynix-gradient text-foreground border border-black/5 font-black italic text-xs uppercase tracking-widest px-8 py-4 rounded-[1.5rem] shadow-premium hover:scale-105 transition-all cursor-crosshair">
                ANTI-FOMO ACTIVE
             </Badge>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="space-y-16 p-10 md:p-12 max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="popLayout">
          {feedItems.map((item, index) => (
            <motion.div 
               key={`${item.type}-${item.id}`} 
               initial={{ opacity: 0, scale: 0.9, y: 100 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 0.9 }} 
               transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.1 }}
               layout
            >
              {item.type === "post" && <PostCard post={item} />}
              {item.type === "ad" && <AdCard ad={item} />}
              {item.type === "cohort" && <CohortRecCard cohort={item} />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Persistence Controls */}
      <div className="p-20 text-center relative z-10">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
           <Button className="h-24 px-20 bg-white border-2 border-primary/10 text-muted-foreground font-black italic text-3xl tracking-tighter hover:bg-primary/5 hover:text-primary transition-all rounded-[2.5rem] shadow-premium">
              <Zap className="w-10 h-10 mr-6" />
              Request High-Bandwidth Signals
           </Button>
        </motion.div>
        <p className="mt-8 text-muted-foreground font-black italic text-sm uppercase tracking-widest opacity-30">END OF CURRENT SIGNAL STREAM. RE-CALIBRATE TO CONTINUE.</p>
      </div>
    </div>
  );
}
