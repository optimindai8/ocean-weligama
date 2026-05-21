import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  useListRooms,
  useListServices,
  useCheckAvailabilityAndPrice,
  useCreateBooking,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, Calendar, Users, CreditCard, Sparkles, ShieldCheck, Waves, ArrowRight, Award, Ship, Compass, Utensils, Bike } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/footer";

const guestSchema = z.object({
  guestFullName: z.string().min(2, "Full name required"),
  guestEmail: z.string().email("Valid email required"),
  guestPhone: z.string().min(5, "Phone required"),
  guestNationality: z.string().optional(),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(["bank_transfer", "cash", "online_card"]),
  agreeTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

type GuestForm = z.infer<typeof guestSchema>;

const UI_ADDONS = [
  {
    id: "surf-pkg",
    name: "Surf Packages",
    desc: "Complete options designed for different skills, including board rentals & daily coach reviews.",
    icon: Award,
    category: "Adventure",
    dbSlug: "surfer-advance-package",
    pricing: "From €200 / package",
    payOnArrival: false,
  },
  {
    id: "yoga",
    name: "Yoga Experiences",
    desc: "Restorative classes on our rooftop, perfect for deep surf recovery and centering your mind.",
    icon: Sparkles,
    category: "Wellness",
    dbSlug: null,
    pricing: "Pay on arrival / Arrange at check-in",
    payOnArrival: true,
  },
  {
    id: "lessons",
    name: "Surfing Lessons",
    desc: "Step-by-step coaching from friendly, local ISA-certified instructors right at the beach.",
    icon: Waves,
    category: "Adventure",
    dbSlug: "surf-lessons",
    pricing: "From €100 / course",
    payOnArrival: false,
  },
  {
    id: "whale-watching",
    name: "Whale Watching Tours",
    desc: "Stunning boat trips from neighboring Mirissa Harbor to see majestic blue whales up close.",
    icon: Ship,
    category: "Nature",
    dbSlug: null,
    pricing: "Pay on arrival / Arrange at check-in",
    payOnArrival: true,
  },
  {
    id: "safari",
    name: "Safari Trips",
    desc: "Venture to Udawalawe or Yala National Parks to see wild elephants, leopards, and rich birdlife.",
    icon: Compass,
    category: "Nature",
    dbSlug: null,
    pricing: "Pay on arrival / Arrange at check-in",
    payOnArrival: true,
  },
  {
    id: "cooking",
    name: "Cookery Classes",
    desc: "Learn to grind local spices and cook the perfect, fragrant Sri Lankan rice & coconut curry.",
    icon: Utensils,
    category: "Culture",
    dbSlug: null,
    pricing: "Pay on arrival / Arrange at check-in",
    payOnArrival: true,
  },
  {
    id: "scooters",
    name: "Scooter Rentals",
    desc: "Grab a scooter to explore pristine coastal roads and hidden bays at your own pace.",
    icon: Bike,
    category: "Adventure",
    dbSlug: null,
    pricing: "Pay on arrival / Arrange at check-in",
    payOnArrival: true,
  }
];

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "Adventure":
      return {
        bg: "bg-sky-50 text-sky-700 border-sky-200",
        badge: "bg-sky-100 text-sky-800",
        accent: "text-sky-600",
        ring: "focus-within:ring-sky-500",
        borderSelected: "border-sky-500 bg-sky-50/30",
        glow: "shadow-sky-500/10",
      };
    case "Wellness":
      return {
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        badge: "bg-purple-100 text-purple-800",
        accent: "text-purple-600",
        ring: "focus-within:ring-purple-500",
        borderSelected: "border-purple-500 bg-purple-50/30",
        glow: "shadow-purple-500/10",
      };
    case "Nature":
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800",
        accent: "text-emerald-600",
        ring: "focus-within:ring-emerald-500",
        borderSelected: "border-emerald-500 bg-emerald-50/30",
        glow: "shadow-emerald-500/10",
      };
    case "Culture":
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        badge: "bg-amber-100 text-amber-800",
        accent: "text-amber-600",
        ring: "focus-within:ring-amber-500",
        borderSelected: "border-amber-500 bg-amber-50/30",
        glow: "shadow-amber-500/10",
      };
    default:
      return {
        bg: "bg-gray-50 text-gray-700 border-gray-200",
        badge: "bg-gray-100 text-gray-800",
        accent: "text-gray-600",
        ring: "focus-within:ring-gray-500",
        borderSelected: "border-gray-500 bg-gray-50/30",
        glow: "shadow-gray-500/10",
      };
  }
};

