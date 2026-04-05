"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, Mail, Lock, 
  ChevronRight, Zap
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

// Inner component uses useSearchParams — must be inside Suspense
function LoginForm() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const isBusiness = role === "business";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const mockUser = {
      id: isBusiness ? "biz-decathlon" : "user-123",
      name: isBusiness ? "Decathlon Admin" : email.split('@')[0],
      email,
      handle: isBusiness ? "decathlon_india" : email.split('@')[0],
      avatar: isBusiness 
        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Decathlon_logo.svg/2560px-Decathlon_logo.svg.png"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      level: isBusiness ? 100 : 42,
      role: isBusiness ? "business" as const : "member" as const,
      joinDate: new Date().toISOString()
    };
    await login(mockUser);
    router.push("/");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white font-jakarta">
      {/* Visual Identity Section */}
      <div className="hidden lg:block relative overflow-hidden bg-swaynix-gradient border-r border-primary/10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200" 
            alt="Human Connectivity" 
            className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
        </div>
        
        <div className="relative z-10 p-20 h-full flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            {isBusiness ? (
              <div className="w-20 bg-white p-4 rounded-xl shadow-2xl">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Decathlon_logo.svg/2560px-Decathlon_logo.svg.png" className="w-full" alt="Decathlon" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary flex items-center justify-center rounded-[1.5rem] shadow-2xl transition-transform group-hover:rotate-12">
                <span className="text-white font-bold text-3xl">S</span>
              </div>
            )}
            <span className="text-4xl font-bold tracking-tight text-foreground">{isBusiness ? "Partner Hub" : "Swaynix"}</span>
          </Link>
          
          <div className="space-y-10">
             <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-primary/10 transition-transform hover:translate-y-[-10px]">
                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 1400}?w=200`} alt="Member" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-16 h-16 rounded-full bg-primary text-white border-4 border-white shadow-xl flex items-center justify-center font-black text-xs tracking-tighter">10K+</div>
             </div>
             
             <div className="space-y-4">
                <h1 className="text-7xl font-bold text-foreground tracking-tighter leading-none">
                  {isBusiness ? "Empowering your Brand." : "Connecting your Community."}
                </h1>
                <p className="text-2xl font-medium text-muted-foreground/60 leading-tight">
                   {isBusiness ? "Welcome back, Partner." : "Welcome back to Swaynix."}
                </p>
             </div>
             
             <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Zap, label: "Fast Access", value: "Search" },
                  { icon: ShieldCheck, label: "Secure Login", value: "Private" }
                ].map(item => (
                  <div key={item.label} className="p-6 bg-white rounded-[2rem] border border-primary/10 shadow-sm">
                     <item.icon className="w-8 h-8 text-primary mb-4" />
                     <p className="text-[10px] font-bold uppercase text-primary tracking-[0.2em]">{item.label}</p>
                     <p className="text-xl font-bold tracking-wide text-foreground">{item.value}</p>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="flex items-center gap-6 opacity-30">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">SECURE ENVIRONMENT</span>
             <div className="w-2 h-2 bg-primary rounded-full" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">VERIFIED LOGIN</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-10 relative overflow-hidden bg-white">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/[0.03] blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-lg space-y-12 relative z-10">
          <div className="text-center lg:text-left space-y-4">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-3 px-6 py-2 bg-primary/5 rounded-full border border-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest"
             >
                <Lock className="w-4 h-4" />
                Secure Access
             </motion.div>
              <h2 className="text-6xl lg:text-7xl font-bold text-foreground tracking-tighter leading-none">
                {isBusiness ? "Partner Login" : "User Login"}
              </h2>
              <p className="text-xl font-medium text-muted-foreground/60">
                {isBusiness ? "Sign in to manage your brand presence." : "Enter your details to log in."}
              </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Mail className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-20 pl-20 pr-8 bg-white border-2 border-primary/5 focus:border-primary/20 rounded-[1.5rem] text-xl font-bold transition-all"
                  required
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Lock className="w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-20 pl-20 pr-8 bg-white border-2 border-primary/5 focus:border-primary/20 rounded-[1.5rem] text-xl font-bold transition-all"
                  required
                />
              </div>
            </div>

            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-20 bg-primary text-white rounded-[2rem] font-bold text-2xl tracking-tighter shadow-2xl hover:translate-y-[-4px] transition-all group overflow-hidden relative"
            >
              <span className="relative z-10 transition-transform group-hover:scale-110 flex items-center justify-center gap-4 px-10">
                {isLoading ? "Logging In..." : "Login"}
                {!isLoading && <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />}
              </span>
            </Button>
          </form>

          <div className="text-center space-y-6">
             <div className="flex items-center gap-4 opacity-20">
                <div className="flex-1 h-px bg-foreground" />
                <span className="font-bold text-[10px] uppercase tracking-widest leading-none">New to Swaynix?</span>
                <div className="flex-1 h-px bg-foreground" />
             </div>
             <Link href="/signup">
                <Button variant="ghost" className="w-full h-20 rounded-[2rem] text-muted-foreground text-xl font-bold hover:bg-primary/5 hover:text-primary transition-all border-2 border-dashed border-primary/5 hover:border-primary/20">
                   Create an Account
                </Button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Outer page wraps the inner component in Suspense (required for useSearchParams in Next.js 15)
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
