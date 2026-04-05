"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-context";
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Users, Clock, Zap, Target, Check
} from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    author: {
      name: string;
      handle: string;
      level: number;
      avatar?: string;
    };
    cohort: {
      name: string;
      color: string;
    };
    content: string;
    image?: string;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
    };
    timestamp: string;
    isLiked?: boolean;
    isSaved?: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const { 
    hasLikedPost, 
    hasSharedPost, 
    likePost, 
    sharePost,
    user 
  } = useAuth();
  
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [localLiked, setLocalLiked] = useState<boolean | null>(null);
  const [localShared, setLocalShared] = useState<boolean | null>(null);
  
  const isLiked = localLiked !== null ? localLiked : hasLikedPost(post.id);
  const isShared = localShared !== null ? localShared : hasSharedPost(post.id);
  
  const displayLikes = post.engagement.likes + (isLiked ? 1 : 0);
  const displayShares = post.engagement.shares + (isShared ? 1 : 0);

  const handleLike = () => {
    if (!user) return;
    setLocalLiked(!isLiked);
    likePost(post.id);
  };

  const handleShare = () => {
    if (!user || isShared) return;
    setLocalShared(true);
    sharePost(post.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", damping: 20 }}
      className="pb-4"
    >
      <Card className="overflow-hidden border border-primary/10 shadow-premium bg-white rounded-[2.5rem] hover:shadow-2xl transition-all group">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/profile/${post.author.handle}`}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Avatar className="w-14 h-14 border-4 border-white shadow-xl group-hover:rotate-6 transition-transform">
                    {post.author.avatar ? (
                      <AvatarImage src={post.author.avatar} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-swaynix-gradient text-foreground font-black italic">
                        {post.author.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </motion.div>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${post.author.handle}`}>
                    <span className="font-black italic text-xl text-foreground hover:text-primary transition-colors tracking-tight">
                      {post.author.name}
                    </span>
                  </Link>
                  <Badge className="bg-primary/30 text-foreground border-primary/20 font-black italic text-[9px] uppercase tracking-widest px-3 py-0.5 rounded-full">
                    Lvl {post.author.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mt-1">
                  <span>@{post.author.handle}</span>
                  <span className="opacity-30">•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                className="text-white border-0 font-black italic text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg"
                style={{ backgroundColor: post.cohort.color }}
              >
                {post.cohort.name}
              </Badge>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl hover:bg-primary/5 transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            <p className="text-foreground text-xl font-medium italic leading-relaxed tracking-tight group-hover:text-black transition-colors">
              {post.content}
            </p>
          </div>

          {/* Image */}
          {post.image && (
            <div className="px-6 pb-6">
              <div className="relative overflow-hidden rounded-[2rem] shadow-xl border border-black/5">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  src={post.image}
                  alt="Post content"
                  className="w-full h-72 md:h-[30rem] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
              </div>
            </div>
          )}

          {/* Engagement Bar */}
          <div className="px-6 py-4 bg-primary/[0.03] border-t border-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center gap-2 transition-all ${
                  isLiked 
                    ? "text-rose-500 scale-110" 
                    : "text-muted-foreground hover:text-rose-500"
                } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                <span className="font-black italic text-lg">{displayLikes.toLocaleString()}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.8 }}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="font-black italic text-lg">{post.engagement.comments}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleShare}
                disabled={!user || isShared}
                className={`flex items-center gap-2 transition-all ${
                  isShared 
                    ? "text-primary scale-110" 
                    : "text-muted-foreground hover:text-primary"
                } ${!user || isShared ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isShared ? <Check className="w-6 h-6 stroke-[3px]" /> : <Share2 className="w-6 h-6" />}
                <span className="font-black italic text-lg">{displayShares.toLocaleString()}</span>
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsSaved(!isSaved)}
              className={`transition-all p-2 rounded-xl hover:bg-white shadow-sm ${
                isSaved 
                  ? "text-amber-500 scale-110" 
                  : "text-muted-foreground hover:text-amber-500"
              }`}
            >
              <Bookmark className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
