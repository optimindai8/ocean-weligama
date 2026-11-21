import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, type Variants } from "framer-motion";
import { Footer } from "@/components/footer";
import { Calendar, ArrowLeft, ArrowRight, BookOpen, Search, Clock, Tag, ChevronRight, Star, TrendingUp, Waves, Compass, UtensilsCrossed, Palmtree, LayoutGrid, Sun, MapPin } from "lucide-react";
import { useListBlogs, getListBlogsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { SEO, StructuredData } from "@/seo";
import { cleanExcerpt } from "@/components/StoryContentRenderer";

/* ─── Hero Motion Variants (Matches Luxury Rooms, Packages & Gallery) ────── */
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

const CATEGORIES = ["All", "Surfing", "Travel", "Food", "Lifestyle", "Yoga"];

const BLOG_CATEGORIES = [
  { value: "All", label: "All", icon: LayoutGrid },
  { value: "Surfing", label: "Surfing", icon: Waves },
  { value: "Travel", label: "Travel", icon: Compass },
  { value: "Food", label: "Food", icon: UtensilsCrossed },
  { value: "Lifestyle", label: "Lifestyle", icon: Palmtree },
  { value: "Yoga", label: "Yoga", icon: Sun },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Surfing:   { bg: "bg-sky-50",    text: "text-sky-700",    dot: "bg-sky-400" },
  Travel:    { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-400" },
  Food:      { bg: "bg-rose-50",   text: "text-rose-700",   dot: "bg-rose-400" },
  Lifestyle: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-400" },
  Yoga:      { bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-400" },
};

function estimateReadTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Interactive tilt card with magnetic cursor effect
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseEnter = () => scale.set(1.02);
  const handleMouseLeave = () => { x.set(0); y.set(0); scale.set(1); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Spotlight card with moving gradient
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(75,188,204,0.08) 0%, transparent 80%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{ background }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const CURATED_SAMPLE_BLOGS = [
  {
    id: "sample-1",
    title: "Secret Surf Breaks of Weligama Bay: The Ultimate Dawn Patrol Guide",
    description: "Discover hidden reef breaks, ideal tides, and local board rentals just steps from Ocean Air sanctuary.",
    category: "Surfing",
    date: "2026-05-18",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sample-2",
    title: "Southern Sri Lanka Coastal Flavours: Rooftop Dining & Local Seafood",
    description: "From morning king coconuts to fresh tuna poke and sunset cocktails overlooking gentle Weligama waves.",
    category: "Food",
    date: "2026-05-15",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sample-3",
    title: "Morning Yoga & Ocean Breath: Restorative Island Living",
    description: "Salute the sun on our rooftop terrace as the Indian Ocean breezes rejuvenate body, breath, and mind.",
    category: "Yoga",
    date: "2026-05-12",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sample-4",
    title: "Day Trips from Weligama: Galle Fort, Tea Hills & Whale Safaris",
    description: "Curated day excursions exploring historic UNESCO forts, lush cinnamon estates, and blue whale watching.",
    category: "Travel",
    date: "2026-05-10",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sample-5",
    title: "The Art of Slow Living: Why Weligama is Sri Lanka's Best Kept Secret",
    description: "Escape the crowds and immerse yourself in golden hour shoreline strolls, local cafes, and quiet bay tides.",
    category: "Lifestyle",
    date: "2026-05-08",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sample-6",
    title: "Beginner to Pro: Navigating the Surf Seasons in Weligama",
    description: "A seasonal guide to wave swells, offshore winds, and gentle sand-bottom breaks perfect for learning.",
    category: "Surfing",
    date: "2026-05-05",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sample-7",
    title: "Sunset Chasing & Rooftop Cocktails at Ocean Air",
    description: "Unwind after a day in the surf with handcrafted tropical infusions and 360-degree views of the coastline.",
    category: "Lifestyle",
    date: "2026-05-02",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sample-8",
    title: "Ayurvedic Wellness & Coastal Herbs of Southern Sri Lanka",
    description: "Holistic island remedies, indigenous herbal oils, and mindful practices rooted in centuries of tradition.",
    category: "Yoga",
    date: "2026-04-28",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
  },
];

// Large Hero Post Card (Left Side of Top Grid)
function LargeHeroPostCard({ post }: { post: any }) {
  const readTime = estimateReadTime(post.description || "");
  const formattedDate = formatDate(post.date);

  return (
    <Link href={`/blog/${post.id}`} className="block group h-full">
      <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] h-full flex flex-col justify-end p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(11,61,94,0.12)] border border-white/80 transition-all duration-500 hover:shadow-[0_28px_70px_rgba(11,61,94,0.18)]">
        {/* Background Image with smooth zoom */}
        <img
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
        />

        {/* Multi-tier Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-[#0B3D5E]/60 to-transparent pointer-events-none" />

        {/* Content on Image */}
        <div className="relative z-10">
          {/* Category Pill with dot & Main Story badge */}
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 text-[#0B3D5E] shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              {post.category}
            </span>
            {post.isFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#0B3D5E] shadow-sm backdrop-blur-md">
                <Star className="w-3.5 h-3.5 fill-[#0B3D5E]" />
                Main Story
              </span>
            )}
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-snug tracking-tight mb-3 drop-shadow-md group-hover:text-[#FBBF24] transition-colors">
            {post.title}
          </h2>

          {/* Metadata */}
          <div className="text-white/80 text-xs sm:text-sm font-medium flex items-center gap-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Compact Latest Post Row (Right Side of Top Grid)
function CompactLatestPostRow({ post, index = 0 }: { post: any; index?: number }) {
  const readTime = estimateReadTime(post.description || "");
  const formattedDate = formatDate(post.date);

  return (
    <motion.div
      initial={{ opacity: 0, x: -35 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: 0.28 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link href={`/blog/${post.id}`} className="block group">
        <div className="flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-white/90 border border-transparent hover:border-[#FBBF24]/30 transition-all duration-300 shadow-xs hover:shadow-sm">
          {/* Thumbnail */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-inner relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
            />
          </div>

          {/* Title & Meta */}
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-[#0B3D5E] group-hover:text-[#D97706] transition-colors line-clamp-2 leading-snug mb-1">
              {post.title}
            </h4>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// 3-Column Card for "All Stories" (renamed from Founders corner)
function StoryGridCard({ post }: { post: any }) {
  const readTime = estimateReadTime(post.description || "");
  const formattedDate = formatDate(post.date);

  return (
    <Link href={`/blog/${post.id}`} className="block group h-full">
      <div className="h-full bg-white/90 backdrop-blur-xl rounded-[2rem] p-4 sm:p-5 border border-white/95 shadow-[0_12px_35px_rgba(11,61,94,0.06)] hover:shadow-[0_20px_50px_rgba(11,61,94,0.12),0_0_0_1.5px_rgba(251,191,36,0.35)] transition-all duration-500 flex flex-col group-hover:-translate-y-1.5 overflow-hidden">
        {/* Landscape Image with rounded corners */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[16/10] shadow-sm">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="pt-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category Pill with Dot */}
            <div className="mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-lg sm:text-xl font-serif font-bold text-[#0B3D5E] group-hover:text-[#D97706] transition-colors duration-200 line-clamp-2 leading-snug mb-2">
              {post.title}
            </h4>

            {/* Excerpt */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4 font-sans">
              {cleanExcerpt(post.description)}
            </p>
          </div>

          {/* Meta Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>{formattedDate} • {readTime} min read</span>
            <div className="w-7 h-7 rounded-full bg-[#FBBF24]/0 group-hover:bg-[#FBBF24] flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-3.5 h-3.5 text-transparent group-hover:text-[#0B3D5E] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Animated counter
function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / 20);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: blogs, isLoading } = useListBlogs(
    undefined,
    {
      query: {
        queryKey: getListBlogsQueryKey(),
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        staleTime: 0,
      },
    }
  );

  const blogList = (blogs as any[]) || [];

  // Real backend blogs are the primary source; CURATED_SAMPLE_BLOGS is only a fallback if DB query is empty
  const allAvailableBlogs = blogList.length > 0 ? blogList : CURATED_SAMPLE_BLOGS;

  const filteredBlogs = allAvailableBlogs.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const categoryCounts: Record<string, number> = { All: allAvailableBlogs.length };
  allAvailableBlogs.forEach((p) => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1; });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Priority: Specifically designated Main Post (isMainPost === true or isFeatured === true)
  const explicitlyFeatured = filteredBlogs.find((p) => p.isMainPost || p.isFeatured);
  const featuredPost = explicitlyFeatured || filteredBlogs[0];

  // Latest posts stack (right side): Priority to posts toggled with isLatest (excluding featuredPost)
  const explicitlyLatest = filteredBlogs.filter((p) => p.isLatest && p.id !== featuredPost?.id);
  const remainingCandidates = filteredBlogs.filter((p) => p.id !== featuredPost?.id && !p.isLatest);
  const latestPosts = [...explicitlyLatest, ...remainingCandidates].slice(0, 4);

  const PAGE_SIZE = 6;
  const archiveStories = filteredBlogs.filter((p) => p.id !== featuredPost?.id);
  const displayStories = archiveStories.length > 0 ? archiveStories : filteredBlogs;
  const totalPages = Math.max(1, Math.ceil(displayStories.length / PAGE_SIZE));
  const pagedStories = displayStories.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#0B3D5E] selection:text-white overflow-x-hidden">
      <SEO
        title="Weligama Travel & Surf Journal — Ocean Air Blog"
        description="Read surf guides, travel tips, local food recommendations & Southern Sri Lanka coastal stories from Ocean Air Weligama."
        canonicalPath="/blog"
        keywords={["Weligama Travel Guide", "Surfing Weligama Blog", "Sri Lanka South Coast Travel", "Ocean Weligama Journal"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Blog & Stories", item: "/blog" },
        ]}
      />

      {/* Cinematic Blog Video Hero Section */}
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
            poster="/images/blog-hero-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
          >
            <source src="/videos/blog-hero-video.mp4" type="video/mp4" />
            <source src="/videos/Blog video.mp4" type="video/mp4" />
          </video>

          {/* Deep coastal ocean overlay for supreme text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/78 via-[#0B3D5E]/45 to-[#052439]/92" />

          {/* Golden sunrise ambient warmth matching hotel logo yellow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.55)_100%)] pointer-events-none" />

          {/* Bottom subtle edge fade transitioning smoothly into the articles section */}
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
            <BookOpen className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>The Ocean Journal • Island Stories</span>
          </motion.div>

          {/* Main Headline - From Right Side */}
          <motion.h1
            variants={heroHeadlineVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            Stories from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#F59E0B] drop-shadow-[0_2px_20px_rgba(251,191,36,0.5)]">
              Weligama Bay
            </span>
          </motion.h1>

          {/* Subtitle - From Left Side */}
          <motion.p
            variants={heroSubtitleVariants}
            className="mt-5 text-white/85 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md font-sans"
          >
            Surf diaries, secret coastal breaks, fresh island flavours, and barefoot adventures—curated guides from our boutique sanctuary in Southern Sri Lanka.
          </motion.p>

          {/* Live Statistics Counter Row */}
          {!isLoading && blogList.length > 0 && (
            <motion.div
              variants={heroSubtitleVariants}
              className="mt-5 flex items-center justify-center gap-3 text-white/80 text-xs font-semibold flex-wrap"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <TrendingUp className="w-3.5 h-3.5 text-[#FBBF24]" />
                <Counter target={blogList.length} />
                <span>Stories Published</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <Tag className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>{Object.keys(categoryCounts).length - 1} Categories</span>
              </div>
            </motion.div>
          )}

          {/* Action CTA - From Bottom to Up */}
          <motion.div
            variants={heroCtaVariants}
            className="mt-8 sm:mt-10 flex items-center justify-center relative z-20"
          >
            <button
              onClick={() => {
                const el = document.getElementById("blog-articles");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:bg-white hover:text-[#0B3D5E] transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
            >
              <span>Read Journal</span>
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
              <span>Daily Surf &amp; Swell Reports</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Compass className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Insider Weligama Guides</span>
            </motion.div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <UtensilsCrossed className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Local Flavours &amp; Dining</span>
            </motion.div>
            <div className="hidden lg:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Palmtree className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>Day Trips &amp; Secret Spots</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <main id="blog-articles" className="flex-1 py-16 relative scroll-mt-20 overflow-x-clip" style={{ background: 'linear-gradient(160deg, #F0F4F8 0%, #E2EDF8 100%)' }}>
        {/* Soft ambient backgrounds */}
        <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#FBBF24]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-sky-200/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">

          {/* Luxury Luminous Filter & Search Dock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="sticky top-20 z-30 mb-12 sm:mb-16"
          >
            {/* Ambient Warm Golden Glow behind dock */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FBBF24]/25 via-[#F59E0B]/18 to-[#FBBF24]/25 rounded-[2.5rem] sm:rounded-full blur-xl opacity-80 pointer-events-none" />

            <div className="relative rounded-[2rem] sm:rounded-full bg-white/90 backdrop-blur-2xl border border-white/95 p-1.5 sm:p-2.5 shadow-[0_20px_50px_-15px_rgba(11,61,94,0.08),0_4px_25px_rgba(251,191,36,0.14)] flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Category Pills with Sliding Golden Yellow Indicator */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-1.5 w-full lg:w-auto overflow-x-auto no-scrollbar py-0.5">
                {BLOG_CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.value;
                  const count = categoryCounts[cat.value] || 0;
                  const Icon = cat.icon;

                  return (
                    <button
                      key={cat.value}
                      onClick={() => setActiveCategory(cat.value)}
                      className={`relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer select-none group whitespace-nowrap ${
                        isActive
                          ? "text-[#0B3D5E] font-black"
                          : "text-[#0B3D5E]/70 hover:text-[#0B3D5E] hover:bg-white/60"
                      }`}
                      style={{ willChange: "transform, opacity" }}
                    >
                      {/* Animated Sliding Pill Highlight Indicator (Hotel Logo Yellow) */}
                      {isActive && (
                        <motion.div
                          layoutId="activeBlogCategoryTab"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] shadow-[0_6px_20px_rgba(251,191,36,0.38)]"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}

                      {/* Icon */}
                      <Icon
                        className={`w-3.5 h-3.5 relative z-10 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                          isActive ? "text-[#0B3D5E]" : "text-[#D97706]/75 group-hover:text-[#0B3D5E]"
                        }`}
                      />

                      {/* Label */}
                      <span className="relative z-10">{cat.label}</span>

                      {/* Count Pill */}
                      {count > 0 && (
                        <span
                          className={`relative z-10 text-[10px] font-black px-1.5 py-0.5 rounded-full transition-colors ${
                            isActive
                              ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
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
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Content area */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                <Skeleton className="h-[480px] rounded-[2.5rem] w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[0, 1, 2].map((i) => <Skeleton key={i} className="aspect-[16/10] rounded-3xl w-full" />)}
                </div>
              </motion.div>
            ) : filteredBlogs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-32 bg-white rounded-[2rem] border border-slate-100 shadow-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="text-5xl mb-5"
                >
                  🏄
                </motion.div>
                <h3 className="text-xl font-serif font-bold text-[#0B3D5E] mb-2">No Stories Found</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                  Adjust your search or switch categories to find something inspiring.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                  className="bg-[#0B3D5E] text-white px-7 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1A6B8A] transition-colors shadow-md"
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Results count badge - Comes from Left to inside */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-between mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/95 shadow-sm text-[11px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    <span>
                      Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? "Story" : "Stories"}
                      {activeCategory !== "All" && ` · ${activeCategory}`}
                      {searchQuery && ` · "${searchQuery}"`}
                    </span>
                  </div>
                </motion.div>

                {/* Section 1: Top Hero Featured Card & Latest Posts Stack */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-16 sm:mb-20">
                  {/* Left Side: Large Hero Post Card (8 cols on lg) - Comes from Down to Up */}
                  {featuredPost && (
                    <motion.div
                      initial={{ opacity: 0, y: 70 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="lg:col-span-8"
                    >
                      <LargeHeroPostCard post={featuredPost} />
                    </motion.div>
                  )}

                  {/* Right Side: Latest Posts Stack (4 cols on lg) */}
                  {latestPosts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="lg:col-span-4 flex flex-col justify-between"
                    >
                      <div className="bg-white/85 backdrop-blur-xl rounded-[2rem] p-5 sm:p-6 border border-white/95 shadow-[0_12px_35px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.18)] h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                            {/* "Latest post" coming from right side to inside */}
                            <motion.h3
                              initial={{ opacity: 0, x: 50 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: false, amount: 0.2 }}
                              transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="text-lg sm:text-xl font-serif font-black text-[#0B3D5E] tracking-tight"
                            >
                              Latest post
                            </motion.h3>

                            {/* "Fresh" badge coming from top to bottom */}
                            <motion.span
                              initial={{ opacity: 0, y: -25 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: false, amount: 0.2 }}
                              transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="text-[10px] font-black uppercase tracking-widest text-[#D97706] bg-[#FBBF24]/20 border border-[#FBBF24]/40 px-2.5 py-0.5 rounded-full inline-block"
                            >
                              Fresh
                            </motion.span>
                          </div>

                          <div className="space-y-3.5">
                            {latestPosts.map((post: any, idx: number) => (
                              <CompactLatestPostRow key={post.id} post={post} index={idx} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Section 2: All Stories Grid & Interactive Pagination (Renamed from Founders corner) */}
                {pagedStories.length > 0 && (
                  <div className="mt-8">
                    {/* Section Header with Left/Right Navigation */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
                      <div>
                        {/* 'Curated Island Archive' badge - Comes from Right side */}
                        <motion.div
                          initial={{ opacity: 0, x: 60 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, amount: 0.2 }}
                          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] text-[10px] font-black uppercase tracking-wider mb-2"
                        >
                          <Compass className="w-3 h-3 text-[#D97706]" />
                          <span>Curated Island Archive</span>
                        </motion.div>

                        {/* 'All Stories' Heading - Comes from Left side word by word smoothly */}
                        <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0B3D5E] tracking-tight flex items-center gap-2.5">
                          <motion.span
                            initial={{ opacity: 0, x: -45 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-block"
                          >
                            All
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0, x: -45 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-block"
                          >
                            Stories
                          </motion.span>
                        </h3>
                      </div>

                      {/* Previous / Next Arrow buttons */}
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2"
                      >
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:border-[#FBBF24] disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          aria-label="Previous stories"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage >= totalPages}
                          className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#FBBF24] hover:text-[#0B3D5E] hover:border-[#FBBF24] disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          aria-label="Next stories"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    </div>

                    {/* 3-Column Card Grid - Cards come from Left to Right one by one smoothly */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
                      <AnimatePresence mode="wait">
                        {pagedStories.map((post: any, idx: number) => (
                          <motion.div
                            key={`${currentPage}-${post.id}`}
                            initial={{ opacity: 0, x: -60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{
                              duration: 0.75,
                              delay: 0.15 + idx * 0.14,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="h-full"
                          >
                            <StoryGridCard post={post} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Numbered Pagination Row */}
                    {totalPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center gap-2 pt-4"
                      >
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="w-9 h-9 rounded-full text-slate-400 hover:text-[#0B3D5E] disabled:opacity-20 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Previous page"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                          const pageNum = i + 1;
                          const isActive = pageNum === currentPage;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-9 h-9 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                                isActive
                                  ? "bg-[#0B3D5E] text-white shadow-md scale-105"
                                  : "text-slate-500 hover:text-[#0B3D5E] hover:bg-white/80"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage >= totalPages}
                          className="w-9 h-9 rounded-full text-slate-400 hover:text-[#0B3D5E] disabled:opacity-20 flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Next page"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
