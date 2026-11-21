import { useMemo, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useGetService, useListServices } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Check, Compass, Waves, ShieldCheck, Star, Calendar, MessageCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { SEO } from "@/seo/SEO";
import { StructuredData } from "@/seo/StructuredData";

const getExperienceIcon = (slugOrName: string) => {
  const s = slugOrName.toLowerCase();
  if (s.includes('whale')) return '/icons/whale/whale-spout.png';
  if (s.includes('surf') || s.includes('wave')) return '/icons/surf/surf-rider.png';
  if (s.includes('yoga') || s.includes('meditat') || s.includes('mind')) return '/icons/yoga/yoga-meditation.png';
  if (s.includes('safari') || s.includes('wild') || s.includes('yala') || s.includes('park')) return '/icons/safari/safari-pink-jeep.png';
  if (s.includes('scooter') || s.includes('bike') || s.includes('vespa')) return '/icons/scooter/scooter-vintage.png';
  if (s.includes('cook') || s.includes('culinary') || s.includes('food') || s.includes('meal')) return '/icons/cooking/cooking-chef.png';
  return null;
};

// Smooth high-performance price counter triggered on scroll
function PriceCountUp({ price }: { price: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  const numeric = parseFloat(price) || 0;
  const hasDecimals = price.includes('.');
  const decimalCount = hasDecimals ? (price.split('.')[1]?.length || 2) : 0;

  useEffect(() => {
    if (!ref.current) return;
    if (!isInView) {
      ref.current.textContent = (0).toFixed(decimalCount);
      return;
    }

    const duration = 1200;
    const startVal = 0;
    const startTime = performance.now();
    let frameId: number;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = startVal + (numeric - startVal) * easeOutExpo(progress);

      if (ref.current) {
        ref.current.textContent = decimalCount > 0 ? current.toFixed(decimalCount) : Math.round(current).toString();
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      } else if (ref.current) {
        ref.current.textContent = price;
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, numeric, price, decimalCount]);

  return <span ref={ref}>{price}</span>;
}

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading } = useGetService(slug ?? "");
  const { data: allServices } = useListServices();

  // Curated companion experiences dynamically controlled via Admin Panel toggle ("Show in More Experiences You May Love")
  const relatedExperiences = useMemo(() => {
    if (!allServices || !Array.isArray(allServices)) return [];
    
    // Only display experiences that have been explicitly enabled in the Admin Panel toggle
    return allServices.filter(
      (s: any) => s.slug !== slug && s.isActive !== false && Boolean(s.showInRelated)
    );
  }, [allServices, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="pt-32 container mx-auto px-4 py-16 space-y-6 max-w-3xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="pt-32 container mx-auto px-4 text-center py-24">
          <h1 className="text-3xl font-bold text-foreground mb-4">Package not found</h1>
          <Link href="/packages">
            <Button variant="outline">Browse all packages</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#0B3D5E] selection:text-white overflow-x-hidden">
      <SEO 
        title={`${service.name} — Surf & Stay Experiences`}
        description={service.description?.slice(0, 160).replace(/\s+/g, ' ') + '...' || `Book ${service.name} at Ocean Air Weligama. Enjoy luxury sea-view suites, surf lessons, airport transfers & custom barefoot luxury tours.`}
        canonicalPath={`/packages/${slug}`}
        keywords={[`${service.name}`, `Weligama ${service.name}`, "Surf Packages Weligama", "Ocean Air Experiences"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Experiences", item: "/packages" },
          { name: service.name, item: `/packages/${slug}` },
        ]}
        service={{
          slug: service.slug || slug,
          name: service.name,
          description: service.description,
          price: (service as any).price,
          category: service.category,
        }}
      />

      {/* Hero Section: Luxury Transparent Psychologically Attractive Sanctuary */}
      <section
        className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 w-full overflow-hidden"
        style={{ background: 'linear-gradient(175deg, #FFFFFF 0%, #FFFDF8 35%, #F4F8FA 70%, #EDF3F8 100%)' }}
      >
        {/* Soft glowing ambient orbs matching logo yellow & ocean navy */}
        <div className="absolute top-[8%] right-[-5%] w-[550px] h-[550px] bg-[#FBBF24]/14 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#0B3D5E]/08 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#FBBF24]/08 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl lg:max-w-7xl">
          {/* Back Navigation Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center sm:justify-start mb-8 sm:mb-10"
          >
            <Link href="/packages">
              <button
                className="group inline-flex items-center gap-2.5 text-slate-600 hover:text-[#0B3D5E] px-5 py-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-white/90 hover:border-[#FBBF24]/70 shadow-[0_4px_16px_rgba(11,61,94,0.06)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.25)] transition-all duration-300 text-[11px] uppercase tracking-[0.2em] font-black cursor-pointer select-none"
                data-testid="link-back-packages"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#D97706] group-hover:-translate-x-1 transition-transform" />
                <span>Back to Experiences</span>
              </button>
            </Link>
          </motion.div>

          {/* ── Transparent Psychologically Attractive Sanctuary Card (Expanded Width) ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0, y: 35 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] border border-white/85 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.25)_inset] backdrop-blur-2xl p-8 sm:p-12 md:p-14 lg:p-16 flex flex-col items-center text-center w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(254,251,243,0.80) 45%, rgba(245,249,252,0.90) 100%)',
            }}
          >
            {/* Ambient shimmer sweep animation */}
            <motion.div
              className="absolute inset-0 w-[45%] pointer-events-none z-0"
              style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)', skewX: '-15deg' }}
              animate={{ x: ['-160%', '350%'] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
            />

            {/* Top golden hairline accent line */}
            <div
              className="absolute top-0 left-12 right-12 h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
            />

            {/* Corner warmth */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FBBF24]/16 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#0B3D5E]/06 rounded-full blur-3xl pointer-events-none" />

            {/* ── 1. The Visual Focal Jewel (Custom Icon or 3D Emoji) - Slides Down from Top ── */}
            {(() => {
              const matchedIcon = getExperienceIcon(service.slug || service.name);
              return (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -60, scale: 0.9 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="relative mb-6 z-10"
                >
                  {/* Ambient Golden Yellow Halo */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#FBBF24]/30 via-[#F59E0B]/20 to-[#FBBF24]/30 rounded-full blur-2xl opacity-75 pointer-events-none" />

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-[2rem] sm:rounded-[2.4rem] bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7]/60 border-2 border-[#FBBF24]/60 shadow-[0_16px_45px_rgba(251,191,36,0.28),0_0_0_1px_rgba(255,255,255,0.9)_inset] backdrop-blur-2xl flex items-center justify-center p-5 sm:p-6 transition-transform duration-300 hover:scale-105"
                  >
                    {matchedIcon ? (
                      <img
                        src={matchedIcon}
                        alt={service.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(11,61,94,0.12)] transition-transform duration-500 hover:scale-110"
                      />
                    ) : service.iconEmoji ? (
                      <span className="text-5xl sm:text-6xl md:text-7xl select-none filter drop-shadow-[0_6px_12px_rgba(11,61,94,0.15)]">{service.iconEmoji}</span>
                    ) : (
                      <Compass className="w-12 h-12 text-[#0B3D5E]" />
                    )}

                    {/* Coastal emblem on corner */}
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#FBBF24] border-2 border-white shadow-md flex items-center justify-center text-[#0B3D5E]">
                      <Waves className="w-3.5 h-3.5 text-[#0B3D5E]" />
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}

            {/* ── 2. Category Pill Badge matching logo palette - Slides in from Right ── */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 60 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.22em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 shadow-sm mb-4 relative z-10"
            >
              <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
              <span>{service.category || (service.type === "main" ? "Signature Package" : "Curated Experience")}</span>
              <span className="text-[#0B3D5E]/40">•</span>
              <span className="text-[10px] text-[#D97706] font-bold">Ocean Air Weligama</span>
            </motion.div>

            {/* ── 3. High-Status Serif Headline - Word by Word from Left ── */}
            <motion.h1
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.16 },
                },
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-[#0B3D5E] mb-4 drop-shadow-sm max-w-4xl leading-[1.1] tracking-tight relative z-10 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1"
            >
              {service.name.split(" ").map((word: string, i: number) => (
                <motion.span
                  key={`${word}-${i}`}
                  variants={{
                    hidden: { opacity: 0, x: -45 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtle Golden Accent Flourish */}
            <motion.div
              variants={{
                hidden: { scaleX: 0, opacity: 0 },
                visible: {
                  scaleX: 1,
                  opacity: 1,
                  transition: { delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              style={{ transformOrigin: 'center' }}
              className="w-20 h-1 rounded-full bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto mb-5 relative z-10"
            />

            {/* ── 4. Evocative Subtitle Description - from Down to Up ── */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.85, delay: 0.34, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="text-slate-600 font-medium text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed mb-0 sm:mb-2 relative z-10"
            >
              {service.shortDesc || "Handcrafted coastal journeys curated steps from Weligama Bay. Experience dynamic waters, mindful moments, and unforgettable island adventures."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 relative bg-gradient-to-b from-[#EDF3F8] via-[#F7F9FB] to-[#FFFFFF]">
        {/* Very soft background glow for the content area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-white/60 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Left Column (Details) */}
            <div className="lg:col-span-2 space-y-10">
              
              {/* "About the experience" transparent psychologically attractive box */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] border border-white/85 shadow-[0_24px_70px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.22)_inset] backdrop-blur-2xl p-7 sm:p-10 md:p-12 transition-shadow duration-500 hover:shadow-[0_30px_85px_rgba(251,191,36,0.18)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(254,251,243,0.80) 45%, rgba(245,249,252,0.88) 100%)',
                }}
              >
                {/* Ambient shimmer sweep animation */}
                <motion.div
                  className="absolute inset-0 w-[45%] pointer-events-none z-0"
                  style={{
                    background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                    skewX: '-15deg',
                  }}
                  animate={{ x: ['-160%', '350%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
                />

                {/* Top golden hairline accent line */}
                <div
                  className="absolute top-0 inset-x-10 h-[2px] pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
                />

                {/* Corner ambient warmth */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#FBBF24]/14 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#0B3D5E]/05 rounded-full blur-3xl pointer-events-none" />

                {/* Curated Overview Pill - Slides smoothly from Right */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 60 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 mb-5 relative z-10 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.9)] shrink-0" />
                  <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Curated Overview</span>
                </motion.div>

                {/* Title with Compass Jewel - Slides smoothly from Left */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -60 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="flex items-center gap-3.5 mb-4 relative z-10"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7] border border-[#FBBF24]/60 flex items-center justify-center text-[#D97706] shadow-[0_4px_16px_rgba(251,191,36,0.2)] shrink-0">
                    <Compass className="w-5 h-5 text-[#D97706]" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight">
                    About this experience
                  </h2>
                </motion.div>

                {/* Golden Accent Flourish - Expands smoothly from Left */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scaleX: 0 },
                    visible: {
                      opacity: 1,
                      scaleX: 1,
                      transition: { duration: 0.65, delay: 0.16, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  style={{ transformOrigin: 'left center' }}
                  className="w-16 h-1 rounded-full bg-gradient-to-r from-[#FBBF24] to-transparent mb-6 relative z-10"
                />

                {/* Description Content - Slides smoothly from Bottom to Up */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 45 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="relative z-10 pt-1"
                >
                  <p className="text-slate-700 leading-relaxed sm:leading-loose text-base sm:text-lg md:text-xl font-normal whitespace-pre-line">
                    {service.description || "Indulge in a premium, handcrafted experience designed to elevate your stay at Ocean Weligama."}
                  </p>
                </motion.div>
              </motion.div>

              {/* What's Included: Transparent Smooth Psychologically Attractive Box */}
              {service.highlights && service.highlights.length > 0 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.15 }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] border border-white/85 shadow-[0_24px_70px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.22)_inset] backdrop-blur-2xl p-7 sm:p-10 md:p-12 transition-shadow duration-500 hover:shadow-[0_30px_85px_rgba(251,191,36,0.18)]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(254,251,243,0.80) 45%, rgba(245,249,252,0.88) 100%)',
                  }}
                >
                  {/* Ambient shimmer sweep animation */}
                  <motion.div
                    className="absolute inset-0 w-[45%] pointer-events-none z-0"
                    style={{
                      background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                      skewX: '-15deg',
                    }}
                    animate={{ x: ['-160%', '350%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                  />

                  {/* Top golden hairline accent line */}
                  <div
                    className="absolute top-0 inset-x-10 h-[2px] pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
                  />

                  {/* Corner ambient warmth */}
                  <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#FBBF24]/14 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#0B3D5E]/05 rounded-full blur-3xl pointer-events-none" />

                  {/* Pill Badge - Slides smoothly from Right */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 60 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 mb-5 relative z-10 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.9)] shrink-0" />
                    <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>Included With Experience</span>
                  </motion.div>

                  {/* Heading with Golden Check Jewel - Slides smoothly from Left */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -60 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="flex items-center gap-3.5 mb-3 relative z-10"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7] border border-[#FBBF24]/60 flex items-center justify-center text-[#D97706] shadow-[0_4px_16px_rgba(251,191,36,0.2)] shrink-0">
                      <Check className="w-5 h-5 text-[#0B3D5E] stroke-[2.75]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight">
                      What's Included
                    </h3>
                  </motion.div>

                  {/* Golden Accent Flourish - Expands smoothly from Left */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, scaleX: 0 },
                      visible: {
                        opacity: 1,
                        scaleX: 1,
                        transition: { duration: 0.65, delay: 0.14, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    style={{ transformOrigin: 'left center' }}
                    className="w-16 h-1 rounded-full bg-gradient-to-r from-[#FBBF24] to-transparent mb-4 relative z-10"
                  />

                  {/* Reassurance Subtext - Slides smoothly from Right */}
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, x: 60 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="text-slate-500 text-xs sm:text-sm font-medium mb-6 relative z-10"
                  >
                    All gear, certified coaching, and essential amenities curated directly for your session.
                  </motion.p>

                  {/* Dynamic Inclusions Grid - Slides smoothly down to up */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
                    {service.highlights.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { opacity: 0, y: 40 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.8,
                              delay: 0.24 + index * 0.08,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          },
                        }}
                        className="group relative flex items-center gap-3.5 bg-white/90 hover:bg-white backdrop-blur-xl p-4 sm:p-4.5 rounded-2xl border border-white/95 hover:border-[#FBBF24]/70 shadow-[0_4px_16px_rgba(11,61,94,0.03)] hover:shadow-[0_8px_24px_rgba(251,191,36,0.22)] transition-[box-shadow,border-color,background-color] duration-300 hover:-translate-y-0.5"
                      >
                        {/* Golden check circle */}
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border border-[#FBBF24] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                          <Check className="w-4 h-4 text-[#0B3D5E] stroke-[3]" />
                        </div>
                        <span className="text-slate-800 group-hover:text-[#0B3D5E] text-sm sm:text-[15px] font-bold tracking-tight transition-colors">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column (Pricing card) */}
            <div className="lg:col-span-1 relative">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="sticky top-28 lg:top-32 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-7 sm:p-9 border border-white/95 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.22)_inset] flex flex-col items-center text-center group hover:shadow-[0_30px_85px_rgba(251,191,36,0.22)] transition-shadow duration-500 relative overflow-hidden"
              >
                {/* Golden Hairline Top Accent */}
                <div
                  className="absolute top-0 inset-x-8 h-[2.5px] pointer-events-none"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.9), transparent)' }}
                />

                {/* Soft ambient corner warmth */}
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#FBBF24]/14 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#0B3D5E]/06 rounded-full blur-2xl pointer-events-none" />

                {/* Prestige Badge - Slides smoothly from Up to Down */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: -35 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[10px] font-black uppercase tracking-[0.2em] text-[#0B3D5E] mb-3.5 relative z-10 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.9)]" />
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Reserve Direct</span>
                </motion.div>

                {/* Heading - Slides smoothly from Right side */}
                <motion.h3
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="text-2xl font-serif font-black text-[#0B3D5E] mb-2 tracking-tight relative z-10"
                >
                  Ready to Experience?
                </motion.h3>

                {/* Subtext - Slides smoothly from Left side */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="text-slate-500 text-xs sm:text-sm mb-5 leading-relaxed relative z-10 max-w-xs"
                >
                  Reserve this exclusive experience or speak to our concierge for a custom tailored arrangement.
                </motion.p>

                {/* Price Plaque - Slides smoothly from Down to Up with Animated Counter */}
                {service.basePrice && service.basePrice !== "0" && service.basePrice !== "0.00" ? (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#FFFDF7] via-[#FFFBEB] to-[#FEF3C7]/40 border border-[#FBBF24]/40 w-full text-center relative overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#D97706] font-black uppercase tracking-[0.2em] mb-1">
                      <Star className="w-3 h-3 fill-[#FBBF24] text-[#FBBF24]" />
                      <span>Best Direct Rate</span>
                    </div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight">
                        €<PriceCountUp price={service.basePrice} />
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        /{service.unit?.replace('_', ' ') || 'session'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      All gear &amp; certified guides included
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="mb-5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 w-full text-center"
                  >
                    <span className="text-[10px] text-[#0B3D5E] font-black uppercase tracking-widest block mb-0.5">
                      Bespoke Experience
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Custom tailored itinerary &amp; timing
                    </span>
                  </motion.div>
                )}

                {/* Psychological Trust Pillars / Confidence Checklist - Slides from Left Side */}
                <div className="w-full space-y-2.5 mb-5 text-left border-y border-slate-100/90 py-4 relative z-10">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -45 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.75, delay: 0.26, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 hover:translate-x-1 transition-transform"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Instant confirmation &amp; seamless check-in</span>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -45 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.75, delay: 0.32, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 hover:translate-x-1 transition-transform"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>All equipment &amp; ISA certified guidance</span>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -45 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 hover:translate-x-1 transition-transform"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Free 24h cancellation &amp; date flexibility</span>
                  </motion.div>
                </div>

                {/* Action Buttons: Clean Flex Column with Guaranteed Separation & No Overlap */}
                <div className="w-full flex flex-col gap-3 relative z-10">
                  {service.isBookable && (
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: 50 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.85, delay: 0.42, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="w-full"
                    >
                      <Link
                        href={`/book?service=${service.slug}`}
                        className="block w-full"
                        onClick={() => {
                          if (service?.id) {
                            localStorage.setItem('booking_serviceIds', JSON.stringify([service.id]));
                            localStorage.setItem('booking_stepId', JSON.stringify("dates"));
                          }
                        }}
                      >
                        <button
                          className="group w-full h-14 rounded-2xl bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] font-black text-xs uppercase tracking-widest shadow-[0_8px_25px_rgba(251,191,36,0.38)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.55)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 border border-[#F59E0B]/30 cursor-pointer select-none"
                          data-testid="button-book-package"
                        >
                          <Calendar className="w-4 h-4 text-[#0B3D5E]" />
                          <span>Reserve Now</span>
                          <ArrowRight className="w-4 h-4 text-[#0B3D5E] group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </motion.div>
                  )}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 35 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.85, delay: 0.48, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="w-full"
                  >
                    <Link href="/contact" className="block w-full">
                      <button
                        className="group w-full h-12 rounded-2xl bg-white hover:bg-[#FFFDF7] text-[#0B3D5E] hover:text-[#D97706] border border-slate-200/90 hover:border-[#FBBF24] shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider cursor-pointer select-none"
                        data-testid="button-enquire-package"
                      >
                        <MessageCircle className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
                        <span>Contact Concierge</span>
                      </button>
                    </Link>
                  </motion.div>
                </div>

                {/* Footer Reassurance */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { duration: 0.6, delay: 0.54 },
                    },
                  }}
                  className="mt-5 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>Flexible booking &amp; cancellation</span>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Related Experiences: 3 Related Experiences in a Transparent Sanctuary Card ── */}
      {relatedExperiences.length > 0 && (
        <section
          className="py-16 sm:py-20 md:py-24 relative overflow-hidden w-full border-t border-[#0B3D5E]/6"
          style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF8 45%, #F4F8FA 100%)' }}
        >
          {/* Ambient lighting matching logo golden yellow & ocean navy */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#0B3D5E]/06 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10 max-w-7xl xl:max-w-[1440px]">
            {/* Transparent Sanctuary Box (Expanded Width) */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0, y: 35 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="relative overflow-hidden rounded-[2.2rem] sm:rounded-[2.8rem] md:rounded-[3.2rem] border border-white/85 shadow-[0_24px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.22)_inset] backdrop-blur-2xl p-6 sm:p-10 md:p-12 lg:p-14"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(254,251,243,0.76) 45%, rgba(245,249,252,0.86) 100%)',
              }}
            >
              {/* Ambient shimmer sweep animation */}
              <motion.div
                className="absolute inset-0 w-[45%] pointer-events-none z-0"
                style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)', skewX: '-15deg' }}
                animate={{ x: ['-160%', '350%'] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
              />

              {/* Top golden hairline accent line */}
              <div
                className="absolute top-0 left-12 right-12 h-[2px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
              />

              {/* Ambient corner radial warmth */}
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#FBBF24]/14 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#0B3D5E]/05 rounded-full blur-3xl pointer-events-none" />

              {/* Section Header */}
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 relative z-10 space-y-3">
                {/* 1. Curated Companion Experiences - from Right */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 60 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#0B3D5E] text-[11px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0" />
                  <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Curated Companion Experiences</span>
                </motion.div>

                {/* 2. More Experiences You May Love - from Left */}
                <motion.h2
                  variants={{
                    hidden: { opacity: 0, x: -60 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-tight tracking-tight"
                >
                  More Experiences You May Love
                </motion.h2>

                {/* Subtle Golden Accent Flourish */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scaleX: 0 },
                    visible: {
                      opacity: 1,
                      scaleX: 1,
                      transition: { duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  style={{ transformOrigin: 'center' }}
                  className="w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto"
                />

                {/* 3. Subtext - from Left */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.8, delay: 0.14, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="text-slate-600 font-medium text-sm md:text-base leading-relaxed max-w-lg mx-auto"
                >
                  Seamlessly complement your Weligama stay with ocean excursions, surf coaching, and mindful island wellness.
                </motion.p>
              </div>

              {/* 3 Related Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                {relatedExperiences.map((relExp: any, idx: number) => {
                  const relIcon = getExperienceIcon(relExp.slug || relExp.name);
                  return (
                    <motion.div
                      key={relExp.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false, amount: 0.15 }}
                      variants={{
                        hidden: { opacity: 0, x: -45 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.75, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                      style={{ willChange: "transform, opacity" }}
                      className="group bg-white/90 hover:bg-white backdrop-blur-xl rounded-[2.2rem] border border-white/90 hover:border-[#FBBF24]/70 p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-[box-shadow,border-color] duration-300 shadow-[0_12px_35px_rgba(11,61,94,0.05),0_0_0_1px_rgba(251,191,36,0.12)] hover:shadow-[0_22px_50px_rgba(251,191,36,0.22),0_10px_25px_rgba(11,61,94,0.06)]"
                    >
                      {/* Top golden hairline highlight on hover */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FBBF24]/12 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div>
                        {/* Golden Emblem Icon or Custom High-Res Icon - Smooth GPU-accelerated entrance from Right */}
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: 35 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.65, delay: 0.08 + idx * 0.08, ease: [0.16, 1, 0.3, 1] },
                            },
                          }}
                          style={{ willChange: "transform, opacity" }}
                          className="w-16 h-16 rounded-[1.4rem] bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 border border-[#FDE68A] flex items-center justify-center p-3 mb-5 shadow-sm group-hover:scale-110 group-hover:rotate-2 group-hover:shadow-[0_8px_20px_rgba(251,191,36,0.35)] transition-[box-shadow,border-color,background-color] duration-300 relative z-10"
                        >
                          {relIcon ? (
                            <img
                              src={relIcon}
                              alt={relExp.name}
                              className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(11,61,94,0.1)] transition-transform duration-300"
                            />
                          ) : relExp.iconEmoji ? (
                            <span className="text-3xl select-none filter drop-shadow-sm">{relExp.iconEmoji}</span>
                          ) : (
                            <Compass className="w-7 h-7 text-[#0B3D5E]" />
                          )}
                        </motion.div>

                        {/* Heading - from Left */}
                        <motion.h3
                          variants={{
                            hidden: { opacity: 0, x: -35 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.65, delay: 0.12 + idx * 0.08, ease: [0.16, 1, 0.3, 1] },
                            },
                          }}
                          style={{ willChange: "transform, opacity" }}
                          className="text-xl font-serif font-black text-[#0B3D5E] group-hover:text-[#D97706] transition-colors mb-2.5 leading-snug"
                        >
                          {relExp.name}
                        </motion.h3>

                        {/* Description - from Right */}
                        <motion.p
                          variants={{
                            hidden: { opacity: 0, x: 35 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.65, delay: 0.16 + idx * 0.08, ease: [0.16, 1, 0.3, 1] },
                            },
                          }}
                          style={{ willChange: "transform, opacity" }}
                          className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6 font-medium"
                        >
                          {relExp.shortDesc || relExp.description || "Handcrafted coastal experiences curated steps from Weligama Bay."}
                        </motion.p>
                      </div>

                      {/* Card Footer: Price & Direct Link */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
                        {relExp.basePrice && relExp.basePrice !== "0" && relExp.basePrice !== "0.00" ? (
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.65, delay: 0.18 + idx * 0.08, ease: [0.16, 1, 0.3, 1] },
                              },
                            }}
                            style={{ willChange: "transform, opacity" }}
                            className="flex flex-col"
                          >
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Starting From</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-serif font-black text-[#0B3D5E]">
                                €<PriceCountUp price={relExp.basePrice} />
                              </span>
                              <span className="text-[11px] text-slate-500 font-semibold">/{relExp.unit?.replace('_', ' ') || 'session'}</span>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.65, delay: 0.18 + idx * 0.08, ease: [0.16, 1, 0.3, 1] },
                              },
                            }}
                            style={{ willChange: "transform, opacity" }}
                            className="flex flex-col"
                          >
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Availability</span>
                            <span className="text-xs font-bold text-[#0B3D5E]">Curated on Demand</span>
                          </motion.div>
                        )}

                        {/* Explore Button - Smooth GPU-accelerated entrance from Right without lag */}
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: 30 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.65, delay: 0.20 + idx * 0.08, ease: [0.16, 1, 0.3, 1] },
                            },
                          }}
                          style={{ willChange: "transform, opacity" }}
                        >
                          <Link href={`/packages/${relExp.slug}`} className="block">
                            <button
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] shadow-[0_4px_14px_rgba(251,191,36,0.35)] hover:shadow-[0_6px_20px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-[box-shadow,transform] duration-200 border border-[#F59E0B]/30 cursor-pointer"
                            >
                              <span>Explore</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
