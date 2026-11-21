import { useListRooms } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Palmtree, Users, BedDouble, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

/* ─────────────────────────────────────────────────────────
   Self-contained luxury image slider.
   Two frosted-glass arrow buttons + glowing brand dot indicators.
   ───────────────────────────────────────────────────────── */
function RoomImageSlider({ images, roomName }: { images: string[]; roomName: string }) {
  const [current, setCurrent] = useState(0);

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length]
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length]
  );

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/slider overflow-hidden">
      {/* Current image */}
      <img
        src={images[current]}
        alt={`${roomName} - ${current + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        key={current}
      />

      {/* ── Arrow buttons ── visible when more than 1 image */}
      {images.length > 1 && (
        <>
          {/* PREV button */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-[#FBBF24] text-[#0B3D5E] border border-white/50 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>

          {/* NEXT button */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-[#FBBF24] text-[#0B3D5E] border border-white/50 flex items-center justify-center cursor-pointer shadow-md transition-all duration-200"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>

          {/* ── Dot indicators ── */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
            {images.map((_: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 border-none cursor-pointer shadow-sm ${
                  i === current ? 'w-5 bg-[#FBBF24]' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>

          {/* ── Image counter badge ── */}
          <div className="absolute top-3 right-3 bg-black/45 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full z-20 tracking-wider">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Motion Variants for Section Header
   ───────────────────────────────────────────────────────── */
const stayBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 70,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const stayWordsContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.16,
    },
  },
};

const stayWordItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -45,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const stayDescVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 70,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      delay: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ─────────────────────────────────────────────────────────
   Main section component
   ───────────────────────────────────────────────────────── */
export function StayInStyleSection() {
  const { data: rooms } = useListRooms();
  const { formatPrice } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const styleRooms = rooms?.filter((r: any) => r.showInPackages) || [];

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, styleRooms.length]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -420 : 420;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!styleRooms || styleRooms.length === 0) return null;

  return (
    <section 
      className="py-24 sm:py-28 relative overflow-hidden w-full border-t border-[#0B3D5E]/5"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9FC 50%, #EEF5FA 100%)' }}
    >
      {/* Decorative ambient lighting matching logo yellow and ocean deep */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1440px]">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          {/* Pill Badge - Comes from right side */}
          <motion.div
            variants={stayBadgeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 mb-2 shadow-sm"
          >
            <Palmtree className="w-3.5 h-3.5 text-[#0B3D5E]" />
            <span>Boutique Sanctuary</span>
          </motion.div>

          {/* Headline - Words come one by one from left side */}
          <motion.h2
            variants={stayWordsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-3xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
          >
            <motion.span variants={stayWordItemVariants} className="inline-block">
              Stay
            </motion.span>
            <motion.span variants={stayWordItemVariants} className="inline-block">
              in
            </motion.span>
            <motion.span variants={stayWordItemVariants} className="inline-block">
              Style,
            </motion.span>
            <motion.span
              variants={stayWordItemVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
            >
              the
            </motion.span>
            <motion.span
              variants={stayWordItemVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
            >
              Island
            </motion.span>
            <motion.span
              variants={stayWordItemVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
            >
              Way
            </motion.span>
          </motion.h2>

          {/* Description - Comes from right side */}
          <motion.p
            variants={stayDescVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Whether you're a solo surfer, a beach-loving couple, or a group of wave-chasers — we've got the perfect spot for you. Think breezy rooms, tropical touches, and all the essentials for a chill stay just steps from the sea.
          </motion.p>
        </div>

        {/* ── Section scroll navigation row ── */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, transition: { duration: 0.15 } },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { delay: 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] } 
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          style={{ willChange: "transform, opacity" }}
          className="flex items-center justify-between mb-8 px-2"
        >
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
            <span>Swipe to explore rooms</span>
            <ArrowRight className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll rooms left"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                canScrollLeft
                  ? 'bg-[#0B3D5E] text-white hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:scale-105 hover:shadow-md cursor-pointer'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              aria-label="Scroll rooms right"
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                canScrollRight
                  ? 'bg-[#0B3D5E] text-white hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:scale-105 hover:shadow-md cursor-pointer'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>

        {/* ── Horizontally scrollable room cards ── */}
        <div
          ref={scrollRef}
          className="flex gap-6 pb-8 snap-x snap-mandatory overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {styleRooms.map((room: any, idx: number) => {
            const images: string[] =
              room.gallery?.length > 0
                ? room.gallery
                : [room.heroImageUrl].filter(Boolean);

            const price = room.adjustedPrice || room.basePricePerNight || 120;

            return (
              <motion.div
                key={room.id}
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 45,
                    transition: { duration: 0.15 }
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      delay: 0.06 + Math.min(idx, 5) * 0.08, 
                      duration: 0.6, 
                      ease: [0.16, 1, 0.3, 1] 
                    } 
                  }
                }}
                initial="hidden"
                whileInView="visible"
                whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                viewport={{ once: false, amount: 0.05 }}
                style={{ willChange: "transform, opacity" }}
                className="group flex-none w-[320px] sm:w-[380px] lg:w-[410px] snap-center bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_12px_35px_rgba(11,61,94,0.06)] hover:shadow-[0_22px_50px_rgba(11,61,94,0.13)] transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Slider */}
                <div
                  className="relative w-full overflow-hidden bg-slate-100"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <RoomImageSlider images={images} roomName={room.name} />
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <Link href={`/rooms/${room.slug}`}>
                      <h3 className="text-lg font-serif font-black text-[#0B3D5E] leading-snug group-hover:text-[#D98E4D] transition-colors cursor-pointer mb-3 min-h-[3.25rem] flex items-center">
                        {room.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2.5 text-[11px] font-bold text-slate-600 mb-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                        <Users className="w-3.5 h-3.5 text-[#FBBF24]" /> {room.maxGuests || 2} Guests
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                        <BedDouble className="w-3.5 h-3.5 text-[#FBBF24]" /> {room.bedrooms || 1} Bed
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Price & Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FBBF24]">Starting from</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#0B3D5E] font-serif">{formatPrice(price)}</span>
                        <span className="text-[11px] text-slate-400 font-medium">/ night</span>
                      </div>
                    </div>
                    <Link href={`/rooms/${room.slug}`}>
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-sm hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300 group/btn">
                        <span>Explore</span>
                        <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
