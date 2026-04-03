"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, TrendingUp, Users, MousePointer, ShoppingCart, 
  DollarSign, Calendar, Download, ArrowUpRight, ArrowDownRight,
  Target, Eye, Clock
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";

// Analytics data
const MONTHLY_DATA = [
  { month: "Jan", reach: 8200, clicks: 580, conversions: 98, revenue: 78500 },
  { month: "Feb", reach: 9500, clicks: 680, conversions: 115, revenue: 92000 },
  { month: "Mar", reach: 12470, clicks: 892, conversions: 156, revenue: 124750 },
];

const COMMUNITY_PERFORMANCE = [
  { name: "Cricket Fans India", reach: 5420, clicks: 387, conversions: 42, ctr: 7.1 },
  { name: "Sports & Fitness", reach: 3100, clicks: 245, conversions: 38, ctr: 7.9 },
  { name: "Yoga & Wellness", reach: 2150, clicks: 156, conversions: 28, ctr: 7.3 },
  { name: "Travel India", reach: 1800, clicks: 104, conversions: 15, ctr: 5.8 },
];

const AD_PERFORMANCE = [
  { 
    id: "ad-1", 
    title: "Summer Fitness Sale",
    impressions: 5420,
    clicks: 387,
    ctr: 7.1,
    cpc: 32.30,
    conversions: 42,
    costPerConversion: 298,
    revenue: 84000,
    roas: 6.7
  },
  { 
    id: "ad-2", 
    title: "New Running Collection",
    impressions: 3890,
    clicks: 245,
    ctr: 6.3,
    cpc: 34.69,
    conversions: 28,
    costPerConversion: 304,
    revenue: 56000,
    roas: 6.6
  },
];

export default function BusinessAnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30days");

  if (!user || user.role !== "business") {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 lg:pl-72 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">This page is only accessible to business accounts.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 lg:pb-8 lg:pl-72">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/business">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track your campaign performance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-0 text-sm"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Reach</p>
                  <p className="text-2xl font-bold">12,470</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+22%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Clicks</p>
                  <p className="text-2xl font-bold">892</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+21%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Conversions</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+22%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Revenue</p>
                  <p className="text-2xl font-bold">₹1.25L</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-green-500 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>+26%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ads">Ad Performance</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around gap-4">
                  {MONTHLY_DATA.map((data, idx) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col gap-1">
                        <div 
                          className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                          style={{ height: `${(data.revenue / 150000) * 200}px` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{data.month}</span>
                      <span className="text-xs text-muted-foreground">₹{(data.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Performance by Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {COMMUNITY_PERFORMANCE.map((community, idx) => (
                    <div key={community.name} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium">{community.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {community.reach.toLocaleString()} reach • {community.clicks} clicks
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{community.ctr}% CTR</p>
                        <p className="text-sm text-muted-foreground">{community.conversions} sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Ad Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Ad</th>
                        <th className="text-right py-3 px-4 font-medium">Impressions</th>
                        <th className="text-right py-3 px-4 font-medium">Clicks</th>
                        <th className="text-right py-3 px-4 font-medium">CTR</th>
                        <th className="text-right py-3 px-4 font-medium">Conv.</th>
                        <th className="text-right py-3 px-4 font-medium">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AD_PERFORMANCE.map((ad) => (
                        <tr key={ad.id} className="border-b border-border/50">
                          <td className="py-4 px-4">
                            <p className="font-medium">{ad.title}</p>
                          </td>
                          <td className="text-right py-4 px-4">{ad.impressions.toLocaleString()}</td>
                          <td className="text-right py-4 px-4">{ad.clicks}</td>
                          <td className="text-right py-4 px-4">
                            <Badge variant="secondary">{ad.ctr}%</Badge>
                          </td>
                          <td className="text-right py-4 px-4">{ad.conversions}</td>
                          <td className="text-right py-4 px-4">
                            <Badge className="bg-green-500">{ad.roas}x</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Top Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune"].map((city, idx) => (
                      <div key={city} className="flex items-center justify-between">
                        <span>{city}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${100 - idx * 15}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{100 - idx * 15}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Mobile</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "78%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">78%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Desktop</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: "18%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">18%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tablet</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "4%" }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">4%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
