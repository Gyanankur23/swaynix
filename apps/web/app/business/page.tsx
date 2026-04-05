"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, Users, MousePointer2, ShoppingCart, 
  DollarSign, PlusCircle, BarChart3, Megaphone,
  ArrowUpRight, ArrowDownRight, Calendar, Target,
  Zap, Share2, Layers, Sparkles, ChevronRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";

export default function BusinessDashboardPage() {
  const router = useRouter();
  const { user, ads } = useAuth();
  
  if (!user || user.role !== "business") {
    return (
      <div className="min-h-screen bg-white pt-24 pb-20 lg:pl-72 flex items-center justify-center">
        <Card className="max-w-md border-0 shadow-2xl rounded-[2.5rem] p-10 text-center">
          <h2 className="text-2xl font-black italic tracking-tighter text-red-500 mb-2 font-jakarta">Hub Access Denied</h2>
          <p className="text-muted-foreground font-medium mb-6 font-inter">Partner-level credentials required for administrative governance.</p>
          <Button onClick={() => router.push('/login')} className="w-full h-14 bg-primary text-white font-black italic rounded-2xl shadow-xl shadow-primary/20">Verify Partner Identity</Button>
        </Card>
      </div>
    );
  }

  // Filter ads for the current brand
  const brandAds = ads.filter(ad => ad.brand === user.name);
  const activeAdsCount = brandAds.length;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Dynamic Partner Header */}
        <div className="bg-primary p-12 rounded-[3.5rem] text-white shadow-premium relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="flex items-center gap-8">
               <div className="w-24 h-24 bg-white rounded-3xl p-3 shadow-2xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <img src={user.avatar || "/partner.svg"} alt={user.name} className="w-full h-full object-contain" />
               </div>
               <div>
                  <h1 className="text-6xl font-black italic tracking-tighter leading-none mb-2 font-jakarta">Partner Hub</h1>
                  <p className="text-white/80 font-black italic text-xl flex items-center gap-2">
                    {user.name} <ShieldCheck className="w-6 h-6 text-white" />
                  </p>
               </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => router.push('/business/analytics')} variant="outline" className="h-16 px-8 rounded-[1.5rem] border-white/30 bg-white/10 text-white font-black italic text-xl hover:bg-white hover:text-primary backdrop-blur-md">
                 Market Pulse
              </Button>
              <Button onClick={() => router.push('/business/create-ad')} className="h-16 px-10 rounded-[1.5rem] bg-white text-primary font-black italic text-xl shadow-2xl hover:scale-105 transition-all">
                 <PlusCircle className="w-6 h-6 mr-3" /> Deploy Ad
              </Button>
            </div>
          </div>
          <Zap className="absolute top-[-40px] right-[-40px] w-80 h-80 text-white/5 rotate-12 transition-transform group-hover:scale-110 duration-1000" />
        </div>

        {/* Tactical Pulse Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <TacticalStat value="1.42M" label="Global Impressions" trend="+24%" color="text-blue-500" />
           <TacticalStat value="85.4K" label="Direct Click-Through" trend="+15%" color="text-orange-500" />
           <TacticalStat value="₹4.82L" label="Verified Revenue" trend="+32%" color="text-green-500" />
           <TacticalStat value="9.8x" label="ROAS Index" trend="+1.2x" color="text-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Campaign Management Hub */}
           <div className="lg:col-span-2 space-y-8">
              <Card className="border shadow-premium rounded-[3rem] overflow-hidden bg-white">
                 <CardHeader className="p-10 border-b bg-muted/20 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-3xl font-black italic flex items-center gap-4 font-jakarta">
                            <Megaphone className="w-8 h-8 text-primary shadow-sm" />
                            Live Campaigns
                        </CardTitle>
                        <CardDescription className="text-base font-medium font-inter">Real-time governance of brand assets</CardDescription>
                    </div>
                    <Badge className="bg-primary/10 text-primary font-black italic text-sm px-4 py-1.5 rounded-full border-primary/20">{activeAdsCount} ACTIVE</Badge>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-muted">
                        {brandAds.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <PlusCircle className="w-16 h-16 text-muted mx-auto opacity-20" />
                                <p className="text-2xl font-black italic text-muted-foreground font-jakarta tracking-tight">No Active Campaigns Launched</p>
                                <Button onClick={() => router.push('/business/create-ad')} variant="outline" className="border-primary text-primary font-bold rounded-xl h-12 px-8">Prepare First Campaign</Button>
                            </div>
                        ) : (
                          brandAds.map((ad, idx) => (
                            <CampaignRow key={ad.id} ad={ad} idx={idx} />
                          ))
                        )}
                    </div>
                 </CardContent>
              </Card>

              {/* Performance Suggestions */}
              <Card className="border shadow-premium rounded-[3rem] p-10 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-primary/5">
                 <div className="flex items-start gap-8">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/10">
                       <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black italic tracking-tighter text-foreground font-jakarta">Strategic Pivot Identified</h3>
                       <p className="text-muted-foreground font-medium text-lg leading-relaxed font-inter">
                          Ads targeting the **Sports & Fitness** community are performing at a <span className="text-primary font-black italic">35% higher efficiency index</span> than average. Scaling budget in this genre is highly recommended for Q2.
                       </p>
                       <Button variant="ghost" className="text-primary font-black italic text-sm p-0 hover:bg-transparent">Generate Scaling Strategy <ArrowUpRight className="ml-2 w-4 h-4" /></Button>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Metrics Sidebar */}
           <div className="space-y-8">
              <Card className="border shadow-premium rounded-[2.5rem] bg-white p-8">
                 <h3 className="text-xl font-black italic mb-8 flex items-center gap-3 font-jakarta">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Market Pulse Q1
                 </h3>
                 <div className="space-y-6">
                    <DistributionBar label="Community Reach" value="78%" color="bg-blue-500" />
                    <DistributionBar label="Hub Engagement" value="45%" color="bg-orange-500" />
                    <DistributionBar label="Sales Conversions" value="92%" color="bg-green-500" />
                 </div>
                 <Button onClick={() => router.push('/business/analytics')} className="w-full mt-10 h-14 bg-muted text-foreground font-black italic text-lg rounded-2xl hover:bg-primary hover:text-white transition-all">Deep Analytics HUB</Button>
              </Card>

              {/* CRM Integration Ad */}
              <Card className="border shadow-premium rounded-[2.5rem] bg-foreground text-background p-8 relative overflow-hidden group">
                 <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                    <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center">
                        <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-3xl font-black italic tracking-tighter leading-none font-jakarta">CRM Signal Sync</p>
                        <p className="text-background/60 font-medium text-sm mt-2 font-inter leading-relaxed">Instantly sync your Swaynix marketing leads with Salesforce or HubSpot automated flows.</p>
                    </div>
                    <Button onClick={() => router.push('/business/leads')} className="w-full h-14 bg-white text-foreground font-black italic text-lg rounded-2xl hover:scale-105 transition-all">Connect CRM Bridge</Button>
                 </div>
                 <TrendingUp className="absolute bottom-[-20%] right-[-10%] w-40 h-40 text-white/5 rotate-[-12deg] transition-transform group-hover:scale-110 duration-1000" />
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}

