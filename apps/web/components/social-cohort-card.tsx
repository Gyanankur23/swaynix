"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, MessageCircle, Zap, TrendingUp, ArrowRight,
  Hash, Target, Flame, Star
} from "lucide-react";

interface CohortCardProps {
  cohort: {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    postCount: number;
    growthRate: number;
    tags: string[];
    color: string;
    imageUrl?: string;
    isTrending?: boolean;
    isNew?: boolean;
    matchScore?: number;
    topContributors?: { initials: string; level: number }[];
  };
  variant?: "default" | "compact" | "featured";
}

export function SocialCohortCard({ cohort, variant = "default" }: CohortCardProps) {
  if (variant === "compact") {
    return (
      <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
        <Link href={`/cohort/${cohort.id}`}>
          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: cohort.color }}
                >
                  {cohort.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate">
                      {cohort.name}
                    </h3>
                    {cohort.isTrending && (
                      <Flame className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {cohort.memberCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {cohort.postCount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  if (variant === "featured") {
    const imageUrl = cohort.imageUrl || `https://picsum.photos/seed/${cohort.id}/800/300`;
    return (
      <motion.div whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }}>
        <Link href={`/cohort/${cohort.id}`}>
          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all bg-white dark:bg-slate-900">
            <div className="h-32 relative overflow-hidden">
              <img 
                src={imageUrl}
                alt={cohort.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute top-4 right-4">
                {cohort.isTrending && (
                  <Badge className="bg-white/20 text-white backdrop-blur-sm">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <div className="absolute -bottom-8 left-6">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                  style={{ backgroundColor: cohort.color }}
                >
                  {cohort.name.charAt(0)}
                </div>
              </div>
            </div>
            <CardContent className="pt-12 pb-6 px-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white">
                  {cohort.name}
                </h3>
                {cohort.matchScore && (
                  <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    <Target className="w-3 h-3 mr-1" />
                    {cohort.matchScore}% Match
                  </Badge>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {cohort.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {cohort.memberCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {cohort.postCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-green-500">
                    <Zap className="w-4 h-4" />
                    +{cohort.growthRate}%
                  </span>
                </div>
                {cohort.topContributors && (
                  <div className="flex -space-x-2">
                    {cohort.topContributors.map((contributor, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-white dark:border-slate-900">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs">
                          {contributor.initials}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Link href={`/cohort/${cohort.id}`}>
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                style={{ backgroundColor: cohort.color }}
              >
                {cohort.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {cohort.name}
                    </h3>
                    {cohort.isNew && (
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  {cohort.matchScore && (
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      {cohort.matchScore}% Match
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {cohort.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {cohort.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {cohort.memberCount.toLocaleString()} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {cohort.postCount.toLocaleString()} posts
                  </span>
                  <span className={`flex items-center gap-1 ${cohort.growthRate > 0 ? "text-green-500" : "text-red-500"}`}>
                    <TrendingUp className="w-4 h-4" />
                    {cohort.growthRate > 0 ? "+" : ""}{cohort.growthRate}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
