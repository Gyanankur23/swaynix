"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth-context";
import { 
  MessageSquare, Send, Search, Hash, Users,
  Image as ImageIcon, Smile, Paperclip, AlertCircle, X,
  Zap, Sparkles, ChevronLeft, MoreVertical, ShieldCheck
} from "lucide-react";
import { moderateMessage, type ModerationResult } from "@/lib/content-moderation";

const COMMUNITY_CHATS = [
  { id: "python", name: "Python Hub", members: 2340, color: "#1E293B", lastMessage: "How do I optimize this pandas script?", time: "2m ago", unread: 5 },
  { id: "react", name: "React Community", members: 15600, color: "#61DAFB", lastMessage: "React 19 beta is out! 🎉", time: "5m ago", unread: 12 },
  { id: "ai", name: "AI & ML Center", members: 8900, color: "#F97316", lastMessage: "Anyone tried GPT-4o yet?", time: "15m ago", unread: 3 },
  { id: "javascript", name: "JS Wizards", members: 45600, color: "#F7DF1E", lastMessage: "Arrow functions vs classes?", time: "1h ago", unread: 0 },
  { id: "nextjs", name: "Next.js Devs", members: 6700, color: "#000000", lastMessage: "Server actions are amazing!", time: "2h ago", unread: 0 },
  { id: "architecture", name: "System Design", members: 1200, color: "#10B981", lastMessage: "Microservices vs Monolith?", time: "3h ago", unread: 0 },
  { id: "scaling", name: "Scaling Lab", members: 3400, color: "#8B5CF6", lastMessage: "Optimizing 1M records per sec", time: "5h ago", unread: 0 },
];

const COMMUNITY_MESSAGES: Record<string, Array<{id: number, sender: string, avatar: string, text: string, time: string, self: boolean}>> = {
  "react": [
    { id: 1, sender: "Rohan Desai", avatar: "RD", text: "Anyone tried the new React 19 features? The Server Components are game changing!", time: "9:30 AM", self: false },
    { id: 2, sender: "Priya Shah", avatar: "PS", text: "Just deployed our app on Vercel. Performance is incredible! 🚀", time: "9:32 AM", self: false },
    { id: 3, sender: "You", avatar: "You", text: "Has anyone been to the React meetup in Mumbai lately?", time: "9:35 AM", self: true },
    { id: 4, sender: "Amit K", avatar: "AK", text: "Yeah! Last week we had some great talks about hydration errors. Pretty useful stuff.", time: "9:37 AM", self: false },
  ],
  "python": [
    { id: 1, sender: "Desi Coder", avatar: "DC", text: "Working on a Django project, anyone know a good tutorial for REST framework?", time: "10:15 AM", self: false },
    { id: 2, sender: "Arjun M", avatar: "AM", text: "Check out Corey Schafer's series on YouTube. Best for beginners and intermediate!", time: "10:18 AM", self: false },
    { id: 3, sender: "You", avatar: "You", text: "I'm looking for FastAPI examples, anyone got a clean repo for that?", time: "10:20 AM", self: true },
  ],
};

const REPLY_TEMPLATES: Record<string, string[]> = {
  "react": ["Awesome!", "Thanks for sharing 👍", "Totally agree!", "Great point 💯", "DM me more info"],
  "python": ["Check this out", "Python is great! 🐍", "I can help with that", "Try this library", "Exactly what I was looking for"],
};

