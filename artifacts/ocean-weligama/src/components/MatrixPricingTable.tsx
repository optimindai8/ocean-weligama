import { useGetMatrixPricing, getGetMatrixPricingQueryKey, useListRooms } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import { Sparkles, ArrowRight, CheckCircle2, Star, Waves, Flame, Leaf, ChevronDown, ChevronUp } from "lucide-react";
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
    gradient: 'from-[#1565C0] via-[#1976D2] to-[#42A5F5]',
    checkBg: 'bg-blue-100',
    accentText: 'text-blue-700',
    emoji: '🏄',
    tagIcon: <Waves className="w-3 h-3" />,
  },
  {
    nameMatch: 'advance',
    subtitle: 'INTERMEDIATE / ADVANCED',
    tag: 'Most Popular',
    gradient: 'from-[#006064] via-[#00838F] to-[#26C6DA]',
    checkBg: 'bg-teal-100',
    accentText: 'text-teal-700',
    emoji: '🌊',
    tagIcon: <Flame className="w-3 h-3" />,
  },
  {
    nameMatch: 'yoga',
    subtitle: 'ALL LEVELS',
    tag: 'Mind & Body',
    gradient: 'from-[#1B5E20] via-[#2E7D32] to-[#66BB6A]',
    checkBg: 'bg-green-100',
    accentText: 'text-green-700',
    emoji: '🧘',
    tagIcon: <Leaf className="w-3 h-3" />,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-[2rem] shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden relative max-w-7xl w-full mx-auto"
    >
      {/* Horizontally scrollable wrapper */}
      <div className="overflow-x-auto relative z-10">

        {/* ── HEADER TABLE ── always visible */}
        <table className="w-full min-w-max text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 md:p-6 pb-6 md:pb-8 bg-gradient-to-br from-slate-50 to-white text-[#0B3D5E] border-b border-r border-slate-100 font-serif font-bold text-sm md:text-lg min-w-[140px] md:min-w-[220px] max-w-[180px] md:max-w-[280px] align-bottom sticky left-0 z-40 shadow-[4px_0_12px_rgb(0,0,0,0.03)]">
                Room Type
                <div className="text-[9px] md:text-[10px] font-light text-slate-400 font-sans mt-1 uppercase tracking-widest hidden sm:block">Select your comfort</div>
              </th>
              {filteredPackages.map((pkg: any) => {
                const isPopular = pkg.isFeatured;
                const meta = PACKAGE_META.find(m => pkg.name?.toLowerCase().includes(m.nameMatch)) || PACKAGE_META[0];
                return (
                  <th key={pkg.id} className={`p-6 pb-8 border-b relative transition-all duration-500 ease-out align-bottom bg-white border-slate-100 ${isPopular ? 'border-t-4 border-t-teal-400' : ''} min-w-[220px]`}>
                    {isPopular && (
                      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/60 to-transparent pointer-events-none rounded-t-none" />
                    )}
                    <motion.div className="flex flex-col items-center text-center space-y-2 relative z-10">
                      {isPopular && (
                        <motion.div
                          className={`flex items-center gap-1.5 bg-gradient-to-r ${meta.gradient} text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-teal-200/50 uppercase tracking-[0.15em] mb-1`}
                        >
                          <Star className="w-3 h-3 fill-current" /> Most Popular
                        </motion.div>
                      )}
                      <span className="text-3xl">{pkg.iconEmoji || meta.emoji}</span>
                      <div className={`w-14 h-1 rounded-full bg-gradient-to-r ${meta.gradient} opacity-80`} />
                      <h4 className="text-[14px] font-serif font-bold text-[#0B3D5E] leading-tight mt-1">{pkg.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{pkg.matrixExperienceLevel || meta.subtitle}</span>
                      <div className={`inline-flex items-center gap-1 ${meta.checkBg} ${meta.accentText} text-[9px] font-bold px-2.5 py-1 rounded-full mt-1`}>
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
          <table className="w-full min-w-max text-left border-collapse">
            <tbody className="divide-y divide-slate-50 bg-white">
              {filteredRooms.map((room: any) => (
                <tr key={room.id} className="group transition-colors duration-200 hover:bg-slate-50/50">
                  <td 
                    onClick={() => {
                      const slug = roomSlugMap[room.id];
                      if (slug) setLocation(`/rooms/${slug}`);
                    }}
                    className={`p-3 md:p-5 text-xs md:text-sm font-serif text-[#0B3D5E] bg-white group-hover:bg-slate-50 transition-all sticky left-0 z-30 font-medium border-r border-slate-50 shadow-[4px_0_12px_rgb(0,0,0,0.03)] leading-relaxed whitespace-normal min-w-[140px] md:min-w-[220px] max-w-[180px] md:max-w-[280px] ${
                      roomSlugMap[room.id] ? 'cursor-pointer hover:shadow-inner' : 'cursor-default'
                    }`}
                  >
                    <span className="line-clamp-3 md:line-clamp-none">{room.name}</span>
                    {roomSlugMap[room.id] && (
                      <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-[#4BBCCC] opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 font-sans font-bold uppercase tracking-wider translate-y-1 group-hover:translate-y-0 duration-300">
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                        <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </td>
                  {filteredPackages.map((pkg: any) => {
                    const priceObj = getPrice(room.id!, pkg.id!);
                    const price = priceObj ? (priceObj.adjustedDailyPrice || priceObj.originalDailyPrice || priceObj.dailyPrice) : null;
                    const originalPrice = priceObj?.adjustedDailyPrice ? (priceObj.originalDailyPrice || priceObj.dailyPrice) : null;
                    
                    const isPopular = pkg.isFeatured;
                    const meta = PACKAGE_META.find(m => pkg.name?.toLowerCase().includes(m.nameMatch)) || PACKAGE_META[0];
                    return (
                      <td key={pkg.id} className={`p-4 md:p-6 text-center relative transition-colors duration-200 min-w-[220px] ${isPopular ? 'bg-teal-50/10' : ''}`}>
                        {price && price !== "0" && price !== "0.00" ? (
                            <div className="flex flex-col items-center justify-center h-full w-full group/price relative py-2">
                              <div className="flex flex-col items-center justify-center gap-1 mb-3 relative z-10">
                                {originalPrice && parseFloat(price as string) < parseFloat(originalPrice as string) && (
                                  <s className="text-xs text-slate-400 font-medium mb-1">{formatPrice(parseFloat(originalPrice as string))}</s>
                                )}
                                <span className={`text-base md:text-lg font-serif font-black transition-colors tracking-tight ${isPopular ? 'text-[#00838F]' : 'text-[#0B3D5E]'}`}>
                                  {formatPrice(parseFloat(price as string))}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0">per week</span>
                              </div>
                              <div className="opacity-100 transition-all duration-300 z-20">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Store booking context in localStorage
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
                                  // Clear stale data
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
                                  text-[11px] font-black uppercase tracking-widest text-white
                                  bg-gradient-to-r ${meta.gradient}
                                  shadow-md hover:shadow-xl
                                  hover:scale-105 active:scale-95
                                  transition-all duration-300 ease-out
                                  cursor-pointer
                                `}
                              >
                                {/* Shine sweep animation */}
                                <span className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover/btn:translate-x-[350%] transition-transform duration-700 ease-out pointer-events-none" />
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
                </tr>
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
            background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,1) 100%)",
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
                backgroundColor: "#0B3D5E",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                boxShadow: "0 2px 10px rgba(11,61,94,0.3)",
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
                backgroundColor: "#0B3D5E",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
                boxShadow: "0 2px 10px rgba(11,61,94,0.3)",
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
    <section className="py-20 bg-[#FAF9F6] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-[#0B3D5E]/10 text-[#1A6B8A] text-xs font-bold mb-2 uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Transparent Pricing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] leading-tight"
          >
            Perfect Packages, <br className="hidden md:block"/> <span className="text-[#1A6B8A] italic font-light">Tailored for You</span>
          </motion.h2>
          <p className="text-muted-foreground font-light text-sm md:text-base leading-relaxed px-4 italic">
            Find the perfect balance of surf, comfort, and value. Our daily rates combine your preferred accommodation with world-class surf experiences.
          </p>
        </div>

        <MatrixTableInner
          filteredRooms={filteredRooms}
          filteredPackages={filteredPackages}
          getPrice={getPrice}
          formatPrice={formatPrice}
          roomSlugMap={roomSlugMap}
        />
      </div>
    </section>
  );
}
