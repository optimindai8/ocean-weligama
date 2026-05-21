import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, X, CheckCircle2, Camera, User } from "lucide-react";
import { useState, useRef } from "react";
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

  // Form states
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // Fetch reviews from API
  const { data: reviewData, isLoading } = useListReviews(
    { limit: 12 }
  );
  
  const reviews = reviewData?.reviews ?? [];

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
    <section className="py-24 bg-[#FAFAFA] overflow-hidden relative">
      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent font-black tracking-[0.4em] uppercase text-[10px] mb-4 block"
        >
          Testimonials
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
        >
          Guest <span className="italic font-normal text-accent">Stories</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="
              relative overflow-hidden
              rounded-full px-10 h-14 bg-[#0A192F] hover:bg-[#112240] text-white 
              transition-all duration-500 text-xs font-bold tracking-[0.2em] uppercase 
              shadow-[0_10px_30px_rgba(10,25,47,0.2)] hover:shadow-[0_20px_40px_rgba(10,25,47,0.4)]
              hover:scale-105 active:scale-95 group border border-[#112240]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <span className="relative z-10 flex items-center">
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
              Add Your Review
            </span>
          </Button>
        </motion.div>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex gap-6 px-3 justify-center">
             {[1, 2, 3].map((i) => (
               <div key={i} className="w-[320px] md:w-[380px] h-[220px] bg-white rounded-3xl animate-pulse border border-border/40" />
             ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="flex overflow-hidden">
            <motion.div 
              animate={{ x: ["0%", "-100%"] }}
              transition={{ 
                repeat: Infinity, 
                duration: Math.max(80, reviews.length * 25), 
                ease: "linear" 
              }}
              className="flex gap-6 px-3 hover:[animation-play-state:paused]"
              style={{ width: "fit-content" }}
            >
              {[...reviews, ...reviews, ...reviews, ...reviews].map((review, idx) => (
                <ReviewCard key={`${review.id}-${idx}`} review={review} />
              ))}
            </motion.div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">Be the first to share your experience!</p>
        )}
        
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none" />
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
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
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
                      <div className="grid grid-cols-2 gap-4">
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
                                    ? "fill-accent text-accent" 
                                    : "text-muted-foreground/30 fill-muted/20"
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
                      className="w-full h-14 rounded-full bg-primary text-white font-bold text-sm tracking-widest uppercase hover:bg-secondary transition-all disabled:opacity-50"
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
    <div className="w-[320px] md:w-[380px] bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-border/40 shrink-0 group hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-border/50 flex items-center justify-center bg-muted/30">
          {review.guestAvatarUrl ? (
            <img src={review.guestAvatarUrl} alt={review.guestName} loading="lazy" decoding="async" className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-muted-foreground/40" />
          )}
        </div>
        <div>
          <div className="flex gap-0.5 mb-1">
            {[...Array(review.ratingOverall)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-accent text-accent" />
            ))}
          </div>
          <h4 className="font-bold text-sm text-foreground leading-tight">{review.guestName}</h4>
        </div>
      </div>

      <h5 className="font-serif font-bold text-lg text-foreground mb-3 leading-tight italic">"{review.title || "Wonderful Stay"}"</h5>
      
      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-0">
        {review.reviewText}
      </p>
    </div>
  );
}
