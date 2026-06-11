import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles, Clock, ArrowRight } from "lucide-react";

type OfferAd = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  intervalMinutes: number;
  offerDays: number;
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
      y: [-10, -250 - Math.random() * 150],
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 0.8, 0],
      x: [0, (Math.random() - 0.5) * 60],
    }}
    transition={{
      duration: 3 + Math.random() * 2,
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
  }, [isVisible]);

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
      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </motion.div>
    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/60 mt-2">{label}</span>
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
      // Don't re-trigger if already visible
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

    // Check immediately on mount
    checkAndShow();

    // Then poll every 15 seconds to seamlessly re-trigger when the interval elapses
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
    // Navigate to packages or booking
    // window.location.href = "/packages";
  }, [handleClose]);

  if (!activeAd) return null;

  const hasImage = !!activeAd.imageUrl;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-auto"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)",
              backdropFilter: "blur(8px)",
            }}
            onClick={showCloseButton ? handleClose : undefined}
          />

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 260, mass: 0.8 }}
            className="relative w-full max-w-4xl pointer-events-auto z-10 overflow-hidden rounded-[2rem] flex flex-col"
            style={{
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 25px 80px rgba(0,0,0,0.5), 0 0 120px rgba(75,188,204,0.15)",
            }}
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
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-10 h-10 flex items-center justify-center rounded-full text-white/80 hover:text-white transition-all duration-300 hover:rotate-90"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ─── Image Section ─── */}
            {hasImage ? (
              <>
                <div className="relative w-full h-80 sm:h-[36rem] overflow-hidden bg-black/90">
                  {/* Blurred background image for full coverage */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110" 
                    style={{ backgroundImage: `url(${activeAd.imageUrl})` }} 
                  />
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(8)].map((_, i) => (
                      <FloatingParticle key={i} delay={i * 0.5} x={10 + i * 12} size={4 + Math.random() * 6} />
                    ))}
                  </div>

                  {/* Full Uncropped Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                    <motion.img
                      src={activeAd.imageUrl!}
                      alt={activeAd.title}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/20"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>

                  {/* Badge */}
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute top-5 left-5 sm:top-8 sm:left-8 z-20"
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-amber-900"
                      style={{
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                        boxShadow: "0 4px 20px rgba(255,215,0,0.4)",
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>EXCLUSIVE OFFER</span>
                    </div>
                  </motion.div>
                </div>

                {/* ─── Text Section Below Image ─── */}
                <div className="relative z-10 px-6 pt-8 pb-4 sm:px-12 bg-gradient-to-b from-[#0B3D5E] to-[#0a3350] text-center">
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-[1.1]"
                    style={{ textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                  >
                    {activeAd.title}
                  </motion.h2>
                  {activeAd.description && (
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/85 text-base sm:text-xl leading-relaxed max-w-3xl mx-auto"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
                    >
                      {activeAd.description}
                    </motion.p>
                  )}
                </div>
              </>
            ) : (
              /* ─── No Image: Gradient Hero ─── */
              <div
                className="relative w-full overflow-hidden p-8 sm:p-12"
                style={{
                  background: "linear-gradient(135deg, #0B3D5E 0%, #1a5276 30%, #4BBCCC 100%)",
                  minHeight: 300,
                }}
              >
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <FloatingParticle key={i} delay={i * 0.4} x={5 + i * 10} size={3 + Math.random() * 5} />
                  ))}
                </div>

                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 bg-white" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 bg-white" />

                {/* Badge */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="relative z-10 mb-6"
                >
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-amber-900"
                    style={{
                      background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      boxShadow: "0 4px 20px rgba(255,215,0,0.4)",
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>EXCLUSIVE OFFER</span>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                  className="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-[1.1]"
                >
                  {activeAd.title}
                </motion.h2>
                {activeAd.description && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 text-white/85 text-base sm:text-lg leading-relaxed max-w-lg"
                  >
                    {activeAd.description}
                  </motion.p>
                )}
              </div>
            )}

            {/* ─── Bottom Action Section ─── */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="relative px-6 py-6 sm:px-10 sm:py-8"
              style={{
                background: "linear-gradient(180deg, #0B3D5E 0%, #0a3350 100%)",
              }}
            >
              {/* Countdown timer - urgency trigger */}
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 mr-2 sm:mr-4"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
                    Ends in
                  </span>
                </motion.div>
                <div className="flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100">
                  <CountdownDigit value={countdown.days} label="Days" />
                  <span className="text-2xl font-bold text-white/40 -mt-5">:</span>
                  <CountdownDigit value={countdown.hours} label="Hrs" />
                  <span className="text-2xl font-bold text-white/40 -mt-5">:</span>
                  <CountdownDigit value={countdown.minutes} label="Min" />
                  <span className="text-2xl font-bold text-white/40 -mt-5">:</span>
                  <CountdownDigit value={countdown.seconds} label="Sec" />
                </div>
              </div>

              {/* Text Quote CTA instead of Button */}
              <motion.div
                onClick={handleClaim}
                onMouseEnter={() => setIsHoveringCTA(true)}
                onMouseLeave={() => setIsHoveringCTA(false)}
                className="relative cursor-pointer text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="inline-block relative">
                  <motion.div 
                    animate={{ rotate: [0, -3, 3, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-4 rounded-full bg-amber-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <p className="relative z-10 text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] uppercase tracking-wider font-serif italic mb-1" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    "Contact Now & Claim The Offer"
                  </p>
                  <div className="flex items-center justify-center text-amber-400 mt-2 gap-2 font-bold text-sm tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                    <span>Click to connect</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              {/* Social proof / urgency text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-4 text-xs sm:text-sm text-white/50 font-medium"
              >
                🔥 <span className="text-amber-400/80 font-bold">237 people</span> claimed this offer today
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
