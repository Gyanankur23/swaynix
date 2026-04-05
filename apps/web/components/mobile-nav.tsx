"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Search, PlusCircle, Trophy, Settings,
  MessageSquare, Bell, User
} from "lucide-react";

interface MobileNavProps {
  engagementScore?: number;
  nextLevelScore?: number;
}

const NAV_ITEMS = [
  { id: "feed", label: "Feed", href: "/", icon: Home },
  { id: "search", label: "Search", href: "/explore", icon: Search },
  { id: "post", label: "Post", href: "/post", icon: PlusCircle, isAction: true },
  { id: "score", label: "Score", href: "/profile", icon: Trophy },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

function EngagementRing({ 
  score, 
  maxScore = 100,
  size = 44,
  strokeWidth = 4 
}: { 
  score: number; 
  maxScore?: number; 
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(score / maxScore, 1);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-foreground font-bold text-[8px]">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

export function MobileNav({ engagementScore = 45, nextLevelScore = 100 }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-primary/10 pb-safe">
        <div className="flex items-center justify-around px-2 h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const isPost = item.id === "post";

            return (
              <Link key={item.id} href={item.href} className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                    transition-colors duration-200
                    ${isActive && !isPost ? "text-primary" : "text-muted-foreground"}
                    ${isPost ? "" : "hover:text-primary"}
                  `}
                >
                  {isPost ? (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-2xl bg-swaynix-gradient border border-black/5 flex items-center justify-center shadow-lg -mt-8"
                    >
                      <PlusCircle className="w-6 h-6 text-foreground" />
                    </motion.div>
                  ) : item.id === "score" ? (
                    <div className="relative">
                      <EngagementRing score={engagementScore} maxScore={nextLevelScore} />
                    </div>
                  ) : (
                    <>
                      <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : ""}`} />
                      <span className="text-[9px] font-black italic uppercase tracking-widest">{item.label}</span>
                    </>
                  )}
                </motion.button>
              </Link>
            );
          })}
        </div>
      </nav>
      <EngagementPopup />
    </>
  );
}

function EngagementPopup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 0, y: 50 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-white/90 backdrop-blur-md border border-primary/20 rounded-[2rem] px-8 py-4 shadow-premium">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-black italic">+5 Signal Intensity!</p>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Global Level Rising</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DesktopNav({ engagementScore = 45, nextLevelScore = 100 }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-swaynix-gradient border border-black/5 flex items-center justify-center shadow-md">
              <span className="text-foreground font-black italic text-lg">S</span>
            </div>
            <span className="font-black italic text-2xl tracking-tighter text-foreground">Swaynix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {[
              { href: "/", label: "Hub Feed", icon: Home },
              { href: "/explore", label: "Discovery", icon: Search },
              { href: "/notifications", label: "Radar", icon: Bell },
              { href: "/profile", label: "Identity", icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-xl font-black italic
                      transition-all duration-200
                      ${isActive ? "bg-swaynix-gradient text-foreground border border-black/5 shadow-md" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </motion.button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 bg-primary/5 rounded-full pl-6 pr-2 py-2 border border-primary/10">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Signal</span>
                <span className="text-foreground font-black italic text-sm leading-none">{engagementScore}</span>
              </div>
              <EngagementRing score={engagementScore} maxScore={nextLevelScore} size={32} strokeWidth={3} />
            </div>

            <Link href="/post">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-swaynix-gradient text-foreground border border-black/5 px-6 h-11 rounded-xl font-black italic shadow-lg hover:translate-y-[-2px] transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Post</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
