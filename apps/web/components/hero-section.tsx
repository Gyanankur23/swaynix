"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, Zap, Heart, Users, ArrowRight, 
  MessageCircle, Share2, TrendingUp, Target,
  Compass, Flame, Star
} from "lucide-react";
import Link from "next/link";
import { AnimatedCounter } from "./animated-counter";
import { ParticleBackground } from "./particle-background";
import { FloatingImage } from "./image-gallery";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { icon: Users, value: 1000, suffix: "+", label: "Active Members" },
    { icon: Compass, value: 50, suffix: "+", label: "Cohorts" },
    { icon: MessageCircle, value: 10, suffix: "K+", label: "Conversations" },
  ];

  const animationProps = mounted ? {} : { initial: false, animate: false };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background dark:bg-gradient-to-br dark:from-slate-950 dark:via-purple-950/40 dark:to-slate-950">
      <ParticleBackground />
      
      {/* Light mode creamy peach gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/80 via-amber-50/60 to-orange-50/80 dark:hidden pointer-events-none" />
      
      {/* Floating Background Images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingImage 
          query="technology" 
          size={180}
          position={{ top: "10%", left: "5%" }}
          delay={0.3}
          className="opacity-40"
        />
        <FloatingImage 
          query="community" 
          size={220}
          position={{ top: "60%", left: "8%" }}
          delay={0.5}
          className="opacity-30"
        />
        <FloatingImage 
          query="abstract" 
          size={160}
          position={{ top: "20%", right: "8%" }}
          delay={0.7}
          className="opacity-40"
        />
        <FloatingImage 
          query="network" 
          size={200}
          position={{ bottom: "15%", right: "5%" }}
          delay={0.9}
          className="opacity-30"
        />
        <FloatingImage 
          query="city" 
          size={140}
          position={{ top: "45%", right: "15%" }}
          delay={1.1}
          className="opacity-20"
        />
      </div>
      
      <motion.div style={{ y, opacity }} className="relative z-10 container mx-auto px-4 py-20">
        {/* Badge */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-orange-200/50 dark:border-white/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-500 dark:text-amber-400" />
            <span className="text-sm text-slate-700 dark:text-white/80">Anti-FOMO Community Platform</span>
          </div>
        </motion.div>

        {/* Main Headline - SWAYNIX */}
        <h1
          className="text-7xl md:text-9xl lg:text-[10rem] font-black text-center mb-6 text-orange-600 dark:text-amber-400 leading-none tracking-tight drop-shadow-lg"
        >
          Swaynix
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-8 text-slate-800 dark:text-white"
        >
          India&apos;s Community Hub
        </motion.p>

        {/* Subheadline */}
        <motion.p
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl lg:text-4xl text-center text-slate-700 dark:text-slate-300 max-w-4xl mx-auto mb-16 leading-relaxed font-medium"
        >
          Connect with 50,000+ Indians who share your passion for travel, tech, food & more.
          <span className="text-orange-600 dark:text-amber-400"> No followers. Just real connections.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
        >
          <Link href="/explore">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-6 text-lg rounded-full group shadow-lg shadow-orange-500/20">
              Start Exploring
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button size="lg" variant="outline" className="border-orange-300/50 text-slate-700 hover:bg-orange-50/50 dark:border-white/20 dark:text-white dark:hover:bg-white/10 px-8 py-6 text-lg rounded-full">
              How It Works
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={mounted ? { opacity: 0, y: 40 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : false}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={mounted ? { opacity: 0, scale: 0.9 } : false}
              animate={mounted ? { opacity: 1, scale: 1 } : false}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-orange-200/50 dark:border-white/10"
            >
              <stat.icon className="w-10 h-10 mx-auto mb-4 text-orange-500 dark:text-amber-400" />
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 dark:text-white mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingCard 
            icon={Heart} 
            text="No follower counts" 
            className="top-20 left-10" 
            delay={1.2}
            mounted={mounted}
          />
          <FloatingCard 
            icon={Target} 
            text="Interest-based matching" 
            className="top-40 right-10" 
            delay={1.4}
            mounted={mounted}
          />
          <FloatingCard 
            icon={Zap} 
            text="Sub-ms discovery" 
            className="bottom-40 left-20" 
            delay={1.6}
            mounted={mounted}
          />
        </div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-orange-100/50 dark:from-slate-950 to-transparent" />
    </div>
  );
}

function FloatingCard({ icon: Icon, text, className, delay, mounted }: { 
  icon: any; 
  text: string; 
  className: string; 
  delay: number;
  mounted: boolean;
}) {
  return (
    <motion.div
      initial={mounted ? { opacity: 0, scale: 0 } : false}
      animate={mounted ? { opacity: 1, scale: 1 } : false}
      transition={{ delay, duration: 0.5 }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-orange-200/50 dark:border-white/20 shadow-sm"
      >
        <Icon className="w-4 h-4 text-orange-500 dark:text-amber-400" />
        <span className="text-sm text-slate-700 dark:text-white/80">{text}</span>
      </motion.div>
    </motion.div>
  );
}
