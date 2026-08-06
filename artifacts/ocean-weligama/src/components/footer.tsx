import { Link } from "wouter";
import { motion } from "framer-motion";
import { TransparentLogo } from "./transparent-logo";
import { Animated3DBackground } from "./Animated3DBackground";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const SocialLink = ({ href, name, icon }: { href: string, name: string, icon: React.ReactNode }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ 
        scale: 1.15,
        rotate: name === "TikTok" ? -5 : 5,
        y: -5
      }}
      whileTap={{ scale: 0.95 }}
      className="relative w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary-foreground/80 hover:text-white hover:bg-white/15 hover:border-white/30 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10">{icon}</span>
    </motion.a>
  );

  const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href}>
      <motion.span 
        className="group flex items-center text-primary-foreground/80 hover:text-white cursor-pointer py-1 transition-colors relative w-fit text-sm"
        onHoverStart={() => setHoveredLink(href)}
        onHoverEnd={() => setHoveredLink(null)}
        whileHover={{ x: 5 }}
      >
        <span className="relative z-10">{children}</span>
        <motion.span 
          className="absolute -bottom-0.5 left-0 h-[1px] bg-white/50 w-0 group-hover:w-full transition-all duration-300 ease-out"
        />
        <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
      </motion.span>
    </Link>
  );

  return (
    <footer className="relative bg-[#0F172A] text-white pt-24 pb-12 overflow-hidden selection:bg-accent selection:text-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Brand Section */}
        <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-4 flex flex-col items-start gap-6">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center w-[100px] h-[100px]">
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-full mt-10">
                    <Animated3DBackground />
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                <TransparentLogo 
                  src="/logo.jpg" 
                  className="relative z-10 h-14 w-14 object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-105 drop-shadow-2xl mb-16" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-serif font-bold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">OCEAN AIR</span>
                <span className="text-[10px] tracking-[0.3em] text-white/60 uppercase font-medium mt-1">Guest House & Villa</span>
              </div>
            </div>
          </Link>
          
          <p className="text-amber-400/90 leading-relaxed max-w-sm font-serif italic tracking-wide text-sm">
            Your barefoot luxury home by the Indian Ocean. Experience serenity, comfort, and the soothing rhythm of the waves.
          </p>
          
          <div className="flex gap-3.5 mt-1">
            <SocialLink 
              name="Instagram" 
              href="https://www.instagram.com/oceanairweligama?igsh=MWlkN2F6c2h5dGRxdA%3D%3D&utm_source=qr"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
            />
            <SocialLink 
              name="Facebook" 
              href="https://www.facebook.com/profile.php?id=61583921572390"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>}
            />
            <SocialLink 
              name="TikTok" 
              href="https://www.tiktok.com/@oceanairweligama?_r=1&_t=ZS-96GvKo3MoMi"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>}
            />
          </div>
        </motion.div>

        {/* Explore Links */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-2">
          <h4 className="text-base font-serif font-medium mb-5 text-white/90">Explore</h4>
          <div className="flex flex-col gap-2.5">
            <FooterLink href="/rooms">Rooms</FooterLink>
            <FooterLink href="/packages">Packages</FooterLink>
            <FooterLink href="/gallery">Gallery</FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
          </div>
        </motion.div>

        {/* About Links */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-2">
          <h4 className="text-base font-serif font-medium mb-5 text-white/90">About</h4>
          <div className="flex flex-col gap-2.5">
            <FooterLink href="/about">Our Story</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/cancellation-policy">Cancellation Policy</FooterLink>
          </div>
        </motion.div>

        {/* Contact Info Section */}
        <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-serif font-semibold text-white">Get In Touch</h4>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Phone / WhatsApp */}
            <motion.a
              href="https://wa.me/94765791763"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="group flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/90">Call &amp; WhatsApp</span>
                <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors">+94 76 579 1763</span>
              </div>
            </motion.a>

            {/* Email */}
            <motion.a
              href="mailto:pelanawhitehouse@gmail.com"
              whileHover={{ x: 4 }}
              className="group flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400/90">Email Us</span>
                <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors truncate">pelanawhitehouse@gmail.com</span>
              </div>
            </motion.a>

            {/* Location */}
            <motion.a
              href="https://www.google.com/maps/dir/?api=1&destination=Ocean+Air+Weligama+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className="group flex items-start gap-3.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/40 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400/90">Location</span>
                <span className="text-white/80 text-xs leading-relaxed group-hover:text-white transition-colors">
                  No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700
                </span>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="container mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-sm font-light relative z-10"
      >
        <p>© {new Date().getFullYear()} Ocean Weligama. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/cancellation-policy"><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></Link>
          <Link href="/cancellation-policy"><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></Link>
        </div>
      </motion.div>
    </footer>
  );
}

