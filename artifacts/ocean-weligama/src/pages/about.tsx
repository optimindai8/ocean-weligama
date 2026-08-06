import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Heart, 
  Waves, 
  Sun, 
  Anchor, 
  Camera, 
  Compass, 
  Coffee, 
  Utensils, 
  Award, 
  Smile, 
  Sparkles, 
  Ship, 
  Bike, 
  Check, 
  ChevronRight, 
  Map 
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SEO, StructuredData } from "@/seo";

// Neighborhood spots list with distances and descriptions
const NEIGHBORHOOD_SPOTS = [
  {
    id: "beach",
    name: "Weligama Beach",
    distance: "3 min walk",
    icon: Waves,
    details: "The perfect golden stretch of sand for surfers of all levels. Famous for its consistent, friendly waves and spectacular shallow-water learning areas."
  },
  {
    id: "dining",
    name: "Cafés & Restaurants",
    distance: "1-5 min walk",
    icon: Coffee,
    details: "A food lover's paradise. Stroll to a variety of highly rated spots serving authentic Sri Lankan rice & curry, fresh seafood, and specialty western coffee."
  },
  {
    id: "village",
    name: "Sri Lankan Village Life",
    distance: "On your doorstep",
    icon: MapPin,
    details: "Quiet, peaceful paths away from the bustling main road noise. Walk among swaying coconut trees and experience authentic, warm Sri Lankan village culture."
  },
  {
    id: "surf",
    name: "Surf Breaks & Points",
    distance: "3 min walk",
    icon: Compass,
    details: "Immediate access to local breaks. Whether you're catching your very first wave or seeking hidden points, our spot matches your travel style."
  }
];

// Experience Customizer activity list
const ACTIVITIES = [
  {
    id: "surf-pkg",
    name: "Surf Packages",
    desc: "Complete options designed for different skills, including board rentals & daily coach reviews.",
    icon: Award,
    category: "Adventure"
  },
  {
    id: "yoga",
    name: "Yoga Experiences",
    desc: "Restorative classes on our rooftop, perfect for deep surf recovery and centering your mind.",
    icon: Sparkles,
    category: "Wellness"
  },
  {
    id: "lessons",
    name: "Surfing Lessons",
    desc: "Step-by-step coaching from friendly, local ISA-certified instructors right at the beach.",
    icon: Waves,
    category: "Adventure"
  },
  {
    id: "whale-watching",
    name: "Whale Watching Tours",
    desc: "Stunning boat trips from neighboring Mirissa Harbor to see majestic blue whales up close.",
    icon: Ship,
    category: "Nature"
  },
  {
    id: "safari",
    name: "Safari Trips",
    desc: "Venture to Udawalawe or Yala National Parks to see wild elephants, leopards, and rich birdlife.",
    icon: NatureIcon,
    category: "Nature"
  },
  {
    id: "cooking",
    name: "Cookery Classes",
    desc: "Learn to grind local spices and cook the perfect, fragrant Sri Lankan rice & coconut curry.",
    icon: Utensils,
    category: "Culture"
  },
  {
    id: "scooters",
    name: "Scooter Rentals",
    desc: "Grab a scooter to explore pristine coastal roads and hidden bays at your own pace.",
    icon: Bike,
    category: "Adventure"
  }
];

// Custom icon for Safari since Compass is used
function NatureIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v12" />
      <path d="M8 10h8" />
      <path d="M8 14h8" />
    </svg>
  );
}

// Heritage Values
const VALUES = [
  {
    icon: Award,
    title: "100% Locally Owned",
    desc: "We are proud to be a 100% locally owned Sri Lankan business. We support local families, hire locally, and reinvest in the sustainable growth of the Weligama community."
  },
  {
    icon: Smile,
    title: "Warm Family Atmosphere",
    desc: "At Ocean Air, we offer much more than accommodation. Our friendly team works hard to make every single guest feel welcome, comfortable, and part of the family."
  },
  {
    icon: Sparkles,
    title: "Improving Every Season",
    desc: "We are dedicated to improving every season. From upgrading room comfort to expanding experiences, we ensure your Southern Coast holiday is unforgettable."
  }
];

