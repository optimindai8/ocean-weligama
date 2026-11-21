import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Footer } from "@/components/footer";
import {
  HelpCircle,
  Waves,
  Plane,
  Bed,
  CreditCard,
  Search,
  ShieldCheck,
  Loader2,
  Compass,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  Plus,
  MessageCircle,
  X,
} from "lucide-react";
import { SEO, StructuredData } from "@/seo";

/* ─── Hero Motion Variants (Matches Blog, Rooms & Packages) ────── */
const heroContentVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

const heroEyebrowVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
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
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroHeadlineVariants: Variants = {
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
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroSubtitleVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
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
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroCtaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const perksContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const perkItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
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

/* ─── Bottom Concierge Banner Motion Variants ─────────────────── */
const bannerHeadlineVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

const bannerWordVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -55,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Icon map for categories
const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  "All": LayoutGrid,
  "The Stay": Bed,
  "Surf & Wellness": Waves,
  "Bookings & Payments": CreditCard,
  "The Journey": Plane,
};

function getCategoryIcon(category: string) {
  if (CATEGORY_ICONS[category]) return CATEGORY_ICONS[category];
  const cat = category.toLowerCase();
  if (cat.includes("stay") || cat.includes("room")) return Bed;
  if (cat.includes("surf") || cat.includes("yoga") || cat.includes("wellness")) return Waves;
  if (cat.includes("book") || cat.includes("payment") || cat.includes("cancel")) return CreditCard;
  if (cat.includes("journey") || cat.includes("travel") || cat.includes("transfer")) return Plane;
  return HelpCircle;
}

const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL || "http://localhost:8080"
  : "";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
};

const FALLBACK_FAQS: FaqItem[] = [
  {
    id: "f1",
    category: "The Stay",
    question: "What are the check-in and check-out times at Ocean Air Weligama?",
    answer: "Standard check-in begins at 2:00 PM, and check-out is until 11:00 AM. Early check-in or late check-out can often be arranged depending on availability; please contact our concierge in advance.",
    sortOrder: 1,
  },
  {
    id: "f2",
    category: "The Stay",
    question: "Is high-speed Wi-Fi available throughout the property?",
    answer: "Yes, complimentary high-speed fiber Wi-Fi is accessible across all guest suites, private balconies, our rooftop café, and garden lounges—perfect for digital nomads and remote professionals.",
    sortOrder: 2,
  },
  {
    id: "f3",
    category: "The Stay",
    question: "Is breakfast included with our booking?",
    answer: "Our rooftop café serves artisan breakfasts daily from 7:30 AM to 11:00 AM, featuring fresh tropical fruits, organic king coconuts, local Sri Lankan egg hoppers, and wholesome international favorites.",
    sortOrder: 3,
  },
  {
    id: "f4",
    category: "Surf & Wellness",
    question: "Do you offer surf lessons and surfboard rentals on site?",
    answer: "Absolutely! Weligama Bay is world-renowned for gentle sand-bottom surf breaks. We provide bespoke surf coaching with ISA-certified local instructors, video analysis, and a curated quiver of surfboards.",
    sortOrder: 4,
  },
  {
    id: "f5",
    category: "Surf & Wellness",
    question: "Can I join rooftop yoga sessions during my stay?",
    answer: "Yes, daily sunrise and sunset yoga classes are held on our breezy rooftop terrace overlooking the Indian Ocean. Mats, blocks, and herbal refreshments are provided.",
    sortOrder: 5,
  },
  {
    id: "f6",
    category: "Bookings & Payments",
    question: "What is your reservation and cancellation policy?",
    answer: "Direct bookings enjoy our most flexible terms. Cancellations made at least 14 days prior to arrival receive a 100% refund or free date rescheduling. We accept Visa, MasterCard, and direct bank transfers.",
    sortOrder: 6,
  },
  {
    id: "f7",
    category: "Bookings & Payments",
    question: "Do you offer special rates for extended stays or workations?",
    answer: "Yes, we offer exclusive weekly and monthly retreat rates for remote workers, surf travelers, and couples looking to settle into relaxed coastal living.",
    sortOrder: 7,
  },
  {
    id: "f8",
    category: "The Journey",
    question: "How do I reach Ocean Air from Colombo Bandaranaike International Airport (CMB)?",
    answer: "We offer private air-conditioned airport transfers directly from CMB to our doorstep via the Southern Expressway (approx. 2 to 2.5 hours). You can also take the scenic coastal train to Weligama Station, just 5 minutes away.",
    sortOrder: 8,
  },
  {
    id: "f9",
    category: "The Journey",
    question: "Are scooters, tuk-tuks, or day trips available for hire?",
    answer: "Our front desk team can arrange scooter rentals with helmets, trusted private tuk-tuks, or guided day excursions to Galle Fort, Mirissa whale watching, Udawalawe safari, and virgin white tea plantations.",
    sortOrder: 9,
  },
  {
    id: "f10",
    category: "The Stay",
    question: "Are all rooms air-conditioned and serviced daily?",
    answer: "Yes, every room and private villa suite features whisper-quiet climate control, daily housekeeping, organic bath amenities, plush linen, and a private en-suite bathroom.",
    sortOrder: 10,
  },
  {
    id: "f11",
    category: "Surf & Wellness",
    question: "When is the best season for surfing in Weligama Bay?",
    answer: "Weligama Bay offers rideable waves 365 days a year due to its sheltered topography! The peak season runs from October through April with glassy mornings and golden sunshine.",
    sortOrder: 11,
  },
  {
    id: "f12",
    category: "The Journey",
    question: "Can Ocean Air organize whale watching tours in nearby Mirissa?",
    answer: "Yes, Mirissa harbor is just a 10-minute drive away. We partner with ethical, licensed boat operators for blue whale and dolphin watching excursions between November and April.",
    sortOrder: 12,
  },
];

