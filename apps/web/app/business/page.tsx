"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Users, MousePointer, ShoppingCart, 
  DollarSign, PlusCircle, BarChart3, Megaphone,
  ArrowUpRight, ArrowDownRight, Calendar, Target
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";

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

// Analytics data
const ANALYTICS_DATA = {
  thisMonth: {
    reach: 12470,
    clicks: 892,
    conversions: 156,
    revenue: 124750,
    spend: 35000,
  },
  lastMonth: {
    reach: 10200,
    clicks: 734,
    conversions: 128,
    revenue: 98750,
    spend: 28000,
  },
};

export default function BusinessDashboardPage() {
  const { user } = useAuth();
  
  const businessUser = user?.role === "business" ? user : null;
  
  if (!businessUser) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 lg:pl-72 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">This page is only accessible to business accounts.</p>
            <Link href="/login">
              <Button className="mt-4">Login as Business</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalActiveAds = ACTIVE_ADS.filter(ad => ad.status === "active").length;
  const totalReach = ANALYTICS_DATA.thisMonth.reach;
  const totalRevenue = ANALYTICS_DATA.thisMonth.revenue;
  const roi = ((ANALYTICS_DATA.thisMonth.revenue - ANALYTICS_DATA.thisMonth.spend) / ANALYTICS_DATA.thisMonth.spend * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 lg:pb-8 lg:pl-72">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            {user?.businessConfig?.logo && (
              <div className="w-16 h-16 bg-white rounded-xl p-2 shadow-sm flex items-center justify-center">
                <img 
                  src={user.businessConfig.logo} 
                  alt={user.name} 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-black text-foreground">{user?.name}</h1>
              <p className="text-muted-foreground">Business Dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Reach</p>
                    <p className="text-2xl font-bold text-foreground">{totalReach.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+22%</span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+26%</span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Conversions</p>
                    <p className="text-2xl font-bold text-foreground">{ANALYTICS_DATA.thisMonth.conversions}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+22%</span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">ROI</p>
                    <p className="text-2xl font-bold text-foreground">{roi}%</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+8%</span>
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/business/create-ad">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Ad
            </Button>
          </Link>
          <Link href="/business/analytics">
            <Button size="lg" variant="outline">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>

        {/* Active Ads */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Your Ads ({totalActiveAds} active)
            </CardTitle>
            <Link href="/business/create-ad">
              <Button variant="outline" size="sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Ad
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {ACTIVE_ADS.map((ad, idx) => (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{ad.title}</h3>
                      <Badge 
                        variant={ad.status === "active" ? "default" : "secondary"}
                        className={ad.status === "active" ? "bg-green-500" : ""}
                      >
                        {ad.status === "active" ? "Active" : "Scheduled"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {ad.reach.toLocaleString()} reach
                      </span>
                      <span className="flex items-center gap-1">
                        <MousePointer className="w-4 h-4" />
                        {ad.clicks.toLocaleString()} clicks
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        {ad.conversions} sales
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {ad.startDate} - {ad.endDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{ad.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Tips */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Performance Tip</h3>
                <p className="text-muted-foreground text-sm">
                  Your ads targeting the Cricket Fans India community are performing 35% better than average. 
                  Consider increasing your budget for similar sports-focused communities to maximize ROI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
