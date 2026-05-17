"use client";

import Link from "next/link";
import { Bot, Menu, X, ChevronDown, Zap, Plug, MessageSquare, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";

interface NavLink {
  href?: string;
  label: string;
  isExternal?: boolean;
  subLinks?: {
    href: string;
    label: string;
    desc: string;
    icon: any;
    color: string;
    isExternal?: boolean;
  }[];
}

const navLinks: NavLink[] = [
  { 
    label: 'Servicios', 
    subLinks: [
      { 
        href: '#automatizaciones', 
        label: 'Automatizaciones', 
        desc: 'Conectamos tus sistemas para eliminar trabajo manual.', 
        icon: Zap,
        color: 'bg-violet-500/10 text-violet-500 dark:bg-violet-500/20'
      },
      { 
        href: '#integraciones', 
        label: 'Integraciones', 
        desc: 'Sincroniza CRM, ERP y bases de datos en tiempo real.', 
        icon: Plug,
        color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20'
      },
      { 
        href: '#simulador', 
        label: 'Chatbot', 
        desc: 'Asistentes de chat inteligentes para WhatsApp y web.', 
        icon: MessageSquare,
        color: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20'
      },
      { 
        href: '#simulador', 
        label: 'Agente AI', 
        desc: 'Agentes autónomos que califican leads y cierran ventas.', 
        icon: Bot,
        color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20'
      },
      { 
        href: '#servicios', 
        label: 'Publicidad con AI', 
        desc: 'Optimiza tus anuncios en Meta y Google para más ventas.', 
        icon: Sparkles,
        color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20'
      },
    ]
  },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacto', label: 'Contacto' },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative-dropdown")) {
        setOpenDropdown(null);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
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
            Flujo<span className="gradient-text">xAI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            if (link.subLinks) {
              const subLinks = link.subLinks;
              const isOpen = openDropdown === link.label;
              return (
                <div key={link.label} className="relative relative-dropdown">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(isOpen ? null : link.label);
                    }}
                    className="flex items-center gap-1 py-1.5 px-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-[560px]"
                      >
                        <div className="bg-background/95 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl shadow-2xl p-4 grid grid-cols-2 gap-3">
                          {subLinks.map((sub, index) => {
                            const SubIcon = sub.icon;
                            const isLastOdd = subLinks.length % 2 !== 0 && index === subLinks.length - 1;
                            return (
                              <Link
                                key={sub.href + '-' + index}
                                href={sub.href}
                                onClick={() => setOpenDropdown(null)}
                                target={sub.isExternal ? "_blank" : undefined}
                                rel={sub.isExternal ? "noopener noreferrer" : undefined}
                                className={`flex gap-3.5 p-3 rounded-2xl text-left hover:bg-white/5 transition-all duration-300 group/item cursor-pointer ${isLastOdd ? 'col-span-2' : ''}`}
                              >
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-6 group-hover/item:-translate-y-0.5 ${sub.color}`}>
                                  <SubIcon className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors leading-none">
                                    {sub.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground mt-1.5 leading-normal">
                                    {sub.desc}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const id = link.href?.startsWith('#') ? link.href.substring(1) : '';
            const isActive = activeSection === id && id !== '';
            
            return (
              <Link
                key={link.href || link.label}
                href={link.href || '#'}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                className={`transition-all duration-300 relative py-1.5 px-1 ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
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
          {/* WhatsApp Directo */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden sm:block">
            <a
              href="https://wa.me/18492597719?text=%C2%A1Hola%21%20Me%20interesa%20saber%20m%C3%A1s%20sobre%20los%20servicios%20de%20IA%20de%20FlujoxAI%20%F0%9F%A5%BE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs md:text-sm font-bold border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all shadow-sm whitespace-nowrap"
            >
              <svg className="h-4.5 w-4.5 fill-current text-emerald-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="hidden xs:block">
            <Link
              href="#contacto"
              className="inline-flex items-center h-9 px-4 rounded-full text-xs md:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              Agendar Llamada
            </Link>
          </motion.div>

          <ThemeToggle />

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
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.subLinks ? (
                    (() => {
                      const subLinks = link.subLinks;
                      return (
                        <div className="space-y-3">
                          <span className="block text-xs font-bold text-primary tracking-widest uppercase px-1">
                            {link.label}
                          </span>
                          <div className="space-y-3 pl-2 border-l border-primary/20 ml-1">
                            {subLinks.map((sub) => {
                              const SubIcon = sub.icon;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  target={sub.isExternal ? "_blank" : undefined}
                                  rel={sub.isExternal ? "noopener noreferrer" : undefined}
                                  className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${sub.color}`}>
                                    <SubIcon className="h-4.5 w-4.5" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-foreground">
                                      {sub.label}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                      {sub.desc}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <Link
                      href={link.href || '#'}
                      onClick={() => setIsMenuOpen(false)}
                      target={link.isExternal ? "_blank" : undefined}
                      rel={link.isExternal ? "noopener noreferrer" : undefined}
                      className="block text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-2.5">
                <a
                  href="https://wa.me/18492597719?text=%C2%A1Hola%21%20Me%20interesa%20saber%20m%C3%A1s%20sobre%20los%20servicios%20de%20IA%20de%20FlujoxAI%20%F0%9F%A5%BE"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 font-bold transition-all text-sm"
                >
                  <svg className="h-4.5 w-4.5 fill-current text-emerald-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
                
                <Link
                  href="#contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full h-11 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20"
                >
                  Agendar Llamada
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}


