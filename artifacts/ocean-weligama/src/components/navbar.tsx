import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TransparentLogo } from "./transparent-logo";
import { LanguageSelector } from "./LanguageSelector";
import { Menu, X } from "lucide-react";

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
              <Button className="
                animate-pulse-highlight
                bg-[#F0A500] hover:bg-[#D99500] text-white rounded-full font-black shadow-[0_10px_20px_rgba(240,165,0,0.3)] hover:shadow-[0_15px_30px_rgba(240,165,0,0.5)] transition-all duration-500
                hover:scale-105 active:scale-95
                px-4 sm:px-8 h-10 sm:h-12 text-[10px] sm:text-xs tracking-wider uppercase
                relative overflow-hidden group
              ">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <span className="relative z-10">Book Now</span>
              </Button>
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
