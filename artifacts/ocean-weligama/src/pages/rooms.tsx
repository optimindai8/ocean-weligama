import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListRooms, ListRoomsType } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BedDouble, Square, ArrowRight, Wind, Wifi, Coffee } from "lucide-react";
import { PageHero } from "@/components/page-hero";

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

  const getCount = (catValue: string) => {
    if (!rooms || !Array.isArray(rooms)) return 0;
    if (catValue === "") return rooms.length;
    return rooms.filter((r: any) => r.category === catValue).length;
  };

  const filteredRooms = rooms?.filter((r: any) => {
    if (!activeCategory) return true;
    return r.category === activeCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">

      <PageHero
        title="Find Your Ocean Soul"
        description="Where barefoot luxury meets the rhythm of the waves."
        badgeText="Private Sanctuaries"
        badgeIcon={<BedDouble className="w-3.5 h-3.5 text-[#4BBCCC]" />}
      />

      {/* Interactive Mood Filters */}
      <section className="relative z-20 px-4 py-8 -mb-12 mt-4 max-w-full">
        <div className="container mx-auto flex flex-wrap gap-4 justify-center">
          {ROOM_CATEGORIES.map((t) => {
            const isActive = activeCategory === t.value;
            const count = getCount(t.value);
            return (
              <button
                key={t.value}
                onClick={() => setActiveCategory(t.value)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm border ${
                  isActive 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                    : "bg-white/80 backdrop-blur-md text-muted-foreground border-white/40 hover:border-primary/30 hover:text-foreground hover:bg-white"
                }`}
              >
                <span>{t.label}</span>
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] transition-colors ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-95 transition-all duration-700" />
                    
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

                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white opacity-100 transition-all duration-500 capitalize text-[10px] font-bold">
                      {room.type}
                    </div>

                    {/* Reveal Content */}
                    <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end transition-transform duration-700">
                      
                      {room.highlights && room.highlights.length > 0 && (
                        <div className="opacity-100 transition-opacity duration-700 delay-100 mb-4">
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

                      <div className="flex flex-wrap gap-4 text-white/70 text-[10px] font-bold uppercase tracking-widest mb-4 sm:mb-6 opacity-100 transition-opacity duration-700 delay-200">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-accent" />{room.maxGuests} Guests</span>
                        <span className="flex items-center gap-1.5"><BedDouble className="w-3.5 h-3.5 text-accent" />{room.bedrooms} Bed</span>
                      </div>

                      <div className="flex items-center justify-between opacity-100 transition-opacity duration-700 delay-300">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-1">Starting from</span>
                          <span className="text-xl sm:text-2xl font-bold text-white">{formatPrice(room.basePricePerNight)}<span className="text-xs sm:text-sm font-normal text-white/60">/night</span></span>
                        </div>
                        <Link href={`/rooms/${room.slug}`}>
                          <button className="bg-accent text-primary w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-2xl">
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Clean Background Text */}
                  <div className="block mt-6 px-2 text-center transition-opacity duration-500">
                    <h4 className="text-lg md:text-xl font-serif font-bold text-foreground line-clamp-2 mb-1">{room.name}</h4>
                    <p className="text-primary text-sm font-black">{formatPrice(room.basePricePerNight)} / night</p>
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
