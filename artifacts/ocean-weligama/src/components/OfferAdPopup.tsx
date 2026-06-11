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

/* ───── countdown timer hook ───── */
const useCountdown = (isVisible: boolean) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    if (!isVisible) return;
    // Use a pseudo-countdown that resets daily
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tick = () => {
      const now = new Date();
      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) return;
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
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
  const countdown = useCountdown(isVisible);

  const { data: activeAd } = useQuery<OfferAd | null>({
    queryKey: ["public-offer-ad"],
    queryFn: async () => {
      const res = await fetch("/api/v1/offer-ads/active");
      if (!res.ok) throw new Error("API Error");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

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
            className="relative w-full max-w-2xl pointer-events-auto z-10 overflow-hidden rounded-[2rem]"
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
              <div className="relative w-full h-72 sm:h-96 overflow-hidden">
                <motion.img
                  src={activeAd.imageUrl!}
                  alt={activeAd.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8, ease: "easeOut" }}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E] via-[#0B3D5E]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B3D5E]/30 to-transparent" />

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <FloatingParticle key={i} delay={i * 0.5} x={10 + i * 12} size={4 + Math.random() * 6} />
                  ))}
                </div>

                {/* Badge */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute top-5 left-5 sm:top-6 sm:left-6"
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

                {/* Text on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <motion.h2
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight leading-[1.1]"
                    style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
                  >
                    {activeAd.title}
                  </motion.h2>
                  {activeAd.description && (
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/85 text-base sm:text-lg leading-relaxed max-w-lg"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
                    >
                      {activeAd.description}
                    </motion.p>
                  )}
                </div>
              </div>
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
                <div className="flex items-center gap-2 sm:gap-3">
                  <CountdownDigit value={countdown.hours} label="Hrs" />
                  <span className="text-2xl font-bold text-white/40 -mt-5">:</span>
                  <CountdownDigit value={countdown.minutes} label="Min" />
                  <span className="text-2xl font-bold text-white/40 -mt-5">:</span>
                  <CountdownDigit value={countdown.seconds} label="Sec" />
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={handleClaim}
                onMouseEnter={() => setIsHoveringCTA(true)}
                onMouseLeave={() => setIsHoveringCTA(false)}
                className="relative w-full py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl tracking-wide overflow-hidden cursor-pointer border-0 outline-none"
                style={{
                  background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
                  color: "#1a1a00",
                  boxShadow: isHoveringCTA
                    ? "0 0 40px rgba(255,215,0,0.5), 0 8px 30px rgba(255,165,0,0.4)"
                    : "0 0 20px rgba(255,215,0,0.25), 0 4px 15px rgba(255,165,0,0.3)",
                  transition: "box-shadow 0.3s ease",
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
                />

                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ border: "2px solid rgba(255,215,0,0.5)" }}
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Claim This Offer Now</span>
                  <motion.span
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.span>
                </span>
              </motion.button>

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
