"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  MousePointer2, 
  ShoppingCart, 
  DollarSign, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Target, 
  Eye, 
  Clock,
  BarChart3,
  Layers,
  Sparkles,
  PieChart,
  Globe,
  Smartphone,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";

export default function BusinessAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user || user.role !== "business") {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-2xl rounded-[2.5rem] p-8 text-center">
             <h2 className="text-2xl font-black italic tracking-tighter text-red-500">Access Restricted</h2>
             <p className="text-muted-foreground font-medium mt-2">Partner-level credentials required for analytics governance.</p>
             <Button onClick={() => router.push('/login')} className="mt-6 bg-primary text-white font-black italic rounded-xl px-10">Verify Identity</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* High-Impact Header */}
        <div className="bg-primary p-12 rounded-[3.5rem] text-white shadow-premium relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                 <Badge variant="outline" className="text-white border-white/30 font-black italic text-[10px] tracking-widest px-4 py-1">DATA GOVERNANCE v2.0</Badge>
                 <Badge variant="outline" className="bg-white/10 text-white border-none font-bold text-[10px]">Active Session</Badge>
              </div>
              <h1 className="text-6xl font-black italic tracking-tighter leading-none">Partner Analytics</h1>
              <p className="text-white/80 font-bold max-w-md text-lg italic">Advanced performance signals for {user.name}.</p>
            </div>
            <Button className="bg-white text-primary font-black italic h-14 px-10 rounded-2xl shadow-xl hover:scale-105 transition-all">
               <Download className="w-5 h-5 mr-3" /> Export Quarterly Report
            </Button>
          </div>
          <BarChart3 className="absolute top-[-30px] right-[-30px] w-80 h-80 text-white/5 rotate-[-12deg] transition-transform group-hover:scale-110 duration-1000" />
        </div>

        {/* Global Performance Pulse */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Impressions" value="1.42M" trend="+24%" icon={Eye} color="text-blue-500" />
          <StatCard title="Active Enagagement" value="92.5K" trend="+18%" icon={MousePointer2} color="text-orange-500" />
          <StatCard title="Conversions" value="854" trend="+32%" icon={ShoppingCart} color="text-green-500" />
          <StatCard title="Total Revenue" value="₹4.82L" trend="+15%" icon={DollarSign} color="text-purple-500" />
        </div>

        {/* Analytics Infrastructure */}
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-8">
           <div className="flex justify-start">
            <TabsList className="bg-muted p-2 h-16 rounded-[1.5rem] border border-primary/5 shadow-inner">
                <TabsTrigger value="overview" className="rounded-xl font-black italic px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Performance Pulse
                </TabsTrigger>
                <TabsTrigger value="distribution" className="rounded-xl font-black italic px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Market Distribution
                </TabsTrigger>
                <TabsTrigger value="ad-ops" className="rounded-xl font-black italic px-8 h-12 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  Ad-Ops Governance
                </TabsTrigger>
            </TabsList>
           </div>

           <AnimatePresence mode="wait">
             <TabsContent value="overview">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Main Revenue Chart (Visual Mock) */}
                 <Card className="lg:col-span-2 border shadow-premium rounded-[3rem] bg-white overflow-hidden p-10">
                    <div className="flex justify-between items-end mb-10">
                      <div>
                        <h3 className="text-3xl font-black italic tracking-tighter text-foreground">Revenue Trend</h3>
                        <p className="text-muted-foreground font-medium">Monthly revenue growth index</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">This Quarter</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-muted" /> <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Previous</span></div>
                      </div>
                    </div>
                    
                    <div className="h-64 flex items-end justify-between gap-10">
                       <Bar val={45} label="JAN" color="bg-primary/20" />
                       <Bar val={65} label="FEB" color="bg-primary/40" />
                       <Bar val={95} label="MAR" color="bg-primary" active />
                       <Bar val={55} label="APR" color="bg-primary/30" />
                       <Bar val={75} label="MAY" color="bg-primary/60" />
                       <Bar val={85} label="JUN" color="bg-primary/80" />
                    </div>
                 </Card>

                 {/* Top Communities Sidebar */}
                 <div className="space-y-6">
                    <Card className="border shadow-premium rounded-[2.5rem] bg-white p-8">
                       <h3 className="font-black italic text-xl mb-6 flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Target Saturation
                       </h3>
                       <div className="space-y-5">
                          <GrowthRow label="Sports & Fitness" value="85%" color="bg-blue-500" />
                          <GrowthRow label="Professional Codes" value="42%" color="bg-orange-500" />
                          <GrowthRow label="Travel Enthusiasts" value="68%" color="bg-indigo-500" />
                       </div>
                    </Card>

                    <Card className="border shadow-premium rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-400 p-8 text-white relative overflow-hidden">
                       <div className="relative z-10 flex flex-col justify-between h-full">
                          <Sparkles className="w-10 h-10 mb-4" />
                          <div>
                             <p className="text-2xl font-black italic tracking-tighter">AI Optimization Potential</p>
                             <p className="text-white/80 text-xs font-medium mt-1">Platform signal analysis suggests scaling Friday-ad spend by 12% for maximum ROI.</p>
                          </div>
                          <Button className="mt-4 bg-white text-primary font-black italic rounded-xl w-full h-12">Apply Auto-Scale</Button>
                       </div>
                       <Target className="absolute bottom-[-10%] right-[-10%] w-32 h-32 text-white/10 rotate-12" />
                    </Card>
                 </div>
               </div>
             </TabsContent>

             <TabsContent value="distribution">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Card className="border shadow-premium rounded-[3rem] p-10 bg-white">
                      <CardTitle className="text-2xl font-black italic tracking-tight mb-8 flex items-center gap-3">
                         <Globe className="w-7 h-7 text-primary" />
                         Geographic Engagement
                      </CardTitle>
                      <div className="space-y-6">
                         {["Maharashtra", "Karnataka", "Delhi NCR", "Tamil Nadu", "Telangana"].map((loc, i) => (
                           <div key={loc} className="flex justify-between items-center group">
                              <p className="font-bold text-muted-foreground group-hover:text-foreground transition-colors">{loc}</p>
                              <div className="flex items-center gap-4">
                                 <div className="w-40 h-2 bg-muted rounded-full overflow-hidden border">
                                    <div className="h-full bg-primary" style={{ width: `${90 - i * 15}%` }} />
                                 </div>
                                 <span className="text-xs font-black w-8">{90 - i * 15}%</span>
                              </div>
                           </div>
                         ))}
                      </div>
                   </Card>

                   <Card className="border shadow-premium rounded-[3rem] p-10 bg-white">
                      <CardTitle className="text-2xl font-black italic tracking-tight mb-8 flex items-center gap-3">
                         <Smartphone className="w-7 h-7 text-primary" />
                         Device Logic
                      </CardTitle>
                      <div className="space-y-6">
                        <DeviceRow label="Smartphone Apps" value="82%" icon={Smartphone} color="bg-blue-500" />
                        <DeviceRow label="Desktop Web" value="15%" icon={Globe} color="bg-green-500" />
                        <DeviceRow label="Tablets / HUB" value="3%" icon={Layers} color="bg-orange-500" />
                      </div>
                   </Card>
                </div>
             </TabsContent>

             <TabsContent value="ad-ops">
                <Card className="border shadow-premium rounded-[3rem] overflow-hidden bg-white">
                    <CardHeader className="p-10 border-b bg-muted/20">
                       <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                          <Layers className="w-7 h-7 text-primary" />
                          Operational Load Archive
                       </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="divide-y">
                          <OpRow title="Summer Fitness 2.0" status="ACTIVE" reach="452K" ctr="8.2%" roas="5.2x" />
                          <OpRow title="Winter Gear Pivot" status="PAUSED" reach="120K" ctr="4.5%" roas="3.1x" />
                          <OpRow title="Community Flash Sale" status="COMPLETED" reach="890K" ctr="12.4%" roas="8.9x" />
                       </div>
                    </CardContent>
                </Card>
             </TabsContent>
           </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="border shadow-premium rounded-[2.5rem] bg-white group hover:translate-y-[-4px] transition-all overflow-hidden border-primary/5">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-4">
           <div className={`w-12 h-12 ${color.replace('text', 'bg')}/10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
              <Icon className={`w-6 h-6 ${color}`} />
           </div>
           <Badge variant="outline" className="text-[10px] font-black text-green-600 bg-green-50 border-green-100 flex items-center gap-1">
             <ArrowUpRight className="w-3 h-3" /> {trend}
          </Badge>
        </div>
        <p className="text-4xl font-black italic tracking-tighter text-foreground leading-none">{value}</p>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-2">{title}</p>
      </CardContent>
    </Card>
  );
}

function Bar({ val, label, color, active }: any) {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 group">
      <div className="w-full relative h-[250px] flex items-end">
         <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: `${val}%` }} 
            className={`w-full rounded-2xl ${color} shadow-lg transition-all group-hover:scale-105 cursor-pointer origin-bottom`} 
         />
         {active && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full">PEAK</div>}
      </div>
      <span className={`text-[10px] font-black tracking-widest uppercase italic transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
    </div>
  )
}

