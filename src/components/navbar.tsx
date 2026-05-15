"use client";

import Link from "next/link";
import { Bot, Menu, X } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#simulador', label: 'Probar Chatbot' },
  { href: '#contacto', label: 'Contacto' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  
  // Use CSS variables for colors that adapt to theme
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    [
      "rgba(var(--nav-bg), 0)", 
      "rgba(var(--nav-bg), 0.8)"
    ]
  );
  
  const width = useTransform(scrollY, [0, 100], ["100%", "fit-content"]);
  const paddingX = useTransform(scrollY, [0, 100], ["0px", "12px"]);
  const marginTop = useTransform(scrollY, [0, 100], ["0px", "20px"]);
  const borderRadius = useTransform(scrollY, [0, 100], ["0px", "99px"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-80px 0px 0px 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      style={{
        backgroundColor,
        width,
        marginTop,
        borderRadius,
        paddingLeft: paddingX,
        paddingRight: paddingX,
      }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-50 border border-white/10 dark:border-white/5 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-out"
    >
      <div className="flex h-14 md:h-16 items-center gap-4 md:gap-8 mx-auto px-4 md:px-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <Bot className="h-4.5 w-4.5 text-primary-foreground" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight text-foreground hidden sm:block">
            Flujo<span className="gradient-text">XAI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => {
            const id = href.substring(1);
            const isActive = activeSection === id;
            
            return (
              <Link
                key={href}
                href={href}
                className={`transition-all duration-300 relative py-1.5 px-1 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {isActive && (
                  <motion.span 
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
          <ThemeToggle />
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden xs:block">
            <Link
              href="#contacto"
              className="inline-flex items-center h-9 px-4 rounded-full text-xs md:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              Agendar Llamada
            </Link>
          </motion.div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background/98 backdrop-blur-3xl rounded-3xl border border-border mt-2 shadow-2xl"
          >
            <div className="p-6 space-y-4">
              {navLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-border xs:hidden">
                 <Link
                  href="#simulador"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold"
                >
                  Hablar con un Experto
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}


