"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, Send, Search, Hash, Users,
  Image as ImageIcon, Smile, Paperclip, AlertCircle, X
} from "lucide-react";
import { moderateMessage, type ModerationResult } from "@/lib/content-moderation";

// Community chats instead of private messages
const COMMUNITY_CHATS = [
  {
    id: "code-mumbai",
    name: "Code Mumbai",
    type: "community",
    members: 2340,
    avatar: "CM",
    color: "#00D4FF",
    lastMessage: "Anyone up for a hackathon this weekend?",
    time: "2m ago",
    unread: 5,
  },
  {
    id: "bollywood-beats",
    name: "Bollywood Beats",
    type: "community",
    members: 15600,
    avatar: "BB",
    color: "#9D4EDD",
    lastMessage: "New AR Rahman track is fire! 🔥",
    time: "5m ago",
    unread: 12,
  },
  {
    id: "travel-india",
    name: "Travel India",
    type: "community",
    members: 8900,
    avatar: "TI",
    color: "#FF6B9D",
    lastMessage: "Kerala backwaters photos from my trip!",
    time: "15m ago",
    unread: 3,
  },
  {
    id: "cricket-fans",
    name: "Cricket Fans",
    type: "community",
    members: 45600,
    avatar: "CF",
    color: "#22C55E",
    lastMessage: "What a match yesterday! 🏏",
    time: "1h ago",
    unread: 0,
  },
  {
    id: "foodie-delhi",
    name: "Foodie Delhi",
    type: "community",
    members: 6700,
    avatar: "FD",
    color: "#F97316",
    lastMessage: "Best butter chicken in CP?",
    time: "2h ago",
    unread: 0,
  },
];

// Community-specific realistic messages
const COMMUNITY_MESSAGES: Record<string, Array<{id: number, sender: string, avatar: string, text: string, time: string, self: boolean}>> = {
  "code-mumbai": [
    { id: 1, sender: "Rohan Desai", avatar: "RD", text: "Anyone tried the new Next.js 15 features? The Server Actions are game changing! 🚀", time: "9:30 AM", self: false },
    { id: 2, sender: "Priya Shah", avatar: "PS", text: "Just deployed our app on Vercel. Took literally 30 seconds!", time: "9:32 AM", self: false },
    { id: 3, sender: "You", avatar: "You", text: "Has anyone been to the React meetup at WeWork? Worth joining?", time: "9:35 AM", self: true },
    { id: 4, sender: "Amit K", avatar: "AK", text: "Yeah! Last week they had talks on React Server Components. Super insightful.", time: "9:37 AM", self: false },
    { id: 5, sender: "Neha Patel", avatar: "NP", text: "Planning a hackathon this weekend at the co-working space in Andheri. Who's in? 💻", time: "2m ago", self: false },
  ],
  "bollywood-beats": [
    { id: 1, sender: "Zara Khan", avatar: "ZK", text: "Just listened to Chuttamalle from Devara on repeat! Anirudh is pure magic ✨", time: "10:15 AM", self: false },
    { id: 2, sender: "Arjun Mehta", avatar: "AM", text: "ARR's new album is out! The fusion tracks are incredible 🔥", time: "10:18 AM", self: false },
    { id: 3, sender: "You", avatar: "You", text: "What's everyone's weekend playlist looking like? Need some fresh tracks!", time: "10:20 AM", self: true },
    { id: 4, sender: "Divya Nair", avatar: "DN", text: "Been looping the Laapataa Ladies soundtrack. So underrated!", time: "10:22 AM", self: false },
    { id: 5, sender: "Karan Singh", avatar: "KS", text: "Yo! Anyone going to the Arijit concert in Mumbai next month? 🎤", time: "5m ago", self: false },
  ],
  "travel-india": [
    { id: 1, sender: "Ananya Sharma", avatar: "AS", text: "Just got back from Spiti Valley! The landscapes are unreal 😍🇮🇳", time: "8:45 AM", self: false },
    { id: 2, sender: "Vikram Rao", avatar: "VR", text: "Planning a monsoon trek to Rajmachi next week. 4 slots left!", time: "8:48 AM", self: false },
    { id: 3, sender: "You", avatar: "You", text: "What's the best time to visit Ladakh? Heard July-August is good", time: "8:50 AM", self: true },
    { id: 4, sender: "Meera Iyer", avatar: "MI", text: "June-July is perfect! But book your stays now, they fill up fast. I can share my itinerary", time: "8:52 AM", self: false },
    { id: 5, sender: "Rahul Verma", avatar: "RV", text: "Uploading photos from my Kerala backwaters trip. Houseboat experience was incredible! 🛶", time: "15m ago", self: false },
  ],
  "cricket-fans": [
    { id: 1, sender: "Sourav Das", avatar: "SD", text: "That Rohit six over midwicket yesterday! Vintage Hitman 🔥🏏", time: "11:00 AM", self: false },
    { id: 2, sender: "Priya Banerjee", avatar: "PB", text: "Gill's form is concerning though. Hope he finds his rhythm before the World Cup", time: "11:02 AM", self: false },
    { id: 3, sender: "You", avatar: "You", text: "What do you guys think about our bowling attack for the next series?", time: "11:05 AM", self: true },
    { id: 4, sender: "Amit Mishra", avatar: "AM", text: "Jasprit coming back is huge. But we need a reliable third pacer.", time: "11:07 AM", self: false },
    { id: 5, sender: "Viraj Patel", avatar: "VP", text: "Watching the India vs Australia highlights. What a match! The last over had me on edge 🏆", time: "1h ago", self: false },
  ],
  "foodie-delhi": [
    { id: 1, sender: "Kabir Malhotra", avatar: "KM", text: "Found this hidden gem in Old Delhi - Kareem's kebabs are next level! 🍢", time: "12:30 PM", self: false },
    { id: 2, sender: "Anaya Gupta", avatar: "AG", text: "Have you tried the butter chicken at Gulati's in Pandara Road? Authentic stuff!", time: "12:33 PM", self: false },
    { id: 3, sender: "You", avatar: "You", text: "Best places for street food in CP? Friends visiting this weekend", time: "12:35 PM", self: true },
    { id: 4, sender: "Dev Khanna", avatar: "DK", text: "Wenger's for sandwiches, then Keventers for shakes. Classic CP combo!", time: "12:37 PM", self: false },
    { id: 5, sender: "Shivani R", avatar: "SR", text: "Posting a pic of the chole bhature I had at Sita Ram this morning. Still dreaming about it! 😋", time: "2h ago", self: false },
  ],
};

