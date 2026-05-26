import { useGetBlog, getGetBlogQueryKey } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function BlogDetailPage() {
  const [, params] = useRoute("/blog/:id");
  const { toast } = useToast();
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  const id = params?.id;

  const { data: blog, isLoading, isError } = useGetBlog(id as string, {
    query: {
      queryKey: getGetBlogQueryKey(id as string),
      enabled: !!id,
    }
  });

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard!" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 mt-24 container mx-auto px-4 max-w-4xl space-y-8">
          <Skeleton className="h-12 w-3/4 rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-[2.5rem]" />
          <div className="space-y-4">
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
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Story Not Found</h1>
          <Link href="/blog">
            <button className="bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Stories
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">

      <article className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-end justify-center overflow-hidden">
          <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
            <img 
              src={blog.image} 
              className="w-full h-full object-cover scale-110" 
              alt={blog.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />
          </motion.div>

          <div className="container relative z-10 mx-auto px-4 pb-20 text-center max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/20"
            >
              <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">{blog.category}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]"
            >
              {blog.title}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 text-white/80"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-bold">{new Date(blog.date).toLocaleDateString()}</span>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 bg-background relative -mt-10 rounded-t-[3rem] z-20">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Share & Back */}
            <div className="flex items-center justify-between mb-16 pb-8 border-b border-border">
              <Link href="/blog">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold transition-colors">
                  <ArrowLeft className="w-5 h-5" /> All Stories
                </button>
              </Link>

              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Share</span>
                <div className="flex gap-2">
                  <button onClick={handleShare} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-colors">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button onClick={handleShare} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-[#1877F2] hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button onClick={handleShare} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-[#1DA1F2] hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Typography Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[3rem] p-8 md:p-14 lg:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-slate-100 hover:shadow-[0_30px_100px_rgba(0,0,0,0.12)] transition-all duration-700 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-150" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 transition-transform duration-1000 group-hover:scale-150" />
              
              <div className="relative z-10 prose prose-lg md:prose-xl max-w-none prose-p:text-slate-600 prose-p:leading-[1.8] prose-headings:font-serif prose-headings:text-foreground">
                {blog.description.split('\n').map((paragraph: string, i: number) => {
                  if (!paragraph.trim()) return null;
                  return (
                    <p key={i} className="mb-8 font-medium">
                      {i === 0 ? (
                        <>
                          <span className="float-left text-6xl md:text-8xl font-serif font-black text-primary leading-[0.8] mr-4 mt-2 mb-2 drop-shadow-sm">
                            {paragraph.charAt(0)}
                          </span>
                          {paragraph.slice(1)}
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
