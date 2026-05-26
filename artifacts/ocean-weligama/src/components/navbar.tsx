import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TransparentLogo } from "./transparent-logo";
import { LanguageSelector } from "./LanguageSelector";
import { Menu, X } from "lucide-react";
import "./magic-book-btn.css";

export function Navbar() {
  const [location] = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Change background transparency/shadow when scrolled
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide navbar smoothly on scroll down, show on scroll up
    // But do NOT hide if the mobile menu is open!
    if (latest > 150 && latest > previous && !isMobileMenuOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Packages", path: "/packages" },
    { name: "Gallery", path: "/gallery" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, opacity: 1, scale: 1 },
        hidden: { y: "-150%", opacity: 0, scale: 0.95 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl"
    >
      <div className={`
        flex flex-col
        px-4 sm:px-6 py-3 
        rounded-[2rem] border
        backdrop-blur-2xl transition-all duration-500 ease-in-out
        ${isScrolled 
          ? 'bg-white/80 border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-saturate-150' 
          : 'bg-white/95 border-white/20 shadow-2xl backdrop-saturate-100'}
      `}>
        {/* Navbar Header Line */}
        <div className="flex items-center justify-between w-full">
          <Link href="/">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
              <TransparentLogo 
                src="/logo.jpg" 
                className="h-10 w-10 sm:h-14 sm:w-14 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" 
              />
              <div className="flex flex-col">
                <span className="font-serif font-black text-primary text-base sm:text-xl leading-none tracking-tight">OCEAN AIR</span>
                <span className="text-[7px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground uppercase leading-none mt-1 sm:mt-1.5 font-bold hidden xs:block">Guest House & Villa</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
              return (
                <Link key={item.name} href={item.path}>
                  <span className={`relative px-4 py-2.5 font-bold transition-colors cursor-pointer group text-[13px] rounded-full overflow-hidden block ${isActive ? "text-primary" : "text-foreground/80 hover:text-primary"}`}>
                    <span className="relative z-10">{item.name}</span>
                    <span className={`absolute inset-0 bg-primary/10 transition-transform duration-300 rounded-full origin-center ${isActive ? "scale-100" : "scale-0 group-hover:scale-100"}`}></span>
                    {isActive && (
                      <motion.div 
                        layoutId="navbar-active-indicator" 
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary z-20" 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            <Link href="/book">
              <button className="book-btn">
                <div className="dots_border"></div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="sparkle">
                  <path className="path" strokeLinejoin="round" strokeLinecap="round"
                    d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z">
                  </path>
                  <path className="path" strokeLinejoin="round" strokeLinecap="round"
                    d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z">
                  </path>
                  <path className="path" strokeLinejoin="round" strokeLinecap="round"
                    d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z">
                  </path>
                </svg>
                <span className="btn_text">Book Now</span>
              </button>
            </Link>

            {/* Mobile Hamburg Trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-primary/10 transition-colors text-primary flex items-center justify-center border border-primary/10"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Expanding Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden lg:hidden"
            >
              <div className="h-px bg-primary/10 my-4" />
              
              <div className="flex flex-col gap-2 pb-4">
                {navItems.map((item, idx) => {
                  const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link href={item.path}>
                        <div 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`
                            px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer
                            flex items-center justify-between
                            ${isActive 
                              ? "bg-primary text-white shadow-lg" 
                              : "text-foreground hover:bg-primary/5 hover:text-primary"}
                          `}
                        >
                          <span>{item.name}</span>
                          <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Mobile Language Selector Integration */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="flex items-center justify-between px-5 py-4 border-t border-primary/10 mt-2"
                >
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Language / Area</span>
                  <LanguageSelector />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
