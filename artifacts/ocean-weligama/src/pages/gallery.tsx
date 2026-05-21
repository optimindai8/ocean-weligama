import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useListGallery,
  useCreateGalleryItem,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Footer } from "@/components/footer";
import { X, Maximize2, Camera, Upload, Plus, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHero } from "@/components/page-hero";

const CATEGORIES = ["all", "rooms", "beach", "food", "activities", "property"] as const;
type Category = typeof CATEGORIES[number];


const FEATURED = [
  { id: "f1", url: "/gallery-sunset.png", alt: "Weligama Sunset", caption: "Sunset Serenity" },
  { id: "f2", url: "/gallery-interior.png", alt: "Boutique Suite", caption: "Barefoot Luxury" },
  { id: "f3", url: "/service-surf.png", alt: "Surf Session", caption: "Morning Waves" },
];

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  rooms: "Rooms",
  beach: "Beach",
  food: "Food",
  activities: "Activities",
  property: "Property",
};

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedImg, setSelectedImg] = useState<{ url: string; alt: string; caption?: string } | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<Exclude<Category, "all">>("beach");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();



  const { data: dbItems = [], isLoading } = useListGallery(
    activeCategory !== "all" ? { category: activeCategory, limit: 96 } : { limit: 96 }
  );

  const createMutation = useCreateGalleryItem();

  const allItems = (Array.isArray(dbItems) ? dbItems : []).filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

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

      <PageHero
        title="Ocean Air Through Our Lens"
        description="Share your memory — upload a photo and inspire the next adventurer."
        badgeText="Visual Storytelling"
        badgeIcon={<Camera className="w-3.5 h-3.5 text-[#4BBCCC]" />}
      />

      {/* Featured Showcase */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Featured Moments</h2>
            <p className="text-muted-foreground text-lg">Curated highlights from life at our villa.</p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setUploadOpen(true)}
            className="mt-8 md:mt-0 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Share Your Memory
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-2xl hover:shadow-primary/20 transition-all duration-500"
              onClick={() => setSelectedImg(img)}
            >
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <h3 className="text-2xl font-serif font-bold text-white mb-1">{img.caption}</h3>
                <span className="text-accent text-xs font-bold uppercase tracking-widest">Featured View</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Gallery with Filters */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-3 block">Complete Collection</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">Explore Weligama</h2>
          </div>

          {/* Filter Bar */}
          <div className="w-full flex overflow-x-auto hide-scrollbar smooth-inertia whitespace-nowrap gap-3 mb-10 pb-2 md:mb-20 p-2 bg-white/5 backdrop-blur-xl rounded-full md:max-w-fit mx-auto border border-white/10 shadow-2xl justify-start md:justify-center">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-500 z-10 tracking-widest uppercase whitespace-nowrap ${
                    isActive ? "text-white" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-primary rounded-full shadow-[0_20px_50px_-10px_rgba(var(--primary-rgb),0.6)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-full" />
                    </motion.div>
                  )}
                  <span className="relative z-20">{CATEGORY_LABELS[cat]}</span>
                </button>
              );
            })}
          </div>

          {/* Gallery Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2rem] bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              <AnimatePresence mode="popLayout">
                {allItems.map((item, idx) => {
                  const isStaggered = idx % 4 === 1 || idx % 4 === 3;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.6, delay: idx * 0.04, type: "spring", damping: 25 }}
                      viewport={{ once: true }}
                      className={`relative group ${isStaggered ? "lg:mt-12" : ""}`}
                      onClick={() => setSelectedImg({ url: item.url, alt: item.altText ?? "", caption: item.caption ?? undefined })}
                    >
                      <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                      <motion.div
                        whileHover={{ scale: 1.05, y: -8 }}
                        className="relative rounded-[2rem] overflow-hidden cursor-pointer shadow-xl border border-white/5"
                      >
                        <img
                          src={item.thumbnailUrl ?? item.url}
                          alt={item.altText ?? ""}
                          className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                          <span className="text-accent text-[8px] font-black uppercase tracking-[0.3em]">{item.category}</span>
                          <h4 className="text-white font-serif text-lg leading-tight">{item.altText}</h4>
                        </div>
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <Maximize2 className="text-white w-4 h-4" />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {allItems.length === 0 && (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">No images in this category yet.</p>
                </div>
              )}
            </div>
          )}
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
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        uploadCategory === cat
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
                className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${
                  uploadSuccess
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
              className="relative max-w-6xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImg.url} alt={selectedImg.alt} className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl" />
              {selectedImg.caption && (
                <div className="absolute bottom-[-50px] left-0 text-white">
                  <h2 className="text-3xl font-serif font-bold">{selectedImg.caption}</h2>
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
