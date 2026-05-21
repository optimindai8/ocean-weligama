import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface PageHeroProps {
  title: string;
  description: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  children?: React.ReactNode; // For any extra stats at the bottom
}

export function PageHero({ title, description, badgeText, badgeIcon, children }: PageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#052439]">
      {/* Parallax background */}
      <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#052439_0%,#0B3D5E_50%,#1A6B8A_100%)]" />
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Glow orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-[#4BBCCC]/20 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] left-[5%] w-[400px] h-[400px] bg-[#1A6B8A]/20 blur-[80px] rounded-full"
        />
      </motion.div>

      <motion.div style={{ opacity: heroOpacity }} className="container relative z-10 mx-auto px-4 text-center mt-16">
        {badgeText && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#4BBCCC]/15 border border-[#4BBCCC]/30 px-5 py-2 rounded-full mb-6"
          >
            {badgeIcon}
            <span className="text-[#4BBCCC] text-[10px] font-black uppercase tracking-[0.25em]">{badgeText}</span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-serif font-bold text-white mb-5 leading-none tracking-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white/70 text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed"
        >
          {description}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
