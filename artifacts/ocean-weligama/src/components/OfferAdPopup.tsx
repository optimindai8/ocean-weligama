import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type OfferAd = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  intervalMinutes: number;
};

export function OfferAdPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const { data: activeAd } = useQuery<OfferAd | null>({
    queryKey: ["public-offer-ad"],
    queryFn: async () => {
      const res = await fetch("/api/v1/offer-ads/active");
      if (!res.ok) throw new Error("API Error");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (!activeAd || !activeAd.isActive) return;

    const checkAndShow = () => {
      const lastShownKey = `ow_ad_last_shown_${activeAd.id}`;
      const lastShownStr = localStorage.getItem(lastShownKey);
      
      let shouldShow = true;
      if (lastShownStr) {
        const lastShownTime = new Date(lastShownStr).getTime();
        const now = new Date().getTime();
        const diffMinutes = (now - lastShownTime) / (1000 * 60);
        if (diffMinutes < activeAd.intervalMinutes) {
          shouldShow = false;
        }
      }

      if (shouldShow) {
        // Slight delay before showing to make it feel natural
        setTimeout(() => {
          setIsVisible(true);
          // Show close button after 3 seconds
          setTimeout(() => {
            setShowCloseButton(true);
          }, 3000);
        }, 1500);
      }
    };

    checkAndShow();
  }, [activeAd]);

  const handleClose = () => {
    if (!activeAd) return;
    setIsVisible(false);
    localStorage.setItem(`ow_ad_last_shown_${activeAd.id}`, new Date().toISOString());
  };

  const handleClaim = () => {
    // You could track analytics here or scroll to booking
    handleClose();
    // E.g., window.location.href = "/packages";
  };

  if (!activeAd) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={showCloseButton ? handleClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white overflow-hidden rounded-[2rem] shadow-2xl pointer-events-auto z-10 border border-white/20"
          >
            {/* Close Button (delayed) */}
            <AnimatePresence>
              {showCloseButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="relative">
              {activeAd.imageUrl ? (
                <div className="w-full h-64 sm:h-72 bg-muted relative">
                  <img
                    src={activeAd.imageUrl}
                    alt={activeAd.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
                        {activeAd.title}
                      </h2>
                      {activeAd.description && (
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-md">
                          {activeAd.description}
                        </p>
                      )}
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="p-8 sm:p-10 bg-gradient-to-br from-[#0B3D5E] to-[#4BBCCC] text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
                      {activeAd.title}
                    </h2>
                    {activeAd.description && (
                      <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                        {activeAd.description}
                      </p>
                    )}
                  </motion.div>
                </div>
              )}

              <div className="p-6 bg-white sm:p-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-100">
                <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest text-center sm:text-left">
                  Limited Time Offer
                </p>
                <Button
                  size="lg"
                  onClick={handleClaim}
                  className="w-full sm:w-auto rounded-full bg-[#0B3D5E] hover:bg-[#4BBCCC] text-white font-bold tracking-wide shadow-xl shadow-[#0B3D5E]/20 transition-all hover:scale-105 active:scale-95"
                >
                  Claim Offer Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
