"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "./auth-context";
import {
  Home, Search, PlusCircle, MessageSquare, Bell, User,
  Settings, LogOut, Crown, Shield, Users, MapPin, Sun, Moon,
  Heart, Bookmark, Zap, TrendingUp, Compass, LogIn, UserPlus
} from "lucide-react";

interface SidebarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const PUBLIC_NAV = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "explore", label: "Explore", href: "/explore", icon: Compass },
  { id: "login", label: "Login", href: "/login", icon: LogIn },
];

const AUTH_NAV = {
  member: [
    { id: "feed", label: "Feed", href: "/", icon: Home },
    { id: "explore", label: "Explore", href: "/explore", icon: Compass },
    { id: "messages", label: "Messages", href: "/messages", icon: MessageSquare },
    { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
    { id: "profile", label: "Profile", href: "/profile", icon: User },
  ],
  business: [
    { id: "dashboard", label: "Dashboard", href: "/business", icon: Home },
    { id: "create-ad", label: "Create Ad", href: "/business/create-ad", icon: PlusCircle },
    { id: "analytics", label: "Analytics", href: "/business/analytics", icon: TrendingUp },
    { id: "profile", label: "Profile", href: "/profile", icon: User },
  ],
  admin: [
    { id: "dashboard", label: "Dashboard", href: "/admin", icon: Shield },
    { id: "moderate", label: "Moderate", href: "/admin/moderate", icon: Crown },
    { id: "analytics", label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { id: "members", label: "Members", href: "/admin/members", icon: Users },
  ],
  superadmin: [
    { id: "super-dashboard", label: "Super Dashboard", href: "/superadmin", icon: Crown },
    { id: "platform", label: "Platform", href: "/superadmin/platform", icon: Zap },
    { id: "revenue", label: "Revenue", href: "/superadmin/revenue", icon: TrendingUp },
    { id: "all-admins", label: "All Admins", href: "/superadmin/admins", icon: Shield },
  ],
};

// Realistic Indian user photos from Unsplash
const REALISTIC_IND_AVATARS = {
  male: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200",
  ],
  female: [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  ],
};

export function Sidebar({ isDarkMode, onToggleTheme }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  // Default to member nav if not logged in (for explore page access)
  const navItems = isLoggedIn && user 
    ? AUTH_NAV[user.role] || AUTH_NAV.member
    : PUBLIC_NAV;

  const roleColors = {
    member: "from-purple-500 to-pink-500",
    admin: "from-blue-500 to-cyan-500",
    superadmin: "from-amber-500 to-orange-500",
    business: "from-blue-600 to-cyan-500",
    guest: "from-slate-500 to-gray-500",
  };

  const role = user?.role || "guest";
  const userColor = roleColors[role];
  const RoleIcon = role === "admin" ? Shield : role === "superadmin" ? Crown : User;

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`fixed left-0 top-0 h-screen z-40 hidden lg:flex flex-col bg-background border-r border-border transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${userColor} flex items-center justify-center shadow-lg`}>
              <span className="text-white font-black text-lg">E</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Swaynix</span>
            )}
          </Link>
        </div>

        {/* User Card - Only show when logged in */}
        {isLoggedIn && user && (
          <div className="px-4 mb-6">
            <div className={`p-4 rounded-2xl bg-muted border border-border ${isCollapsed ? "text-center" : ""}`}>
              <Avatar className={`w-14 h-14 ring-4 ring-purple-500/30 ${isCollapsed ? "mx-auto" : ""}`}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`bg-gradient-to-br ${userColor} text-white text-lg font-bold`}>
                  {user.name?.split(" ").map(n => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <h3 className="font-bold text-foreground mt-3">{user.name}</h3>
                  <p className="text-muted-foreground text-sm">@{user.handle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`bg-gradient-to-r ${userColor} text-white border-0 text-xs`}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {role === "superadmin" ? "Super Admin" : role === "admin" ? "Admin" : role === "business" ? "Business" : "Member"}
                    </Badge>
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                      Lvl {user.level}
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link key={item.id} href={item.href}>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </motion.button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-2 border-t border-border">
          {/* Dark Mode Toggle */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-muted ${isCollapsed ? "justify-center" : ""}`}>
            {isCollapsed ? (
              <button onClick={onToggleTheme} className="text-muted-foreground hover:text-foreground">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            ) : (
              <>
                <span className="text-muted-foreground text-sm flex-1">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                <Switch checked={isDarkMode} onCheckedChange={onToggleTheme} />
              </>
            )}
          </div>

          {isLoggedIn ? (
            <>
              <Link href="/settings">
                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${isCollapsed ? "justify-center" : ""}`}>
                  <Settings className="w-5 h-5" />
                  {!isCollapsed && <span className="font-medium">Settings</span>}
                </button>
              </Link>
              <button 
                onClick={logout}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all ${isCollapsed ? "justify-center" : ""}`}
              >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-primary hover:bg-primary/10 transition-all ${isCollapsed ? "justify-center" : ""}`}>
                <LogIn className="w-5 h-5" />
                {!isCollapsed && <span className="font-medium">Login</span>}
              </button>
            </Link>
          )}
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t border-border">
        <div className="flex items-center justify-around px-2 py-2">
          <Link href="/">
            <button className="flex flex-col items-center gap-1 px-4 py-2 text-primary">
              <Home className="w-6 h-6" />
              <span className="text-[10px]">Feed</span>
            </button>
          </Link>
          <Link href="/explore">
            <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground">
              <Compass className="w-6 h-6" />
              <span className="text-[10px]">Explore</span>
            </button>
          </Link>
          <Link href="/post">
            <button className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg -mt-6">
              <PlusCircle className="w-7 h-7" />
            </button>
          </Link>
          {isLoggedIn ? (
            <Link href="/messages">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground">
                <MessageSquare className="w-6 h-6" />
                <span className="text-[10px]">Chat</span>
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground">
                <LogIn className="w-6 h-6" />
                <span className="text-[10px]">Login</span>
              </button>
            </Link>
          )}
          <Link href={isLoggedIn ? "/profile" : "/login"}>
            <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground">
              <User className="w-6 h-6" />
              <span className="text-[10px]">{isLoggedIn ? "Profile" : "Login"}</span>
            </button>
          </Link>
        </div>
      </nav>
    </>
  );
}
