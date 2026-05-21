import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TransparentLogo } from "./transparent-logo";
import { LanguageSelector } from "./LanguageSelector";

export function Navbar() {
  const [location] = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Change background transparency/shadow when scrolled
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide navbar smoothly on scroll down, show on scroll up
    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

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
        flex items-center justify-between
        px-6 py-3 
        rounded-[2rem] border
        backdrop-blur-2xl transition-all duration-700 ease-in-out
        ${isScrolled 
          ? 'bg-white/75 border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-saturate-150' 
          : 'bg-white/95 border-white/20 shadow-2xl backdrop-saturate-100'}
      `}>
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <TransparentLogo 
              src="/logo.jpg" 
              className="h-14 w-14 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" 
            />
            <div className="flex flex-col">
              <span className="font-serif font-black text-primary text-xl leading-none tracking-tight">OCEAN AIR</span>
              <span className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase leading-none mt-1.5 font-bold">Guest House & Villa</span>
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1.5">
          {[
            { name: "Home", path: "/" },
            { name: "Rooms", path: "/rooms" },
            { name: "Packages", path: "/packages" },
            { name: "Gallery", path: "/gallery" },
            { name: "Blog", path: "/blog" },
            { name: "FAQ", path: "/faq" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" }
          ].map((item) => {
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

        <div className="flex items-center gap-3 sm:gap-4">
          <LanguageSelector />
          <Link href="/book">
            <Button className="
              animate-pulse-highlight
              bg-[#F0A500] hover:bg-[#D99500] text-white rounded-full font-black shadow-[0_10px_20px_rgba(240,165,0,0.3)] hover:shadow-[0_15px_30px_rgba(240,165,0,0.5)] transition-all duration-500
              hover:scale-105 active:scale-95
              px-6 sm:px-8 h-12 text-xs tracking-wider uppercase
              relative overflow-hidden group
            ">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10">Book Now</span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
