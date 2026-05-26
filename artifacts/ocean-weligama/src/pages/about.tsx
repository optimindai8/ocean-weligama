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
                <p>
                  Located in a beautiful and peaceful Sri Lankan village just a short walk from the famous Weligama Beach, 
                  <strong> Ocean Air</strong> offers the perfect mix of surfing, relaxation, local culture, and unforgettable island experiences.
                </p>
                <p>
                  We are surrounded by many popular restaurants, cafés, and attractions, all within walking distance, making our location ideal for every type of traveler. Walk down quiet local paths to catch the morning swell, or grab a coffee at nearby hotspots—our boutique escape is built to serve your curiosity.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <Link href="/book">
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
              className="relative bg-card/75 backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] border border-border/80 shadow-xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4BBCCC]/10 blur-2xl rounded-full pointer-events-none" />
              <h3 className="text-lg sm:text-xl font-serif font-bold text-primary mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-[#4BBCCC]" />
                Explore the Neighborhood
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                Hover or tap on any destination below to discover what surrounds our peaceful tropical escape:
              </p>

              <div className="space-y-3.5">
                {NEIGHBORHOOD_SPOTS.map((spot) => {
                  const Icon = spot.icon;
                  const isHovered = hoveredLocation === spot.id;
                  return (
                    <div
                      key={spot.id}
                      onMouseEnter={() => setHoveredLocation(spot.id)}
                      onMouseLeave={() => setHoveredLocation(null)}
                      onClick={() => setHoveredLocation(hoveredLocation === spot.id ? null : spot.id)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isHovered 
                          ? "bg-white border-[#4BBCCC] shadow-md translate-x-2" 
                          : "bg-white/50 border-border hover:bg-white hover:border-[#4BBCCC]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl transition-colors ${isHovered ? "bg-[#4BBCCC]/15 text-[#4BBCCC]" : "bg-primary/5 text-primary"}`}>
                            <Icon className="w-4 h-4 sm:w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-sm sm:text-base">{spot.name}</h4>
                            <p className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">{spot.distance}</p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-muted-foreground/60 transition-transform duration-300 ${isHovered ? "rotate-90 text-[#4BBCCC]" : ""}`} />
                      </div>
                      
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs sm:text-sm text-muted-foreground mt-3 pt-3 border-t border-dashed border-border leading-relaxed">
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
      <section className="py-16 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-3 block">
              Tailored Travel Styles
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground">
              Sri Lanka At Your Own Pace
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
              At Ocean Air, we offer much more than just accommodation. Choose to add any activities you like during your stay to create a truly flexible island holiday.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Interactive Selector list */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-primary mb-3">
                Our Custom Add-Ons:
              </h3>
              <div className="grid gap-3">
                {ACTIVITIES.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 bg-white/50 border-border hover:bg-white hover:border-[#4BBCCC]/30"
                    >
                      <div className="mt-0.5 p-2 rounded-xl transition-colors bg-primary/5 text-primary group-hover:bg-[#4BBCCC]/10 group-hover:text-[#4BBCCC]">
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-foreground text-sm sm:text-base">{activity.name}</h4>
                          <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            activity.category === "Adventure" ? "bg-amber-100 text-amber-800" :
                            activity.category === "Wellness" ? "bg-emerald-100 text-emerald-800" :
                            activity.category === "Nature" ? "bg-sky-100 text-sky-800" : "bg-purple-100 text-purple-800"
                          }`}>
                            {activity.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{activity.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="bg-primary text-white p-6 sm:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                {/* Glow ball */}
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#4BBCCC]/20 blur-2xl rounded-full pointer-events-none" />
                
                <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#4BBCCC]" />
                  Your Tailored Stay
                </h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
                  Add any of these experiences upon check-in or when booking your room. Enjoy Southern Sri Lanka on your own schedule without feeling rushed.
                </p>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium mb-3">
                    <Check className="w-4 h-4 text-[#4BBCCC]" /> Add during booking
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium mb-3">
                    <Check className="w-4 h-4 text-[#4BBCCC]" /> Or decide when you arrive
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium mb-3">
                    <Check className="w-4 h-4 text-[#4BBCCC]" /> No strict schedules
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/95 font-medium">
                    <Check className="w-4 h-4 text-[#4BBCCC]" /> Fully refundable if plans change
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-xl mb-8 border border-white/10 text-xs text-white/80 leading-relaxed space-y-1">
                  <p><strong>✨ Unrestricted Flexibility:</strong> Stay 2 nights or 2 weeks. Custom build an itinerary that fits your personal budget and pace.</p>
                </div>

                <Link href="/book">
                  <Button className="w-full bg-[#4BBCCC] hover:bg-white text-primary hover:text-primary rounded-full py-6 h-auto text-sm sm:text-base font-bold transition-all shadow-lg hover:scale-[1.02]">
                    Explore Packages
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sanctuary Switcher (Basic Private vs Deluxe Ocean View) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[#4BBCCC] font-black tracking-[0.3em] uppercase text-xs mb-3 block">
                Sleep and Sanctuary
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary">
                Designed For All Budgets
              </h2>
            </div>

            {/* Room tab triggers */}
            <div className="bg-primary/5 p-1.5 rounded-full flex self-start md:self-end border border-primary/10">
              <button
                onClick={() => setActiveRoomTab("basic")}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  activeRoomTab === "basic" 
                    ? "bg-primary text-white shadow-md" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Basic Private Room
              </button>
              <button
                onClick={() => setActiveRoomTab("deluxe")}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  activeRoomTab === "deluxe" 
                    ? "bg-primary text-white shadow-md" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Deluxe Double (Ocean View)
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeRoomTab === "basic" ? (
              <motion.div
                key="basic-room"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="grid lg:grid-cols-12 gap-10 sm:gap-16 items-center"
              >
                <div className="lg:col-span-5 space-y-6">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    Cozy Comfort & Value
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Comfortable Basic Private</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Traveling on a budget or looking for simple, quiet privacy? Our Basic Private Rooms are prepared with authentic care. Clean, cozy, and quiet, they offer the perfect escape to sleep deeply and recharge after long hours catching waves at Weligama Beach.
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> Quiet Village Vibe
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> High-speed Wi-Fi
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> Cozy Private Space
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> Daily Housekeeping
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href="/rooms">
                      <Button className="rounded-full bg-primary hover:bg-[#0B3D5E] text-white px-8 py-5 h-auto text-xs sm:text-sm font-bold shadow-lg">
                        View Rates & Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-muted border border-border/60">
                    <img
                      src="/assets/room-1.png"
                      alt="Basic Private Room at Ocean Air Weligama"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="deluxe-room"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
                className="grid lg:grid-cols-12 gap-10 sm:gap-16 items-center"
              >
                <div className="lg:col-span-5 space-y-6">
                  <span className="bg-[#4BBCCC]/20 text-[#4BBCCC] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                    Premium Coastal Stay
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Deluxe Double with Balcony</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Upgrade to stunning views. Our Deluxe Double Rooms features spacious designs, modern comforts, private balconies, and beautiful views facing the ocean. Prepared with delicate attention to give you an authentic, refreshing island experience.
                  </p>

                  <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> Private Balcony
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> Beautiful Ocean Views
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> Air Conditioning
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#4BBCCC]" /> Authentic Local Styling
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href="/rooms">
                      <Button className="rounded-full bg-primary hover:bg-[#0B3D5E] text-white px-8 py-5 h-auto text-xs sm:text-sm font-bold shadow-lg">
                        View Rates & Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-muted border border-border/60">
                    <img
                      src="/gallery-room-luxury.jpg"
                      alt="Deluxe Double Room with Balcony at Ocean Air"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Rooftop Café Vibe Shift Simulator */}
      <section className="py-16 sm:py-24 bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Shiftable container block */}
          <div className={`relative p-6 sm:p-14 rounded-[2.5rem] transition-all duration-[1000ms] shadow-2xl border ${
            sunsetMode 
              ? "bg-[linear-gradient(135deg,#1f1330_0%,#431c3c_50%,#5e2637_100%)] text-white border-purple-900/30" 
              : "bg-[linear-gradient(135deg,#E8F8FA_0%,#F4FBFB_60%,#FAFAF8_100%)] text-foreground border-[#4BBCCC]/20"
          }`}>
            {/* Glow orbs */}
            <div className={`absolute top-[-20%] right-[-10%] w-[300px] h-[300px] blur-[120px] rounded-full transition-all duration-[1000ms] pointer-events-none ${
              sunsetMode ? "bg-amber-500/20" : "bg-[#4BBCCC]/20"
            }`} />
            <div className={`absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] blur-[120px] rounded-full transition-all duration-[1000ms] pointer-events-none ${
              sunsetMode ? "bg-purple-500/10" : "bg-primary/5"
            }`} />

            <div className="relative z-10 grid lg:grid-cols-12 gap-10 sm:gap-14 items-center">
              {/* Text area */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-2">
                  <Coffee className={`w-5 h-5 ${sunsetMode ? "text-amber-400" : "text-[#4BBCCC]"}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${sunsetMode ? "text-amber-400" : "text-[#4BBCCC]"}`}>
                    Scenic Culinary Social Space
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight">
                  The Rooftop Café
                </h2>

                <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-[1000ms] ${
                  sunsetMode ? "text-white/80" : "text-muted-foreground"
                }`}>
                  One of the highlights of Ocean Air is our rooftop café, where guests can enjoy breakfast, fresh food, coffee, tropical drinks, stunning ocean views, and unforgettable sunsets. It’s the perfect place to relax, meet fellow travelers, and unwind after surfing or exploring the area.
                </p>

                {/* Vibe shift selector */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className={`text-xs sm:text-sm font-bold ${sunsetMode ? "text-white/70" : "text-muted-foreground"}`}>
                    Experience the Atmosphere:
                  </span>
                  <div className="bg-black/10 p-1 rounded-full flex self-start border border-black/5">
                    <button
                      onClick={() => setSunsetMode(false)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        !sunsetMode 
                          ? "bg-white text-primary shadow-sm animate-pulse-highlight" 
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" /> Morning Vibes
                    </button>
                    <button
                      onClick={() => setSunsetMode(true)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        sunsetMode 
                          ? "bg-amber-500 text-white shadow-sm" 
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Sunset Golden Hour
                    </button>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-6 border-t border-black/10 pt-6">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#4BBCCC] mb-1">Rooftop Food</h4>
                    <p className={`text-xs transition-colors duration-[1000ms] leading-relaxed ${sunsetMode ? "text-white/60" : "text-muted-foreground"}`}>
                      Healthy breakfast, local tropical fruit bowls, local teas, and traditional Sri Lankan delicacies.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-[#4BBCCC] mb-1">Scenic Socials</h4>
                    <p className={`text-xs transition-colors duration-[1000ms] leading-relaxed ${sunsetMode ? "text-white/60" : "text-muted-foreground"}`}>
                      Breathtaking sunsets and 360-degree ocean views that make it Weligama's favorite unwind spot.
                    </p>
                  </div>
                </div>
              </div>

              {/* Photo transitions */}
              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-black/10 border border-white/10">
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
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[#4BBCCC] font-black tracking-[0.3em] uppercase text-xs mb-3 block">
              Our Identity
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary">
              100% Locally Owned
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
              We are dedicated to building a welcoming, sustainable home away from home, driven by real family values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative bg-card p-6 sm:p-10 rounded-[2rem] border border-border/80 hover:border-[#4BBCCC]/50 hover:shadow-2xl transition-all duration-300 flex flex-col text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-6 transition-all group-hover:bg-[#4BBCCC]/15 group-hover:text-[#4BBCCC] group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-4">{val.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Invitation Call to Action */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden bg-white">
        {/* Subtle background elements for the outer white section to blend seamlessly */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-6xl mx-auto rounded-[3rem] sm:rounded-[4rem] bg-[#0F172A] overflow-hidden text-center text-white shadow-2xl"
        >
          {/* Animated decorative background elements */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4BBCCC]/40 via-transparent to-transparent pointer-events-none" />
          
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
            className="absolute bottom-10 right-10 text-white/5"
          >
            <Sun className="w-40 h-40 sm:w-64 sm:h-64" />
          </motion.div>

          <div className="relative z-10 px-6 py-20 sm:py-28 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#4BBCCC] font-black tracking-[0.3em] uppercase text-xs px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg shadow-black/20">
                <Sparkles className="w-3.5 h-3.5" /> Your Weligama Escape
              </span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.15] max-w-4xl mx-auto tracking-tight"
            >
              Ready to Discover <br className="hidden sm:block" /> Sri Lanka?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/70 text-base sm:text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light"
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
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#4BBCCC] to-sky-400 rounded-full blur-md opacity-30 animate-pulse"></div>
              
              <Link href="/book">
                <Button size="lg" className="relative bg-white hover:bg-transparent text-[#0F172A] hover:text-white border-2 border-white px-8 sm:px-14 py-6 sm:py-8 rounded-full font-black text-sm sm:text-base tracking-widest uppercase shadow-2xl hover:scale-[1.03] h-auto transition-all duration-300 group overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    Book Your Experience
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-[#0F172A] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
