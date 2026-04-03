"use client";

import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Sidebar } from "./sidebar";
import { AuthProvider } from "./auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppContent>{children}</AppContent>
      </ThemeProvider>
    </AuthProvider>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? (resolvedTheme === "dark") : true;
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${mounted ? 'bg-background text-foreground' : 'bg-slate-950 text-white'}`}>
      {mounted && (
        <Sidebar 
          isDarkMode={isDarkMode} 
          onToggleTheme={toggleTheme} 
        />
      )}
      <main className={`pb-20 lg:pb-0 ${mounted ? 'lg:ml-72' : ''}`}>
        {children}
      </main>
    </div>
  );
}
