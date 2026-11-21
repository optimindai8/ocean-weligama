import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useGetRoom } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, BedDouble, Bath, Wifi, Check, ArrowLeft, X, 
  ChevronLeft, ChevronRight, Calendar, Camera, ShieldCheck, 
  Award, Bell, Waves, Coffee, CheckCircle2, Star 
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { SEO } from "@/seo/SEO";
import { StructuredData } from "@/seo/StructuredData";

const fallbackRoomImages = [
  "/images/Comfortable_Basic_Private.jpeg",
  "/images/gallery-room-luxury.jpg",
  "/images/Deluxe_Double with_Balcony.jpeg",
  "/images/_ (1).jpeg",
  "/images/gallery-interior.png",
];

const specsContainerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.05,
    },
  },
};

const specCardVariants: any = {
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
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const descriptionCardVariants: any = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.35,
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

const featuresContainerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const featureCardLeftVariants: any = {
  hidden: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const featureCardRightVariants: any = {
  hidden: {
    opacity: 0,
    x: 60,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const dockContainerVariants: any = {
  hidden: {
    opacity: 0,
    x: 40,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const dockItemVariants: any = {
  hidden: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const priceBoxContainerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const priceHeaderVariants: any = {
  hidden: {
    opacity: 0,
    x: 50,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const pricePointLeftVariants: any = {
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
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const pricePointRightVariants: any = {
  hidden: {
    opacity: 0,
    x: 45,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const priceButtonUpVariants: any = {
  hidden: {
    opacity: 0,
    y: 35,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const priceFooterVariants: any = {
  hidden: {
    opacity: 0,
    y: 15,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const roomTitleVariants: any = {
  hidden: {
    opacity: 0,
    y: -35,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const galleryContainerVariants: any = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const galleryMainImageVariants: any = {
  hidden: {
    opacity: 0,
    x: -70,
    transition: {
      duration: 0.35,
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

const galleryTopLeftVariants: any = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const galleryTopRightVariants: any = {
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
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const galleryBottomLeftVariants: any = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const galleryBottomRightVariants: any = {
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
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const galleryButtonVariants: any = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const mobileGalleryVariants: any = {
  hidden: {
    opacity: 0,
    y: 30,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const getGalleryVariant = (idx: number) => {
  switch (idx) {
    case 0: return galleryTopLeftVariants;
    case 1: return galleryTopRightVariants;
    case 2: return galleryBottomLeftVariants;
    case 3: return galleryBottomRightVariants;
    default: return galleryTopRightVariants;
  }
};

function AnimatedStarRating() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const [rating, setRating] = useState("0.0");
  const [reviews, setReviews] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    const duration = 2200; // Relaxed, luxurious pacing (2.2s)

    if (isInView) {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const currentRating = (easeOut * 5.0).toFixed(1);
        const currentReviews = Math.round(easeOut * 48);

        setRating(currentRating);
        setReviews(currentReviews);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setRating("5.0");
          setReviews(48);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    } else {
      setRating("0.0");
      setReviews(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView]);

  return (
    <div ref={containerRef} className="inline-flex items-center gap-2">
      {/* 5 Stars with Slow, Smooth Liquid Gold Fill Animation */}
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className="relative w-4 h-4 flex items-center justify-center">
            {/* Background Empty / Outline Star */}
            <Star className="w-4 h-4 text-slate-200 stroke-slate-300 stroke-[1.5] fill-slate-100/80 shrink-0" />

            {/* Foreground Liquid Gold Filled Star with Staggered Clip-Path */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : { width: "0%" }}
              transition={{
                duration: 0.55,
                delay: index * 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Star className="w-4 h-4 min-w-4 max-w-none text-[#FBBF24] fill-[#FBBF24] drop-shadow-[0_1px_3px_rgba(251,191,36,0.4)]" />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Counting Star Rating (0.0 -> 5.0) */}
      <span className="text-sm font-black text-[#061d2d] tabular-nums tracking-tight">
        {rating}
      </span>

      {/* Counting Review Count (0 -> 48+ Reviews) */}
      <span className="text-xs text-slate-500 font-medium tabular-nums">
        • {reviews}+ Reviews
      </span>
    </div>
  );
}

export default function RoomDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: room, isLoading } = useGetRoom(slug ?? "");
  const { formatPrice } = useLanguage();
  
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mobileIdx, setMobileIdx] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="pt-32 sm:pt-36 container mx-auto px-4 py-16 space-y-8 max-w-[1400px]">
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
        <div className="pt-36 sm:pt-40 container mx-auto px-4 text-center py-24 max-w-[1400px]">
          <h1 className="text-3xl font-bold text-foreground mb-4">Room not found</h1>
          <Link href="/rooms">
            <Button variant="outline" className="rounded-full">Browse all rooms</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Curate photos: guarantee at least 5 luxury photos for the 5-photo grid matching design
  const rawImages = (room.gallery && room.gallery.length > 0) 
    ? room.gallery 
    : (room.heroImageUrl ? [room.heroImageUrl] : []);
  const images = Array.from(new Set([...rawImages, ...fallbackRoomImages]));

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const quickSpecs = [
    {
      icon: <Users className="w-5 h-5 text-[#0B3D5E]" />,
      label: "Guests",
      value: `Up to ${room.maxGuests}`,
    },
    {
      icon: <BedDouble className="w-5 h-5 text-[#0B3D5E]" />,
      label: "Bedrooms",
      value: `${room.bedrooms} ${room.bedrooms === 1 ? 'Bed' : 'Beds'}`,
    },
    {
      icon: <Bath className="w-5 h-5 text-[#0B3D5E]" />,
      label: "Baths",
      value: `${room.bathrooms} Private`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-foreground selection:bg-[#FBBF24] selection:text-[#0B3D5E] pb-24 lg:pb-0 overflow-x-hidden">
      <SEO 
        title={`${room.name} — Luxury Beachfront Accommodation`}
        description={room.description?.slice(0, 160).replace(/\s+/g, ' ') + '...' || `Book the luxury ${room.name} at Ocean Air Weligama. Enjoy beachfront views, surf lessons, free Wi-Fi, and 100% barefoot luxury in Weligama Bay.`}
        canonicalPath={`/rooms/${slug}`}
        keywords={[`${room.name}`, `Weligama ${room.name}`, "Ocean View Accommodation Weligama", "Ocean Air Weligama"]}
        ogImage={room.heroImageUrl ?? undefined}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Rooms", item: "/rooms" },
          { name: room.name, item: `/rooms/${slug}` },
        ]}
        room={{
          slug: room.slug || slug,
          name: room.name,
          description: room.description,
          heroImageUrl: room.heroImageUrl,
          basePrice: (room as any).basePrice ?? room.basePricePerNight,
          maxGuests: room.maxGuests,
          bedType: (room as any).bedType,
          amenities: (room as any).amenities,
        }}
      />

      <div className="pt-32 sm:pt-36 lg:pt-40 pb-16 relative">
        {/* Soft Coastal Background Ambient Glows */}
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-[#FBBF24]/08 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-96 left-0 w-[600px] h-[600px] bg-[#0B3D5E]/05 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          {/* Top Back Navigation Pill */}
          <div className="mb-6 sm:mb-8">
            <Link href="/rooms">
              <button
                type="button"
                className="inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-full bg-white/85 hover:bg-white text-[#0B3D5E] hover:text-[#061d2d] border border-slate-200/90 hover:border-[#FBBF24]/70 shadow-[0_4px_16px_rgba(11,61,94,0.06)] hover:shadow-[0_8px_25px_rgba(251,191,36,0.22)] backdrop-blur-md transition-all duration-300 group cursor-pointer active:scale-95"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0B3D5E]/08 group-hover:bg-[#FBBF24] flex items-center justify-center text-[#0B3D5E] group-hover:text-[#061d2d] transition-all duration-300 shadow-sm group-hover:-translate-x-0.5">
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                  Back to all accommodations
                </span>
              </button>
            </Link>
          </div>

          {/* Luminous Transparent Frosted Glass Showcase Box */}
          <div className="relative rounded-[2.5rem] sm:rounded-[3rem] bg-white/70 backdrop-blur-2xl border border-white/80 p-5 sm:p-8 lg:p-10 shadow-[0_24px_70px_-20px_rgba(11,61,94,0.1),0_4px_25px_rgba(251,191,36,0.05)]">
            {/* Ambient Lighting Orbs inside Frosted Box */}
            <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FBBF24]/08 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-[#0B3D5E]/05 rounded-full blur-3xl" />
            </div>

            {/* Room Title Header with 5-Star Review in front */}
            <div className="relative z-10 flex flex-col gap-2.5 mb-6 sm:mb-8">
              <AnimatedStarRating />

              <motion.h1 
                variants={roomTitleVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#061d2d] tracking-tight"
              >
                {room.name}
              </motion.h1>
            </div>

            {/* 5-Photo Luxury Gallery (Exact 1-large on left + 2x2 grid on right matching user's photo) */}
            <div className="relative z-10 mb-10 sm:mb-14">
              {/* Desktop/Tablet 5-Photo Gallery */}
              <motion.div 
                variants={galleryContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                className="hidden md:grid md:grid-cols-12 gap-3 sm:gap-4 h-[440px] sm:h-[500px] lg:h-[560px] relative"
              >
                {/* Left: 1 Large Hero Photo - Smooth & Slow from Left Side */}
                <motion.div 
                  variants={galleryMainImageVariants}
                  className="md:col-span-6 h-full relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-shadow duration-500"
                  onClick={() => { setCurrentImageIdx(0); setIsGalleryOpen(true); }}
                >
                  <img 
                    src={images[0]} 
                    alt={room.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </motion.div>

                {/* Right: 4 Photos in a 2x2 Grid with Directional Entrances */}
                <div className="md:col-span-6 grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 h-full">
                  {images.slice(1, 5).map((img, idx) => {
                    const actualIdx = idx + 1;
                    const isFourth = idx === 3;
                    const hasMore = images.length > 5;
                    const variant = getGalleryVariant(idx);

                    return (
                      <motion.div 
                        key={idx}
                        variants={variant}
                        className="relative h-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-shadow duration-500"
                        onClick={() => { setCurrentImageIdx(actualIdx); setIsGalleryOpen(true); }}
                      >
                        <img 
                          src={img} 
                          alt={`${room.name} gallery ${actualIdx}`} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* +X More Photos Overlay on 4th slot if extra photos exist */}
                        {isFourth && hasMore && (
                          <div className="absolute inset-0 bg-[#061d2d]/65 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-3 group-hover:bg-[#061d2d]/75 transition-colors">
                            <Camera className="w-6 h-6 text-[#FBBF24] mb-1.5" />
                            <span className="font-bold text-sm sm:text-base">+{images.length - 5} more</span>
                            <span className="text-[11px] text-white/80 font-medium">View all photos</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Floating "View all photos" Button at Bottom Right */}
                <motion.button 
                  variants={galleryButtonVariants}
                  onClick={() => setIsGalleryOpen(true)}
                  className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-[#061d2d] font-bold text-xs shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-200/80 active:scale-95"
                >
                  <Camera className="w-4 h-4 text-[#0B3D5E]" />
                  <span>Show all {images.length} photos</span>
                </motion.button>
              </motion.div>

              {/* Mobile Swipeable Carousel */}
              <motion.div 
                variants={mobileGalleryVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="block md:hidden relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden bg-slate-900 shadow-md"
              >
                <motion.div
                  className="flex h-full w-full"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold && mobileIdx < images.length - 1) {
                      setMobileIdx(prev => prev + 1);
                    } else if (info.offset.x > swipeThreshold && mobileIdx > 0) {
                      setMobileIdx(prev => prev - 1);
                    }
                  }}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.img
                      key={mobileIdx}
                      src={images[mobileIdx]}
                      alt={`Room image ${mobileIdx + 1}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover cursor-pointer shrink-0"
                      onClick={() => { setCurrentImageIdx(mobileIdx); setIsGalleryOpen(true); }}
                    />
                  </AnimatePresence>
                </motion.div>
                
                {/* Progress Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                  {mobileIdx + 1} / {images.length}
                </div>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                  {images.slice(0, 8).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${mobileIdx === i ? 'bg-[#FBBF24] w-6' : 'bg-white/50 w-1.5'}`}
                    />
                  ))}
                </div>
                
                {/* Touch Arrow Controls */}
                {mobileIdx > 0 && (
                  <button
                    onClick={() => setMobileIdx(prev => prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {mobileIdx < images.length - 1 && (
                  <button
                    onClick={() => setMobileIdx(prev => prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            </div>

            {/* 2-Column Section: Left = Room Details & Features, Right = The Luxury Price Box */}
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start relative">
                
                {/* Left Column: Specs, The Sanctuary Description, and Inclusions */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
                  
                  {/* Quick Specs Cards - Staggered Slide In Smoothly From Left One by One */}
                  <motion.div
                    variants={specsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-1"
                  >
                    {quickSpecs.map((spec, idx) => (
                      <motion.div
                        key={idx}
                        variants={specCardVariants}
                        whileHover={{ y: -3, scale: 1.015, transition: { duration: 0.2 } }}
                        className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 hover:border-[#FBBF24]/60 shadow-[0_4px_16px_rgba(11,61,94,0.04)] hover:shadow-[0_8px_24px_rgba(11,61,94,0.08)] flex items-center gap-3.5 transition-colors cursor-default"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#0B3D5E]/08 flex items-center justify-center text-[#0B3D5E] shrink-0">
                          {spec.icon}
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            {spec.label}
                          </span>
                          <span className="text-sm font-bold text-[#061d2d]">
                            {spec.value}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* The Sanctuary Description Card - Smooth Slide Up Entrance on Scroll */}
                  <motion.div
                    variants={descriptionCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-7 sm:p-9 border border-slate-200/90 shadow-[0_12px_40px_rgba(11,61,94,0.05)] relative"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2.5 h-6 rounded-full bg-[#FBBF24]" />
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#061d2d]">
                        The Sanctuary
                      </h2>
                    </div>
                    <div className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal whitespace-pre-wrap">
                      {room.description}
                    </div>
                  </motion.div>

                  {/* Features & Inclusions Grid - Smooth Alternating Slide In From Left & Right */}
                  {Array.isArray(room.highlights) && room.highlights.length > 0 && (
                    <div className="flex flex-col gap-5">
                      <motion.h2 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl sm:text-2xl font-serif font-bold text-[#061d2d] flex items-center gap-3"
                      >
                        <Award className="w-5 h-5 text-[#FBBF24]" />
                        Features &amp; Inclusions
                      </motion.h2>
                      <motion.div 
                        variants={featuresContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.15 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                      >
                        {room.highlights.map((highlight: string, idx: number) => {
                          const isLeft = idx % 2 === 0;
                          return (
                            <motion.div 
                              key={idx} 
                              variants={isLeft ? featureCardLeftVariants : featureCardRightVariants}
                              whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
                              className="flex items-center gap-3 bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 hover:border-[#FBBF24]/60 transition-colors shadow-sm cursor-default"
                            >
                              <div className="w-6 h-6 rounded-full bg-[#FBBF24] text-[#061d2d] flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <span className="text-[#061d2d] text-sm font-semibold">{highlight}</span>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>
                  )}

                  {/* Coastal Atmosphere Reassurance Dock - Smooth Staggered Slide In From Right One by One */}
                  <motion.div 
                    variants={dockContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.2 }}
                    className="rounded-2xl bg-gradient-to-r from-[#0B3D5E]/06 via-[#FBBF24]/08 to-[#0B3D5E]/06 border border-slate-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <motion.div 
                      variants={dockItemVariants}
                      whileHover={{ scale: 1.02, x: -2, transition: { duration: 0.2 } }}
                      className="flex items-center gap-3 cursor-default"
                    >
                      <Waves className="w-5 h-5 text-[#0B3D5E] shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-[#061d2d]">100 Steps to Weligama Bay Surf Break</span>
                    </motion.div>
                    <motion.div 
                      variants={dockItemVariants}
                      whileHover={{ scale: 1.02, x: -2, transition: { duration: 0.2 } }}
                      className="flex items-center gap-3 cursor-default"
                    >
                      <Coffee className="w-5 h-5 text-[#0B3D5E] shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-[#061d2d]">Artisan Island Breakfast Available</span>
                    </motion.div>
                    <motion.div 
                      variants={dockItemVariants}
                      whileHover={{ scale: 1.02, x: -2, transition: { duration: 0.2 } }}
                      className="flex items-center gap-3 cursor-default"
                    >
                      <ShieldCheck className="w-5 h-5 text-[#0B3D5E] shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-[#061d2d]">Daily Boutique Housekeeping</span>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Column: The Luxury Sticky Price Box */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-28 lg:top-32">
                  <motion.div 
                    variants={priceBoxContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.15 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[2.25rem] p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(11,61,94,0.09)] relative overflow-hidden"
                  >
                    {/* Golden Hairline Top Accent */}
                    <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#FBBF24]/80 to-transparent pointer-events-none" />

                    {/* Price Display - Comes in From Right */}
                    <motion.div variants={priceHeaderVariants} className="mb-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]/70 block mb-1">
                        BEST AVAILABLE RATE
                      </span>
                      
                      <div className="flex items-baseline gap-2">
                        {(room as any).adjustedPrice ? (
                          parseFloat((room as any).adjustedPrice) < parseFloat((room as any).originalPrice || room.basePricePerNight) ? (
                            <>
                              <s className="text-xl font-medium text-slate-400 mr-1.5">{formatPrice((room as any).originalPrice || room.basePricePerNight)}</s>
                              <span className="text-4xl sm:text-5xl font-black font-serif text-[#061d2d] tracking-tight">{formatPrice((room as any).adjustedPrice)}</span>
                            </>
                          ) : (
                            <span className="text-4xl sm:text-5xl font-black font-serif text-[#061d2d] tracking-tight">{formatPrice((room as any).adjustedPrice)}</span>
                          )
                        ) : (
                          <span className="text-4xl sm:text-5xl font-black font-serif text-[#061d2d] tracking-tight">{formatPrice(room.basePricePerNight)}</span>
                        )}
                        <span className="text-slate-500 font-semibold text-sm"> / night</span>
                      </div>

                      {Number(room.cleaningFee) > 0 && (
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                          + {formatPrice(room.cleaningFee ?? "0")} one-time cleaning fee
                        </p>
                      )}
                    </motion.div>

                    <div className="border-t border-slate-100 my-5" />

                    {/* Included Per Stay Checklist - Alternating Left & Right Staggered Entrance */}
                    <div className="space-y-3.5 mb-7">
                      <motion.div 
                        variants={pricePointLeftVariants}
                        whileHover={{ x: 3, transition: { duration: 0.2 } }}
                        className="flex items-center gap-3 cursor-default"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-[#061d2d]">Direct beach access (100 steps)</span>
                      </motion.div>

                      <motion.div 
                        variants={pricePointRightVariants}
                        whileHover={{ x: 3, transition: { duration: 0.2 } }}
                        className="flex items-center gap-3 cursor-default"
                      >
                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-[#061d2d]">Free cancellation &amp; flexible dates</span>
                      </motion.div>

                      <motion.div 
                        variants={pricePointLeftVariants}
                        whileHover={{ x: 3, transition: { duration: 0.2 } }}
                        className="flex items-center gap-3 cursor-default"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#0B3D5E]/10 text-[#0B3D5E] flex items-center justify-center shrink-0">
                          <Wifi className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-[#061d2d]">High-speed fiber Wi-Fi included</span>
                      </motion.div>

                      <motion.div 
                        variants={pricePointRightVariants}
                        whileHover={{ x: 3, transition: { duration: 0.2 } }}
                        className="flex items-center gap-3 cursor-default"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#FBBF24]/20 text-[#061d2d] flex items-center justify-center shrink-0">
                          <Bell className="w-4 h-4 text-[#FBBF24]" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-[#061d2d]">Boutique concierge assistance</span>
                      </motion.div>
                    </div>

                    {/* Primary CTA Button: Reserve This Sanctuary - Comes Down to Up */}
                    <motion.div variants={priceButtonUpVariants} className="w-full">
                      <Link href={`/book?room=${room.id}`} className="block w-full">
                        <Button
                          onClick={() => {
                            localStorage.setItem('booking_roomIds', JSON.stringify([room.id]));
                            localStorage.setItem('booking_stepId', JSON.stringify("dates"));
                            localStorage.removeItem('booking_matrixPrice');
                            localStorage.removeItem('booking_serviceIds');
                            localStorage.removeItem('booking_serviceQuantities');
                            localStorage.removeItem('booking_highlightCustom');
                          }}
                          className="w-full h-14 rounded-full bg-[#FBBF24] hover:bg-[#f59e0b] text-[#061d2d] font-bold text-base shadow-[0_8px_25px_rgba(251,191,36,0.35)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.45)] hover:-translate-y-0.5 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
                          data-testid="button-book-room"
                        >
                          <Calendar className="w-5 h-5 text-[#061d2d]" />
                          <span>Reserve This Sanctuary</span>
                        </Button>
                      </Link>
                    </motion.div>

                    {/* Secondary Inquire Button - Comes Down to Up */}
                    <motion.div variants={priceButtonUpVariants} className="w-full">
                      <Link href="/contact" className="block w-full">
                        <Button 
                          variant="outline" 
                          className="w-full mt-3.5 h-12 rounded-full border border-[#0B3D5E]/20 hover:border-[#0B3D5E] text-[#0B3D5E] hover:bg-[#0B3D5E]/05 font-semibold text-sm transition-all duration-300"
                        >
                          Ask Concierge a Question
                        </Button>
                      </Link>
                    </motion.div>

                    {/* Reassurance Footer - Fades in Upwards */}
                    <motion.div 
                      variants={priceFooterVariants}
                      className="flex items-center justify-center gap-2 text-center text-xs text-slate-400 mt-5"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant confirmation • Best rate guarantee</span>
                    </motion.div>
                  </motion.div>
                </div>
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

      {/* Mobile Sticky Booking CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[40] bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] px-5 py-3.5 flex items-center justify-between lg:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]/70 mb-0.5">Starting from</span>
          <div className="flex items-baseline gap-1">
            {(room as any).adjustedPrice ? (
              parseFloat((room as any).adjustedPrice) < parseFloat((room as any).originalPrice || room.basePricePerNight) ? (
                <>
                  <s className="text-xs font-medium text-slate-400 mr-1">{formatPrice((room as any).originalPrice || room.basePricePerNight)}</s>
                  <span className="text-lg font-black font-serif text-[#061d2d]">{formatPrice((room as any).adjustedPrice)}</span>
                </>
              ) : (
                <span className="text-lg font-black font-serif text-[#061d2d]">{formatPrice((room as any).adjustedPrice)}</span>
              )
            ) : (
              <span className="text-lg font-black font-serif text-[#061d2d]">{formatPrice(room.basePricePerNight)}</span>
            )}
            <span className="text-xs text-slate-500 font-semibold">/night</span>
          </div>
        </div>
        <Link href={`/book?room=${room.id}`} className="block">
          <Button
            onClick={() => {
              localStorage.setItem('booking_roomIds', JSON.stringify([room.id]));
              localStorage.setItem('booking_stepId', JSON.stringify("dates"));
              // Clear any stale package/matrix selections
              localStorage.removeItem('booking_matrixPrice');
              localStorage.removeItem('booking_serviceIds');
              localStorage.removeItem('booking_serviceQuantities');
              localStorage.removeItem('booking_highlightCustom');
            }}
            className="bg-[#FBBF24] hover:bg-[#f59e0b] text-[#061d2d] rounded-full px-5 h-11 font-bold text-sm shadow-[0_4px_16px_rgba(251,191,36,0.35)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            data-testid="button-book-room-mobile"
          >
            <Calendar className="w-4 h-4 text-[#061d2d]" />
            <span>Book Now</span>
          </Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
