import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetRoom } from "@workspace/api-client-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BedDouble, Square, Bath, Wifi, Check, ArrowLeft, ArrowRight, X, Heart, Share, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function RoomDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: room, isLoading } = useGetRoom(slug ?? "");
  const { formatPrice } = useLanguage();
  
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="pt-20 container mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-96 rounded-3xl w-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-center py-24">
          <h1 className="text-3xl font-bold text-foreground mb-4">Room not found</h1>
          <Link href="/rooms">
            <Button variant="outline" className="rounded-full">Browse all rooms</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Fallback to heroImageUrl if gallery is empty
  const images = (room.gallery && room.gallery.length > 0) ? room.gallery : (room.heroImageUrl ? [room.heroImageUrl] : []);
  const coverImg = images.length > 0 ? images[0] : null;

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb / Top Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/rooms">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold group">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Back to All Accommodations
              </button>
            </Link>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:bg-muted px-4 py-2 rounded-full transition-colors">
                <Share className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-foreground hover:bg-muted px-4 py-2 rounded-full transition-colors">
                <Heart className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">{room.name}</h1>
        </div>

        {/* Dynamic Gallery Grid (Bento Box style) */}
        <div className="container mx-auto px-4 mb-12">
          {images.length === 0 ? (
            <div className="w-full h-[50vh] rounded-[2rem] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <BedDouble className="w-16 h-16 text-primary/20" />
            </div>
          ) : images.length === 1 ? (
            <div 
              className="w-full h-[50vh] md:h-[60vh] rounded-[2rem] overflow-hidden cursor-pointer relative group"
              onClick={() => setIsGalleryOpen(true)}
            >
              <img src={images[0]} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[50vh] md:h-[60vh] rounded-[2rem] overflow-hidden">
              <div 
                className="md:col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
                onClick={() => { setCurrentImageIdx(0); setIsGalleryOpen(true); }}
              >
                <img src={images[0]} alt="Primary" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              
              {images.slice(1, 5).map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative cursor-pointer group overflow-hidden hidden md:block ${images.length === 2 ? 'col-span-2 row-span-2' : ''}`}
                  onClick={() => { setCurrentImageIdx(idx + 1); setIsGalleryOpen(true); }}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  
                  {idx === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold text-lg">+{images.length - 5} photos</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16 relative">
            
            {/* Left - Details */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-4 mb-8">
                {room.category && (
                  <Badge className="bg-primary text-white border-0 capitalize px-4 py-1.5 rounded-full shadow-sm text-xs font-bold">
                    {room.category.replace(/-/g, ' ')}
                  </Badge>
                )}
                <Badge className="bg-muted text-foreground border-0 capitalize px-4 py-1.5 rounded-full shadow-sm text-xs font-bold">
                  {room.type}
                </Badge>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-x-8 gap-y-4 py-8 border-y border-border mb-10">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Guests</span>
                  <div className="flex items-center gap-2 text-foreground font-bold">
                    <Users className="w-5 h-5 text-accent" />
                    <span>Up to {room.maxGuests}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bedrooms</span>
                  <div className="flex items-center gap-2 text-foreground font-bold">
                    <BedDouble className="w-5 h-5 text-accent" />
                    <span>{room.bedrooms}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bathrooms</span>
                  <div className="flex items-center gap-2 text-foreground font-bold">
                    <Bath className="w-5 h-5 text-accent" />
                    <span>{room.bathrooms}</span>
                  </div>
                </div>

                {room.sizeM2 && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Size</span>
                    <div className="flex items-center gap-2 text-foreground font-bold">
                      <Square className="w-5 h-5 text-accent" />
                      <span>{room.sizeM2} m²</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="prose prose-lg text-muted-foreground leading-relaxed mb-12 max-w-none">
                <p>{room.description}</p>
              </div>

              {/* Highlights */}
              {Array.isArray(room.highlights) && room.highlights.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Features & Inclusions</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {room.highlights.map((highlight: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 bg-muted/50 p-4 rounded-2xl border border-transparent hover:border-border transition-colors">
                        <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <span className="text-foreground text-sm font-medium leading-tight">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Booking CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2rem] p-8 border border-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] sticky top-28">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-foreground">{formatPrice(room.basePricePerNight)}</span>
                    <span className="text-muted-foreground font-medium"> / night</span>
                  </div>
                  {Number(room.cleaningFee) > 0 && (
                    <p className="text-sm text-muted-foreground mt-2 font-medium">
                      + {formatPrice(room.cleaningFee ?? "0")} cleaning fee
                    </p>
                  )}
                </div>
                
                <div className="border-t border-border/60 my-6" />
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-bold text-foreground">Free cancellation (48h)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-bold text-foreground">Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <Wifi className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-foreground">Fast WiFi included</span>
                  </div>
                </div>

                <Link href={`/book?room=${room.id}`}>
                  <Button
                    className="w-full bg-[#F0A500] hover:bg-[#D99500] hover:-translate-y-1 text-white rounded-full h-14 font-bold text-lg shadow-[0_10px_20px_rgba(240,165,0,0.2)] hover:shadow-[0_15px_30px_rgba(240,165,0,0.3)] transition-all duration-300"
                    data-testid="button-book-room"
                  >
                    Check Availability
                  </Button>
                </Link>
                
                <Link href="/contact">
                  <Button variant="outline" className="w-full mt-4 rounded-full h-12 font-bold text-foreground hover:bg-muted border-2">
                    Ask a Question
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Gallery */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button 
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="absolute top-6 left-6 text-white font-bold tracking-widest text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentImageIdx + 1} / {images.length}
            </div>

            <div className="relative w-full max-w-6xl px-4 flex items-center justify-center aspect-video md:aspect-[21/9]">
              <img 
                src={images[currentImageIdx]} 
                alt={`Gallery image ${currentImageIdx + 1}`}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
              
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-8 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 p-4 rounded-full transition-all backdrop-blur-md"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-8 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 p-4 rounded-full transition-all backdrop-blur-md"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto pb-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${currentImageIdx === idx ? 'ring-2 ring-white scale-110 opacity-100 z-10' : 'opacity-50 hover:opacity-80'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
