"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, Notification } from "@/components/auth-context";
import Link from "next/link";
import { 
  Heart, MessageCircle, Share2, Bell, Zap, Clock,
  UserPlus, Crown, TrendingUp, Flame, Star, Sparkles, Users,
  CheckCircle2, X, AtSign
} from "lucide-react";

const iconMap: Record<Notification["type"], { icon: React.ElementType; color: string; bg: string }> = {
  like: { icon: Heart, color: "text-rose-500", bg: "bg-rose-100/50" },
  comment: { icon: MessageCircle, color: "text-primary", bg: "bg-primary/20" },
  follow: { icon: UserPlus, color: "text-green-500", bg: "bg-green-100/50" },
  mention: { icon: AtSign, color: "text-primary", bg: "bg-accent/30" },
  join: { icon: Users, color: "text-primary", bg: "bg-muted" },
  share: { icon: Share2, color: "text-cyan-500", bg: "bg-cyan-100/50" },
};

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function NotificationsPage() {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    unreadNotificationCount 
  } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const filteredNotifications = activeTab === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleDismiss = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 font-jakarta">
      <div className="max-w-3xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
            <div className="space-y-1">
              <Badge className="bg-primary/30 text-foreground border-primary/20 font-black italic text-[10px] tracking-widest px-4 py-1 rounded-full uppercase mb-2">Signal Radar Active</Badge>
              <h1 className="text-5xl font-black italic text-foreground tracking-tighter flex items-center gap-3 leading-none">
                <Bell className="w-10 h-10 text-primary" />
                Notifications
              </h1>
              <p className="text-muted-foreground font-black italic text-sm opacity-60 uppercase tracking-widest leading-none">Stay synchronized with your global community signals</p>
            </div>
            <Button
              onClick={markAllNotificationsRead}
              disabled={unreadNotificationCount === 0}
              className="bg-swaynix-gradient text-foreground border border-black/5 h-14 px-8 rounded-2xl font-black italic shadow-xl hover:scale-105 transition-all"
            >
              <CheckCircle2 className="w-5 h-5 mr-3" />
              Sync Read Signals
            </Button>
          </div>

          {/* Tabs - Light Edition */}
          <div className="flex gap-4 p-2 bg-white/40 backdrop-blur-md rounded-[2rem] border border-primary/5 shadow-premium max-w-md mx-auto md:mx-0">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className={`flex-1 h-12 rounded-[1.5rem] font-black italic font-jakarta transition-all ${
                activeTab === "all" 
                  ? "bg-swaynix-gradient text-foreground border border-black/5 shadow-lg" 
                  : "text-muted-foreground hover:bg-white"
              }`}
            >
              All Signals
            </Button>
            <Button
              variant={activeTab === "unread" ? "default" : "ghost"}
              onClick={() => setActiveTab("unread")}
              className={`flex-1 h-12 rounded-[1.5rem] font-black italic font-jakarta transition-all ${
                activeTab === "unread" 
                  ? "bg-swaynix-gradient text-foreground border border-black/5 shadow-lg" 
                  : "text-muted-foreground hover:bg-white"
              }`}
            >
              Unread Hubs
              {unreadNotificationCount > 0 && (
                <Badge className="ml-3 bg-primary text-foreground border border-primary/20 shadow-sm">
                  {unreadNotificationCount}
                </Badge>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notification, index) => {
              const config = iconMap[notification.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                  onClick={() => handleMarkRead(notification.id)}
                  className={`group relative ${!notification.read ? "scale-[1.02]" : ""}`}
                >
                  <Card className={`overflow-hidden transition-all hover:shadow-2xl rounded-[2.5rem] border ${
                    !notification.read 
                      ? "bg-white border-primary/30 shadow-premium" 
                      : "bg-white/60 border-primary/5 backdrop-blur-sm"
                  }`}>
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        {/* Avatar or Icon */}
                        <div className={`relative shrink-0`}>
                           <Avatar className="w-16 h-16 border-4 border-white shadow-lg transition-transform group-hover:scale-110">
                              <AvatarImage src={notification.fromAvatar} className="object-cover" />
                              <AvatarFallback className={`${config.bg} bg-primary/20`}><Icon className={`w-6 h-6 ${config.color}`} /></AvatarFallback>
                           </Avatar>
                           <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-md ${config.bg}`}>
                              <Icon className={`w-4 h-4 ${config.color}`} />
                           </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xl font-bold text-foreground italic leading-tight">
                                <span className="font-black text-2xl group-hover:text-primary transition-colors">{notification.fromUser}</span>{" "}
                                <span className="text-muted-foreground">{notification.message}</span>
                              </p>
                              <div className="flex items-center gap-4 mt-3">
                                <span className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                                  <Clock className="w-4 h-4" />
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                {!notification.read && <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black italic tracking-widest uppercase px-3 py-0.5 rounded-full">New Signal</Badge>}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-2xl bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDismiss(notification.id);
                                }}
                              >
                                <X className="w-6 h-6" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center space-y-6">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <Bell className="w-16 h-16 text-primary/40" />
              </div>
              <div>
                 <h3 className="text-3xl font-black italic tracking-tighter text-foreground mb-2">Zero Signals Detected</h3>
                 <p className="text-muted-foreground font-medium text-lg italic max-w-sm">The global hub is quiet for now. No pending connections found in this sector.</p>
              </div>
              <Button onClick={() => window.location.href = '/feed'} className="bg-swaynix-gradient text-foreground px-12 h-14 rounded-2xl font-black italic shadow-xl hover:scale-105 transition-all">Synchronize with Global Feed</Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
