"use client";

import { useAuth, Post, Ad } from "@/components/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Users,
  Target,
  BarChart3,
  TrendingUp,
  ShoppingBag,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  MousePointer2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import { getPublicProfile } from "@/lib/public-profiles";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, posts, ads, joinedCohorts, connections } = useAuth();
  if (!user) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center font-inter">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto animate-pulse">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <p className="text-muted-foreground font-bold text-xl uppercase tracking-tighter">Please Login</p>
          <Button onClick={() => router.push('/login')} className="bg-primary text-white font-bold rounded-2xl h-14 px-10 shadow-xl hover:scale-105 transition-all outline-none">Login Now</Button>
        </div>
      </div>
    );
  }

  const isBusiness = user.role === "business";
  const userPosts = posts.filter((post: Post) => post.userId === user.id);
  const userAds = ads.filter((ad: Ad) => ad.brand === user.name);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72 font-inter">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="h-48 md:h-72 bg-swaynix-gradient rounded-[4rem] relative overflow-hidden border border-black/5">
            <div className="absolute inset-0 opacity-10 flex flex-wrap gap-8 p-12 pointer-events-none">
              {Array.from({length: 30}).map((_, i) => <Sparkles key={i} className="w-12 h-12 text-foreground/10 rotate-12" />)}
            </div>
          </div>

          <Card className="mx-6 md:mx-16 -mt-32 border border-primary/10 shadow-premium rounded-[3.5rem] bg-white overflow-hidden pb-12">
            <CardContent className="p-0">
              <div className="flex flex-col items-center text-center p-12">
                <div className="relative">
                  <Avatar className="w-40 h-40 md:w-56 md:h-56 border-8 border-white shadow-premium -mt-24 transition-transform hover:rotate-6">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="bg-primary text-white text-5xl font-bold">
                      {user.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isBusiness && (
                    <Badge className="absolute bottom-6 right-0 bg-primary text-white border-4 border-white font-bold px-6 py-2 rounded-full shadow-2xl tracking-widest uppercase text-[10px]">
                      VERIFIED BUSINESS
                    </Badge>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-none">{user.name}</h1>
                    {isBusiness && <ShieldCheck className="w-8 h-8 text-primary" />}
                  </div>
                  <p className="text-primary font-bold text-2xl tracking-tight leading-none">@{user.handle}</p>
                  
                  <div className="flex flex-wrap justify-center gap-12 py-8">
                    <StatItem value={isBusiness ? userAds.length : userPosts.length} label={isBusiness ? "Ads" : "Posts"} />
                    <StatItem value={isBusiness ? "1.2M" : connections.length} label={isBusiness ? "Reach" : "Connections"} />
                    <StatItem value={isBusiness ? "85K" : "2.1K"} label={isBusiness ? "Engagement" : "Likes"} />
                  </div>

                  <p className="max-w-2xl text-muted-foreground font-medium text-xl leading-relaxed mx-auto">
                    {isBusiness 
                      ? `${user.name} official Swaynix business account. Quality sports gear and community engagement.`
                      : `Passionate about ${user.interests?.join(', ') || 'connecting with the world'}. Building the future of community-driven social spaces.`}
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest pt-8">
                    <span className="flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full border border-primary/10 shadow-sm"><MapPin className="w-4 h-4 text-primary" /> Location: India</span>
                    <span className="flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full border border-primary/10 shadow-sm"><LinkIcon className="w-4 h-4 text-primary" /> {user.name.toLowerCase().replace(' ', '')}.com</span>
                    <span className="flex items-center gap-3 bg-primary/5 px-6 py-3 rounded-full border border-primary/10 shadow-sm"><Calendar className="w-4 h-4 text-primary" /> Joined: 2024</span>
                  </div>
                </div>

                <div className="flex gap-6 mt-12">
                  <Button onClick={() => router.push('/settings')} className="bg-primary text-white font-bold h-16 px-12 rounded-[1.5rem] shadow-2xl hover:translate-y-[-2px] transition-all outline-none text-xl">Account Settings</Button>
                  {isBusiness && <Button className="bg-primary/10 text-primary font-bold h-16 px-12 rounded-[1.5rem] hover:bg-primary/20 transition-all text-xl" onClick={() => router.push('/business/leads')}>Ad Dashboard</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="content" className="space-y-12">
          <div className="flex justify-center">
            <TabsList
              className={`bg-primary/5 p-3 rounded-[2.5rem] h-auto min-h-[5rem] w-full border border-primary/10 shadow-inner gap-2 ${
                isBusiness ? "max-w-xl grid grid-cols-2" : "max-w-4xl grid grid-cols-3"
              }`}
            >
              <TabsTrigger
                value="content"
                className={`rounded-[1.8rem] font-bold text-lg md:text-xl py-3 h-full transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl`}
              >
                {isBusiness ? "Active Ads" : "My Posts"}
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className={`rounded-[1.8rem] font-bold text-lg md:text-xl py-3 h-full transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl`}
              >
                {isBusiness ? "Analytics" : "My Hubs"}
              </TabsTrigger>
              {!isBusiness && (
                <TabsTrigger
                  value="connections"
                  className="rounded-[1.8rem] font-bold text-lg md:text-xl py-3 h-full transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl"
                >
                  Connections
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="content" className="focus-visible:ring-0 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-20">
              {isBusiness ? (
                userAds.length === 0 ? (
                  <EmptyState label="No Active Ads" />
                ) : (
                  userAds.map((ad, idx) => <ProfileAdCard key={ad.id} ad={ad} delay={idx * 0.1} />)
                )
              ) : userPosts.length === 0 ? (
                <EmptyState label="No posts yet" />
              ) : (
                userPosts.map((post, idx) => <ProfilePostCard key={post.id} post={post} delay={idx * 0.1} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="focus-visible:ring-0 mt-0">
            <Card className="border border-primary/10 shadow-premium rounded-[4rem] p-20 text-center bg-white border-dashed border-4">
              <BarChart3 className="w-20 h-20 text-primary mx-auto mb-8 opacity-20" />
              <h2 className="text-4xl font-bold tracking-tighter text-foreground">{isBusiness ? "Business Analytics" : "My Communities"}</h2>
              <p className="text-muted-foreground mt-4 font-medium text-xl max-w-xl mx-auto">
                {isBusiness
                  ? "Real-time data synchronization in progress. Your engagement metrics will be available in the next update."
                  : `You follow ${joinedCohorts.length} hub${joinedCohorts.length === 1 ? "" : "s"}. Open Explore to join more.`}
              </p>
              <Button
                onClick={() => toast("📊 Data Updated", "success")}
                className="mt-12 bg-primary/10 text-primary font-bold h-14 px-10 rounded-2xl transition-all hover:bg-primary/20"
              >
                Update Now
              </Button>
            </Card>
          </TabsContent>

          {!isBusiness && (
            <TabsContent value="connections" className="focus-visible:ring-0 mt-0 pb-20">
              {connections.length === 0 ? (
                <Card className="border border-primary/10 rounded-[3rem] p-16 text-center shadow-premium">
                  <Users className="w-16 h-16 text-primary/30 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">No connections yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Use Explore → Nearby or Top Contributors to connect. People you connect with appear here and on your stats.
                  </p>
                  <Button asChild className="rounded-2xl font-bold h-12 px-8">
                    <Link href="/explore">Open Explore</Link>
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {connections.map((handle) => {
                    const p = getPublicProfile(handle);
                    return (
                      <Card
                        key={handle}
                        className="border border-primary/10 shadow-premium rounded-[2.5rem] p-6 flex items-center gap-5 hover:ring-2 hover:ring-primary/15 transition-all"
                      >
                        <Link href={`/profile/${handle}`}>
                          <Avatar className="w-16 h-16 border-2 border-primary/10">
                            <AvatarImage src={p?.avatar} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {(p?.name || handle)[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link href={`/profile/${handle}`} className="hover:text-primary">
                            <p className="font-bold text-lg text-foreground truncate">{p?.name || handle}</p>
                          </Link>
                          <p className="text-primary text-sm font-semibold truncate">@{handle}</p>
                          {p?.city && <p className="text-xs text-muted-foreground mt-1 truncate">{p.city}</p>}
                        </div>
                        <Button asChild variant="outline" className="rounded-xl border-primary/20 font-bold shrink-0">
                          <Link href={`/profile/${handle}`}>View</Link>
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

function StatItem({ value, label }: any) {
  return (
    <div className="text-center group">
      <p className="text-4xl font-bold text-foreground tracking-tighter group-hover:text-primary transition-colors leading-none mb-2">{value}</p>
      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-60 leading-none">{label}</p>
    </div>
  );
}

function ProfileAdCard({ ad, delay }: { ad: Ad, delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring", stiffness: 100 }}>
      <Card className="border border-primary/10 shadow-premium rounded-[3rem] overflow-hidden bg-white hover:shadow-2xl transition-all group">
        <div className="relative overflow-hidden h-64">
          <img src={ad.image} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
          <Badge className="absolute top-6 left-6 bg-primary text-white font-bold px-5 py-1.5 rounded-full shadow-2xl tracking-widest text-[9px] uppercase">ACTIVE AD</Badge>
        </div>
        <div className="p-8 space-y-6">
          <h3 className="text-3xl font-bold tracking-tight text-foreground leading-none">{ad.title}</h3>
          <div className="flex items-center justify-between pt-2 border-t border-primary/5">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary tracking-tighter">₹{ad.price.toLocaleString()}</span>
              <span className="text-sm line-through text-muted-foreground font-bold opacity-30">₹{ad.originalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
               <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
               <span className="font-bold text-xl text-foreground">{ad.likes}</span>
            </div>
          </div>
          <Button onClick={() => (window as any).location.href = '/business/analytics'} className="w-full h-14 bg-primary/5 text-foreground font-bold rounded-2xl hover:bg-primary hover:text-white border-none transition-all shadow-sm">Ad Performance</Button>
        </div>
      </Card>
    </motion.div>
  );
}

function ProfilePostCard({ post, delay }: { post: Post, delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, type: "spring", stiffness: 100 }}>
      <Card className="border border-primary/10 shadow-premium rounded-[3rem] p-10 bg-white space-y-6 hover:shadow-2xl transition-all group">
        <p className="text-2xl font-medium text-foreground leading-relaxed group-hover:text-black transition-colors">{post.content}</p>
        {post.image && <div className="rounded-[2rem] overflow-hidden shadow-lg border border-black/5"><img src={post.image} className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105" /></div>}
        <div className="flex justify-between items-center text-muted-foreground pt-6 border-t border-primary/5">
           <div className="flex gap-8">
              <span className="flex items-center gap-3 font-bold text-lg leading-none transition-colors group-hover:text-rose-500"><Heart className="w-6 h-6 text-rose-500" /> {post.likes}</span>
              <span className="flex items-center gap-3 font-bold text-lg leading-none transition-colors group-hover:text-primary"><MessageCircle className="w-6 h-6 text-primary" /> {post.comments}</span>
           </div>
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">{post.time}</p>
        </div>
      </Card>
    </motion.div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full py-32 text-center space-y-8">
      <div className="w-24 h-24 bg-primary/5 rounded-[3rem] flex items-center justify-center mx-auto"><PlusCircle className="w-12 h-12 text-primary/30" /></div>
      <p className="text-muted-foreground font-bold text-3xl uppercase tracking-tighter opacity-20">{label}</p>
      <Button onClick={() => (window as any).location.reload()} className="bg-primary text-white font-bold h-16 px-12 rounded-[2rem] shadow-2xl hover:scale-105 transition-all outline-none text-xl">Refresh Feed</Button>
    </div>
  );
}