function GrowthRow({ label, value, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-black italic tracking-tight">
        <span>{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color}`} style={{ width: value }} />
      </div>
    </div>
  )
}

function DeviceRow({ label, value, icon: Icon, color }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl hover:bg-muted/40 transition-all cursor-crosshair">
       <div className="flex gap-4 items-center">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
             <Icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="font-bold text-foreground italic">{label}</p>
       </div>
       <div className="text-right">
          <p className="text-xl font-black text-primary">{value}</p>
          <div className="h-1 w-12 bg-primary rounded-full ml-auto mt-1" style={{ opacity: parseFloat(value)/100 }} />
       </div>
    </div>
  )
}

function OpRow({ title, status, reach, ctr, roas }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-8 hover:bg-primary/[0.02] transition-colors cursor-pointer group">
       <div className="flex gap-6 items-center">
          <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center font-black italic text-primary group-hover:bg-primary group-hover:text-white transition-all">
             {title[0]}
          </div>
          <div>
             <p className="font-black italic text-2xl text-foreground tracking-tight group-hover:text-primary transition-colors">{title}</p>
             <Badge className={`mt-1 font-bold italic ${status === 'ACTIVE' ? 'bg-green-500' : 'bg-muted text-muted-foreground'}`}>{status}</Badge>
          </div>
       </div>
       <div className="grid grid-cols-3 gap-10 mt-6 md:mt-0 text-right">
          <div><p className="text-[10px] font-black uppercase text-muted-foreground">Reach</p><p className="font-black italic text-lg">{reach}</p></div>
          <div><p className="text-[10px] font-black uppercase text-muted-foreground">CTR</p><p className="font-black italic text-lg text-primary">{ctr}</p></div>
          <div><p className="text-[10px] font-black uppercase text-muted-foreground">ROAS</p><p className="font-black italic text-lg">{roas}</p></div>
       </div>
    </div>
  )
}
