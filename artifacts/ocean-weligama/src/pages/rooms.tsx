import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListRooms, ListRoomsType } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  BedDouble, 
  Square, 
  ArrowRight, 
  Wind, 
  Wifi, 
  Coffee, 
  Waves, 
  LayoutGrid, 
  Compass, 
  Palmtree, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { SEO, StructuredData } from "@/seo";

const ROOM_CATEGORIES = [
  { value: "", label: "All Spaces", icon: LayoutGrid },
  { value: "solo", label: "Solo Traveler Packages", icon: Compass },
  { value: "couples", label: "Two Person Packages", icon: BedDouble },
  { value: "family", label: "Family Accommodation", icon: Palmtree },
];

const ITEMS_PER_PAGE = 6;

const heroContentVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

const heroEyebrowVariants: any = {
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

const heroHeadlineVariants: any = {
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

const heroSubtitleVariants: any = {
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

const heroCtaVariants: any = {
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

const perksContainerVariants: any = {
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

const perkItemVariants: any = {
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
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const filterDockVariants: any = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
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
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const roomCardLeftVariants: any = {
  hidden: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: (i % 3) * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const roomCardRightVariants: any = {
  hidden: {
    opacity: 0,
    x: 60,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: (i % 3) * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const cardPanelContainerVariants: any = {
  hidden: {
    opacity: 0,
    y: 15,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardDetailsRightVariants: any = {
  hidden: {
    opacity: 0,
    x: 35,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      delay: 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardTitleLeftVariants: any = {
  hidden: {
    opacity: 0,
    x: -35,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      delay: 0.14,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardPriceRightVariants: any = {
  hidden: {
    opacity: 0,
    x: 25,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardBookButtonLeftVariants: any = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cardSeeMoreButtonRightVariants: any = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: 0.14,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function RoomsPage() {
  const { formatPrice } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Since we don't have category filtering natively in the hook API yet, we fetch all and filter client side
  const { data: rooms, isLoading } = useListRooms();

  const getCount = (catValue: string) => {
    if (!rooms || !Array.isArray(rooms)) return 0;
    if (catValue === "") return rooms.length;
    return rooms.filter((r: any) => r.category === catValue).length;
  };

  const filteredRooms = (Array.isArray(rooms) ? rooms : []).filter((r: any) => {
    if (!activeCategory) return true;
    return r.category === activeCategory;
  });

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const safeCurrentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategorySelect = (catValue: string) => {
    setActiveCategory(catValue);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== safeCurrentPage) {
      setCurrentPage(newPage);
      const el = document.getElementById("sanctuary-box");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#FBBF24] selection:text-[#0B3D5E] overflow-x-hidden">
      <SEO
        title="Luxury Rooms & Ocean View Suites in Weligama"
        description="Explore luxury oceanfront rooms, beach villas & surfer suites at Ocean Air Weligama. 100 steps from the ocean in Weligama Bay, Sri Lanka."
        canonicalPath="/rooms"
        keywords={["Weligama Rooms", "Ocean View Suite Weligama", "Weligama Beach Villa", "Weligama Hotel Rooms", "Weligama Accommodation"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Rooms & Suites", item: "/rooms" },
        ]}
      />

      {/* Cinematic Morning Coffee Video Hero Section */}
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
            poster="/images/rooms-hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
          >
            <source src="/videos/rooms-hero-video.mp4" type="video/mp4" />
            <source src="/videos/Woman_enjoying_morning_coffee_on…_58c182c1_1080p.mp4" type="video/mp4" />
          </video>

          {/* Deep coastal ocean overlay for supreme text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/75 via-[#0B3D5E]/40 to-[#052439]/90" />

          {/* Golden sunrise ambient warmth matching hotel logo yellow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.55)_100%)] pointer-events-none" />

          {/* Bottom subtle edge fade transitioning smoothly into the rooms grid */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
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
            <Coffee className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Private Coastal Sanctuaries</span>
          </motion.div>

          {/* Main Headline - From Right Side */}
          <motion.h1
            variants={heroHeadlineVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            Wake Up to the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#F59E0B] drop-shadow-[0_2px_20px_rgba(251,191,36,0.5)]">
              Ocean Breeze
            </span>
          </motion.h1>

          {/* Subtitle - From Left Side */}
          <motion.p
            variants={heroSubtitleVariants}
            className="mt-5 text-white/85 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md font-sans"
          >
            Thoughtfully curated accommodations tailored for serene coastal relaxation, private balconies, and ocean breezes just 100 steps from Weligama Bay.
          </motion.p>

          {/* Action CTA - From Bottom to Up */}
          <motion.div
            variants={heroCtaVariants}
            className="mt-8 sm:mt-10 flex items-center justify-center relative z-20"
          >
            <button
              onClick={() => {
                const el = document.getElementById("rooms-grid");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:bg-white hover:text-[#0B3D5E] transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
            >
              <span>Explore Our Rooms</span>
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
              <Waves className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>100 Steps to Surf Break</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Coffee className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Fresh Breakfast Included</span>
            </motion.div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Wind className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Private Ocean Balconies</span>
            </motion.div>
            <div className="hidden lg:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Wifi className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Fast Wi-Fi &amp; Modern AC</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Mood Filters (Luminous Transparent Frosted Glass Dock) */}
      <section id="rooms-grid" className="relative z-20 px-4 pt-10 pb-4 max-w-full scroll-mt-24">
        <div className="container mx-auto flex flex-col items-center">
          {/* Luminous Frosted Glass Pill Dock Container - Smooth Upward Entrance on Scroll */}
          <motion.div
            variants={filterDockVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-50px" }}
            className="relative max-w-full"
          >
            {/* Ambient Warm Golden & Coastal Glow behind the Dock */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FBBF24]/25 via-[#F59E0B]/20 to-[#FBBF24]/25 rounded-full blur-xl opacity-80 pointer-events-none" />

            <div className="relative rounded-[2rem] sm:rounded-full bg-white/85 backdrop-blur-2xl border border-white/95 p-1.5 sm:p-2 shadow-[0_20px_50px_-15px_rgba(11,61,94,0.08),0_4px_20px_rgba(251,191,36,0.08)] flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-1.5">
              {ROOM_CATEGORIES.map((t) => {
                const isActive = activeCategory === t.value;
                const count = getCount(t.value);
                const IconComponent = t.icon;

                return (
                  <button
                    key={t.value}
                    onClick={() => handleCategorySelect(t.value)}
                    className={`relative flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors duration-300 cursor-pointer select-none group ${
                      isActive
                        ? "text-[#0B3D5E] font-black"
                        : "text-[#0B3D5E]/70 hover:text-[#0B3D5E] hover:bg-white/60"
                    }`}
                  >
                    {/* Animated Sliding Pill Highlight Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeRoomCategoryTab"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] shadow-[0_6px_20px_rgba(251,191,36,0.35)]"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35
                        }}
                      />
                    )}

                    {/* Category Icon */}
                    <span className="relative z-10 flex items-center">
                      <IconComponent
                        className={`w-3.5 h-3.5 transition-colors duration-300 ${
                          isActive ? "text-[#0B3D5E]" : "text-[#D97706]/70 group-hover:text-[#D97706]"
                        }`}
                      />
                    </span>

                    {/* Category Label */}
                    <span className="relative z-10 whitespace-nowrap">
                      {t.label}
                    </span>

                    {/* Count Pill Badge */}
                    <span
                      className={`relative z-10 flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-black transition-all duration-300 ${
                        isActive
                          ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Sanctuary Showcase (Transparent Glassmorphic Box) */}
      <section id="sanctuary-box" className="py-8 sm:py-12 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] flex-1 scroll-mt-24">
        {/* Main Transparent Frosted Glass Showcase Box */}
        <div className="relative rounded-[2.5rem] sm:rounded-[3rem] bg-white/65 backdrop-blur-2xl border border-white/80 p-5 sm:p-8 lg:p-10 shadow-[0_24px_70px_-20px_rgba(11,61,94,0.1),0_4px_25px_rgba(251,191,36,0.05)] overflow-hidden">
          {/* Ambient Corner Radial Warmth */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#0B3D5E]/08 rounded-full blur-3xl pointer-events-none" />

          {/* Top Subtle Info / Status Bar inside the Box */}
          <div className="relative z-10 flex items-center justify-end pb-4 mb-6 border-b border-slate-200/50">
            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="font-extrabold text-[#0B3D5E]">{filteredRooms.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredRooms.length)}</span> of <span className="font-extrabold text-[#0B3D5E]">{filteredRooms.length}</span> rooms
            </div>
          </div>

          {/* Grid Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[490px] rounded-[2.2rem]" />
              ))}
            </div>
          ) : Array.isArray(paginatedRooms) && paginatedRooms.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`page-${safeCurrentPage}-${activeCategory}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-9"
                >
                  {paginatedRooms.map((room: any, idx: number) => (
                    <RoomCard key={room.id} room={room} idx={idx} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* High-Quality Pagination Controls at the End of the Box */}
              {totalPages > 1 && (
                <div className="relative z-10 mt-10 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Left: Page Counter Indicator */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Page <span className="font-black text-[#0B3D5E]">{safeCurrentPage}</span> of <span className="font-black text-[#0B3D5E]">{totalPages}</span>
                  </div>

                  {/* Right / Center: Sleek Interactive Pagination Dock */}
                  <div className="flex items-center gap-2">
                    {/* Previous Page Arrow */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage <= 1}
                      aria-label="Previous Page"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        safeCurrentPage <= 1
                          ? "opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200"
                          : "bg-white hover:bg-[#FBBF24] text-[#0B3D5E] border border-slate-200/80 hover:border-[#FBBF24] shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 -translate-x-0.5" />
                    </button>

                    {/* Page Numbers with Animated Spring Yellow Pill */}
                    <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 border border-slate-200/70 shadow-inner">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isActive = pageNum === safeCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            aria-label={`Go to page ${pageNum}`}
                            aria-current={isActive ? "page" : undefined}
                            className={`relative min-w-[38px] h-9 px-3 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer select-none ${
                              isActive
                                ? "text-[#0B3D5E] font-black"
                                : "text-slate-600 hover:text-[#0B3D5E] hover:bg-white/80"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeRoomPaginationTab"
                                className="absolute inset-0 rounded-full bg-[#FBBF24] shadow-[0_4px_14px_rgba(251,191,36,0.45)]"
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 35
                                }}
                              />
                            )}
                            <span className="relative z-10">{pageNum}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Page Arrow */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(safeCurrentPage + 1)}
                      disabled={safeCurrentPage >= totalPages}
                      aria-label="Next Page"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        safeCurrentPage >= totalPages
                          ? "opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200"
                          : "bg-white hover:bg-[#FBBF24] text-[#0B3D5E] border border-slate-200/80 hover:border-[#FBBF24] shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 px-4 max-w-lg mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/30 flex items-center justify-center mx-auto mb-4 text-[#0B3D5E] shadow-sm">
                <Palmtree className="w-7 h-7 text-[#D97706]" />
              </div>
              <h3 className="text-2xl font-serif font-black text-[#0B3D5E] mb-2">No sanctuaries in this category</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                All our private rooms feature coastal breezes and serene comfort. Explore our other spaces or contact our concierge for customized arrangements.
              </p>
              <button
                onClick={() => handleCategorySelect("")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_4px_16px_rgba(251,191,36,0.3)] hover:shadow-[0_8px_24px_rgba(251,191,36,0.45)] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300 cursor-pointer"
              >
                <span>View All Spaces</span>
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function RoomCard({ room, idx }: { room: any; idx: number }) {
  const { formatPrice } = useLanguage();
  const [, setLocation] = useLocation();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Safely extract all available images from heroImageUrl, images array, and gallery array
  const allImages = Array.from(
    new Set(
      [
        room.heroImageUrl,
        ...(Array.isArray(room.images) ? room.images.map((i: any) => typeof i === "string" ? i : i?.url) : []),
        ...(Array.isArray(room.gallery) ? room.gallery.map((g: any) => typeof g === "string" ? g : g?.url) : [])
      ].filter(Boolean)
    )
  );

  const images = allImages.length > 0 ? allImages : ["/images/gallery-room-luxury.jpg"];
  const effectivePrice = room.adjustedPrice || room.basePricePerNight;
  const originalPrice = room.originalPrice || room.basePricePerNight;
  const hasDiscount = room.adjustedPrice && parseFloat(room.adjustedPrice) < parseFloat(originalPrice);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex(index);
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      localStorage.setItem("booking_roomIds", JSON.stringify([room.id]));
      localStorage.setItem("booking_stepId", JSON.stringify("dates"));
      localStorage.removeItem("booking_matrixPrice");
      localStorage.removeItem("booking_serviceIds");
      localStorage.removeItem("booking_serviceQuantities");
      localStorage.removeItem("booking_highlightCustom");
    } catch (err) {
      console.warn("Could not save booking state to localStorage", err);
    }
    setLocation(`/book?room=${room.id}&step=dates`);
  };

  const handleSeeMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocation(`/rooms/${room.slug}`);
  };

  const handleCardClick = () => {
    setLocation(`/rooms/${room.slug}`);
  };

  const isRowEven = Math.floor(idx / 3) % 2 === 0;

  return (
    <motion.div
      custom={idx}
      variants={isRowEven ? roomCardLeftVariants : roomCardRightVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      className="group relative h-full flex flex-col"
    >
      <div 
        onClick={handleCardClick}
        className="h-full block cursor-pointer"
      >
        <div className="relative h-[490px] sm:h-[520px] rounded-[2.2rem] sm:rounded-[2.6rem] overflow-hidden shadow-[0_12px_35px_rgba(11,61,94,0.08)] hover:shadow-[0_24px_55px_rgba(251,191,36,0.22)] border border-slate-200/80 hover:border-[#FBBF24]/70 transition-all duration-500 bg-slate-900 flex flex-col justify-between">
          {/* Main Photo with Smooth Pop-Up Animation */}
          <div className="absolute inset-0 overflow-hidden bg-slate-950">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={images[currentImgIndex]}
                src={images[currentImgIndex]}
                alt={`${room.name} - Photo ${currentImgIndex + 1}`}
                initial={{ opacity: 0, scale: 0.92, filter: "brightness(0.92)" }}
                animate={{ opacity: 1, scale: 1, filter: "brightness(1)" }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1]
                }}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                style={{ willChange: "transform, opacity" }}
              />
            </AnimatePresence>
          </div>

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent opacity-65 pointer-events-none" />
          <div className="absolute inset-0 bg-[#FBBF24]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Top Bar: Badges & Photo Counter */}
          <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between pointer-events-none">
            <div>
              {room.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-sm">
                  Featured
                </span>
              )}
            </div>

            {/* Photo Counter */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {images.length > 1 && (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentImgIndex}
                    initial={{ opacity: 0, scale: 0.85, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 shadow-sm tracking-wider"
                  >
                    {currentImgIndex + 1} / {images.length}
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* Left & Right Interactive Navigation Arrows */}
          {images.length > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous room photo"
                className="absolute left-3 top-[36%] -translate-y-1/2 z-20 w-8.5 h-8.5 rounded-full bg-black/50 hover:bg-[#FBBF24] text-white hover:text-[#0B3D5E] backdrop-blur-md border border-white/30 hover:border-[#FBBF24] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 -translate-x-0.5" />
              </button>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next room photo"
                className="absolute right-3 top-[36%] -translate-y-1/2 z-20 w-8.5 h-8.5 rounded-full bg-black/50 hover:bg-[#FBBF24] text-white hover:text-[#0B3D5E] backdrop-blur-md border border-white/30 hover:border-[#FBBF24] flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-115 active:scale-90 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 translate-x-0.5" />
              </button>

              {/* Mini Dot Indicators */}
              <div className="absolute top-[52%] inset-x-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
                {images.slice(0, 6).map((_: string, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => handleDotClick(e, i)}
                    aria-label={`Go to photo ${i + 1}`}
                    className={`rounded-full transition-all duration-300 border-none cursor-pointer shadow-sm ${
                      i === currentImgIndex
                        ? "w-4 h-1 bg-[#FBBF24]"
                        : "w-1 h-1 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Bottom Floating Frosted Glass Card Panel */}
          <motion.div 
            variants={cardPanelContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            className="relative z-10 m-3 sm:m-4 p-4 sm:p-5 rounded-[1.6rem] sm:rounded-[1.8rem] bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_12px_35px_rgba(0,0,0,0.35)] group-hover:border-[#FBBF24]/60 group-hover:bg-black/70 transition-colors duration-300 overflow-hidden"
          >
            {/* Micro Capacity & Bed Row - Comes from Right Side */}
            <motion.div 
              variants={cardDetailsRightVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              style={{ willChange: "transform, opacity" }}
              className="flex items-center gap-2.5 text-white/85 text-[10.5px] font-bold uppercase tracking-wider mb-2"
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FBBF24]" />
                {room.maxGuests} Guests
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-[#FBBF24]" />
                {room.bedrooms} {room.bedrooms === 1 ? "Bed" : "Beds"}
              </span>
            </motion.div>

            {/* Room Name - Comes from Left Side */}
            <motion.h3 
              variants={cardTitleLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              style={{ willChange: "transform, opacity" }}
              className="text-base sm:text-lg md:text-[18px] font-serif font-black text-white leading-snug mb-3.5 group-hover:text-[#FBBF24] transition-colors duration-300 drop-shadow-sm line-clamp-2"
            >
              {room.name}
            </motion.h3>

            {/* Price & Action Button Row */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-white/15">
              {/* Room Price Section - Comes from Right Side */}
              <motion.div 
                variants={cardPriceRightVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                style={{ willChange: "transform, opacity" }}
                className="flex flex-col min-w-[85px]"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FBBF24]">
                  Starting from
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {formatPrice(effectivePrice)}
                  </span>
                  <span className="text-[11px] text-white/70 font-medium">/ night</span>
                  {hasDiscount && (
                    <span className="text-[11px] line-through text-white/45 ml-1">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons: Book Now & See More */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Book Now Button - Comes from Left Side */}
                <motion.button
                  variants={cardBookButtonLeftVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ willChange: "transform, opacity" }}
                  type="button"
                  onClick={handleBookNow}
                  aria-label={`Book ${room.name} now`}
                  className="px-3.5 sm:px-4 py-2 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0B3D5E] font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_4px_16px_rgba(251,191,36,0.35)] hover:shadow-[0_8px_24px_rgba(251,191,36,0.5)] transition-[background-color,box-shadow] duration-200 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0B3D5E]" />
                  <span>Book Now</span>
                </motion.button>

                {/* See More Button - Comes from Right Side */}
                <motion.button
                  variants={cardSeeMoreButtonRightVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  style={{ willChange: "transform, opacity" }}
                  type="button"
                  onClick={handleSeeMore}
                  aria-label={`See more details for ${room.name}`}
                  className="px-3 sm:px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/25 hover:border-white/50 backdrop-blur-md font-bold text-[11px] sm:text-xs tracking-wide transition-[background-color,border-color,color,box-shadow] duration-200 flex items-center gap-1 cursor-pointer shadow-sm hover:shadow"
                >
                  <span>See More</span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Subtle bottom golden highlight line on hover */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </motion.div>
  );
}
