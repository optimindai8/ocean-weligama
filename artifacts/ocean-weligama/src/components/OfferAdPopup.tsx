import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Clock, ArrowRight } from "lucide-react";

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

/* ───── floating particle component ───── */
const FloatingParticle = ({ delay, x, size }: { delay: number; x: number; size: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: `${x}%`,
      bottom: -10,
      background: "radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,165,0,0.3) 70%, transparent 100%)",
      filter: "blur(0.5px)",
    }}
    initial={{ y: 0, opacity: 0, scale: 0 }}
    animate={{
      y: [-10, -300 - Math.random() * 150],
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 0.8, 0],
      x: [0, (Math.random() - 0.5) * 80],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2,
      ease: "easeOut",
    }}
  />
);

const useCountdown = (isVisible: boolean, createdAt?: string, offerDays?: number) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isVisible || !createdAt || !offerDays) return;
    
    const end = new Date(createdAt);
    end.setDate(end.getDate() + offerDays);

    const tick = () => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isVisible, createdAt, offerDays]);

  return timeLeft;
};

/* ───── countdown digit ───── */
const CountdownDigit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <motion.div
      key={value}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <span className="text-xl sm:text-3xl font-black text-white tabular-nums tracking-tighter">
        {String(value).padStart(2, "0")}
      </span>
    </motion.div>
    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 mt-2">{label}</span>
  </div>
);

export function OfferAdPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);

  const { data: activeAd } = useQuery<OfferAd | null>({
    queryKey: ["public-offer-ad"],
    queryFn: async () => {
      const res = await fetch("/api/v1/offer-ads/active");
      if (!res.ok) throw new Error("API Error");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  const countdown = useCountdown(isVisible, activeAd?.createdAt, activeAd?.offerDays);

  useEffect(() => {
    if (!activeAd || !activeAd.isActive) return;

    const lastShownKey = `ow_ad_last_shown_${activeAd.id}`;
    let showTimer: ReturnType<typeof setTimeout> | null = null;

    const checkAndShow = () => {
      if (isVisible) return;

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
          setShowCloseButton(false);
          setTimeout(() => setShowCloseButton(true), 3000);
        }, 1500);
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
    setShowCloseButton(false);
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

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-auto"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.9) 100%)",
              backdropFilter: "blur(12px)",
            }}
            onClick={showCloseButton ? handleClose : undefined}
          />

          {/* Main Split Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row pointer-events-auto z-10 overflow-hidden rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 bg-[#0B3D5E]"
          >
            {/* ─── Close Button (appears after 3s) ─── */}
            <AnimatePresence>
              {showCloseButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-40 w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-black/40 transition-all duration-300 hover:rotate-90"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ─── Image Section (Left Split) ─── */}
            {hasImage && (
              <div className="relative w-full md:w-1/2 min-h-[35vh] md:min-h-[60vh] bg-[#051c2c] overflow-hidden flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/10 shrink-0">
                {/* Blurred background image for seamless edge blending */}
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-125 saturate-200" 
                  style={{ backgroundImage: `url(${activeAd.imageUrl})` }} 
                />
                
                {/* Floating gold particles over image */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <FloatingParticle key={i} delay={i * 0.4} x={5 + i * 8} size={3 + Math.random() * 6} />
                  ))}
                </div>

                {/* The Uncropped Perfect Image */}
                <motion.img
                  src={activeAd.imageUrl!}
                  alt={activeAd.title}
                  className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            )}

            {/* ─── Content Section (Right Split) ─── */}
            <div className={`relative flex flex-col justify-between overflow-y-auto ${hasImage ? "w-full md:w-1/2" : "w-full"} bg-gradient-to-br from-[#0B3D5E] to-[#062438] p-8 sm:p-12 md:p-16`}>
              
              {/* Top Details */}
              <div>
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-widest text-amber-900 uppercase"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      boxShadow: "0 4px 20px rgba(255,215,0,0.3)",
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Exclusive Offer</span>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1] font-serif"
                  style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                >
                  {activeAd.title}
                </motion.h2>

                {activeAd.description && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/80 text-lg sm:text-xl leading-relaxed max-w-xl"
                  >
                    {activeAd.description}
                  </motion.p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center sm:items-start mb-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold uppercase tracking-[0.15em] text-amber-400">
                      Offer Ends In
                    </span>
                  </motion.div>
                  <div className="flex items-center gap-3">
                    <CountdownDigit value={countdown.days} label="Days" />
                    <span className="text-2xl font-black text-white/30 -mt-6">:</span>
                    <CountdownDigit value={countdown.hours} label="Hrs" />
                    <span className="text-2xl font-black text-white/30 -mt-6">:</span>
                    <CountdownDigit value={countdown.minutes} label="Min" />
                    <span className="text-2xl font-black text-white/30 -mt-6">:</span>
                    <CountdownDigit value={countdown.seconds} label="Sec" />
                  </div>
                </div>

                <motion.button
                  onClick={handleClaim}
                  onMouseEnter={() => setIsHoveringCTA(true)}
                  onMouseLeave={() => setIsHoveringCTA(false)}
                  className="relative group mt-4 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all overflow-hidden"
                >
                  <span className="relative z-10 font-serif italic tracking-wide uppercase">Claim Offer</span>
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                  <motion.div 
                    className="absolute inset-0 bg-white/20 skew-x-12"
                    animate={{ x: ["-150%", "250%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 text-sm text-white/50 font-medium"
                >
                  🔥 <span className="text-amber-400/90 font-bold">Many guests</span> claimed this offer today
                </motion.p>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
