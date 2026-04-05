"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Sparkles, Zap, ShieldCheck } from "lucide-react";

type ToastType = "success" | "error" | "info" | "brand";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl border-2 backdrop-blur-xl
                ${t.type === "success" ? "bg-white/90 border-green-500 text-green-700" : ""}
                ${t.type === "error" ? "bg-white/90 border-red-500 text-red-700" : ""}
                ${t.type === "info" ? "bg-white/90 border-blue-500 text-blue-700" : ""}
                ${t.type === "brand" ? "bg-primary text-white border-white/20 shadow-primary/20 shadow-xl" : ""}
              `}>
                <div className="flex-shrink-0">
                  {t.type === "success" && <CheckCircle2 className="w-6 h-6" />}
                  {t.type === "error" && <AlertCircle className="w-6 h-6" />}
                  {t.type === "info" && <Zap className="w-6 h-6" />}
                  {t.type === "brand" && <ShieldCheck className="w-6 h-6" />}
                </div>
                <p className="font-black italic text-sm tracking-tight">{t.message}</p>
                <button 
                  onClick={() => removeToast(t.id)}
                  className="ml-4 hover:opacity-50 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
