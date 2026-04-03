"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Crown, Users, Zap, TrendingUp, Shield, DollarSign,
  Server, Activity, Globe, Plus
} from "lucide-react";

const PLATFORM_STATS = {
  totalUsers: 45678,
  totalCohorts: 1234,
  dailyActive: 12345,
  monthlyRevenue: 45600,
  serverUptime: 99.9,
};

const ADMINS = [
  { name: "Priya Patel", role: "admin", cohorts: 5, reports: 12, status: "active" },
  { name: "Vikram Reddy", role: "admin", cohorts: 3, reports: 8, status: "active" },
  { name: "Neha Kumar", role: "admin", cohorts: 7, reports: 15, status: "offline" },
];

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 pt-24 lg:pl-72">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Crown className="w-8 h-8 text-amber-500" />
              Super Admin
            </h1>
            <p className="text-slate-500 mt-1">Platform-wide control and analytics</p>
          </div>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Super Access
          </Badge>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="p-4">
              <Users className="w-6 h-6 text-amber-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">{(PLATFORM_STATS.totalUsers / 1000).toFixed(1)}K</p>
              <p className="text-slate-500 text-sm">Total Users</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4">
              <Zap className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">{(PLATFORM_STATS.dailyActive / 1000).toFixed(1)}K</p>
              <p className="text-slate-500 text-sm">Daily Active</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <Globe className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">{PLATFORM_STATS.totalCohorts}</p>
              <p className="text-slate-500 text-sm">Cohorts</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-4">
              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(PLATFORM_STATS.monthlyRevenue / 1000).toFixed(1)}K</p>
              <p className="text-slate-500 text-sm">Monthly Revenue</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
            <CardContent className="p-4">
              <Server className="w-6 h-6 text-emerald-500 mb-2" />
              <p className="text-2xl font-black text-slate-900 dark:text-white">{PLATFORM_STATS.serverUptime}%</p>
              <p className="text-slate-500 text-sm">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management */}
        <Card className="bg-white dark:bg-slate-900 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              Admin Management
            </CardTitle>
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ADMINS.map((admin, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold">
                      {admin.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{admin.name}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {admin.cohorts} cohorts
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {admin.reports} reports
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={admin.status === "active" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}>
                    {admin.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="text-slate-400">Edit</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