function TacticalStat({ value, label, trend, color }: any) {
  return (
    <Card className="border shadow-premium rounded-[2rem] bg-white overflow-hidden hover:translate-y-[-4px] transition-all group border-primary/5">
       <CardContent className="p-8 relative">
          <div className="flex justify-between items-center mb-6">
             <div className={`w-10 h-10 ${color.replace('text', 'bg')}/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                <Target className={`w-5 h-5 ${color}`} />
             </div>
             <Badge className="bg-green-50 text-green-600 font-bold text-[10px] border-none px-2 py-0.5 rounded-full">{trend}</Badge>
          </div>
          <p className="text-4xl font-black italic tracking-tighter text-foreground leading-none font-jakarta">{value}</p>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-2">{label}</p>
       </CardContent>
    </Card>
  )
}

function CampaignRow({ ad, idx }: any) {
  return (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.1 }}
        className="p-8 flex flex-col md:flex-row items-center gap-10 hover:bg-primary/[0.02] transition-colors cursor-pointer group"
    >
        <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform border border-muted">
            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
           <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <h3 className="text-2xl font-black italic tracking-tight text-foreground font-jakarta">{ad.title}</h3>
              <Badge className="bg-green-500 text-white font-bold italic py-0 h-6 px-3 rounded-full">ACTIVE</Badge>
           </div>
           <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-muted-foreground uppercase tracking-widest italic decoration-primary underline-offset-4 decoration-2">
              <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> {ad.likes.toLocaleString()} Favs</span>
              <span className="flex items-center gap-2"><MousePointer2 className="w-4 h-4 text-primary" /> {ad.clicks.toLocaleString()} Clicks</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> LIVE: 3D AGO</span>
           </div>
        </div>
        <div className="text-right">
           <p className="text-2xl font-black italic text-primary leading-none font-jakarta">₹{ad.revenue.toLocaleString()}</p>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">REVENUE CORE</p>
        </div>
        <ChevronRight className="hidden md:block w-8 h-8 text-muted/30 group-hover:text-primary group-hover:translate-x-2 transition-all" />
    </motion.div>
  )
}

function DistributionBar({ label, value, color }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-baseline">
          <p className="text-sm font-black italic text-muted-foreground">{label}</p>
          <p className="text-lg font-black text-primary italic leading-none">{value}</p>
       </div>
       <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner border border-muted">
          <div className={`h-full ${color} shadow-lg rounded-full`} style={{ width: value }} />
       </div>
    </div>
  )
}
