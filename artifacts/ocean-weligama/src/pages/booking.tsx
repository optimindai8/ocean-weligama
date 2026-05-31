import { useState, useEffect, type ReactNode } from "react";
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
  useGetAirportPricing,
  getGetAirportPricingQueryKey,
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  Users,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Waves,
  ArrowRight,
  Award,
  Ship,
  Compass,
  Utensils,
  Bike,
  Plane,
  Calendar,
  Clock,
  ChevronLeft,
  Home,
  RotateCcw,
} from "lucide-react";
import { Footer } from "@/components/footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────
const guestSchema = z
  .object({
    guestFullName:    z.string().min(2, "Full name required"),
    guestEmail:       z.string().email("Valid email required"),
    guestPhone:       z.string().min(5, "Phone required"),
    guestNationality: z.string().optional(),
    specialRequests:  z.string().optional(),
    paymentMethod:    z.enum(["bank_transfer", "cash", "online_card"]),
    agreeTerms:       z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
    airportPickup:    z.boolean().optional(),
    airportDrop:      z.boolean().optional(),
    bringingSurfboard: z.boolean().optional(),
    flightNumber:     z.string().optional(),
    flightDate:       z.string().optional(),
    flightTime:       z.string().optional(),
  })
  .superRefine((d, ctx) => {
    if (d.airportPickup) {
      if (!d.flightNumber?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Flight number required", path: ["flightNumber"] });
      if (!d.flightDate?.trim())   ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Arrival date required",  path: ["flightDate"]   });
      if (!d.flightTime?.trim())   ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Arrival time required",  path: ["flightTime"]   });
    }
  });

type GuestForm = z.infer<typeof guestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────
const TAG_COLORS: Record<string, string> = {
  Adventure: "bg-sky-100 text-sky-700",
  Wellness:  "bg-purple-100 text-purple-700",
  Nature:    "bg-emerald-100 text-emerald-700",
  Culture:   "bg-amber-100 text-amber-700",
};

function getServiceIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('surf') || n.includes('package')) return Award;
  if (n.includes('lesson')) return Waves;
  if (n.includes('yoga')) return Sparkles;
  if (n.includes('whale')) return Ship;
  if (n.includes('safari')) return Compass;
  if (n.includes('cook')) return Utensils;
  if (n.includes('scooter') || n.includes('bike')) return Bike;
  return Sparkles;
}

function getServiceTag(category?: string | null) {
  return category || "Adventure";
}

const ALL_STEPS = {
  guests: { id: "guests", label: "Guests", icon: Users },
  packages: { id: "packages", label: "Packages", icon: Award },
  dates: { id: "dates", label: "Dates", icon: Calendar },
  room: { id: "room", label: "Room", icon: Home },
  experiences: { id: "experiences", label: "Experiences", icon: Sparkles },
  airport: { id: "airport", label: "Airport", icon: Plane },
  confirm: { id: "confirm", label: "Confirm", icon: CreditCard },
};

// ─────────────────────────────────────────────────────────────────────────────
// Default fallback airport prices (used while API data loads)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_AIRPORT_PRICING = {
  pickupPrice: "75.00",
  pickupPriceGroup: "100.00",
  dropPrice: "65.00",
  dropPriceGroup: "100.00",
  groupThreshold: 4,
};

