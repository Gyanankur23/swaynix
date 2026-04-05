"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterestChooser } from "@/components/interest-chooser";
import { 
  ArrowRight, Sparkles, ShieldCheck, Mail, User, 
  MapPin, Check, ChevronRight, ArrowLeft, Heart, 
  Zap, Compass, Target, Star
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

// Premium Unsplash images for human connectivity
const HUMAN_MOMENTS = [
  "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const router = useRouter();
  const { signup } = useAuth();

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleComplete = async () => {
    await signup({ email, name, interests, handle: name.toLowerCase().replace(/\s/g, "_") });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white font-inter relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-10 h-full min-h-screen flex items-center justify-center py-20 pb-0 lg:pl-80 font-inter">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-4xl bg-white rounded-[4rem] p-16 shadow-premium border-2 border-primary/5 space-y-12"
            >
              <div className="text-center space-y-6 relative z-10">
                <div className="inline-flex items-center gap-4 px-8 py-3 bg-primary/5 rounded-full border border-primary/10 text-primary font-bold text-xs uppercase tracking-[0.3em] shadow-sm mb-4">
                  <Star className="w-5 h-5 fill-current" />
                  Create Your Account
                </div>
                <h1 className="text-7xl lg:text-9xl font-bold text-foreground tracking-tighter leading-none">Join <br />Swaynix.</h1>
                <p className="text-2xl font-medium text-muted-foreground/60 leading-relaxed max-w-2xl mx-auto">Enter your details to get started on your discovery journey across Swaynix.</p>
              </div>

              <div className="max-w-xl mx-auto space-y-8 relative z-10">
                <div className="group transition-all">
                   <div className="flex items-center gap-4 mb-4 ml-4">
                      <User className="w-6 h-6 text-primary" />
                      <span className="text-[10px] font-bold uppercase text-primary tracking-[0.2em]">FULL NAME</span>
                   </div>
                   <Input 
                    placeholder="Your Name (e.g. Gyanankur)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-24 px-10 bg-white border-2 border-primary/5 shadow-xl rounded-[2rem] text-3xl font-bold placeholder:text-muted-foreground/10 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-foreground"
                  />
                </div>
                
                <div className="group transition-all">
                   <div className="flex items-center gap-4 mb-4 ml-4">
                      <Mail className="w-6 h-6 text-primary" />
                      <span className="text-[10px] font-bold uppercase text-primary tracking-[0.2em]">EMAIL ADDRESS</span>
                   </div>
                   <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-24 px-10 bg-white border-2 border-primary/5 shadow-xl rounded-[2rem] text-3xl font-bold placeholder:text-muted-foreground/10 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-foreground"
                  />
                </div>

                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                   <Button 
                    onClick={handleNext}
                    className="w-full h-24 bg-primary text-white border-none rounded-[2.5rem] font-bold text-3xl tracking-tighter shadow-2xl hover:translate-y-[-4px] transition-all group overflow-hidden relative mt-4"
                   >
                    <span className="relative z-10 flex items-center justify-center gap-6 px-10">
                       CONTINUE
                       <ChevronRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                    </span>
                   </Button>
                </motion.div>
                
                <p className="text-center text-muted-foreground font-bold text-[10px] uppercase tracking-widest opacity-30 mt-8">By signing up, you accept our Terms of Service.</p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.05, x: -100 }}
              className="w-full max-w-6xl space-y-12"
            >
              <div className="flex items-center justify-between mb-12">
                 <Button variant="ghost" onClick={handleBack} className="h-16 px-8 rounded-full text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all font-bold text-lg tracking-tighter">
                   <ArrowLeft className="w-8 h-8 mr-4" />
                   Back
                 </Button>
                 <div className="flex gap-3">
                    {[1, 2].map(i => (
                      <div key={i} className={`w-12 h-2 rounded-full transition-all ${i === 2 ? "bg-primary shadow-lg shadow-primary/20" : "bg-primary/10"}`} />
                    ))}
                 </div>
              </div>
              
              <div className="space-y-4 mb-20 text-center lg:text-left">
                <div className="inline-flex items-center gap-4 px-8 py-3 bg-primary/5 rounded-full border border-primary/10 text-primary font-bold text-xs uppercase tracking-[0.3em] shadow-sm mb-4">
                  <Compass className="w-5 h-5" />
                  Step 2
                </div>
                <h2 className="text-7xl lg:text-9xl font-bold text-foreground tracking-tighter leading-none">Your Interests.</h2>
                <p className="text-2xl font-medium text-muted-foreground/60 max-w-2xl">Choose what you love and we'll connect you with the right communities.</p>
              </div>

              <InterestChooser 
                selected={interests} 
                onToggle={(interest) => {
                  setInterests(prev => 
                    prev.includes(interest) 
                      ? prev.filter(i => i !== interest)
                      : [...prev, interest]
                  );
                }} 
              />
              
              <div className="flex justify-end pt-12">
                 <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={handleComplete}
                    className="h-24 px-20 bg-primary text-white flex items-center gap-6 rounded-[2.5rem] shadow-premium border-none group"
                 >
                    <span className="font-bold text-3xl tracking-tighter">COMPLETE SIGNUP</span>
                    <Sparkles className="w-10 h-10 transition-transform group-hover:rotate-45" />
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
