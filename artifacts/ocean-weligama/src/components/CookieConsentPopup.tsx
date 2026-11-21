import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function CookieConsentPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check URL parameter to force open for preview/testing
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get("cookie_card") === "true" || window.location.hash === "#cookie-card";

    if (forceShow) {
      setIsOpen(true);
      return undefined;
    }

    // Check if the user has already made a decision in localStorage
    const consent = localStorage.getItem("ocean_air_cookie_consent");
    if (consent === "accepted") {
      if (typeof window !== "undefined" && (window as any).hotelTracker) {
        (window as any).hotelTracker.consent(true);
      }
    } else if (consent === "rejected" || consent === "dismissed") {
      if (typeof window !== "undefined" && (window as any).hotelTracker) {
        (window as any).hotelTracker.consent(false);
      }
    } else {
      // Pop up smoothly when newly visiting the website (800ms delay for natural entrance)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  // Expose global triggers for testing and previewing
  useEffect(() => {
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener("open-cookie-card", handleTrigger);
    (window as any).openCookieCard = () => setIsOpen(true);
    (window as any).resetCookieCard = () => {
      localStorage.removeItem("ocean_air_cookie_consent");
      setIsOpen(true);
    };
    return () => {
      window.removeEventListener("open-cookie-card", handleTrigger);
      delete (window as any).openCookieCard;
      delete (window as any).resetCookieCard;
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ocean_air_cookie_consent", "accepted");
    if (typeof window !== "undefined" && (window as any).hotelTracker) {
      (window as any).hotelTracker.consent(true);
      (window as any).hotelTracker.track("cookie_consent_accepted");
    }
    setIsOpen(false);
  };

  const handleReject = () => {
    localStorage.setItem("ocean_air_cookie_consent", "rejected");
    if (typeof window !== "undefined" && (window as any).hotelTracker) {
      (window as any).hotelTracker.consent(false);
      (window as any).hotelTracker.track("cookie_consent_rejected");
    }
    setIsOpen(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("ocean_air_cookie_consent", "dismissed");
    if (typeof window !== "undefined" && (window as any).hotelTracker) {
      (window as any).hotelTracker.consent(false);
      (window as any).hotelTracker.track("cookie_consent_rejected");
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="cookie-consent-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6 bg-[#0B1B2B]/25 backdrop-blur-[3px]"
          onClick={handleDismiss}
        >
          {/* Card Container - Clean Modern Floating Card matching mockup */}
          <motion.div
            data-testid="cookie-consent-card"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16, transition: { duration: 0.18, ease: "easeOut" } }}
            transition={{ type: "spring", stiffness: 300, damping: 27 }}
            className="relative w-full max-w-[380px] rounded-[32px] overflow-hidden px-7 pt-7 pb-8 text-center select-none bg-white dark:bg-[#151D2A] border border-slate-100 dark:border-slate-800 shadow-[0_24px_55px_-10px_rgba(15,23,42,0.18),0_1px_3px_rgba(0,0,0,0.06)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (X) */}
            <button
              data-testid="cookie-close-btn"
              onClick={handleDismiss}
              aria-label="Close cookie notice"
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#9FA8B7] hover:text-[#1E2433] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-150 cursor-pointer z-20"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Laptop & Cookies Illustration */}
            <div className="relative w-full flex items-center justify-center pt-2 pb-2">
              <div className="relative w-[280px] h-[170px]">
                {/* SVG Base Laptop */}
                <svg
                  viewBox="0 0 280 170"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full overflow-visible pointer-events-none"
                >
                  {/* Laptop Screen Frame Outer */}
                  <rect
                    x="42"
                    y="16"
                    width="196"
                    height="120"
                    rx="12"
                    fill="#FFFFFF"
                    stroke="#1E2433"
                    strokeWidth="2.5"
                  />

                  {/* Screen Interior (Warm Peach/Cream tone from mockup) */}
                  <rect
                    x="46"
                    y="20"
                    width="188"
                    height="112"
                    rx="8"
                    fill="#FCE5C2"
                  />

                  {/* Browser Window Action Dots (top right: ...) */}
                  <circle cx="218" cy="26" r="1.75" fill="#1E2433" />
                  <circle cx="224" cy="26" r="1.75" fill="#1E2433" />
                  <circle cx="230" cy="26" r="1.75" fill="#1E2433" />

                  {/* Laptop Bottom Base Line */}
                  <path
                    d="M 22 136 L 258 136 C 263 136 266 139 264 142 L 261 144 C 259 146 256 147 252 147 L 28 147 C 24 147 21 146 19 144 L 16 142 C 14 139 17 136 22 136 Z"
                    fill="#1E2433"
                  />
                </svg>

                {/* ───── Cookies Floating Layout Matching Mockup ───── */}

                {/* 1. Large Hero Cookie in Center */}
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{ left: "140px", top: "82px", transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    animate={{ y: [-1.5, 1.5, -1.5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-[92px] h-[92px] rounded-full bg-[#EEA673] shadow-[0_4px_16px_rgba(30,36,51,0.12)] border border-[#F5B98D]/40"
                  >
                    {/* Chocolate Chips */}
                    <span className="absolute top-4 left-7 w-3.5 h-3.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-10 left-4 w-4 h-3.5 rounded-full bg-[#3D2114] -rotate-12" />
                    <span className="absolute top-7 right-5 w-4 h-3.5 rounded-full bg-[#3D2114] rotate-12" />
                    <span className="absolute bottom-5 left-7 w-4 h-4 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-6 right-6 w-3.5 h-3.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-12 left-11 w-2.5 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-5 left-12 w-2.5 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-8 right-11 w-2 h-2 rounded-full bg-[#3D2114]" />
                  </motion.div>
                </div>

                {/* 2. Overlapping Left Cookie (half inside, half outside laptop frame) */}
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{ left: "42px", top: "60px", transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    animate={{ y: [1.5, -1.5, 1.5], rotate: [-1, 1, -1] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="relative w-[46px] h-[46px] rounded-full bg-[#EEA673] shadow-[0_4px_12px_rgba(30,36,51,0.14)] border border-[#F5B98D]/40"
                  >
                    <span className="absolute top-2 left-3 w-2.5 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-5 left-2 w-2.5 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-2.5 right-3 w-2.5 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-4 right-2.5 w-2 h-2 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-4 left-4 w-1.5 h-1.5 rounded-full bg-[#3D2114]" />
                  </motion.div>
                </div>

                {/* 3. Small Cookie Inside Screen (Bottom Left) */}
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{ left: "76px", top: "100px", transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    className="relative w-[32px] h-[32px] rounded-full bg-[#EEA673] shadow-[0_2px_8px_rgba(30,36,51,0.1)]"
                  >
                    <span className="absolute top-2 left-2.5 w-2 h-2 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-2.5 left-2 w-2 h-2 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-3.5 right-2 w-1.5 h-1.5 rounded-full bg-[#3D2114]" />
                  </motion.div>
                </div>

                {/* 4. Small Cookie Inside Screen (Top Right) */}
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{ left: "202px", top: "52px", transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    animate={{ y: [1, -1, 1] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="relative w-[32px] h-[32px] rounded-full bg-[#EEA673] shadow-[0_2px_8px_rgba(30,36,51,0.1)]"
                  >
                    <span className="absolute top-2 left-2.5 w-2 h-2 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-2 right-2.5 w-1.5 h-1.5 rounded-full bg-[#3D2114]" />
                  </motion.div>
                </div>

                {/* 5. Overlapping Right Cookie (half inside, half outside laptop frame) */}
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{ left: "238px", top: "96px", transform: "translate(-50%, -50%)" }}
                >
                  <motion.div
                    animate={{ y: [-1.5, 1.5, -1.5], rotate: [1, -1, 1] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="relative w-[52px] h-[52px] rounded-full bg-[#EEA673] shadow-[0_4px_12px_rgba(30,36,51,0.14)] border border-[#F5B98D]/40"
                  >
                    <span className="absolute top-2.5 left-4 w-3 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-5 left-6 w-3 h-3 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute bottom-4 right-3.5 w-2.5 h-2.5 rounded-full bg-[#3D2114]" />
                    <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#3D2114]" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Title: Bold Sans-Serif Modern Text */}
            <h3
              data-testid="cookie-title"
              className="font-sans text-[26px] sm:text-[28px] font-extrabold text-[#1E2433] dark:text-white tracking-tight mt-2 mb-2"
            >
              We use cookies
            </h3>

            {/* Description Text */}
            <p
              data-testid="cookie-description"
              className="text-[13px] sm:text-[13.5px] leading-relaxed text-[#8E9AAB] dark:text-slate-300 max-w-[310px] mx-auto mb-7 font-normal"
            >
              We use cookies to tailor your coastal stay experience, keep your room selections safe, and ensure smooth navigation across Weligama Bay.
            </p>

            {/* Action Buttons: Accept & Reject Side by Side */}
            <div className="flex items-center gap-3.5 w-full justify-center">
              {/* Accept Button: Pill Shape, Warm Orange Gradient */}
              <button
                data-testid="cookie-accept-btn"
                onClick={handleAccept}
                className="flex-1 py-3 px-5 rounded-full font-bold text-[15px] text-white bg-gradient-to-r from-[#FBA763] via-[#F6895F] to-[#F16E60] shadow-[0_4px_16px_rgba(246,137,95,0.35)] hover:shadow-[0_6px_22px_rgba(246,137,95,0.45)] hover:brightness-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Accept
              </button>

              {/* Reject Button: Pill Shape, White/Transparent with Dark Outline */}
              <button
                data-testid="cookie-reject-btn"
                onClick={handleReject}
                className="flex-1 py-3 px-5 rounded-full font-bold text-[15px] text-[#1E2433] dark:text-white border-2 border-[#1E2433] dark:border-white/80 hover:bg-[#1E2433]/5 dark:hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                Reject
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
