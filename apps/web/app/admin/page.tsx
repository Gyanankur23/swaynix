"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth-context";
import { 
  Shield, Calculator, Wallet, BarChart3, TrendingUp, Sparkles, LogIn, ShieldCheck
} from "lucide-react";

export default function AdminDashboard() {
  const { ads } = useAuth();
  const [commissionRate, setCommissionRate] = useState(15);

  const totalAdRevenue = ads.reduce((acc, ad) => acc + (ad.revenue || 0), 0);
  const totalCommission = (totalAdRevenue * commissionRate) / 100;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72 font-jakarta">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Sunset Header - Light Horizon Edition */}
        <div className="bg-swaynix-gradient p-12 rounded-[3.5rem] text-foreground shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group border border-black/5">
          <div className="absolute inset-0 bg-white/20 blur-3xl opacity-40 pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-primary/30 text-foreground border-primary/20 font-black italic text-[10px] tracking-widest px-4 py-1 rounded-full uppercase">Governance Protocol Active</Badge>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter leading-none">Global Hub Earnings</h1>
            <p className="text-muted-foreground max-w-lg font-medium italic">Track high-intensity engagement signals and harvest platform dividends in real-time.</p>
          </div>
          <div className="bg-white/60 p-8 rounded-[2.5rem] backdrop-blur-md self-start relative z-10 border border-primary/20 shadow-xl">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2 italic">Total Platform Yield</p>
            <p className="text-5xl font-black italic tracking-tighter text-foreground">₹{totalCommission.toLocaleString()}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border border-primary/10 shadow-premium bg-white/80 backdrop-blur-sm hover:translate-y-[-6px] transition-all rounded-[2.5rem]">
                <CardContent className="p-8">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 italic">Gross Revenue</p>
                    <p className="text-3xl font-black italic text-foreground tracking-tighter">₹{totalAdRevenue.toLocaleString()}</p>
                </CardContent>
            </Card>
            <Card className="border border-primary/10 shadow-premium bg-white hover:translate-y-[-6px] transition-all rounded-[2.5rem]">
                <CardContent className="p-8">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 italic">Yield Parameter</p>
                    <div className="flex items-center gap-3">
                        {[10, 15, 20].map(rate => (
                            <Button 
                                key={rate}
                                onClick={() => setCommissionRate(rate)}
                                className={`rounded-xl h-12 px-5 font-black italic transition-all ${commissionRate === rate ? "bg-swaynix-gradient text-foreground border border-black/5 shadow-lg" : "bg-primary/10 text-primary border-none hover:bg-primary/20"}`}
                            >
                                {rate}%
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="border border-primary/10 shadow-premium bg-white/80 backdrop-blur-sm hover:translate-y-[-6px] transition-all rounded-[2.5rem]">
                <CardContent className="p-8">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 italic">Active Campaigns</p>
                    <div className="flex items-center gap-4">
                        <p className="text-3xl font-black italic text-foreground tracking-tighter">{ads.length}</p>
                        <Badge className="bg-green-100 text-green-600 border-none px-3 py-1 font-black italic text-[9px] uppercase tracking-widest">In Sync</Badge>
                    </div>
                </CardContent>
            </Card>
            <Card className="border border-primary/10 shadow-premium bg-white/80 backdrop-blur-sm hover:translate-y-[-6px] transition-all rounded-[2.5rem]">
                <CardContent className="p-8">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 italic">Global Momentum</p>
                    <p className="text-3xl font-black italic text-green-600 flex items-center gap-2 tracking-tighter">
                        <TrendingUp className="w-6 h-6" />
                        +14.2%
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Yield Matrix */}
        <Card className="border border-primary/5 shadow-premium rounded-[3.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-primary/[0.03] p-12 border-b border-primary/10">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <CardTitle className="font-black italic text-4xl flex items-center gap-4 tracking-tighter text-foreground">
                        <ShieldCheck className="w-9 h-9 text-primary" />
                        Platform Divident Stream
                      </CardTitle>
                      <CardDescription className="font-medium text-muted-foreground italic text-lg">Real-time engagement harvesting across the global community hub.</CardDescription>
                   </div>
                   <Button variant="outline" className="h-14 px-8 rounded-2xl border-primary/10 text-foreground font-black italic hover:bg-primary/5 shadow-sm">Sync Hub Status</Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y divide-primary/5">
                {ads.map((ad) => (
                    <div key={ad.id} className="flex flex-col md:flex-row items-center justify-between p-12 hover:bg-primary/[0.02] transition-all gap-8 group cursor-pointer">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <Avatar className="w-20 h-20 border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
                                    <AvatarImage src={ad.brandLogo} alt={ad.brand} className="object-contain p-2" />
                                    <AvatarFallback className="bg-swaynix-gradient text-foreground font-black italic text-2xl">{ad.brand[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-3xl italic tracking-tighter leading-none group-hover:text-primary transition-colors">{ad.brand}</h4>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic opacity-60">Campaign: {ad.title}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-16 text-center md:text-right">
                            <div>
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-2 italic">Signals</p>
                                <p className="text-2xl font-black italic text-foreground tracking-tighter">{ad.clicks.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-2 italic">Yield</p>
                                <p className="text-2xl font-black italic text-foreground tracking-tighter">₹{(ad.revenue || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-primary tracking-widest mb-2 italic underline underline-offset-4">Commission</p>
                                <p className="text-4xl font-black italic text-primary tracking-tighter">₹{((ad.revenue || 0) * commissionRate / 100).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>

        {/* Commercial Pitch */}
        <div className="bg-primary/5 p-16 rounded-[4rem] border border-primary/10 relative overflow-hidden group">
            <div className="relative z-10 max-w-3xl space-y-8">
                <h2 className="text-5xl font-black italic tracking-tighter leading-none text-foreground">Global Monetization Protocol</h2>
                <p className="text-muted-foreground font-medium text-xl leading-relaxed italic max-w-2xl">
                    Swaynix provides an automated, zero-trust revenue model. 
                    Our **Commercial Matrix** harvests high-intensity signals from hub partners without compromising civil privacy. 
                    It is a transparent engine designed for the evolution of community wealth.
                </p>
                <Button className="bg-swaynix-gradient text-foreground border border-black/5 font-black italic px-12 h-16 rounded-2xl shadow-2xl hover:scale-105 transition-all outline-none">
                  Export System Audit (PDF)
                </Button>
            </div>
            <ShieldCheck className="absolute bottom-[-15%] right-[-10%] w-64 h-64 text-primary/10 rotate-12 transition-transform group-hover:rotate-[25deg] duration-1000" />
        </div>
      </div>
    </div>
  );
}
