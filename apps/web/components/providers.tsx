"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { AuthProvider } from "./auth-context";
import { ToastProvider } from "./ui/toast-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent>{children}</AppContent>
      </ToastProvider>
    </AuthProvider>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    html.classList.remove("dark");
    html.classList.add("light");
    html.setAttribute("data-theme", "light");
    html.style.colorScheme = "light";
    html.style.backgroundColor = "#ffffff";
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#1a1f2e";
  }, []);

  if (!mounted) {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ backgroundColor: "#ffffff", color: "#1a1f2e" }}
      >
        <main className="pb-20 lg:pb-0 lg:ml-80">{children}</main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ backgroundColor: "#ffffff", color: "#1a1f2e" }}
    >
      <Sidebar />
      <main className="pb-20 lg:pb-0 lg:ml-80">{children}</main>
    </div>
  );
}
