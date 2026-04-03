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
  like: { icon: Heart, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-900/30" },
  comment: { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
  follow: { icon: UserPlus, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
  mention: { icon: AtSign, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
  join: { icon: Users, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
  share: { icon: Share2, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" },
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
    // Just mark as read for now - could add remove functionality later
    markNotificationRead(id);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Bell className="w-8 h-8 text-primary" />
                Notifications
                {unreadNotificationCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-lg px-3 py-1">
                    {unreadNotificationCount}
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground mt-1">
                Stay updated with your community activity
              </p>
            </div>
            <Button
              variant="outline"
              onClick={markAllNotificationsRead}
              disabled={unreadNotificationCount === 0}
              className="hidden sm:flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all read
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-card rounded-xl shadow-sm border">
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
              {unreadNotificationCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {unreadNotificationCount}
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
                onClick={() => handleMarkRead(notification.id)}
                className={`mb-3 cursor-pointer ${
                  !notification.read ? "scale-[1.02]" : ""
                }`}
              >
                <Card className={`overflow-hidden transition-all hover:shadow-lg ${
                  !notification.read 
                    ? "bg-card border-primary/30 shadow-md" 
                    : "bg-card/50 border-transparent"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar or Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                        {notification.fromAvatar ? (
                          <Avatar className="w-full h-full">
                            <AvatarImage src={notification.fromAvatar} />
                            <AvatarFallback>
                              <Icon className={`w-5 h-5 ${config.color}`} />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <Icon className={`w-6 h-6 ${config.color}`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-foreground">
                              <span className="font-semibold">{notification.fromUser}</span>{" "}
                              <span className="text-muted-foreground">{notification.message}</span>
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDismiss(notification.id);
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
            <Bell className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-xl text-muted-foreground">
              No {activeTab === "unread" ? "unread" : ""} notifications
            </p>
            <p className="text-muted-foreground/70 mt-2">
              You're all caught up!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
