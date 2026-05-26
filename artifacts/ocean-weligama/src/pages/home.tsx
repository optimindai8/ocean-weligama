import { motion } from "framer-motion";
import { Footer } from "@/components/footer";
import { Testimonials } from "@/components/testimonials";
import { useListServices, useListFeaturedRooms } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Users, BedDouble, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

const ROOM_CATEGORIES = [
  { value: "", label: "All Spaces" },
  { value: "solo", label: "Solo Traveler Packages" },
  { value: "couples", label: "Two Person Packages" },
  { value: "family", label: "Family Accommodation" },
];

export default function Home() {
  const { formatPrice } = useLanguage();
  const { data: services } = useListServices();
  const { data: rooms } = useListFeaturedRooms();

  return (
    <div className="flex-1">
      
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "max(100svh, 750px)" }}
      >
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          {/* Hero video */}
          <video
            key="hero-video"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            poster="/hero-video-poster.jpg"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              WebkitPlaysinline: true,
              WebkitObjectFit: "cover",
            } as React.CSSProperties}
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Multi-layered Cinematic Overlay — slightly stronger on mobile for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.45)_100%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center pt-20 pb-24 md:pt-0 md:pb-16">
          {/* Trust Badges - Social Proof Anchor */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 group hover:bg-white/20 transition-all cursor-default"
            >
              <div className="flex text-accent group-hover:scale-110 transition-transform">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="text-white text-sm font-black tracking-widest uppercase">4.9 Rating</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white/10 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 group hover:bg-white/20 transition-all cursor-default"
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-white text-sm font-black tracking-widest uppercase">240+ Happy Guests</span>
            </motion.div>
          </div>

          {/* Cinematic Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-2xl">
              Your Ocean Home <br/> <span className="text-accent italic font-normal">in Weligama</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="relative inline-block mb-12"
          >
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-accent rounded-full" />
            <p className="text-lg md:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed pl-4">
              <span className="text-white font-bold">100 steps from the ocean.</span> <br className="md:hidden"/>
              Barefoot beach living meets Sri Lankan hospitality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link href="/book">
              <Button size="lg" className="
                relative overflow-hidden
                bg-[#F0A500] hover:bg-[#D99500] text-white rounded-full 
                px-8 h-12 text-base sm:px-16 sm:h-16 sm:text-xl font-bold shadow-[0_20px_50px_rgba(240,165,0,0.3)]
                hover:shadow-[0_20px_60px_rgba(240,165,0,0.5)]
                transition-all duration-500 hover:scale-105 group
              ">
                {/* Button Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center gap-3">
                  Check Availability
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="9 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* High-End Reassurance Panel (Trust Bar) */}
      <section className="relative -mt-8 md:-mt-16 z-20 container mx-auto px-4">
        <div className="bg-white/75 hover:bg-white/85 transition-colors duration-500 backdrop-blur-2xl rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-12">
            {[
              { icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              ), title: "Secure Booking", desc: "Instant confirmation" },
              { icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ), title: "100 Steps to Beach", desc: "Prime surf location" },
              { icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              ), title: "4.9 Guest Rating", desc: "Top-rated hospitality" },
              { icon: (
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2 2 0 012 2v.657M7 20h11a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" /></svg>
              ), title: "Expert Surf Hub", desc: "ISA certified team" },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/5 flex items-center justify-center mb-3 md:mb-6 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-primary/20">
                  <div className="text-primary group-hover:text-white transition-colors duration-500">
                    {item.icon}
                  </div>
                </div>
                <h4 className="font-bold text-foreground text-xs sm:text-sm md:text-base mb-1 tracking-tight">{item.title}</h4>
                <p className="text-muted-foreground text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Experience Section (Surf, Stay, Taste, Explore) */}
      <section id="services" className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-3 block"
            >
              The Ocean Air Experience
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">Surf • Stay • Taste • Explore</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Surf", 
                tagline: "Ride the waves", 
                description: "Experience the thrill of Weligama's world-class breaks.", 
                img: "/service-surf.png",
                delay: 0.1
              },
              { 
                title: "Stay", 
                tagline: "Chill by the ocean", 
                description: "Barefoot luxury meets Sri Lankan hospitality.", 
                img: "/service-stay.png",
                delay: 0.2
              },
              { 
                title: "Taste", 
                tagline: "Taste the island", 
                description: "Authentic flavors and fresh local ingredients.", 
                img: "/service-taste.png",
                delay: 0.3
              },
              { 
                title: "Explore", 
                tagline: "Local traditions", 
                description: "From beach life to hidden island gems.", 
                img: "/service-explore.jpg",
                delay: 0.4
              }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative h-[320px] sm:h-[450px] rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end transform transition-transform duration-500 lg:group-hover:translate-y-[-10px]">
                  <span className="text-white/70 text-xs tracking-widest uppercase mb-2 block">{item.tagline}</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80 text-xs sm:text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 max-w-[240px]">
                    {item.description}
                  </p>
                  
                  <div className="mt-4 md:mt-6 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:scale-110">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-muted container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-primary mb-4">Your Private Sanctuary</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {Array.isArray(rooms) && rooms.length > 0 ? rooms.map((room: any, idx) => {
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
            );
          }) : (
            <p className="text-center col-span-full py-12 text-muted-foreground">No rooms found.</p>
          )}
        </div>
      </section>

      <Testimonials />
      <Footer />
    </div>
  );
}
