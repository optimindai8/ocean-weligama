import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  useListGallery,
  useCreateGalleryItem,
  useGetSetting,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Footer } from "@/components/footer";
import {
  X,
  Maximize2,
  Camera,
  Upload,
  Plus,
  Check,
  Loader2,
  MapPin,
  ArrowRight,
  LayoutGrid,
  BedDouble,
  Waves,
  UtensilsCrossed,
  Compass,
  Palmtree,
  Columns,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sun
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SEO, StructuredData } from "@/seo";

/* ─── Hero Motion Variants (Matches Luxury Rooms & Packages Experience) ──── */
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

const CATEGORIES = ["all", "rooms", "beach", "food", "activities", "property"] as const;
type Category = typeof CATEGORIES[number];


const FEATURED = [
  {
    id: "f1",
    url: "/videos/148597-794221559_small.mp4",
    alt: "Ocean View",
    caption: "Ocean Vibes",
    badge: "Shoreline Soul",
    location: "Weligama Bay Waters",
    subtitle: "Golden hour shoreline strolls along Weligama's gentle, sun-warmed tides.",
    staggerClass: "md:-translate-y-5 lg:-translate-y-7",
    fromY: -60,
    type: "video"
  },
  {
    id: "f2",
    url: "/videos/123523-728292591_small.mp4",
    alt: "Serenity",
    caption: "Tropical Escape",
    badge: "Surf & Sunrise",
    location: "Main Surf Break",
    subtitle: "Gliding across glassy Indian Ocean breaks as the island awakens.",
    staggerClass: "md:translate-y-5 lg:translate-y-7",
    fromY: 60,
    type: "video"
  },
  {
    id: "f3",
    url: "/videos/vecteezy_majestic-green-sea-turtle-gliding-over-a-vibrant-coral-reef_71664992.mp4",
    alt: "Majestic Sea Turtle",
    caption: "Marine Life",
    badge: "Living Sanctuary",
    location: "Coral Reef Point",
    subtitle: "Gentle green sea turtles navigating vibrant tropical coral gardens.",
    staggerClass: "md:-translate-y-5 lg:-translate-y-7",
    fromY: -60,
    type: "video"
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  rooms: "Rooms",
  beach: "Beach",
  food: "Food",
  activities: "Activities",
  property: "Property",
};

const GALLERY_CATEGORIES = [
  { value: "all" as const, label: "All", icon: LayoutGrid },
  { value: "rooms" as const, label: "Rooms", icon: BedDouble },
  { value: "beach" as const, label: "Beach", icon: Waves },
  { value: "food" as const, label: "Dining", icon: UtensilsCrossed },
  { value: "activities" as const, label: "Activities", icon: Compass },
  { value: "property" as const, label: "Resort", icon: Palmtree },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedImg, setSelectedImg] = useState<{ url: string; alt: string; caption?: string; type?: string } | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<Exclude<Category, "all">>("beach");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");
  const queryClient = useQueryClient();

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };



  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const { data: dbItems = [], isLoading } = useListGallery({ limit: 96 });
  const { data: gallerySetting, refetch: refetchGallerySetting } = useGetSetting("gallery_settings", {
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    } as any,
  });

  useEffect(() => {
    const handleStorage = () => {
      refetchGallerySetting();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refetchGallerySetting]);

  const featuredMomentsConfig = (gallerySetting?.value as any)?.featuredMoments;
  const featuredBadge = featuredMomentsConfig?.badge || "Curated Visual Stories";
  const featuredHeadingLead = featuredMomentsConfig?.headingLead || "Featured";
  const featuredHeadingHighlight = featuredMomentsConfig?.headingHighlight || "Moments";
  const featuredSubtitle = featuredMomentsConfig?.subtitle || "Curated highlights, ocean rhythms, and cinematic memories captured steps from Weligama Bay.";
  const featuredJournalStatus = featuredMomentsConfig?.journalStatus || "Guest Journal Open";
  const featuredJournalSubtext = featuredMomentsConfig?.journalSubtext || "Be featured in our stories";
  const featuredShareCta = featuredMomentsConfig?.shareCtaText || "Share Your Memory";
  const featuredVideos = (featuredMomentsConfig?.videos && Array.isArray(featuredMomentsConfig.videos) && featuredMomentsConfig.videos.length > 0)
    ? featuredMomentsConfig.videos
    : FEATURED;

  const getCount = (catValue: Category) => {
    if (!dbItems || !Array.isArray(dbItems)) return 0;
    if (catValue === "all") return dbItems.length;
    return dbItems.filter(item => item.category === catValue).length;
  };

  const createMutation = useCreateGalleryItem();

  const allItems = (Array.isArray(dbItems) ? dbItems : []).filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const safeCurrentPage = totalPages > 0 ? Math.min(Math.max(1, currentPage), totalPages) : 1;
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = allItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleCategorySelect = (catValue: Category) => {
    setActiveCategory(catValue);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== safeCurrentPage) {
      setCurrentPage(newPage);
      const el = document.getElementById("gallery-showcase-box");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const { toast } = useToast();

  const handleUpload = async () => {
    if (!uploadFile) return;
    setUploading(true);
    try {
      // 1. Upload file to Supabase via upload endpoint
      const formData = new FormData();
      formData.append("file", uploadFile);
      const isDev = import.meta.env.DEV;
      const baseURL = isDev ? (import.meta.env.VITE_API_URL || "http://localhost:8080") : "";
      const uploadRes = await fetch(`${baseURL}/api/upload`, { method: "POST", body: formData });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to upload image file");
      }

      const { url } = await uploadRes.json();

      // 2. Save gallery record (pending)
      await createMutation.mutateAsync({
        data: { url, category: uploadCategory, caption: uploadCaption || null },
      });

      setUploadSuccess(true);
      toast({
        title: "Photo Submitted!",
        description: "Thank you for sharing! Your photo is now pending review by our team.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/gallery"] });

      setTimeout(() => {
        setUploadSuccess(false);
        setUploadOpen(false);
        setUploadPreview(null);
        setUploadFile(null);
        setUploadCaption("");
      }, 2000);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "An error occurred while submitting your photo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <SEO
        title="Photo & Video Gallery — Ocean Air Weligama Resort"
        description="View photos & videos of Ocean Air Weligama resort, rooms, beach, dining & surf spots in Weligama Bay, Sri Lanka."
        canonicalPath="/gallery"
        keywords={["Weligama Resort Photos", "Ocean Weligama Gallery", "Weligama Beach House Images", "Weligama Sri Lanka Videos"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Gallery", item: "/gallery" },
        ]}
        gallery={allItems?.map((g: any) => ({ url: g.imageUrl || g.url, title: g.title }))}
      />

      {/* Cinematic Gallery Video Hero Section */}
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
            poster="/images/gallery-hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
          >
            <source src="/videos/gallery-hero-video.mp4" type="video/mp4" />
            <source src="/videos/Gallery Video.mp4" type="video/mp4" />
          </video>

          {/* Deep coastal ocean overlay for supreme text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/78 via-[#0B3D5E]/45 to-[#052439]/92" />

          {/* Golden sunrise ambient warmth matching hotel logo yellow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.55)_100%)] pointer-events-none" />

          {/* Bottom subtle edge fade transitioning smoothly into the showcase section */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />
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
            <Camera className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Visual Stories &amp; Island Life</span>
          </motion.div>

          {/* Main Headline - From Right Side */}
          <motion.h1
            variants={heroHeadlineVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            Ocean Air Through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#F59E0B] drop-shadow-[0_2px_20px_rgba(251,191,36,0.5)]">
              Our Lens
            </span>
          </motion.h1>

          {/* Subtitle - From Left Side */}
          <motion.p
            variants={heroSubtitleVariants}
            className="mt-5 text-white/85 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md font-sans"
          >
            Immerse yourself in sun-drenched tides, golden surf breaks, boutique coastal sanctuaries, and authentic memories captured steps from Weligama Bay.
          </motion.p>

          {/* Action CTAs - From Bottom to Up */}
          <motion.div
            variants={heroCtaVariants}
            className="mt-8 sm:mt-10 flex items-center justify-center gap-4 flex-wrap relative z-20"
          >
            <button
              onClick={() => {
                const el = document.getElementById("featured-showcase");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:bg-white hover:text-[#0B3D5E] transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
            >
              <span>Featured Moments</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("gallery-showcase-box");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#FBBF24]" />
              <span>Full Archive</span>
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
              <span>100 Steps to Weligama Bay</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Camera className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Cinematic 4K Moments</span>
            </motion.div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Sun className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Golden Hour Shorelines</span>
            </motion.div>
            <div className="hidden lg:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Palmtree className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Curated Boutique Sanctuaries</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Showcase inside Luminous Transparent Box */}
      <section
        id="featured-showcase"
        className="py-16 sm:py-20 md:py-24 relative overflow-hidden scroll-mt-24"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F9FC 100%)' }}
      >
        {/* Soft Ambient Golden & Ocean Lighting */}
        <div className="absolute top-12 left-1/4 w-[550px] h-[550px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 right-1/4 w-[600px] h-[600px] bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1400px]">
          {/* Luminous Frosted Transparent Glass Box Container */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.68) 45%, rgba(245, 249, 252, 0.82) 100%)',
              willChange: "transform, opacity"
            }}
            className="rounded-[2.5rem] sm:rounded-[3.2rem] p-6 sm:p-10 lg:p-14 border border-white/90 shadow-[0_25px_70px_-15px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.14)] backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Internal Soft Ambient Halos */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#FBBF24]/14 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Badge, Title, Subtitle & Action */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 relative z-10">
              {/* Left: Eyebrow, Heading, Subtitle */}
              <div className="max-w-2xl">
                {/* 1. Badge Pill - Comes from Right side */}
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 mb-3.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse shrink-0" />
                  <Camera className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{featuredBadge}</span>
                </motion.div>

                {/* 2. Title with Golden Shimmer Accent - Words come one by one from Left side */}
                <div className="mb-3">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <motion.span
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-block text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] tracking-tight leading-[1.15]"
                    >
                      {featuredHeadingLead}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-block text-3xl sm:text-4xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)] tracking-tight leading-[1.15]"
                    >
                      {featuredHeadingHighlight}
                    </motion.span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0, originX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="w-16 h-1 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-transparent mt-3 mb-4"
                  />
                </div>

                {/* 3. Evocative Subtitle - Comes from bottom to top */}
                <motion.p
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.75, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-slate-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl"
                >
                  {featuredSubtitle}
                </motion.p>
              </div>

              {/* Right: Guest Journal hint & Share Your Memory Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                {/* Subtle guest submission hint - Comes from bottom to top */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="hidden lg:flex flex-col items-end text-right mr-1"
                >
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0B3D5E]/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {featuredJournalStatus}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">{featuredJournalSubtext}</span>
                </motion.div>

                {/* Share Your Memory CTA Button - Comes from Right side */}
                <motion.button
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.75, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  style={{ willChange: "transform, opacity" }}
                  className="relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(251,191,36,0.38)] hover:shadow-[0_8px_28px_rgba(251,191,36,0.55)] border border-[#F59E0B]/30 cursor-pointer transition-[box-shadow,border-color] duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-white/40 flex items-center justify-center text-[#0B3D5E] shadow-xs">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{featuredShareCta}</span>
                </motion.button>
              </div>
            </div>

            {/* 3 Staggered Featured Video Cards (Up - Down - Up Wave Rhythm) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4 pb-10 sm:pt-6 sm:pb-14 relative z-10">
              {featuredVideos.map((item: any, i: number) => (
                <div
                  key={item.id || i}
                  className={`relative ${item.staggerClass || (i === 1 ? 'md:translate-y-5 lg:translate-y-7' : 'md:-translate-y-5 lg:-translate-y-7')} transition-transform duration-500`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: item.fromY ?? (i === 1 ? 60 : -60), scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ scale: 1.025 }}
                    transition={{
                      duration: 0.75,
                      delay: 0.08 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    viewport={{ once: false, amount: 0.15 }}
                    style={{ willChange: "transform, opacity" }}
                    onClick={() => setSelectedImg({ url: item.url, alt: item.alt || item.caption, caption: item.caption, type: item.type || "video" })}
                    className="group relative aspect-[3/4] sm:aspect-[9/13] rounded-[2.2rem] sm:rounded-[2.6rem] overflow-hidden cursor-pointer bg-slate-950 border-2 border-white/80 hover:border-[#FBBF24]/80 shadow-[0_16px_40px_rgba(11,61,94,0.1)] hover:shadow-[0_24px_55px_rgba(251,191,36,0.28)] transition-[border-color,box-shadow] duration-500 flex flex-col justify-end"
                  >
                    {/* Golden ambient halo behind active card */}
                    <div className="absolute -inset-1 bg-gradient-to-t from-[#FBBF24]/25 via-transparent to-[#FBBF24]/10 rounded-[2.8rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />

                    {/* Background Video */}
                    <div className="absolute inset-0 overflow-hidden bg-slate-950">
                      <video
                        src={item.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        style={{ willChange: "transform" }}
                      />
                    </div>

                    {/* Cinematic Gradient Overlays */}
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-[#FBBF24]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Bottom Content Plaque */}
                    <div className="relative z-10 p-5 sm:p-6 text-left">
                      {/* Location Cue - Comes from Right Side */}
                      <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                          duration: 0.65,
                          delay: 0.22 + i * 0.12,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        style={{ willChange: "transform, opacity" }}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#FBBF24] mb-1.5 drop-shadow-sm"
                      >
                        <MapPin className="w-3 h-3 text-[#FBBF24]" />
                        <span>{item.location}</span>
                      </motion.div>

                      {/* Caption Title - Words come from Left Side One by One */}
                      <h3 className="flex flex-wrap items-baseline gap-x-2 text-2xl sm:text-[26px] font-serif font-black text-white leading-tight mb-2 tracking-tight group-hover:text-[#FDE68A] transition-colors duration-300 drop-shadow-md">
                        {(item.caption || "Featured Moment").split(" ").map((word: string, wIdx: number) => (
                          <motion.span
                            key={wIdx}
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.28 + i * 0.12 + wIdx * 0.12,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{ willChange: "transform, opacity" }}
                            className="inline-block"
                          >
                            {word}
                          </motion.span>
                        ))}
                      </h3>

                      {/* Subtitle / Narrative - Comes from Down to Up */}
                      <motion.p
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                          duration: 0.7,
                          delay: 0.4 + i * 0.12,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        style={{ willChange: "transform, opacity" }}
                        className="text-xs sm:text-[13px] text-white/85 font-normal leading-relaxed line-clamp-2 drop-shadow-sm"
                      >
                        {item.subtitle}
                      </motion.p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Gallery with Filters */}
      <section className="py-20 md:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #EDF3F8 0%, #F5F9FC 50%, #FFFFFF 100%)' }}>
        {/* Soft luxury ambient backgrounds */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-gradient-to-b from-[#FBBF24]/12 via-[#F59E0B]/8 to-transparent blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-[-10%] w-[550px] h-[550px] bg-[#0B3D5E]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FBBF24]/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            {/* 1. Pill Badge - Comes from Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-[#FBBF24]/40 shadow-[0_4px_16px_rgba(251,191,36,0.12)] backdrop-blur-md mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#0B3D5E] uppercase">
                Complete Collection
              </span>
            </motion.div>

            {/* 2. Luxury Heading - Word by Word from Left to Right */}
            <h2 className="flex flex-wrap items-center justify-center gap-x-3 text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E] tracking-tight leading-tight mb-4">
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="inline-block"
              >
                Explore
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="relative inline-block"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B]">
                  Weligama
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent" />
              </motion.span>
            </h2>

            {/* Golden Flourish Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#FBBF24]/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#FBBF24]/60" />
            </motion.div>

            {/* 3. Subtitle - Comes from Down to Up */}
            <motion.p
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-xl mx-auto"
            >
              Curated glimpses of coastal living—filter through oceanfront suites, golden surf breaks, fresh island dining, and excursions.
            </motion.p>
          </div>

          {/* Luxury Filter Dock - Comes from Down to Up */}
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-4xl mx-auto mb-10 md:mb-16"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Ambient Warm Golden Glow behind dock */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FBBF24]/20 via-[#F59E0B]/15 to-[#FBBF24]/20 rounded-[2.5rem] sm:rounded-full blur-xl opacity-75 pointer-events-none" />

            <div className="relative rounded-[2rem] sm:rounded-full bg-white/85 backdrop-blur-2xl border border-white/95 p-1.5 sm:p-2 shadow-[0_20px_50px_-15px_rgba(11,61,94,0.08),0_4px_20px_rgba(251,191,36,0.08)] flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-1.5">
              {GALLERY_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.value;
                const count = getCount(cat.value);
                const IconComponent = cat.icon;

                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer select-none group ${isActive
                      ? "text-[#0B3D5E] font-bold"
                      : "text-[#0B3D5E]/70 hover:text-[#0B3D5E] hover:bg-white/60"
                      }`}
                    style={{ willChange: "transform, opacity" }}
                  >
                    {/* Animated Sliding Pill Highlight Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeGalleryCategoryTab"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] shadow-[0_6px_20px_rgba(251,191,36,0.35)]"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}

                    {/* Category Icon */}
                    <span className="relative z-10 flex items-center">
                      <IconComponent
                        className={`w-3.5 h-3.5 transition-colors duration-200 ${isActive ? "text-[#0B3D5E]" : "text-[#D97706]/75 group-hover:text-[#D97706]"
                          }`}
                      />
                    </span>

                    {/* Category Label */}
                    <span className="relative z-10 whitespace-nowrap">
                      {cat.label}
                    </span>

                    {/* Count Pill Badge */}
                    <span
                      className={`relative z-10 flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-black transition-all duration-200 ${isActive
                        ? "bg-[#0B3D5E] text-[#FBBF24] shadow-xs"
                        : "bg-slate-100 text-slate-500 group-hover:bg-[#0B3D5E]/10 group-hover:text-[#0B3D5E]"
                        }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Main Gallery Showcase Box */}
          <div id="gallery-showcase-box" className="relative scroll-mt-24">
            {/* Ambient Warm Golden & Coastal Halos behind the Showcase Enclosure */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#FBBF24]/15 via-[#0B3D5E]/6 to-[#FBBF24]/15 rounded-[3rem] blur-2xl opacity-70 pointer-events-none -z-10" />

            <div className="relative rounded-[2.5rem] bg-white/75 backdrop-blur-2xl border border-white/95 p-5 sm:p-8 lg:p-10 shadow-[0_25px_70px_rgba(11,61,94,0.07),0_4px_25px_rgba(251,191,36,0.05)]">
              {/* Header Micro-Bar with Count & View Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200/70">
                {/* Collection Meta - Comes from Down to Up One by One */}
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#124b72] flex items-center justify-center text-[#FBBF24] shadow-md shadow-[#0B3D5E]/15 shrink-0"
                  >
                    <Camera className="w-5 h-5" />
                  </motion.div>

                  <div>
                    {/* Item 1: Curated Full Archive */}
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-[#0B3D5E]">
                        {activeCategory === "all" ? "Curated Full Archive" : `${CATEGORY_LABELS[activeCategory]} Collection`}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    </motion.div>

                    {/* Item 2: Showing 1-9 of 17 curated moments */}
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="text-[12.5px] text-slate-500 font-light"
                    >
                      {allItems.length === 0
                        ? "No photos yet"
                        : totalPages > 1
                          ? `Showing ${startIndex + 1}–${Math.min(startIndex + ITEMS_PER_PAGE, allItems.length)} of ${allItems.length} curated moments (Page ${safeCurrentPage} of ${totalPages})`
                          : `Displaying ${allItems.length} high-resolution ${allItems.length === 1 ? "moment" : "moments"}`}
                    </motion.div>
                  </div>
                </div>

                {/* View Controls - Buttons Come from Right Side One by One */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Grid vs Reel Toggle Dock */}
                  <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full p-1 border border-slate-200/80 shadow-xs">
                    {/* Grid Button */}
                    <motion.button
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      onClick={() => setViewMode("grid")}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${viewMode === "grid"
                        ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
                        : "text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-100/60"
                        }`}
                      title="Mosaic Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Grid</span>
                    </motion.button>

                    {/* Reel Button */}
                    <motion.button
                      initial={{ opacity: 0, x: 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      onClick={() => setViewMode("carousel")}
                      className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${viewMode === "carousel"
                        ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
                        : "text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-100/60"
                        }`}
                      title="Showcase Reel View"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>Reel</span>
                    </motion.button>
                  </div>

                  {/* Carousel Left / Right Quick Buttons (only visible in reel mode) */}
                  {viewMode === "carousel" && (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5 ml-1"
                    >
                      <button
                        onClick={() => scrollCarousel("left")}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-[#0B3D5E] hover:bg-[#FBBF24] hover:border-[#FBBF24] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => scrollCarousel("right")}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 text-[#0B3D5E] hover:bg-[#FBBF24] hover:border-[#FBBF24] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Photos Content */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[4/5] rounded-3xl bg-slate-200/60 animate-pulse" />
                  ))}
                </div>
              ) : allItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706] mb-4 shadow-sm">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[#0B3D5E] mb-2">No Images in this Category</h4>
                  <p className="text-slate-500 text-sm max-w-sm mb-6">
                    Be the first to share an unforgettable Weligama moment with us.
                  </p>
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B3D5E] text-[#FBBF24] font-bold text-xs uppercase tracking-wider hover:bg-[#082b43] transition-colors shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload a Memory</span>
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                /* Editorial Luxury Grid View (9 items per page) - Images come from Left Side One by One */
                <motion.div
                  layout
                  className={`grid gap-6 sm:gap-7 ${paginatedItems.length === 1
                    ? "max-w-lg mx-auto"
                    : paginatedItems.length === 2
                      ? "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -60, scale: 0.96 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.65, delay: Math.min((idx % 9) * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
                        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_8px_25px_rgba(11,61,94,0.06)] hover:shadow-[0_20px_45px_rgba(251,191,36,0.22),0_10px_25px_rgba(11,61,94,0.1)] hover:border-[#FBBF24]/70 transition-[border-color,box-shadow] duration-300 cursor-pointer"
                        style={{ willChange: "transform, opacity" }}
                        onClick={() => setSelectedImg({ url: item.url, alt: item.altText ?? "", caption: item.caption ?? undefined })}
                      >
                        {/* Image Container with Consistent Aspect Ratio */}
                        <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100">
                          <img
                            src={item.thumbnailUrl ?? item.url}
                            alt={item.altText ?? ""}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                            loading="lazy"
                          />

                          {/* Top-Left Category Badge - Comes from Right Side */}
                          <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{
                              duration: 0.55,
                              delay: 0.22 + (idx % 9) * 0.06,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            style={{ willChange: "transform, opacity" }}
                            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3D5E]/85 backdrop-blur-md text-[#FBBF24] border border-[#FBBF24]/30 text-[10px] font-black uppercase tracking-wider shadow-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                            <span>{item.category || "Ocean"}</span>
                          </motion.div>

                          {/* Top-Right Lightbox Action */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.5, delay: 0.26 + (idx % 9) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-[#0B3D5E] group-hover:bg-[#FBBF24] group-hover:text-[#0B3D5E] border border-white/90 shadow-sm flex items-center justify-center transition-colors duration-200"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </motion.div>

                          {/* Editorial Vignette Bottom Overlay */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B3D5E]/95 via-[#0B3D5E]/60 to-transparent pt-16 pb-5 px-5 sm:px-6 flex flex-col justify-end text-white">
                            {/* Caption Title - Word by Word from Left Side */}
                            <h4 className="flex flex-wrap items-baseline gap-x-1.5 font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#FBBF24] transition-colors duration-200 line-clamp-1 drop-shadow-sm">
                              {(item.altText || item.caption || "Weligama Coastal View").split(" ").map((word, wIdx) => (
                                <motion.span
                                  key={wIdx}
                                  initial={{ opacity: 0, x: -30 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: false, amount: 0.15 }}
                                  transition={{
                                    duration: 0.55,
                                    delay: 0.24 + (idx % 9) * 0.06 + wIdx * 0.06,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  style={{ willChange: "transform, opacity" }}
                                  className="inline-block"
                                >
                                  {word}
                                </motion.span>
                              ))}
                            </h4>

                            {/* Bottom Info Bar - Comes from Down to Up */}
                            <motion.div
                              initial={{ opacity: 0, y: 25 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: false, amount: 0.15 }}
                              transition={{
                                duration: 0.6,
                                delay: 0.32 + (idx % 9) * 0.06,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              style={{ willChange: "transform, opacity" }}
                              className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20 text-xs text-white/85"
                            >
                              <span className="flex items-center gap-1 text-[11px] font-light">
                                <MapPin className="w-3 h-3 text-[#FBBF24] shrink-0" />
                                <span>Weligama Bay</span>
                              </span>
                              <span className="text-[11px] font-bold text-[#FBBF24] flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                                <span>View</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* Showcase Reel / Smooth Carousel View - Images come from Left Side One by One */
                <div className="relative">
                  <div
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-5 sm:gap-6 pb-6 pt-2 px-1 hide-scrollbar smooth-inertia snap-x snap-mandatory items-center"
                  >
                    <AnimatePresence mode="popLayout">
                      {paginatedItems.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -60, scale: 0.94 }}
                          whileInView={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          viewport={{ once: false, amount: 0.15 }}
                          transition={{ duration: 0.65, delay: Math.min((idx % 9) * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
                          className="group relative shrink-0 w-[260px] sm:w-[320px] lg:w-[360px] snap-center rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_8px_25px_rgba(11,61,94,0.06)] hover:shadow-[0_20px_45px_rgba(251,191,36,0.22),0_10px_25px_rgba(11,61,94,0.1)] hover:border-[#FBBF24]/70 transition-[border-color,box-shadow] duration-300 cursor-pointer"
                          style={{ willChange: "transform, opacity" }}
                          onClick={() => setSelectedImg({ url: item.url, alt: item.altText ?? "", caption: item.caption ?? undefined })}
                        >
                          <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100">
                            <img
                              src={item.thumbnailUrl ?? item.url}
                              alt={item.altText ?? ""}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                              loading="lazy"
                            />

                            {/* Top-Left Category Badge - Comes from Right Side */}
                            <motion.div
                              initial={{ opacity: 0, x: 40 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: false, amount: 0.15 }}
                              transition={{
                                duration: 0.55,
                                delay: 0.22 + (idx % 9) * 0.06,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              style={{ willChange: "transform, opacity" }}
                              className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3D5E]/85 backdrop-blur-md text-[#FBBF24] border border-[#FBBF24]/30 text-[10px] font-black uppercase tracking-wider shadow-sm"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                              <span>{item.category || "Ocean"}</span>
                            </motion.div>

                            {/* Top-Right Lightbox Action */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: false, amount: 0.15 }}
                              transition={{ duration: 0.5, delay: 0.26 + (idx % 9) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                              style={{ willChange: "transform, opacity" }}
                              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md text-[#0B3D5E] group-hover:bg-[#FBBF24] group-hover:text-[#0B3D5E] border border-white/90 shadow-sm flex items-center justify-center transition-colors duration-200"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </motion.div>

                            {/* Editorial Vignette Bottom Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B3D5E]/95 via-[#0B3D5E]/60 to-transparent pt-16 pb-5 px-5 sm:px-6 flex flex-col justify-end text-white">
                              {/* Caption Title - Word by Word from Left Side */}
                              <h4 className="flex flex-wrap items-baseline gap-x-1.5 font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#FBBF24] transition-colors duration-200 line-clamp-1 drop-shadow-sm">
                                {(item.altText || item.caption || "Weligama Coastal View").split(" ").map((word, wIdx) => (
                                  <motion.span
                                    key={wIdx}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: false, amount: 0.15 }}
                                    transition={{
                                      duration: 0.55,
                                      delay: 0.24 + (idx % 9) * 0.06 + wIdx * 0.06,
                                      ease: [0.16, 1, 0.3, 1],
                                    }}
                                    style={{ willChange: "transform, opacity" }}
                                    className="inline-block"
                                  >
                                    {word}
                                  </motion.span>
                                ))}
                              </h4>

                              {/* Bottom Info Bar - Comes from Down to Up */}
                              <motion.div
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.15 }}
                                transition={{
                                  duration: 0.6,
                                  delay: 0.32 + (idx % 9) * 0.06,
                                  ease: [0.16, 1, 0.3, 1]
                                }}
                                style={{ willChange: "transform, opacity" }}
                                className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/20 text-xs text-white/85"
                              >
                                <span className="flex items-center gap-1 text-[11px] font-light">
                                  <MapPin className="w-3 h-3 text-[#FBBF24] shrink-0" />
                                  <span>Weligama Bay</span>
                                </span>
                                <span className="text-[11px] font-bold text-[#FBBF24] flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
                                  <span>View</span>
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* High-Quality Pagination Controls at the End of the Box */}
              {totalPages > 1 && (
                <div className="relative z-10 mt-10 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Left: Page Counter Indicator */}
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    PAGE <span className="font-black text-[#0B3D5E]">{safeCurrentPage}</span> OF <span className="font-black text-[#0B3D5E]">{totalPages}</span>
                  </div>

                  {/* Right / Center: Sleek Interactive Pagination Dock */}
                  <div className="flex items-center gap-2">
                    {/* Previous Page Arrow */}
                    <button
                      type="button"
                      onClick={() => handlePageChange(safeCurrentPage - 1)}
                      disabled={safeCurrentPage <= 1}
                      aria-label="Previous Page"
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${safeCurrentPage <= 1
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
                            className={`relative min-w-[38px] h-9 px-3 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer select-none ${isActive
                              ? "text-[#0B3D5E] font-black"
                              : "text-slate-600 hover:text-[#0B3D5E] hover:bg-white/80"
                              }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeGalleryPaginationTab"
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${safeCurrentPage >= totalPages
                        ? "opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200"
                        : "bg-white hover:bg-[#FBBF24] text-[#0B3D5E] border border-slate-200/80 hover:border-[#FBBF24] shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                        }`}
                    >
                      <ChevronRight className="w-4 h-4 translate-x-0.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Micro-Bar */}
              <div className="mt-8 pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>Click any photograph to view high-resolution details in full-screen lightbox.</span>
                </div>
                <button
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[#FBBF24]/60 text-[#0B3D5E] font-bold hover:bg-[#FBBF24] hover:border-[#FBBF24] transition-all shadow-xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Share Your Memory</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
            onClick={() => setUploadOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-card rounded-[2.5rem] p-5 sm:p-8 md:p-12 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Share Your Memory</h2>
                  <p className="text-muted-foreground text-sm mt-1">Submit a photo for review — it'll appear after approval.</p>
                </div>
                <button onClick={() => setUploadOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* File Drop Zone */}
              <div
                className="relative border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all mb-6 min-h-[200px]"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadPreview ? (
                  <img src={uploadPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">Click to select a photo</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Category Selector */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {(CATEGORIES.filter((c) => c !== "all") as Exclude<Category, "all">[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setUploadCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${uploadCategory === cat
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-foreground mb-2">Caption <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="A beautiful sunset at Ocean Air..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading || uploadSuccess}
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${uploadSuccess
                  ? "bg-green-500 text-white"
                  : !uploadFile || uploading
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                  }`}

              >
                {uploadSuccess ? (
                  <><Check className="w-5 h-5" /> Submitted! Pending Review</>
                ) : uploading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="w-5 h-5" /> Submit Photo</>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors" onClick={() => setSelectedImg(null)}>
              <X className="w-10 h-10" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImg.type === 'video' || selectedImg.url.endsWith('.mp4') ? (
                <video
                  src={selectedImg.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl border border-white/20"
                />
              ) : (
                <img src={selectedImg.url} alt={selectedImg.alt} className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl" />
              )}
              {selectedImg.caption && (
                <div className="mt-4 text-center text-white">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white drop-shadow-md">{selectedImg.caption}</h2>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
