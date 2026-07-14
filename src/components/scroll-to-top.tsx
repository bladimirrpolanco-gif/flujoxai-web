"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.5,
        pointerEvents: isVisible ? "auto" : "none"
      }}
      className="fixed bottom-28 right-6 z-[60]"
    >
      <button
        onClick={scrollToTop}
        className="relative h-12 w-12 flex items-center justify-center rounded-full bg-zinc-900 border border-white/10 text-white shadow-2xl hover:bg-zinc-800 transition-colors group"
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90 p-1" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/5"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            pathLength={pathLength}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
      </button>
    </motion.div>
  );
}
