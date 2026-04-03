"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, Compass, Bell, User, Plus, Search, 
  MessageCircle, Heart, Zap, Menu, X, Flame
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: Plus, label: "Create", href: "/create", highlight: true },
  { icon: Bell, label: "Notifications", href: "/notifications", badge: 3 },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"
              >
                <Flame className="w-5 h-5 text-white" />
              </motion.div>
              <span className={`text-xl font-bold ${isScrolled ? "text-slate-900 dark:text-white" : "text-white"}`}>
                <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Swaynix</span>
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isScrolled ? "text-slate-400" : "text-white/60"}`} />
                <input
                  type="text"
                  placeholder="Search cohorts, topics, people..."
                  className={`w-full pl-10 pr-4 py-2 rounded-full text-sm transition-all ${
                    isScrolled 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
                      : "bg-white/10 text-white placeholder:text-white/60 border border-white/20"
                  }`}
                />
              </div>
            </div>

            {/* Desktop Nav Items */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.slice(0, -1).map((item) => (
                <NavLink key={item.href} item={item} isScrolled={isScrolled} active={pathname === item.href} />
              ))}
              
              {/* Profile Dropdown Trigger */}
              <Link href="/profile">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-offset-2 ring-offset-transparent ring-amber-500">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${isScrolled ? "text-slate-900" : "text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isScrolled ? "text-slate-900" : "text-white"}`} />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white dark:bg-slate-950 md:hidden"
          >
            <div className="flex flex-col h-full pt-20 px-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 py-4 text-2xl font-medium ${
                      pathname === item.href 
                        ? "text-amber-500" 
                        : "text-slate-900 dark:text-white"
                    }`}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t dark:border-slate-800 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  pathname === item.href 
                    ? "text-amber-500" 
                    : "text-slate-400"
                }`}
              >
                {item.highlight ? (
                  <div className="w-12 h-12 -mt-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <>
                    <item.icon className="w-6 h-6" />
                    <span className="text-xs mt-1">{item.label}</span>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

function NavLink({ item, isScrolled, active }: { item: any; isScrolled: boolean; active: boolean }) {
  return (
    <Link href={item.href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          item.highlight 
            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
            : active
              ? isScrolled 
                ? "bg-slate-100 dark:bg-slate-800 text-amber-500" 
                : "bg-white/10 text-amber-400"
              : isScrolled 
                ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" 
                : "text-white/80 hover:bg-white/10"
        }`}
      >
        <item.icon className="w-4 h-4" />
        <span className="font-medium">{item.label}</span>
        {item.badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}
