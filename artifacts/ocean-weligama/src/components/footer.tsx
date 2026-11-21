import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { TransparentLogo } from "./transparent-logo";
import { MapPin, Phone, Mail, X, Copy, Check, ExternalLink } from "lucide-react";

function trackEmailInquiry() {
  try {
    if (typeof window !== "undefined" && (window as any).hotelTracker?.track) {
      (window as any).hotelTracker.track("email_click");
    }
    const sessionStr = typeof window !== "undefined" ? sessionStorage.getItem("hv_session") : null;
    let vid: string | undefined;
    let sid: string | undefined;
    if (sessionStr) {
      try {
        const s = JSON.parse(sessionStr);
        vid = s.vid;
        sid = s.id;
      } catch {}
    }
    if (!vid && typeof crypto !== "undefined" && crypto.randomUUID) {
      vid = crypto.randomUUID();
    }
    if (!sid && typeof crypto !== "undefined" && crypto.randomUUID) {
      sid = crypto.randomUUID();
    }
    if (vid && sid) {
      const payload = JSON.stringify({
        type: "custom",
        name: "email_click",
        visitorId: vid,
        sessionId: sid,
        path: typeof window !== "undefined" ? window.location.pathname : "/",
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/v1/collect", payload);
      } else {
        fetch("/api/v1/collect", {
          method: "POST",
          body: payload,
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          keepalive: true,
        }).catch(() => {});
      }
    }
  } catch {}
}

export function Footer() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailAddress = "pelanawhitehouse@gmail.com";
  const emailSubject = encodeURIComponent("Inquiry - Ocean Air Weligama Hotel & Villa");
  const emailBody = encodeURIComponent(
    "Hello Ocean Air Weligama Team,\n\nI would like to inquire about booking, rooms, and experiences at your sanctuary.\n\nThank you!"
  );
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${emailSubject}&body=${emailBody}`;

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(emailAddress);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {}
  };
  return (
    <footer className="relative text-white selection:bg-[#FBBF24] selection:text-[#0B3D5E] z-20">
      {/* Main Footer Body with Rounded Top Corners & Atmospheric Background Image */}
      <div className="relative bg-[#061d2d] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] lg:rounded-t-[4.5rem] border-t border-white/20 border-x border-white/10 shadow-[0_-20px_50px_rgba(6,29,45,0.22)] pt-14 sm:pt-16 lg:pt-20 pb-8 overflow-hidden text-white">
        {/* Top Golden Hairline Highlight Accent along the rounded rim */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FBBF24]/70 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-36 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none z-10" />

        {/* User-Provided Background Image Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/footer-bg.jpg"
            alt="Ocean Air Coastal Landscape"
            className="w-full h-full object-cover object-center opacity-55 scale-105"
          />
          {/* Oceanic Dark Tint Overlays to preserve text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061d2d]/88 via-[#07263d]/72 to-[#061d2d]/88" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061d2d] via-transparent to-[#061d2d]/60 opacity-75" />
        </div>

        {/* Ambient Subtle Golden & Deep Ocean Glows */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[300px] bg-[#FBBF24]/06 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#0B3D5E]/20 rounded-full blur-[130px] pointer-events-none" />

        {/* Faint Ocean Air Logo Watermark on the Right */}
        <div className="absolute right-4 sm:right-8 lg:right-16 bottom-8 sm:bottom-12 z-0 pointer-events-none select-none opacity-20">
          <TransparentLogo
            src="/images/logo.jpg"
            className="w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 object-contain brightness-0 invert drop-shadow-[0_8px_30px_rgba(251,191,36,0.3)] rotate-6"
          />
        </div>

        {/* Main 4-Column Grid Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
            {/* Column 1: Brand & Contact Info */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <Link href="/" className="inline-block group cursor-pointer">
                <div className="flex items-center gap-3.5">
                  {/* Circular Nautical Logo Emblem matching screenshot */}
                  <div className="relative w-13 h-13 rounded-full bg-[#08283f] border-2 border-[#FBBF24] p-1 flex items-center justify-center shadow-[0_4px_16px_rgba(251,191,36,0.35)] group-hover:scale-105 transition-transform duration-300">
                    <TransparentLogo 
                      src="/images/logo.jpg" 
                      className="w-9 h-9 object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-serif font-black tracking-wider text-white group-hover:text-[#FBBF24] transition-colors">
                      OCEAN AIR
                    </span>
                    <span className="text-[10px] font-black tracking-[0.25em] text-[#FBBF24] uppercase">
                      LIVE • SURF • EXPLORE
                    </span>
                  </div>
                </div>
              </Link>

              <p className="text-white/75 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
                Your boutique coastal sanctuary in Weligama Bay. Experience barefoot luxury, pristine surf, and authentic island warmth just 100 steps from the ocean.
              </p>

              {/* Contact Details with Gold Icons */}
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/85 pt-1">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Ocean+Air+Weligama+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-[#FBBF24] transition-colors group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#FBBF24] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>Pelana, Weligama Bay, Sri Lanka</span>
                </a>

                <a
                  href="tel:+94765791763"
                  className="flex items-center gap-2.5 hover:text-[#FBBF24] transition-colors group cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#FBBF24] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>+94 76 579 1763</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(true)}
                  className="flex items-center gap-2.5 hover:text-[#FBBF24] transition-colors group cursor-pointer text-left focus:outline-none"
                >
                  <Mail className="w-4 h-4 text-[#FBBF24] shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{emailAddress}</span>
                </button>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="lg:col-span-2 sm:pl-4">
              <h4 className="text-base font-bold text-white tracking-wide mb-5">Navigation</h4>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-white/75">
                <li><Link href="/" className="hover:text-[#FBBF24] transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-[#FBBF24] transition-colors">About Us</Link></li>
                <li><Link href="/rooms" className="hover:text-[#FBBF24] transition-colors">Rooms &amp; Suites</Link></li>
                <li><Link href="/packages" className="hover:text-[#FBBF24] transition-colors">Surf &amp; Packages</Link></li>
                <li><Link href="/blog" className="hover:text-[#FBBF24] transition-colors">Island Journal</Link></li>
                <li><Link href="/contact" className="hover:text-[#FBBF24] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="lg:col-span-3 sm:pl-4">
              <h4 className="text-base font-bold text-white tracking-wide mb-5">Quick Links</h4>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-white/75">
                <li><Link href="/faq" className="hover:text-[#FBBF24] transition-colors">FAQs</Link></li>
                <li><Link href="/book" className="hover:text-[#FBBF24] transition-colors">Booking</Link></li>
                <li><Link href="/gallery" className="hover:text-[#FBBF24] transition-colors">Photo Gallery</Link></li>
                <li><Link href="/cancellation-policy" className="hover:text-[#FBBF24] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cancellation-policy" className="hover:text-[#FBBF24] transition-colors">Terms &amp; Conditions</Link></li>
              </ul>
            </div>

            {/* Column 4: Our Services */}
            <div className="lg:col-span-3 sm:pl-4 relative z-10">
              <h4 className="text-base font-bold text-white tracking-wide mb-5">Our Services</h4>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-white/75">
                <li><Link href="/packages" className="hover:text-[#FBBF24] transition-colors">Surf Lessons &amp; Coaching</Link></li>
                <li><Link href="/packages" className="hover:text-[#FBBF24] transition-colors">Ocean &amp; Whale Safari</Link></li>
                <li><Link href="/packages" className="hover:text-[#FBBF24] transition-colors">Private Yoga &amp; Wellness</Link></li>
                <li><Link href="/packages" className="hover:text-[#FBBF24] transition-colors">Scooter &amp; Board Rental</Link></li>
                <li><Link href="/book" className="hover:text-[#FBBF24] transition-colors">Airport Transfers</Link></li>
                <li><Link href="/contact" className="hover:text-[#FBBF24] transition-colors">Weligama Bay Tours</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Social Media Icons on Left, Copyright on Right */}
          <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 sm:pr-20 lg:pr-24 pb-8 sm:pb-0">
            {/* 3D Isometric Social Media Dock (Left Side) */}
            <div className="iso-card">
              <ul>
                {/* Instagram */}
                <li className="iso-pro iso-instagram">
                  <span></span>
                  <span></span>
                  <span></span>
                  <a
                    href="https://www.instagram.com/oceanairweligama?igsh=MWlkN2F6c2h5dGRxdA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <svg
                      viewBox="0 0 448 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="svg"
                    >
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                  <div className="text">Instagram</div>
                </li>

                {/* Facebook */}
                <li className="iso-pro iso-facebook">
                  <span></span>
                  <span></span>
                  <span></span>
                  <a
                    href="https://www.facebook.com/profile.php?id=61583921572390"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <svg
                      viewBox="0 0 320 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="svg"
                    >
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </a>
                  <div className="text">Facebook</div>
                </li>

                {/* TikTok */}
                <li className="iso-pro iso-tiktok">
                  <span></span>
                  <span></span>
                  <span></span>
                  <a
                    href="https://www.tiktok.com/@oceanairweligama?_r=1&_t=ZS-96GvKo3MoMi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <svg
                      viewBox="0 0 448 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="svg"
                    >
                      <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z" />
                    </svg>
                  </a>
                  <div className="text">TikTok</div>
                </li>

                {/* Direct Phone / Call */}
                <li className="iso-pro iso-phone">
                  <span></span>
                  <span></span>
                  <span></span>
                  <a
                    href="tel:+94765791763"
                    aria-label="Direct Phone Call"
                  >
                    <svg
                      viewBox="0 0 512 512"
                      xmlns="http://www.w3.org/2000/svg"
                      className="svg"
                    >
                      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                    </svg>
                  </a>
                  <div className="text">Call Us</div>
                </li>
              </ul>
            </div>

            {/* Copyright Text (Right Side) */}
            <p className="text-white/60 text-xs font-normal text-center sm:text-right">
              © {new Date().getFullYear()} Ocean Air Weligama • All Rights Reserved
            </p>
          </div>
        </div>
      </div>

      {/* Email Concierge Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0B1B2B]/60 backdrop-blur-[5px]"
            onClick={() => setIsEmailModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[460px] rounded-[30px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(11,61,94,0.3)] p-6 sm:p-7 overflow-hidden text-left"
            >
              {/* Ambient Top Glow */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#FBBF24]/15 blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close email options"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#D97706] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] block">
                    Direct Concierge
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#0B3D5E] dark:text-white leading-tight">
                    Send an Email
                  </h3>
                </div>
              </div>

              {/* Recipient Display Pill with Copy Button */}
              <div className="flex items-center justify-between gap-2 p-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 mb-5">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Recipient Address
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-[#0B3D5E] dark:text-white truncate">
                    {emailAddress}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B3D5E] dark:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Gmail Action */}
              <div className="space-y-3">
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEmailInquiry();
                    setIsEmailModalOpen(false);
                  }}
                  className="flex items-center justify-between p-4 px-4.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-slate-800 dark:to-slate-800/80 border border-amber-300/80 dark:border-amber-500/40 hover:border-amber-400 transition-all group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs text-red-500 font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#0B3D5E] dark:text-white flex items-center gap-2">
                        Open in Gmail
                        <span className="text-[10px] font-bold bg-[#FBBF24]/20 text-[#D97706] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Opens compose with concierge recipient pre-filled
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
