"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LocationMap } from "@/components/location-map";
import {
  Search, Sparkles, Users, TrendingUp, MessageSquare,
  Heart, MapPin, Compass, Flame, Crown, Check,
  Target, Zap, PlusCircle, BarChart3, Globe,
  ShieldCheck, ArrowUpRight, ChevronRight, UserPlus, UserCheck
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { useToast } from "@/components/ui/toast-provider";
import { EXPLORE_COHORTS } from "@/lib/cohorts-data";
import { EXPLORE_PARENT_CATEGORIES } from "@/lib/explore-taxonomy";
import { listNearbyPeople } from "@/lib/public-profiles";

const CATEGORIES = EXPLORE_PARENT_CATEGORIES;

const COHORTS = EXPLORE_COHORTS;

const TRENDING_USERS = [
  { name: "Priya Sharma", handle: "priya_travels", category: "travel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", color: "#FF6B9D" },
  { name: "Rohan Gupta", handle: "rohan_codes", category: "coding", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", color: "#00D4FF" },
  { name: "Ananya Singh", handle: "ananya_dances", category: "dance", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", color: "#FF006E" },
];

export default function ExplorePage() {
  const { toast } = useToast();
  const { joinedCohorts, toggleCohort, connections, toggleConnection } = useAuth();
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");

  const handleJoin = (cohortId: string, name: string) => {
    toggleCohort(cohortId, name);
    const isJoining = !joinedCohorts.includes(cohortId);
    toast(isJoining ? `Synchronized with ${name} Hub` : `Signal Disconnected from ${name}`, isJoining ? "success" : "info");
  };

  const handleSearch = () => {
    if (!searchQuery) return;
    toast(`Initiating Sector Scan for "${searchQuery}"...`, "brand");
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-40 px-10 md:px-12 lg:pl-80 relative overflow-hidden font-jakarta">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[1000px] bg-primary/[0.01] blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10 text-foreground">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
          <div className="inline-flex items-center gap-4 px-10 py-3 bg-primary/5 rounded-full border border-primary/10 text-primary font-bold text-xs uppercase tracking-[0.4em] mb-4">
             <Globe className="w-6 h-6" />
             Community Discovery
          </div>
          <h1 className="text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none text-foreground drop-shadow-2xl">
            Explore <span className="text-primary italic">Swaynix</span>
          </h1>
          <p className="text-3xl font-medium text-muted-foreground/60 max-w-4xl mx-auto leading-tight">Find and connect with any of our 22 interest categories. Discover real people matching your vibe.</p>
        </motion.div>

        {/* Search Interface */}
        <div className="max-w-4xl mx-auto relative group">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-10 h-10 text-muted-foreground group-focus-within:text-foreground transition-all duration-300" />
          <Input
            placeholder="Search for communities or topics..."
            className="pl-24 h-28 bg-white border-4 border-primary/5 rounded-[3.5rem] text-3xl font-bold shadow-premium focus:border-primary/20 transition-all pr-64 text-foreground"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="absolute right-4 top-1/2 -translate-y-1/2 h-20 bg-primary text-white border-none rounded-[2rem] font-bold text-2xl px-12 shadow-2xl transition-all">
            SEARCH
          </button>
        </div>

        {/* Navigation Control */}
        <div className="flex justify-center flex-wrap gap-6">
          {[
            { id: "discover", label: "Discover", icon: Compass },
            { id: "categories", label: "Categories", icon: Target },
            { id: "nearby", label: "Nearby", icon: MapPin },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-4 px-12 py-6 rounded-[2.5rem] font-bold text-xl tracking-tighter transition-all border-2 ${
                activeTab === tab.id
                  ? "bg-primary text-white border-primary shadow-premium scale-105"
                  : "bg-white text-muted-foreground border-primary/5 hover:border-primary/20 shadow-sm"
              }`}
            >
              <tab.icon className="w-7 h-7" /> {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "discover" && (
            <motion.div key="discover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-24">
              <div>
                <div className="flex items-end justify-between mb-12">
                   <h2 className="text-5xl font-bold text-foreground flex items-center gap-6 tracking-tighter">
                    <Crown className="w-12 h-12 text-amber-500" /> Popular Hubs
                   </h2>
                   <Badge className="bg-primary/5 text-primary border-none font-bold text-xs uppercase tracking-[0.3em] px-8 py-3 rounded-full">TOTAL COMMUNITIES: 22</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {COHORTS.map((cohort, idx) => (
                    <Link key={cohort.id} href={`/cohort/${cohort.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -10 }}
                        className="group"
                      >
                        <Card className="overflow-hidden border-8 border-white shadow-premium rounded-[4rem] bg-white ring-1 ring-primary/5 transition-all group-hover:shadow-[0_40px_80px_rgba(249,115,22,0.15)] group-hover:ring-primary/20">
                          <div className="h-64 relative overflow-hidden">
                            <img src={cohort.image} alt={cohort.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-125" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                            <div className="absolute bottom-6 left-8 flex items-center gap-4">
                               <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-[1.2rem] flex items-center justify-center text-3xl shadow-lg border border-primary/10">{CATEGORIES.find(c => c.id === cohort.category)?.icon || "🛰️"}</div>
                               <div>
                                  <Badge className="bg-swaynix-gradient text-foreground font-black italic text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/10">{cohort.category}</Badge>
                                  <p className="text-foreground font-black italic text-xs uppercase tracking-widest mt-1 opacity-70 drop-shadow-sm">IDENTIFIED SECTOR</p>
                               </div>
                            </div>
                          </div>
                          <CardContent className="p-10 space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold text-foreground tracking-tighter leading-none mb-3">{cohort.name} Hub</h3>
                                <p className="text-muted-foreground font-medium text-lg leading-relaxed line-clamp-2">"{cohort.description}"</p>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                              <span className="text-lg font-bold text-foreground flex items-center gap-3">
                                <Users className="w-6 h-6 text-primary" /> {(cohort.members / 1000).toFixed(1)}K <span className="text-muted-foreground opacity-40">Members</span>
                              </span>
                              <Button 
                                className={`rounded-[1.5rem] font-bold text-lg px-8 h-14 shadow-xl transition-all ${joinedCohorts.includes(cohort.id) ? 'bg-green-500 text-white' : 'bg-primary text-white hover:translate-y-[-2px]'}`}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleJoin(cohort.id, cohort.name); }}
                              >
                                {joinedCohorts.includes(cohort.id) ? "Joined" : "Join Hub"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Top Contributors Section */}
              <div className="pt-20">
                <div className="flex items-end justify-between mb-12">
                   <h2 className="text-5xl font-black italic text-foreground flex items-center gap-6 tracking-tighter leading-none">
                    <Sparkles className="w-12 h-12 text-primary animate-pulse" /> Top Contributors
                   </h2>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1 leading-none">PLATFORM STATUS</p>
                      <p className="text-muted-foreground font-black italic text-lg opacity-40 tracking-tighter leading-none">High-Intensity Human Activity</p>
                   </div>
                </div>
                
                <div className="flex gap-10 overflow-x-auto pb-12 scrollbar-hide px-4">
                  {TRENDING_USERS.map((user, idx) => (
                    <motion.div key={user.handle} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} className="flex-shrink-0">
                      <Card className="w-72 bg-white border-8 border-white shadow-premium rounded-[4rem] p-12 text-center group active:scale-95 transition-all ring-1 ring-primary/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-swaynix-gradient" />
                        <Link href={`/profile/${user.handle}`} className="block">
                          <Avatar className="w-32 h-32 mx-auto mb-8 border-4 border-white shadow-2xl transition-transform group-hover:scale-110 cursor-pointer">
                            <AvatarImage src={user.avatar} className="object-cover" />
                            <AvatarFallback className="bg-primary text-white font-black italic text-4xl">{user.name[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <Link href={`/profile/${user.handle}`} className="hover:text-primary transition-colors">
                          <h3 className="text-2xl font-bold text-foreground tracking-tighter mb-1">{user.name}</h3>
                        </Link>
                        <p className="text-primary font-bold text-sm mb-6 tracking-widest opacity-60">@{user.handle}</p>
                        <Badge className="bg-primary/5 text-foreground border-none font-bold uppercase tracking-[0.2em] text-[8px] px-4 py-2 rounded-full mb-8">
                           CATEGORY: {CATEGORIES.find(c => c.id === user.category)?.label || "Platform"}
                        </Badge>
                        <Button 
                          variant={connections.includes(user.handle) ? "outline" : "default"}
                          className={`w-full h-16 rounded-[1.5rem] font-bold text-lg shadow-xl transition-all ${!connections.includes(user.handle) ? 'bg-primary text-white hover:translate-y-[-2px]' : 'border-primary/20 text-primary'}`}
                          onClick={() => { toggleConnection(user.handle, user.name); }}
                        >
                          {connections.includes(user.handle) ? <UserCheck className="w-5 h-5 mr-3" /> : <Zap className="w-5 h-5 mr-3" />}
                          {connections.includes(user.handle) ? "CONNECTED" : "CONNECT"}
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "categories" && (
            <motion.div key="categories" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {CATEGORIES.map((cat, idx) => (
                <Link key={cat.id} href={`/explore/categories/${cat.id}`}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="flex flex-col items-center p-12 bg-white/80 backdrop-blur-3xl rounded-[4rem] border shadow-premium hover:shadow-2xl transition-all group border-primary/5 text-center relative overflow-hidden cursor-pointer h-full"
                  >
                    <div className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-primary/5 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700" />
                    <div className="w-24 h-24 bg-primary/5 rounded-[2rem] mb-10 flex items-center justify-center text-6xl shadow-xl transition-transform group-hover:rotate-12 group-hover:scale-110">{cat.icon}</div>
                    <h3 className="text-3xl font-black italic tracking-tighter text-foreground mb-4 leading-none">{cat.label}</h3>
                    <p className="text-muted-foreground font-black italic tracking-[0.2em] text-[10px] uppercase mb-2">{cat.posts.toLocaleString()} ACTIVE SIGNALS</p>
                    <span className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                      Sub-niches <ChevronRight className="w-3 h-3" />
                    </span>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}

          {activeTab === "nearby" && (
            <motion.div key="nearby" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold text-foreground tracking-tighter mb-2 flex items-center gap-3">
                  <MapPin className="w-10 h-10 text-primary" />
                  People near you
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Connect to add them to your profile. Open a profile to see their bio and posts.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {listNearbyPeople().map((person, idx) => (
                  <motion.div
                    key={person.handle}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="border-8 border-white shadow-premium rounded-[3rem] bg-white ring-1 ring-primary/5 overflow-hidden h-full flex flex-col">
                      <CardContent className="p-8 flex flex-col flex-1 gap-4">
                        <div className="flex items-center gap-4">
                          <Link href={`/profile/${person.handle}`}>
                            <Avatar className="w-16 h-16 border-2 border-primary/10 shadow-md hover:ring-2 hover:ring-primary/30 transition-all">
                              <AvatarImage src={person.avatar} className="object-cover" />
                              <AvatarFallback className="bg-primary text-white font-bold">{person.name[0]}</AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="min-w-0 flex-1">
                            <Link href={`/profile/${person.handle}`} className="hover:text-primary transition-colors">
                              <h3 className="text-xl font-bold text-foreground truncate">{person.name}</h3>
                            </Link>
                            <p className="text-primary font-bold text-sm truncate">@{person.handle}</p>
                            <p className="text-xs text-muted-foreground font-medium mt-1">{person.city}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{person.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {person.interests.slice(0, 3).map((t) => (
                            <Badge key={t} variant="outline" className="rounded-full border-primary/15 text-[10px] font-bold">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant={connections.includes(person.handle) ? "outline" : "default"}
                            className={`flex-1 rounded-2xl font-bold h-12 ${connections.includes(person.handle) ? "border-primary/30" : ""}`}
                            onClick={() => {
                              toggleConnection(person.handle, person.name);
                              const next = !connections.includes(person.handle);
                              toast(next ? `Connected with ${person.name}` : `Disconnected`, next ? "success" : "info");
                            }}
                          >
                            {connections.includes(person.handle) ? (
                              <>
                                <UserCheck className="w-4 h-4 mr-2" /> Connected
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4 mr-2" /> Connect
                              </>
                            )}
                          </Button>
                          <Button variant="secondary" className="rounded-2xl font-bold h-12 px-5 bg-primary/5" asChild>
                            <Link href={`/profile/${person.handle}`}>View</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">City radar</h3>
                <div className="h-[560px] rounded-[4rem] overflow-hidden border-8 border-white shadow-premium ring-1 ring-primary/5">
                  <LocationMap />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-40 text-center relative z-0">
         <p className="text-muted-foreground font-black italic text-lg uppercase tracking-[0.4em] opacity-10">END OF SECTOR MAPPING. RE-CALIBRATE RADAR TO CONTINUE SCANNING.</p>
      </div>
    </div>
  );
}