// Realistic reply templates for different communities
const REPLY_TEMPLATES: Record<string, string[]> = {
  "code-mumbai": ["That's interesting!", "Thanks for sharing 👍", "Could you share more details?", "Totally agree! 🚀", "Let me check that out", "Exactly what I needed!", "Great point 💯", "DM me the link?"],
  "bollywood-beats": ["Adding to my playlist! 🎵", "So true! 🔥", "This song is everything!", "On repeat rn 😍", "Thanks for the rec!", "Need to check this out", "Obsessed with this! ✨", "The vibes! 💫"],
  "travel-india": ["Adding to my bucket list!", "Looks incredible 😍", "Thanks for the tip!", "How much did it cost?", "Need to plan this ASAP", "Beautiful shot! 📸", "Perfect itinerary!", "Dream destination ✈️"],
  "cricket-fans": ["What a player! 🏏", "Absolutely! 👏", "Couldn't agree more", "That shot was legendary!", "Best in the world 💯", "Still gives me goosebumps", "Vintage stuff! 🔥", "Game changer! 🏆"],
  "foodie-delhi": ["Need to try this! 😋", "Looks delicious!", "Adding to my list", "Where exactly is this?", "Going this weekend!", "My mouth is watering 🤤", "The best! 👌", "Classic choice!"],
};

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(COMMUNITY_CHATS[0]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(() => COMMUNITY_MESSAGES[COMMUNITY_CHATS[0].id]);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [moderationError, setModerationError] = useState<ModerationResult | null>(null);

  const visibleChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return COMMUNITY_CHATS;
    return COMMUNITY_CHATS.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const getStorageKey = (chatId: string) => `community_chat_messages_${chatId}`;

  const loadMessagesForChat = (chatId: string) => {
    const saved = localStorage.getItem(getStorageKey(chatId));
    if (saved) {
      return JSON.parse(saved);
    }
    return COMMUNITY_MESSAGES[chatId] || COMMUNITY_MESSAGES["code-mumbai"];
  };

  const persistMessagesForChat = (chatId: string, nextMessages: unknown) => {
    localStorage.setItem(getStorageKey(chatId), JSON.stringify(nextMessages));
  };

  useEffect(() => {
    setMessages(loadMessagesForChat(activeChat.id));
  }, [activeChat.id]);

  // Update messages when chat changes
  const handleChatChange = (chat: typeof COMMUNITY_CHATS[0]) => {
    setActiveChat(chat);
    setMobileChatOpen(true);
    setSearchQuery("");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Clear any previous moderation errors
    setModerationError(null);
    
    // Check content moderation
    const moderationResult = moderateMessage(newMessage);
    if (!moderationResult.allowed) {
      // Block message and show alert
      setModerationError(moderationResult);
      return;
    }
    
    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      avatar: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true
    };
    
    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    persistMessagesForChat(activeChat.id, nextMessages);
    setNewMessage("");
    
    // Simulate varied reply after 1-2 seconds
    setTimeout(() => {
      const templates = REPLY_TEMPLATES[activeChat.id] || REPLY_TEMPLATES["code-mumbai"];
      const randomReply = templates[Math.floor(Math.random() * templates.length)];
      const communityMembers: Record<string, string[]> = {
        "code-mumbai": ["Rohan Desai", "Priya Shah", "Amit K", "Neha Patel", "Vikram Rao"],
        "bollywood-beats": ["Zara Khan", "Arjun Mehta", "Divya Nair", "Karan Singh", "Meera Iyer"],
        "travel-india": ["Ananya Sharma", "Vikram Rao", "Meera Iyer", "Rahul Verma", "Sneha K"],
        "cricket-fans": ["Sourav Das", "Priya Banerjee", "Amit Mishra", "Viraj Patel", "Rohit K"],
        "foodie-delhi": ["Kabir Malhotra", "Anaya Gupta", "Dev Khanna", "Shivani R", "Rahul S"],
      };
      const members = communityMembers[activeChat.id] || ["Community Member"];
      const randomMember = members[Math.floor(Math.random() * members.length)];
      
      const reply = {
        id: nextMessages.length + 1,
        sender: randomMember,
        avatar: randomMember.split(" ").map(n => n[0]).join(""),
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false
      };
      setMessages(prev => {
        const updated = [...prev, reply];
        persistMessagesForChat(activeChat.id, updated);
        return updated;
      });
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 lg:pb-0 lg:pl-72">
      <div className="h-[calc(100vh-5rem)] lg:h-[calc(100vh-2rem)] flex">
        {/* Community List */}
        <div className="w-full lg:w-80 bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl font-bold text-foreground">Community Chats</h1>
            </div>
            <p className="text-xs text-muted-foreground mb-2">No private messaging - only community discussions</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search communities..." 
                className="pl-10 bg-muted border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchQuery.trim().length > 0 && (
              <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
                {visibleChats.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No communities found</div>
                ) : (
                  visibleChats.slice(0, 5).map((chat) => (
                    <button
                      key={`search-${chat.id}`}
                      onClick={() => handleChatChange(chat)}
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted text-left"
                    >
                      <span className="text-sm font-medium text-foreground">{chat.name}</span>
                      <span className="text-xs text-muted-foreground">{chat.members.toLocaleString()} members</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Community List */}
          <div className="flex-1 overflow-y-auto">
            {visibleChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatChange(chat)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors border-b border-border ${
                  activeChat.id === chat.id ? "bg-muted" : ""
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: chat.color }}
                >
                  {chat.avatar}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 dark:text-white">{chat.name}</p>
                    <span className="text-xs text-slate-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {chat.members.toLocaleString()}
                    </span>
                    <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
                {chat.unread > 0 && (
                  <Badge className="bg-purple-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0 rounded-full">
                    {chat.unread}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area - Desktop always visible, Mobile conditional */}
        <div className={`${mobileChatOpen ? 'fixed inset-0 z-50 lg:static lg:z-auto' : 'hidden'} lg:flex flex-1 flex-col bg-background`}>
          {/* Chat Header */}
          <div className="p-4 bg-card border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden text-muted-foreground"
                onClick={() => setMobileChatOpen(false)}
              >
                ←
              </Button>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: activeChat.color }}
              >
                {activeChat.avatar}
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  {activeChat.name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {activeChat.members.toLocaleString()} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Channel intro */}
            <div className="text-center py-4">
              <div 
                className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: activeChat.color }}
              >
                {activeChat.avatar}
              </div>
              <h3 className="font-bold text-foreground text-lg">Welcome to #{activeChat.name}</h3>
              <p className="text-sm text-muted-foreground">This is the start of the community chat</p>
            </div>
            
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.self ? "justify-end" : "justify-start"}`}
              >
                {!msg.self && (
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] ${msg.self ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"} rounded-2xl px-4 py-2 shadow-sm`}>
                  {!msg.self && <p className="text-xs font-semibold mb-1 text-primary">{msg.sender}</p>}
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 text-right ${msg.self ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-card border-t border-border">
            {/* Content Moderation Alert */}
            {moderationError && !moderationError.allowed && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">Content Blocked</p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{moderationError.message}</p>
                    {moderationError.suggestion && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">{moderationError.suggestion}</p>
                    )}
                    {moderationError.blockedWord && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                        Detected: &ldquo;{moderationError.blockedWord}&rdquo;
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setModerationError(null)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message #${activeChat.name}...`}
                className="flex-1 bg-muted border-0"
              />
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Smile className="w-5 h-5" />
              </Button>
              <Button 
                onClick={handleSendMessage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile: Select Chat Prompt */}
        <div className="lg:hidden flex-1 flex items-center justify-center bg-background">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Select a community to start chatting</p>
            <p className="text-xs text-muted-foreground/50 mt-2">Community chats only - no private messages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
