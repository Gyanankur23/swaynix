"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Users, Clock, Zap, Target
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
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likes, setLikes] = useState(post.engagement.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-900">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.author.handle}`}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-amber-500">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold">
                      {post.author.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/profile/${post.author.handle}`}>
                    <span className="font-bold text-slate-900 dark:text-white hover:underline">
                      {post.author.name}
                    </span>
                  </Link>
                  <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs">
                    Lvl {post.author.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
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
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed">
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
          <div className="p-4 border-t dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked 
                      ? "text-rose-500" 
                      : "text-slate-500 hover:text-rose-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                  <span className="font-medium">{likes.toLocaleString()}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.engagement.comments}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">{post.engagement.shares}</span>
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`transition-colors ${
                  isSaved 
                    ? "text-amber-500" 
                    : "text-slate-500 hover:text-amber-500"
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
