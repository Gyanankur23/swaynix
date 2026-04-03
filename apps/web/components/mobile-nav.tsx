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

// Circular progress component for engagement score
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
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring - Neon Green */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00FF85"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            filter: "drop-shadow(0 0 6px rgba(0,255,133,0.6))",
          }}
        />
      </svg>
      {/* Score display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-xs">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

export function MobileNav({ engagementScore = 45, nextLevelScore = 100 }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800">
        <div className="flex items-center justify-around px-2 py-2">
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
                    ${isActive && !isPost ? "text-[#00FF85]" : "text-gray-500"}
                    ${isPost ? "" : "hover:text-gray-300"}
                  `}
                >
                  {isPost ? (
                    // Special styling for Post button
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 rounded-full bg-[#00FF85] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,133,0.4)]"
                    >
                      <PlusCircle className="w-7 h-7 text-black" />
                    </motion.div>
                  ) : item.id === "score" ? (
                    // Engagement score ring
                    <div className="relative">
                      <EngagementRing score={engagementScore} maxScore={nextLevelScore} />
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00FF85]"
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : ""}`} />
                      <span className="text-[10px] font-medium">{item.label}</span>
                      {isActive && item.id !== "score" && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#00FF85]"
                        />
                      )}
                    </>
                  )}
                </motion.button>
              </Link>
            );
          })}
        </div>
        
        {/* Safe area padding for mobile */}
        <div className="h-safe-area-inset-bottom bg-black" />
      </nav>

      {/* Engagement Score Popup (appears when score increases) */}
      <EngagementPopup />
    </>
  );
}

// Popup notification for engagement score increases
function EngagementPopup() {
  // This would be triggered by a global state or context
  // For now, it's a static component ready for integration
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 0, y: 50, scale: 0.9 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-gray-900 border border-[#00FF85]/50 rounded-2xl px-6 py-4 shadow-[0_0_30px_rgba(0,255,133,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00FF85]/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#00FF85]" />
          </div>
          <div>
            <p className="text-white font-bold">+5 Engagement Score!</p>
            <p className="text-gray-400 text-sm">Keep contributing to level up</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Desktop Navigation (horizontal top nav)
export function DesktopNav({ engagementScore = 45, nextLevelScore = 100 }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00FF85] flex items-center justify-center">
              <span className="text-black font-bold text-sm">EH</span>
            </div>
            <span className="font-black text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Swaynix</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Feed", icon: Home },
              { href: "/explore", label: "Explore", icon: Search },
              { href: "/notifications", label: "Notifications", icon: Bell },
              { href: "/profile", label: "Profile", icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      transition-colors duration-200
                      ${isActive ? "bg-gray-800 text-[#00FF85]" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                </Link>
              );
            })}
          </nav>

          {/* Right side: Score + Post button */}
          <div className="flex items-center gap-4">
            {/* Engagement Score */}
            <div className="flex items-center gap-3 bg-gray-900 rounded-full pl-4 pr-2 py-1.5 border border-gray-800">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Score</span>
                <span className="text-white font-bold text-sm leading-none">{engagementScore}</span>
              </div>
              <EngagementRing score={engagementScore} maxScore={nextLevelScore} size={36} strokeWidth={3} />
            </div>

            {/* Post Button */}
            <Link href="/post">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-[#00FF85] text-black px-4 py-2 rounded-full font-bold hover:bg-[#00FF85]/90 transition-colors"
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
