"use client";

import { useAuth } from "@/components/auth-context";
import { HeroSection } from "@/components/hero-section";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/feed");
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <p className="text-muted-foreground">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return <HeroSection />;
}
