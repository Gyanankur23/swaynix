"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, ArrowRight, Zap, Flame, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AVAILABLE_INTERESTS = [
  { id: "python", label: "Python", color: "#F97316" },
  { id: "react", label: "React", color: "#F97316" },
  { id: "ai", label: "AI", color: "#F97316" },
  { id: "sql", label: "SQL", color: "#F97316" },
  { id: "architecture", label: "Architecture", color: "#F97316" },
  { id: "scaling", label: "Scaling", color: "#F97316" },
  { id: "javascript", label: "JavaScript", color: "#F97316" },
  { id: "nextjs", label: "Next.js", color: "#F97316" },
  { id: "automation", label: "Automation", color: "#F97316" },
  { id: "ml", label: "Machine Learning", color: "#F97316" },
  { id: "typescript", label: "TypeScript", color: "#F97316" },
  { id: "postgresql", label: "PostgreSQL", color: "#F97316" },
  { id: "redis", label: "Redis", color: "#F97316" },
  { id: "docker", label: "Docker", color: "#F97316" },
  { id: "kubernetes", label: "Kubernetes", color: "#F97316" },
  { id: "aws", label: "AWS", color: "#F97316" },
];

interface InterestChooserProps {
  onComplete?: (selectedInterests: string[]) => void;
  minSelection?: number;
  selected?: string[];
  onToggle?: (interest: string) => void;
}

export function InterestChooser({ onComplete, minSelection = 3, selected: externalSelected, onToggle }: InterestChooserProps) {
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());
  const selected = externalSelected ? new Set(externalSelected) : internalSelected;
  const [isShaking, setIsShaking] = useState(false);

  const toggleInterest = (id: string) => {
    if (onToggle) {
      onToggle(id);
    } else {
      const newSelected = new Set(selected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setInternalSelected(newSelected);
    }
  };

  const handleContinue = () => {
    if (selected.size < minSelection) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    if (onComplete) onComplete(Array.from(selected));
  };

  return (
    <div className="flex flex-col font-inter space-y-12">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="flex flex-wrap gap-4 justify-center">
            {AVAILABLE_INTERESTS.map((interest, index) => {
              const isSelected = selected.has(interest.id);
              return (
                <motion.button
                  key={interest.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isSelected ? 1.1 : 1,
                    y: isSelected ? -4 : 0
                  }}
                  transition={{ delay: index * 0.02, type: "spring", stiffness: 300 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterest(interest.id)}
                  className={`
                    relative px-10 py-6 rounded-[2rem] text-xl font-bold tracking-tighter
                    transition-all duration-300 ease-out border shadow-sm
                    ${isSelected 
                      ? "bg-primary text-white border-primary shadow-xl scale-105" 
                      : "bg-white border-primary/5 text-muted-foreground hover:bg-primary/5 hover:border-primary/20"
                    }
                    ${isShaking && !isSelected && selected.size < minSelection ? "animate-shake" : ""}
                  `}
                >
                  <span className="flex items-center gap-3">
                    {isSelected && <Check className="w-6 h-6" />}
                    {interest.label}
                  </span>
                </motion.button>
              );
            })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
