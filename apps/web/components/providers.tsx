"use client";

import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Sidebar } from "./sidebar";
import { AuthProvider } from "./auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <AppContent>{children}</AppContent>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch: render nothing theme-dependent until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#faf7f4] text-[#1e1208]">
        <main className="pb-20 lg:pb-0 lg:ml-72">{children}</main>
      </div>
    );
  }

  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
      <main className="pb-20 lg:pb-0 lg:ml-72">{children}</main>
    </div>
  );
}