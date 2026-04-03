"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = "", duration = 2 }: AnimatedCounterProps) {
  const [mounted, setMounted] = useState(false);
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (current) => 
    Math.floor(current).toLocaleString()
  );
  
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    setMounted(true);
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on("change", (latest: string) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [display]);

  if (!mounted) return <span>0{suffix}</span>;

  return (
    <motion.span>
      {displayValue}{suffix}
    </motion.span>
  );
}
