"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-context";
import { PostCard } from "@/components/post-card";
import { 
  Users, MessageCircle, Zap, TrendingUp,
  Crown, ChevronRight,
  Trophy, Megaphone, BarChart3, DollarSign, MousePointer, ShoppingCart
} from "lucide-react";

// Mock ads data for Decathlon
const ACTIVE_ADS = [
  {
    id: "ad-1",
    title: "Summer Fitness Sale - Up to 40% Off",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600",
    status: "active",
    reach: 5420,
    clicks: 387,
    conversions: 42,
    spend: 12500,
    revenue: 84000,
    startDate: "2024-03-01",
    endDate: "2024-03-31",
  },
  {
    id: "ad-2",
    title: "New Running Collection 2024",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600",
    status: "active",
    reach: 3890,
    clicks: 245,
    conversions: 28,
    spend: 8500,
    revenue: 56000,
    startDate: "2024-03-05",
    endDate: "2024-04-05",
  },
  {
    id: "ad-3",
    title: "Camping Gear - Monsoon Special",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
    status: "scheduled",
    reach: 0,
    clicks: 0,
    conversions: 0,
    spend: 15000,
    revenue: 0,
    startDate: "2024-04-01",
    endDate: "2024-04-30",
  },
];

export function ProfilePage() {
  const { user } = useAuth();
  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    setCoverImage(`https://picsum.photos/seed/profile-cover-${user?.handle || 'default'}/1200/400`);
  }, [user?.handle]);

  const isBusiness = user?.role === "business";

  // Business Profile View
  if (isBusiness) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-24">
        {/* Cover Banner */}
        <div className="h-48 md:h-64 relative overflow-hidden bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800">
          {coverImage && (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-visible">
                <CardContent className="p-6 pt-0">
                  {/* Logo */}
                  <div className="-mt-16 mb-4 flex justify-center">
                    <motion.div whileHover={{ scale: 1.05 }} className="relative">
                      <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
                        <img 
                          src={user?.businessConfig?.logo || "/logos/decathlon.svg"} 
                          alt={user?.name || "Decathlon"}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* User Info */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || "Decathlon India"}</h1>
                    <p className="text-slate-500">@{user?.handle || "decathlon_india"}</p>
                    <Badge className="mt-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      <Megaphone className="w-3 h-3 mr-1" />
                      Business Account
                    </Badge>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                    Leading sports retailer in India. Passionate about making sports accessible to everyone. 🏃‍♂️🚴‍♀️🏊‍♂️
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">3</div>
                      <p className="text-xs text-slate-500">Active Ads</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">12.5K</div>
                      <p className="text-xs text-slate-500">Total Reach</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">892</div>
                      <p className="text-xs text-slate-500">Clicks</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">₹1.25L</div>
                      <p className="text-xs text-slate-500">Revenue</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link href="/business/create-ad" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold">
                        <Zap className="w-4 h-4 mr-2" />
                        Create Ad
                      </Button>
                    </Link>
                    <Link href="/business/analytics" className="flex-1">
                      <Button variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="mt-6 border-0 shadow-lg bg-white dark:bg-slate-900">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <Link href="/business">
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-600">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">Dashboard</p>
                          <p className="text-xs text-slate-500">View performance</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </Link>
                    <Link href="/business/create-ad">
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-600">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">Create Ad</p>
                          <p className="text-xs text-slate-500">New campaign</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Ads */}
            <div className="lg:col-span-2">
              <Card className="mb-6 border-0 shadow-sm bg-white dark:bg-slate-900">
                <CardContent className="p-4">
                  <div className="flex gap-1">
                    <Button variant="default" className="flex-1 capitalize">
                      <Megaphone className="w-4 h-4 mr-2" />
                      Active Ads
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Ad List */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {ACTIVE_ADS.map((ad) => (
                  <Card key={ad.id} className="border-0 shadow-lg overflow-hidden">
                    <div className="p-4 flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{ad.title}</h3>
                          <Badge variant={ad.status === "active" ? "default" : "secondary"} className={ad.status === "active" ? "bg-green-500" : ""}>
                            {ad.status === "active" ? "Active" : "Scheduled"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {ad.reach.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><MousePointer className="w-4 h-4" /> {ad.clicks.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4" /> {ad.conversions}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ₹{ad.revenue.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{ad.startDate} - {ad.endDate}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular user profile - return original component
  return <RegularUserProfile />;
}

// Original regular user profile component
function RegularUserProfile() {
  const { user } = useAuth();

  const profileUser = user || {
    id: "user-guest",
    name: "Arjun Sharma",
    email: "arjun@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    handle: "arjun_sharma",
    level: 3,
    role: "member" as const,
    joinDate: "2024-01-15",
    posts: 12,
    cohorts: 3,
    streak: 7,
    interactions: 89,
    communities: ["code-mumbai", "bollywood-beats", "cricket-fans"],
  };

  const topCohorts = [
    { id: "travel-india", name: "Travel India", role: "Contributor", color: "#FF6B9D" },
    { id: "code-mumbai", name: "Code Mumbai", role: "Top Voice", color: "#00D4FF" },
    { id: "bollywood-beats", name: "Bollywood Beats", role: "Member", color: "#9D4EDD" },
  ].filter((c) => (profileUser.communities || []).includes(c.id));

  const profilePosts = [
    {
      id: "profile-1",
      author: { name: profileUser.name, handle: profileUser.handle, level: profileUser.level },
      cohort: { name: "Code Mumbai", color: "#00D4FF" },
      content: "Shipped a cleaner dark/light theme system today. Feels much closer to production now.",
      image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200",
      engagement: { likes: 148, comments: 21, shares: 9 },
      timestamp: "3h ago",
    },
    {
      id: "profile-2",
      author: { name: profileUser.name, handle: profileUser.handle, level: profileUser.level },
      cohort: { name: "Travel India", color: "#FF6B9D" },
      content: "Planning a Ladakh itinerary: Pangong + Nubra + Hanle. Any must-do detours?",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
      engagement: { likes: 312, comments: 47, shares: 15 },
      timestamp: "1d ago",
    },
    {
      id: "profile-3",
      author: { name: profileUser.name, handle: profileUser.handle, level: profileUser.level },
      cohort: { name: "Bollywood Beats", color: "#9D4EDD" },
      content: "Anirudh’s production layering is insane. Any similar recommendations?",
      engagement: { likes: 89, comments: 12, shares: 4 },
      timestamp: "2d ago",
    },
  ];

  const [coverImage, setCoverImage] = useState("");

  useEffect(() => {
    setCoverImage(`https://picsum.photos/seed/profile-cover-${profileUser.handle}/1200/400`);
  }, [profileUser.handle]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      {/* Cover Banner */}
      <div className="h-48 md:h-64 relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
        {coverImage && (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white dark:bg-slate-900 overflow-visible">
              <CardContent className="p-6 pt-0">
                {/* Avatar */}
                <div className="-mt-16 mb-4 flex justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-1">
                      <div className="w-full h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                        <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {profileUser.level}
                    </div>
                  </motion.div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{profileUser.name}</h1>
                  <p className="text-slate-500">@{profileUser.handle}</p>
                  <Badge className="mt-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    <Crown className="w-3 h-3 mr-1" />
                    Level {profileUser.level} Engager
                  </Badge>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-center mb-6">
                  Building community-driven products in Mumbai. Love connecting with fellow creators across India.
                </p>

                {/* Stats Grid - Realistic numbers */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{profileUser.posts || 0}</div>
                    <p className="text-xs text-slate-500">Posts</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{(profileUser.interactions || 0).toLocaleString()}</div>
                    <p className="text-xs text-slate-500">Interactions</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{profileUser.cohorts || 0}</div>
                    <p className="text-xs text-slate-500">Cohorts</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{profileUser.streak || 0}</div>
                    <p className="text-xs text-slate-500">Day Streak</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Early Adopter", "Top Contributor", "Community Champion"].map((badge) => (
                      <Badge key={badge} variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-400">
                        <Trophy className="w-3 h-3 mr-1" />{badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Cohorts */}
            <Card className="mt-6 border-0 shadow-lg bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Active Cohorts</h3>
                <div className="space-y-3">
                  {topCohorts.map((cohort) => (
                    <Link key={cohort.id} href={`/cohort/${cohort.id}`}>
                      <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: cohort.color }}>
                          {cohort.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">{cohort.name}</p>
                          <p className="text-xs text-slate-500">{cohort.role}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {profilePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
