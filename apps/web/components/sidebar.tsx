"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "./auth-context";
import {
  Home, Search, PlusCircle, MessageSquare, Bell, User,
  Settings, LogOut, Crown, Shield, Users, MapPin, Sun, Moon,
  Heart, Bookmark, Zap, TrendingUp, Compass, LogIn, UserPlus,
  BarChart3, Sparkles, ShieldCheck, Target
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PUBLIC_NAV = [
  { id: "home", label: "Home Feed", href: "/", icon: Home },
  { id: "explore", label: "Explore", href: "/explore", icon: Compass },
];

const AUTH_NAV = {
  member: [
    { id: "home", label: "Home Feed", href: "/", icon: Home },
    { id: "explore", label: "Explore", href: "/explore", icon: Compass },
    { id: "messages", label: "Messages", href: "/messages", icon: MessageSquare },
    { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
    { id: "profile", label: "Profile", href: "/profile", icon: User },
  ],
  admin: [
    { id: "home", label: "Home Feed", href: "/", icon: Home },
    { id: "dashboard", label: "Admin Dashboard", href: "/admin", icon: ShieldCheck },
    { id: "users", label: "User Management", href: "/admin/users", icon: Users },
    { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  ],
  business: [
    { id: "home", label: "Home Feed", href: "/", icon: Home },
    { id: "analytics", label: "Analytics", href: "/business/analytics", icon: BarChart3 },
    { id: "leads", label: "Business Leads", href: "/business/leads", icon: Zap },
    { id: "notifications", label: "Notifications", href: "/notifications", icon: Bell },
    { id: "profile", label: "Business Profile", href: "/profile", icon: User },
  ],
  superadmin: [
    { id: "home", label: "Home Feed", href: "/", icon: Home },
    { id: "admin", label: "System Admin", href: "/admin", icon: Crown },
    { id: "settings", label: "Settings", href: "/settings", icon: Settings },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const navItems = isLoggedIn && user 
    ? AUTH_NAV[user.role] || AUTH_NAV.member
    : PUBLIC_NAV;

  return (
    <>
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`fixed left-0 top-0 h-screen z-50 hidden lg:flex flex-col bg-white border-r border-primary/10 shadow-premium transition-all duration-500 overflow-hidden ${
          isCollapsed ? "w-24" : "w-80"
        }`}
      >
        {/* Logo Section - Identity Focused */}
        <div className="p-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Swaynix" 
                className="w-14 h-14 rounded-2xl shadow-xl transition-all group-hover:scale-105 group-hover:rotate-6 object-cover"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-foreground leading-none">Swaynix</span>
                <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mt-1">Community Hub</span>
              </div>
            )}
          </Link>
        </div>

        {/* Identity Token */}
        {isLoggedIn && user && !isCollapsed && (
          <div className="px-8 mb-10">
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="p-6 bg-primary/[0.03] rounded-[2.5rem] border border-primary/5 shadow-sm hover:shadow-2xl hover:bg-white transition-all group cursor-pointer" 
               onClick={() => (window as any).location.href = '/profile'}
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-4 border-white shadow-xl group-hover:rotate-6 transition-transform">
                    <AvatarImage src={user.avatar} className="object-cover" />
                    <AvatarFallback className="bg-primary text-white font-bold">
                       {user.name[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <p className="font-bold text-xl text-foreground truncate tracking-tight leading-none mb-1">{user.name}</p>
                    <p className="text-[10px] font-bold uppercase text-primary tracking-widest leading-none">@{user.handle}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                 <Badge className="bg-primary text-white border-none font-bold text-[9px] px-3 py-1 rounded-full uppercase tracking-widest leading-none">{user.role}</Badge>
                 <Badge variant="outline" className="text-primary font-bold text-[9px] border-primary/20 leading-none px-3">Level {user.level}</Badge>
              </div>
            </motion.div>
          </div>
        )}

        {/* Global Navigation Hub */}
        <nav className="px-5 space-y-2 overflow-y-auto scrollbar-hide flex-1">
          <p className="px-6 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">Main Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.id} href={item.href}>
                <motion.button
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full flex items-center gap-5 px-6 h-14 rounded-2xl transition-all relative ${
                    isActive
                      ? "bg-primary text-white font-bold shadow-xl shadow-primary/20"
                      : "text-muted-foreground font-bold hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-primary/40 group-hover:text-primary"}`} />
                  {!isCollapsed && <span className="text-lg tracking-tight leading-none">{item.label}</span>}
                </motion.button>
              </Link>
            );
          })}

          {/* My Hubs Section - Only appears if joined */}
          {isLoggedIn && user && !isCollapsed && (
            <div className="mt-8 space-y-4">
              <p className="px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40">My Hubs</p>
              <div className="space-y-1">
                {user.interests && user.interests.length > 0 ? (
                  user.interests.map((hub) => (
                    <Link key={hub} href={`/explore?category=${hub}`}>
                      <motion.button
                        whileHover={{ x: 6 }}
                        className="w-full flex items-center gap-4 px-6 h-12 rounded-xl text-foreground font-semibold hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-base capitalize">{hub}</span>
                      </motion.button>
                    </Link>
                  ))
                ) : (
                  <p className="px-6 text-sm text-muted-foreground italic">No hubs joined yet</p>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Master Governance Zone */}
        <div className="p-8 space-y-4 border-t border-primary/5 bg-primary/[0.02]">
          {isLoggedIn ? (
            <>
              <Link href="/settings">
                <button className="w-full flex items-center gap-5 px-6 h-14 text-muted-foreground font-bold text-base hover:bg-primary/5 hover:text-primary transition-all rounded-[1.2rem]">
                  <Settings className="w-6 h-6" />
                  {!isCollapsed && <span>Settings</span>}
                </button>
              </Link>
              <ExitDialog onConfirm={logout} isCollapsed={isCollapsed} />
            </>
          ) : (
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full h-14 bg-primary text-white font-bold rounded-[1.2rem] shadow-xl hover:translate-y-[-2px] transition-all text-lg">
                  User Login
                </Button>
              </Link>
              <Link href="/login?role=business">
                <Button variant="outline" className="w-full h-14 border-primary/20 text-primary font-bold rounded-[1.2rem] hover:bg-primary/5 transition-all text-lg">
                  Business Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="ghost" className="w-full h-14 text-muted-foreground font-bold rounded-[1.2rem] hover:bg-primary/5 hover:text-primary transition-all text-lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Mobile Interaction Bar - Light Horizon */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-primary/10 shadow-premium pb-safe h-24">
        <div className="flex items-center justify-around h-full px-4">
          <MobileLink href="/" icon={Home} label="Home" active={pathname === "/"} />
          <MobileLink href="/explore" icon={Compass} label="Explore" active={pathname === "/explore"} />
          
          <Link href={user?.role === 'business' ? "/business/create-ad" : "/post"}>
            <motion.div 
               whileTap={{ scale: 0.8 }}
               className="w-16 h-16 bg-primary text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center -mt-12 group"
            >
              <PlusCircle className="w-9 h-9 transition-transform group-hover:rotate-90" />
            </motion.div>
          </Link>

          <MobileLink href="/messages" icon={MessageSquare} label="Messages" active={pathname === "/messages"} />
          <MobileLink href="/profile" icon={User} label="Profile" active={pathname === "/profile"} />
        </div>
      </nav>
    </>
  );
}

function MobileLink({ href, icon: Icon, label, active }: any) {
    return (
        <Link href={href}>
            <motion.button 
               whileTap={{ y: -4 }}
               className={`flex flex-col items-center gap-1.5 transition-all ${active ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"}`}
            >
                <Icon className={`w-7 h-7 ${active ? "text-primary" : "opacity-40"}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "opacity-100" : "opacity-40"}`}>{label}</span>
            </motion.button>
        </Link>
    )
}

function ExitDialog({ onConfirm, isCollapsed }: { onConfirm: () => void, isCollapsed: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-5 px-6 h-14 text-red-500 font-bold text-base hover:bg-red-50 transition-all rounded-[1.2rem]">
          <LogOut className="w-6 h-6" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </DialogTrigger>
      <DialogContent className="p-0 rounded-[4rem] border border-primary/10 shadow-premium overflow-hidden max-w-md bg-white font-inter">
        <div className="p-12 bg-primary text-white text-center space-y-6 relative overflow-hidden">
           <div className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/50"><LogOut className="w-12 h-12" /></div>
           <div className="relative z-10 space-y-2">
              <h2 className="text-4xl font-bold tracking-tighter leading-none">Confirm Logout?</h2>
              <p className="text-white/60 font-bold text-[10px] uppercase tracking-[0.2em]">Ready to logout</p>
           </div>
        </div>
        <div className="p-12 space-y-8">
            <p className="text-center text-xl font-medium text-muted-foreground leading-relaxed">Are you sure you want to log out of your account?</p>
            <div className="grid grid-cols-2 gap-6">
               <Button variant="ghost" onClick={() => setIsOpen(false)} className="h-16 rounded-[1.5rem] font-bold text-lg hover:bg-primary/5">Cancel</Button>
               <Button onClick={() => { setIsOpen(false); onConfirm(); }} className="h-16 bg-red-500 text-white font-bold rounded-[1.5rem] shadow-2xl shadow-red-500/20 hover:scale-105 transition-all text-lg">Log Out</Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
