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
  
  // Use local state if set, otherwise check auth context
  const isLiked = localLiked !== null ? localLiked : hasLikedPost(post.id);
  const isShared = localShared !== null ? localShared : hasSharedPost(post.id);
  
  // Calculate display counts (add 1 if user has liked/shared)
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-card">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.author.handle}`}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-offset-background ring-amber-500">
                    {post.author.avatar ? (
                      <AvatarImage src={post.author.avatar} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                        {post.author.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </motion.div>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${post.author.handle}`}>
                    <span className="font-bold text-foreground hover:underline">
                      {post.author.name}
                    </span>
                  </Link>
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs">
                    Lvl {post.author.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>@{post.author.handle}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                className="text-white border-0"
                style={{ backgroundColor: post.cohort.color }}
              >
                {post.cohort.name}
              </Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-foreground text-lg leading-relaxed">
              {post.content}
            </p>
          </div>

          {/* Image */}
          {post.image && (
            <div className="relative overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                src={post.image}
                alt="Post content"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Engagement Bar */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  disabled={!user}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked 
                      ? "text-rose-500" 
                      : "text-muted-foreground hover:text-rose-500"
                  } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span className="font-medium">{displayLikes.toLocaleString()}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.engagement.comments}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  disabled={!user || isShared}
                  className={`flex items-center gap-2 transition-colors ${
                    isShared 
                      ? "text-green-500" 
                      : "text-muted-foreground hover:text-green-500"
                  } ${!user || isShared ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isShared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                  <span className="font-medium">{displayShares.toLocaleString()}</span>
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`transition-colors ${
                  isSaved 
                    ? "text-amber-500" 
                    : "text-muted-foreground hover:text-amber-500"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