export default function MessagesPage() {
  const { user, isLoggedIn } = useAuth();
  const [activeChat, setActiveChat] = useState(COMMUNITY_CHATS[0]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moderationError, setModerationError] = useState<ModerationResult | null>(null);

  // Filter chats based on user interests
  const userInterests = user?.interests || [];
  const visibleChats = useMemo(() => {
    // If user has interests, show those communities. If search is active, show matching from all.
    const allFiltered = COMMUNITY_CHATS.filter(c => {
       const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
       const isInterested = userInterests.includes(c.id);
       return searchQuery ? matchesSearch : isInterested;
    });
    
    // Always show at least 1-2 default ones if no interests (to prevent empty UI)
    if (allFiltered.length === 0 && !searchQuery) return COMMUNITY_CHATS.slice(0, 3);
    return allFiltered;
  }, [searchQuery, userInterests]);

  // Load messages for active chat
  useEffect(() => {
    const savedKey = `chat_messages_${activeChat.id}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages(COMMUNITY_MESSAGES[activeChat.id] || [{ id: 1, sender: "Swaynix", avatar: "SX", text: `Welcome to the ${activeChat.name}! Start chatting with others.`, time: "Just now", self: false }]);
    }
  }, [activeChat.id]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const moderationResult = moderateMessage(newMessage);
    if (!moderationResult.allowed) {
      setModerationError(moderationResult);
      return;
    }
    const newMsg = {
      id: Date.now(),
      sender: user?.name || "You",
      avatar: user?.name?.[0] || "Y",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(`chat_messages_${activeChat.id}`, JSON.stringify(updated));
    setNewMessage("");
    setModerationError(null);

    // Mock reply
    setTimeout(() => {
      const templates = REPLY_TEMPLATES[activeChat.id] || ["That's great!", "Nice!", "Agree 💯"];
      const reply = {
          id: Date.now() + 1,
          sender: "Member",
          avatar: "M",
          text: templates[Math.floor(Math.random() * templates.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          self: false
      };
      setMessages(prev => {
          const final = [...prev, reply];
          localStorage.setItem(`chat_messages_${activeChat.id}`, JSON.stringify(final));
          return final;
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 lg:pb-0 lg:pl-[20rem] font-inter">
      <div className="h-[calc(100vh-8rem)] flex overflow-hidden border border-primary/5 rounded-[2.5rem] bg-white shadow-premium mx-8 lg:mx-12">
        
        {/* Community List */}
        <div className={`w-full lg:w-96 bg-white border-r border-primary/5 flex flex-col ${mobileChatOpen ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
               <Badge className="bg-primary text-white font-bold px-3 py-1 rounded-full uppercase text-[10px]">Active</Badge>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search communities..." 
                className="pl-12 h-14 bg-white border-2 border-primary/5 rounded-[1.2rem] font-semibold text-lg focus:border-primary/20 shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
            <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-6 pb-2">Communities Joined</p>
            {visibleChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => { setActiveChat(chat); setMobileChatOpen(true); }}
                className={`w-full p-6 flex items-center gap-4 rounded-[2rem] transition-all ${
                  activeChat.id === chat.id ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-primary/5"
                }`}
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white"
                  style={{ backgroundColor: chat.color, color: '#fff' }}
                >
                  {chat.name[0]}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-bold text-lg tracking-tight ${activeChat.id === chat.id ? 'text-white' : 'text-foreground'}`}>{chat.name}</p>
                    <span className={`text-[10px] font-medium uppercase ${activeChat.id === chat.id ? 'text-white/60' : 'text-muted-foreground'}`}>{chat.time}</span>
                  </div>
                  <p className={`text-sm truncate font-medium ${activeChat.id === chat.id ? 'text-white/80' : 'text-muted-foreground'}`}>{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && activeChat.id !== chat.id && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-white ${mobileChatOpen ? 'flex' : 'hidden lg:flex'}`}>
          {/* Header */}
          <div className="p-6 border-b border-primary/5 flex items-center justify-between bg-white backdrop-blur-md">
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setMobileChatOpen(false)}><ChevronLeft className="w-6 h-6" /></Button>
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white"
                style={{ backgroundColor: activeChat.color, color: '#fff' }}
              >
                {activeChat.name[0]}
              </div>
              <div>
                <p className="font-bold text-2xl tracking-tight text-foreground">{activeChat.name}</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{activeChat.members.toLocaleString()} Members Active</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <Button size="icon" variant="ghost" className="w-12 h-12 rounded-2xl"><Users className="w-6 h-6" /></Button>
               <Button size="icon" variant="ghost" className="w-12 h-12 rounded-2xl"><MoreVertical className="w-6 h-6" /></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-10 space-y-6">
            <div className="text-center py-10 opacity-40">
               <h2 className="text-xl font-bold tracking-tight">Direct Conversation with {activeChat.name}</h2>
               <p className="text-sm font-medium">Messages are monitored for safety and quality.</p>
            </div>

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.self ? "flex-row-reverse" : "flex-row"}`}
              >
                {!msg.self && (
                  <Avatar className="w-10 h-10 border-2 border-white shadow-md">
                    <AvatarFallback className="bg-primary text-white font-bold text-xs">{msg.avatar}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] p-5 rounded-[2rem] shadow-sm ${msg.self ? "bg-primary text-white rounded-tr-none" : "bg-white text-foreground rounded-tl-none border border-primary/10 shadow-sm"}`}>
                  <p className="text-lg font-medium leading-relaxed leading-snug">{msg.text}</p>
                  <p className={`text-[9px] font-bold uppercase mt-2 opacity-40 ${msg.self ? "text-white text-right" : "text-foreground"}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input Layer */}
          <div className="p-8 border-t bg-white border-primary/5">
            {moderationError && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 flex items-center gap-3">
                 <AlertCircle className="w-5 h-5 flex-shrink-0" />
                 <p className="text-sm font-bold">{moderationError.message}</p>
                 <Button variant="ghost" size="icon" className="ml-auto w-6 h-6" onClick={() => setModerationError(null)}><X className="w-4 h-4" /></Button>
              </div>
            )}
            <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-inner border shadow-xl">
               <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-muted-foreground"><Paperclip className="w-6 h-6" /></Button>
               <Input 
                 placeholder="Type your message..." 
                 className="flex-1 bg-transparent border-none text-lg font-medium focus-visible:ring-0" 
                 value={newMessage}
                 onChange={e => setNewMessage(e.target.value)}
                 onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
               />
               <Button size="icon" className="w-14 h-14 rounded-[1.5rem] bg-primary text-white shadow-lg" onClick={handleSendMessage}>
                 <Send className="w-6 h-6" />
               </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
