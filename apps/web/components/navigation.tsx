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
  { icon: Home, label: "Feed", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: Plus, label: "Create", href: "/post", highlight: true },
  { icon: Bell, label: "Radar", href: "/notifications", badge: 3 },
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md border-b shadow-md" 
          : "bg-white/80 backdrop-blur-md border-b border-primary/10"
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-swaynix-gradient border border-black/5 flex items-center justify-center rounded-2xl shadow-xl transition-transform group-hover:rotate-12">
                <Flame className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-foreground group-hover:text-primary transition-colors">Swaynix</span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-lg mx-12">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Sector scan active..."
                  className="w-full pl-12 pr-6 h-12 bg-primary/5 text-foreground border border-primary/10 rounded-2xl text-sm font-bold shadow-inner focus:bg-white focus:shadow-xl focus:border-primary/30 transition-all outline-none"
                />
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} active={pathname === item.href} />
              ))}
              
              <Link href="/profile">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Avatar className="w-11 h-11 cursor-pointer border-4 border-white shadow-xl hover:border-primary/20 transition-all">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-primary text-foreground font-black italic">JD</AvatarFallback>
                  </Avatar>
                </motion.div>
              </Link>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-8 h-8 text-foreground" />
              ) : (
                <Menu className="w-8 h-8 text-foreground" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl md:hidden overflow-hidden flex flex-col items-center justify-center p-10"
          >
            <div className="w-full space-y-4 max-w-sm">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-6 py-6 px-10 rounded-[2.5rem] text-3xl font-black italic tracking-tighter transition-all ${
                      pathname === item.href 
                        ? "bg-swaynix-gradient text-foreground border border-black/5 shadow-2xl scale-105" 
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <item.icon className="w-10 h-10" />
                    {item.label}
                    {item.badge && (
                      <Badge className="ml-auto bg-primary text-foreground">
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
    </>
  );
}

function NavLink({ item, active }: { item: any; active: boolean }) {
  return (
    <Link href={item.href}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black italic text-sm ${
          item.highlight
            ? "bg-swaynix-gradient text-foreground border border-black/5 shadow-xl"
            : active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
        {item.badge && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] font-black text-foreground rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
            {item.badge}
          </span>
        )}
      </motion.div>
    </Link>
  );
}
