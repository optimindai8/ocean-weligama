import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Star, Plus, X, CheckCircle2, Camera, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  useListReviews, 
  useCreateReview, 
  getListReviewsQueryKey,
  useUploadFile
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const ANONYMOUS_DP = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

/* ─── Motion Variants for Section Header ───────────────────────────────────── */
const storiesBadgeVariants: Variants = {
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
      duration: 0.8,
      delay: 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const storiesWordsContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.16,
    },
  },
};

const storiesWordItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -45,
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

const storiesDescVariants: Variants = {
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
      duration: 0.85,
      delay: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const storiesButtonVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
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
      delay: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function Testimonials() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Form states
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Fetch reviews from API
  const { data: reviewData, isLoading } = useListReviews(
    { limit: 12 }
  );
  
  const reviews = reviewData?.reviews ?? [];

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const createReview = useCreateReview();
  const uploadFile = useUploadFile();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRating === 0) {
      toast({ title: "Please provide a rating", variant: "destructive" });
      return;
    }

    try {
      let imageUrl = ANONYMOUS_DP;

      // 1. Upload image if selected
      if (selectedFile) {
        const uploadResult = await uploadFile.mutateAsync({
          data: { file: selectedFile }
        });
        imageUrl = uploadResult.url || ANONYMOUS_DP;
      }

      // 2. Create review with the public image URL
      await createReview.mutateAsync({
        data: {
          guestName: name || "Anonymous Guest",
          title: title || "Wonderful Stay",
          ratingOverall: userRating,
          reviewText: text,
          guestAvatarUrl: imageUrl
        }
      });

      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
      
      // Reset form
      setName("");
      setTitle("");
      setText("");
      setUserRating(0);
      setSelectedImage(null);
      setSelectedFile(null);
    } catch (err) {
      toast({ 
        title: "Submission failed", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    }
  };

  return (
    <section
      className="py-24 sm:py-28 relative overflow-hidden border-t border-[#0B3D5E]/5"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F9FC 100%)' }}
    >
      {/* Ambient warmth matching hotel logo yellow and coastal ocean navy */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-[#0B3D5E]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1440px]">
        {/* Luminous Frosted Glass Box Container */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 35, transition: { duration: 0.2 } },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } 
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          className="max-w-5xl lg:max-w-6xl mx-auto rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 border border-white/90 shadow-[0_20px_60px_-15px_rgba(11,61,94,0.08)] backdrop-blur-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(170deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.60) 50%, rgba(245, 249, 252, 0.75) 100%)',
            willChange: "transform, opacity"
          }}
        >
          {/* Subtle internal warm and ocean halos */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

          {/* Header inside the transparent box */}
          <div className="text-center mb-10 sm:mb-12 relative z-10">
            {/* Pill badge - Comes from right side */}
            <motion.div
              variants={storiesBadgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 shadow-sm mb-3"
            >
              <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
              <span>Guest Stories</span>
            </motion.div>
            
            {/* Heading - Words come one by one from left side */}
            <motion.h2
              variants={storiesWordsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] mb-3 leading-tight tracking-tight flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
            >
              <motion.span variants={storiesWordItemVariants} className="inline-block">
                Memories
              </motion.span>
              <motion.span variants={storiesWordItemVariants} className="inline-block">
                from
              </motion.span>
              <motion.span
                variants={storiesWordItemVariants}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)] italic"
              >
                Weligama
              </motion.span>
            </motion.h2>

            {/* Subtitle description - Comes from right side */}
            <motion.p
              variants={storiesDescVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="text-slate-600 text-sm md:text-base font-normal max-w-lg mx-auto leading-relaxed mb-6"
            >
              Authentic reviews from travelers, surfers, and families who made Ocean Air their home away from home.
            </motion.p>

            {/* Add Review Button - Comes down to up */}
            <motion.div
              variants={storiesButtonVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            >
              <button 
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-sm hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
              >
                <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform duration-300" />
                <span>Add Your Review</span>
              </button>
            </motion.div>
          </div>

          {/* Review Card Carousel (Enters from bottom) */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 50, transition: { duration: 0.2 } },
              visible: {
                opacity: 1,
                y: 0,
                transition: { delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
              }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            style={{ willChange: "transform, opacity" }}
            className="relative w-full mx-auto relative z-10"
          >
            {isLoading ? (
              <div className="flex gap-6 justify-center">
                 <div className="w-full max-w-4xl h-[280px] bg-white rounded-3xl animate-pulse border border-slate-100" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <ReviewCard review={reviews[currentIndex]} />
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation Controls & Pagination Dots */}
                {reviews.length > 1 && (
                  <div className="flex items-center justify-center gap-3.5 mt-8">
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
                      aria-label="Previous review"
                      className="w-9 h-9 rounded-full bg-white/90 border border-slate-200/80 flex items-center justify-center text-[#0B3D5E] hover:bg-[#FBBF24] hover:border-[#FBBF24] hover:text-[#0B3D5E] transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      {reviews.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer border-none ${
                            idx === currentIndex 
                              ? "w-8 bg-[#FBBF24]" 
                              : "w-2.5 bg-slate-200 hover:bg-[#FBBF24]/50"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % reviews.length)}
                      aria-label="Next review"
                      className="w-9 h-9 rounded-full bg-white/90 border border-slate-200/80 flex items-center justify-center text-[#0B3D5E] hover:bg-[#FBBF24] hover:border-[#FBBF24] hover:text-[#0B3D5E] transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-12 font-medium">Be the first to share your experience!</p>
            )}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-foreground/10 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => { setIsFormOpen(false); setSubmitted(false); }}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitted ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-2">Share Experience</h3>
                    <p className="text-muted-foreground text-sm">We value your honest feedback.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Image Upload Area */}
                    <div className="flex flex-col items-center gap-4">
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-full bg-muted/20 border-2 border-dashed border-border/50 flex items-center justify-center cursor-pointer group hover:border-accent transition-all overflow-hidden"
                      >
                        {selectedImage ? (
                          <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground group-hover:text-accent transition-colors">
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-[10px] font-bold">Add Photo</span>
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                          placeholder="Your Name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12 rounded-xl border-border/50 bg-muted/20" 
                          required 
                        />
                        <Input 
                          placeholder="Review Title" 
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="h-12 rounded-xl border-border/50 bg-muted/20" 
                          required 
                        />
                      </div>

                      <div className="flex flex-col items-center gap-2 p-4 bg-muted/20 rounded-2xl">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rate your stay</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setUserRating(star)}
                              onMouseEnter={() => setHoveredRating(star)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star 
                                className={`w-8 h-8 transition-all ${
                                  (hoveredRating || userRating) >= star 
                                    ? "fill-[#FBBF24] text-[#FBBF24]" 
                                    : "text-slate-300 fill-slate-100"
                                }`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <Textarea 
                        placeholder="Write your review here..." 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="min-h-[100px] rounded-2xl border-border/50 bg-muted/20 p-5 text-sm" 
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={userRating === 0 || createReview.isPending || uploadFile.isPending}
                      className="w-full h-14 rounded-full bg-[#FBBF24] text-[#0B3D5E] font-black text-xs tracking-widest uppercase hover:bg-[#0B3D5E] hover:text-white transition-all disabled:opacity-50 shadow-md cursor-pointer"
                    >
                      {uploadFile.isPending ? "Uploading Image..." : createReview.isPending ? "Posting..." : "Post Review"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">Thank You!</h3>
                  <p className="text-muted-foreground text-sm">Your review has been submitted for moderation. It will be visible on our site shortly after approval.</p>
                  <Button 
                    onClick={() => { setIsFormOpen(false); setSubmitted(false); }}
                    className="rounded-full px-10 h-12 bg-muted text-foreground font-bold text-xs"
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ReviewCard({ review }: { review: any }) {
  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-7 sm:p-10 md:p-12 shadow-[0_15px_45px_rgba(11,61,94,0.06)] border border-slate-200/80 flex flex-col items-center text-center overflow-hidden group hover:border-[#FBBF24]/50 transition-all duration-500 hover:shadow-[0_22px_55px_rgba(251,191,36,0.16)]">
      {/* Golden top illumination edge */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      
      {/* Decorative quote mark background */}
      <div className="absolute top-2 left-6 sm:top-5 sm:left-10 text-[#FBBF24]/10 text-[7rem] sm:text-[10rem] font-serif leading-none select-none pointer-events-none group-hover:text-[#FBBF24]/18 transition-colors duration-500">"</div>

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Star Medallion */}
        <div className="flex items-center gap-1.5 mb-6 sm:mb-8 px-4 py-2 bg-[#FBBF24]/10 backdrop-blur-md rounded-full border border-[#FBBF24]/30 shadow-sm group-hover:scale-105 transition-transform duration-300">
          {[...Array(review.ratingOverall || 5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FBBF24] text-[#FBBF24] drop-shadow-sm" />
          ))}
          <span className="text-[11px] font-black text-[#0B3D5E] ml-1.5">{review.ratingOverall || 5}.0</span>
        </div>
        
        {/* Review Quote Text */}
        <p className="text-lg sm:text-xl md:text-2xl text-[#0B3D5E] font-serif italic font-medium leading-relaxed mb-8 max-w-3xl drop-shadow-sm">
          "{review.reviewText}"
        </p>
        
        {/* Warm Golden Divider */}
        <div className="w-12 h-1 bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] mb-7 rounded-full opacity-80" />
        
        {/* Author Avatar & Identity */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4">
          {review.guestAvatarUrl ? (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#FBBF24] to-[#0B3D5E]/20 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img src={review.guestAvatarUrl} alt={review.guestName} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-full" />
            </div>
          ) : (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#FBBF24]/40 flex items-center justify-center bg-[#FBBF24]/10 shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300">
              <User className="w-7 h-7 sm:w-8 sm:h-8 text-[#0B3D5E]" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-base sm:text-lg text-[#0B3D5E] tracking-tight">{review.guestName}</h4>
            <p className="text-[#D97706] font-black tracking-widest uppercase text-[10px] sm:text-[11px]">{review.title || "Verified Guest"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
