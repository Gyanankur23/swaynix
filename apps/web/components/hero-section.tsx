"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageCircle, 
  Compass
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "./animated-counter";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: mounted ? containerRef : undefined,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { icon: Users, value: 50, suffix: "K+", label: "Users" },
    { icon: Compass, value: 22, suffix: "", label: "Categories" },
    { icon: MessageCircle, value: 10, suffix: "M+", label: "Messages" },
  ];

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-white font-inter">
      {/* Full-bleed group photo — same framing as original; light scrim only (no dark overlay) */}
      <motion.div 
        style={{ scale, opacity, y }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="/hero-main.png" 
          alt="Community connection at Swaynix" 
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-white/95 pointer-events-none"
          aria-hidden
        />
      </motion.div>
      
      <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center min-h-screen justify-center">
        <div className="absolute top-10 right-10 flex gap-4">
           <Link href="/login">
              <Button variant="outline" className="bg-white/90 backdrop-blur-md border-primary/15 text-foreground font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-white">
                User Login
              </Button>
           </Link>
           <Link href="/login?role=business">
              <Button variant="outline" className="bg-white/90 backdrop-blur-md border-primary/15 text-foreground font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-white">
                Business Login
              </Button>
           </Link>
           <Link href="/signup">
              <Button className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg border-none hover:bg-primary/90">
                Sign Up
              </Button>
           </Link>
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="text-center space-y-6 max-w-5xl"
        >
           <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-tight text-foreground drop-shadow-[0_2px_24px_rgba(255,255,255,0.9)]">
              Welcome to <span className="italic text-primary">Swaynix</span>
           </h1>
           <p className="text-2xl md:text-4xl font-medium text-foreground/90 drop-shadow-[0_1px_16px_rgba(255,255,255,0.85)] leading-snug">
              Connect with real people across your favorite interests.
           </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-center text-foreground/85 max-w-3xl mx-auto mt-8 leading-relaxed font-medium drop-shadow-[0_1px_12px_rgba(255,255,255,0.8)]"
        >
          Discover communities that match your lifestyle. Whether it&apos;s sports, coding, or cooking, find your tribe on Swaynix.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
        >
          <Link href="/explore">
            <Button className="h-16 px-12 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-xl hover:translate-y-[-2px] transition-all">
               Explore Communities
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="h-16 px-12 bg-white/95 backdrop-blur-md border-2 border-primary/20 rounded-2xl text-foreground font-bold text-lg hover:bg-white transition-all shadow-md">
               Join Now
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-4xl"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="p-8 bg-white rounded-[2.5rem] border border-primary/10 shadow-premium text-center">
               <stat.icon className="w-10 h-10 mx-auto mb-4 text-primary/80" />
               <div className="text-4xl font-bold text-foreground mb-2">
                 <AnimatedCounter value={stat.value} suffix={stat.suffix} />
               </div>
               <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50 flex flex-col items-center z-10">
         <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Scroll to see more</p>
         <div className="w-px h-12 bg-primary/40 animate-pulse" />
      </div>
    </div>
  );
}
