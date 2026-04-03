"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, MessageCircle, Share2, Bell, Zap, Clock,
  UserPlus, Crown, TrendingUp, Flame, Star, Sparkles,
  CheckCircle2, X
} from "lucide-react";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "achievement" | "trending";
  user: {
    name: string;
    avatar?: string;
    level: number;
  };
  content: string;
  target?: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: { name: "Sarah Chen", level: 7 },
    content: "liked your post in",
    target: "Tech Enthusiasts",
    timestamp: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "achievement",
    user: { name: "System", level: 0 },
    content: "You've reached Level 5! 🎉",
    target: "Keep up the great engagement!",
    timestamp: "1h ago",
    read: false,
  },
  {
    id: "3",
    type: "comment",
    user: { name: "Alex Rivera", level: 12 },
    content: "commented on your discussion in",
    target: "AI Innovation",
    timestamp: "3h ago",
    read: true,
  },
  {
    id: "4",
    type: "trending",
    user: { name: "System", level: 0 },
    content: "Your cohort is trending! 🔥",
    target: "Web3 Builders",
    timestamp: "5h ago",
    read: true,
  },
  {
    id: "5",
    type: "follow",
    user: { name: "Maya Patel", level: 8 },
    content: "started following you",
    target: "",
    timestamp: "1d ago",
    read: true,
  },
];

const iconMap = {
  like: { icon: Heart, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  follow: { icon: UserPlus, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  mention: { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  achievement: { icon: Crown, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  trending: { icon: Flame, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isOpen, setIsOpen] = useState(true);

  const filteredNotifications = activeTab === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Bell className="w-8 h-8 text-amber-500" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-amber-500 text-white text-lg px-3 py-1">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-slate-500 mt-1">
                Stay updated with your community activity
              </p>
            </div>
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="hidden sm:flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all read
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              onClick={() => setActiveTab("all")}
              className="flex-1 rounded-lg"
            >
              All
            </Button>
            <Button
              variant={activeTab === "unread" ? "default" : "ghost"}
              onClick={() => setActiveTab("unread")}
              className="flex-1 rounded-lg"
            >
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notification, index) => {
            const config = iconMap[notification.type];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notification.id)}
                className={`mb-3 cursor-pointer ${
                  !notification.read ? "scale-[1.02]" : ""
                }`}
              >
                <Card className={`overflow-hidden transition-all hover:shadow-lg ${
                  !notification.read 
                    ? "bg-white dark:bg-slate-900 border-amber-500/30 shadow-md" 
                    : "bg-white/50 dark:bg-slate-900/50 border-transparent"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-slate-800 dark:text-slate-200">
                              <span className="font-semibold">{notification.user.name}</span>{" "}
                              {notification.content}{" "}
                              {notification.target && (
                                <span className="font-medium text-amber-600 dark:text-amber-400">
                                  {notification.target}
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.timestamp}
                              </span>
                              {notification.user.level > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  Lvl {notification.user.level}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-slate-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                dismiss(notification.id);
                              }}
                            >
                              <X className="w-4 h-4" />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Bell className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <p className="text-xl text-slate-500">
              No {activeTab === "unread" ? "unread" : ""} notifications
            </p>
            <p className="text-slate-400 mt-2">
              You're all caught up!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
