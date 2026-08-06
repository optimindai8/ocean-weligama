import { Link } from "wouter";
import { motion } from "framer-motion";
import { TransparentLogo } from "./transparent-logo";
import { Animated3DBackground } from "./Animated3DBackground";
import { ArrowUpRight, MapPin, Phone, Mail, Sparkles, ShieldCheck, Compass, Heart, ArrowRight } from "lucide-react";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 }
  },
};

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const SocialLink = ({ href, name, icon, colorClass }: { href: string, name: string, icon: React.ReactNode, colorClass: string }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ 
        scale: 1.15,
        y: -4,
        rotate: name === "TikTok" ? -6 : 6,
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 group overflow-hidden shadow-lg backdrop-blur-md ${colorClass}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative z-10">{icon}</span>
    </motion.a>
  );

  const FooterLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href}>
      <motion.span 
        className="group flex items-center text-white/70 hover:text-white cursor-pointer py-1 transition-colors relative w-fit text-sm font-light tracking-wide"
        onHoverStart={() => setHoveredLink(href)}
        onHoverEnd={() => setHoveredLink(null)}
        whileHover={{ x: 6 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-3 mr-1.5 scale-0 group-hover:scale-100" />
        <span className="relative z-10">{children}</span>
        <motion.span 
          className="absolute -bottom-0.5 left-0 h-[1px] bg-gradient-to-r from-cyan-400 to-teal-300 w-0 group-hover:w-full transition-all duration-300 ease-out"
        />
        <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-cyan-300" />
      </motion.span>
    </Link>
  );

  return (
    <footer className="relative bg-[#090F1E] text-white pt-20 pb-10 overflow-hidden selection:bg-cyan-500 selection:text-white border-t border-white/10">
      
      {/* 1. Psychological Ambient Ambient Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* 2. Top Interactive Call-To-Action Banner */}
      <div className="container mx-auto px-6 mb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.06] border border-white/15 backdrop-blur-2xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="absolute -right-20 -top-20 w-60 h-60 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider w-fit mx-auto md:mx-0">
              <Sparkles className="w-3.5 h-3.5" />
              Barefoot Luxury Sanctuary
            </div>
            <h3 className="text-2xl lg:text-3xl font-serif font-bold text-white tracking-tight">
              Ready for your coastal escape in Weligama?
            </h3>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              100 steps from the Indian Ocean. Reserve directly with us for exclusive rate guarantees &amp; personal concierge care.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/booking">
              <motion.button 
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(75, 188, 204, 0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-[#090F1E] font-semibold text-sm tracking-wide shadow-xl flex items-center gap-2.5 transition-all duration-300 cursor-pointer"
              >
                <span>Book Your Stay</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 3. Main Footer Grid */}
      <motion.div 
        className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Brand Identity & 3D Interactive Canvas Tile */}
        <motion.div variants={itemVariants} className="md:col-span-12 lg:col-span-4 flex flex-col items-start gap-6">
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer group p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 transition-all duration-500 backdrop-blur-xl">
              {/* Preserved 3D Background Element */}
              <div className="relative flex items-center justify-center w-[90px] h-[90px] rounded-xl overflow-hidden bg-black/40">
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center scale-125">
                  <Animated3DBackground />
                </div>
                <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                <TransparentLogo 
                  src="/logo.jpg" 
                  className="relative z-10 h-12 w-12 object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl" 
                />
              </div>
              <div className="flex flex-col pr-3">
                <span className="text-2xl font-serif font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-cyan-200">OCEAN AIR</span>
                <span className="text-[10px] tracking-[0.25em] text-cyan-300 uppercase font-semibold mt-0.5">Boutique Villa &amp; Hotel</span>
              </div>
            </div>
          </Link>
          
          <p className="text-white/70 leading-relaxed font-serif italic text-sm border-l-2 border-cyan-400/40 pl-4 py-1">
            "Your sanctuary by the Indian Ocean. Experience barefoot luxury, waves, and genuine Sri Lankan warmth."
          </p>

          {/* Social Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-xs uppercase font-semibold tracking-widest text-white/50">Follow Our Journey</span>
            <div className="flex gap-3">
              <SocialLink 
                name="Instagram" 
                colorClass="hover:border-rose-400/50 hover:shadow-rose-500/20"
                href="https://www.instagram.com/oceanairweligama?igsh=MWlkN2F6c2h5dGRxdA%3D%3D&utm_source=qr"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
              />
              <SocialLink 
                name="Facebook" 
                colorClass="hover:border-blue-400/50 hover:shadow-blue-500/20"
                href="https://www.facebook.com/profile.php?id=61583921572390"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>}
              />
              <SocialLink 
                name="TikTok" 
                colorClass="hover:border-teal-400/50 hover:shadow-teal-500/20"
                href="https://www.tiktok.com/@oceanairweligama?_r=1&_t=ZS-96GvKo3MoMi"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>}
              />
            </div>
          </div>
        </motion.div>

        {/* Navigation Section 1: Explore */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-2">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-cyan-300 mb-6 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Explore
          </h4>
          <div className="flex flex-col gap-2.5">
            <FooterLink href="/rooms">Rooms &amp; Suites</FooterLink>
            <FooterLink href="/packages">Packages &amp; Surf</FooterLink>
            <FooterLink href="/gallery">Photo &amp; Video Gallery</FooterLink>
            <FooterLink href="/blog">Island Journal</FooterLink>
            <FooterLink href="/faq">Guest FAQ</FooterLink>
          </div>
        </motion.div>

        {/* Navigation Section 2: Experience */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-2">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-cyan-300 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            About Us
          </h4>
          <div className="flex flex-col gap-2.5">
            <FooterLink href="/about">Our Story &amp; Heritage</FooterLink>
            <FooterLink href="/contact">Concierge Desk</FooterLink>
            <FooterLink href="/cancellation-policy">Payment Terms</FooterLink>
            <FooterLink href="/cancellation-policy">Cancellation Policy</FooterLink>
          </div>
        </motion.div>

        {/* Contact Info Concierge Tile */}
        <motion.div variants={itemVariants} className="md:col-span-6 lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-cyan-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" />
              Get In Touch
            </h4>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              24/7 Concierge Online
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Phone / WhatsApp Tile */}
            <motion.a
              href="https://wa.me/94765791763"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4, borderColor: "rgba(52, 211, 153, 0.4)" }}
              className="group flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] transition-all duration-300 backdrop-blur-xl shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <Phone className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Call &amp; WhatsApp Direct</span>
                <span className="text-white font-medium text-sm group-hover:text-emerald-300 transition-colors">+94 76 579 1763</span>
              </div>
            </motion.a>

            {/* Email Tile */}
            <motion.a
              href="mailto:pelanawhitehouse@gmail.com"
              whileHover={{ x: 4, borderColor: "rgba(56, 189, 248, 0.4)" }}
              className="group flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] transition-all duration-300 backdrop-blur-xl shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">Instant Email Inquiry</span>
                <span className="text-white font-medium text-sm group-hover:text-sky-300 transition-colors truncate">pelanawhitehouse@gmail.com</span>
              </div>
            </motion.a>

            {/* Location Tile */}
            <motion.a
              href="https://www.google.com/maps/dir/?api=1&destination=Ocean+Air+Weligama+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4, borderColor: "rgba(129, 140, 248, 0.4)" }}
              className="group flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.07] transition-all duration-300 backdrop-blur-xl shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-110 transition-transform shadow-md">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Location &amp; Directions</span>
                <span className="text-white/80 text-xs leading-relaxed group-hover:text-white transition-colors">
                  No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700
                </span>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>

      {/* 4. Bottom Copyright & Trust Tagline Bar */}
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-xs font-light relative z-10">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Ocean Weligama. All rights reserved.</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline-flex items-center gap-1 text-white/40">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> in Pelana, Weligama
          </span>
        </div>
        <div className="flex gap-6 text-white/60">
          <Link href="/cancellation-policy"><span className="hover:text-cyan-300 cursor-pointer transition-colors">Privacy Policy</span></Link>
          <Link href="/cancellation-policy"><span className="hover:text-cyan-300 cursor-pointer transition-colors">Terms of Service</span></Link>
          <Link href="/cancellation-policy"><span className="hover:text-cyan-300 cursor-pointer transition-colors">Cancellation Terms</span></Link>
        </div>
      </div>
    </footer>
  );
}