const ITEMS_PER_PAGE = 6;

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dbFaqs, setDbFaqs] = useState<FaqItem[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Fetch FAQs from database
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/faqs`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setDbFaqs(data);
          } else {
            setDbFaqs(FALLBACK_FAQS);
          }
        } else {
          setDbFaqs(FALLBACK_FAQS);
        }
      } catch {
        setDbFaqs(FALLBACK_FAQS);
      } finally {
        setDbLoading(false);
      }
    })();
  }, []);

  const activeFaqs = dbFaqs.length > 0 ? dbFaqs : FALLBACK_FAQS;

  const allCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(activeFaqs.map((f) => f.category))).sort()];
  }, [activeFaqs]);

  // Filtered flat list of FAQs based on active category & search
  const filteredFaqs = useMemo(() => {
    return activeFaqs.filter((item) => {
      const matchCategory = activeCategory === "All" || item.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeFaqs, activeCategory, searchQuery]);

  // Reset pagination on category or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE));
  const pagedFaqs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFaqs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFaqs, currentPage]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-[#0B3D5E] selection:bg-[#FBBF24]/30 selection:text-[#0B3D5E] overflow-x-clip">
      <SEO
        title="Frequently Asked Questions — Ocean Air Weligama"
        description="Find answers to all questions regarding Ocean Air Weligama stays, surf lessons, airport transfers, cancellation policies & amenities."
        canonicalPath="/faq"
        keywords={["Weligama Hotel FAQ", "Ocean Weligama Questions", "Weligama Surf Camp Info", "Sri Lanka South Coast Stay Questions"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "FAQ", item: "/faq" },
        ]}
        faqs={activeFaqs.map((f) => ({ question: f.question, answer: f.answer }))}
      />

      {/* Cinematic FAQ Video Hero Section (Exact Same Architecture as Blog Page) */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#052439]">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            poster="/images/faq-hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
          >
            <source src="/videos/faq-hero-video.mp4" type="video/mp4" />
            <source src="/videos/Women_dining_at_beachfront_resta…_70701f92_1080p.mp4" type="video/mp4" />
          </video>

          {/* Deep coastal ocean overlay for supreme text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/78 via-[#0B3D5E]/48 to-[#052439]/92" />

          {/* Golden sunrise ambient warmth matching hotel logo yellow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.55)_100%)] pointer-events-none" />

          {/* Bottom subtle edge fade transitioning smoothly into the questions section */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F0F4F8] via-[#F0F4F8]/40 to-transparent pointer-events-none" />
        </div>

        {/* Row 1: Navbar Clearance Spacer */}
        <div className="h-24 md:h-32 shrink-0 relative z-10" />

        {/* Row 2: Main Hero Content (Clean, Focused, Staggered Directional Entrances) */}
        <motion.div
          variants={heroContentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="container mx-auto px-4 sm:px-6 relative z-10 text-center my-auto py-8"
        >
          {/* Eyebrow Badge - From Left Side */}
          <motion.div
            variants={heroEyebrowVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.25em] bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#FBBF24] backdrop-blur-md shadow-[0_4px_25px_rgba(251,191,36,0.25)] mb-5 cursor-default"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Concierge Desk • Guest Guide</span>
          </motion.div>

          {/* Main Headline - From Right Side */}
          <motion.h1
            variants={heroHeadlineVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#F59E0B] drop-shadow-[0_2px_20px_rgba(251,191,36,0.5)]">
              Questions
            </span>
          </motion.h1>

          {/* Subtitle - From Left Side */}
          <motion.p
            variants={heroSubtitleVariants}
            className="mt-5 text-white/85 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md font-sans"
          >
            Everything you need to know about your sanctuary stay, surf breaks, dining, airport transfers &amp; barefoot luxury living in Weligama Bay.
          </motion.p>

          {/* Live Statistics Badge Row */}
          <motion.div
            variants={heroSubtitleVariants}
            className="mt-5 flex items-center justify-center gap-3 text-white/80 text-xs font-semibold flex-wrap"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <HelpCircle className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{activeFaqs.length} Questions Answered</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Compass className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{Math.max(1, allCategories.length - 1)} Curated Topics</span>
            </div>
          </motion.div>

          {/* Action CTA - From Bottom to Up */}
          <motion.div
            variants={heroCtaVariants}
            className="mt-8 sm:mt-10 flex items-center justify-center relative z-20"
          >
            <button
              onClick={() => {
                const el = document.getElementById("faq-content");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:bg-white hover:text-[#0B3D5E] transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
            >
              <span>Explore Questions</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </motion.div>

        {/* Row 3: Reassurance Dock - Items come from left side one by one */}
        <motion.div
          variants={perksContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="w-full max-w-5xl mx-auto px-4 pb-12 sm:pb-16 pt-4 relative z-10"
        >
          {/* Frosted Glass Micro-Perks Dock */}
          <div className="rounded-2xl sm:rounded-full bg-black/40 backdrop-blur-xl border border-white/20 p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-wrap items-center justify-around gap-2 text-white/95 text-[11px] sm:text-xs font-semibold">
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <HelpCircle className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>24/7 Concierge Support</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Plane className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Direct Airport Transfers</span>
            </motion.div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Waves className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Surf Board Storage &amp; Rental</span>
            </motion.div>
            <div className="hidden lg:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <ShieldCheck className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Best Direct Rate Guarantee</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main Content Area: 2-Column Attractive Layout matching user screenshot */}
      <main
        id="faq-content"
        className="flex-1 py-16 sm:py-24 relative scroll-mt-20 overflow-x-clip"
        style={{ background: "linear-gradient(160deg, #F0F4F8 0%, #E2EDF8 100%)" }}
      >
        {/* Soft ambient backgrounds */}
        <div className="absolute top-[5%] right-[-5%] w-[550px] h-[550px] bg-[#FBBF24]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[35%] left-[-10%] w-[500px] h-[500px] bg-sky-200/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">

          {/* Luxury Watermark Header (Matches Reference Screenshot) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center mb-10 sm:mb-14 select-none"
          >
            {/* Faint luxury watermark */}
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-6xl md:text-7xl font-serif font-black text-[#0B3D5E]/[0.035] whitespace-nowrap pointer-events-none tracking-tight">
              Frequently Asked Questions
            </span>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] text-[10px] font-black uppercase tracking-widest mb-3">
                <HelpCircle className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Concierge Help Desk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2.5 text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                Got questions? We have clear answers. If you need any assistance, reach out directly.
              </p>
            </div>
          </motion.div>

          {/* Luxury Luminous Filter & Search Dock - Stays in place in page flow without sticking or popping up on scroll */}
          <div className="relative z-20 mb-10 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Ambient Warm Golden Glow behind dock */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FBBF24]/25 via-[#F59E0B]/18 to-[#FBBF24]/25 rounded-[2.5rem] sm:rounded-full blur-xl opacity-80 pointer-events-none" />

              <div className="relative rounded-[2rem] sm:rounded-full bg-white/90 backdrop-blur-2xl border border-white/95 p-1.5 sm:p-2.5 shadow-[0_20px_50px_-15px_rgba(11,61,94,0.08),0_4px_25px_rgba(251,191,36,0.14)] flex flex-col lg:flex-row items-center justify-between gap-3">
                {/* Category Pills (Horizontal Scroll) */}
                <div className="w-full lg:w-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar py-1 px-1">
                  {allCategories.map((cat) => {
                    const isActive = activeCategory === cat;
                    const Icon = getCategoryIcon(cat);
                    const count =
                      cat === "All"
                        ? activeFaqs.length
                        : activeFaqs.filter((f) => f.category === cat).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setOpenIndex(null);
                        }}
                        className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                          isActive
                            ? "bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#0B3D5E] shadow-sm font-black scale-[1.02]"
                            : "bg-white/60 hover:bg-white text-slate-600 hover:text-[#0B3D5E] border border-slate-200/60 hover:border-[#FBBF24]/50"
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                            isActive ? "text-[#0B3D5E]" : "text-[#D97706]/75 group-hover:text-[#0B3D5E]"
                          }`}
                        />
                        <span>{cat}</span>
                        {count > 0 && (
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.5 rounded-full transition-colors ${
                              isActive
                                ? "bg-[#0B3D5E] text-[#FBBF24] shadow-xs"
                                : "bg-[#0B3D5E]/8 text-[#0B3D5E] group-hover:bg-[#0B3D5E]/12"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Integrated Luxury Search Bar */}
                <div className="relative w-full lg:w-72 flex items-center shrink-0">
                  <Search
                    className={`absolute left-3.5 w-4 h-4 transition-colors duration-200 pointer-events-none ${
                      isSearchFocused ? "text-[#D97706]" : "text-[#0B3D5E]/40"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search questions or keywords..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setOpenIndex(null);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full bg-[#FAF9F6]/80 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#FBBF24] rounded-full pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[#0B3D5E] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#FBBF24]/20 transition-all duration-300 shadow-inner"
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 w-5 h-5 rounded-full bg-slate-200/80 hover:bg-[#FBBF24] text-slate-500 hover:text-[#0B3D5E] flex items-center justify-center text-[10px] font-black transition-all cursor-pointer shadow-sm"
                        title="Clear search"
                      >
                        ✕
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Results Count Badge - Comes from left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/95 shadow-sm text-[11px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span>
                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "Question" : "Questions"}
                {activeCategory !== "All" && ` · ${activeCategory}`}
                {searchQuery && ` · "${searchQuery}"`}
              </span>
            </div>
          </motion.div>

          {/* 2-Column Layout (Matching User Reference Image) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Question Accordion Cards & Pagination (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-4">
              {dbLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/80 shadow-sm">
                  <Loader2 className="w-8 h-8 text-[#0B3D5E] animate-spin mb-4" />
                  <p className="text-slate-500 text-sm font-medium">Curating answers for you...</p>
                </div>
              ) : pagedFaqs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/95 shadow-sm px-6"
                >
                  <div className="w-16 h-16 bg-[#FBBF24]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FBBF24]/40">
                    <Search className="w-7 h-7 text-[#D97706]" />
                  </div>
                  <h3 className="text-xl font-serif font-black text-[#0B3D5E] mb-2">No Matching Questions</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    {searchQuery
                      ? `We couldn't find any questions matching "${searchQuery}". Try a different keyword or reset filters.`
                      : "No questions currently listed in this category."}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All");
                    }}
                    className="bg-[#0B3D5E] hover:bg-[#15537d] text-white px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                  >
                    Reset Search
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-3.5">
                  <div className="space-y-3.5">
                    {pagedFaqs.map((faq, idx) => {
                        const isOpen = openIndex === faq.id;

                        return (
                          <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, x: -70 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.12 }}
                            transition={{
                              duration: 0.75,
                              delay: idx * 0.08,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{ willChange: "transform, opacity" }}
                            className={`group rounded-2xl sm:rounded-3xl border overflow-hidden transition-shadow duration-300 ${
                              isOpen
                                ? "bg-white border-[#FBBF24]/70 shadow-[0_15px_40px_rgba(11,61,94,0.08),0_0_0_1.5px_rgba(251,191,36,0.35)]"
                                : "bg-white/95 border-white/95 hover:border-[#FBBF24]/40 hover:bg-white hover:shadow-md"
                            }`}
                          >
                            <button
                              onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                              className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                            >
                              <div className="flex-1 min-w-0 pr-2">
                                <span
                                  className={`text-sm sm:text-[15px] font-serif font-bold transition-colors duration-200 block leading-snug ${
                                    isOpen ? "text-[#0B3D5E]" : "text-slate-800 group-hover:text-[#0B3D5E]"
                                  }`}
                                >
                                  {faq.question}
                                </span>
                              </div>

                              {/* Plus / Minus Circular Toggle Button (Matches Reference Image) */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                  isOpen
                                    ? "bg-[#FBBF24] text-[#0B3D5E] rotate-45 shadow-sm scale-105"
                                    : "bg-[#0B3D5E]/8 text-[#0B3D5E] group-hover:bg-[#FBBF24] group-hover:text-[#0B3D5E] group-hover:scale-105"
                                }`}
                              >
                                <Plus className="w-4 h-4 transition-transform duration-300" />
                              </div>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 sm:px-6 pb-6 pt-0">
                                    <div className="w-full h-px bg-gradient-to-r from-[#FBBF24]/60 via-slate-100 to-transparent mb-4" />
                                    <p className="text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>

                  {/* Left & Right Pagination Controls (Matches Reference Image) */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-3 pt-4 px-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:border-[#FBBF24] text-[#0B3D5E] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        aria-label="Previous questions"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:border-[#FBBF24] text-[#0B3D5E] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        aria-label="Next questions"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <span className="text-xs font-bold text-slate-500 ml-2">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: "Any Question?" Interactive Concierge Box (5 cols on lg, sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Golden ambient warm glow behind card */}
                <div className="absolute -inset-2 bg-gradient-to-b from-[#FBBF24]/20 via-[#F59E0B]/12 to-[#FBBF24]/20 rounded-[3rem] blur-2xl opacity-75 pointer-events-none" />

                <div className="relative rounded-[2.5rem] bg-white/95 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(11,61,94,0.09),0_0_0_1.5px_rgba(251,191,36,0.25)] text-center overflow-hidden">

                  {/* Avatar / Illustration: Comes from Up to Down */}
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative mx-auto w-36 h-36 sm:w-44 sm:h-44 mb-2 flex items-center justify-center"
                  >
                    <img
                      src="/images/faq-ask-illustration.png"
                      alt="Thinking question illustration"
                      className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
                    />
                  </motion.div>

                  {/* "Any Question?" Title: Comes from Right to Left */}
                  <motion.h3
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="text-2xl sm:text-3xl font-serif font-black text-[#0B3D5E] mb-2 tracking-tight"
                  >
                    Any Question?
                  </motion.h3>

                  {/* Description: Comes from Left to Inside */}
                  <motion.p
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="text-slate-500 text-xs sm:text-sm mb-6 max-w-xs mx-auto leading-relaxed"
                  >
                    You can ask anything you want to know about Ocean Air, room choices, surf lessons, or island experiences.
                  </motion.p>

                  {/* Contact Us Button: Comes from Down to Up */}
                  <motion.div
                    initial={{ opacity: 0, y: 45 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="pt-2"
                  >
                    <Link href="/contact" className="block w-full">
                      <motion.button
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] hover:from-[#F59E0B] hover:to-[#FBBF24] text-[#0B3D5E] text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_10px_25px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_35px_rgba(251,191,36,0.5)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
                      >
                        <MessageCircle className="w-4 h-4 text-[#0B3D5E]" />
                        <span>Contact Us</span>
                        <ArrowRight className="w-4 h-4 text-[#0B3D5E] group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </motion.div>

                </div>
              </motion.div>
            </div>

          </div>

          {/* Premium Concierge Bottom Banner */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="mt-20 sm:mt-28 relative rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden p-8 sm:p-14 text-center shadow-[0_30px_70px_rgba(11,61,94,0.22)] border border-white/20 backdrop-blur-2xl bg-gradient-to-br from-[#052439] via-[#0B3D5E] to-[#052439] text-white"
          >
            {/* Ambient warm glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FBBF24]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              {/* Badge: comes from right side to inside */}
              <motion.div
                initial={{ opacity: 0, x: 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#FBBF24] text-[10px] font-black uppercase tracking-widest mb-4 cursor-default shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Personalized Concierge</span>
              </motion.div>

              {/* Title: word by word from left side */}
              <motion.h2
                variants={bannerHeadlineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white mb-4 leading-tight flex items-center justify-center gap-x-2.5 sm:gap-x-3.5 flex-wrap"
              >
                {["Still", "have", "questions?"].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={bannerWordVariants}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>

              {/* Subtitle: comes from bottom to up smoothly */}
              <motion.p
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="text-white/80 text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed font-normal max-w-lg mx-auto"
              >
                If you couldn't find what you're looking for, our barefoot luxury team is standing by to assist you with custom arrangements, surf inquiries, and travel planning.
              </motion.p>

              {/* Buttons Row: Left button from left, right button from right */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Left Button: comes from left side */}
                <motion.a
                  initial={{ opacity: 0, x: -70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  style={{ willChange: "transform, opacity" }}
                  href="/contact"
                  className="w-full sm:w-auto bg-[#FBBF24] hover:bg-white text-[#0B3D5E] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black tracking-wider text-xs uppercase transition-colors duration-300 shadow-[0_4px_25px_rgba(251,191,36,0.35)] hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#0B3D5E]" />
                  <span>Contact Concierge</span>
                </motion.a>

                {/* Right Button: comes from right side */}
                <motion.a
                  initial={{ opacity: 0, x: 70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  style={{ willChange: "transform, opacity" }}
                  href="https://wa.me/94765791763"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white/10 text-white backdrop-blur-md border border-white/25 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black tracking-wider text-xs uppercase hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
                >
                  <span>WhatsApp Us</span>
                  <ArrowRight className="w-4 h-4 text-[#FBBF24]" />
                </motion.a>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
