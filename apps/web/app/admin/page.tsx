"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Shield, Users, AlertTriangle, CheckCircle, XCircle,
  MessageSquare, TrendingUp, Crown, MoreHorizontal, Flag
} from "lucide-react";

// Mock admin data
const REPORTS = [
  { id: 1, user: "Rohan Gupta", reason: "Spam", content: "Repeated promotional posts", time: "2 hours ago", status: "pending" },
  { id: 2, user: "Anonymous", reason: "Harassment", content: "Inappropriate comments on post", time: "5 hours ago", status: "pending" },
  { id: 3, user: "Priya Patel", reason: "Misinformation", content: "False information about event", time: "1 day ago", status: "resolved" },
];

const COHORT_STATS = [
  { name: "Travel India", members: 45600, posts: 1234, growth: "+12%" },
  { name: "Code Mumbai", members: 12300, posts: 567, growth: "+8%" },
  { name: "Bollywood Beats", members: 78900, posts: 2341, growth: "+15%" },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 pt-24 lg:pl-72">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-500" />
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage your community and keep it healthy</p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
            <Crown className="w-4 h-4 mr-2" />
            Admin Access
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
            <CardContent className="p-4">
              <Users className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">45.6K</p>
              <p className="text-slate-500 text-sm">Total Members</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
            <CardContent className="p-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
              <p className="text-slate-500 text-sm">Pending Reports</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
            <CardContent className="p-4">
              <MessageSquare className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">2.4K</p>
              <p className="text-slate-500 text-sm">Active Discussions</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
            <CardContent className="p-4">
              <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">+23%</p>
              <p className="text-slate-500 text-sm">Growth This Month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moderation Queue */}
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <Flag className="w-5 h-5 text-yellow-500" />
                Moderation Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {REPORTS.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold">
                        {report.user.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{report.user}</p>
                      <p className="text-xs text-slate-500">{report.reason} • {report.time}</p>
                      <p className="text-xs text-slate-400 mt-1">{report.content}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {report.status === "pending" ? (
                      <>
                        <Button size="sm" variant="outline" className="border-green-500/30 text-green-500">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/30 text-red-500">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-green-500 border-green-500/30">Resolved</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Cohort Stats */}
          <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Cohort Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {COHORT_STATS.map((cohort) => (
                <div key={cohort.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{cohort.name}</p>
                    <p className="text-xs text-slate-500">{(cohort.members / 1000).toFixed(1)}K members • {cohort.posts} posts</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">{cohort.growth}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
