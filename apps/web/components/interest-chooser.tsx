"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ArrowRight, Zap } from "lucide-react";

// High-value technical interests for the anti-FOMO platform
const AVAILABLE_INTERESTS = [
  { id: "python", label: "Python", color: "#FFD43B", glow: "#00FF85" },
  { id: "react", label: "React", color: "#61DAFB", glow: "#00FF85" },
  { id: "ai", label: "AI", color: "#FF6B6B", glow: "#00FF85" },
  { id: "sql", label: "SQL", color: "#336791", glow: "#00FF85" },
  { id: "architecture", label: "Architecture", color: "#9B59B6", glow: "#00FF85" },
  { id: "scaling", label: "Scaling", color: "#E74C3C", glow: "#00FF85" },
  { id: "javascript", label: "JavaScript", color: "#F7DF1E", glow: "#00FF85" },
  { id: "nextjs", label: "Next.js", color: "#000000", glow: "#00FF85" },
  { id: "automation", label: "Automation", color: "#2ECC71", glow: "#00FF85" },
  { id: "ml", label: "Machine Learning", color: "#3498DB", glow: "#00FF85" },
  { id: "typescript", label: "TypeScript", color: "#3178C6", glow: "#00FF85" },
  { id: "postgresql", label: "PostgreSQL", color: "#4169E1", glow: "#00FF85" },
  { id: "redis", label: "Redis", color: "#DC382D", glow: "#00FF85" },
  { id: "docker", label: "Docker", color: "#2496ED", glow: "#00FF85" },
  { id: "kubernetes", label: "Kubernetes", color: "#326CE5", glow: "#00FF85" },
  { id: "aws", label: "AWS", color: "#FF9900", glow: "#00FF85" },
];

interface InterestChooserProps {
  onComplete: (selectedInterests: string[]) => void;
  minSelection?: number;
}

export function InterestChooser({ onComplete, minSelection = 3 }: InterestChooserProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isShaking, setIsShaking] = useState(false);
  const [showHaptic, setShowHaptic] = useState(false);

  const toggleInterest = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
      // Trigger haptic visual feedback
      setShowHaptic(true);
      setTimeout(() => setShowHaptic(false), 150);
    }
    setSelected(newSelected);
  };

  const handleContinue = () => {
    if (selected.size < minSelection) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    onComplete(Array.from(selected));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="pt-12 px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-2"
        >
          <Sparkles className="w-6 h-6 text-[#00FF85]" />
          <span className="text-[#00FF85] font-bold text-lg tracking-wider">SWAYNIX</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-white leading-tight mb-3"
        >
          What fires you up?
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg"
        >
          Pick at least {minSelection} to unlock your personalized feed
        </motion.p>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#00FF85] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((selected.size / minSelection) * 100, 100)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <span className="text-white font-bold text-lg">
            {selected.size}/{minSelection}
          </span>
        </div>
      </div>

      {/* Interest Cloud */}
      <div className="flex-1 px-6 overflow-y-auto pb-32">
        <div className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence>
            {AVAILABLE_INTERESTS.map((interest, index) => {
              const isSelected = selected.has(interest.id);
              return (
                <motion.button
                  key={interest.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isSelected ? 1.05 : 1,
                    y: isSelected ? -4 : 0
                  }}
                  transition={{ delay: index * 0.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={`
                    relative px-6 py-4 rounded-full text-2xl font-bold
                    transition-all duration-200 ease-out
                    min-h-[64px] min-w-[120px]
                    ${isSelected 
                      ? "bg-black border-2 border-[#00FF85] text-[#00FF85] shadow-[0_0_30px_rgba(0,255,133,0.5)]" 
                      : "bg-gray-900 border-2 border-gray-800 text-white hover:border-gray-600"
                    }
                    ${isShaking && !isSelected && selected.size < minSelection ? "animate-shake" : ""}
                  `}
                  style={{
                    boxShadow: isSelected 
                      ? `0 0 40px ${interest.glow}40, inset 0 0 20px ${interest.glow}20`
                      : undefined
                  }}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex"
                      >
                        <Check className="w-6 h-6" />
                      </motion.span>
                    )}
                    {interest.label}
                  </span>
                  
                  {/* Glow effect for selected */}
                  {isSelected && (
                    <motion.div
                      layoutId={`glow-${interest.id}`}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${interest.glow}20 0%, transparent 70%)`,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Haptic Feedback Overlay */}
      <AnimatePresence>
        {showHaptic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <div className="w-full h-full bg-[#00FF85] opacity-5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleContinue}
            disabled={selected.size < minSelection}
            className={`
              w-full h-16 text-xl font-bold rounded-2xl
              transition-all duration-300
              ${selected.size >= minSelection
                ? "bg-[#00FF85] text-black hover:bg-[#00FF85]/90 shadow-[0_0_40px_rgba(0,255,133,0.4)]"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            <span className="flex items-center gap-2">
              {selected.size >= minSelection ? (
                <>
                  <Zap className="w-6 h-6" />
                  Unlock My Feed
                  <ArrowRight className="w-6 h-6" />
                </>
              ) : (
                `Select ${minSelection - selected.size} more`
              )}
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Add shake animation styles */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
