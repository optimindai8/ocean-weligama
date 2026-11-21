import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Clock, ArrowRight, ShieldCheck, CheckCircle2, Crown, Waves } from "lucide-react";
import { customFetch } from "@workspace/api-client-react";

type OfferAd = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  intervalMinutes: number;
  offerDays: number;
  discountType: string;
  discountValue: string;
  roomIds: string[];
  createdAt: string;
};

/* ───── Pure synchronous helper: compute remaining time ───── */
function computeTimeLeft(createdAt: string, offerDays: number) {
  const validDays = typeof offerDays === "number" && offerDays > 0 ? offerDays : 7;
  const start = new Date(createdAt).getTime();
  if (isNaN(start)) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const end = start + validDays * 24 * 60 * 60 * 1000;
  const diff = end - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

/* ───── Floating gold shimmer particle ───── */
const FloatingParticle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      bottom: 0,
      background: "radial-gradient(circle, rgba(251,191,36,0.9) 0%, rgba(245,158,11,0.4) 70%, transparent 100%)",
      filter: "blur(0.5px)",
    }}
    initial={{ y: 0, opacity: 0, scale: 0 }}
    animate={{
      y: [0, -260 - Math.random() * 120],
      opacity: [0, 0.9, 0.9, 0],
      scale: [0, 1, 0.8, 0],
      x: [0, (Math.random() - 0.5) * 60],
    }}
    transition={{
      duration: 3.8 + Math.random() * 2.5,
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 1.5,
      ease: "easeOut",
    }}
  />
);

/* ───── Glassmorphic countdown tile ───── */
const CountdownTile = ({ value, label }: { value: number; label: string }) => {
  const safeVal = typeof value === "number" && !isNaN(value) && value >= 0 ? Math.floor(value) : 0;
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-black/40 backdrop-blur-md border border-amber-400/25 flex items-center justify-center shadow-inner relative overflow-hidden group">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        <span className="text-lg sm:text-2xl font-black text-amber-300 tabular-nums tracking-tight">
          {String(safeVal).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-300/80 mt-1">{label}</span>
    </div>
  );
};

/* ───── Intelligent description parser for psychological conversion ───── */
function parseOfferDetails(desc: string | null, discountVal?: string) {
  let discountLabel = "20% OFF";
  if (discountVal && parseFloat(discountVal) > 0) {
    discountLabel = `${Math.round(parseFloat(discountVal))}% OFF`;
  }

  if (!desc) {
    return {
      bodyText: "Wake up to breathtaking ocean views and experience the perfect coastal escape with direct booking privileges.",
      discountLabel,
    };
  }

  const lines = desc.split("\n").map((l) => l.trim()).filter(Boolean);
  
  // Check if text has explicit discount mention
  for (const line of lines) {
    const match = line.match(/(\d+%\s*OFF)/i);
    if (match) {
      discountLabel = match[1].toUpperCase();
      break;
    }
  }

  // Find the most evocative human sentence
  const humanSentence = lines.find((l) => l.length > 25 && l !== l.toUpperCase());
  const bodyText = humanSentence || "Wake up to breathtaking ocean views and experience the perfect coastal escape with direct booking privileges.";

  return { bodyText, discountLabel };
}

