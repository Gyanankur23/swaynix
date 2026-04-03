"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Crown, Shield, Users, TrendingUp, AlertTriangle, CheckCircle,
  MessageSquare, Flag, Zap, BarChart3, Settings, Search,
  ChevronRight, MoreHorizontal
} from "lucide-react";

// Role-Based Dashboard Component
interface DashboardProps {
  role: "member" | "admin" | "superadmin";
}

// Indian names for mock data
const INDIAN_NAMES = [
  "Arjun Sharma", "Priya Patel", "Rohan Gupta", "Ananya Singh",
  "Vikram Reddy", "Neha Kumar", "Aditya Joshi", "Sanya Malhotra",
  "Karthik Iyer", "Divya Nair", "Rajesh Khanna", "Meera Chopra"
];

export function RoleDashboard({ role }: DashboardProps) {
  switch (role) {
    case "superadmin":
      return <SuperAdminDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <MemberDashboard />;
  }
}

// Member Dashboard
function MemberDashboard() {
  const stats = {
    engagementScore: 847,
    nextLevel: 1000,
    level: 7,
    connections: 234,
    posts: 45,
    streak: 12,
  };

  const activities = [
    { type: "post", content: "Shared a photo from Goa trip", time: "2 hours ago", likes: 24 },
    { type: "comment", content: "Commented on Priya's coding tutorial", time: "4 hours ago" },
    { type: "join", content: "Joined 'Bangalore Foodies' cohort", time: "1 day ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-black text-white">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Arjun</span>! 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's what's happening in your world today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Engagement" value={stats.engagementScore} color="from-yellow-400 to-orange-500" />
        <StatCard icon={Users} label="Connections" value={stats.connections} color="from-blue-400 to-cyan-500" />
        <StatCard icon={MessageSquare} label="Posts" value={stats.posts} color="from-green-400 to-emerald-500" />
        <StatCard icon={TrendingUp} label="Day Streak" value={stats.streak} color="from-purple-400 to-pink-500" />
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                {stats.level}
              </div>
              <div>
                <p className="text-white font-bold">Level {stats.level} Creator</p>
                <p className="text-gray-400 text-sm">{stats.nextLevel - stats.engagementScore} points to next level</p>
              </div>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {Math.round((stats.engagementScore / stats.nextLevel) * 100)}% Complete
            </Badge>
          </div>
          <Progress value={(stats.engagementScore / stats.nextLevel) * 100} className="h-3 bg-purple-950" />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === "post" ? "bg-blue-500/20 text-blue-400" :
                activity.type === "comment" ? "bg-green-500/20 text-green-400" :
                "bg-purple-500/20 text-purple-400"
              }`}>
                {activity.type === "post" ? <MessageSquare className="w-5 h-5" /> :
                 activity.type === "comment" ? <MessageSquare className="w-5 h-5" /> :
                 <Users className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <p className="text-white">{activity.content}</p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalMembers: 1234,
    pendingReports: 5,
    activeDiscussions: 89,
    flaggedContent: 3,
  };

  const reports = [
    { id: 1, user: "Rohan Gupta", reason: "Spam", content: "Repeated promotional posts", time: "2 hours ago", status: "pending" },
    { id: 2, user: "Anonymous", reason: "Harassment", content: "Inappropriate comments", time: "5 hours ago", status: "pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage your community and keep it healthy</p>
        </div>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
          <Crown className="w-4 h-4 mr-2" />
          Admin Access
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} color="from-blue-400 to-cyan-500" />
        <StatCard icon={AlertTriangle} label="Pending Reports" value={stats.pendingReports} color="from-yellow-400 to-orange-500" />
        <StatCard icon={MessageSquare} label="Active Discussions" value={stats.activeDiscussions} color="from-green-400 to-emerald-500" />
        <StatCard icon={Flag} label="Flagged Content" value={stats.flaggedContent} color="from-red-400 to-rose-500" />
      </div>

      {/* Moderation Queue */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Moderation Queue
          </CardTitle>
          <Button variant="outline" size="sm" className="border-white/10 text-gray-400">
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {report.user.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{report.user}</p>
                  <p className="text-gray-500 text-sm">{report.reason} • {report.time}</p>
                  <p className="text-gray-400 text-sm mt-1">{report.content}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/20">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/20">
                  <Flag className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Super Admin Dashboard
function SuperAdminDashboard() {
  const platformStats = {
    totalUsers: 45678,
    totalCohorts: 1234,
    dailyActiveUsers: 12345,
    monthlyRevenue: 45600,
    serverHealth: 99.9,
  };

  const admins = [
    { name: "Priya Patel", role: "admin", cohorts: 5, reports: 12 },
    { name: "Vikram Reddy", role: "admin", cohorts: 3, reports: 8 },
    { name: "Neha Kumar", role: "admin", cohorts: 7, reports: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <Crown className="w-8 h-8 text-amber-400" />
            Super Admin
          </h1>
          <p className="text-gray-400 mt-1">Platform-wide control and analytics</p>
        </div>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2">
          <Crown className="w-4 h-4 mr-2" />
          Super Access
        </Badge>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Users" value={platformStats.totalUsers.toLocaleString()} color="from-amber-400 to-orange-500" />
        <StatCard icon={MessageSquare} label="Cohorts" value={platformStats.totalCohorts.toLocaleString()} color="from-purple-400 to-pink-500" />
        <StatCard icon={Zap} label="DAU" value={platformStats.dailyActiveUsers.toLocaleString()} color="from-green-400 to-emerald-500" />
        <StatCard icon={TrendingUp} label="Revenue" value={`₹${(platformStats.monthlyRevenue / 1000).toFixed(1)}K`} color="from-blue-400 to-cyan-500" />
        <StatCard icon={CheckCircle} label="Uptime" value={`${platformStats.serverHealth}%`} color="from-emerald-400 to-teal-500" />
      </div>

      {/* Admin Management */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            Admin Management
          </CardTitle>
          <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
            + Add Admin
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {admins.map((admin, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold">
                    {admin.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-bold">{admin.name}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {admin.cohorts} cohorts
                    </span>
                    <span className="flex items-center gap-1">
                      <Flag className="w-4 h-4" />
                      {admin.reports} reports
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-2xl font-black text-white mt-3">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </CardContent>
    </Card>
  );
}
