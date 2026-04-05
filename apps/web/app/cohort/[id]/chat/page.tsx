"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, Paperclip, Smile, Phone, Video, MoreVertical, 
  ArrowLeft, Users, Image as ImageIcon, Mic, Check, CheckCheck,
  Heart, Reply, ArrowDown, AlertCircle, X, Sparkles, Hash, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { llmService } from "@/lib/llm-service";
import { moderateMessage, type ModerationResult } from "@/lib/content-moderation";

// Indian community members with realistic profiles for all 22 cohorts
const COMMUNITY_MEMBERS: Record<string, Array<{id: string, name: string, avatar: string, role: string, bio: string}>> = {
  "travel-india": [
    { id: "m1", name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "traveler", bio: "Backpacker exploring hidden gems" },
    { id: "m2", name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "photographer", bio: "Capturing India's beauty" },
    { id: "m3", name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "guide", bio: "Local guide from Kerala" },
    { id: "m4", name: "Ananya Singh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "traveler", bio: "Solo female traveler" },
  ],
  "code-mumbai": [
    { id: "m1", name: "Rohan Gupta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "developer", bio: "Full stack dev at startup" },
    { id: "m2", name: "Sanya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "engineer", bio: "Backend engineer at Google" },
    { id: "m3", name: "Aditya Joshi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "founder", bio: "Tech founder & mentor" },
  ],
  "bollywood-beats": [
    { id: "m1", name: "Zara Khan", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "singer", bio: "Aspiring playback singer" },
    { id: "m2", name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "producer", bio: "Music producer & composer" },
  ],
  "dance-bhangra": [
    { id: "m1", name: "Harpreet Kaur", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "dancer", bio: "Professional Bhangra dancer" },
    { id: "m2", name: "Rajveer Singh", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "instructor", bio: "Dance academy owner" },
  ],
  "foodie-delhi": [
    { id: "m1", name: "Karthik Iyer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "chef", bio: "Home chef & biryani expert" },
    { id: "m2", name: "Neha Kumar", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "foodie", bio: "Street food hunter" },
  ],
  "shutterbugs": [
    { id: "m1", name: "Rahul Verma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "photographer", bio: "Wildlife photographer" },
    { id: "m2", name: "Neha Kapoor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "portrait", bio: "Portrait & wedding photographer" },
  ],
  "yoga-wellness": [
    { id: "m1", name: "Dr. Anjali Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "instructor", bio: "Yoga therapist & healer" },
    { id: "m2", name: "Ravi Shankar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "guru", bio: "Meditation teacher" },
  ],
  "art-culture": [
    { id: "m1", name: "Priya Menon", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "artist", bio: "Contemporary artist" },
    { id: "m2", name: "Arvind Rao", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "curator", bio: "Museum curator" },
  ],
  "cinema-club": [
    { id: "m1", name: "Fatima Khan", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "critic", bio: "Film critic & reviewer" },
    { id: "m2", name: "Rajesh Khanna", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "buff", bio: "Classic cinema enthusiast" },
  ],
  "book-worms": [
    { id: "m1", name: "Ananya Sen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "reader", bio: "Book reviewer & blogger" },
    { id: "m2", name: "Rohan Desai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "author", bio: "Aspiring novelist" },
  ],
  "game-on": [
    { id: "m1", name: "Nikhil Sharma", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "gamer", bio: "Esports competitor" },
    { id: "m2", name: "Sneha Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "streamer", bio: "Twitch streamer" },
  ],
  "startup-hub": [
    { id: "m1", name: "Kunal Shah", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "founder", bio: "Serial entrepreneur" },
    { id: "m2", name: "Nidhi Gupta", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "investor", bio: "Angel investor" },
  ],
  "cricket-fans": [
    { id: "m1", name: "Sourav Das", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "fanatic", bio: "Die-hard cricket fan" },
    { id: "m2", name: "Priya Banerjee", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "analyst", bio: "Cricket analyst" },
  ],
  "fashion-desi": [
    { id: "m1", name: "Ritu Kumar", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "designer", bio: "Fashion designer" },
    { id: "m2", name: "Arjun Kapoor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "stylist", bio: "Celebrity stylist" },
  ],
  "pets-india": [
    { id: "m1", name: "Anjali Shah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "parent", bio: "Dog mom to 3 Labradors" },
    { id: "m2", name: "Vivek Rao", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "vet", bio: "Veterinarian" },
  ],
  "career-growth": [
    { id: "m1", name: "Sanjay Gupta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "mentor", bio: "Career coach" },
    { id: "m2", name: "Neha Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "hr", bio: "HR professional" },
  ],
  "sustainability": [
    { id: "m1", name: "Dr. Ravi Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "activist", bio: "Climate activist" },
    { id: "m2", name: "Anita Singh", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "eco", bio: "Sustainable living coach" },
  ],
  "finance-tips": [
    { id: "m1", name: "CA Rajesh Gupta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "advisor", bio: "Chartered Accountant" },
    { id: "m2", name: "Priya Shah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "investor", bio: "Stock market investor" },
  ],
  "parenting-india": [
    { id: "m1", name: "Dr. Sunita Rao", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "pediatrician", bio: "Child specialist" },
    { id: "m2", name: "Rahul Khanna", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "dad", bio: "Father of two" },
  ],
  "home-decor": [
    { id: "m1", name: "Interior Ritu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "designer", bio: "Interior designer" },
    { id: "m2", name: "Arjun Patel", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "diy", bio: "DIY enthusiast" },
  ],
  "language-learn": [
    { id: "m1", name: "Prof. Anjali", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "teacher", bio: "Hindi professor" },
    { id: "m2", name: "John Smith", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "learner", bio: "Learning Hindi" },
  ],
  "mental-health": [
    { id: "m1", name: "Dr. Priya Rao", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "psychologist", bio: "Clinical psychologist" },
    { id: "m2", name: "Arun Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "counselor", bio: "Mental health counselor" },
  ],
  "default": [
    { id: "m1", name: "Community Member", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "member", bio: "Active community member" },
  ]
};

const COMMUNITY_PHOTOS: Record<string, string[]> = {
  "travel-india": ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"],
  "foodie-delhi": ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400"],
  "code-mumbai": ["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"],
  "bollywood-beats": ["https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400"],
  "dance-bhangra": ["https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=400"],
};

const COMMUNITY_INFO: Record<string, {name: string, icon: string, color: string, description: string}> = {
  "travel-india": { name: "Travel India", icon: "✈️", color: "#FF6B9D", description: "Discover hidden gems across India" },
  "code-mumbai": { name: "Code Mumbai", icon: "💻", color: "#00D4FF", description: "Mumbai's developer community" },
  "bollywood-beats": { name: "Bollywood Beats", icon: "🎵", color: "#9D4EDD", description: "Desi music lovers unite" },
  "dance-bhangra": { name: "Bhangra & Dance", icon: "💃", color: "#FF006E", description: "Punjabi beats and moves" },
  "foodie-delhi": { name: "Delhi Foodies", icon: "🍳", color: "#FB8500", description: "Street food to fine dining" },
  "shutterbugs": { name: "Indian Shutterbugs", icon: "📸", color: "#38B000", description: "Capture India's beauty" },
  "yoga-wellness": { name: "Yoga & Wellness", icon: "🧘", color: "#06FFB4", description: "Mind, body & soul" },
  "art-culture": { name: "Art & Culture", icon: "🎨", color: "#C77DFF", description: "Traditional to contemporary" },
  "cinema-club": { name: "Cinema Club", icon: "🎬", color: "#E63946", description: "Bollywood to Hollywood" },
  "book-worms": { name: "Book Worms", icon: "📚", color: "#F4A261", description: "Reading circles & discussions" },
  "game-on": { name: "Game On", icon: "🎮", color: "#7209B7", description: "Esports & casual gaming" },
  "startup-hub": { name: "Startup Hub", icon: "🚀", color: "#00F5FF", description: "Founders & innovators" },
  "cricket-fans": { name: "Cricket Fans India", icon: "🏏", color: "#1D4ED8", description: "Bleed blue! Cricket discussions" },
  "fashion-desi": { name: "Desi Fashion", icon: "👗", color: "#EC4899", description: "Ethnic to modern Indian fashion" },
  "pets-india": { name: "Pet Parents India", icon: "🐕", color: "#10B981", description: "Dogs, cats & desi pets" },
  "career-growth": { name: "Career Growth", icon: "💼", color: "#6366F1", description: "Jobs, skills & mentorship" },
  "sustainability": { name: "Green India", icon: "🌱", color: "#059669", description: "Sustainable living & climate action" },
  "finance-tips": { name: "Finance & Investing", icon: "💰", color: "#F59E0B", description: "Stocks, crypto & savings" },
  "parenting-india": { name: "Indian Parents", icon: "👶", color: "#8B5CF6", description: "Parenting tips & support" },
  "home-decor": { name: "Home Decor India", icon: "🏠", color: "#D946EF", description: "Interior design & DIY" },
  "language-learn": { name: "Language Learners", icon: "🗣️", color: "#3B82F6", description: "Hindi, regional & foreign languages" },
  "mental-health": { name: "Mental Wellness", icon: "🧠", color: "#14B8A6", description: "Mental health support & awareness" },
};

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  time: string;
  type: "text" | "image" | "voice";
  imageUrl?: string;
  isMe: boolean;
  status: "sent" | "delivered" | "read";
}

export default function CommunityChatPage() {
  const params = useParams();
  const communityId = (params.id as string) || "travel-india";
  const community = COMMUNITY_INFO[communityId] || COMMUNITY_INFO["travel-india"];
  const members = COMMUNITY_MEMBERS[communityId] || COMMUNITY_MEMBERS["default"];
  const photos = COMMUNITY_PHOTOS[communityId] || COMMUNITY_PHOTOS["default"];
  
  const getInitialMessages = (communityId: string, community: any, members: any, photos: string[]): Message[] => {
    const welcomeMessage: Message = { id: "1", senderId: "system", senderName: community.name, senderAvatar: "", text: `Welcome to ${community.name}! Synchronizing with ${members.length} citizens.`, time: "10:00 AM", type: "text", isMe: false, status: "read" };
    const firstMessage: Message = { id: "2", senderId: members[0].id, senderName: members[0].name, senderAvatar: members[0].avatar, text: `Hey everyone! Excited to share my journey in ${community.name}. Just saw the most beautiful view!`, time: "10:05 AM", type: "text", isMe: false, status: "read" };
    const imageMessage: Message = { id: "3", senderId: members[1]?.id || members[0].id, senderName: members[1]?.name || members[0].name, senderAvatar: members[1]?.avatar || members[0].avatar, text: "", time: "10:06 AM", type: "image", imageUrl: photos[0], isMe: false, status: "read" };
    return [welcomeMessage, firstMessage, imageMessage];
  };

  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    setMessages(getInitialMessages(communityId, community, members, photos));
  }, [communityId]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [moderationError, setModerationError] = useState<ModerationResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setModerationError(null);
    const moderationResult = moderateMessage(newMessage);
    if (!moderationResult.allowed) {
      setModerationError(moderationResult);
      return;
    }
    const userMsg: Message = { id: Date.now().toString(), senderId: "me", senderName: "You", senderAvatar: "", text: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: "text", isMe: true, status: "sent" };
    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");
    setIsTyping(true);
    
    // Generate simulated response
    setTimeout(() => {
        const replyMsg: Message = { id: (Date.now() + 1).toString(), senderId: members[0].id, senderName: members[0].name, senderAvatar: members[0].avatar, text: "Absolutely! I've been thinking about that too. The energy in this community is unmatched! 🚀", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: "text", isMe: false, status: "delivered" };
        setMessages(prev => [...prev, replyMsg]);
        setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="min-h-screen bg-white pt-20 pb-0 lg:pl-80 font-jakarta">
      <div className="h-[calc(100vh-5rem)] flex flex-col bg-white">
        
        {/* Chat Header - High Contrast Light Theme */}
        <div className="bg-white/95 backdrop-blur-3xl border-b border-primary/10 px-10 py-8 flex items-center justify-between shadow-premium z-10 relative">
           {/* Top Branding Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-swaynix-gradient" />
          
          <div className="flex items-center gap-6">
            <Link href="/" className="lg:hidden text-foreground hover:text-primary transition-all">
              <ArrowLeft className="w-8 h-8" />
            </Link>
            <div className="relative group">
              <Avatar className="w-16 h-16 border-4 border-white shadow-premium transition-transform group-hover:scale-105">
                <AvatarFallback className="bg-swaynix-gradient text-foreground text-3xl font-black italic">
                   {community.icon}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                 <h2 className="text-4xl font-black italic tracking-tighter text-foreground leading-none">{community.name}</h2>
                 <Badge className="bg-primary/20 text-foreground border-none font-black italic text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">Stream ACTIVE</Badge>
              </div>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2 mt-2 opacity-60 italic">
                <Users className="w-4 h-4 text-primary" />
                {245 + Math.floor(Math.random() * 100)} Citizens Synchronized
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"><Phone className="w-6 h-6" /></Button>
            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"><Video className="w-6 h-6" /></Button>
            <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all"><MoreVertical className="w-6 h-6" /></Button>
          </div>
        </div>
        
        {/* Messages Space */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-white/40">
           {/* Community Welcome Hero */}
           <div className="text-center py-16 space-y-6 max-w-2xl mx-auto">
              <div className="w-32 h-32 rounded-[2.5rem] bg-swaynix-gradient mx-auto flex items-center justify-center text-5xl shadow-premium border-8 border-white animate-float">
                {community.icon}
              </div>
              <h3 className="font-black italic text-5xl text-foreground tracking-tighter leading-none">Welcome to the <br />#{community.name} Hub</h3>
              <p className="text-muted-foreground font-semibold italic text-xl leading-relaxed">This is your high-intensity community stream. Share genuine human moments with {members.length} other synchronized citizens.</p>
              <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full" />
           </div>

          {messages.map((msg, idx) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              {!msg.isMe && msg.senderId !== "system" && (
                <Avatar className="w-12 h-12 border-4 border-white shadow-xl mt-2 mr-4 flex-shrink-0">
                   <AvatarImage src={msg.senderAvatar} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary font-black italic text-xs">
                     {msg.senderName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] group relative ${msg.isMe ? 'ml-12' : 'mr-12'}`}>
                {msg.type === "image" && msg.imageUrl && (
                    <motion.div whileHover={{ scale: 1.02 }} className="mb-4 rounded-[2.5rem] overflow-hidden shadow-premium border-8 border-white ring-1 ring-primary/5 relative">
                       <img src={msg.imageUrl} alt="Shared Hub Content" className="w-full h-72 object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" />
                    </motion.div>
                )}

                <div className={`p-8 rounded-[3rem] shadow-premium relative ${
                  msg.isMe 
                    ? 'bg-swaynix-gradient text-foreground rounded-br-none border border-black/5' 
                    : msg.senderId === "system"
                        ? 'bg-primary/5 text-muted-foreground text-center mx-auto max-w-xl font-black italic border-none py-10 rounded-[2rem]'
                        : 'bg-white text-foreground rounded-bl-none border border-primary/5 shadow-2xl'
                }`}>
                  {!msg.isMe && msg.senderId !== "system" && (
                      <div className="flex items-center gap-2 mb-3">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic leading-none">@{msg.senderName.toLowerCase().replace(' ', '_')}</p>
                         <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black px-2 py-0.5 rounded-full">CITIZEN</Badge>
                      </div>
                  )}
                  <p className="text-xl font-bold italic leading-relaxed tracking-tight">{msg.text || (msg.type === "image" ? "Check out this visual signal! ✨" : "")}</p>
                  <div className={`flex items-center justify-end gap-2 mt-4 opacity-50 font-black text-[10px] uppercase tracking-widest italic ${msg.isMe ? 'text-foreground' : 'text-muted-foreground'}`}>
                    <span>{msg.time}</span>
                    {msg.isMe && <CheckCheck className="w-4 h-4 text-primary" />}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-4">
                <div className="bg-white p-5 rounded-full shadow-premium border border-primary/5 flex gap-1.5 items-center">
                   <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-duration:0.6s]" />
                   <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:0.6s]" />
                   <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:0.6s]" />
                </div>
                <span className="text-xs font-black uppercase text-primary self-center italic tracking-widest animate-pulse">Incoming Signal...</span>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Human Input Zone */}
        <div className="p-10 bg-white/95 backdrop-blur-3xl border-t border-primary/10 relative">
           <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/5" />
           
           {moderationError && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-8 rounded-[3rem] bg-red-50 border border-red-200 flex items-center gap-6 shadow-2xl">
                 <div className="bg-red-500 p-3 rounded-2xl shadow-lg"><AlertCircle className="w-10 h-10 text-white" /></div>
                 <div className="flex-1">
                    <p className="text-red-900 font-black italic text-2xl leading-none tracking-tighter">Signal Filtered: Platform Shield</p>
                    <p className="text-red-600 font-bold italic text-lg mt-1 opacity-80">{moderationError.message}</p>
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => setModerationError(null)} className="h-12 w-12 text-red-300 hover:text-red-600 hover:bg-red-100 rounded-full transition-all"><X className="w-8 h-8" /></Button>
              </motion.div>
           )}

           <div className="max-w-6xl mx-auto flex items-center gap-6 p-4 rounded-[3.5rem] bg-primary/[0.03] border border-primary/5 shadow-2xl focus-within:bg-white focus-within:shadow-[0_20px_80px_rgba(249,115,22,0.1)] transition-all duration-500 group">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center shadow-premium hover:shadow-xl transition-all"><Paperclip className="w-8 h-8" /></motion.button>
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Broadcast your human signal..." 
                className="flex-1 bg-transparent border-none text-2xl font-bold italic tracking-tighter focus-visible:ring-0 placeholder:text-muted-foreground/30 h-16 px-4"
              />
              <div className="flex items-center gap-2">
                 <motion.button whileHover={{ scale: 1.1 }} className="w-16 h-16 rounded-full text-primary hover:bg-white transition-all"><Smile className="w-8 h-8" /></motion.button>
                 <motion.button whileHover={{ scale: 1.1 }} className="w-16 h-16 rounded-full text-primary hover:bg-white transition-all"><Mic className="w-8 h-8" /></motion.button>
                 <motion.button 
                    whileHover={{ scale: 1.05, opacity: 0.9 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={handleSend} 
                    className="h-18 px-10 bg-swaynix-gradient text-foreground flex items-center gap-4 rounded-[2.5rem] shadow-premium border border-black/5 ml-4 group"
                 >
                    <span className="font-black italic text-2xl tracking-tighter">SEND</span>
                    <Send className="w-8 h-8 rotate-[-25deg] group-hover:rotate-0 transition-transform" />
                 </motion.button>
              </div>
           </div>
           
           <div className="mt-8 flex justify-center gap-12 opacity-30">
              {['End-to-End Encrypted', 'Human Verified', 'Discovery Synced'].map(text => (
                <div key={text} className="flex items-center gap-2">
                   <ShieldCheck className="w-3.5 h-3.5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
