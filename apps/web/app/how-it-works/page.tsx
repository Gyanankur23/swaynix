"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/particle-background";
import { 
  Users, Compass, MessageCircle, Trophy, 
  Zap, Shield, Heart, ArrowRight, Sparkles,
  Target, TrendingUp, Globe
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: Compass,
    title: "Discover Cohorts",
    description: "Find communities based on your interests - travel, tech, food, fitness & more. Our smart matching connects you with like-minded Indians.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Connect Authentically",
    description: "No follower counts. No vanity metrics. Just genuine connections with people who share your passions across India.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: MessageCircle,
    title: "Engage Meaningfully",
    description: "Participate in discussions, share experiences, and build real relationships. Quality over quantity, always.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Trophy,
    title: "Earn & Grow",
    description: "Get recognized for your contributions. Level up through meaningful interactions, not just likes.",
    color: "from-green-500 to-emerald-500",
  },
];

const features = [
  {
    icon: Shield,
    title: "Anti-Vanity Design",
    description: "No public follower counts. Private connection metrics. Focus on quality engagement, not vanity numbers.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-millisecond cohort matching. Find your tribe instantly.",
  },
  {
    icon: Target,
    title: "Interest-Based",
    description: "Smart matching connects you with people who truly share your specific interests.",
  },
  {
    icon: Globe,
    title: "Pan-India",
    description: "From Mumbai to Delhi, Bangalore to Kolkata - connect with communities across all major Indian cities.",
  },
  {
    icon: Heart,
    title: "Real Connections",
    description: "Meaningful interaction scoring rewards depth over breadth. Build relationships that matter.",
  },
  {
    icon: TrendingUp,
    title: "Growth Tracking",
    description: "Track your engagement score and level up through genuine community participation.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-white pt-24 pb-20 lg:pl-[20rem] overflow-hidden font-inter">
      {/* Light mode creamy peach gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 via-white to-orange-50/40 pointer-events-none" />
      
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <ParticleBackground />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">How it Works</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tighter text-foreground leading-none">
            The Swaynix <span className="text-primary">Way</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
            Connecting humans across India through shared interests. No bots, no followers, just real engagement.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-premium bg-white/80 backdrop-blur-md rounded-[2.5rem] hover:translate-y-[-4px] transition-all">
                <CardContent className="p-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed italic">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-24"
        >
          <h2 className="text-4xl font-bold text-center text-foreground tracking-tight mb-16">
            Why Authenticity Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-8 rounded-[2rem] bg-white border border-primary/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all backdrop-blur-sm group"
              >
                <feature.icon className="w-10 h-10 text-primary mb-6 transition-transform group-hover:scale-110" />
                <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="border-none shadow-2xl bg-primary text-white rounded-[4rem] overflow-hidden">
            <CardContent className="p-16 md:p-20 relative">
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-black/5 rounded-full blur-3xl pointer-events-none" />
               
               <div className="relative z-10 space-y-8">
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none">Join the Movement.</h2>
                  <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto italic leading-relaxed">
                    Start connecting with humans authentically today. No vanity metrics, just real communities.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <Link href="/signup">
                      <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-12 h-16 text-xl rounded-2xl group shadow-2xl font-bold border-none">
                        Get Started
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                  </div>
               </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
