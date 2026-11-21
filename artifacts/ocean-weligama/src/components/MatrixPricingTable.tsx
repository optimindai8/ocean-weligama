import { useGetMatrixPricing, getGetMatrixPricingQueryKey, useListRooms } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import { ArrowRight, CheckCircle2, Star, Waves, Flame, Leaf, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

const EXCLUDED_PACKAGES = [
  "Moderate Surf / Guiding",
  "Full Surf Package",
  "Surf And Yoga Package"
];

const EXCLUDED_ROOMS = [
  "Mixed Dormitory Bed",
  "Private Single Room",
  "Private Double / Twin Room",
  "Private Triple Room"
];

const PACKAGE_META = [
  {
    nameMatch: 'starter',
    subtitle: 'BEGINNER',
    tag: 'Perfect Start',
    gradient: 'from-[#0B3D5E] to-[#124E78]',
    checkBg: 'bg-slate-100',
    accentText: 'text-[#0B3D5E]',
    emoji: '🏄',
    tagIcon: <Waves className="w-3 h-3 text-[#0B3D5E]" />,
  },
  {
    nameMatch: 'advance',
    subtitle: 'INTERMEDIATE / ADVANCED',
    tag: 'Most Popular',
    gradient: 'from-[#F59E0B] via-[#FBBF24] to-[#FCD34D]',
    checkBg: 'bg-[#FBBF24]/20',
    accentText: 'text-[#0B3D5E]',
    emoji: '🌊',
    tagIcon: <Flame className="w-3 h-3 text-[#0B3D5E]" />,
  },
  {
    nameMatch: 'yoga',
    subtitle: 'ALL LEVELS',
    tag: 'Mind & Body',
    gradient: 'from-[#0B3D5E] to-[#124E78]',
    checkBg: 'bg-slate-100',
    accentText: 'text-[#0B3D5E]',
    emoji: '🧘',
    tagIcon: <Leaf className="w-3 h-3 text-[#0B3D5E]" />,
  },
];

/* ─────────────────────────────────────────────────────
   Inner table component with scrollable body
   ───────────────────────────────────────────────────── */
function MatrixTableInner({
  filteredRooms,
  filteredPackages,
  getPrice,
  formatPrice,
  roomSlugMap,
}: {
  filteredRooms: any[];
  filteredPackages: any[];
  getPrice: (roomId: string, packageId: string) => any;
  formatPrice: (n: number) => string;
  roomSlugMap: Record<string, string>;
}) {
  const [, setLocation] = useLocation();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const MAX_ROWS_VISIBLE = 4;
  const ROW_HEIGHT = 130; // approximate row height in px (includes Book Now button)
  const maxBodyHeight = MAX_ROWS_VISIBLE * ROW_HEIGHT;
  const needsScroll = filteredRooms.length > MAX_ROWS_VISIBLE;

  const updateScrollState = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    setIsAtBottom(el.scrollTop >= el.scrollHeight - el.clientHeight - 5);
    setIsAtTop(el.scrollTop <= 5);
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollToTop = () => {
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  };

  const roomColWidth = Math.max(25, 100 - (filteredPackages.length * 25));
  const pkgColWidth = filteredPackages.length > 0 ? (100 - roomColWidth) / filteredPackages.length : 25;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -80, scale: 0.98, transition: { duration: 0.2 } },
        visible: { 
          opacity: 1, 
          x: 0, 
          scale: 1, 
          transition: { delay: 0.15, duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      className="backdrop-blur-xl rounded-[2rem] sm:rounded-[2.4rem] shadow-[0_15px_40px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.15)] border border-white/85 overflow-hidden relative max-w-[1440px] w-full mx-auto bg-white/85 z-10"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.85) 100%)' }}
    >
      <div className="relative z-10 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">

        {/* ── HEADER TABLE ── always visible */}
        <table 
          className="w-full min-w-[650px] lg:min-w-0 text-left border-collapse table-fixed"
          onMouseLeave={() => setHoveredCol(null)}
        >
          <thead>
            <tr>
              <th 
                className="p-5 lg:p-7 pb-8 text-[#0B3D5E] border-b border-r border-slate-100/80 font-serif font-black text-base lg:text-lg align-bottom sticky left-0 z-40 bg-white/95 backdrop-blur-md shadow-[1px_0_0_0_rgba(226,232,240,0.8)]"
                style={{ width: `${roomColWidth}%` }}
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FBBF24]/15 border border-[#FBBF24]/35 text-[10px] font-black uppercase tracking-wider text-[#0B3D5E] mb-2 hidden sm:inline-flex">
                  <Star className="w-2.5 h-2.5 fill-[#FBBF24] text-[#D97706]" />
                  <span>Transparent Rates</span>
                </div>
                <div>Room Type</div>
                <div className="text-[10px] font-bold text-slate-400 font-sans mt-1 uppercase tracking-widest hidden sm:block">Select your comfort</div>
              </th>
              {filteredPackages.map((pkg: any, idx: number) => {
                const isPopular = pkg.isFeatured;
                const isHovered = hoveredCol === idx;
                const meta = PACKAGE_META.find(m => pkg.name?.toLowerCase().includes(m.nameMatch)) || PACKAGE_META[0];
                return (
                  <th 
                    key={pkg.id} 
                    className={`p-4 sm:p-5 lg:p-6 pb-8 border-b relative transition-colors duration-200 align-bottom border-slate-100/80 cursor-pointer select-none ${
                      isPopular ? 'border-t-4 border-t-[#FBBF24]' : (isHovered ? 'border-t-4 border-t-[#FBBF24]' : 'border-t-4 border-t-transparent')
                    }`}
                    style={{ 
                      width: `${pkgColWidth}%`,
                      background: isPopular 
                        ? (isHovered
                            ? 'linear-gradient(180deg, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.06) 100%)'
                            : 'linear-gradient(180deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.02) 100%)')
                        : (isHovered
                            ? 'linear-gradient(180deg, rgba(251,191,36,0.08) 0%, rgba(248,250,252,0.95) 100%)'
                            : 'transparent')
                    }}
                    onMouseEnter={() => {
                      setHoveredCol((curr) => (curr === idx ? curr : idx));
                    }}
                    onClick={() => {
                      setHoveredCol((curr) => (curr === idx ? null : idx));
                    }}
                  >
                    {/* Golden bottom accent bar on active/hovered column */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent transition-opacity duration-300 pointer-events-none ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    />

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: -45, transition: { duration: 0.2 } },
                        visible: { 
                          opacity: 1, 
                          y: 0, 
                          transition: { 
                            delay: 0.35 + idx * 0.15, 
                            duration: 0.7, 
                            ease: [0.16, 1, 0.3, 1] 
                          } 
                        }
                      }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false }}
                      className="flex flex-col items-center text-center space-y-2 relative z-10 pointer-events-none"
                    >
                      {isPopular && (
                        <div
                          className="flex items-center gap-1.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_4px_14px_rgba(251,191,36,0.4)] uppercase tracking-[0.18em] mb-1 mt-2 border border-[#F59E0B]/30"
                        >
                          <Star className="w-3 h-3 fill-current" /> Most Popular
                        </div>
                      )}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border transition-all duration-300 mt-2 ${
                        isPopular 
                          ? 'bg-[#FBBF24]/20 border-[#FBBF24]/60 shadow-[0_4px_12px_rgba(251,191,36,0.25)]' 
                          : (isHovered ? 'bg-[#FBBF24]/15 border-[#FBBF24]/50 scale-105 shadow-[0_4px_14px_rgba(251,191,36,0.2)]' : 'bg-slate-50 border-slate-100')
                      }`}>
                        <span>{pkg.iconEmoji || meta.emoji}</span>
                      </div>
                      <div className={`w-12 h-1 rounded-full transition-colors duration-300 ${isPopular || isHovered ? 'bg-[#FBBF24]' : 'bg-[#0B3D5E]/20'}`} />
                      <h4 className="text-[13px] sm:text-[14px] lg:text-[15px] font-serif font-black text-[#0B3D5E] leading-tight px-1 mt-1">{pkg.name}</h4>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{pkg.matrixExperienceLevel || meta.subtitle}</span>
                      <div className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border mt-1 transition-colors duration-300 ${
                        isPopular || isHovered ? 'bg-[#FBBF24]/25 text-[#0B3D5E] border-[#FBBF24]/50 font-black' : 'bg-slate-100 text-slate-600 border-slate-200/80'
                      }`}>
                        {meta.tagIcon} {pkg.matrixLabel || meta.tag}
                      </div>
                    </motion.div>
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>

        {/* ── SCROLLABLE BODY ── */}
        <div
          ref={bodyRef}
          style={{
            maxHeight: needsScroll ? `${maxBodyHeight}px` : undefined,
            overflowY: needsScroll ? "auto" : undefined,
            scrollBehavior: "smooth",
          }}
        >
          <table 
            className="w-full min-w-[650px] lg:min-w-0 text-left border-collapse table-fixed"
            onMouseLeave={() => setHoveredCol(null)}
          >
            <tbody className="divide-y divide-slate-100/80">
              {filteredRooms.map((room: any, rIdx: number) => (
                <motion.tr
                  key={room.id}
                  variants={{
                    hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { 
                        delay: 0.45 + rIdx * 0.04, 
                        duration: 0.55, 
                        ease: [0.16, 1, 0.3, 1] 
                      } 
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  className="group transition-colors duration-200 hover:bg-amber-50/20"
                >
                  <td
                    onClick={() => {
                      const slug = roomSlugMap[room.id];
                      if (slug) setLocation(`/rooms/${slug}`);
                    }}
                    className={`p-4 lg:p-6 text-xs lg:text-sm font-serif text-[#0B3D5E] transition-all sticky left-0 z-30 font-medium border-r border-slate-100/80 leading-relaxed bg-white/95 backdrop-blur-md shadow-[1px_0_0_0_rgba(226,232,240,0.8)] ${
                      roomSlugMap[room.id] ? 'cursor-pointer hover:bg-amber-50/30' : 'cursor-default'
                    }`}
                    style={{ width: `${roomColWidth}%` }}
                  >
                    <span className="line-clamp-2 md:line-clamp-none font-bold text-slate-700 group-hover:text-[#0B3D5E] transition-colors">{room.name}</span>
                    {roomSlugMap[room.id] && (
                      <div className="flex items-center gap-1 text-[10px] text-[#D97706] font-sans font-bold uppercase tracking-wider mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </td>
                  {filteredPackages.map((pkg: any, idx: number) => {
                    const priceObj = getPrice(room.id!, pkg.id!);
                    const price = priceObj ? (priceObj.adjustedDailyPrice || priceObj.originalDailyPrice || priceObj.dailyPrice) : null;
                    const originalPrice = priceObj?.adjustedDailyPrice ? (priceObj.originalDailyPrice || priceObj.dailyPrice) : null;
                    
                    const isPopular = pkg.isFeatured;
                    const isHovered = hoveredCol === idx;
                    return (
                      <td 
                        key={pkg.id} 
                        className="p-4 lg:p-6 text-center relative transition-colors duration-200 cursor-pointer select-none"
                        style={{ 
                          width: `${pkgColWidth}%`,
                          background: isHovered
                            ? (isPopular ? 'rgba(251, 191, 36, 0.12)' : 'rgba(251, 191, 36, 0.05)')
                            : (isPopular ? 'rgba(251, 191, 36, 0.05)' : 'transparent')
                        }}
                        onMouseEnter={() => {
                          setHoveredCol((curr) => (curr === idx ? curr : idx));
                        }}
                        onClick={() => {
                          setHoveredCol((curr) => (curr === idx ? null : idx));
                        }}
                      >
                        {price && price !== "0" && price !== "0.00" ? (
                            <div className="flex flex-col items-center justify-center h-full w-full group/price relative py-1">
                              <div className="flex flex-col items-center justify-center gap-0.5 mb-2.5 relative z-10 pointer-events-none">
                                {originalPrice && parseFloat(price as string) < parseFloat(originalPrice as string) && (
                                  <s className="text-xs text-slate-400 font-medium">{formatPrice(parseFloat(originalPrice as string))}</s>
                                )}
                                <span className="text-base lg:text-xl font-serif font-black tracking-tight text-[#0B3D5E]">
                                  {formatPrice(parseFloat(price as string))}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">per week</span>
                              </div>
                              <div className="opacity-100 transition-all duration-300 z-20">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  localStorage.setItem('booking_roomIds', JSON.stringify([room.id]));
                                  localStorage.setItem('booking_serviceIds', JSON.stringify([pkg.id]));
                                  localStorage.setItem('booking_stepId', JSON.stringify("dates"));
                                  localStorage.setItem('booking_matrixPrice', JSON.stringify({
                                    roomId: room.id,
                                    packageId: pkg.id,
                                    dailyPrice: price,
                                    packageName: pkg.name,
                                    roomName: room.name,
                                  }));
                                  localStorage.removeItem('booking_dateRange');
                                  localStorage.removeItem('booking_priceData');
                                  localStorage.removeItem('booking_guestCount');
                                  localStorage.removeItem('booking_serviceQuantities');
                                  localStorage.removeItem('booking_highlightCustom');
                                  setLocation('/book');
                                }}
                                className={`
                                  group/btn relative overflow-hidden
                                  px-5 py-2 rounded-full
                                  text-[11px] font-black uppercase tracking-widest
                                  transition-all duration-300 ease-out
                                  cursor-pointer shadow-sm active:scale-95
                                  ${isHovered ? 'scale-105 shadow-[0_8px_20px_rgba(251,191,36,0.45)]' : 'hover:scale-105'}
                                  ${isPopular 
                                    ? 'bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] hover:bg-white hover:text-[#0B3D5E] hover:shadow-[0_8px_25px_rgba(251,191,36,0.55)] border border-[#F59E0B]/40' 
                                    : 'bg-[#0B3D5E] text-white hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:shadow-[0_6px_18px_rgba(251,191,36,0.35)]'}
                                `}
                              >
                                <span className="relative z-10 flex items-center gap-1.5">
                                  Book Now
                                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                                </span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-200 font-light text-xl">-</span>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom fade gradient to hint at more content ── */}
      {needsScroll && !isAtBottom && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(238,245,253,0.80) 60%, rgba(238,245,253,0.95) 100%)",
            pointerEvents: "none",
            zIndex: 15,
            borderBottomLeftRadius: "2rem",
            borderBottomRightRadius: "2rem",
          }}
        />
      )}

      {/* ── Scroll indicator buttons ── */}
      {needsScroll && (
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 20,
            display: "flex",
            gap: "8px",
          }}
        >
          {!isAtTop && (
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(11,61,94,0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                boxShadow: "0 4px 14px rgba(11,61,94,0.25)",
                transition: "all 0.2s",
              }}
            >
              <ChevronUp size={16} strokeWidth={2.5} />
            </button>
          )}
          {!isAtBottom && (
            <button
              type="button"
              onClick={scrollToBottom}
              aria-label="Scroll down for more rooms"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "rgba(11,61,94,0.75)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                boxShadow: "0 4px 14px rgba(11,61,94,0.25)",
                transition: "all 0.2s",
                animation: "bounce-gentle 2s infinite",
              }}
            >
              <ChevronDown size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}

      {/* Bounce animation for the scroll hint */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
      `}} />
    </motion.div>
  );
}

/* ─── Motion Variants for Section Header ───────────────────────────────────── */
const matrixBadgeVariants: Variants = {
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

const matrixWordsContainerVariants: Variants = {
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

const matrixWordItemVariants: Variants = {
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

const matrixDescVariants: Variants = {
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

export function MatrixPricingTable() {
  const { formatPrice } = useLanguage();
  const { data: matrixData, isLoading } = useGetMatrixPricing({
    query: { queryKey: getGetMatrixPricingQueryKey() },
  });
  const { data: allRooms } = useListRooms();

  // Build a map from room ID -> slug using the full rooms list
  const roomSlugMap: Record<string, string> = {};
  if (Array.isArray(allRooms)) {
    (allRooms as any[]).forEach((r: any) => {
      if (r.id && r.slug) roomSlugMap[r.id] = r.slug;
    });
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Skeleton className="w-full h-96 rounded-[2rem]" />
      </div>
    );
  }

  if (!matrixData || !matrixData.rooms || matrixData.rooms.length === 0) {
    return null;
  }

  const { rooms, packages, prices } = matrixData;

  const filteredRooms = rooms.filter((r) => !EXCLUDED_ROOMS.includes(r.name!));
  const filteredPackages = (packages || []).filter(
    (p) => !EXCLUDED_PACKAGES.includes(p.name!)
  );

  const getPrice = (roomId: string, packageId: string) => {
    return prices?.find(p => p.roomId === roomId && p.packageId === packageId) || null;
  };

  if (filteredRooms.length === 0 || filteredPackages.length === 0) {
    return null;
  }

  return (
    <section
      className="py-12 sm:py-16 md:py-20 relative overflow-hidden w-full border-t border-[#0B3D5E]/5"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9FC 50%, #EEF5FA 100%)' }}
    >
      {/* Decorative ambient lighting matching logo yellow and ocean deep */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10 max-w-[1440px]">
        {/* ── Public Showcase View: Transparent Psychologically Attractive Box ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] border border-white/80 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.22)_inset] backdrop-blur-2xl p-5 sm:p-8 md:p-10 lg:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(254,251,243,0.74) 45%, rgba(245,249,252,0.84) 100%)',
          }}
        >
          {/* Ambient shimmer sweep animation */}
          <motion.div
            className="absolute inset-0 w-[45%] pointer-events-none z-0"
            style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)', skewX: '-15deg' }}
            animate={{ x: ['-160%', '350%'] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
          />

          {/* Top golden hairline accent line */}
          <div
            className="absolute top-0 left-12 right-12 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
          />

          {/* Ambient corner radial warmth */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#FBBF24]/16 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#0B3D5E]/06 rounded-full blur-3xl pointer-events-none" />

          {/* ── Header ───────────────────────────────── */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 relative z-10 space-y-3">
            {/* Pill Badge - Comes from right side */}
            <motion.div
              variants={matrixBadgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 mb-1 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0B3D5E]" />
              <span>Transparent Pricing</span>
            </motion.div>

            {/* Headline - Words come one by one from left side */}
            <motion.h2
              variants={matrixWordsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-3xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
            >
              <motion.span variants={matrixWordItemVariants} className="inline-block">
                Perfect
              </motion.span>
              <motion.span variants={matrixWordItemVariants} className="inline-block">
                Packages,
              </motion.span>
              <motion.span
                variants={matrixWordItemVariants}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
              >
                Tailored
              </motion.span>
              <motion.span
                variants={matrixWordItemVariants}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
              >
                for
              </motion.span>
              <motion.span
                variants={matrixWordItemVariants}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
              >
                You
              </motion.span>
            </motion.h2>

            {/* Subtle Golden Accent Flourish */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto mb-3"
            />

            {/* Description - Comes from right side */}
            <motion.p
              variants={matrixDescVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-slate-600 font-medium text-sm md:text-base leading-relaxed px-4"
            >
              Find the perfect balance of surf, comfort, and value. Our daily rates combine your preferred accommodation with world-class surf experiences.
            </motion.p>
          </div>

          <MatrixTableInner
            filteredRooms={filteredRooms}
            filteredPackages={filteredPackages}
            getPrice={getPrice}
            formatPrice={formatPrice}
            roomSlugMap={roomSlugMap}
          />
        </motion.div>
      </div>
    </section>
  );
}
