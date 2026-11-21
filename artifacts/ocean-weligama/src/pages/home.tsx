import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";
import { Footer } from "@/components/footer";
import { Testimonials } from "@/components/testimonials";
import { useListServices, useListFeaturedRooms, useListBlogs, getListBlogsQueryKey, useListGallery, useGetSetting } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Users, BedDouble, ArrowRight, ChevronDown, Package, Image as ImageIcon, BookOpen, Check, Palmtree, Compass, Waves, MapPin, Star, HelpCircle, ShieldCheck, UtensilsCrossed, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { PackageComparisonTable } from "@/components/PackageComparisonTable";
import { MatrixPricingTable } from "@/components/MatrixPricingTable";
import { StayInStyleSection } from "@/components/stay-in-style-section";
import { AnimatedHoloCard } from "@/components/AnimatedHoloCard";
import { SEO, StructuredData } from "@/seo";
import { cleanExcerpt } from "@/components/StoryContentRenderer";
import { normalizeAssetUrl } from "@/lib/assetUrl";

const ROOM_CATEGORIES = [
  { value: "", label: "All Spaces" },
  { value: "solo", label: "Solo Traveler Packages" },
  { value: "couples", label: "Two Person Packages" },
  { value: "family", label: "Family Accommodation" },
];

interface ReassuranceItem {
  icon: React.ReactNode;
  stat: string;
  isCounter?: boolean;
  to?: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  title: string;
  desc: string;
}

function CountUp({
  to,
  from = 0,
  duration = 1500,
  delay = 50,
  decimals = 0,
  suffix = "",
  className = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      if (el) {
        el.textContent = (decimals > 0 ? to.toFixed(decimals) : to.toString()) + suffix;
      }
      return;
    }

    let animationFrameId: number;
    let hasAnimatedThisVisit = false;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const startCounting = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      hasAnimatedThisVisit = true;

      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < delay) {
          animationFrameId = requestAnimationFrame(step);
          return;
        }

        const progress = Math.min((elapsed - delay) / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = from + (to - from) * easedProgress;

        if (el) {
          el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString()) + suffix;
        }

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          isAnimatingRef.current = false;
          setDone(true);
          if (el) {
            el.textContent = (decimals > 0 ? to.toFixed(decimals) : to.toString()) + suffix;
          }
        }
      };

      animationFrameId = requestAnimationFrame(step);
    };

    const resetCount = () => {
      if (isAnimatingRef.current) {
        cancelAnimationFrame(animationFrameId);
        isAnimatingRef.current = false;
      }
      hasAnimatedThisVisit = false;
      setDone(false);
      if (el) {
        el.textContent = (decimals > 0 ? from.toFixed(decimals) : from.toString()) + suffix;
      }
    };

    const checkVisibility = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
      const scrollY = window.scrollY ?? window.pageYOffset ?? document.documentElement.scrollTop ?? 0;

      // Active view zone: card is comfortably visible on screen
      const isInActiveView = rect.top < viewportHeight * 0.82 && rect.bottom > 50;

      // Crucial: Only trigger when user has actually initiated scroll down towards this section!
      // On page refresh at top of page (scrollY < 25), do NOT count up yet.
      const hasScrolledDown = scrollY > 25;

      if (isInActiveView && hasScrolledDown) {
        if (!hasAnimatedThisVisit && !isAnimatingRef.current) {
          startCounting();
        }
      } else if (rect.top > viewportHeight || rect.bottom < -40) {
        // Scrolled completely out of view: reset so it animates again when scrolled to
        if (hasAnimatedThisVisit || isAnimatingRef.current) {
          resetCount();
        }
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });

    // Initial check (in case user loaded or refreshed page while already scrolled down)
    checkVisibility();

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [to, from, duration, delay, decimals, suffix]);

  return (
    <span ref={ref} className={className}>
      {done
        ? (decimals > 0 ? to.toFixed(decimals) : to.toString()) + suffix
        : (decimals > 0 ? from.toFixed(decimals) : from.toString()) + suffix}
    </span>
  );
}

function HeroCountUp({
  to,
  from = 0,
  duration = 1500,
  delay = 550,
  decimals = 0,
  suffix = "",
}: {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  suffix?: string;
}) {
  const cleanTo = Number.isFinite(to) && to > 0 ? to : (decimals > 0 ? 4.9 : 1000);
  const cleanSuffix = String(suffix || "").replace(/^\/+/, "").trim();
  const [val, setVal] = useState<number>(from);
  const isAnimatingRef = useRef(false);
  const hasEverAnimatedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(cleanTo);
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;
    const effectiveDelay = hasEverAnimatedRef.current ? 80 : delay;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < effectiveDelay) {
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      const progress = Math.min((elapsed - effectiveDelay) / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = from + (cleanTo - from) * easedProgress;

      setVal(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setVal(cleanTo);
        isAnimatingRef.current = false;
        hasEverAnimatedRef.current = true;
      }
    };

    const startCounting = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      startTime = null;
      animationFrameId = requestAnimationFrame(step);
    };

    startCounting();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      isAnimatingRef.current = false;
    };
  }, [cleanTo, from, duration, delay, decimals]);

  const formatted = decimals > 0
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString();

  return (
    <span>
      {formatted}{cleanSuffix}
    </span>
  );
}

const heroRatingVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -75,
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
      delay: 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroGuestsVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 75,
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
      delay: 0.16,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroSideSocialVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -60,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.95,
      delay: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroHeadlineVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -85,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      delay: 0.24,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroTaglineVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 85,
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
      delay: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroCtaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.96,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      delay: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const reassuranceContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 70,
    scale: 0.96,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const reassuranceCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
    rotateX: 10,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const experienceBadgeVariants: Variants = {
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

const experienceWordsContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.16,
    },
  },
};

