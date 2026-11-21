import { useGetBlog, getGetBlogQueryKey, useListBlogs, getListBlogsQueryKey } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  BookOpen,
  Compass,
  ChevronRight,
  Bookmark,
  Waves,
  Palmtree,
} from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/seo/SEO";
import { StructuredData } from "@/seo/StructuredData";
import { StoryContentRenderer } from "@/components/StoryContentRenderer";

function estimateReadTime(text: string) {
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogDetailPage() {
  const [, params] = useRoute("/blog/:id");
  const { scrollY, scrollYProgress } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);

  const id = params?.id;

  const { data: blog, isLoading, isError } = useGetBlog(id as string, {
    query: {
      queryKey: getGetBlogQueryKey(id as string),
      enabled: !!id,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  });

  const { data: allBlogs } = useListBlogs(undefined, {
    query: {
      queryKey: getListBlogsQueryKey(),
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    },
  });

  const mockRelatedFallback = [
    {
      id: "related-1",
      title: "Secret Surf Breaks of Weligama Bay: Dawn Patrol Guide",
      description: "Discover hidden reef breaks, ideal tides, and local board rentals just steps from Ocean Air sanctuary.",
      category: "Surfing",
      date: "2026-05-18",
      image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "related-2",
      title: "Southern Sri Lanka Coastal Flavours & Rooftop Dining",
      description: "From morning king coconuts to fresh tuna poke and sunset cocktails overlooking gentle waves.",
      category: "Food",
      date: "2026-05-15",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "related-3",
      title: "Morning Yoga & Ocean Breath: Restorative Island Living",
      description: "Salute the sun on our rooftop terrace as the Indian Ocean breezes rejuvenate body and mind.",
      category: "Yoga",
      date: "2026-05-12",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "related-4",
      title: "Day Trips from Weligama: Galle Fort, Tea Hills & Whales",
      description: "Curated day excursions exploring historic UNESCO forts, lush cinnamon estates, and blue whale safaris.",
      category: "Travel",
      date: "2026-05-10",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const otherRealBlogs = ((allBlogs as any[]) || []).filter((b: any) => String(b.id) !== String(id));
  const displayRelated = [
    ...otherRealBlogs,
    ...mockRelatedFallback.filter((m) => !otherRealBlogs.some((r: any) => r.title === m.title)),
  ].slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 mt-32 container mx-auto px-4 max-w-4xl space-y-8">
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-16 w-3/4 rounded-2xl" />
          <Skeleton className="h-[480px] w-full rounded-[2.5rem]" />
          <div className="space-y-4 pt-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-3xl mb-6">
            🌊
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#0B3D5E] mb-4">
            Story Not Found
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto mb-8">
            The story you're looking for may have been moved or is no longer available.
          </p>
          <Link href="/blog">
            <button className="bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#0B3D5E] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Stories</span>
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const readTime = estimateReadTime(blog.description || "");
  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#0B3D5E] selection:text-white overflow-x-hidden">
      {/* Top Reading Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] z-50 origin-left shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
      />

      <SEO
        title={`${blog.title} — Weligama Bay Journal | Ocean Air`}
        description={
          blog.description?.slice(0, 160).replace(/\s+/g, " ") + "..." ||
          `Read our latest story ${blog.title} on Ocean Air Weligama. Discover surfing guides, local tips, and barefoot luxury stories in Southern Sri Lanka.`
        }
        canonicalPath={`/blog/${id}`}
        keywords={["Weligama Blog", blog.category ?? "Sri Lanka Travel", blog.title, "Ocean Air Journal"]}
        ogImage={blog.image}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Island Journal", item: "/blog" },
          { name: blog.title, item: `/blog/${id}` },
        ]}
        blog={{
          id: String(blog.id),
          title: blog.title,
          description: (blog as any).description || (blog as any).summary,
          content: (blog as any).content || (blog as any).story || (blog as any).description,
          image: (blog as any).image || (blog as any).coverImage,
          author: (blog as any).author || (blog as any).authorName || "Ocean Air",
          date: (blog as any).date || (blog as any).createdAt,
          category: (blog as any).category,
          updatedAt: (blog as any).updatedAt,
        }}
      />

      <article className="flex-1">
        {/* Cinematic Luxury Blog Detail Hero Section */}
        <section className="relative min-h-[78vh] sm:min-h-[82vh] lg:min-h-[86vh] flex flex-col justify-between overflow-hidden bg-[#052439]">
          {/* Parallax Image & Atmospheric Lighting */}
          <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
            <img
              src={blog.image}
              className="w-full h-full object-cover scale-110"
              alt={blog.title}
            />
            {/* Deep coastal ocean overlay for supreme contrast & elegance */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/82 via-[#0B3D5E]/52 to-[#052439]/94" />

            {/* Golden sunrise ambient warmth matching hotel logo yellow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

            {/* Cinematic radial vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.65)_100%)] pointer-events-none" />

            {/* Bottom transition gradient smoothly connecting into article content */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F0F4F8] via-[#F0F4F8]/40 to-transparent pointer-events-none" />
          </motion.div>

          {/* Row 1: Navbar Clearance Spacer + Back Navigation / Breadcrumb Row */}
          <div className="pt-28 sm:pt-36 relative z-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-5xl flex items-center justify-between">
              <Link href="/blog">
                <motion.button
                  initial={{ opacity: 0, y: -35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.04, x: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border border-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#FBBF24] group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Journal</span>
                </motion.button>
              </Link>

              {/* Breadcrumb Trail - One by one from Right side */}
              <div className="hidden sm:flex items-center gap-2 text-white/70 text-xs font-semibold">
                <motion.div
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/40"
                >
                  /
                </motion.span>

                <motion.div
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: 0.29, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href="/blog" className="hover:text-white transition-colors">Journal</Link>
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/40"
                >
                  /
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: 0.43, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[#FBBF24] font-bold truncate max-w-[200px]"
                >
                  {blog.category}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Row 2: Main Hero Content (Clean, Focused, Editorial Hierarchy) */}
          <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center my-auto py-10 sm:py-16">
            {/* Category Eyebrow Pill - Comes from Right side */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#FBBF24] backdrop-blur-md shadow-[0_4px_25px_rgba(251,191,36,0.25)] mb-6 cursor-default"
            >
              <Compass className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em]">
                {blog.category} • Weligama Bay Journal
              </span>
            </motion.div>

            {/* Main Article Headline - Word by Word from Left side */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white mb-6 leading-[1.12] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1">
              {(blog.title || "").split(" ").map((word: string, wIdx: number) => (
                <motion.span
                  key={wIdx}
                  initial={{ opacity: 0, x: -45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.75,
                    delay: 0.2 + wIdx * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Editorial Reassurance / Metadata Dock - Staggered from Left side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ delay: 0.28, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 rounded-2xl sm:rounded-full bg-black/45 backdrop-blur-xl border border-white/20 p-2.5 sm:p-3 px-5 sm:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] text-white/95 text-xs font-semibold"
            >
              {/* Date */}
              {formattedDate && (
                <motion.div
                  initial={{ opacity: 0, x: -35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>{formattedDate}</span>
                </motion.div>
              )}

              {formattedDate && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: 0.42 }}
                  className="hidden sm:block w-px h-4 bg-white/20"
                />
              )}

              {/* Read Time */}
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2"
              >
                <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>{readTime} min read</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.53 }}
                className="hidden sm:block w-px h-4 bg-white/20"
              />

              {/* Sanctuary Badge */}
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.57, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Ocean Air Sanctuary</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.64 }}
                className="hidden md:block w-px h-4 bg-white/20"
              />

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, x: -35 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Weligama, Sri Lanka</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Row 3: Bottom spacer ensuring comfortable breathing room */}
          <div className="h-8 sm:h-12 relative z-10" />
        </section>

        {/* Content Section */}
        <section
          className="py-16 sm:py-24 relative z-20 overflow-x-clip"
          style={{ background: "linear-gradient(160deg, #F0F4F8 0%, #E2EDF8 100%)" }}
        >
          {/* Subtle ambient warm lighting */}
          <div className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] bg-[#FBBF24]/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* Left Column: Details Box & Sub-Navigation (8 cols on lg) */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                {/* Luxury Editorial Navigation Dock (Matching Hotel Logo Yellow) */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: "some", margin: "100px 0px 0px 0px" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  {/* Golden Ambient Glow matching logo yellow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#FBBF24]/20 via-[#F59E0B]/15 to-[#FBBF24]/20 rounded-full blur-md opacity-70 pointer-events-none" />

                  <div className="relative rounded-full bg-white/90 backdrop-blur-xl border border-white/95 px-3 sm:px-5 py-2 sm:py-2.5 shadow-[0_12px_35px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.2)] flex items-center justify-between gap-3">
                    {/* Back to Stories button in hotel yellow & ocean navy */}
                    <Link href="/blog">
                      <motion.button
                        whileHover={{ scale: 1.03, x: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-black uppercase tracking-wider text-[#0B3D5E] bg-[#FBBF24]/20 hover:bg-[#FBBF24]/30 border border-[#FBBF24]/50 hover:border-[#FBBF24] transition-all duration-300 shadow-sm cursor-pointer group"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-[#D97706] group-hover:-translate-x-1 transition-transform" />
                        <span>All Stories</span>
                      </motion.button>
                    </Link>

                    {/* Editorial Meta Dock matching logo main color */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B3D5E]/6 border border-[#0B3D5E]/10 text-xs font-semibold text-[#0B3D5E]">
                        <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{readTime} min read</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#0B3D5E] text-xs font-black uppercase tracking-wider shadow-[0_4px_15px_rgba(251,191,36,0.3)]">
                        <Bookmark className="w-3 h-3 text-[#0B3D5E]" />
                        <span>{blog.category}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Typography Content Card - Comes from Left side quickly at content top */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: "some", margin: "100px 0px 0px 0px" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  {/* Outer warm golden glow behind reading card */}
                  <div className="absolute -inset-2 bg-gradient-to-b from-[#FBBF24]/20 via-[#F59E0B]/12 to-[#FBBF24]/20 rounded-[3rem] blur-2xl opacity-75 pointer-events-none" />

                  <div className="relative bg-[#FCFDFE]/98 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 shadow-[0_24px_70px_-15px_rgba(11,61,94,0.08),0_0_0_1.5px_rgba(251,191,36,0.22)] border border-white/95 overflow-hidden">
                    {/* Subtle top-right warm glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FBBF24]/12 via-transparent to-transparent rounded-bl-full pointer-events-none" />

                    {/* Editorial Reading Header / Chapter Bar */}
                    <div className="flex items-center justify-between pb-5 mb-8 border-b border-slate-100 relative z-10">
                      <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-[#D97706]">
                        <BookOpen className="w-4 h-4 text-[#F59E0B]" />
                        <span>Island Journal Chronicle</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{readTime} min read</span>
                      </div>
                    </div>

                    {/* Story Body Content with Multi-Format Table Support */}
                    <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
                      <StoryContentRenderer content={blog.description || ""} />
                    </div>

                    {/* Bottom Card Reassurance & Host Sign-off */}
                    <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FBBF24] to-[#F59E0B] flex items-center justify-center text-[#0B3D5E] font-black shadow-md">
                          OA
                        </div>
                        <div>
                          <h4 className="text-sm font-serif font-bold text-[#0B3D5E]">Ocean Air Weligama</h4>
                          <p className="text-xs text-slate-400">Boutique Sanctuary &amp; Coastal Haven</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href="/blog">
                          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-[#0B3D5E] transition-all cursor-pointer">
                            <Compass className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>More Stories</span>
                          </button>
                        </Link>

                        <Link href="/rooms">
                          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#0B3D5E] shadow-md hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                            <span>Book Your Stay</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: 4 Related Stories Sidebar (4 cols on lg, sticky) */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: "some", margin: "100px 0px 0px 0px" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  {/* Subtle golden ambient glow */}
                  <div className="absolute -inset-1.5 bg-gradient-to-b from-[#FBBF24]/20 via-[#F59E0B]/12 to-[#FBBF24]/20 rounded-[2.5rem] blur-xl opacity-60 pointer-events-none" />

                  <div className="relative rounded-[2rem] sm:rounded-[2.4rem] bg-white/90 backdrop-blur-2xl border border-white/95 p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(11,61,94,0.08),0_0_0_1.5px_rgba(251,191,36,0.18)]">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                      <motion.div
                        initial={{ opacity: 0, x: -25 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: "some" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        <h3 className="text-sm sm:text-base font-serif font-black text-[#0B3D5E] uppercase tracking-wider">
                          Related Stories
                        </h3>
                      </motion.div>
                      <motion.span
                        initial={{ opacity: 0, y: -15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: "some" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[10px] font-black uppercase tracking-widest text-[#0B3D5E] bg-[#FBBF24]/25 border border-[#FBBF24]/50 px-2.5 py-1 rounded-full shadow-xs"
                      >
                        4 Curated
                      </motion.span>
                    </div>

                    {/* 4 Related Cards - One by one from Left side smoothly */}
                    <div className="space-y-3.5">
                      {displayRelated.map((item: any, idx: number) => {
                        const isMock = String(item.id).startsWith("related-");
                        const itemUrl = isMock ? "/blog" : `/blog/${item.id}`;

                        return (
                          <motion.div
                            key={item.id || idx}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: "some" }}
                            transition={{
                              duration: 0.5,
                              delay: idx * 0.06,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            <Link href={itemUrl} className="block group">
                              <motion.div
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                                className="relative rounded-2xl p-3 bg-white/70 hover:bg-white border border-slate-100 hover:border-[#FBBF24]/50 shadow-xs hover:shadow-[0_10px_30px_rgba(11,61,94,0.08)] transition-all duration-300 flex gap-3.5 items-center cursor-pointer"
                              >
                                {/* Thumbnail */}
                                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-inner">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 will-change-transform"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-[#D97706] bg-[#FBBF24]/20 border border-[#FBBF24]/40 px-2 py-0.5 rounded-full">
                                      {item.category}
                                    </span>
                                    <span className="text-slate-300">·</span>
                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-[#F59E0B]" />
                                      {estimateReadTime(item.description)}m
                                    </span>
                                  </div>

                                  <h4 className="text-xs sm:text-sm font-serif font-bold text-[#0B3D5E] group-hover:text-[#D97706] transition-colors duration-200 line-clamp-2 leading-snug mb-1">
                                    {item.title}
                                  </h4>

                                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#F59E0B]" />
                                    {item.date ? new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""}
                                  </span>
                                </div>

                                {/* Arrow Indicator */}
                                <div className="w-7 h-7 rounded-full bg-[#FBBF24]/0 group-hover:bg-[#FBBF24] flex items-center justify-center shrink-0 transition-all duration-300">
                                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0B3D5E] transition-colors" />
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Bottom Sanctuary Callout inside Sidebar - Comes from Bottom to Up */}
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#052439] text-white text-center relative overflow-hidden shadow-md"
                    >
                      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FBBF24]/20 rounded-full blur-xl pointer-events-none" />
                      <Palmtree className="w-5 h-5 text-[#FBBF24] mx-auto mb-2" />
                      <h4 className="font-serif font-bold text-sm text-white mb-1">Stay with Ocean Air</h4>
                      <p className="text-[11px] text-white/70 mb-3.5 leading-relaxed">
                        Experience coastal living, oceanfront suites &amp; rooftop sunsets in Weligama Bay.
                      </p>
                      <Link href="/rooms">
                        <button className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] text-[#0B3D5E] text-xs font-black uppercase tracking-wider shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
                          Explore Rooms &amp; Suites
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
