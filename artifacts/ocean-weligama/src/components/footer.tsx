import { Link } from "wouter";
import { motion } from "framer-motion";
import { TransparentLogo } from "./transparent-logo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <TransparentLogo 
              src="/logo.jpg" 
              className="h-24 w-24 object-contain brightness-0 invert" 
            />
            <div className="flex flex-col">
              <span className="text-3xl font-serif font-bold leading-tight tracking-tight">OCEAN AIR</span>
              <span className="text-xs tracking-[0.3em] text-primary-foreground/70 uppercase font-medium">Guest House & Villa</span>
            </div>
          </div>
          <p className="text-primary-foreground/80">
            Your barefoot luxury home by the Indian Ocean.
          </p>
          
          {/* Smooth Magnetic Social Icons */}
          <div className="flex gap-4 mt-2">
            {[
              { name: "Instagram", icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              ), href: "https://www.instagram.com/oceanairweligama?igsh=MWlkN2F6c2h5dGRxdA%3D%3D&utm_source=qr" },
              { name: "Facebook", icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              ), href: "https://www.facebook.com/profile.php?id=61583921572390" },
              { name: "TikTok", icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              ), href: "https://www.tiktok.com/@oceanairweligama?_r=1&_t=ZS-96GvKo3MoMi" }
            ].map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ 
                  scale: 1.2,
                  rotate: social.name === "TikTok" ? -5 : 5,
                  y: -5
                }}
                whileTap={{ scale: 0.9 }}
                className="relative w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-foreground/70 hover:text-white hover:bg-white/10 hover:border-accent/50 transition-all duration-300 group overflow-hidden"
              >
                {/* Dynamic Glow Aura */}
                <div className="absolute inset-0 bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">{social.icon}</span>
              </motion.a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link href="/rooms"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">Rooms</span></Link>
            <Link href="/packages"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">Packages</span></Link>
            <Link href="/gallery"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">Gallery</span></Link>
            <Link href="/blog"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">Blog</span></Link>
            <Link href="/faq"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">FAQ</span></Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">About</h4>
          <div className="flex flex-col gap-2">
            <Link href="/about"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">Our Story</span></Link>
            <Link href="/contact"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">Contact</span></Link>
            <Link href="/cancellation-policy"><span className="text-primary-foreground/80 hover:text-white cursor-pointer">Cancellation Policy</span></Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4">Connect</h4>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-primary-foreground/80 hover:text-white">Instagram</a>
            <a href="#" className="text-primary-foreground/80 hover:text-white">Facebook</a>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
        © {new Date().getFullYear()} Ocean Weligama. All rights reserved.
      </div>
    </footer>
  );
}
