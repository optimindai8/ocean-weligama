import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useListServices, type Service } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Waves, Check, Compass, HelpCircle, Coffee, ShieldCheck, Palmtree, Award } from "lucide-react";
import { PackageComparisonTable } from "@/components/PackageComparisonTable";
import { MatrixPricingTable } from "@/components/MatrixPricingTable";
import { StayInStyleSection } from "@/components/stay-in-style-section";
import { ExperienceCarousel } from "@/components/ExperienceCarousel";
import { SEO, StructuredData } from "@/seo";

/* ─── Hero Motion Variants (Matches Luxury Rooms Experience) ───────────────── */
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

/* ─── Motion Variants for Experience Weligama Section ─────────────────────── */
const curateBadgeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 80,
    transition: {
      duration: 0.25,
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

const curateWordsContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const curateWordItemVariants: Variants = {
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

const curateDescVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 80,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      delay: 0.44,
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

export default function PackagesPage() {
  const { data: rawServices, isLoading } = useListServices();
  const services = rawServices as Service[] | undefined;
  
  // Separate main packages vs optional packages
  const optionalPackages = services?.filter(s => s.type === "optional" && s.isActive) || [];
  const experienceServices = optionalPackages.filter(s => !s.category?.toLowerCase().includes("package"));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0B3D5E] overflow-hidden">
      <SEO
        title="Surf Packages & Wellness Retreats in Weligama"
        description="All-inclusive surf lessons, scooter rental, whale watching & wellness packages at Ocean Air Weligama. Book direct for exclusive rate guarantees."
        canonicalPath="/packages"
        keywords={["Weligama Surf Package", "Weligama Wellness Retreat", "Surf Lessons Weligama", "Weligama Hotel Package Deals"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Packages & Experiences", item: "/packages" },
        ]}
      />

      {/* Cinematic Packages Video Hero Section */}
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
            poster="/images/packages-hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
          >
            <source src="/videos/package-hero-video.mp4" type="video/mp4" />
            <source src="/videos/Package Video.mp4" type="video/mp4" />
          </video>

          {/* Deep coastal ocean overlay for supreme text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/78 via-[#0B3D5E]/45 to-[#052439]/92" />

          {/* Golden sunrise ambient warmth matching hotel logo yellow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.55)_100%)] pointer-events-none" />

          {/* Bottom subtle edge fade transitioning smoothly into the packages section */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#EDF3F8] via-[#EDF3F8]/40 to-transparent pointer-events-none" />
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
            <Palmtree className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Curated Coastal Experiences</span>
          </motion.div>

          {/* Main Headline - From Right Side */}
          <motion.h1
            variants={heroHeadlineVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            Curated Packages for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#F59E0B] drop-shadow-[0_2px_20px_rgba(251,191,36,0.5)]">
              Coastal Living
            </span>
          </motion.h1>

          {/* Subtitle - From Left Side */}
          <motion.p
            variants={heroSubtitleVariants}
            className="mt-5 text-white/85 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md font-sans"
          >
            Thoughtfully tailored packages combining private oceanfront stays, guided surf coaching, fresh island dining, and bespoke wellness retreats just 100 steps from Weligama Bay.
          </motion.p>

          {/* Action CTAs - From Bottom to Up */}
          <motion.div
            variants={heroCtaVariants}
            className="mt-8 sm:mt-10 flex items-center justify-center gap-4 flex-wrap relative z-20"
          >
            <button
              onClick={() => {
                const el = document.getElementById("packages-overview");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:bg-white hover:text-[#0B3D5E] transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("experience-section") || document.getElementById("matrix-pricing-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#FBBF24]" />
              <span>Custom Experiences</span>
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
              <Award className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Surf Coaching &amp; Gear</span>
            </motion.div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Coffee className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Daily Fresh Breakfast Included</span>
            </motion.div>
            <div className="hidden lg:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <ShieldCheck className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Direct Booking Rate Guarantee</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Comparison Table Section */}
      <section
        id="packages-overview"
        className="relative overflow-hidden w-full py-12 sm:py-16 md:py-20 border-t border-[#0B3D5E]/5 scroll-mt-24"
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

      {experienceServices.length > 0 && (
        <section
          id="experience-section"
          className="py-12 sm:py-16 md:py-20 relative overflow-hidden border-t border-[#0B3D5E]/5 scroll-mt-24"
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
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 relative z-10 space-y-3"
              >
                {/* Badge pill - Comes from right side */}
                <motion.div
                  variants={curateBadgeVariants}
                  style={{ willChange: "transform, opacity" }}
                  className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#0B3D5E] text-[11px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-sm mb-1"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                  <Compass className="w-3.5 h-3.5 text-[#0B3D5E]" />
                  <span>Experience Weligama</span>
                </motion.div>

                {/* Heading - Words come one by one from left side */}
                <motion.h2
                  variants={curateWordsContainerVariants}
                  className="text-3xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
                >
                  <motion.span variants={curateWordItemVariants} style={{ willChange: "transform, opacity" }} className="inline-block">Curate</motion.span>
                  <motion.span variants={curateWordItemVariants} style={{ willChange: "transform, opacity" }} className="inline-block">Your</motion.span>
                  <motion.span
                    variants={curateWordItemVariants}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                  >
                    Perfect
                  </motion.span>
                  <motion.span
                    variants={curateWordItemVariants}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]"
                  >
                    Stay
                  </motion.span>
                </motion.h2>

                {/* Subtle Golden Accent Flourish */}
                <motion.div
                  variants={{
                    hidden: { scaleX: 0, opacity: 0 },
                    visible: { 
                      scaleX: 1, 
                      opacity: 1, 
                      transition: { delay: 0.38, duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
                    }
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className="w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto mb-3"
                />

                {/* Description - Comes from right side */}
                <motion.p
                  variants={curateDescVariants}
                  style={{ willChange: "transform, opacity" }}
                  className="text-slate-600 font-medium text-sm md:text-base max-w-xl mx-auto leading-relaxed px-4"
                >
                  Everything you need for the perfect coastal escape — handcrafted excursions, surf sessions, and mindful wellness.
                </motion.p>
              </motion.div>

              {/* Grid of Experiences */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                {experienceServices.map((exp, idx) => (
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
            </motion.div>
          </div>
        </section>
      )}

      {/* Curated Coastal Experiences Moveable Showcase (Matching user reference) */}
      <ExperienceCarousel />

      <Footer />
    </div>
  );
}
