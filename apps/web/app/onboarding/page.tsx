"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth-context";
import { 
  Plane, 
  Code, 
  UtensilsCrossed, 
  Music, 
  Trophy, 
  Camera,
  Briefcase,
  Dumbbell,
  TrendingUp,
  Check,
  Zap
} from "lucide-react";

const INTERESTS = [
  { id: "travel", label: "Travel", icon: Plane, color: "bg-blue-500", description: "Explore destinations & share experiences" },
  { id: "code", label: "Programming", icon: Code, color: "bg-purple-500", description: "Software development & engineering" },
  { id: "food", label: "Food", icon: UtensilsCrossed, color: "bg-orange-500", description: "Recipes, restaurants & dining" },
  { id: "music", label: "Music", icon: Music, color: "bg-pink-500", description: "Bollywood, pop & live events" },
  { id: "sports", label: "Sports", icon: Trophy, color: "bg-green-500", description: "Cricket, football & fitness" },
  { id: "photography", label: "Photography", icon: Camera, color: "bg-teal-500", description: "Visual arts & creative shots" },
  { id: "business", label: "Business", icon: Briefcase, color: "bg-indigo-500", description: "Marketing, startups & finance" },
  { id: "ai", label: "AI & ML", icon: Zap, color: "bg-yellow-500", description: "Data science & future tech" },
  { id: "react", label: "React JS", icon: Code, color: "bg-blue-400", description: "Frontend web development" },
  { id: "fitness", label: "Fitness", icon: Dumbbell, color: "bg-red-500", description: "Health, yoga & workouts" },
  { id: "finance", label: "Finance", icon: TrendingUp, color: "bg-emerald-500", description: "Investing & stock markets" },
  { id: "python", label: "Python", icon: Code, color: "bg-yellow-600", description: "Backend & data processing" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedInterests.length === 0) return;
    
    setIsLoading(true);
    
    // Update user with interests
    if (user) {
      const updatedUser = { 
        ...user, 
        interests: selectedInterests,
      };
      login(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
    
    setTimeout(() => {
      router.push("/");
    }, 500);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Please login first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8 lg:pl-72 lg:pr-8 font-jakarta">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Welcome to Swaynix, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your interests to personalize your feed
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-full" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step 2 of 2 • Select at least 3 interests
          </p>
        </motion.div>

        {/* Interests Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
        >
          {INTERESTS.map((interest, index) => {
            const Icon = interest.icon;
            const isSelected = selectedInterests.includes(interest.id);
            
            return (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-premium rounded-[2rem] border-2 ${
                    isSelected 
                      ? "bg-primary text-white border-primary shadow-premium"
                      : "bg-white/80 backdrop-blur-md text-muted-foreground border-muted hover:border-primary/20"
                  }`}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${interest.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{interest.label}</h3>
                    <p className="text-xs text-muted-foreground">{interest.description}</p>
                    {isSelected && (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-white uppercase tracking-widest">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Selected Count & Continue */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t p-4"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {selectedInterests.length} selected
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedInterests.length < 3 
                  ? `Select ${3 - selectedInterests.length} more to continue` 
                  : "Great choices! Ready to go"}
              </p>
            </div>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl h-16 px-12 shadow-xl shadow-primary/20"
              disabled={selectedInterests.length < 3 || isLoading}
              onClick={handleContinue}
            >
              {isLoading ? "Saving..." : "Finish Selection"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
