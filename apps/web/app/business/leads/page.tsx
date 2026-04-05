"use client";

import { useAuth } from "@/components/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MousePointer2, 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight,
  Target,
  MessageSquare,
  ChevronRight,
  Download,
  Calendar,
  Filter
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/components/ui/toast-provider";

export default function BusinessLeadsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      toast("✅ CRM Data Exported to Excel Successfully", "success");
      setIsExporting(false);
    }, 1500);
  };

  const handleLeadAction = (name: string) => {
    toast(`📢 Initiating Contact Flow for ${name}. Connecting via Swaynix...`, "brand");
  };

  const handleScheduleMode = () => {
    toast("📅 Ad Scheduler Active: Saturday 10:00 AM Pivot Set", "success");
  };

  // Mock leads data
  const leads = [
    { id: 1, name: "Arjun Mehta", genre: "Cricket", interest: "Premium Bats", time: "2m ago", status: "Hot" },
    { id: 2, name: "Sarah Khan", genre: "Football", interest: "Turf Shoes", time: "15m ago", status: "Warm" },
    { id: 3, name: "Vikram Singh", genre: "Fitness", interest: "Gym Equipment", time: "1h ago", status: "Cold" },
    { id: 4, name: "Neha Roy", genre: "Running", interest: "Marathon Gear", time: "2h ago", status: "Hot" },
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black italic text-[10px] tracking-widest uppercase px-3">Performance Suite</Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 font-bold text-[10px]">Real-time</Badge>
            </div>
            <h1 className="text-5xl font-black italic text-foreground tracking-tighter">Market Leads & Insights</h1>
            <p className="text-muted-foreground font-medium text-lg">High-intensity human engagement analytics for <span className="text-primary font-black">{user?.name || 'Brand'}</span></p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-14 px-6 rounded-2xl font-black italic border-2 hover:bg-muted transition-all">
                <Filter className="w-5 h-5 mr-2" /> Filter
             </Button>
             <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="bg-primary text-white font-black italic h-14 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
             >
                {isExporting ? "Compiling..." : <><Download className="w-5 h-5 mr-2" /> Export CRM</>}
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Impressions" value="1.2M" sub="+12.5%" icon={Users} color="text-blue-500" />
          <StatCard title="Lead Clicks" value="85.4K" sub="+8.2%" icon={MousePointer2} color="text-orange-500" />
          <StatCard title="Conversion" value="4.2%" sub="+1.3%" icon={Target} color="text-green-500" />
          <StatCard title="ROAS" value="5.8x" sub="+0.4x" icon={TrendingUp} color="text-purple-500" />
        </div>

        {/* Leads Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
            <CardHeader className="bg-muted/30 p-8 border-b">
              <div className="flex items-center justify-between">
                  <CardTitle className="font-black italic text-2xl flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    High-Intent Lead Stream
                  </CardTitle>
                  <Button variant="ghost" className="text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary/5">Refresh</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-muted">
                {leads.map((lead) => (
                  <div key={lead.id} 
                    onClick={() => handleLeadAction(lead.name)}
                    className="p-6 flex items-center justify-between hover:bg-primary/[0.02] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black italic text-xl text-white shadow-lg transition-transform group-hover:scale-110 ${
                        lead.status === 'Hot' ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                      }`}>
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="font-black italic text-xl text-foreground group-hover:text-primary transition-colors">{lead.name}</p>
                        <p className="text-sm text-muted-foreground font-medium"><span className="text-primary font-bold">{lead.interest}</span> in {lead.genre} Community</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-8">
                      <div className="hidden sm:block">
                        <Badge className={`mb-1 font-black italic px-4 py-1 rounded-full ${
                          lead.status === 'Hot' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-blue-100 text-blue-600 border-blue-200'
                        }`}>
                          {lead.status}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase italic">{lead.time}</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 text-center bg-muted/10">
                <Button 
                    variant="ghost" 
                    onClick={() => toast("🔍 Fetching Deep Archive Signal Patterns...", "info")}
                    className="text-primary font-black italic text-sm uppercase tracking-widest hover:bg-primary/5 h-12 w-full"
                >
                  Sync Advanced Platform Leads
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ad Performance Sidebar */}
          <div className="space-y-8">
            <Card className="border shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 p-6 border-b border-primary/10">
                <CardTitle className="text-base font-black italic flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Genre Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <GenreStat label="Football Sub-Community" value="45%" color="bg-blue-500" />
                <GenreStat label="Cricket Sub-Community" value="32%" color="bg-orange-500" />
                <GenreStat label="Fitness Hub" value="18%" color="bg-green-500" />
                <GenreStat label="Others" value="5%" color="bg-muted" />
              </CardContent>
            </Card>

            <Card className="border shadow-2xl rounded-[2.5rem] bg-primary p-8 text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-2xl font-black italic tracking-tight">Strategy Boost</h3>
                    <p className="text-white/80 text-sm font-medium mt-1">
                      Platform data suggests users in **Football** are 3.2x more active during live IPL/EPL matches.
                    </p>
                </div>
                <Button 
                    onClick={handleScheduleMode} 
                    className="w-full bg-white text-primary font-black italic h-14 rounded-2xl shadow-xl hover:scale-105 transition-all"
                >
                  <Calendar className="w-5 h-5 mr-2" /> Optimize Ads
                </Button>
              </div>
              <TrendingUp className="absolute bottom-[-20%] right-[-10%] w-40 h-40 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, icon: Icon, color }: any) {
  return (
    <Card className="border shadow-lg rounded-[2rem] hover:translate-y-[-4px] transition-all bg-white overflow-hidden">
      <CardContent className="p-8 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color.replace('text', 'bg')}/10 rounded-2xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <Badge variant="outline" className="text-[10px] font-black text-green-600 bg-green-50 border-green-100 flex items-center gap-1">
             <ArrowUpRight className="w-3 h-3" /> {sub}
          </Badge>
        </div>
        <p className="text-4xl font-black italic text-foreground tracking-tighter">{value}</p>
        <p className="text-xs font-black text-muted-foreground uppercase mt-2 tracking-widest">{title}</p>
      </CardContent>
    </Card>
  );
}

function GenreStat({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-bold tracking-tight">
        <span>{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-muted shadow-inner">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: value }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${color} shadow-lg rounded-full`} 
        />
      </div>
    </div>
  );
}
