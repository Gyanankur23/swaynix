"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, Post, Ad, Comment } from "@/components/auth-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import {
  Heart,
  MessageCircle,
  Link as LinkIcon,
  ShoppingBag,
  ExternalLink,
  TrendingUp,
  Users,
  PlusCircle,
  X,
  Image as ImageIcon,
  DollarSign,
  Shield,
  ShieldCheck,
  MousePointer2,
  Zap,
  Target,
  ChevronUp,
  MoreHorizontal,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function FeedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, posts, ads, likePost } = useAuth();
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  // Redirect to onboarding if new user without interests (members only)
  useEffect(() => {
    if (user && user.role === "member" && (!user.interests || user.interests.length === 0)) {
      router.push("/onboarding");
    }
  }, [user, router]);

  const filteredPosts = useMemo(() => {
    if (user?.role === "business") return Array.from(posts).filter(p => p.userId === user.id);
    if (!user?.interests || user.interests.length === 0) return Array.from(posts);
    return Array.from(posts).filter(post => {
      const postTags = post.tags || [];
      const postCommunity = post.community?.toLowerCase() || "";
      return user.interests?.some(interest => {
        const interestLower = interest.toLowerCase();
        return postTags.some(tag => tag.toLowerCase().includes(interestLower)) ||
               postCommunity.includes(interestLower) ||
               post.content.toLowerCase().includes(interestLower);
      });
    });
  }, [posts, user?.interests, user?.role, user?.id]);

  const toggleSave = (id: string) => {
    setSavedPosts(prev => {
      const newSet = new Set(prev);
      const isRemoving = newSet.has(id);
      if (isRemoving) newSet.delete(id); else newSet.add(id);
      toast(isRemoving ? "Removed from Saved" : "Added to Saved Posts", "brand");
      return newSet;
    });
  };

  const handleLike = (id: string) => {
    likePost(id);
    toast("Liked!", "success");
  };

  const feedItems: any[] = [];
  const adsArray = Array.from(ads);
  if (filteredPosts.length > 0) {
    filteredPosts.forEach((post, i) => {
      feedItems.push({ type: "post", data: post, index: i });
      if ((i + 1) % 4 === 0) {
        const adIndex = Math.floor(i / 4) % adsArray.length;
        feedItems.push({ type: "ad", data: adsArray[adIndex], index: i });
      }
    });
  } else {
    adsArray.slice(0, 3).forEach((ad, i) => feedItems.push({ type: "ad", data: ad, index: i }));
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72 lg:pr-[32rem] font-jakarta">
      <div className="max-w-3xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
              <Badge className="bg-primary/20 text-foreground border-primary/20 font-bold text-[10px] tracking-widest px-4 py-1 rounded-full uppercase">Feed</Badge>
              <h1 className="text-5xl font-bold tracking-tighter text-foreground leading-none">{user?.role === 'business' ? 'Business Dashboard' : 'Your Feed'}</h1>
              <p className="text-muted-foreground font-semibold text-sm opacity-60 uppercase tracking-widest">Stay updated with your communities</p>
           </div>
           <div className="flex gap-4">
              {user?.role === "business" ? (
                <>
                   <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-primary/10 text-primary font-black italic shadow-xl hover:bg-primary/5" onClick={() => router.push('/business/leads')}>Dashboard</Button>
                   <CreateAdModal />
                </>
              ) : (
                <CreatePostModal />
              )}
           </div>
        </div>

        <div className="space-y-10 pb-20 text-foreground">
          <AnimatePresence mode="popLayout">
            {user?.role === "admin" ? (
              <Card className="p-16 text-center border shadow-premium rounded-[3rem] bg-white border-primary/10">
                <ShieldCheck className="w-16 h-16 mx-auto text-primary mb-6" />
                <h2 className="text-3xl font-bold tracking-tighter">Admin View Active</h2>
                <p className="text-muted-foreground font-medium mt-2 max-w-sm mx-auto">Privacy protection is active. Sensitive user data is hidden from view.</p>
                <Button onClick={() => router.push('/admin')} className="mt-10 h-16 px-10 rounded-[1.5rem] bg-foreground text-background font-bold text-xl shadow-2xl">Enter Admin Dashboard</Button>
              </Card>
            ) : (
              feedItems.map((item, idx) => (
                <motion.div key={item.data.id + item.type} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}>
                  {item.type === "post" ? (
                    <PostCard post={item.data} liked={item.data.likedBy.includes(user?.id)} saved={savedPosts.has(item.data.id)} onLike={() => handleLike(item.data.id)} onSave={() => toggleSave(item.data.id)} />
                  ) : (
                    <AdCard ad={item.data} />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <aside className="fixed top-24 right-8 w-96 z-10 hidden xl:flex flex-col gap-8 h-[calc(100vh-8rem)]">
         <Card className="border shadow-premium rounded-[2.5rem] p-8 bg-primary/5 text-foreground relative overflow-hidden group border-primary/10">
            <div className="relative z-10 space-y-6">
                <div>
                    <h3 className="text-3xl font-bold tracking-tighter leading-none">Trending Hubs</h3>
                    <p className="text-foreground/70 font-medium text-sm mt-2 leading-relaxed">Join the most active community of the week.</p>
                </div>
                <Button className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-xl hover:scale-105 transition-all border-none">Join Now</Button>
            </div>
         </Card>

         <Card className="border shadow-premium rounded-[2.5rem] p-8 bg-white flex-1 overflow-hidden">
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-6"><Zap className="w-6 h-6 text-primary" /> New Communities</h3>
            <div className="space-y-6">
                {['Travel India', 'Code Mumbai', 'Desi Beats', 'Bhangra Dance'].map((hub, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-transform">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center font-black italic text-primary group-hover:bg-primary group-hover:text-white transition-all">{hub[0]}</div>
                            <p className="font-bold text-foreground italic">{hub}</p>
                        </div>
                        <ChevronUp className="w-5 h-5 text-green-500" />
                    </div>
                ))}
            </div>
         </Card>
      </aside>
    </div>
  );
}

function PostCard({ post, liked, saved, onLike, onSave }: any) {
  return (
    <Card className="border shadow-premium rounded-[2.5rem] bg-white/80 backdrop-blur-md overflow-hidden hover:shadow-2xl transition-all border-primary/5 group">
      <div className="p-6 flex items-center justify-between border-b border-primary/5 bg-primary/[0.01]">
         <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-4 border-white shadow-lg group-hover:scale-110 transition-transform">
               <AvatarImage src={post.authorAvatar} />
               <AvatarFallback className="bg-primary text-white font-black italic uppercase">{post.author.slice(0,2)}</AvatarFallback>
            </Avatar>
            <div>
               <p className="font-black italic text-xl text-foreground tracking-tight leading-none mb-1">{post.author}</p>
               <div className="flex items-center gap-2">
                 <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">@{post.authorHandle}</p>
                 <Badge className="bg-muted text-muted-foreground border-none font-black italic text-[9px] px-3 py-1 rounded-full uppercase tracking-widest">{post.community}</Badge>
               </div>
            </div>
         </div>
         <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="w-6 h-6 text-muted/30" /></Button>
      </div>
      <div className="p-8 space-y-6">
         <p className="text-xl font-medium text-foreground leading-relaxed italic">{post.content}</p>
         {post.image && <div className="rounded-[2.5rem] overflow-hidden border shadow-inner transition-transform hover:scale-[1.02] duration-500 cursor-zoom-in"><img src={post.image} className="w-full aspect-[16/10] object-cover" /></div>}
      </div>
      <div className="p-8 pt-0 flex justify-between items-center text-muted-foreground h-20 border-t border-primary/5 bg-primary/[0.01]">
         <div className="flex gap-10">
            <button onClick={onLike} className="flex flex-col items-center group/btn active:scale-90 transition-transform">
               <Heart className={`w-7 h-7 mb-1 transition-all ${liked ? 'fill-red-500 text-red-500 scale-125' : 'group-hover/btn:text-red-500'}`} /> 
               <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{post.likes} Likes</span>
            </button>
            <CommentDialog post={post} />
         </div>
         <button onClick={onSave} className="active:scale-90 transition-transform">
            <Bookmark className={`w-8 h-8 ${saved ? 'fill-primary text-primary' : 'hover:text-primary'} transition-all`} />
         </button>
      </div>
    </Card>
  );
}

function CommentDialog({ post }: { post: Post }) {
  const { addComment } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState("");
  const handleSubmit = () => {
    if (!comment.trim()) return;
    addComment(post.id, comment);
    setComment("");
    toast("Comment posted!", "success");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center group/btn active:scale-90 transition-transform">
          <MessageCircle className="w-7 h-7 mb-1 group-hover/btn:text-primary transition-colors" /> 
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{post.comments} comments</span>
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 rounded-[3rem] border-none shadow-2xl overflow-hidden max-w-xl bg-white">
        <div className="p-10 bg-primary/5 text-foreground">
           <h2 className="text-3xl font-bold tracking-tighter leading-none">Comments</h2>
           <p className="text-foreground/80 font-bold text-[10px] uppercase tracking-widest mt-1">Total replies: {post.comments}</p>
        </div>
        <ScrollArea className="max-h-[400px] p-8">
           <div className="space-y-6">
              {post.commentsList.map((c) => (
                <div key={c.id} className="flex gap-4 group">
                   <Avatar className="w-10 h-10 border-2 border-primary/5"><AvatarImage src={c.authorAvatar} /><AvatarFallback>{c.author[0]}</AvatarFallback></Avatar>
                   <div className="flex-1 bg-muted/20 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex justify-between">
                         <p className="font-black italic text-sm text-foreground">@{c.authorHandle}</p>
                         <p className="text-[9px] font-bold text-muted-foreground uppercase">{c.time}</p>
                      </div>
                      <p className="text-sm font-medium mt-1 italic">{c.content}</p>
                   </div>
                </div>
              ))}
           </div>
        </ScrollArea>
        <div className="p-8 border-t bg-muted/10 space-y-4">
           <Textarea placeholder="Write a comment..." className="min-h-[100px] border-none bg-white rounded-2xl p-4 shadow-inner text-sm font-medium focus:ring-0" value={comment} onChange={e => setComment(e.target.value)} />
           <Button className="w-full h-12 bg-primary text-white font-bold rounded-xl shadow-lg" onClick={handleSubmit}>Post Comment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreatePostModal() {
  const { addPost } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleCreate = () => { if (!content.trim()) return; addPost(content); setContent(""); setIsOpen(false); toast("Post shared with the community!", "success"); };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button className="h-14 px-10 rounded-2xl bg-primary text-white font-bold text-xl shadow-xl hover:scale-105 transition-all outline-none"><PlusCircle className="w-6 h-6 mr-3" /> New Post</Button></DialogTrigger>
      <DialogContent className="p-0 rounded-[3rem] border-none shadow-2xl overflow-hidden max-w-2xl bg-white">
        <div className="p-10 bg-primary/5 text-foreground relative">
            <h2 className="text-4xl font-bold tracking-tighter leading-none">Create Post</h2>
            <p className="text-foreground/80 font-bold text-sm mt-1 uppercase tracking-widest">Share with the community</p>
        </div>
        <div className="p-10 space-y-6">
            <Textarea placeholder="What's on your mind?..." className="min-h-[200px] border-none bg-muted/20 rounded-[2rem] p-8 text-xl font-medium focus:ring-0" value={content} onChange={e => setContent(e.target.value)} />
            <div className="flex gap-4">
                 <Button variant="ghost" className="h-16 w-16 rounded-2xl border-2 border-muted hover:bg-muted" onClick={() => toast("Image upload coming soon!", "info")}><ImageIcon className="w-7 h-7 text-primary" /></Button>
                 <Button className="flex-1 h-16 bg-primary text-white font-bold rounded-2xl text-xl shadow-xl transition-all hover:translate-y-[-2px]" onClick={handleCreate}>Post Story</Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateAdModal() {
  const { addAd, user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ title: "Decathlon Monsoon Sport", description: "Get the best waterproof hiking gear.", image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600", price: "2890", link: "https://decathlon.in", community: "Sports", genre: "Trekking" });
  
  const handleCreate = () => { 
    if (!form.title || !form.image || !form.price || !form.link) return; 
    addAd(form.title, form.description, form.image, parseFloat(form.price), form.link); 
    setIsOpen(false); 
    toast("Ad created successfully!", "success");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button className="h-14 px-10 rounded-2xl bg-primary text-white shadow-xl hover:scale-105 transition-all outline-none font-bold text-xl">Create Ad</Button></DialogTrigger>
      <DialogContent className="p-0 rounded-[3.5rem] max-w-5xl shadow-2xl border-none overflow-hidden bg-white">
        <div className="flex flex-col lg:flex-row h-full">
           {/* Form Section */}
           <div className="flex-1 p-12 space-y-8 bg-muted/10">
              <div className="space-y-1">
                 <h2 className="text-4xl font-bold text-primary leading-none tracking-tighter">Ad Creator</h2>
                 <p className="text-muted-foreground font-bold text-[10px] tracking-widest uppercase">Targeting: {form.community}</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-3">Target Genre</label><Input className="h-12 rounded-xl bg-white border shadow-sm font-bold" value={form.genre} onChange={e => setForm({...form, genre: e.target.value})} /></div>
                   <div className="space-y-1.5"><label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-3">Currency (INR)</label><Input className="h-12 rounded-xl bg-white border shadow-sm font-bold" value={form.price} onChange={e => setForm({...form, price: e.target.value})} type="number" /></div>
                </div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-3">Ad Title</label><Input className="h-12 rounded-xl bg-white border shadow-sm font-bold" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-3">Description</label><Textarea className="h-28 rounded-xl bg-white border shadow-sm font-medium resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-3">Image Link</label><Input className="h-12 rounded-xl bg-white border shadow-sm font-medium" value={form.image} onChange={e => setForm({...form, image: e.target.value})} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest pl-3">Website Link</label><Input className="h-12 rounded-xl bg-white border shadow-sm font-medium" value={form.link} onChange={e => setForm({...form, link: e.target.value})} /></div>
              </div>
              <Button className="w-full h-16 bg-primary text-white font-bold rounded-2xl shadow-xl text-xl hover:translate-y-[-2px] transition-all" onClick={handleCreate}>Launch Ad</Button>
           </div>
           
           {/* Live Preview Section - The Spark! */}
           <div className="flex-1 bg-primary/5 p-12 border-l border-primary/5 relative">
              <div className="sticky top-0 h-full flex flex-col items-center">
                 <Badge className="bg-primary/20 text-foreground font-bold px-4 py-1.5 rounded-full mb-8 shadow-xl">Ad Preview</Badge>
                 <div className="w-full transform scale-90 md:scale-100">
                    <Card className="border shadow-2xl rounded-[2.5rem] bg-white overflow-hidden max-w-sm mx-auto border-primary/20">
                        <div className="p-5 flex items-center justify-between border-b bg-muted/10">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 bg-white border p-1"><AvatarImage src={user?.avatar} /><AvatarFallback className="bg-primary text-white font-bold">{user?.name?.[0]}</AvatarFallback></Avatar>
                                <div><p className="font-bold text-sm tracking-tight">{user?.name}</p><p className="text-[9px] font-bold text-primary tracking-widest uppercase">Sponsored</p></div>
                            </div>
                            <Button size="sm" variant="outline" className="h-8 rounded-full border-primary text-primary font-bold text-[10px]"><ShoppingBag className="w-3 h-3 mr-1" /> SHOP</Button>
                        </div>
                        <div className="relative">
                            <img src={form.image || "https://images.unsplash.com/photo-1544256718-3bcf237f3974"} className="w-full aspect-video object-cover" />
                            <div className="absolute top-4 left-4 bg-white/80 text-foreground font-bold px-4 py-1 rounded-full text-[9px] border shadow-lg">AD</div>
                        </div>
                        <div className="p-6 space-y-3">
                            <h3 className="text-xl font-bold tracking-tight leading-tight text-foreground">{form.title || "Ad Title"}</h3>
                            <p className="text-muted-foreground font-medium text-xs line-clamp-2">{form.description || "Your ad description here."}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-muted">
                                <p className="text-2xl font-bold text-primary tracking-tighter">₹{parseInt(form.price).toLocaleString()}</p>
                                <Button className="h-10 px-6 rounded-full bg-primary text-white font-bold text-xs shadow-lg">Shop Now</Button>
                            </div>
                        </div>
                    </Card>
                 </div>
                 <div className="mt-12 flex flex-col items-center gap-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mt-4">Previewing your ad</p>
                 </div>
              </div>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdCard({ ad }: { ad: Ad }) {
  const { toast } = useToast();
  const handleShop = () => { toast(`Opening ${ad.brand}...`, "info"); setTimeout(() => window.open(ad.link, '_blank'), 1200); };
  return (
    <Card className="border shadow-premium rounded-[3rem] bg-white overflow-hidden hover:shadow-2xl transition-all border-primary/10">
      <div className="p-6 flex items-center justify-between border-b border-primary/10 bg-primary/5">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 bg-white p-2 border-2 border-primary/10">
            <AvatarImage src={ad.brandLogo} className="object-contain" />
            <AvatarFallback className="bg-primary text-white font-bold">{ad.brand[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-xl text-foreground tracking-tight mb-1 leading-none">{ad.brand}</p>
            <Badge className="bg-primary/10 text-foreground font-bold text-[9px] px-3 py-1 rounded-full uppercase tracking-widest">Verified Partner</Badge>
          </div>
        </div>
        <Button variant="outline" className="h-12 px-8 rounded-2xl border-2 border-primary text-primary font-bold shadow-sm" onClick={handleShop}><ShoppingBag className="w-5 h-5 mr-3" /> Shop Now</Button>
      </div>
      <div className="relative overflow-hidden cursor-pointer" onClick={handleShop}>
        <img src={ad.image} className="w-full aspect-[21/9] object-cover transition-transform duration-[2s] hover:scale-110" />
        <div className="absolute top-6 left-6 bg-white text-foreground font-bold px-6 py-2 rounded-full text-sm shadow-xl border border-primary/10">OFFER: {ad.discount}</div>
      </div>
      <div className="p-10 space-y-6">
        <div>
            <h3 className="text-4xl font-bold text-foreground tracking-tighter leading-none mb-3">{ad.title}</h3>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">{ad.description}</p>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-muted">
          <div className="flex flex-col">
             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Partner Price</p>
             <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold text-primary tracking-tighter">₹{ad.price.toLocaleString()}</span>
                <span className="text-xl text-muted-foreground line-through font-bold opacity-40">₹{ad.originalPrice.toLocaleString()}</span>
             </div>
          </div>
          <Button className="bg-primary text-white font-bold h-16 px-12 rounded-[2rem] shadow-xl text-xl hover:translate-y-[-4px] transition-all" onClick={handleShop}>View Product <ExternalLink className="w-5 h-5 ml-4" /></Button>
        </div>
      </div>
    </Card>
  );
}