// Slide variants — direction-aware
const slide: any = {
  enter: (d: number) => ({ x: d * 70, opacity: 0, scale: 0.97 }),
  center: {
    x: 0, opacity: 1, scale: 1,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (d: number) => ({
    x: d * -70, opacity: 0, scale: 0.97,
    transition: { duration: 0.26, ease: "easeIn" },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components (defined outside BookingPage to avoid re-mount)
// ─────────────────────────────────────────────────────────────────────────────
function StepHeader({
  n, icon, iconBg, title, sub,
}: {
  n: number; icon: ReactNode; iconBg: string; title: string; sub: string;
}) {
  return (
    <motion.div
      className="text-center mb-10"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.06 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.45, delay: 0.05 }}
        className={`w-20 h-20 rounded-3xl ${iconBg} flex items-center justify-center mx-auto mb-5 shadow-lg`}
      >
        {icon}
      </motion.div>
      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
        Step {n} of 7
      </p>
      <h1 className="text-3xl md:text-5xl font-serif font-bold italic text-foreground mb-3 px-2">
        {title}
      </h1>
      <p className="text-muted-foreground text-base max-w-sm mx-auto">{sub}</p>
    </motion.div>
  );
}

function StepNav({
  onBack, onContinue, continueLabel = "Continue",
  disabled = false, loading = false, skipLabel, onSkip,
}: {
  onBack: (() => void) | null;
  onContinue: () => void;
  continueLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-10 pt-6 gap-4 sm:gap-0">
      {onBack ? (
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-5 py-3 rounded-full hover:bg-muted w-full sm:w-auto"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      ) : <div className="hidden sm:block" />}

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {skipLabel && onSkip && (
          <button
            onClick={onSkip}
            className="text-sm font-bold text-muted-foreground hover:text-foreground px-5 py-3 rounded-full hover:bg-muted transition-colors w-full sm:w-auto text-center"
          >
            {skipLabel}
          </button>
        )}
        <button
          onClick={onContinue}
          disabled={disabled || loading}
          className="flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Checking…
            </>
          ) : (
            <>{continueLabel} <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const [, setLocation]   = useLocation();
  const { toast }         = useToast();

  const loadState = (key: string, def: any) => {
    if (typeof window === 'undefined') return def;
    try {
      const val = localStorage.getItem(`booking_${key}`);
      return val ? JSON.parse(val) : def;
    } catch { return def; }
  };
  const saveState = (key: string, val: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`booking_${key}`, JSON.stringify(val));
    }
  };
  const clearState = () => {
    if (typeof window !== 'undefined') {
      ['stepId', 'guestCount', 'dateRange', 'roomIds', 'serviceIds', 'priceData', 'formData'].forEach(k => {
        localStorage.removeItem(`booking_${k}`);
      });
    }
  };

  const [stepId, setStepId] = useState<string>(() => loadState("stepId", "guests"));
  const [dir, setDir] = useState(1);

  const flow = ["guests", "packages", "dates", "room", "experiences", "airport", "confirm"];
  
  const currentStepIndex = flow.indexOf(stepId);
  const currentStepNumber = currentStepIndex + 1;
  const totalSteps = flow.length;
  const STEPS = flow.map((id, idx) => ({ ...ALL_STEPS[id as keyof typeof ALL_STEPS], n: idx + 1 }));

  // Booking state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formDataForSubmit, setFormDataForSubmit] = useState<GuestForm | null>(null);

  const [guestCount,            setGuestCount]            = useState(() => loadState("guestCount", 2));
  const [dateRange,             setDateRange]             = useState<{ from?: Date; to?: Date }>(() => {
    const dr = loadState("dateRange", {});
    return {
      from: dr.from ? new Date(dr.from) : undefined,
      to: dr.to ? new Date(dr.to) : undefined,
    };
  });
  const [selectedRoomIds,       setSelectedRoomIds]       = useState<string[]>(() => loadState("roomIds", []));
  const [selectedDbServiceIds,  setSelectedDbServiceIds]  = useState<string[]>(() => loadState("serviceIds", []));
  const [priceData,             setPriceData]             = useState<any>(() => loadState("priceData", null));
  const [expandedPkgs,          setExpandedPkgs]          = useState<Record<string, boolean>>({});

  useEffect(() => { saveState("stepId", stepId); }, [stepId]);
  useEffect(() => { saveState("guestCount", guestCount); }, [guestCount]);
  useEffect(() => { saveState("dateRange", dateRange); }, [dateRange]);
  useEffect(() => { saveState("roomIds", selectedRoomIds); }, [selectedRoomIds]);
  useEffect(() => { saveState("serviceIds", selectedDbServiceIds); }, [selectedDbServiceIds]);
  useEffect(() => { saveState("priceData", priceData); }, [priceData]);

  const nights = dateRange.from && dateRange.to
    ? Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000) : 0;

  const toStrSafe = (d: Date) => {
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  };
  const listRoomsParams: any = {};
  if (dateRange.from && dateRange.to) {
    listRoomsParams.checkIn = toStrSafe(dateRange.from);
    listRoomsParams.checkOut = toStrSafe(dateRange.to);
  }
  const { data: rooms,    isLoading: roomsLoading } = useListRooms(listRoomsParams);
  const { data: services }                           = useListServices();
  const checkAvail = useCheckAvailabilityAndPrice();
  const createBook = useCreateBooking();

  const computedTotal = (() => {
    if (!priceData) return 0;
    let t = parseFloat(priceData.roomSubtotal) + parseFloat(priceData.cleaningFee || "0");
    if (Array.isArray(services)) {
      for (const svcId of selectedDbServiceIds) {
        const svc = services.find(s => s.id === svcId);
        if (svc) {
          const price = parseFloat(svc.basePrice || "0");
          let qty = 1;
          if (svc.unit === "per_person") {
            qty = guestCount;
          } else if (svc.unit === "per_day") {
            qty = nights;
          }
          t += price * qty;
        }
      }
    }
    return t.toFixed(2);
  })();

  const form = useForm<GuestForm>({
    resolver: zodResolver(guestSchema),
    defaultValues: loadState("formData", {
      guestFullName: "", guestEmail: "", guestPhone: "",
      guestNationality: "", specialRequests: "",
      paymentMethod: "bank_transfer", agreeTerms: undefined,
      airportPickup: false, airportDrop: false, bringingSurfboard: false,
      flightNumber: "", flightDate: "", flightTime: "",
    }),
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      saveState("formData", value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const watchPickup    = form.watch("airportPickup");
  const watchDrop      = form.watch("airportDrop");
  const watchSurfboard = form.watch("bringingSurfboard");

  // ── Dynamic airport pricing from API ─────────────────────────────────────
  const { data: airportPricingData } = useGetAirportPricing({
    query: { queryKey: getGetAirportPricingQueryKey(), staleTime: 60_000 },
  });
  const apData = airportPricingData ?? DEFAULT_AIRPORT_PRICING;
  const apThreshold = Number(apData.groupThreshold) || 4;
  const isGroupRate = guestCount >= apThreshold;
  const ap = {
    pickup: parseFloat(isGroupRate ? apData.pickupPriceGroup : apData.pickupPrice),
    drop:   parseFloat(isGroupRate ? apData.dropPriceGroup   : apData.dropPrice),
  };
  const airportTotal   = (watchPickup ? ap.pickup : 0) + (watchDrop ? ap.drop : 0);

  const selectedRooms = Array.isArray(rooms) ? rooms.filter(r => selectedRoomIds.includes(r.id)) : [];

  // ── Navigation helpers ─────────────────────────────────────────────────────
  function goToStep(id: string) {
    const nextIdx = flow.indexOf(id);
    const currIdx = flow.indexOf(stepId);
    setDir(nextIdx > currIdx ? 1 : -1);
    setStepId(id);
  }

  function fmt(d?: Date) {
    return d?.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) ?? "";
  }
  function toStr(d: Date) { return d.toISOString().slice(0, 10); }

  // ── Toggle helpers ─────────────────────────────────────────────────────────
  function toggleService(id: string) {
    setSelectedDbServiceIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  // ── Availability check (Step 3 → 4) ───────────────────────────────────────
  async function handleRoomContinue() {
    if (selectedRoomIds.length === 0) {
      toast({ variant: "destructive", title: "Please select at least one room" }); return;
    }
    if (!dateRange.from || !dateRange.to) {
      toast({ variant: "destructive", title: "Please go back and select your dates" }); return;
    }
    try {
      const res = await checkAvail.mutateAsync({
        data: {
          roomId: selectedRoomIds[0],
          roomIds: selectedRoomIds,
          checkIn: toStr(dateRange.from),
          checkOut: toStr(dateRange.to),
          guestCount,
          serviceIds: selectedDbServiceIds,
        },
      });
      setPriceData(res);
      if ((res as any).available) goToStep("experiences");
      else toast({ variant: "destructive", title: "Room unavailable for these dates", description: "Please choose different dates." });
    } catch {
      toast({ variant: "destructive", title: "Could not check availability" });
    }
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  function onPreSubmit(data: GuestForm) {
    setFormDataForSubmit(data);
    setIsConfirmOpen(true);
  }

  async function executeBooking() {
    if (!formDataForSubmit) return;
    const data = formDataForSubmit;
    if (selectedRoomIds.length === 0 || !dateRange.from || !dateRange.to) return;
    const lines: string[] = [];
    if (data.airportPickup) {
      lines.push(
        `[Airport Pick-up: €${ap.pickup} — Pay on Arrival]`,
        `  Flight: ${data.flightNumber}, Date: ${data.flightDate}, Time: ${data.flightTime}`,
        `  Surfboard: ${data.bringingSurfboard ? "Yes" : "No"}`,
      );
    }
    if (data.airportDrop) lines.push(`[Airport Drop: €${ap.drop} — Pay on Arrival]`);
    const poaNames = []; // Admin handles payment online now via services array.

    let sr = data.specialRequests || "";
    if (lines.length) sr = lines.join("\n") + (sr ? "\n" + sr : "");
    try {
      const bk = await createBook.mutateAsync({
        data: {
          ...data, specialRequests: sr,
          roomId: selectedRoomIds[0],
          roomIds: selectedRoomIds,
          checkIn: toStr(dateRange.from), checkOut: toStr(dateRange.to),
          guestCount, serviceIds: selectedDbServiceIds,
        },
      });
      clearState();
      setLocation(`/book/confirmation?ref=${(bk as any).reference}`);
    } catch {
      toast({ variant: "destructive", title: "Booking failed", description: "Please try again." });
    } finally {
      setIsConfirmOpen(false);
    }
  }

  // ── Journey pills (appear as steps are completed) ──────────────────────────
  const pills = [
    currentStepNumber > 1 ? `👥 ${guestCount} ${guestCount === 1 ? "Traveler" : "Travelers"}` : null,
    currentStepNumber > flow.indexOf("dates") + 1 && dateRange.from && dateRange.to ? `📅 ${fmt(dateRange.from)} → ${fmt(dateRange.to)} · ${nights}n` : null,
    currentStepNumber > flow.indexOf("room") + 1 && selectedRooms.length ? `🏠 ${selectedRooms.length > 1 ? selectedRooms.length + " Rooms" : selectedRooms[0].name}` : null,
    currentStepNumber > flow.indexOf("experiences") + 1 && selectedDbServiceIds.length ? `✨ ${selectedDbServiceIds.length} Add-on${selectedDbServiceIds.length > 1 ? "s" : ""}` : null,
    currentStepNumber > flow.indexOf("airport") + 1 && (watchPickup || watchDrop) ? "✈️ Airport Transfer" : null,
  ].filter(Boolean) as string[];

  const packages = Array.isArray(services) ? services.filter(s => s.type === "main" || (s.type === "optional" && s.category?.toLowerCase().includes("package")) || s.category?.toLowerCase() === "package") : [];
  const experiences = Array.isArray(services) ? services.filter(s => (s.type === "optional" && !s.category?.toLowerCase().includes("package")) || (s.type !== "main" && s.type !== "optional" && s.category?.toLowerCase() !== "package")) : [];

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">

      {/* ── STICKY PROGRESS HEADER ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="container mx-auto px-4 pt-20 md:pt-28 pb-4">
          <div className="max-w-3xl mx-auto space-y-4">

            {/* Slim progress bar */}
            <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                animate={{ width: `${((currentStepNumber - 1) / (totalSteps - 1 || 1)) * 100}%` }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              />
            </div>

            {/* Step dots */}
            <div className="flex items-center justify-between">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const done = currentStepNumber > s.n;
                const curr = currentStepNumber === s.n;
                return (
                  <div key={s.n} className="flex flex-col items-center gap-1">
                    <div className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                      border-2 transition-all duration-400
                      ${done ? "bg-primary border-primary text-white"
                             : curr ? "bg-white border-primary text-primary shadow-lg shadow-primary/20 scale-110"
                                    : "bg-white border-muted text-muted-foreground/50"}
                    `}>
                      {done
                        ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        : <Icon  className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                    </div>
                    <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest hidden sm:block ${
                      curr ? "text-primary" : "text-muted-foreground/40"
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Journey pills */}
            <AnimatePresence>
              {pills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex flex-wrap gap-1.5 overflow-hidden"
                >
                  {pills.map((p, i) => (
                    <motion.span
                      key={p}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="text-[10px] font-bold px-3 py-1 bg-primary/8 text-primary border border-primary/15 rounded-full"
                    >
                      {p}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <main className="flex-1 py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-6 md:p-10 lg:p-14 relative min-h-[60vh] flex flex-col justify-center mb-20">
          <Form {...form}>
            <AnimatePresence mode="wait" custom={dir}>

            {/* ══════════════════════════════════════════════════════════════
                STEP 1 — Guests
            ══════════════════════════════════════════════════════════════ */}
            {stepId === "guests" && (
              <motion.div
                key="guests" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="w-full max-w-2xl mx-auto"
              >
                <StepHeader
                  n={currentStepNumber} iconBg="bg-sky-100"
                  icon={<Users className="w-9 h-9 text-sky-600" />}
                  title="How many are joining?"
                  sub="Tell us how many travelers will be staying with us."
                />

                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                  className="bg-slate-50/50 rounded-[2.5rem] p-6 md:p-10 border border-slate-100/50"
                >
                  <div className="flex items-center justify-center gap-6 md:gap-10">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-16 h-16 rounded-full border-2 border-sky-100 text-2xl font-bold text-sky-400 hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all duration-300 shadow-md flex items-center justify-center"
                    >
                      −
                    </button>

                    <div className="text-center min-w-[90px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={guestCount}
                          initial={{ y: -16, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 16, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="text-8xl font-bold text-primary leading-none tabular-nums"
                        >
                          {guestCount}
                        </motion.div>
                      </AnimatePresence>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-3">
                        {guestCount === 1 ? "Traveler" : "Travelers"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.min(12, guestCount + 1))}
                      className="w-16 h-16 rounded-full border-2 border-sky-100 text-2xl font-bold text-sky-400 hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all duration-300 shadow-md flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <AnimatePresence>
                    {guestCount >= apThreshold && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-100 px-5 py-3 rounded-full text-center mt-8"
                      >
                        ✈️ {apThreshold}+ guests — group airport transfer rate: €{parseFloat(apData.pickupPriceGroup).toFixed(0)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <StepNav onBack={null} onContinue={() => goToStep("packages")} continueLabel="View Packages" />
              </motion.div>
            )}

            {/* Journey Step Removed */}

            {/* ══════════════════════════════════════════════════════════════
                STEP 2 — Dates
            ══════════════════════════════════════════════════════════════ */}
            {stepId === "dates" && (
              <motion.div
                key="dates" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="w-full max-w-2xl mx-auto"
              >
                <StepHeader
                  n={currentStepNumber} iconBg="bg-violet-100"
                  icon={<Calendar className="w-9 h-9 text-violet-600" />}
                  title="When would you like to arrive?"
                  sub="Select your check-in and check-out dates below."
                />

                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
                  className="bg-slate-50/50 rounded-[2.5rem] p-4 md:p-10 border border-slate-100/50"
                >
                  <div className="flex justify-center overflow-x-auto pb-4">
                    <DayPicker
                      mode="range"
                      selected={dateRange as any}
                      onSelect={(r) => {
                        const hasPackageSelected = selectedDbServiceIds.some(id => packages.some(p => p.id === id));
                        if (hasPackageSelected && r?.from) {
                          if (!r.to || r.to <= r.from) {
                            const minTo = new Date(r.from);
                            minTo.setDate(minTo.getDate() + 7);
                            setDateRange({ from: r.from, to: minTo });
                          } else {
                            const diffDays = Math.round((r.to.getTime() - r.from.getTime()) / 86400000);
                            if (diffDays < 7) {
                              const minTo = new Date(r.from);
                              minTo.setDate(minTo.getDate() + 7);
                              setDateRange({ from: r.from, to: minTo });
                            } else {
                              setDateRange({ from: r.from, to: r.to });
                            }
                          }
                        } else {
                          setDateRange(r ?? {});
                        }
                      }}
                      disabled={{ before: new Date() }}
                      numberOfMonths={1}
                      className="font-sans"
                    />
                  </div>

                  {dateRange.from && (
                    <div className="flex justify-center mt-4">
                      <button
                        type="button"
                        onClick={() => setDateRange({})}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-violet-600 bg-white border border-violet-200 rounded-full hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Dates
                      </button>
                    </div>
                  )}

                  <AnimatePresence>
                    {dateRange.from && dateRange.to && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-6 bg-violet-50 border border-violet-100 rounded-2xl px-6 py-5 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-violet-400 mb-1">Your Stay</p>
                          <p className="font-bold text-foreground text-base">{fmt(dateRange.from)} — {fmt(dateRange.to)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-violet-400 mb-1">Nights</p>
                          <p className="text-4xl font-bold text-violet-600">{nights}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <StepNav
                  onBack={() => goToStep("packages")}
                  onContinue={() => {
                    const hasPackageSelected = selectedDbServiceIds.some(id => packages.some(p => p.id === id));
                    if (!dateRange.from || !dateRange.to) {
                      toast({ variant: "destructive", title: "Please select check-in and check-out dates" });
                      return;
                    }
                    if (dateRange.from.getTime() === dateRange.to.getTime()) {
                      toast({ variant: "destructive", title: "Check-out must be after check-in" });
                      return;
                    }
                    if (!hasPackageSelected && nights < 2) {
                      toast({ variant: "destructive", title: "Minimum 2 nights required for room bookings" });
                      return;
                    }
                    if (hasPackageSelected && nights < 7) {
                      toast({ variant: "destructive", title: "Packages require a minimum 7 night stay" });
                      return;
                    }
                    goToStep("room");
                  }}
                  continueLabel="Choose Your Room"
                  disabled={!dateRange.from || !dateRange.to}
                />
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 3 — Room
            ══════════════════════════════════════════════════════════════ */}
            {stepId === "room" && (
              <motion.div
                key="room" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="w-full max-w-4xl mx-auto"
              >
                <StepHeader
                  n={currentStepNumber} iconBg="bg-amber-100"
                  icon={<Home className="w-9 h-9 text-amber-600" />}
                  title="Choose Your Sanctuary"
                  sub="Select the perfect space for your island escape."
                />

                {roomsLoading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-44 rounded-[2rem]" />)}
                  </div>
                ) : (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 gap-6"
                  >
                    {Array.isArray(rooms) && rooms.map(room => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomIds(prev => prev.includes(room.id) ? prev.filter(id => id !== room.id) : [...prev, room.id])}
                        className={`group text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-400 relative overflow-hidden ${
                          selectedRoomIds.includes(room.id)
                            ? "border-primary bg-white shadow-2xl shadow-primary/10 scale-[1.02] z-10"
                            : "border-transparent bg-slate-50/70 shadow-sm hover:bg-white hover:border-amber-200 hover:shadow-xl hover:scale-[1.01]"
                        }`}
                      >
                        {selectedRoomIds.includes(room.id) && (
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute top-5 right-5 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                        {room.heroImageUrl && (
                          <div className="w-full h-40 mb-5 rounded-2xl overflow-hidden bg-muted">
                            <img src={room.heroImageUrl} alt={room.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{room.name}</h3>
                        {room.shortDesc && (
                          <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{room.shortDesc}</p>
                        )}
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1">Capacity</p>
                            <p className="text-sm font-bold text-muted-foreground">{room.maxGuests} Guests</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 mb-1">From</p>
                            <p className="text-3xl font-bold text-primary">
                              €{room.basePricePerNight}
                              <span className="text-xs font-normal text-muted-foreground">/nt</span>
                            </p>
                          </div>
                        </div>
                        {/* hover shimmer */}
                        <div className="absolute inset-0 bg-amber-500/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2rem]" />
                      </button>
                    ))}
                  </motion.div>
                )}

                <StepNav
                  onBack={() => goToStep("dates")}
                  onContinue={handleRoomContinue}
                  continueLabel="Check Availability"
                  disabled={selectedRoomIds.length === 0}
                  loading={checkAvail.isPending}
                />
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 4 — Packages
            ══════════════════════════════════════════════════════════════ */}
            {stepId === "packages" && (
              <motion.div
                key="packages" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="w-full max-w-4xl mx-auto"
              >
                <StepHeader
                  n={currentStepNumber} iconBg="bg-emerald-100"
                  icon={<Award className="w-9 h-9 text-emerald-600" />}
                  title="Surf & Adventure Packages"
                  sub="Add professional coaching to your stay. Completely optional."
                />

                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {packages.map(pkg => {
                    const isSel = selectedDbServiceIds.includes(pkg.id);
                    const tag = getServiceTag(pkg.category);
                    const price = `€${parseInt(pkg.basePrice)}`;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => toggleService(pkg.id)}
                        className={`group bg-white rounded-[2.5rem] border-2 transition-all duration-400 relative overflow-hidden flex flex-col h-full cursor-pointer ${
                          isSel
                            ? "border-emerald-500 bg-white shadow-2xl shadow-emerald-100 scale-[1.02] z-10"
                            : "border-transparent bg-slate-50/70 shadow-sm hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:scale-[1.01]"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative w-full h-56 overflow-hidden bg-emerald-50 shrink-0 rounded-t-[2.5rem]">
                          {pkg.imageUrl ? (
                            <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Award className="w-16 h-16 text-emerald-200" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          
                          {/* Top-Right Badge (e.g. SURF MAIN) */}
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#0B3D5E] font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-md z-10 border border-white/20">
                            {tag} {pkg.type?.toUpperCase()}
                          </div>

                          {/* Selected check overlay */}
                          {isSel && (
                            <motion.div
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="absolute top-4 left-4 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 flex flex-col flex-1">
                          <h3 className="text-2xl font-serif font-black text-[#0B3D5E] mb-2 leading-tight px-1">
                            {pkg.name}
                          </h3>
                          <p className="text-3xl font-extrabold text-[#0B3D5E] mb-1 px-1">
                            {price}.00
                          </p>
                          <p className="text-xs text-slate-400 font-mono mb-4 px-1">
                            {pkg.slug}
                          </p>
                          
                          <hr className="border-slate-100 my-4" />

                          {/* Highlights */}
                          {pkg.highlights && pkg.highlights.length > 0 && (
                            <div className="space-y-3 mb-6 flex-1 px-1">
                              {(() => {
                                const isExpanded = expandedPkgs[pkg.id];
                                const visibleHighlights = isExpanded ? pkg.highlights : pkg.highlights.slice(0, 6);
                                const hasMore = pkg.highlights.length > 6;

                                return (
                                  <>
                                    {visibleHighlights.map((hl, i) => (
                                      <div key={i} className="flex items-start gap-2.5">
                                        <Check className="w-4 h-4 text-[#4BBCCC] shrink-0 mt-0.5" />
                                        <span className="text-slate-600 font-medium text-sm leading-relaxed">{hl}</span>
                                      </div>
                                    ))}
                                    
                                    {hasMore && (
                                      <button
                                        type="button"
                                        onClick={(e: React.MouseEvent) => {
                                          e.stopPropagation();
                                          setExpandedPkgs(prev => ({ ...prev, [pkg.id]: !prev[pkg.id] }));
                                        }}
                                        className="text-[#4BBCCC] hover:text-[#4BBCCC]/80 font-extrabold text-xs italic hover:underline mt-2 inline-block cursor-pointer"
                                      >
                                        {isExpanded ? "show less highlights" : `+ ${pkg.highlights.length - 6} more highlights`}
                                      </button>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          )}

                          {/* Selection Button */}
                          <div className="mt-auto pt-6 px-1">
                            <Button
                              type="button"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                toggleService(pkg.id);
                              }}
                              className={`w-full py-4 h-12 rounded-full font-bold transition-all duration-300 shadow-md ${
                                isSel
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                  : "bg-[#0B3D5E] hover:bg-[#0B3D5E]/90 text-white shadow-blue-900/10"
                              }`}
                            >
                              {isSel ? "Package Selected" : "Select Package"}
                            </Button>
                          </div>
                        </div>

                        {/* hover shimmer */}
                        <div className="absolute inset-0 bg-emerald-500/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2.5rem]" />
                      </div>
                    );
                  })}
                </motion.div>

                <StepNav
                  onBack={() => goToStep("guests")}
                  onContinue={() => goToStep("dates")}
                  continueLabel="Continue"
                  skipLabel="Skip Packages"
                  onSkip={() => goToStep("dates")}
                />
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 5 — Experiences
            ══════════════════════════════════════════════════════════════ */}
            {stepId === "experiences" && (
              <motion.div
                key="experiences" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="w-full max-w-4xl mx-auto"
              >
                <StepHeader
                  n={currentStepNumber} iconBg="bg-purple-100"
                  icon={<Sparkles className="w-9 h-9 text-purple-600" />}
                  title="Island Experiences"
                  sub="All pay on arrival — simply tell us at check-in and we'll arrange everything."
                />

                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
                >
                  {experiences.map(exp => {
                    const isSel = selectedDbServiceIds.includes(exp.id);
                    const tag = getServiceTag(exp.category);
                    const price = `€${parseInt(exp.basePrice)}`;

                    return (
                      <button
                        key={exp.id}
                        onClick={() => toggleService(exp.id)}
                        className={`group text-left rounded-[1.5rem] border-2 transition-all duration-400 relative overflow-hidden flex flex-col ${
                          isSel
                            ? "border-purple-400 bg-white shadow-lg shadow-purple-100 scale-[1.02] z-10"
                            : "border-transparent bg-slate-50/70 shadow-sm hover:bg-white hover:border-purple-200 hover:shadow-lg hover:scale-[1.01]"
                        }`}
                      >
                        <div className="p-6 flex-1 flex flex-col">
                          {/* Emoji Icon */}
                          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm border border-purple-100">
                            <span className="text-2xl">{exp.iconEmoji || '🌊'}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-serif font-bold text-foreground mb-2 group-hover:text-purple-600 transition-colors">
                            {exp.name}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6 flex-1 line-clamp-2">
                            {exp.description || exp.highlights?.[0] || 'Experience the best of Weligama.'}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-dashed border-muted mt-auto w-full">
                            <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Per Person</p>
                            <span className={`text-xl font-bold ${isSel ? "text-purple-600" : "text-foreground"}`}>
                              {price}
                            </span>
                          </div>

                          {isSel && (
                            <motion.div
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>

                <StepNav
                  onBack={() => goToStep("room")}
                  onContinue={() => goToStep("airport")}
                  continueLabel="Airport Transfer"
                  skipLabel="Skip Experiences"
                  onSkip={() => goToStep("airport")}
                />
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 6 — Airport Transfer
            ══════════════════════════════════════════════════════════════ */}
            {stepId === "airport" && (
              <motion.div
                key="airport" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="w-full max-w-4xl mx-auto"
              >
                <StepHeader
                  n={currentStepNumber} iconBg="bg-rose-100"
                  icon={<Plane className="w-9 h-9 text-rose-500" />}
                  title="Airport Transfer"
                  sub="Optional — let us handle your journey to and from Bandaranaike International Airport."
                />

                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  className="space-y-5"
                >
                  {/* ── Pickup card ── */}
                  <div className={`rounded-[2rem] border-2 transition-all duration-400 overflow-hidden ${watchPickup ? "border-primary bg-white shadow-xl shadow-primary/8 z-10" : "border-transparent bg-slate-50/70 shadow-sm hover:bg-white"}`}>
                    <button
                      type="button"
                      onClick={() => form.setValue("airportPickup", !watchPickup)}
                      className="w-full text-left p-5 md:p-7 flex items-start gap-4 md:gap-5"
                    >
                      <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        watchPickup ? "bg-primary border-primary" : "border-muted-foreground/30"
                      }`}>
                        {watchPickup && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${watchPickup ? "bg-primary text-white" : "bg-sky-100 text-sky-600"}`}>
                              <Plane className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">Airport Pick-up</p>
                              <p className="text-xs text-muted-foreground">Airport → Surf Camp</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${watchPickup ? "text-primary" : "text-muted-foreground"}`}>
                              €{ap.pickup}
                            </p>
                            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Pay on Arrival</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                          Transfer from Bandaranaike International Airport to the Surf Camp.{" "}
                          <span className="font-semibold text-foreground/70">
                            Up to {apThreshold - 1} pax: €{parseFloat(apData.pickupPrice).toFixed(0)}. For {apThreshold}+ pax: €{parseFloat(apData.pickupPriceGroup).toFixed(0)}.
                          </span>
                        </p>
                      </div>
                    </button>

                    {/* Expanded: surfboard + flight info */}
                    {watchPickup && (
                      <div className="border-t border-border/30">
                        <div className="p-5 md:p-7 space-y-6">
                          {/* Surfboard */}
                          <div className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-2xl p-5">
                            <div>
                              <p className="font-bold text-foreground text-sm">Bringing a surfboard?</p>
                              <p className="text-xs text-muted-foreground mt-0.5">We'll arrange extra space in the vehicle</p>
                            </div>
                            <div className="flex gap-2">
                              {["No", "Yes"].map(v => (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => form.setValue("bringingSurfboard", v === "Yes")}
                                  className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
                                    (v === "Yes" ? watchSurfboard === true : watchSurfboard === false)
                                      ? "bg-primary border-primary text-white shadow-md"
                                      : "bg-white border-muted text-muted-foreground hover:border-primary/30"
                                  }`}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Flight details */}
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                              <span className="w-0.5 h-4 bg-primary rounded-full inline-block" />
                              Arrival Information
                            </p>
                            <div className="grid sm:grid-cols-3 gap-4">
                              <FormField control={form.control} name="flightNumber" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Plane className="w-2.5 h-2.5" /> Flight No.
                                  </FormLabel>
                                  <FormControl>
                                    <Input placeholder="QR 654" className="h-12 rounded-xl border-muted bg-muted/20 font-mono px-4" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="flightDate" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" /> Date
                                  </FormLabel>
                                  <FormControl>
                                    <Input type="date" min={new Date().toISOString().slice(0, 10)} className="h-12 rounded-xl border-muted bg-muted/20 px-4" {...field} value={field.value || ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="flightTime" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" /> Time
                                  </FormLabel>
                                  <FormControl>
                                    <Input type="time" className="h-12 rounded-xl border-muted bg-muted/20 px-4" {...field} value={field.value || ""} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Drop card ── */}
                  <div className={`rounded-[2rem] border-2 transition-all duration-400 ${watchDrop ? "border-primary bg-white shadow-xl shadow-primary/8 z-10" : "border-transparent bg-slate-50/70 shadow-sm hover:bg-white"}`}>
                    <button
                      type="button"
                      onClick={() => form.setValue("airportDrop", !watchDrop)}
                      className="w-full text-left p-5 md:p-7 flex items-start gap-4 md:gap-5"
                    >
                      <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        watchDrop ? "bg-primary border-primary" : "border-muted-foreground/30"
                      }`}>
                        {watchDrop && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${watchDrop ? "bg-primary text-white" : "bg-emerald-100 text-emerald-600"}`}>
                              <Plane className="w-5 h-5 rotate-90" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">Airport Drop</p>
                              <p className="text-xs text-muted-foreground">Surf Camp → Airport</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${watchDrop ? "text-primary" : "text-muted-foreground"}`}>
                              €{ap.drop}
                            </p>
                            <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Pay on Arrival</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                          Transfer from the Surf Camp to Bandaranaike International Airport.{" "}
                          <span className="font-semibold text-foreground/70">
                            Up to {apThreshold - 1} pax: €{parseFloat(apData.dropPrice).toFixed(0)}. For {apThreshold}+ pax: €{parseFloat(apData.dropPriceGroup).toFixed(0)}.
                          </span>
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Transfer total chip */}
                  <AnimatePresence>
                    {(watchPickup || watchDrop) && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="bg-primary/5 border border-primary/15 rounded-2xl px-6 py-5 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Transfer Total</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {[watchPickup && "Pick-up", watchDrop && "Drop"].filter(Boolean).join(" + ")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">€{airportTotal}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Pay on Arrival</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <StepNav
                  onBack={() => goToStep("experiences")}
                  onContinue={async () => {
                    const valid = await form.trigger(["flightNumber", "flightDate", "flightTime"]);
                    if (valid) goToStep("confirm");
                  }}
                  continueLabel="Review & Confirm"
                  skipLabel="No Transfer Needed"
                  onSkip={() => {
                    form.setValue("airportPickup", false);
                    form.setValue("airportDrop", false);
                    goToStep("confirm");
                  }}
                />
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 7 — Confirm & Pay
            ══════════════════════════════════════════════════════════════ */}
            {stepId === "confirm" && (
              <motion.div
                key="confirm" custom={dir} variants={slide}
                initial="enter" animate="center" exit="exit"
                className="w-full mx-auto"
              >
                <StepHeader
                  n={currentStepNumber} iconBg="bg-primary/10"
                  icon={<CreditCard className="w-9 h-9 text-primary" />}
                  title="Almost There"
                  sub="Complete your details and confirm your island sanctuary."
                />

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                  {/* ── Left: Form ── */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="lg:col-span-7 space-y-5"
                  >
                    <form className="space-y-5">
                      {/* Details card */}
                        <div className="bg-slate-50/50 rounded-[2rem] p-5 md:p-8 border border-slate-100/50 space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Your Details</p>

                          <FormField control={form.control} name="guestFullName" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Maria Santos" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <div className="grid sm:grid-cols-2 gap-5">
                            <FormField control={form.control} name="guestEmail" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="maria@example.com" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="guestPhone" render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Phone / WhatsApp</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 555 000 0000" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>

                          <FormField control={form.control} name="guestNationality" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Nationality</FormLabel>
                              <FormControl>
                                <Input placeholder="Spanish" className="h-14 rounded-2xl border-muted bg-muted/20 focus:bg-white px-6" {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <FormField control={form.control} name="specialRequests" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Special Requests (optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Early check-in, dietary needs, surf level…" rows={3} className="rounded-2xl border-muted bg-muted/20 focus:bg-white p-5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        {/* Payment card */}
                        <div className="bg-primary/5 rounded-[2rem] p-6 md:p-8 border border-primary/20 space-y-4 text-center relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
                          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2" />
                          <div className="relative z-10">
                            <div className="mx-auto w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-md border border-primary/10">
                              <ShieldCheck className="w-7 h-7 text-primary" />
                            </div>
                            <h4 className="text-xl font-serif font-bold text-primary mb-2">Secure Your Journey</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                              To ensure a personalized and seamless experience, we will contact you very soon to finalize your booking and discuss the best payment method for you. 
                            </p>
                            {/* Hidden input to keep form valid if it requires paymentMethod */}
                            <input type="hidden" {...form.register("paymentMethod")} value="bank_transfer" />
                          </div>
                        </div>

                        {/* Terms + Submit card */}
                        <div className="bg-slate-50/50 rounded-[2rem] p-5 md:p-8 border border-slate-100/50 space-y-6">
                          <FormField control={form.control} name="agreeTerms" render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <label className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={field.value === true}
                                    onChange={e => field.onChange(e.target.checked ? true : undefined)}
                                    className="w-5 h-5 rounded border-muted accent-primary"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    I agree to the{" "}
                                    <a href="/cancellation-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">Cancellation Policy</a>.
                                  </span>
                                </label>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />

                          <button
                            type="button"
                            onClick={form.handleSubmit(onPreSubmit)}
                            disabled={createBook.isPending || !form.watch("agreeTerms")}
                            className="w-full bg-accent text-primary hover:bg-yellow-300 rounded-full h-16 text-xl font-bold shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                          >
                            Review & Confirm
                            <Check className="w-6 h-6" />
                          </button>
                        </div>
                      </form>

                    <button
                      type="button"
                      onClick={() => goToStep("airport")}
                      className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-muted"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to Airport Transfer
                    </button>
                  </motion.div>

                  {/* ── Right: Live Summary ── */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-5"
                  >
                    <div className="bg-primary rounded-[2rem] p-8 text-white shadow-2xl sticky top-60 overflow-hidden space-y-5">
                      <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 blur-3xl rounded-full" />

                      <h3 className="text-xl font-serif font-bold italic">Your Island Journey</h3>

                      {/* Booking basics & Room Price */}
                      <div className="space-y-3 pb-5 border-b border-white/15 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Room</span>
                          <span className="font-bold">{selectedRooms.map(r => r.name).join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Dates</span>
                          <span className="font-bold">{fmt(dateRange.from)} → {fmt(dateRange.to)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Guests × Stay</span>
                          <span className="font-bold">{guestCount} {guestCount === 1 ? "guest" : "guests"} · {nights} {nights === 1 ? "night" : "nights"}</span>
                        </div>
                        {selectedRooms.length > 0 && (
                          <>
                            {selectedRooms.map(room => (
                              <div key={room.id} className="pt-2 border-t border-white/5 mt-2">
                                <div className="flex justify-between text-xs text-white/80">
                                  <span className="text-white/60">{room.name} Rate</span>
                                  <span>€{parseFloat(room.basePricePerNight).toFixed(2)} / night</span>
                                </div>
                                <div className="flex justify-between text-xs text-white/80">
                                  <span className="text-white/60">{room.name} Subtotal</span>
                                  <span className="font-bold">€{(parseFloat(room.basePricePerNight) * nights).toFixed(2)}</span>
                                </div>
                                {parseFloat(room.cleaningFee || "0") > 0 && (
                                  <div className="flex justify-between text-xs text-white/80">
                                    <span className="text-white/60">{room.name} Cleaning</span>
                                    <span>€{parseFloat(room.cleaningFee || "0").toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Packages & Add-ons */}
                      {selectedDbServiceIds.length > 0 && (
                        <div className="space-y-2.5 pb-5 border-b border-white/15 text-sm">
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Packages & Experiences</p>
                          {selectedDbServiceIds.map(id => {
                            const svc = Array.isArray(services) ? services.find(s => s.id === id) : null;
                            if (!svc) return null;
                            const basePrice = parseFloat(svc.basePrice || "0");
                            let qty = 1;
                            let calculationText = "";
                            if (svc.unit === "per_person") {
                              qty = guestCount;
                              calculationText = ` (€${basePrice.toFixed(0)} × ${guestCount} guests)`;
                            } else if (svc.unit === "per_day") {
                              qty = nights;
                              calculationText = ` (€${basePrice.toFixed(0)} × ${nights} nights)`;
                            }
                            const svcSubtotal = basePrice * qty;
                            return (
                              <div key={id} className="flex justify-between items-baseline gap-2">
                                <span className="text-white/80 text-xs leading-tight">
                                  {svc.name}
                                  <span className="text-[10px] text-white/50 font-normal">{calculationText}</span>
                                </span>
                                <span className="font-bold shrink-0">€{svcSubtotal.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Airport */}
                      {(watchPickup || watchDrop) && (
                        <div className="space-y-2 pb-5 border-b border-white/15 text-sm">
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Airport Transfer (Pay on Arrival)</p>
                          {watchPickup && (
                            <div className="flex justify-between">
                              <span className="text-white/80">Pick-up</span>
                              <span className="font-bold text-accent">€{ap.pickup}</span>
                            </div>
                          )}
                          {watchDrop && (
                            <div className="flex justify-between">
                              <span className="text-white/80">Drop</span>
                              <span className="font-bold text-accent">€{ap.drop}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Total */}
                      <div className="space-y-1">
                        {priceData && (
                          <div className="flex items-end justify-between">
                            <span className="text-white/60 text-xs font-black uppercase tracking-widest">Total</span>
                            <span className="text-4xl font-serif font-bold text-accent">€{computedTotal}</span>
                          </div>
                        )}
                        {airportTotal > 0 && (
                          <p className="text-xs text-white/40 text-right">
                            + €{airportTotal} airport transfer (pay on arrival)
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 bg-white/8 p-4 rounded-2xl border border-white/10">
                        <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Best Price Guaranteed</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            </AnimatePresence>
          </Form>
          </div>

          <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-8 md:p-10 max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
              <DialogHeader>
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <DialogTitle className="text-3xl font-serif italic text-primary text-center">Confirm Your Journey</DialogTitle>
                <DialogDescription className="text-center text-base mt-2">
                  Please review your details before confirming your sanctuary.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 my-6 text-sm text-muted-foreground bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="font-bold">Name</span>
                  <span className="text-foreground">{formDataForSubmit?.guestFullName}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="font-bold">Dates</span>
                  <span className="text-foreground">{dateRange.from ? fmt(dateRange.from) : ''} — {dateRange.to ? fmt(dateRange.to) : ''} ({nights} nights)</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="font-bold">Room</span>
                  <span className="text-foreground">{selectedRooms.map(r => r.name).join(", ")}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <span className="font-bold">Total Pay Online</span>
                  <span className="text-2xl font-black text-primary">€{computedTotal}</span>
                </div>
                {airportTotal > 0 && (
                  <div className="flex justify-between items-center pb-2">
                    <span className="font-bold">Airport Transfer (Pay on Arrival)</span>
                    <span className="text-accent font-bold">€{airportTotal}</span>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-4 sm:gap-0 mt-6 pt-2">
                <Button variant="outline" onClick={() => setIsConfirmOpen(false)} className="rounded-full w-full sm:w-auto px-8 py-6 h-auto font-bold border-2 hover:bg-slate-50">
                  Edit Details
                </Button>
                <Button 
                  onClick={executeBooking} 
                  disabled={createBook.isPending} 
                  className="rounded-full w-full sm:w-auto px-8 py-6 h-auto font-bold bg-primary text-white hover:bg-primary/90 text-lg shadow-xl hover:scale-105 transition-all"
                >
                  {createBook.isPending ? "Confirming..." : "Yes, Confirm Booking"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </main>

      <Footer />
    </div>
  );
}
