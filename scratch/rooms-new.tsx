import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListRooms, ListRoomsType } from "@workspace/api-client-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BedDouble, Square, ArrowRight, Wind, Wifi, Coffee } from "lucide-react";

const ROOM_CATEGORIES = [
  { value: "", label: "All Spaces" },
  { value: "solo", label: "Solo Traveler Packages" },
  { value: "couples", label: "Two Person Packages" },
  { value: "family", label: "Family Accommodation" },
];

import { useLanguage } from "@/components/LanguageContext";

export default function RoomsPage() {
  const { formatPrice } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("");
  // Since we don't have category filtering natively in the hook API yet, we fetch all and filter client side
  const { data: rooms, isLoading } = useListRooms();

  const filteredRooms = rooms?.filter((r: any) => {
    if (!activeCategory) return true;
    return r.category === activeCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <Navbar />

      {/* Cinematic Mood Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white blur-[120px] rounded-full" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8"
          >
            <BedDouble className="w-4 h-4 text-accent" />
            <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">Private Sanctuaries</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-8"
          >
            Find Your <br/> <span className="italic font-normal text-accent">Ocean Soul</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-serif italic"
          >
            "Where barefoot luxury meets the rhythm of the waves."
          </motion.p>
        </div>
      </section>

      {/* Interactive Mood Filters */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-2xl border-b border-border py-4 overflow-x-auto whitespace-nowrap">
        <div className="container mx-auto px-4 flex gap-4 min-w-max">
          {ROOM_CATEGORIES.map((t) => (
            <button
              key={t.value}
              onClick={() => setActiveCategory(t.value)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-500 border ${
                activeCategory === t.value
                  ? "bg-primary text-white border-primary shadow-xl scale-105"
                  : "bg-white text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* The Sanctuary Grid */}
      <section className="py-24 container mx-auto px-4 flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[500px] rounded-[3rem]" />
            ))}
          </div>
        ) : Array.isArray(filteredRooms) && filteredRooms.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20"
          >
            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room: any, idx) => {
                const coverImg = (room.gallery && room.gallery.length > 0) ? room.gallery[0] : room.heroImageUrl;
                const catLabel = ROOM_CATEGORIES.find(c => c.value === room.category)?.label || "Room";
                
                return (
                <motion.div
                  key={room.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="group relative"
                >
                  {/* Luxury Reveal Card */}
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-xl group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all duration-700 bg-muted">
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                        <BedDouble className="w-16 h-16 text-primary/20" />
                      </div>
                    )}

                    {/* Adaptive Disclosure Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-8 left-8 flex flex-col gap-2">
                      <Badge className="bg-white text-primary border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        {catLabel}
                      </Badge>
                      {room.isFeatured && (
                        <Badge className="bg-accent text-primary border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full w-fit shadow-lg">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 capitalize text-[10px] font-bold">
                      {room.type}
                    </div>

                    {/* Reveal Content */}
                    <div className="absolute inset-0 p-10 flex flex-col justify-end transform translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                      
                      {room.highlights && room.highlights.length > 0 && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 mb-4">
                          <ul className="text-white/80 text-xs font-medium space-y-1">
                            {room.highlights.slice(0, 3).map((h: string, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-accent" />
                                {h}
                              </li>
                            ))}
                            {room.highlights.length > 3 && (
                              <li className="text-white/50 text-[10px] italic pt-1">+ {room.highlights.length - 3} more</li>
                            )}
                          </ul>
                        </div>
                      )}

                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6 leading-tight">
                        {room.name}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-accent" />{room.maxGuests} Guests</span>
                        <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-accent" />{room.bedrooms} Bed</span>
                      </div>

                      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">Starting from</span>
                          <span className="text-2xl font-bold text-white">{formatPrice(room.basePricePerNight)}<span className="text-sm font-normal text-white/60">/night</span></span>
                        </div>
                        <Link href={`/rooms/${room.slug}`}>
                          <button className="bg-accent text-primary w-14 h-14 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-2xl">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Clean Background Text (Visible by default) */}
                  <div className="mt-8 px-4 text-center group-hover:opacity-0 transition-opacity duration-500">
                    <h4 className="text-xl font-serif font-bold text-foreground">{room.name}</h4>
                    <p className="text-primary text-sm font-black mt-2">{formatPrice(room.basePricePerNight)} / night</p>
                  </div>
                </motion.div>
              )})}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-40">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8">
              <BedDouble className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-foreground mb-4">No sanctuaries found</h3>
            <p className="text-muted-foreground text-lg">We couldn't find any rooms for this category.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
