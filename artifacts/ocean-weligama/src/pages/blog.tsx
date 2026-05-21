import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { Footer } from "@/components/footer";
import { Calendar, ArrowRight, BookOpen, Search, Clock, Tag, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { useListBlogs, getListBlogsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const CATEGORIES = ["All", "Surfing", "Travel", "Food", "Lifestyle", "Yoga"];

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

// Featured hero card
function FeaturedCard({ post }: { post: any }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const colors = CATEGORY_COLORS[post.category] || { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400" };
  const readTime = estimateReadTime(post.description);

  return (
    <motion.div ref={cardRef} style={{ opacity }}>
      <Link href={`/blog/${post.id}`}>
        <SpotlightCard className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-shadow duration-700">
          {/* Image side */}
          <div className="relative overflow-hidden min-h-[320px] lg:min-h-[520px] bg-slate-100">
            <motion.div style={{ y: imgY }} className="absolute inset-[-10%] w-[120%] h-[120%]">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </motion.div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:block hidden" />

            {/* Featured badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-white/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Featured Story</span>
            </div>

            {/* Bottom left meta on mobile */}
            <div className="absolute bottom-6 left-6 lg:hidden">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {post.category}
              </span>
            </div>
          </div>

          {/* Content side */}
          <div className="p-8 lg:p-14 flex flex-col justify-center relative">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#4BBCCC]/5 to-transparent rounded-bl-[2.5rem] pointer-events-none" />

            <div className="hidden lg:flex items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {post.category}
              </span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
            </div>

            <h2 className="text-2xl lg:text-4xl xl:text-5xl font-serif font-bold text-[#0B3D5E] mb-5 leading-tight group-hover:text-[#1A6B8A] transition-colors duration-500">
              {post.title}
            </h2>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-4 lg:line-clamp-5">
              {post.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
              <span className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
              </span>

              <motion.span
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 text-[#0B3D5E] font-bold text-xs uppercase tracking-wider group-hover:text-[#1A6B8A] transition-colors"
              >
                Read Full Story
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    </motion.div>
  );
}

// Regular post card
function PostCard({ post, index }: { post: any; index: number }) {
  const colors = CATEGORY_COLORS[post.category] || { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-400" };
  const readTime = estimateReadTime(post.description);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: Math.min(index * 0.07, 0.3), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-60px" }}
    >
      <Link href={`/blog/${post.id}`}>
        <TiltCard>
          <SpotlightCard className="group h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
            {/* Image */}
            <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: "16/10" }}>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category badge */}
              <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${colors.bg}/${80} ${colors.text} backdrop-blur-md shadow-sm border border-white/40`}>
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {post.category}
              </span>

              {/* Read time on image */}
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Clock className="w-3 h-3" />
                {readTime}m
              </span>

              {/* Arrow button on hover */}
              <div className="absolute bottom-5 right-5 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                <ArrowRight className="w-4 h-4 text-[#0B3D5E]" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </span>

              <h3 className="text-lg font-serif font-bold text-[#0B3D5E] mb-3 group-hover:text-[#1A6B8A] transition-colors duration-300 line-clamp-2 leading-snug">
                {post.title}
              </h3>

              <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-5">
                {post.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A6B8A] flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                  Read Story
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[9px] text-slate-300 font-medium">{readTime} min</span>
              </div>
            </div>
          </SpotlightCard>
        </TiltCard>
      </Link>
    </motion.div>
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
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: blogs, isLoading } = useListBlogs(
    undefined,
    { query: { queryKey: getListBlogsQueryKey() } }
  );

  const blogList = (blogs as any[]) || [];

  const filteredBlogs = blogList.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const categoryCounts: Record<string, number> = { All: blogList.length };
  blogList.forEach((p) => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1; });

  const featuredPost = filteredBlogs[0];
  const otherPosts = filteredBlogs.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] selection:bg-[#0B3D5E] selection:text-white overflow-x-hidden">

      {/* Hero */}
      <section ref={heroRef} className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-[#052439]">
        {/* Parallax background */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 scale-110">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#052439_0%,#0B3D5E_50%,#1A6B8A_100%)]" />
          {/* Animated grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
          {/* Glow orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-[#4BBCCC]/20 blur-[100px] rounded-full"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] left-[5%] w-[400px] h-[400px] bg-[#1A6B8A]/20 blur-[80px] rounded-full"
          />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="container relative z-10 mx-auto px-4 text-center mt-16">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#4BBCCC]/15 border border-[#4BBCCC]/30 px-5 py-2 rounded-full mb-6"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#4BBCCC]" />
            <span className="text-[#4BBCCC] text-[10px] font-black uppercase tracking-[0.25em]">The Ocean Journal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-5 leading-none tracking-tight"
          >
            Island Stories
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/70 text-sm md:text-base max-w-lg mx-auto font-sans leading-relaxed"
          >
            Surf diaries, coastal flavours, and barefoot adventures — all from the shores of Weligama.
          </motion.p>

          {/* Live stats row */}
          {!isLoading && blogList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex items-center justify-center gap-6 mt-8"
            >
              <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#4BBCCC]" />
                <Counter target={blogList.length} />
                <span>Stories Published</span>
              </div>
              <span className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2 text-white/60 text-xs font-medium">
                <Tag className="w-3.5 h-3.5 text-[#4BBCCC]" />
                <span>{Object.keys(categoryCounts).length - 1} Categories</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16 bg-[#F7F9FB]">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Sticky filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="sticky top-20 z-30 mb-14"
          >
            <div className={`bg-white/90 backdrop-blur-xl rounded-2xl border transition-all duration-300 p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 ${isSearchFocused ? "border-[#0B3D5E]/20 shadow-lg shadow-[#0B3D5E]/5" : "border-slate-100 shadow-md"}`}>
              {/* Category pills */}
              <div className="flex flex-wrap gap-2 flex-1">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count = categoryCounts[cat] || 0;
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-[#0B3D5E] text-white shadow-md shadow-[#0B3D5E]/20"
                          : "bg-[#F7F9FB] text-slate-500 hover:bg-slate-100 border border-slate-100"
                      }`}
                    >
                      {cat}
                      {count > 0 && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"}`}>
                          {count}
                        </span>
                      )}
                      {isActive && (
                        <motion.div layoutId="activePill" className="absolute inset-0 rounded-xl bg-[#0B3D5E]" style={{ zIndex: -1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${isSearchFocused ? "text-[#0B3D5E]" : "text-slate-300"}`} />
                <input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-[#F7F9FB] border border-slate-100 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/10 focus:bg-white focus:border-[#0B3D5E]/20 transition-all"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-xs font-bold px-1"
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
                {/* Results count */}
                <motion.p
                  layout
                  className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8"
                >
                  Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? "story" : "stories"}
                  {activeCategory !== "All" && ` in ${activeCategory}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </motion.p>

                {/* Featured post */}
                {featuredPost && (
                  <div className="mb-14">
                    <FeaturedCard post={featuredPost} />
                  </div>
                )}

                {/* Magazine-style masonry grid */}
                {otherPosts.length > 0 && (
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-0">
                    <AnimatePresence>
                      {otherPosts.map((post, idx) => (
                        <div key={post.id} className="break-inside-avoid mb-8">
                          <PostCard post={post} index={idx} />
                        </div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Newsletter */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-32 relative rounded-[3rem] overflow-hidden bg-[#0B3D5E] p-8 md:p-20 text-center"
          >
            {/* Animated gradient orb */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-40%] right-[-10%] w-[500px] h-[500px] bg-[#4BBCCC]/10 blur-[100px] rounded-full pointer-events-none"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] bg-[#1A6B8A]/15 blur-[80px] rounded-full pointer-events-none"
            />

            <div className="relative z-10 max-w-xl mx-auto">
              <span className="text-[#4BBCCC] font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Stay Connected</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-5 leading-tight">
                Island Stories <br /> Delivered to You
              </h2>
              <p className="text-white/70 text-sm mb-10 leading-relaxed max-w-md mx-auto">
                Seasonal guides, local secrets, and barefoot luxury inspiration — straight to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 bg-transparent border-none text-white px-5 py-3 focus:outline-none placeholder:text-white/30 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#4BBCCC] hover:bg-white text-[#0B3D5E] px-8 py-3 rounded-xl font-bold transition-all shadow-md text-xs uppercase tracking-wider whitespace-nowrap"
                >
                  Join the Circle
                </motion.button>
              </div>
              <p className="mt-4 text-white/30 text-xs">No spam. Only beauty. Unsubscribe anytime.</p>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