export default function BookingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [guestCount, setGuestCount] = useState(2);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedFrontendAddons, setSelectedFrontendAddons] = useState<string[]>(["lessons", "yoga"]);
  const [priceData, setPriceData] = useState<{
    roomRatePerNight: string;
    nights: number;
    roomSubtotal: string;
    servicesSubtotal: string;
    cleaningFee: string;
    totalAmount: string;
    currency: string;
    available: boolean;
  } | null>(null);

  const { data: rooms, isLoading: roomsLoading } = useListRooms();
  const { data: services } = useListServices();
  const checkAvailability = useCheckAvailabilityAndPrice();
  const createBooking = useCreateBooking();

  const handleToggleAddon = (addonId: string, dbSlug: string | null) => {
    const isSelected = selectedFrontendAddons.includes(addonId);
    
    // Toggle frontend state
    setSelectedFrontendAddons(prev => 
      isSelected ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );

    // Toggle database state if applicable
    if (dbSlug && Array.isArray(services)) {
      const dbService = services.find(s => s.slug === dbSlug);
      if (dbService) {
        setSelectedServiceIds(prev => 
          isSelected ? prev.filter(id => id !== dbService.id) : [...prev, dbService.id]
        );
      }
    }
  };

  // Sync initial frontend selected add-ons to database serviceIds once services data loads
  useEffect(() => {
    if (Array.isArray(services) && selectedServiceIds.length === 0) {
      const initialDbIds: string[] = [];
      
      selectedFrontendAddons.forEach(addonId => {
        const addon = UI_ADDONS.find(a => a.id === addonId);
        if (addon && addon.dbSlug) {
          const dbService = services.find(s => s.slug === addon.dbSlug);
          if (dbService) {
            initialDbIds.push(dbService.id);
          }
        }
      });
      
      if (initialDbIds.length > 0) {
        setSelectedServiceIds(initialDbIds);
      }
    }
  }, [services]);

  const form = useForm<GuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      guestFullName: "",
      guestEmail: "",
      guestPhone: "",
      guestNationality: "",
      specialRequests: "",
      paymentMethod: "bank_transfer",
      agreeTerms: undefined,
    },
  });

  const selectedRoom = Array.isArray(rooms) ? rooms.find((r) => r.id === selectedRoomId) : undefined;

  function formatDate(d?: Date) {
    if (!d) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function toDateStr(d: Date) {
    return d.toISOString().slice(0, 10);
  }

  async function handleCheckAvailability() {
    if (!selectedRoomId || !dateRange.from || !dateRange.to) {
      toast({ variant: "destructive", title: "Please select a room and dates" });
      return;
    }
    try {
      const result = await checkAvailability.mutateAsync({
        data: {
          roomId: selectedRoomId,
          checkIn: toDateStr(dateRange.from),
          checkOut: toDateStr(dateRange.to),
          guestCount,
          serviceIds: selectedServiceIds,
        },
      });
      setPriceData(result as any);
      if ((result as any).available) {
        setStep(2);
      } else {
        toast({ variant: "destructive", title: "Room not available", description: "Please select different dates." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not check availability." });
    }
  }

  async function onSubmit(data: GuestForm) {
    if (!selectedRoomId || !dateRange.from || !dateRange.to) return;
    try {
      const payOnArrivalAddons = UI_ADDONS.filter(addon => 
        addon.payOnArrival && selectedFrontendAddons.includes(addon.id)
      ).map(a => a.name);

      let finalSpecialRequests = data.specialRequests || "";
      if (payOnArrivalAddons.length > 0) {
        const addonText = `[Requested Add-ons (Pay on Arrival): ${payOnArrivalAddons.join(", ")}]`;
        finalSpecialRequests = finalSpecialRequests 
          ? `${addonText}\n${finalSpecialRequests}`
          : addonText;
      }

      const booking = await createBooking.mutateAsync({
        data: {
          ...data,
          specialRequests: finalSpecialRequests,
          roomId: selectedRoomId,
          checkIn: toDateStr(dateRange.from),
          checkOut: toDateStr(dateRange.to),
          guestCount,
          serviceIds: selectedServiceIds,
        },
      });
      setLocation(`/book/confirmation?ref=${(booking as any).reference}`);
    } catch {
      toast({ variant: "destructive", title: "Booking failed", description: "Please try again or contact us." });
    }
  }

  const STEPS = [
    { n: 1, label: "Sanctuary", icon: Waves },
    { n: 2, label: "Your Details", icon: Users },
    { n: 3, label: "The Arrival", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-white">

      {/* Modern Journey Stepper */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 bg-white/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 -z-10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STEPS.map((s, idx) => (
              <motion.div 
                key={s.n}
                className="flex flex-col items-center gap-2 md:gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 md:border-4 transition-all duration-500 shadow-xl ${
                  step === s.n ? "bg-primary border-primary text-white scale-110 shadow-primary/20" :
                  step > s.n ? "bg-green-500 border-green-500 text-white" : "bg-white border-muted text-muted-foreground"
                }`}>
                  {step > s.n ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : <s.icon className="w-4 h-4 md:w-6 md:h-6" />}
                </div>
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-center ${
                  step === s.n ? "text-primary" : "text-muted-foreground"
                }`}>{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: Select Sanctuary & Island Dates */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-12 gap-16"
              >
                {/* Left: Interactive Selection Hub */}
                <div className="lg:col-span-8 space-y-12">
                  <header>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 italic">Begin Your Journey</h1>
                    <p className="text-muted-foreground text-lg">Pick your preferred dates and find your private sanctuary by the sea.</p>
                  </header>

                  {/* Room Sanctuary Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="text-xl font-serif font-bold">Select Your Space</h2>
                    </div>

                    {roomsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-3xl" />)}
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {Array.isArray(rooms) && rooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`group relative text-left p-6 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                              selectedRoomId === room.id
                                ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10"
                                : "border-white bg-white hover:border-primary/20 shadow-xl"
                            }`}
                          >
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-serif font-bold text-foreground">{room.name}</h3>
                                {selectedRoomId === room.id && (
                                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center justify-between items-end">
                                <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50">Capacity</p>
                                  <p className="text-sm font-bold text-muted-foreground">{room.maxGuests} Guests</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50">Starting from</p>
                                  <p className="text-2xl font-bold text-primary">€{room.basePricePerNight}<span className="text-xs font-normal text-muted-foreground">/nt</span></p>
                                </div>
                              </div>
                            </div>
                            {/* Hover Aura */}
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tourist Count Selector */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="text-xl font-serif font-bold">Number of Tourists</h2>
                    </div>

                    <div className="bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border border-border/50 flex items-center justify-between max-w-sm">
                      <button
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-muted flex items-center justify-center text-xl sm:text-2xl font-bold text-muted-foreground hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
                        data-testid="button-guests-minus"
                      >
                        —
                      </button>
                      <div className="text-center">
                        <motion.span 
                          key={guestCount}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-3xl sm:text-4xl font-bold text-primary block"
                          data-testid="text-guest-count"
                        >
                          {guestCount}
                        </motion.span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Travelers</span>
                      </div>
                      <button
                        onClick={() => setGuestCount(guestCount + 1)}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-muted flex items-center justify-center text-xl sm:text-2xl font-bold text-muted-foreground hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
                        data-testid="button-guests-plus"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Experiences & Extras */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <h2 className="text-xl font-serif font-bold">Custom Add-Ons & Experiences</h2>
                    </div>
                    <p className="text-sm text-muted-foreground -mt-2">
                      Tap to select your custom add-ons. You can build a package that fits your personal budget and pace.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {UI_ADDONS.map((addon) => {
                        const Icon = addon.icon;
                        const isSelected = selectedFrontendAddons.includes(addon.id);
                        const style = getCategoryStyle(addon.category);
                        
                        // Find database service price dynamically if applicable
                        let displayPrice = addon.pricing;
                        if (addon.dbSlug && Array.isArray(services)) {
                          const dbService = services.find(s => s.slug === addon.dbSlug);
                          if (dbService) {
                            const unit = (dbService as any).unit;
                            displayPrice = `+€${parseInt(dbService.basePrice)} ${unit === "per_person" ? "/ person" : "/ stay"}`;
                          }
                        }

                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => handleToggleAddon(addon.id, addon.dbSlug)}
                            className={`group relative text-left p-6 rounded-[2rem] border-2 transition-all duration-500 flex flex-col justify-between h-full hover:scale-[1.01] hover:shadow-xl ${
                              isSelected
                                ? `${style.borderSelected} border-primary shadow-lg ${style.glow}`
                                : "border-white bg-white hover:border-primary/20 shadow-md"
                            }`}
                          >
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${style.badge}`}>
                                  {addon.category}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                }`}>
                                  {isSelected ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                </div>
                              </div>
                              
                              <h3 className="text-lg font-serif font-bold text-foreground mb-2 flex items-center gap-2">
                                {addon.name}
                              </h3>
                              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                {addon.desc}
                              </p>
                            </div>

                            <div className="w-full pt-4 border-t border-dashed border-muted flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</span>
                              <span className={`text-xs font-bold ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                                {displayPrice}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Date Portal & Summary */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-6 md:p-10 shadow-2xl border border-border/50 sticky top-40 overflow-hidden">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-4 sm:mb-8 italic text-center">Island Calendar</h2>
                    <div className="calendar-container flex justify-center scale-[0.85] sm:scale-100 md:scale-110 mb-4 sm:mb-8 overflow-hidden">
                      <DayPicker
                        mode="range"
                        selected={dateRange as any}
                        onSelect={(range) => setDateRange(range ?? {})}
                        disabled={{ before: new Date() }}
                        numberOfMonths={1}
                        className="font-sans border-none"
                      />
                    </div>

                    <AnimatePresence>
                      {dateRange.from && dateRange.to ? (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-6 pt-6 border-t border-border"
                        >
                          <div className="flex justify-between items-center bg-muted/30 p-4 rounded-2xl">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Your Stay</span>
                              <p className="text-sm font-bold">{formatDate(dateRange.from)} — {formatDate(dateRange.to)}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">Nights</span>
                              <p className="text-sm font-bold">{Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000)}</p>
                            </div>
                          </div>

                          {selectedFrontendAddons.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">Selected Add-Ons</span>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedFrontendAddons.map(addonId => {
                                  const addon = UI_ADDONS.find(a => a.id === addonId);
                                  if (!addon) return null;
                                  return (
                                    <span 
                                      key={addonId} 
                                      className={`text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border ${
                                        addon.payOnArrival 
                                          ? "bg-purple-50 text-purple-700 border-purple-100" 
                                          : "bg-sky-50 text-sky-700 border-sky-100"
                                      }`}
                                    >
                                      {addon.name}
                                      {addon.payOnArrival && <span className="text-[8px] opacity-70">(arrival)</span>}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <Button
                            size="lg"
                            onClick={handleCheckAvailability}
                            disabled={!selectedRoomId || checkAvailability.isPending}
                            className="w-full bg-primary hover:bg-secondary text-white rounded-full h-16 text-lg font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                          >
                            {checkAvailability.isPending ? "Checking..." : "Confirm Dates"}
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      ) : (
                        <div className="text-center py-10 opacity-30">
                          <p className="text-sm italic">Select your arrival and departure dates</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Guest Details Sanctuary */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid lg:grid-cols-12 gap-16 max-w-6xl mx-auto"
              >
                <div className="lg:col-span-7 space-y-12">
                  <header>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 italic">The Personal Touch</h1>
                    <p className="text-muted-foreground text-lg">We prepare everything for your arrival. Tell us about your journey.</p>
                  </header>

                  <Form {...form}>
                    <form className="space-y-8">
                      <div className="bg-white p-5 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl border border-border/50 space-y-6 sm:space-y-8">
                        <FormField control={form.control} name="guestFullName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-4">Full Name</FormLabel>
                            <FormControl><Input placeholder="Maria Santos" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          <FormField control={form.control} name="guestEmail" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-4">Email Address</FormLabel>
                              <FormControl><Input type="email" placeholder="maria@example.com" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="guestPhone" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-4">Phone / WhatsApp</FormLabel>
                              <FormControl><Input placeholder="+1 555 000 0000" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="specialRequests" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-4">Special Requests (optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Early check-in, dietary needs, surf level..." rows={3} className="rounded-3xl border-muted bg-muted/20 focus:bg-white p-6" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-6 pt-6 sm:pt-8">
                        <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto rounded-full px-6 sm:px-12 h-14 font-bold border-muted text-muted-foreground hover:bg-muted">
                          Back to Sanctuary
                        </Button>
                        <Button
                          size="lg"
                          onClick={() => {
                            form.trigger(["guestFullName", "guestEmail", "guestPhone"]).then((valid) => {
                              if (valid) setStep(3);
                            });
                          }}
                          className="w-full sm:w-auto bg-primary hover:bg-secondary text-white rounded-full px-6 sm:px-16 h-14 font-bold shadow-xl flex items-center justify-center gap-3"
                        >
                          Review & Confirm
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
                {/* Price Summary Panel */}
                {priceData && (
                  <div className="lg:col-span-5">
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-primary rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 text-white shadow-2xl sticky top-40 overflow-hidden"
                    >
                      <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-accent/20 blur-3xl rounded-full" />
                      <h3 className="text-2xl font-serif font-bold mb-8 italic">Your Island Summary</h3>
                      
                      <div className="space-y-6 pb-8 border-b border-white/10">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Sanctuary</span>
                          <span className="font-bold">{selectedRoom?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Nights</span>
                          <span className="font-bold">{priceData.nights}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Total Guests</span>
                          <span className="font-bold">{guestCount}</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-8">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                          <span className="font-bold">€{priceData.roomSubtotal}</span>
                        </div>
                        {Number(priceData.servicesSubtotal) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Experiences</span>
                            <span className="font-bold">+€{priceData.servicesSubtotal}</span>
                          </div>
                        )}
                        
                        {/* Selected pay-on-arrival add-ons */}
                        {selectedFrontendAddons.some(id => {
                          const add = UI_ADDONS.find(a => a.id === id);
                          return add?.payOnArrival;
                        }) && (
                          <div className="space-y-3 pt-6 border-t border-white/10 mt-6">
                            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest block">Pay on Arrival Add-ons</span>
                            <div className="space-y-2">
                              {selectedFrontendAddons.map(id => {
                                const add = UI_ADDONS.find(a => a.id === id);
                                if (!add || !add.payOnArrival) return null;
                                return (
                                  <div key={id} className="flex justify-between items-center text-xs">
                                    <span className="text-white/80">{add.name}</span>
                                    <span className="font-bold text-accent">Arrange at check-in</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-6">
                          <span className="text-white/60 text-xs font-black uppercase tracking-widest">Total Amount</span>
                          <span className="text-4xl font-serif font-bold text-accent">€{priceData.totalAmount}</span>
                        </div>
                      </div>
                      
                      <div className="mt-12 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <ShieldCheck className="w-6 h-6 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Best Price Guaranteed</span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: The Final Arrival */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto space-y-12"
              >
                <header className="text-center">
                  <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 italic">Ready for Your Arrival?</h1>
                  <p className="text-muted-foreground text-lg">One final review of your sanctuary details.</p>
                </header>

                <div className="bg-white rounded-[2rem] sm:rounded-[4rem] p-5 sm:p-12 md:p-20 shadow-2xl border border-border/50 space-y-8 md:space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 border-b border-border pb-8 md:pb-12">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-primary">Your Sanctuary</h3>
                      <div className="space-y-2">
                        <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">{selectedRoom?.name}</p>
                        <p className="text-sm sm:text-base text-muted-foreground">{formatDate(dateRange.from)} — {formatDate(dateRange.to)}</p>
                        <p className="text-sm sm:text-base text-muted-foreground">{guestCount} Guests · {priceData?.nights} Nights</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-primary">The Guest</h3>
                      <div className="space-y-2">
                        <p className="text-xl sm:text-2xl font-serif font-bold text-foreground">{form.getValues("guestFullName")}</p>
                        <p className="text-sm sm:text-base text-muted-foreground">{form.getValues("guestEmail")}</p>
                        <p className="text-sm sm:text-base text-muted-foreground">{form.getValues("guestPhone")}</p>
                      </div>
                    </div>
                  </div>

                  {selectedFrontendAddons.length > 0 && (
                    <div className="border-b border-border pb-8 md:pb-12 space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-primary">Your Tailored Experiences</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedFrontendAddons.map(id => {
                          const addon = UI_ADDONS.find(a => a.id === id);
                          if (!addon) return null;
                          const Icon = addon.icon;
                          return (
                            <div key={id} className="flex items-center gap-3 p-4 bg-muted/20 rounded-2xl border border-border/50">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{addon.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">
                                  {addon.payOnArrival ? "Pay on arrival" : "Included in booking"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary text-center">Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "bank_transfer", label: "Bank Transfer", desc: "Pay via secure wire" },
                        { value: "cash", label: "Pay on Arrival", desc: "Secure island payment" },
                        { value: "online_card", label: "Online Card", desc: "Link sent to email" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => form.setValue("paymentMethod", opt.value as any)}
                          className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 text-center ${
                            form.watch("paymentMethod") === opt.value
                              ? "border-primary bg-primary/5 shadow-lg scale-105"
                              : "border-border hover:border-primary/20 bg-muted/10"
                          }`}
                        >
                          <p className="font-bold text-sm mb-1">{opt.label}</p>
                          <p className="text-[10px] text-muted-foreground leading-tight uppercase tracking-widest">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 md:pt-12 border-t border-border flex flex-col items-center gap-6 md:gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Investment</span>
                      <p className="text-5xl sm:text-6xl font-serif font-bold text-primary">€{priceData?.totalAmount}</p>
                    </div>

                    <FormField control={form.control} name="agreeTerms" render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormControl>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={field.value === true}
                              onChange={(e) => field.onChange(e.target.checked ? true : undefined)}
                              className="w-5 h-5 rounded border-muted transition-all"
                            />
                            <span className="text-sm text-muted-foreground">I agree to the <span className="text-primary underline">terms and island policies</span>.</span>
                          </label>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button
                      size="lg"
                      onClick={form.handleSubmit(onSubmit)}
                      disabled={createBooking.isPending || !form.watch("agreeTerms")}
                      className="w-full max-w-md bg-accent text-primary hover:bg-white rounded-full h-16 sm:h-20 text-lg sm:text-2xl font-bold shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 sm:gap-4"
                    >
                      {createBooking.isPending ? "Confirming..." : "Confirm My Sanctuary"}
                      <Check className="w-6 h-6 sm:w-8 sm:h-8" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