const experienceWordItemVariants: Variants = {
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
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const experienceDescVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const accommodationsBadgeVariants: Variants = {
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

const sanctuaryWordsContainerVariants: Variants = {
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

const sanctuaryWordItemVariants: Variants = {
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

const accommodationsDescVariants: Variants = {
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

const blogBadgeVariants: Variants = {
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

const blogWordsContainerVariants: Variants = {
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

const blogWordItemVariants: Variants = {
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

const blogDescVariants: Variants = {
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

const faqBadgeVariants: Variants = {
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

const faqWordsContainerVariants: Variants = {
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

const faqWordItemVariants: Variants = {
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

const faqDescVariants: Variants = {
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

const galleryBadgeVariants: Variants = {
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

const galleryWordsContainerVariants: Variants = {
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

const galleryWordItemVariants: Variants = {
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

const galleryDescVariants: Variants = {
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

const curateBadgeVariants: Variants = {
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

const curateWordsContainerVariants: Variants = {
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

const curateWordItemVariants: Variants = {
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

const curateDescVariants: Variants = {
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

/* ─── Experience Card Motion Variants (Butter-Smooth Hardware Accelerated) ─ */
const cardContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.05 + idx * 0.06,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const cardEmojiVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 + idx * 0.06,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const cardTitleVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  visible: (idx: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.12 + idx * 0.06,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const cardDescVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  visible: (idx: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.15 + idx * 0.06,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const cardExploreTextVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.18 + idx * 0.06,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

const cardArrowVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 28,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  visible: (idx: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.20 + idx * 0.06,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export default function Home() {
  const { formatPrice } = useLanguage();
  const { data: services } = useListServices();
  const { data: rooms } = useListFeaturedRooms();
  const { data: blogs } = useListBlogs(undefined, {
    query: {
      queryKey: getListBlogsQueryKey(),
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  });
  const { data: galleryItems } = useListGallery();
  const { data: homeSetting, refetch: refetchHomeSetting } = useGetSetting("home_settings", {
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    } as any,
  });

  useEffect(() => {
    const handleSync = () => {
      refetchHomeSetting();
    };
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, [refetchHomeSetting]);
  const heroConfig = (homeSetting?.value as any)?.hero;
  const reassuranceConfig = (homeSetting?.value as any)?.reassurance;
  const experiencesConfig = (homeSetting?.value as any)?.experiences;
  const whyChooseUsConfig = (homeSetting?.value as any)?.whyChooseUs;

  const rawExperienceTitle = experiencesConfig?.title || "Surf • Stay • Taste • Explore";
  const experienceTitleParts = rawExperienceTitle.includes("•")
    ? rawExperienceTitle.split("•").map((s: string) => s.trim()).filter(Boolean)
    : rawExperienceTitle.split(" ").map((s: string) => s.trim()).filter(Boolean);

  const rawRatingScore = heroConfig?.ratingScore;
  const parsedRatingScore = typeof rawRatingScore === "number"
    ? rawRatingScore
    : parseFloat(String(rawRatingScore || "").replace(/[^0-9.]/g, ""));
  const heroRatingScore = Number.isFinite(parsedRatingScore) && parsedRatingScore > 0 ? parsedRatingScore : 4.9;

  const rawRatingLabel = heroConfig?.ratingLabel;
  const heroRatingLabel = (rawRatingLabel
    ? String(rawRatingLabel).replace(/^\/+/, "").trim()
    : "") || "Rating";

  const rawGuestsCount = heroConfig?.guestsCount;
  const parsedGuestsCount = typeof rawGuestsCount === "number"
    ? rawGuestsCount
    : parseInt(String(rawGuestsCount || "").replace(/[^\d]/g, ""), 10);
  const heroGuestsCount = Number.isFinite(parsedGuestsCount) && parsedGuestsCount > 0 ? parsedGuestsCount : 1000;

  const rawGuestsSuffix = heroConfig?.guestsSuffix;
  const heroGuestsSuffix = (rawGuestsSuffix
    ? String(rawGuestsSuffix).replace(/^\/+/, "").trim()
    : "") || "+";

  const rawGuestsLabel = heroConfig?.guestsLabel;
  const heroGuestsLabel = (rawGuestsLabel
    ? String(rawGuestsLabel).replace(/^\/+/, "").trim()
    : "") || "Happy Guests";
  const heroTaglineHighlight = heroConfig?.taglineHighlight ?? "100 steps from the ocean.";
  const heroTaglineText = heroConfig?.taglineText ?? "Barefoot beach living meets Sri Lankan hospitality.";
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const toggleCard = (id: string) => setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  const [tappedCard, setTappedCard] = useState<number | null>(null);
  const handleCardTap = (idx: number) => {
    setTappedCard(idx);
    setTimeout(() => setTappedCard(null), 600);
  };

  return (
    <div className="flex-1">
      <SEO canonicalPath="/" />
      <StructuredData />
      
      {/* Hidden Crawler Landmarks for Googlebot & Search Indexers */}
      <h1 className="sr-only">
        ocean air weligama — Ocean Air Weligama #1 Beachfront Boutique Luxury Hotel &amp; Villa in Weligama Bay Sri Lanka
      </h1>
      <p className="sr-only">
        Ocean Air Weligama (ocean air weligama sri lanka / welgama hotel) is the premier beachfront boutique hotel &amp; luxury villa in Weligama Bay, Sri Lanka. Located 100 steps from the ocean with ocean view suites, certified surf lessons, whale watching tours, scooter rentals, and 24/7 concierge care. Book direct on oceanairweligama.com, oceanairsrilanka.lk, or oceanairsrilanka.com.
      </p>

      {/* Hero Section */}
      <section
        className="relative flex flex-col overflow-hidden"
        style={{ minHeight: "max(100svh, 800px)" }}
      >
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <video
            key="hero-video"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            poster="/images/hero-video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
          >
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
        </div>

        {/* Row 1: Navbar spacer — always clears the floating navbar */}
        <div className="h-24 md:h-28 shrink-0" />

        {/* Floating 3D Holograms Around the Video */}
        <div className="absolute top-24 sm:top-32 left-2 sm:left-8 md:left-16 xl:left-32 z-20 opacity-40 sm:opacity-80 hover:opacity-100 transition-opacity">
          <AnimatedHoloCard icon={Palmtree} className="scale-50 sm:scale-75 md:scale-90" />
        </div>
        <div className="absolute top-1/3 sm:top-1/2 right-0 sm:right-4 md:right-12 xl:right-24 -translate-y-1/2 z-20 opacity-40 sm:opacity-80 hover:opacity-100 transition-opacity">
          <AnimatedHoloCard icon={Compass} className="scale-50 sm:scale-75 md:scale-100" />
        </div>
        <div className="absolute bottom-32 sm:bottom-32 left-4 sm:left-12 md:left-24 xl:left-40 z-20 opacity-40 sm:opacity-80 hover:opacity-100 transition-opacity">
          <AnimatedHoloCard icon={Waves} className="scale-50 sm:scale-75 md:scale-90" />
        </div>

        {/* Left Side Vertical Social Media Bar (Smooth Descent from Up to Down) */}
        <div className="absolute left-2 sm:left-5 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <motion.div
            variants={heroSideSocialVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="pointer-events-auto flex flex-col items-center gap-2.5 sm:gap-4 md:gap-5"
          >
            {/* Vertical Accent Line (Glowing top line visible on ALL devices) */}
            <div className="block w-[1.5px] sm:w-[2px] h-8 sm:h-12 md:h-20 bg-gradient-to-b from-transparent via-white/80 to-white/30 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]" />

            {/* Social Links */}
            <div className="flex flex-col gap-2 sm:gap-3.5">
              {/* Facebook */}
              <div className="relative group">
                <a
                  href="https://www.facebook.com/profile.php?id=61583921572390"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-7.5 h-7.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/40 sm:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-white hover:bg-white/25 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-300 transform group-hover:scale-110 shadow-lg"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <span className="hidden sm:inline-block absolute left-14 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl group-hover:translate-x-1">
                  Facebook
                </span>
              </div>

              {/* Instagram */}
              <div className="relative group">
                <a
                  href="https://www.instagram.com/oceanairweligama?igsh=MWlkN2F6c2h5dGRxdA%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-7.5 h-7.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/40 sm:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-white hover:bg-white/25 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-300 transform group-hover:scale-110 shadow-lg"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <span className="hidden sm:inline-block absolute left-14 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl group-hover:translate-x-1">
                  Instagram
                </span>
              </div>

              {/* TikTok */}
              <div className="relative group">
                <a
                  href="https://www.tiktok.com/@oceanairweligama?_r=1&_t=ZS-96GvKo3MoMi"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-7.5 h-7.5 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/40 sm:bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-white hover:bg-white/25 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-300 transform group-hover:scale-110 shadow-lg"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                </a>
                <span className="hidden sm:inline-block absolute left-14 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl group-hover:translate-x-1">
                  TikTok
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 2: Main content — takes all remaining space, centered */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-10">
            {/* Rating Card - Comes from left side */}
            <motion.div
              variants={heroRatingVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="bg-white/10 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 group hover:bg-white/20 transition-all cursor-default"
            >
              <div className="flex text-amber-400 group-hover:scale-110 transition-transform">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-white text-sm font-black tracking-widest uppercase">
                <HeroCountUp to={heroRatingScore} decimals={1} duration={1400} delay={350} /> {heroRatingLabel}
              </span>
            </motion.div>

            {/* Happy Guests Card - Comes from right side */}
            <motion.div
              variants={heroGuestsVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="bg-white/10 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 group hover:bg-white/20 transition-all cursor-default"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white text-sm font-black tracking-widest uppercase">
                <HeroCountUp to={heroGuestsCount} suffix={heroGuestsSuffix} duration={1600} delay={450} /> {heroGuestsLabel}
              </span>
            </motion.div>
          </div>

          {/* Headline - Comes from left side */}
          <motion.div
            variants={heroHeadlineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
              Your Ocean Home <br /> 
              <span className="text-amber-400 hover:text-amber-300 transition-all duration-300 cursor-default italic font-normal drop-shadow-lg hover:drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                in Weligama
              </span>
            </h1>
          </motion.div>

          {/* Tagline - Comes from right side */}
          <motion.div
            variants={heroTaglineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="relative inline-block mb-10"
          >
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-amber-400 rounded-full transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] cursor-default" />
            <p className="text-base md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed pl-4 italic">
              <span className="text-white">{heroTaglineHighlight}</span>{" "}
              <br className="md:hidden" />
              {heroTaglineText}
            </p>
          </motion.div>

          {/* CTA Button - Comes down to up */}
          <motion.div
            variants={heroCtaVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <Link href="/book?new=1">
              <button 
                type="button"
                className="animated-availability-btn px-8 h-14 sm:px-12 sm:h-18 md:px-14 md:h-20"
              >
                <span className="btn-content">
                  <span className="btn-text">Check Availability</span>
                  <Calendar className="btn-icon w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform duration-300 drop-shadow-sm" />
                </span>
                <span className="btn-circle" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Row 3: Scroll Indicator — its own dedicated row, never overlaps */}
        <div className="relative z-10 flex justify-center py-8 shrink-0">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 opacity-50"
          >
            <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* High-End Reassurance Panel (Trust Bar) */}
      <section className="relative -mt-8 md:-mt-20 z-20 container mx-auto px-4">
        {/* Outer glow */}
        <div 
          className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] blur-2xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(251,191,36,0.3) 0%, rgba(11,61,94,0.15) 60%, transparent 80%)' }}
        />

        <motion.div
          variants={reassuranceContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/60 shadow-[0_20px_50px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.18)_inset] backdrop-blur-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(254,251,243,0.80) 50%, rgba(245,249,252,0.88) 100%)' }}
        >
          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 w-[40%] pointer-events-none z-0"
            style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)', skewX: '-15deg' }}
            animate={{ x: ['-160%', '350%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
          />

          {/* Top accent line */}
          <div 
            className="absolute top-0 left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.7), transparent)' }}
          />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-2.5 sm:p-4">
            {([
              {
                icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E]" strokeWidth={2.2} />,
                stat: reassuranceConfig?.card1?.stat ?? 'Secure',
                isCounter: false,
                title: reassuranceConfig?.card1?.title ?? 'Booking',
                desc: reassuranceConfig?.card1?.desc ?? 'Instant Confirmation',
              },
              {
                icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E]" strokeWidth={2.2} />,
                stat: reassuranceConfig?.card2?.stat ?? '100',
                isCounter: !isNaN(Number(reassuranceConfig?.card2?.stat ?? 100)),
                to: Number(reassuranceConfig?.card2?.stat ?? 100) || 100,
                duration: 1500,
                delay: 60,
                title: reassuranceConfig?.card2?.title ?? 'Steps to Beach',
                desc: reassuranceConfig?.card2?.desc ?? 'Prime Surf Location',
              },
              {
                icon: <Star className="star-icon w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E] fill-[#FBBF24] stroke-[#0B3D5E]" strokeWidth={2.4} />,
                stat: `${reassuranceConfig?.card3?.stat ?? '4.9'}${reassuranceConfig?.card3?.suffix ?? '★'}`,
                isCounter: !isNaN(parseFloat(reassuranceConfig?.card3?.stat ?? 4.9)),
                to: parseFloat(reassuranceConfig?.card3?.stat ?? 4.9) || 4.9,
                decimals: (reassuranceConfig?.card3?.stat ?? '4.9').toString().includes('.') ? 1 : 0,
                suffix: reassuranceConfig?.card3?.suffix ?? '★',
                duration: 1500,
                delay: 120,
                title: reassuranceConfig?.card3?.title ?? 'Guest Rating',
                desc: reassuranceConfig?.card3?.desc ?? 'Top-Rated Hospitality',
              },
              {
                icon: <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E]" strokeWidth={2.2} />,
                stat: reassuranceConfig?.card4?.stat ?? 'Expert',
                isCounter: false,
                title: reassuranceConfig?.card4?.title ?? 'Surf Hub',
                desc: reassuranceConfig?.card4?.desc ?? 'ISA Certified Team',
              },
            ] as ReassuranceItem[]).map((item, idx) => (
              <motion.div
                key={item.title}
                variants={reassuranceCardVariants}
                onClick={() => handleCardTap(idx)}
                className="relative w-full"
              >
                <div className="tilt-card-wrapper">
                  <div className="hover-zone bt-1" />
                  <div className="hover-zone bt-2" />
                  <div className="hover-zone bt-3" />
                  <div className="hover-zone bt-4" />
                  <div className="hover-zone bt-5" />
                  <div className="hover-zone bt-6" />

                  <div className={`tilt-card-inner group ${tappedCard === idx ? 'is-tapped' : ''}`}>
                    {/* Ambient subtle golden glow on hover */}
                    <div className="absolute inset-0 rounded-[1.3rem] bg-gradient-to-br from-[#FBBF24]/12 via-transparent to-[#0B3D5E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Icon container */}
                    <div className="icon-box relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-1.5 sm:mb-2 bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#0B3D5E] shadow-sm transition-all duration-300">
                      {item.icon}
                    </div>

                    {/* Stat - 3D Pop Up with Scroll Count-Up */}
                    {item.isCounter && item.to !== undefined ? (
                      <CountUp
                        to={item.to}
                        decimals={item.decimals}
                        suffix={item.suffix}
                        duration={item.duration}
                        delay={item.delay}
                        className="popup-word text-lg sm:text-xl md:text-2xl font-black mb-0.5 bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent leading-none select-none"
                      />
                    ) : (
                      <span className="popup-word text-lg sm:text-xl md:text-2xl font-black mb-0.5 bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent leading-none select-none">
                        {item.stat}
                      </span>
                    )}

                    {/* Title */}
                    <h4 className="font-serif font-bold text-[#0B3D5E] text-xs sm:text-sm tracking-tight leading-tight mb-0.5 select-none">
                      {item.title}
                    </h4>

                    {/* Desc */}
                    <p className="text-[#D97706] text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.18em] font-black select-none">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom accent line */}
          <div 
            className="absolute bottom-0 left-8 right-8 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(11,61,94,0.1), transparent)' }}
          />
        </motion.div>
      </section>

      {/* Immersive Experience Section (Surf, Stay, Taste, Explore) */}
      <section id="services" className="py-14 sm:py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-[#F0F6FA]">
        {/* Soft background ambient lighting */}
        <div 
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.14) 0%, rgba(11,61,94,0.06) 50%, transparent 70%)' }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Main Frosted Glass Transparent Box Container */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] border border-white/70 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.18)_inset] backdrop-blur-2xl p-6 sm:p-10 md:p-12 lg:p-14"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(254,251,243,0.78) 45%, rgba(245,249,252,0.88) 100%)',
            }}
          >
            {/* Ambient shimmer sweep animation */}
            <motion.div
              className="absolute inset-0 w-[45%] pointer-events-none z-0"
              style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)', skewX: '-15deg' }}
              animate={{ x: ['-160%', '350%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
            />

            {/* Top golden accent line */}
            <div
              className="absolute top-0 left-12 right-12 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.75), transparent)' }}
            />

            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 relative z-10">
              {/* Badge - Comes from right side */}
              <motion.div 
                variants={experienceBadgeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/35 mb-3.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                <span className="text-[#D97706] font-bold tracking-[0.25em] uppercase text-[10.5px]">
                  {experiencesConfig?.badge || "The Ocean Air Experience"}
                </span>
              </motion.div>

              {/* Title - Words come one by one from left side */}
              <motion.h2 
                variants={experienceWordsContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] tracking-tight mb-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
              >
                {experienceTitleParts.map((word: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center gap-x-2">
                    {idx > 0 && (
                      <motion.span variants={experienceWordItemVariants} className="inline-block text-[#FBBF24] font-light">
                        •
                      </motion.span>
                    )}
                    <motion.span variants={experienceWordItemVariants} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </motion.h2>

              {/* Refined golden accent line */}
              <motion.div 
                variants={experienceDescVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="w-20 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mb-3.5" 
              />

              {/* Description - Comes from bottom to up */}
              <motion.p 
                variants={experienceDescVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-slate-600 text-sm sm:text-base font-normal max-w-lg mx-auto leading-relaxed"
              >
                {experiencesConfig?.description || "Experience barefoot luxury, pristine Indian Ocean waves, authentic flavors, and tailored island adventures."}
              </motion.p>
            </div>

            {/* 4 Staggered Experience Cards (Up - Down - Up - Down Wave Rhythm with Scroll Animation) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-6 relative z-10 pt-2 pb-6 sm:py-6 lg:py-8">
              {[
                { 
                  title: experiencesConfig?.cards?.[0]?.title ?? "Surf", 
                  tagline: experiencesConfig?.cards?.[0]?.tagline ?? "Ride the waves", 
                  description: experiencesConfig?.cards?.[0]?.description ?? "Experience the thrill of Weligama's world-class breaks with ISA certified instructors.", 
                  img: normalizeAssetUrl(experiencesConfig?.cards?.[0]?.img, "/images/service-surf.png"),
                  href: experiencesConfig?.cards?.[0]?.href || "/packages",
                  num: experiencesConfig?.cards?.[0]?.num || "01",
                  icon: <Waves className="w-3.5 h-3.5 text-[#FBBF24]" />,
                  staggerClass: "lg:-translate-y-5 sm:-translate-y-2",
                  fromY: -90,
                  delay: 0.1
                },
                { 
                  title: experiencesConfig?.cards?.[1]?.title ?? "Stay", 
                  tagline: experiencesConfig?.cards?.[1]?.tagline ?? "Chill by the ocean", 
                  description: experiencesConfig?.cards?.[1]?.description ?? "Barefoot coastal luxury meets heartfelt Sri Lankan warmth 100 steps from the sand.", 
                  img: normalizeAssetUrl(experiencesConfig?.cards?.[1]?.img, "/images/service-stay.png"),
                  href: experiencesConfig?.cards?.[1]?.href || "/rooms",
                  num: experiencesConfig?.cards?.[1]?.num || "02",
                  icon: <BedDouble className="w-3.5 h-3.5 text-[#FBBF24]" />,
                  staggerClass: "lg:translate-y-5 sm:translate-y-2",
                  fromY: 90,
                  delay: 0.26
                },
                { 
                  title: experiencesConfig?.cards?.[2]?.title ?? "Taste", 
                  tagline: experiencesConfig?.cards?.[2]?.tagline ?? "Taste the island", 
                  description: experiencesConfig?.cards?.[2]?.description ?? "Authentic coastal spices, freshly caught seafood, and wholesome tropical breakfast.", 
                  img: normalizeAssetUrl(experiencesConfig?.cards?.[2]?.img, "/images/service-taste.png"),
                  href: experiencesConfig?.cards?.[2]?.href || "/about",
                  num: experiencesConfig?.cards?.[2]?.num || "03",
                  icon: <UtensilsCrossed className="w-3.5 h-3.5 text-[#FBBF24]" />,
                  staggerClass: "lg:-translate-y-5 sm:-translate-y-2",
                  fromY: -90,
                  delay: 0.42
                },
                { 
                  title: experiencesConfig?.cards?.[3]?.title ?? "Explore", 
                  tagline: experiencesConfig?.cards?.[3]?.tagline ?? "Local traditions", 
                  description: experiencesConfig?.cards?.[3]?.description ?? "From tranquil secret coves and stilt fishermen to unforgettable blue whale watching.", 
                  img: normalizeAssetUrl(experiencesConfig?.cards?.[3]?.img, "/images/service-explore.jpg"),
                  href: experiencesConfig?.cards?.[3]?.href || "/packages",
                  num: experiencesConfig?.cards?.[3]?.num || "04",
                  icon: <Compass className="w-3.5 h-3.5 text-[#FBBF24]" />,
                  staggerClass: "lg:translate-y-5 sm:translate-y-2",
                  fromY: 90,
                  delay: 0.58
                }
              ].map((item, idx) => (
                <div
                  key={item.num || idx}
                  className={`relative ${item.staggerClass} transition-transform duration-500`}
                >
                  <motion.div
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        y: item.fromY, 
                        scale: 0.95,
                        transition: { duration: 0.2 }
                      },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { 
                          delay: item.delay, 
                          duration: 0.85, 
                          ease: [0.16, 1, 0.3, 1] 
                        }
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="w-full h-full"
                  >
                    <Link href={item.href}>
                      <div className="group relative h-[380px] sm:h-[420px] md:h-[440px] lg:h-[450px] rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_12px_32px_rgba(11,61,94,0.08)] hover:shadow-[0_24px_50px_rgba(251,191,36,0.22)] border border-white/60 hover:border-[#FBBF24]/70 transition-all duration-500 bg-slate-900">
                        {/* Image with smooth zoom */}
                        <img 
                          src={item.img} 
                          alt={item.title} 
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108" 
                        />
                        
                        {/* Multi-layered cinematic gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-75 group-hover:opacity-85 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent opacity-60 pointer-events-none" />
                        <div className="absolute inset-0 bg-[#FBBF24]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Top floating pill badge */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FBBF24] text-[10px] font-bold tracking-wider uppercase shadow-sm">
                            {item.icon}
                            <span>{item.num}</span>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-[#FBBF24] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_#FBBF24]" />
                        </div>

                        {/* Bottom Card Content */}
                        <div className="absolute inset-0 p-5 sm:p-6 md:p-7 flex flex-col justify-end z-10">
                          {/* Tagline */}
                          <span className="text-[#FBBF24] text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase mb-1 block drop-shadow-sm">
                            {item.tagline}
                          </span>

                          {/* Title & Arrow Row */}
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight group-hover:text-[#FBBF24] transition-colors duration-300 drop-shadow-sm">
                              {item.title}
                            </h3>
                            
                            {/* Interactive circle button */}
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/35 flex items-center justify-center text-white group-hover:bg-[#FBBF24] group-hover:text-[#0B3D5E] group-hover:border-[#FBBF24] group-hover:scale-110 shadow-md transition-all duration-300 shrink-0">
                              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-white/80 text-xs sm:text-[13px] leading-relaxed line-clamp-2 drop-shadow-sm">
                            {item.description}
                          </p>
                        </div>

                        {/* Subtle bottom golden highlight line on hover */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-12 right-12 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(11,61,94,0.1), transparent)' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Rooms ("Your Private Sanctuary") */}
      <section 
        id="rooms"
        className="py-14 sm:py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#F0F6FA] via-white to-[#F8FAFC]"
      >
        {/* Soft background ambient lighting */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, rgba(11,61,94,0.06) 50%, transparent 70%)" }}
        />

        <div className="max-w-[1380px] w-full mx-auto px-3 sm:px-6 relative z-10">
          {/* Main Frosted Glass Transparent Box Container */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] border border-white/70 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.18)_inset] backdrop-blur-2xl p-5 sm:p-8 md:p-10 lg:p-12"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(254,251,243,0.78) 45%, rgba(245,249,252,0.88) 100%)",
            }}
          >
            {/* Ambient shimmer sweep animation */}
            <motion.div
              className="absolute inset-0 w-[45%] pointer-events-none z-0"
              style={{ background: "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)", skewX: "-15deg" }}
              animate={{ x: ["-160%", "350%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            />

            {/* Top golden accent line */}
            <div
              className="absolute top-0 left-12 right-12 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.75), transparent)" }}
            />

            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 relative z-10">
              {/* Pill Badge - Comes from right side */}
              <motion.div 
                variants={accommodationsBadgeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/35 mb-3.5 shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                <span className="text-[#D97706] font-bold tracking-[0.25em] uppercase text-[10.5px]">
                  Boutique Accommodations
                </span>
              </motion.div>

              {/* Title - Words come one by one from left side */}
              <motion.h2 
                variants={sanctuaryWordsContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] tracking-tight mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
              >
                <motion.span variants={sanctuaryWordItemVariants} className="inline-block">
                  Your
                </motion.span>
                <motion.span variants={sanctuaryWordItemVariants} className="inline-block">
                  Private
                </motion.span>
                <motion.span variants={sanctuaryWordItemVariants} className="inline-block">
                  Sanctuary
                </motion.span>
              </motion.h2>

              {/* Golden underline accent - Comes from right side */}
              <motion.div 
                variants={accommodationsDescVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="w-20 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mb-3.5" 
              />

              {/* Subtitle Description - Comes from right side */}
              <motion.p 
                variants={accommodationsDescVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-slate-600 text-sm sm:text-base font-normal max-w-lg mx-auto leading-relaxed"
              >
                Thoughtfully curated accommodations tailored for serene coastal relaxation, private balconies, and ocean breezes.
              </motion.p>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 relative z-10">
              {Array.isArray(rooms) && rooms.length > 0 ? rooms.map((room: any, idx) => {
                const coverImg = (room.gallery && room.gallery.length > 0) ? room.gallery[0] : room.heroImageUrl;
                const effectivePrice = room.adjustedPrice || room.basePricePerNight;
                const hasDiscount = room.adjustedPrice && parseFloat(room.adjustedPrice) < parseFloat(room.originalPrice || room.basePricePerNight);

                const mod = idx % 3;
                const cardDelay = 0.1 + mod * 0.16;
                const initialX = mod === 0 ? -90 : mod === 2 ? 90 : 0;
                const initialY = mod === 1 ? 90 : 0;

                return (
                  <motion.div
                    key={room.id}
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        x: initialX, 
                        y: initialY, 
                        scale: 0.95, 
                        transition: { duration: 0.2 } 
                      },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        y: 0, 
                        scale: 1, 
                        transition: { 
                          delay: cardDelay, 
                          duration: 0.9, 
                          ease: [0.16, 1, 0.3, 1] 
                        } 
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    className="group relative h-full flex flex-col"
                  >
                    <Link href={"/rooms/" + room.slug}>
                      <div className="relative h-[460px] sm:h-[490px] md:h-[510px] rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden cursor-pointer shadow-[0_12px_35px_rgba(11,61,94,0.08)] hover:shadow-[0_24px_55px_rgba(251,191,36,0.22)] border border-white/60 hover:border-[#FBBF24]/70 transition-all duration-500 bg-slate-900 flex flex-col justify-between">
                        {/* Photo with smooth zoom */}
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={room.name}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                          />
                        ) : (
                          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B3D5E] to-slate-900">
                            <BedDouble className="w-16 h-16 text-white/30" />
                          </div>
                        )}

                        {/* Cinematic Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent opacity-65 pointer-events-none" />
                        <div className="absolute inset-0 bg-[#FBBF24]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Top Clean Bar */}
                        <div className="relative z-10 p-4 sm:p-5 flex items-center justify-end pointer-events-none" />

                        {/* Bottom Floating Frosted Glass Card Panel - Staged Reveal Animation */}
                        <motion.div
                          variants={{
                            hidden: { 
                              opacity: 0, 
                              y: 32, 
                              scale: 0.96, 
                              transition: { duration: 0.2 } 
                            },
                            visible: { 
                              opacity: 1, 
                              y: 0, 
                              scale: 1, 
                              transition: { 
                                delay: cardDelay + 0.35, 
                                duration: 0.7, 
                                ease: [0.16, 1, 0.3, 1] 
                              } 
                            }
                          }}
                          initial="hidden"
                          whileInView="visible"
                          className="relative z-10 m-3 sm:m-4 p-4 sm:p-5 rounded-[1.4rem] sm:rounded-[1.6rem] bg-black/55 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)] group-hover:border-[#FBBF24]/50 group-hover:bg-black/65 transition-colors duration-300"
                        >
                          {/* Micro Capacity Tag */}
                          <div className="flex items-center gap-2.5 text-white/85 text-[10.5px] font-bold uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#FBBF24]" />
                              {room.maxGuests} Guests
                            </span>
                            <span className="text-white/30">•</span>
                            <span className="flex items-center gap-1.5">
                              <BedDouble className="w-3.5 h-3.5 text-[#FBBF24]" />
                              {room.bedrooms} {room.bedrooms === 1 ? "Bed" : "Beds"}
                            </span>
                          </div>

                          {/* FULL Room Name without truncation - Refined Proportional Font Size */}
                          <h3 className="text-base sm:text-lg md:text-[18px] font-serif font-bold text-white leading-snug mb-3 group-hover:text-[#FBBF24] transition-colors duration-300 drop-shadow-sm">
                            {room.name}
                          </h3>

                          {/* Price & Action Button Row */}
                          <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-white/15">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FBBF24]">
                                Starting from
                              </span>
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                  {formatPrice(effectivePrice)}
                                </span>
                                <span className="text-[11px] text-white/70 font-medium">/ night</span>
                                {hasDiscount && (
                                  <span className="text-[11px] line-through text-white/45 ml-1">
                                    {formatPrice(room.originalPrice || room.basePricePerNight)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FBBF24] text-[#0B3D5E] font-bold text-[11px] shadow-[0_6px_16px_rgba(251,191,36,0.35)] group-hover:bg-white group-hover:text-[#0B3D5E] group-hover:scale-105 transition-all duration-300 shrink-0">
                              <span>Explore</span>
                              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </motion.div>

                        {/* Subtle bottom golden highlight line on hover */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </Link>
                  </motion.div>
                );
              }) : (
                <p className="text-center col-span-full py-12 text-muted-foreground">No rooms found.</p>
              )}
            </div>

            {/* Bottom Section Link (Comes down to up) */}
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: 45,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut",
                  },
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              style={{ willChange: "transform, opacity" }}
              className="mt-10 sm:mt-12 text-center relative z-10"
            >
              <Link href="/rooms">
                <Button 
                  size="lg" 
                  className="bg-[#0B3D5E] hover:bg-[#07273C] text-white border border-white/20 px-8 py-6 rounded-full font-bold text-sm tracking-wide shadow-lg hover:shadow-[0_10px_25px_rgba(251,191,36,0.25)] transition-all hover:scale-105 group"
                >
                  <span>View All Accommodations</span>
                  <ArrowRight className="w-4 h-4 ml-2 text-[#FBBF24] transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-12 right-12 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(11,61,94,0.1), transparent)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section
        className="relative overflow-hidden w-full py-12 sm:py-16 md:py-20 border-t border-[#0B3D5E]/5"
        style={{ background: 'linear-gradient(180deg, #EDF3F8 0%, #F5F9FC 45%, #FFFFFF 100%)' }}
      >
        {/* Soft, luxury ambient coastal and warm logo lighting */}
        <div className="absolute top-12 right-1/4 w-[500px] h-[500px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 left-1/4 w-[600px] h-[600px] bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />
        <PackageComparisonTable />
      </section>

      {/* Matrix Pricing Section — component handles its own section wrapper */}
      <MatrixPricingTable />

      <StayInStyleSection />

      {/* Experience Weligama Section */}
      {services && services.filter(s => s.type === "optional" && !s.category?.toLowerCase().includes("package") && s.isFeatured).length > 0 && (
        <section
          className="py-12 sm:py-16 md:py-20 relative overflow-hidden border-t border-[#0B3D5E]/5"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 45%, #F4F8FA 100%)' }}
        >
          {/* Warm golden and coastal ambient lighting matching hotel logo */}
          <div className="absolute top-0 left-1/3 w-[550px] h-[550px] bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-10 w-[420px] h-[420px] bg-[#FBBF24]/8 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10 max-w-[1440px]">
            {/* ── Public Showcase View: Transparent Psychologically Attractive Box ── */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] border border-white/80 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.22)_inset] backdrop-blur-2xl p-6 sm:p-10 md:p-12 lg:p-14"
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

              {/* ── Section Header ── */}
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 relative z-10 space-y-3">
                {/* Badge pill - Comes from right side */}
                <motion.div
                  variants={curateBadgeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#0B3D5E] text-[11px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-sm mb-1"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                  <Compass className="w-3.5 h-3.5 text-[#0B3D5E]" /> Experience Weligama
                </motion.div>

                {/* Heading - Words come one by one from left side */}
                <motion.h2
                  variants={curateWordsContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="text-3xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
                >
                  <motion.span variants={curateWordItemVariants} className="inline-block">
                    Curate
                  </motion.span>
                  <motion.span variants={curateWordItemVariants} className="inline-block">
                    Your
                  </motion.span>
                  <motion.span
                    variants={curateWordItemVariants}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                  >
                    Perfect
                  </motion.span>
                  <motion.span
                    variants={curateWordItemVariants}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                  >
                    Stay
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
                  variants={curateDescVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="text-slate-600 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed px-4"
                >
                  Everything you need for the perfect coastal escape — handcrafted excursions, surf sessions, and mindful wellness.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                {services.filter(s => s.type === "optional" && !s.category?.toLowerCase().includes("package") && s.isFeatured).map((exp: any, idx: number) => (
                  <motion.div
                    key={exp.id}
                    custom={idx}
                    variants={cardContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                    viewport={{ once: false, amount: 0.15 }}
                    style={{ willChange: "transform, opacity" }}
                    className="group bg-white/85 backdrop-blur-xl rounded-[2rem] border border-white/85 p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-[#FBBF24]/70 shadow-[0_12px_35px_rgba(11,61,94,0.05),0_0_0_1px_rgba(251,191,36,0.12)] hover:shadow-[0_22px_50px_rgba(251,191,36,0.22),0_10px_25px_rgba(11,61,94,0.06)]"
                  >
                    {/* Golden top highlight and radial glow on hover */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FBBF24]/14 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div>
                      {/* Golden Emblem Icon - Comes from up to down smoothly */}
                      <motion.div
                        custom={idx}
                        variants={cardEmojiVariants}
                        whileHover={{ scale: 1.1, rotate: 3, transition: { duration: 0.25, ease: "easeOut" } }}
                        style={{ willChange: "transform, opacity" }}
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 border border-[#FDE68A] flex items-center justify-center mb-6 shadow-sm group-hover:shadow-[0_8px_20px_rgba(251,191,36,0.35)] transition-[box-shadow,border-color,background-color] duration-300 relative z-10"
                      >
                        <span className="text-2xl drop-shadow-sm select-none">{exp.iconEmoji || '🌊'}</span>
                      </motion.div>

                      {/* Title - Comes from right side */}
                      <motion.h3
                        custom={idx}
                        variants={cardTitleVariants}
                        style={{ willChange: "transform, opacity" }}
                        className="text-xl font-serif font-black text-[#0B3D5E] mb-2.5 group-hover:text-[#D97706] transition-colors duration-300 relative z-10 tracking-tight"
                      >
                        {exp.name}
                      </motion.h3>

                      {/* Description - Comes from left side */}
                      <motion.p
                        custom={idx}
                        variants={cardDescVariants}
                        style={{ willChange: "transform, opacity" }}
                        className="text-sm text-slate-600 font-normal leading-relaxed mb-6 line-clamp-2 relative z-10"
                      >
                        {exp.shortDesc || exp.description || 'Experience the best of Weligama.'}
                      </motion.p>
                    </div>

                    {/* Explore Action with Golden Arrow Pill */}
                    <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between mt-auto relative z-10">
                      <Link
                        href={`/packages/${exp.slug}`}
                        className="w-full flex items-center justify-between group/link py-0.5"
                      >
                        {/* Explore Experience Text - Comes from bottom to top */}
                        <motion.span
                          custom={idx}
                          variants={cardExploreTextVariants}
                          style={{ willChange: "transform, opacity" }}
                          className="text-xs font-black uppercase tracking-[0.15em] text-[#0B3D5E] group-hover/link:text-[#D97706] transition-colors inline-block"
                        >
                          Explore Experience
                        </motion.span>

                        {/* Arrow Button - Comes from right side smoothly */}
                        <motion.div
                          custom={idx}
                          variants={cardArrowVariants}
                          whileHover={{ scale: 1.1, transition: { duration: 0.2, ease: "easeOut" } }}
                          style={{ willChange: "transform, opacity" }}
                          className="w-8 h-8 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#0B3D5E] group-hover/link:bg-[#FBBF24] group-hover/link:shadow-[0_4px_12px_rgba(251,191,36,0.4)] transition-[background-color,border-color,box-shadow,color] duration-300"
                        >
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform duration-200" />
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* View all link (Comes down to up) */}
              <motion.div
                variants={{
                  hidden: { 
                    opacity: 0, 
                    y: 45, 
                    transition: { duration: 0.25, ease: "easeOut" } 
                  },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      delay: 0.2, 
                      duration: 0.8, 
                      ease: [0.16, 1, 0.3, 1] 
                    } 
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                style={{ willChange: "transform, opacity" }}
                className="text-center mt-12 sm:mt-14 relative z-10"
              >
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-[#FBBF24] text-[#0B3D5E] shadow-md hover:shadow-[0_10px_25px_rgba(251,191,36,0.4)] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300 hover:scale-105 group/all"
                >
                  <span>View All Experiences</span>
                  <ArrowRight className="w-4 h-4 group-hover/all:translate-x-1 transition-transform duration-300" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      <section
        className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#F0F6FA] via-white to-[#F8FAFC]"
      >
        {/* Soft background ambient lighting */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, rgba(11,61,94,0.06) 50%, transparent 70%)" }}
        />

        <div className="max-w-[1380px] w-full mx-auto px-3 sm:px-6 relative z-10">
          {/* Main Frosted Glass Transparent Box Container */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 35, transition: { duration: 0.2 } },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="rounded-[2.5rem] sm:rounded-[3.2rem] p-6 sm:p-10 md:p-12 lg:p-14 border border-white/85 shadow-[0_20px_60px_-15px_rgba(11,61,94,0.08)] backdrop-blur-md relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,251,255,0.68) 50%, rgba(255,252,242,0.78) 100%)",
              willChange: "transform, opacity"
            }}
          >
            {/* Subtle top ambient shimmer */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
              <div className="lg:col-span-7 flex flex-col justify-center">
                {/* Heading & Eyebrow block (from left side) */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -80, transition: { duration: 0.2 } },
                    visible: { 
                      opacity: 1, 
                      x: 0, 
                      transition: { delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  style={{ willChange: "transform, opacity" }}
                  className="mb-7"
                >
                  {/* Eyebrow badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 shadow-sm mb-4 w-fit">
                    <Palmtree className="w-3.5 h-3.5 text-[#0B3D5E]" />
                    <span>{whyChooseUsConfig?.badge || "Why Choose Us"}</span>
                  </div>

                  {/* Main Heading */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] mb-4 leading-tight tracking-tight">
                    {whyChooseUsConfig?.headingLead || "More Than Just A"}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)] italic">
                      {whyChooseUsConfig?.headingHighlight || "Stay"}
                    </span>
                  </h2>

                  {/* Description */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                    {whyChooseUsConfig?.description || "We believe your vacation should be effortless. From the moment you arrive, every detail is handled with warmth and precision, so you can focus entirely on unwinding by the ocean."}
                  </p>
                </motion.div>

                {/* Value Propositions / Micro-cards (One by one from left side) */}
                <div className="space-y-3 sm:space-y-3.5">
                  {[
                    {
                      icon: MapPin,
                      title: whyChooseUsConfig?.features?.[0]?.title ?? "Unbeatable Location",
                      desc: whyChooseUsConfig?.features?.[0]?.desc ?? "Literally 100 steps from Weligama’s gentle surf break. Wake up, grab your board, and you're in the water in seconds."
                    },
                    {
                      icon: Palmtree,
                      title: whyChooseUsConfig?.features?.[1]?.title ?? "Authentic Barefoot Luxury",
                      desc: whyChooseUsConfig?.features?.[1]?.desc ?? "We blend high-end modern comforts with authentic Sri Lankan hospitality for a genuinely unique island experience."
                    },
                    {
                      icon: Waves,
                      title: whyChooseUsConfig?.features?.[2]?.title ?? "Effortless Experience",
                      desc: whyChooseUsConfig?.features?.[2]?.desc ?? "From airport transfers to personalized surf lessons and daily fresh breakfasts, we curate your entire journey."
                    }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div 
                        key={i}
                        variants={{
                          hidden: { opacity: 0, x: -75, transition: { duration: 0.15 } },
                          visible: { 
                            opacity: 1, 
                            x: 0, 
                            transition: { 
                              delay: 0.26 + i * 0.14, 
                              duration: 0.75, 
                              ease: [0.16, 1, 0.3, 1] 
                            } 
                          }
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.15 }}
                        whileHover={{ x: 6, transition: { duration: 0.25 } }}
                        style={{ willChange: "transform, opacity" }}
                        className="group p-4 sm:p-4.5 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 hover:border-[#FBBF24]/60 shadow-[0_4px_16px_rgba(11,61,94,0.03)] hover:shadow-[0_12px_28px_rgba(251,191,36,0.15)] transition-[box-shadow,border-color] duration-300 flex items-start gap-4"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 border border-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#0B3D5E] group-hover:scale-110 group-hover:shadow-[0_4px_14px_rgba(251,191,36,0.35)] transition-all duration-300 shadow-sm">
                          <Icon className="w-5 h-5 text-[#0B3D5E]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-serif font-black text-[#0B3D5E] mb-1 group-hover:text-[#D97706] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Social Proof & Reviews (One by one from left side) */}
                <div className="mt-7 pt-6 border-t border-slate-200/70 flex items-center gap-5 sm:gap-6 flex-wrap">
                  {/* Avatars from left */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: -60, transition: { duration: 0.15 } },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        transition: { delay: 0.70, duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    style={{ willChange: "transform, opacity" }}
                    className="flex -space-x-3 items-center"
                  >
                    {(whyChooseUsConfig?.socialProof?.avatars || [
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
                      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                    ]).map((src: string, i: number) => {
                      const fallbackAvatars = [
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                      ];
                      const cleanSrc = normalizeAssetUrl(src, fallbackAvatars[i % 4]);
                      return (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                          <img
                            src={cleanSrc}
                            alt="Guest"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackAvatars[i % 4];
                            }}
                          />
                        </div>
                      );
                    })}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0B3D5E] text-[#FBBF24] flex items-center justify-center font-black text-xs shadow-sm">
                      {whyChooseUsConfig?.socialProof?.avatarBadge || "+1k"}
                    </div>
                  </motion.div>

                  {/* Rating & text from left */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -50, transition: { duration: 0.15 } },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        transition: { delay: 0.82, duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="flex items-center gap-1 text-[#FBBF24] mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                      ))}
                      <span className="text-xs font-black text-[#0B3D5E] ml-1.5">
                        {whyChooseUsConfig?.socialProof?.score || "5.0 / 5.0"}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {whyChooseUsConfig?.socialProof?.text || "Loved by 1,000+ guests worldwide"}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Right Column Image & High-end Floating Badges (Smaller, elegantly balanced) */}
              <div className="lg:col-span-5 flex justify-center relative w-full">
                {/* Image Frame (Enters from UPSIDE to DOWN) */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -75, transition: { duration: 0.2 } },
                    visible: { 
                      opacity: 1, 
                      y: 0, 
                      transition: { delay: 0.20, duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  style={{ willChange: "transform, opacity" }}
                  className="relative w-full max-w-[430px] lg:max-w-[450px]"
                >
                  {/* Image Frame Container */}
                  <div className="relative h-[440px] sm:h-[490px] md:h-[520px] rounded-[2rem] sm:rounded-[2.4rem] overflow-hidden shadow-[0_20px_50px_rgba(11,61,94,0.14)] border border-white/80 group">
                    <img
                      src={normalizeAssetUrl(whyChooseUsConfig?.showcase?.image, "/images/service-stay.png")}
                      alt="Barefoot Luxury at Ocean Air Weligama"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/service-stay.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/85 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Floating Testimonial Comment Card (Enters from DOWN to UP) */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 70, transition: { duration: 0.2 } },
                        visible: { 
                          opacity: 1, 
                          y: 0, 
                          transition: { delay: 0.70, duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
                        }
                      }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.15 }}
                      style={{ willChange: "transform, opacity" }}
                      className="absolute bottom-0 left-0 p-4 sm:p-5 w-full z-10"
                    >
                      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 sm:p-4.5 text-white shadow-xl">
                        <div className="flex items-center gap-1 text-[#FBBF24] mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#FBBF24] text-[#FBBF24]" />
                          ))}
                        </div>
                        <p className="font-serif italic text-xs sm:text-[13px] mb-3 leading-relaxed text-white/95">
                          "{whyChooseUsConfig?.showcase?.testimonialQuote || "The most peaceful week of my life. Waking up to the sound of waves and walking straight onto the sand is an unmatched experience."}"
                        </p>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-[#0B3D5E] font-black flex items-center justify-center shadow-md text-xs flex-shrink-0">
                            {whyChooseUsConfig?.showcase?.testimonialAuthorInitial || (whyChooseUsConfig?.showcase?.testimonialAuthor ? whyChooseUsConfig.showcase.testimonialAuthor.charAt(0) : "S")}
                          </div>
                          <div>
                            <p className="font-black text-xs text-white">
                              {whyChooseUsConfig?.showcase?.testimonialAuthor || "Sarah Jenkins"}
                            </p>
                            <p className="text-white/80 text-[10px] font-medium">
                              {whyChooseUsConfig?.showcase?.testimonialAuthorRole || "Stayed 7 nights • Deluxe Ocean Suite"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Floating Top Badge (Enters from RIGHT side onto image) */}
                  <motion.div 
                    variants={{
                      hidden: { opacity: 0, x: 75, transition: { duration: 0.2 } },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        transition: { delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute -top-3.5 right-3 sm:-top-4 sm:right-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl shadow-[0_12px_35px_rgba(11,61,94,0.15)] border border-[#FBBF24]/40 flex items-center gap-3 z-20"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border border-[#FDE68A] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-lg sm:text-xl">
                        {whyChooseUsConfig?.showcase?.awardIcon || "🏆"}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#D97706]">
                        {whyChooseUsConfig?.showcase?.awardTag || "Top Rated"}
                      </p>
                      <p className="font-serif font-black text-xs sm:text-sm text-[#0B3D5E]">
                        {whyChooseUsConfig?.showcase?.awardTitle || "2026 Choice Award"}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section
        className="py-24 sm:py-28 relative overflow-hidden border-t border-[#0B3D5E]/5"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F9FC 100%)' }}
      >
        {/* Ambient warmth matching hotel logo yellow and coastal ocean navy */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#0B3D5E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1440px]">
          {/* Luminous Frosted Glass Box Container */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 35, transition: { duration: 0.2 } },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-white/90 shadow-[0_20px_60px_-15px_rgba(11,61,94,0.08)] backdrop-blur-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.60) 50%, rgba(245, 249, 252, 0.75) 100%)',
              willChange: "transform, opacity"
            }}
          >
            {/* Subtle internal warm and ocean halos */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

            {/* Header inside the transparent box */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6 relative z-10">
              <div className="max-w-xl">
                {/* Eyebrow badge - Comes from right side */}
                <motion.div
                  variants={galleryBadgeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 shadow-sm mb-3"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#0B3D5E]" />
                  <span>The Visual Sanctuary</span>
                </motion.div>

                {/* Heading - Words come one by one from left side */}
                <motion.h2
                  variants={galleryWordsContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight flex flex-wrap items-center gap-x-3 gap-y-1"
                >
                  <motion.span variants={galleryWordItemVariants} className="inline-block">
                    Moments
                  </motion.span>
                  <motion.span variants={galleryWordItemVariants} className="inline-block">
                    in
                  </motion.span>
                  <motion.span
                    variants={galleryWordItemVariants}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                  >
                    Weligama
                  </motion.span>
                </motion.h2>

                {/* Subtitle description - Comes from right side */}
                <motion.p
                  variants={galleryDescVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.2 }}
                  className="text-slate-600 text-sm md:text-base font-normal max-w-xl mt-2 leading-relaxed"
                >
                  Sun-drenched breaks, calm coastal mornings, and serene boutique living captured steps from the bay.
                </motion.p>
              </div>

              {/* View Full Gallery Button (Comes from right side) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 75, transition: { duration: 0.25, ease: "easeOut" } },
                  visible: { 
                    opacity: 1, 
                    x: 0, 
                    transition: { delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                style={{ willChange: "transform, opacity" }}
              >
                <Link href="/gallery">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-sm hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300 hover:scale-105 group/btn cursor-pointer">
                    <span>View Full Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </motion.div>
            </div>
            
            {/* Gallery Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 relative z-10">
              {galleryItems?.filter((i: any) => i.isFeatured).slice(0, 5).map((img: any, idx: number) => {
                // Directional choreographed variants based on position
                const getGalleryVariants = (index: number): Variants => {
                  if (index === 0) {
                    // Big image on left comes from left side
                    return {
                      hidden: { opacity: 0, x: -85, transition: { duration: 0.2 } },
                      visible: { opacity: 1, x: 0, transition: { delay: 0.22, duration: 0.85, ease: [0.16, 1, 0.3, 1] as const } }
                    };
                  } else if (index === 1) {
                    // Up-left image (top middle) comes up to down
                    return {
                      hidden: { opacity: 0, y: -70, transition: { duration: 0.2 } },
                      visible: { opacity: 1, y: 0, transition: { delay: 0.36, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
                    };
                  } else if (index === 2) {
                    // Up-right image (top right) comes from right side
                    return {
                      hidden: { opacity: 0, x: 75, transition: { duration: 0.2 } },
                      visible: { opacity: 1, x: 0, transition: { delay: 0.48, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
                    };
                  } else if (index === 3) {
                    // Down-left image (bottom middle) comes down to up
                    return {
                      hidden: { opacity: 0, y: 70, transition: { duration: 0.2 } },
                      visible: { opacity: 1, y: 0, transition: { delay: 0.60, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
                    };
                  } else {
                    // Down-right image (bottom right) comes from right side
                    return {
                      hidden: { opacity: 0, x: 75, transition: { duration: 0.2 } },
                      visible: { opacity: 1, x: 0, transition: { delay: 0.72, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
                    };
                  }
                };

                return (
                  <motion.div
                    key={img.id}
                    variants={getGalleryVariants(idx)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    style={{ willChange: "transform, opacity" }}
                    className={`relative group rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden bg-white border border-slate-200/80 shadow-[0_8px_25px_rgba(11,61,94,0.06)] hover:shadow-[0_20px_45px_rgba(251,191,36,0.22),0_10px_25px_rgba(11,61,94,0.08)] hover:border-[#FBBF24]/60 transition-[box-shadow,border-color] duration-500 ${
                      idx === 0 ? 'sm:col-span-2 sm:row-span-2 min-h-[340px] md:min-h-[460px]' : 'aspect-square min-h-[200px]'
                    }`}
                  >
                    {/* Image */}
                    <img
                      src={img.url}
                      alt={img.caption || 'Gallery Image'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />

                    {/* Golden top illumination line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                    {/* Ambient hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/85 via-[#0B3D5E]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-10 flex flex-col justify-between p-6">
                      {/* Top expand badge */}
                      <div className="self-end w-9 h-9 rounded-full bg-[#FBBF24] text-[#0B3D5E] flex items-center justify-center shadow-md transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <ImageIcon className="w-4 h-4" />
                      </div>

                      {/* Caption */}
                      <div className="transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-white font-serif font-black text-base sm:text-lg leading-snug drop-shadow-sm">
                          {img.caption || 'Moments at Ocean Air'}
                        </p>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FBBF24] mt-1 block">
                          Weligama Bay • Sri Lanka
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Blogs */}
      {blogs && blogs.length > 0 && (
        <section
          className="py-24 sm:py-28 relative overflow-hidden border-t border-[#0B3D5E]/5"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F9FC 100%)' }}
        >
          {/* Ambient warmth matching hotel logo yellow and coastal ocean navy */}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#0B3D5E]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1440px]">
            {/* Luminous Frosted Glass Box Container */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 35, transition: { duration: 0.2 } },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              className="rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-12 border border-white/90 shadow-[0_20px_60px_-15px_rgba(11,61,94,0.08)] backdrop-blur-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.60) 50%, rgba(245, 249, 252, 0.75) 100%)',
                willChange: "transform, opacity"
              }}
            >
              {/* Subtle internal warm and ocean halos */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

              {/* Header inside the transparent box */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6 relative z-10">
                {/* Heading Block */}
                <div className="max-w-xl">
                  {/* Eyebrow badge - Comes from right side */}
                  <motion.div
                    variants={blogBadgeVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 shadow-sm mb-3"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#0B3D5E]" />
                    <span>Stories &amp; Guides</span>
                  </motion.div>

                  {/* Heading - Words come one by one from left side */}
                  <motion.h2
                    variants={blogWordsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight flex flex-wrap items-center gap-x-3 gap-y-1"
                  >
                    <motion.span variants={blogWordItemVariants} className="inline-block">
                      Latest
                    </motion.span>
                    <motion.span variants={blogWordItemVariants} className="inline-block">
                      on
                    </motion.span>
                    <motion.span variants={blogWordItemVariants} className="inline-block">
                      the
                    </motion.span>
                    <motion.span
                      variants={blogWordItemVariants}
                      className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                    >
                      Blog
                    </motion.span>
                  </motion.h2>

                  {/* Description - Comes from right side */}
                  <motion.p
                    variants={blogDescVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="text-slate-600 text-sm md:text-base font-normal max-w-xl mt-2 leading-relaxed"
                  >
                    Insider tips, coastal surf culture, and heartfelt stories from Weligama Bay.
                  </motion.p>
                </div>

                {/* View All Stories Button (Enters from RIGHT side) */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 75, transition: { duration: 0.2 } },
                    visible: { 
                      opacity: 1, 
                      x: 0, 
                      transition: { delay: 0.22, duration: 0.75, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Link href="/blog">
                    <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-sm hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300 hover:scale-105 group/btn">
                      <span>View All Stories</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </button>
                  </Link>
                </motion.div>
              </div>

              {/* Blog Content Layout — Small, compact, sleek cards */}
              {(() => {
                const displayBlogs = (() => {
                  if (!blogs || blogs.length === 0) return [];
                  // Priority 1: Blogs explicitly selected with showOnHome toggle
                  const homeSelected = blogs.filter((b: any) => b.showOnHome);
                  if (homeSelected.length > 0) return homeSelected.slice(0, 3);
                  // Fallback: If no blogs have showOnHome selected, fallback to featured or newest
                  const featured = blogs.filter((b: any) => b.isMainPost || b.isFeatured);
                  if (featured.length > 0) return featured.slice(0, 3);
                  return blogs.slice(0, 3);
                })();

                return (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 ${
                    displayBlogs.length === 1 ? 'max-w-md mx-auto sm:max-w-none' : ''
                  }`}>
                    {displayBlogs.map((blog: any, idx: number) => (
                      <motion.div
                        key={blog.id}
                        variants={{
                          hidden: { opacity: 0, y: 70, transition: { duration: 0.2 } },
                          visible: { 
                            opacity: 1, 
                            y: 0, 
                            transition: { 
                              delay: 0.28 + idx * 0.12, 
                              duration: 0.8, 
                              ease: [0.16, 1, 0.3, 1] 
                            } 
                          }
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.15 }}
                        whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                        style={{ willChange: "transform, opacity" }}
                        className="group flex flex-col bg-white rounded-[1.75rem] border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_rgba(11,61,94,0.04)] hover:shadow-[0_16px_35px_rgba(251,191,36,0.16),0_8px_20px_rgba(11,61,94,0.06)] hover:border-[#FBBF24]/60 transition-[box-shadow,border-color] duration-300 relative"
                      >
                        {/* Golden top illumination line */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-20" />

                        {/* Compact Image Container */}
                        <div className="aspect-[16/10] overflow-hidden relative m-2.5 rounded-2xl bg-slate-100">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                          />
                          <div className="absolute top-2.5 left-2.5 z-10">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#0B3D5E] border border-white/60 shadow-sm">
                              {blog.category || 'Travel'}
                            </span>
                          </div>
                        </div>

                        {/* Compact Card Body */}
                        <div className="p-4 sm:p-5 pt-2 flex flex-col flex-1 justify-between">
                          <div>
                            {/* Date metadata */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-0.5 bg-[#FBBF24]" />
                              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FBBF24]">
                                {new Date(blog.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>

                            {/* Title */}
                            <Link href={`/blog/${blog.id}`}>
                              <h3 className="text-base sm:text-lg font-serif font-black text-[#0B3D5E] group-hover:text-[#D97706] transition-colors leading-snug line-clamp-2 mb-2 cursor-pointer">
                                {blog.title}
                              </h3>
                            </Link>

                            {/* Excerpt */}
                            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
                              {cleanExcerpt(blog.description)}
                            </p>
                          </div>

                          {/* Footer Link */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                            <Link href={`/blog/${blog.id}`} className="w-full flex items-center justify-between group/link py-0.5">
                              <span className="text-[11px] font-black uppercase tracking-wider text-[#0B3D5E] group-hover/link:text-[#D97706] transition-colors">
                                Read Story
                              </span>
                              <div className="w-7 h-7 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#0B3D5E] group-hover/link:bg-[#FBBF24] group-hover/link:shadow-[0_4px_10px_rgba(251,191,36,0.35)] group-hover/link:scale-105 transition-all duration-300">
                                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                              </div>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })()}
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section
        className="py-24 sm:py-28 relative overflow-hidden border-t border-[#0B3D5E]/5"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F9FC 100%)' }}
      >
        {/* Ambient warmth matching hotel logo yellow and coastal ocean navy */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#0B3D5E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1440px]">
          {/* Luminous Frosted Glass Box Container */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 35, transition: { duration: 0.2 } },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="max-w-5xl lg:max-w-6xl mx-auto rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-white/90 shadow-[0_20px_60px_-15px_rgba(11,61,94,0.08)] backdrop-blur-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.60) 50%, rgba(245, 249, 252, 0.75) 100%)',
              willChange: "transform, opacity"
            }}
          >
            {/* Subtle internal warm and ocean halos */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

            {/* Header inside the transparent box */}
            <div className="text-center mb-10 sm:mb-12 relative z-10">
              {/* Eyebrow badge - Comes from right side */}
              <motion.div
                variants={faqBadgeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 shadow-sm mb-3"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#0B3D5E]" />
                <span>Got Questions?</span>
              </motion.div>

              {/* Heading - Words come one by one from left side */}
              <motion.h2
                variants={faqWordsContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
              >
                <motion.span variants={faqWordItemVariants} className="inline-block">
                  Frequently
                </motion.span>
                <motion.span variants={faqWordItemVariants} className="inline-block">
                  Asked
                </motion.span>
                <motion.span
                  variants={faqWordItemVariants}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                >
                  Questions
                </motion.span>
              </motion.h2>

              {/* Description - Comes from right side */}
              <motion.p
                variants={faqDescVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-slate-600 text-sm md:text-base font-normal max-w-lg mx-auto leading-relaxed"
              >
                Everything you need to know about your coastal stay, surf packages, and boutique amenities.
              </motion.p>
            </div>
            
            {/* Accordion List (Cards alternate entering from LEFT and RIGHT one by one) */}
            <div className="space-y-3.5 sm:space-y-4 relative z-10">
              {[
                { q: "How far is the beach from the property?", a: "We are literally 100 steps from the ocean. You can grab your board and be in the water in less than 2 minutes." },
                { q: "Do you offer surf lessons for beginners?", a: "Yes! Our ISA-certified team provides lessons for all levels, complete with high-quality board rentals directly on-site." },
                { q: "Is breakfast included in the booking?", a: "Absolutely. We offer a complimentary, authentic Sri Lankan or continental breakfast for all our guests." },
                { q: "Can you arrange airport transfers?", a: "Yes, we offer seamless airport pickups and drop-offs. You can add this during the booking process." },
                { q: "Do the rooms have air conditioning?", a: "All our rooms are fully equipped with modern air conditioning and high-speed Wi-Fi to ensure maximum comfort." }
              ].map((faq, idx) => {
                const isLeft = idx % 2 === 0;
                return (
                  <motion.div 
                    key={idx}
                    variants={{
                      hidden: { 
                        opacity: 0, 
                        x: isLeft ? -40 : 40, 
                        transition: { duration: 0.2, ease: "easeOut" } 
                      },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        transition: { 
                          delay: 0.08 + idx * 0.06, 
                          duration: 0.55, 
                          ease: [0.22, 1, 0.36, 1] 
                        } 
                      }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    style={{ willChange: "transform, opacity" }}
                    className={`rounded-2xl transition-[background-color,border-color,box-shadow] duration-200 overflow-hidden ${
                      openFaq === idx
                        ? 'bg-white border border-[#FBBF24]/60 shadow-[0_12px_30px_rgba(251,191,36,0.14)] ring-1 ring-[#FBBF24]/30'
                        : 'bg-white/80 hover:bg-white border border-slate-200/80 hover:border-[#FBBF24]/40 shadow-[0_4px_16px_rgba(11,61,94,0.03)]'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-4 cursor-pointer group"
                    >
                      <span className={`font-serif font-bold text-base sm:text-lg transition-colors ${
                        openFaq === idx ? 'text-[#0B3D5E]' : 'text-[#0B3D5E] group-hover:text-[#D97706]'
                      }`}>
                        {faq.q}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-[background-color,color,box-shadow,transform] duration-200 ${
                        openFaq === idx
                          ? 'bg-[#FBBF24] text-[#0B3D5E] shadow-sm rotate-180'
                          : 'bg-slate-100/80 text-slate-500 group-hover:bg-[#FBBF24]/20 group-hover:text-[#0B3D5E]'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed font-normal border-t border-slate-100">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Concierge Help Cue (Enters smoothly from bottom) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, transition: { duration: 0.2 } },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.22 + 5 * 0.12, duration: 0.75, ease: [0.16, 1, 0.3, 1] }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              style={{ willChange: "transform, opacity" }}
              className="mt-10 pt-6 border-t border-slate-200/60 text-center relative z-10"
            >
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Still have questions? Our team is always here to help.{' '}
                <Link href="/contact" className="text-[#0B3D5E] font-bold underline decoration-[#FBBF24] decoration-2 underline-offset-4 hover:text-[#D97706] transition-colors">
                  Contact our concierge
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  );
}