export default function AboutPage() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [activeRoomTab, setActiveRoomTab] = useState<"basic" | "deluxe">("deluxe");
  const [sunsetMode, setSunsetMode] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <SEO
        title="Our Story & Heritage — Ocean Air Weligama"
        description="Discover Ocean Air Weligama — a 100% locally owned boutique guest house & villa 100 steps from Weligama Beach in Sri Lanka."
        canonicalPath="/about"
        keywords={["About Ocean Weligama", "Weligama Hotel History", "Locally Owned Weligama Villa", "Ocean Air Weligama Heritage"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Our Story", item: "/about" },
        ]}
      />
      
      <PageHero
        title="About Ocean Air"
        description="Welcome to Ocean Air ~ your locally owned tropical escape in the heart of Weligama."
        badgeText="Authentic Island Life"
        badgeIcon={<Waves className="w-3.5 h-3.5 text-[#4BBCCC]" />}
      />

      {/* The Neighborhood & Introduction Narrative */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        {/* Ambient blob */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Story Editorial */}
            <motion.div
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 sm:space-y-8"
            >
              <span className="text-[#4BBCCC] font-black tracking-[0.3em] uppercase text-xs mb-3 block">
                The Weligama Spirit
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                Where Sand, Surf, <br /> & Local Vibe Connect
              </h2>
              <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                <p className="italic">
                  Located in a beautiful and peaceful Sri Lankan village just a short walk from the famous Weligama Beach, 
                  <strong> Ocean Air</strong> offers the perfect mix of surfing, relaxation, local culture, and unforgettable island experiences.
                </p>
                <p className="italic">
                  We are surrounded by many popular restaurants, cafés, and attractions, all within walking distance, making our location ideal for every type of traveler. Walk down quiet local paths to catch the morning swell, or grab a coffee at nearby hotspots—our boutique escape is built to serve your curiosity.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <Link href="/book?new=1">
                  <Button className="bg-primary hover:bg-[#0B3D5E] text-white rounded-full px-8 py-5 h-auto text-sm sm:text-base font-bold shadow-xl transition-all hover:scale-105">
                    Plan Your Stay
                  </Button>
                </Link>
                <div className="flex flex-col border-l-2 border-[#4BBCCC]/30 pl-4">
                  <span className="font-serif font-bold text-primary italic text-sm">Ocean Air Team</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Weligama, Sri Lanka</span>
                </div>
              </div>
            </motion.div>

            {/* Interactive Location Guide Card */}
            <motion.div
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative p-8 sm:p-10 rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden backdrop-blur-xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(238,245,253,0.55) 100%)' }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-200/40 blur-[50px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-200/30 blur-[50px] rounded-full pointer-events-none" />
              
              <h3 className="relative z-10 text-xl sm:text-2xl font-serif font-bold text-[#0B3D5E] mb-4 flex items-center gap-3">
                <div className="p-2 bg-teal-50 rounded-xl">
                  <Map className="w-6 h-6 text-teal-500" />
                </div>
                Explore the Neighborhood
              </h3>
              <p className="relative z-10 text-sm sm:text-base text-slate-500 mb-8 font-light">
                Hover or tap on any destination below to discover what surrounds our peaceful tropical escape:
              </p>

              <div className="space-y-4 relative z-10">
                {NEIGHBORHOOD_SPOTS.map((spot) => {
                  const Icon = spot.icon;
                  const isHovered = hoveredLocation === spot.id;
                  return (
                    <div
                      key={spot.id}
                      onMouseEnter={() => setHoveredLocation(spot.id)}
                      onMouseLeave={() => setHoveredLocation(null)}
                      onClick={() => setHoveredLocation(hoveredLocation === spot.id ? null : spot.id)}
                      className={`group relative p-5 rounded-2xl border transition-all duration-400 cursor-pointer overflow-hidden backdrop-blur-sm ${
                        isHovered 
                          ? "bg-white/90 border-teal-300/50 shadow-lg translate-x-2 scale-[1.02]" 
                          : "bg-white/40 border-white/60 hover:bg-white/80 hover:border-teal-200"
                      }`}
                    >
                      {/* Subdued inner glow */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-teal-50/50 to-transparent transition-opacity duration-400 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-400 shadow-sm border ${
                            isHovered 
                              ? "bg-teal-500 border-teal-400 text-white shadow-teal-500/30 scale-110 rotate-3" 
                              : "bg-white border-white/60 text-[#0B3D5E]"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className={`font-bold transition-colors ${isHovered ? "text-[#0B3D5E]" : "text-slate-700"} text-base sm:text-lg`}>{spot.name}</h4>
                            <p className="text-[10px] text-teal-600 font-black tracking-[0.2em] uppercase mt-0.5">{spot.distance}</p>
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-400 ${
                          isHovered ? "bg-teal-50 text-teal-600 shadow-sm" : "bg-transparent text-slate-300"
                        }`}>
                          <ChevronRight className={`w-5 h-5 transition-transform duration-400 ${isHovered ? "rotate-90 scale-110" : ""}`} />
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="relative z-10 overflow-hidden"
                          >
                            <p className="text-sm text-slate-500 mt-4 pt-4 border-t border-teal-100/50 leading-relaxed font-light">
                              {spot.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Builder Widget ("Sri Lanka at Your Own Pace") */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EEF5FA 0%, #E6EFF6 40%, #EDF2F7 100%)' }}>
        {/* Ambient blobs */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/70 text-indigo-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-3"
            >
              <Sparkles className="w-3.5 h-3.5" /> Tailored Travel Styles
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E]">
              Sri Lanka At Your Own Pace
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-light">
              At Ocean Air, we offer much more than just accommodation. Choose to add any activities you like during your stay to create a truly flexible island holiday.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Interactive Selector list */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[#0B3D5E] mb-3">
                Our Custom Add-Ons:
              </h3>
              <div className="grid gap-3">
                {ACTIVITIES.map((activity, idx) => {
                  const Icon = activity.icon;
                  // Dynamic colors based on category
                  let grad = "from-teal-400 to-cyan-500";
                  let glow = "rgba(20,184,166,0.25)";
                  let iconBg = "rgba(20,184,166,0.12)";
                  let iconColor = "#14b8a6";
                  
                  if (activity.category === "Adventure") {
                    grad = "from-amber-400 to-orange-500";
                    glow = "rgba(251,191,36,0.25)";
                    iconBg = "rgba(251,191,36,0.12)";
                    iconColor = "#f59e0b";
                  } else if (activity.category === "Wellness") {
                    grad = "from-emerald-400 to-teal-500";
                    glow = "rgba(16,185,129,0.25)";
                    iconBg = "rgba(16,185,129,0.12)";
                    iconColor = "#10b981";
                  } else if (activity.category === "Nature") {
                    grad = "from-blue-400 to-indigo-500";
                    glow = "rgba(99,102,241,0.25)";
                    iconBg = "rgba(99,102,241,0.10)";
                    iconColor = "#6366f1";
                  } else if (activity.category === "Culture") {
                    grad = "from-violet-400 to-purple-500";
                    glow = "rgba(139,92,246,0.25)";
                    iconBg = "rgba(139,92,246,0.10)";
                    iconColor = "#8b5cf6";
                  }

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ x: 6, scale: 1.01 }}
                      className="group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border border-white/60 backdrop-blur-md transition-all duration-400 overflow-hidden cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(238,245,253,0.55) 100%)' }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{ background: `radial-gradient(ellipse at left center, ${glow} 0%, transparent 70%)` }}
                      />
                      
                      <motion.div 
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        className="relative mt-0.5 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/60 shadow-sm transition-all duration-400 group-hover:shadow-md"
                        style={{ background: iconBg, backdropFilter: 'blur(8px)' }}
                      >
                         <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                           style={{ background: `linear-gradient(135deg, ${glow}, transparent)` }}
                         />
                         <Icon className="w-5 h-5 relative z-10" style={{ color: iconColor }} />
                      </motion.div>
                      
                      <div className="flex-1 relative z-10">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#0B3D5E] text-sm sm:text-base">{activity.name}</h4>
                          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest bg-gradient-to-r ${grad} bg-clip-text text-transparent border border-white/50 shadow-sm`} style={{ background: 'rgba(255,255,255,0.7)', WebkitBackgroundClip: 'text' }}>
                            <span style={{ color: iconColor }}>{activity.category}</span>
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{activity.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-[2.5rem] p-6 sm:p-10 border border-white/20 shadow-[0_32px_80px_rgba(11,61,94,0.2),0_0_0_1px_rgba(255,255,255,0.1)_inset]"
                style={{ background: 'linear-gradient(135deg, rgba(11,61,94,0.95) 0%, rgba(26,107,138,0.85) 100%)', backdropFilter: 'blur(24px)' }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 w-[40%] pointer-events-none z-0"
                  style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)', skewX: '-15deg' }}
                  animate={{ x: ['-160%', '350%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
                />

                {/* Glow ball */}
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#4BBCCC]/30 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
                
                <h3 className="relative z-10 text-xl sm:text-2xl font-serif font-bold mb-3 flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  Your Tailored Stay
                </h3>
                <p className="relative z-10 text-white/70 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  Add any of these experiences upon check-in or when booking your room. Enjoy Southern Sri Lanka on your own schedule without feeling rushed.
                </p>

                <div className="relative z-10 border-t border-white/10 pt-6 mb-6">
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium mb-3">
                    <Check className="w-4 h-4 text-teal-400" /> Add during booking
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium mb-3">
                    <Check className="w-4 h-4 text-teal-400" /> Or decide when you arrive
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium mb-3">
                    <Check className="w-4 h-4 text-teal-400" /> No strict schedules
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium">
                    <Check className="w-4 h-4 text-teal-400" /> Fully refundable if plans change
                  </div>
                </div>

                <div className="relative z-10 bg-white/5 backdrop-blur-sm p-4 rounded-xl mb-8 border border-white/10 text-xs text-white/80 leading-relaxed shadow-inner">
                  <p><strong className="text-teal-300">✨ Unrestricted Flexibility:</strong> Stay 2 nights or 2 weeks. Custom build an itinerary that fits your personal budget and pace.</p>
                </div>

                <Link href="/packages" className="relative z-10 block">
                  <button className="group relative w-full h-14 rounded-full text-[#0B3D5E] font-bold text-sm sm:text-base overflow-hidden shadow-lg transition-all duration-400 hover:shadow-xl hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #4BBCCC 0%, #2dd4bf 100%)' }}
                  >
                    <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] translate-x-[-160%] group-hover:translate-x-[360%] transition-transform duration-700 ease-out pointer-events-none" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Explore Packages
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sanctuary Switcher (Basic Private vs Deluxe Ocean View) */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #FAFAFA 0%, #F0F4F8 100%)' }}>
        {/* Soft ambient backgrounds */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-sky-100/40 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-50/40 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/70 text-sky-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-3"
              >
                <Sun className="w-3.5 h-3.5" /> Sleep and Sanctuary
              </motion.span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E]">
                Designed For All Budgets
              </h2>
            </div>

            {/* Premium Frosted Room tab triggers */}
            <div className="relative p-1.5 rounded-full flex self-start md:self-end border border-white/60 shadow-lg backdrop-blur-md"
                 style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(240,247,255,0.6) 100%)' }}>
              <button
                onClick={() => setActiveRoomTab("basic")}
                className={`relative z-10 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-500 ${
                  activeRoomTab === "basic" 
                    ? "text-white shadow-md" 
                    : "text-slate-500 hover:text-[#0B3D5E]"
                }`}
              >
                {activeRoomTab === "basic" && (
                  <motion.div 
                    layoutId="activeTabBg" 
                    className="absolute inset-0 bg-[#0B3D5E] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                Basic Private Room
              </button>
              <button
                onClick={() => setActiveRoomTab("deluxe")}
                className={`relative z-10 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-500 ${
                  activeRoomTab === "deluxe" 
                    ? "text-white shadow-md" 
                    : "text-slate-500 hover:text-[#0B3D5E]"
                }`}
              >
                {activeRoomTab === "deluxe" && (
                  <motion.div 
                    layoutId="activeTabBg" 
                    className="absolute inset-0 bg-[#0B3D5E] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                Deluxe Double (Ocean View)
              </button>
            </div>
          </div>

          <div className="relative p-8 sm:p-12 rounded-[3rem] border border-white/50 shadow-2xl backdrop-blur-xl overflow-hidden"
               style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(245,250,255,0.4) 100%)' }}>
            
            {/* Shimmer overlay for card body */}
            <motion.div
              className="absolute inset-0 w-[30%] pointer-events-none z-0"
              style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)', skewX: '-15deg' }}
              animate={{ x: ['-200%', '400%'] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
            />

            <AnimatePresence mode="wait">
              {activeRoomTab === "basic" ? (
                <motion.div
                  key="basic-room"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 grid lg:grid-cols-12 gap-10 sm:gap-16 items-center"
                >
                  <div className="lg:col-span-5 space-y-6">
                    <span className="inline-block bg-gradient-to-r from-amber-200 to-orange-200 text-amber-900 border border-amber-300/50 shadow-sm text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                      Cozy Comfort & Value
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B3D5E]">Comfortable Basic Private</h3>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                      Traveling on a budget or looking for simple, quiet privacy? Our Basic Private Rooms are prepared with authentic care. Clean, cozy, and quiet, they offer the perfect escape to sleep deeply and recharge after long hours catching waves at Weligama Beach.
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 pt-6 text-xs sm:text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> Quiet Village Vibe
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> High-speed Wi-Fi
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> Cozy Private Space
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> Daily Housekeeping
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link href="/rooms">
                        <button className="group relative rounded-full bg-[#0B3D5E] text-white px-8 py-4 text-sm font-bold shadow-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl">
                          <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-700 ease-out pointer-events-none" />
                          View Rates & Details
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] bg-slate-100 border-4 border-white/80 group">
                      <img
                        src="/Comfortable_Basic_Private.jpeg"
                        alt="Basic Private Room at Ocean Air Weligama"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="deluxe-room"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 grid lg:grid-cols-12 gap-10 sm:gap-16 items-center"
                >
                  <div className="lg:col-span-5 space-y-6">
                    <span className="inline-block bg-gradient-to-r from-teal-200 to-cyan-200 text-teal-900 border border-teal-300/50 shadow-sm text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                      Premium Coastal Stay
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B3D5E]">Deluxe Double with Balcony</h3>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">
                      Upgrade to stunning views. Our Deluxe Double Rooms features spacious designs, modern comforts, private balconies, and beautiful views facing the ocean. Prepared with delicate attention to give you an authentic, refreshing island experience.
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 pt-6 text-xs sm:text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> Private Balcony
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> Beautiful Ocean Views
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> Air Conditioning
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1 bg-teal-50 rounded-full"><Check className="w-3 h-3 text-teal-500" /></div> Authentic Local Styling
                      </div>
                    </div>

                    <div className="pt-6">
                      <Link href="/rooms">
                        <button className="group relative rounded-full bg-[#0B3D5E] text-white px-8 py-4 text-sm font-bold shadow-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl">
                          <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-700 ease-out pointer-events-none" />
                          View Rates & Details
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] bg-slate-100 border-4 border-white/80 group">
                      <img
                        src="/Deluxe_Double%20with_Balcony.jpeg"
                        alt="Deluxe Double Room with Balcony at Ocean Air"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Rooftop Café Vibe Shift Simulator */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EEF5FA 0%, #E6EFF6 40%, #EDF2F7 100%)' }}>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Shiftable glassmorphism container block */}
          <div className={`relative p-6 sm:p-14 rounded-[3rem] transition-all duration-[1000ms] shadow-2xl overflow-hidden border ${
            sunsetMode 
              ? "border-purple-500/20 shadow-[0_32px_80px_rgba(67,28,60,0.4)]" 
              : "border-white/40 shadow-[0_32px_80px_rgba(11,61,94,0.12)]"
          }`}
          style={{
            background: sunsetMode 
              ? 'linear-gradient(135deg, rgba(31,19,48,0.85) 0%, rgba(67,28,60,0.85) 50%, rgba(94,38,55,0.85) 100%)' 
              : 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(238,247,253,0.65) 50%, rgba(237,242,250,0.7) 100%)',
            backdropFilter: 'blur(24px)'
          }}
          >
            {/* Ambient glow orbs */}
            <div className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[120px] rounded-full transition-all duration-[1000ms] pointer-events-none ${
              sunsetMode ? "bg-amber-500/30" : "bg-[#4BBCCC]/20"
            }`} />
            <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] blur-[120px] rounded-full transition-all duration-[1000ms] pointer-events-none ${
              sunsetMode ? "bg-purple-600/20" : "bg-indigo-400/10"
            }`} />
            
            {/* Top accent line */}
            <div className={`absolute top-0 left-10 right-10 h-px transition-colors duration-[1000ms] ${
              sunsetMode ? "bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" : "bg-gradient-to-r from-transparent via-teal-400/50 to-transparent"
            }`} />

            <div className="relative z-10 grid lg:grid-cols-12 gap-10 sm:gap-14 items-center">
              {/* Text area */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm border transition-colors duration-[1000ms] ${
                    sunsetMode ? "bg-amber-500/10 border-amber-500/30" : "bg-[#4BBCCC]/10 border-[#4BBCCC]/30"
                  }`}>
                    <Coffee className={`w-4 h-4 ${sunsetMode ? "text-amber-400" : "text-[#4BBCCC]"}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${sunsetMode ? "text-amber-400" : "text-[#4BBCCC]"}`}>
                    Scenic Culinary Space
                  </span>
                </div>

                <h2 className={`text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight transition-colors duration-[1000ms] ${sunsetMode ? "text-white" : "text-[#0B3D5E]"}`}>
                  The Rooftop Café
                </h2>

                <p className={`text-sm sm:text-base leading-relaxed font-light transition-colors duration-[1000ms] ${
                  sunsetMode ? "text-white/70" : "text-slate-500"
                }`}>
                  One of the highlights of Ocean Air is our rooftop café, where guests can enjoy breakfast, fresh food, coffee, tropical drinks, stunning ocean views, and unforgettable sunsets. It’s the perfect place to relax, meet fellow travelers, and unwind after surfing or exploring the area.
                </p>

                {/* Vibe shift selector */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className={`text-xs sm:text-sm font-bold uppercase tracking-widest ${sunsetMode ? "text-white/50" : "text-slate-400"}`}>
                    Atmosphere:
                  </span>
                  <div className={`p-1.5 rounded-full flex self-start border backdrop-blur-md transition-colors duration-[1000ms] ${
                    sunsetMode ? "bg-black/20 border-white/10" : "bg-white/50 border-white/60 shadow-sm"
                  }`}>
                    <button
                      onClick={() => setSunsetMode(false)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        !sunsetMode 
                          ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-md" 
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Morning Vibes
                    </button>
                    <button
                      onClick={() => setSunsetMode(true)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
                        sunsetMode 
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md" 
                          : "text-slate-500 hover:text-[#0B3D5E]"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" /> Golden Hour
                    </button>
                  </div>
                </div>

                {/* Info grid */}
                <div className={`grid grid-cols-2 gap-6 border-t pt-6 transition-colors duration-[1000ms] ${
                  sunsetMode ? "border-white/10" : "border-slate-200/50"
                }`}>
                  <div>
                    <h4 className={`font-bold text-[10px] uppercase tracking-widest mb-2 transition-colors duration-[1000ms] ${sunsetMode ? "text-amber-400" : "text-[#4BBCCC]"}`}>Rooftop Food</h4>
                    <p className={`text-xs transition-colors duration-[1000ms] leading-relaxed font-light ${sunsetMode ? "text-white/60" : "text-slate-500"}`}>
                      Healthy breakfast, local tropical fruit bowls, local teas, and traditional Sri Lankan delicacies.
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-bold text-[10px] uppercase tracking-widest mb-2 transition-colors duration-[1000ms] ${sunsetMode ? "text-amber-400" : "text-[#4BBCCC]"}`}>Scenic Socials</h4>
                    <p className={`text-xs transition-colors duration-[1000ms] leading-relaxed font-light ${sunsetMode ? "text-white/60" : "text-slate-500"}`}>
                      Breathtaking sunsets and 360-degree ocean views that make it Weligama's favorite unwind spot.
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo transitions */}
              <div className="lg:col-span-6">
                <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-[1000ms] ${
                  sunsetMode ? "border-white/20" : "border-white/60"
                }`}>
                  <AnimatePresence mode="wait">
                    {!sunsetMode ? (
                      <motion.img
                        key="day-view"
                        src="/morning-vibe.png"
                        alt="Golden morning surf vibe at Ocean Weligama beach"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <motion.img
                        key="sunset-view"
                        src="/gallery-sunset.png"
                        alt="Stunning sunset view from Ocean Air rooftop"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </AnimatePresence>
                  <div className={`absolute inset-0 transition-opacity duration-[1000ms] pointer-events-none ${
                    sunsetMode ? "bg-amber-600/10 mix-blend-color-burn" : "bg-transparent"
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Locally Owned Pride section */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #E6EFF6 40%, #EEF5FA 100%)' }}>
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-teal-100/30 blur-[80px] rounded-full -translate-y-1/2 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/70 text-indigo-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm mb-3"
            >
              <Heart className="w-3.5 h-3.5" /> Our Identity
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E]">
              100% Locally Owned
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-light">
              We are dedicated to building a welcoming, sustainable home away from home, driven by real family values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              let grad = "from-teal-400 to-cyan-500";
              let glow = "rgba(20,184,166,0.35)";
              let iconBg = "rgba(20,184,166,0.12)";
              let iconColor = "#14b8a6";
              
              if (idx === 1) {
                grad = "from-amber-400 to-orange-500";
                glow = "rgba(251,191,36,0.35)";
                iconBg = "rgba(251,191,36,0.12)";
                iconColor = "#f59e0b";
              } else if (idx === 2) {
                grad = "from-indigo-400 to-violet-500";
                glow = "rgba(99,102,241,0.35)";
                iconBg = "rgba(99,102,241,0.10)";
                iconColor = "#6366f1";
              }

              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative flex flex-col text-center p-8 sm:p-10 rounded-[2.5rem] border border-white/50 backdrop-blur-xl shadow-xl transition-all duration-500 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(238,247,253,0.6) 100%)' }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem] pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${glow.replace('0.35', '0.15')} 0%, transparent 70%)` }}
                  />

                  <motion.div 
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/60 shadow-sm transition-all duration-400 group-hover:shadow-md"
                    style={{ background: iconBg, backdropFilter: 'blur(8px)' }}
                  >
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{ background: `linear-gradient(135deg, ${glow.replace('0.35', '0.2')}, transparent)` }}
                    />
                    <Icon className="w-7 h-7 relative z-10" style={{ color: iconColor }} />
                  </motion.div>
                  
                  <h3 className="relative z-10 text-xl font-serif font-bold text-[#0B3D5E] mb-4 leading-tight">{val.title}</h3>
                  <p className="relative z-10 text-xs sm:text-sm leading-relaxed text-slate-500 font-light">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Invitation Call to Action */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #EEF5FA 100%)' }}>
        {/* Subtle background elements for the outer section to blend seamlessly */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-200/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-200/20 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-6xl mx-auto rounded-[3rem] sm:rounded-[4rem] overflow-hidden text-center text-white shadow-[0_32px_80px_rgba(11,61,94,0.3)] border border-white/20 backdrop-blur-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,58,95,0.75) 100%)' }}
        >
          {/* Animated decorative background elements */}
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400/30 via-transparent to-transparent pointer-events-none" />
          
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 text-white/5"
          >
            <Waves className="w-32 h-32 sm:w-48 sm:h-48" />
          </motion.div>
          
          <motion.div 
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-10 text-teal-400/5"
          >
            <Sun className="w-40 h-40 sm:w-64 sm:h-64" />
          </motion.div>

          {/* Shimmer overlay for card body */}
          <motion.div
            className="absolute inset-0 w-[40%] pointer-events-none z-0"
            style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)', skewX: '-15deg' }}
            animate={{ x: ['-200%', '350%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
          />

          <div className="relative z-10 px-6 py-20 sm:py-28">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-teal-300 font-black tracking-[0.3em] uppercase text-xs px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg shadow-black/20">
                <Sparkles className="w-3.5 h-3.5" /> Your Weligama Escape
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.15] max-w-4xl mx-auto tracking-tight drop-shadow-md"
            >
              Ready to Discover <br className="hidden sm:block" /> Sri Lanka?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/80 text-base sm:text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light italic"
            >
              Whether you are looking for adventure, surfing, yoga, nature, or simply a peaceful beach holiday, Ocean Air is ready to give you a unique Sri Lankan experience you will never forget.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="relative inline-block"
            >
              {/* Glowing ring behind the button */}
              <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-sky-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
              
              <Link href="/book?new=1">
                <button className="relative group bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 sm:px-14 py-5 sm:py-6 rounded-full font-black text-sm sm:text-base tracking-widest uppercase shadow-[0_0_40px_rgba(45,212,191,0.3)] hover:shadow-[0_0_60px_rgba(45,212,191,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-[1.03] overflow-hidden">
                  <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-700 ease-out pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Book Your Experience
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
