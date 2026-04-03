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
  Heart, Reply, ArrowDown, AlertCircle, X
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { llmService } from "@/lib/llm-service";
import { moderateMessage, type ModerationResult } from "@/lib/content-moderation";

// Indian community members with realistic profiles
const COMMUNITY_MEMBERS: Record<string, Array<{id: string, name: string, avatar: string, role: string, bio: string}>> = {
  "travel-india": [
    { id: "m1", name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "traveler", bio: "Backpacker exploring hidden gems" },
    { id: "m2", name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "photographer", bio: "Capturing India's beauty" },
    { id: "m3", name: "Vikram Reddy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "guide", bio: "Local guide from Kerala" },
    { id: "m4", name: "Ananya Singh", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "traveler", bio: "Solo female traveler" },
    { id: "m5", name: "Rohan Gupta", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100", role: "blogger", bio: "Travel blogger & vlogger" },
  ],
  "foodie-delhi": [
    { id: "m1", name: "Karthik Iyer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "chef", bio: "Home chef & biryani expert" },
    { id: "m2", name: "Neha Kumar", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "foodie", bio: "Street food hunter" },
    { id: "m3", name: "Divya Nair", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "critic", bio: "Food critic & blogger" },
    { id: "m4", name: "Amit Shah", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "chef", bio: "South Indian cuisine specialist" },
  ],
  "code-mumbai": [
    { id: "m1", name: "Rohan Gupta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "developer", bio: "Full stack dev at startup" },
    { id: "m2", name: "Sanya Patel", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "engineer", bio: "Backend engineer at Google" },
    { id: "m3", name: "Aditya Joshi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", role: "founder", bio: "Tech founder & mentor" },
    { id: "m4", name: "Meera Krishnan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", role: "developer", bio: "React & Node.js expert" },
  ],
  "default": [
    { id: "m1", name: "Community Member", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", role: "member", bio: "Active community member" },
    { id: "m2", name: "Regular User", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", role: "member", bio: "Loves engaging with community" },
  ]
};

// Community photos by category
const COMMUNITY_PHOTOS: Record<string, string[]> = {
  "travel-india": [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
  ],
  "foodie-delhi": [
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
  ],
  "code-mumbai": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400",
  ],
  "default": [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
  ]
};

// Community info
const COMMUNITY_INFO: Record<string, {name: string, icon: string, color: string, description: string}> = {
  "travel-india": { name: "Travel India", icon: "✈️", color: "#FF6B9D", description: "Discover hidden gems across India" },
  "foodie-delhi": { name: "Delhi Foodies", icon: "🍳", color: "#FB8500", description: "Street food to fine dining" },
  "code-mumbai": { name: "Code Mumbai", icon: "💻", color: "#00D4FF", description: "Mumbai's developer community" },
  "dance-bhangra": { name: "Bhangra & Dance", icon: "💃", color: "#FF006E", description: "Punjabi beats and moves" },
  "bollywood-beats": { name: "Bollywood Beats", icon: "🎵", color: "#9D4EDD", description: "Desi music lovers unite" },
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

// LLM Response Generator - Simulates human responses
function generateHumanResponse(userMessage: string, communityId: string, previousMessages: Message[]): string {
  const travelResponses = [
    "Oh wow, that sounds amazing! I've been to Kerala during monsoon and it's absolutely magical. The tea plantations in Munnar are breathtaking.",
    "You should definitely try the backwaters in Alleppey! I stayed in a houseboat last year and it was unforgettable. 🌴",
    "If you're planning a trip, try visiting during Onam festival. The culture, food, and snake boat races are incredible!",
    "Pro tip: Book your stays in advance during peak season. I use MakeMyTrip or directly contact homestays for better deals.",
    "Have you considered Coorg too? It's called the Scotland of India for a reason. Perfect for coffee lovers! ☕",
    "I just returned from a trek in the Western Ghats. The views are to die for! Would you like some photos?",
  ];
  
  const foodResponses = [
    "That biryani looks delicious! I use a special blend of spices from Old Delhi. The secret is slow cooking on dum. 🍛",
    "You should try the paranthe wali gali in Chandni Chowk! Best stuffed parathas ever. I go there every Sunday.",
    "Homemade butter chicken recipe: marinate overnight, use kasuri methi, and never skip the cream at the end!",
    "Street food tip: Always check where locals are eating. If there's a crowd, the food is fresh and tasty!",
    "I learned this recipe from my grandmother. The key is patience and love. Want the full recipe?",
    "Have you tried chole kulche from Kamla Nagar? Game changer! I can share the exact location.",
  ];
  
  const codeResponses = [
    "I faced the same issue last week! Try using React Query for data fetching, it handles caching beautifully.",
    "For that error, check if you're using the correct Node version. I recommend nvm for managing versions.",
    "We're hiring at our startup! Looking for full-stack devs with React and Node experience. DM me if interested. 💼",
    "Try the new Next.js 15 features, the App Router has improved performance significantly. Just migrated our app!",
    "Anyone attending the React India conference next month? Would love to meet fellow Mumbai devs!",
    "For system design interviews, focus on scalability and trade-offs. I cleared my Google interview using this approach.",
  ];
  
  const generalResponses = [
    "That's really interesting! I had a similar experience last month. Would love to hear more about your journey.",
    "Thanks for sharing this! The community really benefits from insights like yours. 🙌",
    "I completely agree with your point. Been thinking about this for a while now.",
    "Could you elaborate more on that? I'm curious to understand your perspective better.",
    "This is exactly why I love this community - such meaningful discussions!",
    "Great question! From my experience, I'd suggest taking it step by step. Happy to help if you need more guidance.",
  ];
  
  // Pick response category based on community
  let responses = generalResponses;
  if (communityId.includes("travel")) responses = travelResponses;
  else if (communityId.includes("food")) responses = foodResponses;
  else if (communityId.includes("code")) responses = codeResponses;
  
  // Pick random response
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function CommunityChatPage() {
  const params = useParams();
  const communityId = (params.id as string) || "travel-india";
  const community = COMMUNITY_INFO[communityId] || COMMUNITY_INFO["travel-india"];
  const members = COMMUNITY_MEMBERS[communityId] || COMMUNITY_MEMBERS["default"];
  const photos = COMMUNITY_PHOTOS[communityId] || COMMUNITY_PHOTOS["default"];
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "system",
      senderName: community.name,
      senderAvatar: "",
      text: `Welcome to ${community.name}! ${community.description}. Share your experiences and connect with fellow enthusiasts.`,
      time: "10:00 AM",
      type: "text",
      isMe: false,
      status: "read"
    },
    {
      id: "2",
      senderId: members[0].id,
      senderName: members[0].name,
      senderAvatar: members[0].avatar,
      text: "Hey everyone! Just shared some photos from my recent trip to Kerala. The monsoon there is magical! 🌧️",
      time: "10:05 AM",
      type: "text",
      isMe: false,
      status: "read"
    },
    {
      id: "3",
      senderId: members[1].id,
      senderName: members[1].name,
      senderAvatar: members[1].avatar,
      text: "",
      time: "10:06 AM",
      type: "image",
      imageUrl: photos[0],
      isMe: false,
      status: "read"
    }
  ]);
  
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
    
    // Clear previous moderation error
    setModerationError(null);
    
    // Check content moderation
    const moderationResult = moderateMessage(newMessage);
    if (!moderationResult.allowed) {
      // Block message and show alert
      setModerationError(moderationResult);
      return;
    }
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: "me",
      senderName: "You",
      senderAvatar: "",
      text: newMessage,
      time: timeString,
      type: "text",
      isMe: true,
      status: "sent"
    };
    
    setMessages(prev => [...prev, userMsg]);
    setNewMessage("");
    
    // Generate LLM response
    setIsTyping(true);
    
    try {
      const { message: llmResponse, photoUrl } = await llmService.generateResponse(
        newMessage,
        communityId,
        Math.random() > 0.7 // 30% chance of including a photo
      );
      
      // Calculate realistic typing delay based on message length
      const typingDelay = llmService.getTypingDelay(llmResponse.content.length);
      
      setTimeout(() => {
        const replyMsg: Message = {
          id: (Date.now() + 1).toString(),
          senderId: `member_${Math.random().toString(36).substr(2, 5)}`,
          senderName: llmResponse.senderName || "Community Member",
          senderAvatar: llmResponse.senderAvatar || "",
          text: llmResponse.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: photoUrl ? "image" : "text",
          imageUrl: photoUrl,
          isMe: false,
          status: "delivered"
        };
        
        setMessages(prev => [...prev, replyMsg]);
        setIsTyping(false);
      }, typingDelay);
      
    } catch (error) {
      console.error("Failed to generate response:", error);
      setIsTyping(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="min-h-screen bg-background pt-16 pb-0 lg:pl-72">
      {/* Telegram-style Chat Container */}
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-orange-50/50 to-amber-50/30 dark:from-slate-900 dark:to-slate-950">
        
        {/* Chat Header - Telegram Style */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
          <Link href={`/cohort/${communityId}`} className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarFallback style={{ backgroundColor: community.color }} className="text-white text-lg">
                {community.icon}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">{community.name}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              {245 + Math.floor(Math.random() * 100)} members online
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Messages Area - Telegram Style Bubbles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isMe && msg.senderId !== "system" && (
                <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                  <AvatarImage src={msg.senderAvatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {msg.senderName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[75%] ${msg.isMe ? 'ml-12' : 'mr-12'}`}>
                {!msg.isMe && msg.senderId !== "system" && idx > 0 && messages[idx-1].senderId !== msg.senderId && (
                  <p className="text-xs text-muted-foreground ml-1 mb-0.5">{msg.senderName}</p>
                )}
                
                {msg.type === "text" && (
                  <div className={`relative px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.isMe 
                      ? 'bg-primary text-primary-foreground rounded-br-sm' 
                      : msg.senderId === "system"
                        ? 'bg-muted text-muted-foreground text-center mx-auto max-w-md'
                        : 'bg-white dark:bg-slate-700 text-foreground rounded-bl-sm shadow-sm'
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      <span className="text-[10px]">{msg.time}</span>
                      {msg.isMe && (
                        msg.status === "read" ? <CheckCheck className="w-3 h-3" /> :
                        msg.status === "delivered" ? <Check className="w-3 h-3" /> :
                        <Check className="w-3 h-3 opacity-50" />
                      )}
                    </div>
                  </div>
                )}
                
                {msg.type === "image" && (
                  <div className="relative rounded-2xl overflow-hidden shadow-sm max-w-[280px]">
                    <img src={msg.imageUrl} alt="Shared" className="w-full h-auto" />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      {msg.time}
                      <CheckCheck className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area - Telegram Style */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-border p-2">
          {/* Content Moderation Alert */}
          {moderationError && !moderationError.allowed && (
            <div className="mb-2 mx-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">Content Blocked</p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">{moderationError.message}</p>
                  {moderationError.blockedWord && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      Detected: &ldquo;{moderationError.blockedWord}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setModerationError(null)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 flex-shrink-0 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground flex-shrink-0">
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 bg-muted rounded-2xl flex items-end px-3 py-2 gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0">
                <Smile className="h-5 w-5" />
              </Button>
              
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-1 text-sm min-h-[24px] max-h-[120px] resize-none"
              />
              
              {!newMessage.trim() ? (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground flex-shrink-0">
                  <Mic className="h-5 w-5" />
                </Button>
              ) : null}
            </div>
            
            <Button 
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0 p-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
