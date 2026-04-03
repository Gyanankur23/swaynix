"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Chrome, Mail, ArrowRight, Sparkles, LogIn,
  UserPlus, Building2, Briefcase
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";

// Business domains configuration
const BUSINESS_DOMAINS = [
  { domain: "decathlon.com", name: "Decathlon India", logo: "/logos/decathlon.svg", color: "#0082C3" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loginType, setLoginType] = useState<"user" | "business">("user");
  const { login, user } = useAuth();
  const router = useRouter();

  // Check if email is a business email
  const getBusinessConfig = (email: string) => {
    const domain = email.split("@")[1];
    return BUSINESS_DOMAINS.find(b => domain?.includes(b.domain));
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUser = {
        id: "user-1",
        name: "Arjun Sharma",
        email: "arjun@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        handle: "arjun_sharma",
        level: 3,
        role: "member" as const,
        joinDate: "2024-01-15",
        posts: 12,
        cohorts: 3,
        streak: 7,
        interactions: 89,
        communities: ["code-mumbai", "bollywood-beats", "cricket-fans"],
      };
      login(mockUser);
      setShowWelcome(true);
      setTimeout(() => router.push("/"), 1500);
    }, 1000);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      // Check if this is a business email
      const businessConfig = getBusinessConfig(email);
      
      if (businessConfig) {
        // Business user login
        const businessUser = {
          id: "business-1",
          name: businessConfig.name,
          email: email,
          avatar: businessConfig.logo || "",
          handle: businessConfig.name.toLowerCase().replace(/\s+/g, '_'),
          level: 1,
          role: "business" as const,
          businessConfig: businessConfig,
          joinDate: "2024-03-01",
          adsCreated: 3,
          totalReach: 12500,
          clicks: 892,
          conversions: 156,
          revenue: 124750,
        };
        login(businessUser);
      } else {
        // Regular user login
        const mockUser = {
          id: "user-2",
          name: "Priya Patel",
          email: email,
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
          handle: "priya_patel",
          level: 2,
          role: "member" as const,
          joinDate: "2024-02-20",
          posts: 8,
          cohorts: 2,
          streak: 4,
          interactions: 56,
          communities: ["travel-india", "foodie-delhi"],
        };
        login(mockUser);
      }
      
      setShowWelcome(true);
      setTimeout(() => router.push("/"), 1500);
    }, 1000);
  };

  const handleBusinessLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const businessConfig = getBusinessConfig(businessEmail);
      
      if (businessConfig) {
        const businessUser = {
          id: "business-decathlon",
          name: businessConfig.name,
          email: businessEmail,
          avatar: businessConfig.logo || "",
          handle: "decathlon_india",
          level: 1,
          role: "business" as const,
          businessConfig: businessConfig,
          joinDate: "2024-03-01",
          adsCreated: 3,
          totalReach: 12500,
          clicks: 892,
          conversions: 156,
          revenue: 124750,
        };
        login(businessUser);
        setShowWelcome(true);
        setTimeout(() => router.push("/"), 1500);
      } else {
        alert("Please use a valid business email domain (e.g., @decathlon.com)");
        setIsLoading(false);
      }
    }, 1000);
  };

  if (showWelcome && user) {
    const isBusiness = user.role === "business";
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {isBusiness && user.businessConfig?.logo ? (
            <div className="w-24 h-24 mx-auto mb-6 rounded-xl bg-white p-4 flex items-center justify-center">
              <img src={user.businessConfig.logo} alt={user.name} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-purple-500/30">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white mb-4"
          >
            Welcome back,
            <br />
            <span className={isBusiness ? "text-[#0082C3]" : "bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"}>
              {user.name}!
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg"
          >
            {isBusiness ? "Redirecting to business dashboard..." : "Redirecting to your feed..."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Connect with communities across India</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <CardContent className="p-6">
            <Tabs defaultValue="user" className="w-full" onValueChange={(v) => setLoginType(v as "user" | "business")}>
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
                <TabsTrigger value="user" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
                  <UserPlus className="w-4 h-4 mr-2" />
                  User
                </TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
                  <Building2 className="w-4 h-4 mr-2" />
                  Business
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-6">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 border-0 font-medium"
                >
                  <Chrome className="w-5 h-5 mr-3 text-red-500" />
                  {isLoading ? "Connecting..." : "Continue with Google"}
                </Button>

                <div className="relative">
                  <Separator className="bg-white/10" />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-slate-900 px-4 text-xs text-slate-500">
                    Or continue with email
                  </span>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold"
                  >
                    {isLoading ? (
                      <Sparkles className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="business" className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-400">Business Account</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Use your company email (e.g., @decathlon.com) to access business features including ad creation and analytics.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleBusinessLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-email" className="text-white">Business Email</Label>
                    <Input
                      id="business-email"
                      type="email"
                      placeholder="name@company.com"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-slate-500">Try: b2b.india@decathlon.com</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-password" className="text-white">Password</Label>
                    <Input
                      id="business-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold"
                  >
                    {isLoading ? (
                      <Sparkles className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Building2 className="w-5 h-5 mr-2" />
                        Business Sign In
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-500 mb-3">Trusted by leading brands</p>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-20 bg-white/10 rounded flex items-center justify-center text-xs text-white font-medium">
                      Decathlon
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center space-y-2 mt-6">
              <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                Forgot password?
              </Link>
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
