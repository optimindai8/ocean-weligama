import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { EXPERIENCE_ICONS } from '@/data/experienceIcons';

/* ─── Motion Variants for Header ─────────────────────────────────────────── */
const badgeVariants: Variants = {
  hidden: { opacity: 0, x: 40, transition: { duration: 0.25, ease: "easeOut" } },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] } 
  }
};

const wordsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.12 } 
  }
};

const wordItemVariants: Variants = {
  hidden: { opacity: 0, x: -30, transition: { duration: 0.2, ease: "easeOut" } },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
  }
};

const descVariants: Variants = {
  hidden: { opacity: 0, x: 40, transition: { duration: 0.25, ease: "easeOut" } },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.75, delay: 0.32, ease: [0.16, 1, 0.3, 1] } 
  }
};

export function ExperienceCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isInteractingRef = useRef(false);

  // Triple the items for a gapless, seamless infinite continuous loop
  const displayIcons = useMemo(() => [
    ...EXPERIENCE_ICONS,
    ...EXPERIENCE_ICONS,
    ...EXPERIENCE_ICONS
  ], []);

  // Continuous linear smooth glide (60fps/120fps hardware accelerated without pauses)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frameId: number;
    let lastTime: number | null = null;
    const speed = 0.55; // Pixels per 16.7ms frame (~33px per second for an elegant, continuous glide)

    const loop = (currentTime: number) => {
      if (lastTime === null) lastTime = currentTime;
      const deltaTime = Math.min(currentTime - lastTime, 40);
      lastTime = currentTime;

      if (!isPaused && !isInteractingRef.current && el) {
        el.scrollLeft += (speed * deltaTime) / 16.67;

        // Seamless infinite wrap-around
        const singleSetWidth = el.scrollWidth / 3;
        if (singleSetWidth > 0) {
          if (el.scrollLeft >= singleSetWidth * 2) {
            el.scrollLeft -= singleSetWidth;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft += singleSetWidth;
          }
        }
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  // Arrow navigation handlers for manual nudging
  const handleScrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;
    isInteractingRef.current = true;
    el.scrollBy({ left: -140, behavior: 'smooth' });
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 550);
  };

  const handleScrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;
    isInteractingRef.current = true;
    el.scrollBy({ left: 140, behavior: 'smooth' });
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 550);
  };

  return (
    <section className="py-8 sm:py-12 relative overflow-hidden w-full border-t border-[#0B3D5E]/5 bg-gradient-to-b from-[#F5F9FC] via-[#FFFDF8] to-[#FFFFFF]">
      {/* Ambient background halos matching logo yellow and ocean deep */}
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0B3D5E]/05 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-[1440px] relative z-10">
        
        {/* ── Section Header (Decreased & Refined Size) ─────────────── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2"
        >
          {/* Eyebrow badge matching brand styling */}
          <motion.div
            variants={badgeVariants}
            style={{ willChange: "transform, opacity" }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.22em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.9)] shrink-0" />
            <Compass className="w-3 h-3 text-[#0B3D5E]" />
            <span>Curated Coastal Activities</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={wordsContainerVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5"
          >
            <motion.span variants={wordItemVariants} style={{ willChange: "transform, opacity" }} className="inline-block">
              CURATED
            </motion.span>
            <motion.span
              variants={wordItemVariants}
              style={{ willChange: "transform, opacity" }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
            >
              COASTAL EXPERIENCES
            </motion.span>
          </motion.h2>

          {/* Subtle Golden Accent Flourish */}
          <motion.div
            variants={{
              hidden: { scaleX: 0, opacity: 0 },
              visible: { 
                scaleX: 1, 
                opacity: 1, 
                transition: { delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] } 
              }
            }}
            style={{ willChange: "transform, opacity" }}
            className="w-12 h-0.5 rounded-full bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto mb-1.5"
          />

          {/* Subtitle description */}
          <motion.p
            variants={descVariants}
            style={{ willChange: "transform, opacity" }}
            className="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed px-4"
          >
            Surf coaching, beachfront yoga, wild national park safaris, vintage scooter rides, whale expeditions &amp; culinary cooking.
          </motion.p>
        </motion.div>

        {/* ── Compact Showcase Box with Smooth Continuous Moving Track ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative rounded-[1.6rem] sm:rounded-[2rem] md:rounded-[2.4rem] border border-white/90 shadow-[0_16px_50px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.18)_inset] bg-white/90 backdrop-blur-2xl p-2.5 sm:p-4"
        >
          {/* Subtle top golden accent hairline */}
          <div
            className="absolute top-0 left-8 right-8 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
          />

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handleScrollLeft}
            aria-label="Previous experiences"
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(11,61,94,0.12)] border border-slate-200 flex items-center justify-center text-[#0B3D5E] hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:border-[#FBBF24] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.5} />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleScrollRight}
            aria-label="Next experiences"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(11,61,94,0.12)] border border-slate-200 flex items-center justify-center text-[#0B3D5E] hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:border-[#FBBF24] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" strokeWidth={2.5} />
          </button>

          {/* Continuous Gliding Track without Pause - Completely Hidden Scrollbars */}
          <div
            ref={scrollRef}
            data-no-scrollbar
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1.5 px-8 sm:px-11 select-none"
          >
            {displayIcons.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="group relative flex-shrink-0 p-2 sm:p-2.5 rounded-2xl border border-slate-100/90 bg-white/80 hover:bg-white hover:border-[#FBBF24] hover:shadow-[0_10px_24px_rgba(251,191,36,0.2)] transition-all duration-300 flex items-center justify-center cursor-pointer hover:-translate-y-1"
              >
                {/* Ambient Golden Glow on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-[#FBBF24]/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />

                {/* Icon Image Container */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl flex items-center justify-center p-2 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border border-slate-100 group-hover:border-[#FBBF24]/60 group-hover:shadow-[0_6px_16px_rgba(251,191,36,0.22)] transition-all duration-300 relative z-10">
                  <img
                    src={item.path}
                    alt={item.alt}
                    className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
