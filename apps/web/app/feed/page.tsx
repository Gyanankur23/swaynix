"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Send, ShoppingBag, ExternalLink, Sparkles, Trash2
} from "lucide-react";
import { useAuth, Post, Ad } from "@/components/auth-context";
import Link from "next/link";

export default function FeedPage() {
  const { user, posts, ads, likePost } = useAuth();
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleLike = (id: string) => {
    likePost(id);
  };

  // Interleave ads with posts (every 3rd post is an ad)
  const feedItems: ({ type: "post"; data: Post; index: number } | { type: "ad"; data: Ad; index: number })[] = [];
  const postsArray = Array.from(posts);
  const adsArray = Array.from(ads);

  for (let i = 0; i < Math.max(postsArray.length, adsArray.length * 3); i++) {
    if (i > 0 && i % 3 === 0 && adsArray.length > 0) {
      const adIndex = Math.floor(i / 3) - 1;
      if (adIndex < adsArray.length) {
        feedItems.push({ type: "ad", data: adsArray[adIndex], index: i });
      }
    }
    if (i < postsArray.length) {
      feedItems.push({ type: "post", data: postsArray[i], index: i });
    }
  }

  return (
    <div className="min-h-screen bg-background pt-16 pb-24 lg:pb-8 lg:pl-72">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 z-30 bg-background/95 backdrop-blur-md py-4 mb-4 border-b border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Swaynix Feed</h1>
                <p className="text-xs text-muted-foreground">Personalized for you</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              {posts.length} posts
            </Badge>
          </div>
        </motion.div>

        {/* Feed */}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-6 pb-20">
            {feedItems.map((item, idx) => (
              item.type === "post" ? (
                <PostCard
                  key={(item.data as Post).id}
                  post={item.data as Post}
                  liked={false}
                  saved={savedPosts.has((item.data as Post).id)}
                  onLike={() => handleLike((item.data as Post).id)}
                  onSave={() => toggleSave((item.data as Post).id)}
                  isOwnPost={user?.id === (item.data as Post).userId}
                />
              ) : (
                <AdCard key={(item.data as Ad).id} ad={item.data as Ad} />
              )
            ))}

            {/* End of Feed */}
            <div className="text-center py-8">
              <p className="text-muted-foreground">You're all caught up!</p>
              <p className="text-sm text-muted-foreground">Check back later for more posts</p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
  isOwnPost
}: {
  post: any;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  isOwnPost?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.authorAvatar} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {post.author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">{post.author}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">@{post.authorHandle}</p>
                <span className="text-muted-foreground">•</span>
                <Badge variant="secondary" className="text-xs">
                  {post.community}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOwnPost && (
              <Badge variant="outline" className="text-xs text-primary">Your Post</Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4 pb-3">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Post Image */}
        {post.image && (
          <div className="relative">
            <img
              src={post.image}
              alt="Post"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        )}

        {/* Post Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={onLike}
                className={`flex items-center gap-1 transition-colors ${
                  liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                }`}
              >
                <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Send className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onSave}
                className={`transition-colors ${
                  saved ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Bookmark className={`w-6 h-6 ${saved ? "fill-current" : ""}`} />
              </button>
              {isOwnPost && (
                <button className="text-destructive hover:text-destructive/80 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{post.time}</p>
        </div>
      </Card>
    </motion.div>
  );
}

// Ad Card Component
function AdCard({ ad }: { ad: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-blue-500/30 shadow-lg overflow-hidden bg-gradient-to-b from-blue-500/5 to-transparent">
        {/* Ad Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shadow-sm">
              <img
                src={ad.brandLogo}
                alt={ad.brand}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">{ad.brand}</p>
              <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                Sponsored
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white border-0"
            onClick={() => window.open(ad.link, '_blank')}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {ad.cta}
          </Button>
        </div>

        {/* Ad Image */}
        <div className="relative">
          <img
            src={ad.image}
            alt={ad.title}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-red-500 text-white border-0 font-bold">
              {ad.discount} OFF
            </Badge>
          </div>
        </div>

        {/* Ad Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-foreground mb-2">{ad.title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{ad.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">₹{ad.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground line-through">₹{ad.originalPrice.toLocaleString()}</span>
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => window.open(ad.link, '_blank')}
            >
              Shop Now
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Ad Stats */}
        <div className="px-4 py-3 bg-muted/50 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {ad.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {ad.comments}
            </span>
          </div>
          <span>Sponsored</span>
        </div>
      </Card>
    </motion.div>
  );
}
