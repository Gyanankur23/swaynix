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
    title: "Anti-FOMO Design",
    description: "No public follower counts. Private connection metrics. Focus on quality engagement, not vanity numbers.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-millisecond cohort matching with advanced GIN indexes. Find your tribe instantly.",
  },
  {
    icon: Target,
    title: "Interest-Based",
    description: "JSONB-powered matching connects you with people who truly share your specific interests.",
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
    <div className="relative min-h-screen bg-background pt-24 pb-20 lg:pl-72 overflow-hidden">
      {/* Light mode creamy peach gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 via-amber-50/40 to-orange-50/60 dark:hidden pointer-events-none" />
      
      {/* Dark mode gradient */}
      <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900 pointer-events-none" />
      
      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleBackground />
      </div>

      <div className="relative z-10 container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 dark:bg-purple-500/10 border border-orange-500/20 dark:border-purple-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500 dark:text-purple-400" />
            <span className="text-sm text-orange-600 dark:text-purple-400">Simple & Transparent</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            How Swaynix Works
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A new way to connect with communities across India. No followers, just real connections.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-orange-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-orange-600 dark:text-slate-400">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{step.description}</p>
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
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Choose EngageHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="p-6 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-orange-500/30 dark:hover:border-purple-500/30 transition-colors backdrop-blur-sm"
              >
                <feature.icon className="w-10 h-10 text-orange-500 dark:text-purple-500 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.description}</p>
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
          <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-purple-600 dark:via-pink-600 dark:to-purple-600 text-white">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of Indians already connecting authentically. No FOMO, just real communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 dark:text-purple-600 px-8 py-6 text-lg rounded-full group shadow-lg">
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full">
                    Explore Cohorts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-slate-500 dark:text-slate-500 mt-12 text-sm"
        >
          Questions? Visit our Help Center or contact support@engagehub.in
        </motion.p>
      </div>
    </div>
  );
}
