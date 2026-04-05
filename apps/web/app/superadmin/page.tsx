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
    <div className="min-h-screen bg-white p-8 pt-24 lg:pl-[20rem] font-inter">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 tracking-tighter">
              <Crown className="w-10 h-10 text-amber-500" />
              Swaynix Super Admin
            </h1>
            <p className="text-muted-foreground font-medium italic">Global infrastructure control and platform analytics</p>
          </div>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-6 py-2 rounded-full font-bold">
            <Shield className="w-4 h-4 mr-2" />
            UNRESTRICTED ACCESS
          </Badge>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard icon={Users} title="Total Users" value={`${(PLATFORM_STATS.totalUsers / 1000).toFixed(1)}K`} color="bg-amber-500" />
          <StatCard icon={Zap} title="Daily Active" value={`${(PLATFORM_STATS.dailyActive / 1000).toFixed(1)}K`} color="bg-primary" />
          <StatCard icon={Globe} title="Cohorts" value={PLATFORM_STATS.totalCohorts.toString()} color="bg-blue-500" />
          <StatCard icon={DollarSign} title="Revenue" value={`₹${(PLATFORM_STATS.monthlyRevenue / 1000).toFixed(1)}K`} color="bg-green-500" />
          <StatCard icon={Server} title="Uptime" value={`${PLATFORM_STATS.serverUptime}%`} color="bg-emerald-500" />
        </div>

        {/* Admin Management */}
        <Card className="border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-10 border-b bg-muted/5 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Administrative Governance
            </CardTitle>
            <Button className="bg-primary text-white font-bold h-12 px-6 rounded-xl shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              New Admin
            </Button>
          </CardHeader>
          <CardContent className="p-10 space-y-4">
            {ADMINS.map((admin, idx) => (
              <div key={idx} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-muted/5 border border-primary/5 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                  <Avatar className="w-14 h-14 border-4 border-white shadow-lg group-hover:rotate-6 transition-transform">
                    <AvatarFallback className="bg-primary text-white font-bold text-lg">
                      {admin.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-bold text-xl text-foreground">{admin.name}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-primary" /> {admin.cohorts} hubs</span>
                      <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-blue-500" /> {admin.reports} reports</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`px-4 py-1.5 rounded-full font-bold uppercase text-[10px] ${admin.status === "active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                    {admin.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full hover:bg-primary/5"><Plus className="w-5 h-5" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }: any) {
    return (
        <Card className="border-none shadow-premium rounded-[1.8rem] bg-white group hover:translate-y-[-4px] transition-all">
            <CardContent className="p-8">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-foreground tracking-tighter leading-none mb-2">{value}</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
            </CardContent>
        </Card>
    )
}