export function OfferAdPopup() {
  const [isVisible, setIsVisible] = useState(false);
  // Ticker forces re-render every second so countdown digits are always live and accurate
  const [, setTick] = useState(0);

  const { data: activeAd } = useQuery<OfferAd | null>({
    queryKey: ["public-offer-ad"],
    queryFn: async () => {
      return customFetch<OfferAd | null>("/api/v1/offer-ads/active");
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const rawCreatedAt = activeAd ? activeAd.createdAt || (activeAd as any).created_at : undefined;
  const rawOfferDays = activeAd
    ? typeof activeAd.offerDays === "number"
      ? activeAd.offerDays
      : ((activeAd as any).offer_days ?? 7)
    : 7;

  const countdown = rawCreatedAt
    ? computeTimeLeft(rawCreatedAt, rawOfferDays)
    : { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false };

  useEffect(() => {
    if (!activeAd || (activeAd.isActive !== true && (activeAd as any).is_active !== true)) {
      setIsVisible(false);
      return;
    }

    const createdVal = activeAd.createdAt || (activeAd as any).created_at;
    const daysVal = typeof activeAd.offerDays === "number" ? activeAd.offerDays : ((activeAd as any).offer_days || 7);
    const startTime = createdVal ? new Date(createdVal).getTime() : Date.now();
    const endTimestamp = startTime + daysVal * 24 * 60 * 60 * 1000;
    if (Date.now() >= endTimestamp) {
      setIsVisible(false);
      return;
    }

    const lastShownKey = `ow_ad_last_shown_${activeAd.id}`;
    let showTimer: ReturnType<typeof setTimeout> | null = null;

    const checkAndShow = () => {
      if (isVisible) return;
      if (Date.now() >= endTimestamp) {
        setIsVisible(false);
        return;
      }

      const lastShownStr = localStorage.getItem(lastShownKey);
      let shouldShow = true;

      if (lastShownStr) {
        const lastShownTime = new Date(lastShownStr).getTime();
        const now = Date.now();
        const diffMinutes = (now - lastShownTime) / (1000 * 60);
        if (diffMinutes < activeAd.intervalMinutes) {
          shouldShow = false;
        }
      }

      if (shouldShow) {
        showTimer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
      }
    };

    checkAndShow();
    const pollInterval = setInterval(checkAndShow, 15 * 1000);

    return () => {
      clearInterval(pollInterval);
      if (showTimer) clearTimeout(showTimer);
    };
  }, [activeAd, isVisible]);

  const handleClose = useCallback(() => {
    if (!activeAd) return;
    setIsVisible(false);
    localStorage.setItem(`ow_ad_last_shown_${activeAd.id}`, new Date().toISOString());
  }, [activeAd]);

  const handleClaim = useCallback(() => {
    handleClose();
    if (activeAd) {
      sessionStorage.setItem("claimedOffer", JSON.stringify(activeAd));
      window.location.href = "/book?new=1";
    }
  }, [handleClose, activeAd]);

  if (!activeAd) return null;

  const hasImage = !!activeAd.imageUrl;
  const parsed = parseOfferDetails(activeAd.description, activeAd.discountValue);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 md:p-8 pointer-events-none">
          {/* Backdrop with frosted dark coastal atmosphere */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 pointer-events-auto"
            style={{
              background: "radial-gradient(ellipse at center, rgba(6,33,53,0.72) 0%, rgba(2,19,31,0.92) 100%)",
              backdropFilter: "blur(14px)",
            }}
            onClick={handleClose}
          />

          {/* Main Card: Luxury Transparent Glassmorphism Box with Yellow Accent & Rounded Corners */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="relative w-full max-w-[1100px] max-h-[92vh] md:min-h-[570px] md:max-h-[620px] flex flex-col md:flex-row pointer-events-auto z-10 overflow-hidden rounded-[28px] sm:rounded-[36px] shadow-[0_25px_90px_-10px_rgba(0,0,0,0.85),0_0_65px_rgba(245,158,11,0.24)] border border-amber-400/35 bg-[#062135]/90 backdrop-blur-2xl"
          >
            {/* Top-Right Smooth Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-40 w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 hover:border-amber-400/40 transition-all duration-300 hover:rotate-90 shadow-lg cursor-pointer"
              aria-label="Close offer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Left Image Section: Uncropped Flyer with Subtle Gold Glow */}
            {hasImage && (
              <div className="relative w-full md:w-[47%] min-h-[220px] md:min-h-full bg-black/30 backdrop-blur-md overflow-hidden flex items-center justify-center p-5 sm:p-6 md:p-7 border-b md:border-b-0 md:border-r border-amber-400/20 shrink-0">
                {/* Subtle radial gold aura */}
                <div className="absolute inset-0 bg-radial from-amber-400/15 via-transparent to-transparent pointer-events-none" />

                {/* Ambient blurred backdrop of the flyer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div
                    className="w-full h-full bg-cover bg-center blur-2xl opacity-35 scale-110 saturate-150"
                    style={{ backgroundImage: `url(${activeAd.imageUrl})` }}
                  />
                </div>

                {/* Floating gold shimmer particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <FloatingParticle key={i} delay={i * 0.5} x={8 + i * 11} size={3 + (i % 3) * 2} />
                  ))}
                </div>

                {/* Crisp Flyer Image with Smooth Rounded Corners and Drop Shadow */}
                <motion.img
                  src={activeAd.imageUrl!}
                  alt={activeAd.title}
                  className="relative z-10 w-full h-auto max-h-[380px] md:max-h-[500px] object-contain rounded-2xl filter drop-shadow-[0_18px_40px_rgba(0,0,0,0.7)]"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Right Content Section: Transparent Luxury Glassmorphism Panel */}
            <div
              className={`relative flex flex-col justify-between ${
                hasImage ? "w-full md:w-[53%]" : "w-full"
              } p-5 sm:p-6 md:p-7 lg:p-8 bg-gradient-to-br from-[#0B3D5E]/60 via-[#06243A]/70 to-[#02131F]/80 backdrop-blur-xl overflow-hidden`}
            >
              {/* Top Section */}
              <div>
                {/* Exclusive Privilege Pill Badge in Logo Yellow with Crown Icon */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-400/15 border border-amber-400/35 text-amber-300 shadow-[0_2px_12px_rgba(245,158,11,0.2)] mb-1.5">
                  <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                  <span>Exclusive Seasonal Privilege</span>
                </div>

                {/* Headline in Luxury Serif Font */}
                <h2 className="text-2xl sm:text-3xl md:text-[28px] lg:text-[32px] font-serif font-black text-white tracking-tight leading-[1.12] mt-1.5 mb-2">
                  {activeAd.title.trim()}
                </h2>

                {/* Clean, Evocative Description */}
                <p className="text-slate-200/90 text-xs sm:text-[13.5px] md:text-sm leading-relaxed mb-3 line-clamp-2">
                  {parsed.bodyText}
                </p>

                {/* Psychological Value Chips (Transparent Glass Boxes) with Crown/Shield/Waves Icons */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-3">
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-center">
                    <Tag className="w-4 h-4 text-amber-300 mb-0.5" />
                    <span className="text-xs sm:text-[13px] font-bold text-white leading-tight">{parsed.discountLabel}</span>
                    <span className="text-[9px] text-slate-300/80 uppercase tracking-wider mt-0.5">Direct Perk</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-center">
                    <ShieldCheck className="w-4 h-4 text-amber-300 mb-0.5" />
                    <span className="text-xs sm:text-[13px] font-bold text-white leading-tight">Best Rate</span>
                    <span className="text-[9px] text-slate-300/80 uppercase tracking-wider mt-0.5">Guaranteed</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-center">
                    <Waves className="w-4 h-4 text-amber-300 mb-0.5" />
                    <span className="text-xs sm:text-[13px] font-bold text-white leading-tight">Sanctuary</span>
                    <span className="text-[9px] text-slate-300/80 uppercase tracking-wider mt-0.5">Ocean View</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Urgency Countdown & Action Button */}
              <div>
                {/* Urgency Countdown Box */}
                <div className="rounded-xl p-2.5 sm:p-3 bg-black/35 backdrop-blur-md border border-amber-400/25 shadow-inner mb-3">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-amber-300">
                        Offer Expires In
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-medium text-slate-300/70">Limited Availability</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                    <CountdownTile value={countdown.days} label="Days" />
                    <span className="text-lg sm:text-2xl font-black text-amber-300/40 -mt-3.5">:</span>
                    <CountdownTile value={countdown.hours} label="Hrs" />
                    <span className="text-lg sm:text-2xl font-black text-amber-300/40 -mt-3.5">:</span>
                    <CountdownTile value={countdown.minutes} label="Min" />
                    <span className="text-lg sm:text-2xl font-black text-amber-300/40 -mt-3.5">:</span>
                    <CountdownTile value={countdown.seconds} label="Sec" />
                  </div>
                </div>

                {/* High-Converting Luxury Uiverse Animated CTA Button */}
                <button
                  type="button"
                  onClick={handleClaim}
                  className="uiverse-cta-btn w-full py-3.5 sm:py-4 px-6 sm:px-8 font-serif font-black text-sm sm:text-base md:text-lg tracking-wider uppercase group"
                >
                  <span className="relative z-10 tracking-wide font-black">
                    Claim Exclusive {parsed.discountLabel}
                  </span>
                  <div className="cta-arrow-badge ml-3 w-7.5 h-7.5 sm:w-8 sm:h-8 relative z-10">
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#062135] group-hover:fill-[#062135] transition-colors duration-300"
                      viewBox="0 0 16 19"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                      />
                    </svg>
                  </div>
                </button>

                {/* Social Proof & Reassurance Footer: 100% EMOJI-FREE */}
                <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] sm:text-xs text-slate-300/80 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Direct booking perk applied automatically • Instant confirmation</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
