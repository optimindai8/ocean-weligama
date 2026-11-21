import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  useAdminGetDashboard,
  useAdminGetBookingsTrend,
  useAdminGetUpcomingCheckins,
  useAdminListMessages,
  useAdminListRooms,
  useAdminListServices,
  useAdminListReviews,
  useAdminListGallery,
  useAdminListBlogs,
  useAdminGetBookingPlots,
  useAdminListGuests,
  getAdminGetDashboardQueryKey,
  getAdminGetBookingsTrendQueryKey,
  getAdminGetUpcomingCheckinsQueryKey,
  getAdminListMessagesQueryKey,
  getAdminListRoomsQueryKey,
  getAdminListServicesQueryKey,
  getAdminListReviewsQueryKey,
  getAdminListGalleryQueryKey,
  getAdminListBlogsQueryKey,
  getAdminGetBookingPlotsQueryKey,
  getAdminListGuestsQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { 
  Calendar, Euro, Users, TrendingUp, Mail, Clock, 
  BedDouble, PackageOpen, Compass, MessageSquare, CheckCircle, ImageIcon, PenTool,
  Activity, BarChart2, LayoutGrid, ChevronDown, Layers, Check, Coins
} from "lucide-react";

interface LuxurySelectOption {
  value: number;
  label: string;
}

interface LuxurySelectProps {
  value: number;
  options: LuxurySelectOption[];
  onChange: (value: number) => void;
  ariaLabel?: string;
}

function LuxurySelect({ value, options, onChange, ariaLabel }: LuxurySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector("[data-selected='true']") as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative select-none z-50">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2.5 bg-white border rounded-xl px-3.5 py-1.5 text-xs font-bold text-[#0B3D5E] shadow-xs hover:border-[#FBBF24]/80 hover:shadow-sm transition-all duration-150 cursor-pointer min-w-[115px] ${
          isOpen ? "border-[#FBBF24] ring-2 ring-[#FBBF24]/20 bg-white" : "border-slate-200/90"
        }`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-[#0B3D5E]" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ backgroundColor: "#ffffff" }}
            className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(7,30,46,0.22)] rounded-2xl p-1.5 z-[100]"
          >
            <div
              ref={listRef}
              className="max-h-56 overflow-y-auto overscroll-contain space-y-1 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    data-selected={isSelected}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm font-black"
                        : "text-slate-700 hover:bg-slate-100/90 hover:text-[#0B3D5E]"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FBBF24] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  const now = new Date();
  const [plotView, setPlotView] = useState<"daily" | "monthly" | "yearly" | "all">("daily");
  const [revenuePlotView, setRevenuePlotView] = useState<"daily" | "monthly" | "yearly" | "all">("daily");
  const [revenueCurrency, setRevenueCurrency] = useState<"LKR" | "EUR">("LKR");
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);

  const { data: dashboard, isLoading: dashLoading } = useAdminGetDashboard({
    query: { queryKey: getAdminGetDashboardQueryKey() },
  });
  const { data: trend } = useAdminGetBookingsTrend({ days: 30 }, {
    query: { queryKey: getAdminGetBookingsTrendQueryKey({ days: 30 }) },
  });
  const { data: upcomingCheckins } = useAdminGetUpcomingCheckins({
    query: { queryKey: getAdminGetUpcomingCheckinsQueryKey() },
  });
  const { data: messages } = useAdminListMessages({ isRead: false }, {
    query: { queryKey: getAdminListMessagesQueryKey({ isRead: false }) },
  });

  const { data: bookingPlots, isLoading: plotsLoading } = useAdminGetBookingPlots(
    { year: selectedYear, month: selectedMonth },
    {
      query: {
        queryKey: getAdminGetBookingPlotsQueryKey({ year: selectedYear, month: selectedMonth }),
        refetchInterval: 15000,
      },
    }
  );

  const { data: rooms, isLoading: roomsLoading } = useAdminListRooms({ query: { queryKey: getAdminListRoomsQueryKey() } });
  const { data: services, isLoading: servicesLoading } = useAdminListServices({ query: { queryKey: getAdminListServicesQueryKey() } });
  const { data: reviews, isLoading: reviewsLoading } = useAdminListReviews({ query: { queryKey: getAdminListReviewsQueryKey() } });
  const { data: gallery, isLoading: galleryLoading } = useAdminListGallery({ query: { queryKey: getAdminListGalleryQueryKey() } });
  const { data: blogs, isLoading: blogsLoading } = useAdminListBlogs({ query: { queryKey: getAdminListBlogsQueryKey() } });
  const { data: guests, isLoading: guestsLoading } = useAdminListGuests({ query: { queryKey: getAdminListGuestsQueryKey() } });

  const MONTHS = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const AVAILABLE_YEARS = [2026, 2025, 2024, 2023];

  const CustomPlotTooltip = ({ active, payload, mode }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let titleLabel = "";
      if (mode === "daily") {
        titleLabel = `Day ${data.day} • ${data.date}`;
      } else if (mode === "monthly") {
        titleLabel = `${data.month} ${selectedYear}`;
      } else {
        titleLabel = `Year ${data.year}`;
      }

      return (
        <div className="bg-[#071E2E]/95 backdrop-blur-xl border border-[#FBBF24]/30 rounded-2xl p-4 shadow-[0_15px_35px_rgba(7,30,46,0.4)] text-white min-w-[170px] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FBBF24] font-black">
              {titleLabel}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/70 font-medium">Bookings:</span>
              <span className="text-base font-serif font-black text-white">{data.bookings}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/70 font-medium">Volume Revenue:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">€{data.revenue}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const formatRevenue = (eurAmount: number | string, currency: "LKR" | "EUR") => {
    const eur = typeof eurAmount === "string" ? parseFloat(eurAmount) || 0 : eurAmount || 0;
    if (currency === "LKR") {
      const lkr = Math.round(eur * 340);
      return `Rs ${lkr.toLocaleString()}`;
    }
    return `€${eur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatCompactRevenue = (val: number, currency: "LKR" | "EUR") => {
    if (currency === "LKR") {
      if (val >= 1000000) return `Rs ${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `Rs ${(val / 1000).toFixed(0)}k`;
      return `Rs ${val}`;
    }
    if (val >= 1000) return `€${(val / 1000).toFixed(1)}k`;
    return `€${val}`;
  };

  const revenueDailyData = (bookingPlots?.daily || []).map((d) => {
    const eur = parseFloat(d.revenue) || 0;
    const value = revenueCurrency === "LKR" ? Math.round(eur * 340) : Math.round(eur * 100) / 100;
    return {
      ...d,
      eurRevenue: eur,
      revenueValue: value,
    };
  });

  const revenueMonthlyData = (bookingPlots?.monthly || []).map((m) => {
    const eur = parseFloat(m.revenue) || 0;
    const value = revenueCurrency === "LKR" ? Math.round(eur * 340) : Math.round(eur * 100) / 100;
    return {
      ...m,
      eurRevenue: eur,
      revenueValue: value,
    };
  });

  const revenueYearlyData = (bookingPlots?.yearly || []).map((y) => {
    const eur = parseFloat(y.revenue) || 0;
    const value = revenueCurrency === "LKR" ? Math.round(eur * 340) : Math.round(eur * 100) / 100;
    return {
      ...y,
      eurRevenue: eur,
      revenueValue: value,
    };
  });

  // Robust live revenue aggregates (uses API calculated fields with instant dataset sum fallbacks)
  const currentMonthRevenue = useMemo(() => {
    if (bookingPlots?.monthRevenue !== undefined && bookingPlots.monthRevenue !== null) {
      const parsed = parseFloat(bookingPlots.monthRevenue);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return (bookingPlots?.daily || []).reduce((acc, d) => acc + (parseFloat(d.revenue) || 0), 0);
  }, [bookingPlots]);

  const currentYearRevenue = useMemo(() => {
    if (bookingPlots?.yearRevenue !== undefined && bookingPlots.yearRevenue !== null) {
      const parsed = parseFloat(bookingPlots.yearRevenue);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return (bookingPlots?.monthly || []).reduce((acc, m) => acc + (parseFloat(m.revenue) || 0), 0);
  }, [bookingPlots]);

  const currentTotalRevenue = useMemo(() => {
    if (bookingPlots?.totalRevenue !== undefined && bookingPlots.totalRevenue !== null) {
      const parsed = parseFloat(bookingPlots.totalRevenue);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return (bookingPlots?.yearly || []).reduce((acc, y) => acc + (parseFloat(y.revenue) || 0), 0);
  }, [bookingPlots]);

  const currentMonthBookings = useMemo(() => {
    if (typeof bookingPlots?.monthBookings === "number" && bookingPlots.monthBookings > 0) {
      return bookingPlots.monthBookings;
    }
    return (bookingPlots?.daily || []).reduce((acc, d) => acc + (d.bookings || 0), 0);
  }, [bookingPlots]);

  const currentYearBookings = useMemo(() => {
    if (typeof bookingPlots?.yearBookings === "number" && bookingPlots.yearBookings > 0) {
      return bookingPlots.yearBookings;
    }
    return (bookingPlots?.monthly || []).reduce((acc, m) => acc + (m.bookings || 0), 0);
  }, [bookingPlots]);

  const currentTotalBookings = useMemo(() => {
    if (typeof bookingPlots?.totalBookings === "number" && bookingPlots.totalBookings > 0) {
      return bookingPlots.totalBookings;
    }
    return (bookingPlots?.yearly || []).reduce((acc, y) => acc + (y.bookings || 0), 0);
  }, [bookingPlots]);

  const CustomRevenuePlotTooltip = ({ active, payload, mode }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      let titleLabel = "";
      if (mode === "daily") {
        titleLabel = `Day ${data.day} • ${data.date}`;
      } else if (mode === "monthly") {
        titleLabel = `${data.month} ${selectedYear}`;
      } else {
        titleLabel = `Year ${data.year}`;
      }

      const eurAmount = data.eurRevenue ?? (parseFloat(data.revenue) || 0);
      const lkrAmount = Math.round(eurAmount * 340);
      const mainAmountStr = revenueCurrency === "LKR" ? `Rs ${lkrAmount.toLocaleString()}` : `€${eurAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const secondaryAmountStr = revenueCurrency === "LKR" ? `≈ €${eurAmount.toFixed(2)} EUR` : `≈ Rs ${lkrAmount.toLocaleString()} LKR`;

      return (
        <div className="bg-[#071E2E]/95 backdrop-blur-xl border border-[#FBBF24]/35 rounded-2xl p-4 shadow-[0_15px_35px_rgba(7,30,46,0.4)] text-white min-w-[200px] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FBBF24] font-black">
              {titleLabel}
            </span>
            <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/70 font-medium">Revenue ({revenueCurrency}):</span>
              <span className="text-base font-serif font-black text-[#FBBF24]">{mainAmountStr}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] text-white/50 font-medium">Converted:</span>
              <span className="text-[11px] font-bold text-slate-300 font-mono">{secondaryAmountStr}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/5">
              <span className="text-xs text-white/70 font-medium">Bookings:</span>
              <span className="text-xs font-bold text-[#FBBF24] font-mono">{data.bookings} total</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const dash = dashboard as {
    todayBookings: number;
    monthRevenue: string;
    yearRevenue?: string;
    activeGuests: number;
    totalBookings: number;
    pendingBookings: number;
    recentMessages: number;
  } | undefined;

  const roomsCount = Array.isArray(rooms) ? rooms.length : 0;
  const packagesCount = Array.isArray(services) ? services.filter((s: any) => s.type === 'main').length : 0;
  const experiencesCount = Array.isArray(services) ? services.filter((s: any) => s.type === 'optional').length : 0;
  const unapprovedReviewsCount = Array.isArray(reviews) ? reviews.filter((r: any) => !r.isApproved).length : 0;
  const approvedReviewsCount = Array.isArray(reviews) ? reviews.filter((r: any) => r.isApproved).length : 0;
  const unreadMessagesCount = Array.isArray(messages) ? messages.length : dash?.recentMessages ?? 0;
  const pendingImagesCount = Array.isArray(gallery) ? gallery.filter((g: any) => g.status === 'pending').length : 0;
  const blogsCount = Array.isArray(blogs) ? blogs.length : 0;
  const guestsCount = Array.isArray(guests) ? guests.length : (dash?.activeGuests ?? 0);

  const isAnyLoading = dashLoading || roomsLoading || servicesLoading || reviewsLoading || galleryLoading || blogsLoading || guestsLoading;

  const displayYearRevenue = dash?.yearRevenue && parseFloat(dash.yearRevenue) > 0
    ? parseFloat(dash.yearRevenue)
    : (currentYearRevenue > 0 ? currentYearRevenue : 0);

  const METRICS = [
    { label: "Today's Bookings", value: dash?.todayBookings ?? 0, icon: Calendar, color: "text-blue-500" },
    { label: "Year Revenue", value: `€${Math.round(displayYearRevenue).toLocaleString()}`, icon: Euro, color: "text-emerald-500" },
    { label: "Active Guests", value: guestsCount, icon: Users, color: "text-purple-500" },
    { label: "Total Bookings", value: dash?.totalBookings ?? currentTotalBookings ?? 0, icon: TrendingUp, color: "text-orange-500" },
    { label: "Total Rooms", value: roomsCount, icon: BedDouble, color: "text-cyan-500" },
    { label: "Packages", value: packagesCount, icon: PackageOpen, color: "text-indigo-500" },
    { label: "Experiences", value: experiencesCount, icon: Compass, color: "text-teal-500" },
    { label: "Unread Messages", value: unreadMessagesCount, icon: Mail, color: "text-rose-500" },
    { label: "Unapproved Reviews", value: unapprovedReviewsCount, icon: MessageSquare, color: "text-red-500" },
    { label: "Approved Reviews", value: approvedReviewsCount, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Pending Images", value: pendingImagesCount, icon: ImageIcon, color: "text-amber-500" },
    { label: "Total Blogs", value: blogsCount, icon: PenTool, color: "text-sky-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1.5 text-sm">Welcome back. Here's your island sanctuary at a glance.</p>
          </div>
        </motion.div>

        {/* Transparent Statistics Sanctuary Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.4rem] sm:rounded-[3rem] border border-white/80 shadow-[0_24px_70px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.18)_inset] backdrop-blur-2xl p-6 sm:p-8 md:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(254,251,243,0.55) 45%, rgba(245,249,252,0.72) 100%)',
          }}
        >
          {/* Subtle top golden accent hairline */}
          <div
            className="absolute top-0 inset-x-8 sm:inset-x-12 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
          />

          {/* Ambient corner radial warmth glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0B3D5E]/06 rounded-full blur-3xl pointer-events-none" />

          {/* Transparent Box Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-200/50 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#071E2E] to-[#0B3D5E] flex items-center justify-center text-[#FBBF24] shadow-md shadow-[#0B3D5E]/20 shrink-0">
                <Activity className="w-5 h-5 text-[#FBBF24]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-serif font-black text-[#0B3D5E] tracking-tight">Executive Statistics & Operations</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Pulse
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time property metrics across bookings, rooms, guest relations & content.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#0B3D5E] bg-white/80 px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-xs backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24]" />
                12 Live Signals
              </span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 relative z-10">
            {isAnyLoading
              ? [...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-[2rem] bg-white/60 border border-white/80" />
                ))
              : METRICS.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: "easeOut" }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative bg-white/80 hover:bg-white backdrop-blur-md rounded-[2rem] p-5 sm:p-6 border border-white/95 hover:border-[#FBBF24]/50 shadow-[0_8px_25px_rgba(11,61,94,0.04)] hover:shadow-[0_16px_35px_rgba(251,191,36,0.16)] transition-all duration-300 cursor-default flex flex-col justify-between overflow-hidden"
                    data-testid={`metric-${m.label.toLowerCase().replace(/ /g, "-")}`}
                  >
                    {/* Top subtle golden hairline accent on hover */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-start justify-between gap-2 mb-4">
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-widest transition-colors leading-tight">
                        {m.label}
                      </span>
                      <div className={`p-2.5 rounded-xl ${m.color.replace('text-', 'bg-').replace('500', '50')} ${m.color} shadow-xs group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                        <m.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <p className="text-3xl sm:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight group-hover:text-[#071E2E] transition-colors">
                      {m.value}
                    </p>
                  </motion.div>
                ))}
          </div>
        </motion.div>

        {/* ── Booking Volume Intelligence & Plots Deck ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.4rem] sm:rounded-[3rem] border border-white/80 shadow-[0_24px_70px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.18)_inset] backdrop-blur-2xl p-6 sm:p-8 md:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(254,251,243,0.65) 50%, rgba(245,249,252,0.8) 100%)',
          }}
        >
          {/* Subtle top golden accent hairline */}
          <div
            className="absolute top-0 inset-x-8 sm:inset-x-12 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.85), transparent)' }}
          />

          {/* Ambient corner radial warmth glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0B3D5E]/05 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header with Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-200/60 relative z-30">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#071E2E] to-[#0B3D5E] flex items-center justify-center text-[#FBBF24] shadow-md shadow-[#0B3D5E]/20 shrink-0">
                <BarChart2 className="w-5 h-5 text-[#FBBF24]" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-black text-[#0B3D5E] tracking-tight">Booking Volume Intelligence & Plots</h2>
              </div>
            </div>

            {/* View Mode Switcher & Filters */}
            <div className="flex flex-wrap items-center gap-3 relative z-30">
              {/* Plot Mode Tabs */}
              <div className="bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 flex items-center shadow-xs shrink-0">
                <button
                  onClick={() => setPlotView("daily")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    plotView === "daily"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Daily</span>
                </button>
                <button
                  onClick={() => setPlotView("monthly")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    plotView === "monthly"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Monthly</span>
                </button>
                <button
                  onClick={() => setPlotView("yearly")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    plotView === "yearly"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Yearly</span>
                </button>
                <button
                  onClick={() => setPlotView("all")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    plotView === "all"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All Plots</span>
                </button>
              </div>

              {/* Month & Year Selectors (Grouped Together) */}
              <div className="flex items-center gap-2 shrink-0">
                {(plotView === "daily" || plotView === "all") && (
                  <LuxurySelect
                    value={selectedMonth}
                    options={MONTHS}
                    onChange={setSelectedMonth}
                    ariaLabel="Select Month"
                  />
                )}
                <LuxurySelect
                  value={selectedYear}
                  options={AVAILABLE_YEARS.map((y) => ({ value: y, label: String(y) }))}
                  onChange={setSelectedYear}
                  ariaLabel="Select Year"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 relative z-10">
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Selected Month Bookings</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-black text-[#0B3D5E]">{currentMonthBookings}</span>
                <span className="text-[11px] text-slate-400 font-medium">in {MONTHS.find(m => m.value === selectedMonth)?.label}</span>
              </div>
            </div>
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Selected Year Bookings</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-black text-[#0B3D5E]">{currentYearBookings}</span>
                <span className="text-[11px] text-slate-400 font-medium">in {selectedYear}</span>
              </div>
            </div>
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Total System Bookings</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-serif font-black text-[#0B3D5E]">{currentTotalBookings}</span>
                <span className="text-[11px] text-emerald-600 font-bold">Live Recorded</span>
              </div>
            </div>
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Tracking Window</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#0B3D5E] font-mono">{MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}</span>
              </div>
            </div>
          </div>

          {/* ── PLOTS RENDERING AREA ── */}
          <div className="relative z-10">
            {plotsLoading ? (
              <div className="h-[320px] flex items-center justify-center bg-white/70 rounded-[2rem] border border-white/80">
                <Skeleton className="h-full w-full rounded-[2rem]" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* 1. DAILY VIEW (Line Chart: 1 to 31) */}
                {plotView === "daily" && (
                  <motion.div
                    key="daily-plot"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E] flex items-center gap-2">
                          <span>1. Daily Bookings Trend</span>
                          <span className="text-xs font-medium text-slate-400 font-normal">
                            • {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Line chart plotting daily booking counts across days 1–{bookingPlots?.daily?.length || 31} to pinpoint demand peaks and low-demand days.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#0B3D5E] bg-[#0B3D5E]/5 px-3 py-1 rounded-full border border-[#0B3D5E]/10 shrink-0 self-start sm:self-auto">
                        <span className="w-2.5 h-0.5 bg-[#0B3D5E] rounded-full" />
                        <span>Daily Booking Curve</span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={bookingPlots?.daily || []} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="dailyBookingGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0B3D5E" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#0B3D5E" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={{ stroke: "#e2e8f0" }}
                          tickFormatter={(v) => `${v}`}
                        />
                        <YAxis 
                          allowDecimals={false} 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip content={<CustomPlotTooltip mode="daily" />} />
                        <Area
                          type="monotone"
                          dataKey="bookings"
                          stroke="#0B3D5E"
                          strokeWidth={3.5}
                          fillOpacity={1}
                          fill="url(#dailyBookingGrad)"
                          dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.bookings > 0) {
                              return <circle key={cx} cx={cx} cy={cy} r={5.5} fill="#FBBF24" stroke="#0B3D5E" strokeWidth={2.5} />;
                            }
                            return <circle key={cx} cx={cx} cy={cy} r={2} fill="#cbd5e1" opacity={0.6} />;
                          }}
                          activeDot={{ r: 7.5, fill: "#FBBF24", stroke: "#071E2E", strokeWidth: 3 }}
                          isAnimationActive={true}
                          animationDuration={1100}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* 2. MONTHLY VIEW (Bar Chart: January to December) */}
                {plotView === "monthly" && (
                  <motion.div
                    key="monthly-plot"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E] flex items-center gap-2">
                          <span>2. Monthly Bookings Comparison</span>
                          <span className="text-xs font-medium text-slate-400 font-normal">
                            • {selectedYear}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bar chart comparing monthly booking performance across all 12 calendar months to analyze seasonal variance.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#D97706] bg-[#FBBF24]/15 px-3 py-1 rounded-full border border-[#FBBF24]/30 shrink-0 self-start sm:self-auto">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#FBBF24]" />
                        <span>Monthly Volume</span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={bookingPlots?.monthly || []} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>
                          <linearGradient id="navyBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0B3D5E" />
                            <stop offset="100%" stopColor="#071E2E" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={{ stroke: "#e2e8f0" }} 
                        />
                        <YAxis 
                          allowDecimals={false} 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip content={<CustomPlotTooltip mode="monthly" />} />
                        <Bar 
                          dataKey="bookings" 
                          radius={[8, 8, 0, 0]} 
                          maxBarSize={48} 
                          isAnimationActive={true} 
                          animationDuration={1100}
                        >
                          {(bookingPlots?.monthly || []).map((entry) => (
                            <Cell
                              key={entry.month}
                              fill={entry.bookings > 0 ? "url(#goldBarGrad)" : "#e2e8f0"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* 3. YEARLY VIEW (Bar Chart: 2023, 2024, 2025, 2026...) */}
                {plotView === "yearly" && (
                  <motion.div
                    key="yearly-plot"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E] flex items-center gap-2">
                          <span>3. Yearly Bookings Growth</span>
                          <span className="text-xs font-medium text-slate-400 font-normal">
                            • 2023 – 2026+
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bar chart tracking multi-year reservation volumes to understand long-term hospitality business expansion.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#0B3D5E] bg-[#0B3D5E]/10 px-3 py-1 rounded-full border border-[#0B3D5E]/20 shrink-0 self-start sm:self-auto">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#0B3D5E]" />
                        <span>Annual Growth</span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={bookingPlots?.yearly || []} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                        <defs>
                          <linearGradient id="yearlyActiveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0B3D5E" />
                            <stop offset="100%" stopColor="#071E2E" />
                          </linearGradient>
                          <linearGradient id="yearlyGoldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 13, fill: "#0B3D5E", fontWeight: 700 }} 
                          tickLine={false} 
                          axisLine={{ stroke: "#e2e8f0" }} 
                        />
                        <YAxis 
                          allowDecimals={false} 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip content={<CustomPlotTooltip mode="yearly" />} />
                        <Bar 
                          dataKey="bookings" 
                          radius={[10, 10, 0, 0]} 
                          maxBarSize={64} 
                          isAnimationActive={true} 
                          animationDuration={1100}
                        >
                          {(bookingPlots?.yearly || []).map((entry) => (
                            <Cell
                              key={entry.year}
                              fill={entry.bookings > 0 ? "url(#yearlyGoldGrad)" : "#e2e8f0"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* 4. ALL PLOTS VIEW (Displays Daily Line Chart + Monthly & Yearly Bar Charts side-by-side) */}
                {plotView === "all" && (
                  <motion.div
                    key="all-plots"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {/* Daily Line Chart */}
                    <div className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">
                          1. Daily Bookings Line Chart • {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
                        </h3>
                        <span className="text-xs font-bold text-slate-500 font-mono">Date 1–31</span>
                      </div>
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={bookingPlots?.daily || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="allDailyGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0B3D5E" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#0B3D5E" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomPlotTooltip mode="daily" />} />
                          <Area
                            type="monotone"
                            dataKey="bookings"
                            stroke="#0B3D5E"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#allDailyGrad)"
                            dot={(props: any) => {
                              const { cx, cy, payload } = props;
                              if (payload.bookings > 0) {
                                return <circle key={cx} cx={cx} cy={cy} r={5} fill="#FBBF24" stroke="#0B3D5E" strokeWidth={2.5} />;
                              }
                              return <circle key={cx} cx={cx} cy={cy} r={2} fill="#cbd5e1" opacity={0.5} />;
                            }}
                            activeDot={{ r: 7, fill: "#FBBF24", stroke: "#071E2E", strokeWidth: 3 }}
                            isAnimationActive={true}
                            animationDuration={1000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Monthly & Yearly Side-by-Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Monthly Bar Chart */}
                      <div className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">
                            2. Monthly Bookings Bar Chart • {selectedYear}
                          </h3>
                          <span className="text-xs font-bold text-slate-500 font-mono">Jan – Dec</span>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={bookingPlots?.monthly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="allGoldBarGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="100%" stopColor="#D97706" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomPlotTooltip mode="monthly" />} />
                            <Bar dataKey="bookings" radius={[6, 6, 0, 0]} maxBarSize={38} isAnimationActive={true} animationDuration={1000}>
                              {(bookingPlots?.monthly || []).map((entry) => (
                                <Cell
                                  key={entry.month}
                                  fill={entry.bookings > 0 ? "url(#allGoldBarGrad)" : "#e2e8f0"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Yearly Bar Chart */}
                      <div className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">
                            3. Yearly Bookings Bar Chart
                          </h3>
                          <span className="text-xs font-bold text-slate-500 font-mono">2023 – 2026+</span>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={bookingPlots?.yearly || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="allYearlyGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0B3D5E" />
                                <stop offset="100%" stopColor="#071E2E" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#0B3D5E", fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomPlotTooltip mode="yearly" />} />
                            <Bar dataKey="bookings" radius={[8, 8, 0, 0]} maxBarSize={48} isAnimationActive={true} animationDuration={1000}>
                              {(bookingPlots?.yearly || []).map((entry) => (
                                <Cell
                                  key={entry.year}
                                  fill={entry.bookings > 0 ? "url(#allGoldBarGrad)" : "#e2e8f0"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* ── Booking Revenue Intelligence & Plots Deck ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.4rem] sm:rounded-[3rem] border border-white/80 shadow-[0_24px_70px_rgba(11,61,94,0.06),0_0_0_1px_rgba(251,191,36,0.22)_inset] backdrop-blur-2xl p-6 sm:p-8 md:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(254,251,243,0.65) 50%, rgba(245,249,252,0.85) 100%)',
          }}
        >
          {/* Top golden accent hairline matching hotel brand */}
          <div
            className="absolute top-0 inset-x-8 sm:inset-x-12 h-[2px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.9), transparent)' }}
          />

          {/* Ambient corner radial warmth glows */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#FBBF24]/12 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#0B3D5E]/06 rounded-full blur-3xl pointer-events-none" />

          {/* Section Header with Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-200/60 relative z-30">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#071E2E] to-[#0B3D5E] flex items-center justify-center text-[#FBBF24] shadow-md shadow-[#0B3D5E]/20 shrink-0">
                <Coins className="w-5 h-5 text-[#FBBF24]" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-black text-[#0B3D5E] tracking-tight">Booking Revenue Intelligence & Plots</h2>
              </div>
            </div>

            {/* View Mode Switcher, Currency & Filters */}
            <div className="flex flex-wrap items-center gap-3 relative z-30">
              {/* Currency Toggle (LKR vs EUR) */}
              <div className="bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 flex items-center shadow-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setRevenueCurrency("LKR")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    revenueCurrency === "LKR"
                      ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  LKR (Rs)
                </button>
                <button
                  type="button"
                  onClick={() => setRevenueCurrency("EUR")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    revenueCurrency === "EUR"
                      ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  EUR (€)
                </button>
              </div>

              {/* Plot Mode Tabs */}
              <div className="bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 flex items-center shadow-xs shrink-0">
                <button
                  onClick={() => setRevenuePlotView("daily")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    revenuePlotView === "daily"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Daily</span>
                </button>
                <button
                  onClick={() => setRevenuePlotView("monthly")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    revenuePlotView === "monthly"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Monthly</span>
                </button>
                <button
                  onClick={() => setRevenuePlotView("yearly")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    revenuePlotView === "yearly"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Yearly</span>
                </button>
                <button
                  onClick={() => setRevenuePlotView("all")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                    revenuePlotView === "all"
                      ? "bg-white text-[#0B3D5E] shadow-sm shadow-slate-200/50 scale-[1.02]"
                      : "text-slate-500 hover:text-[#0B3D5E]"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All Plots</span>
                </button>
              </div>

              {/* Month & Year Selectors (Always grouped together) */}
              <div className="flex items-center gap-2 shrink-0">
                {(revenuePlotView === "daily" || revenuePlotView === "all") && (
                  <LuxurySelect
                    value={selectedMonth}
                    options={MONTHS}
                    onChange={setSelectedMonth}
                    ariaLabel="Select Revenue Month"
                  />
                )}
                <LuxurySelect
                  value={selectedYear}
                  options={AVAILABLE_YEARS.map((y) => ({ value: y, label: String(y) }))}
                  onChange={setSelectedYear}
                  ariaLabel="Select Revenue Year"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 relative z-10">
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Selected Month Revenue</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                  {formatRevenue(currentMonthRevenue, revenueCurrency)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">in {MONTHS.find(m => m.value === selectedMonth)?.label}</span>
              </div>
            </div>
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Selected Year Revenue</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                  {formatRevenue(currentYearRevenue, revenueCurrency)}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">in {selectedYear}</span>
              </div>
            </div>
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Total System Revenue</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                  {formatRevenue(currentTotalRevenue, revenueCurrency)}
                </span>
                <span className="text-[11px] text-[#B45309] font-bold">Live Recorded</span>
              </div>
            </div>
            <div className="bg-white/85 rounded-2xl p-3.5 sm:p-4 border border-white/95 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Currency & Window</span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                <span className="text-xs font-bold text-[#0B3D5E] font-mono">
                  {revenueCurrency} • {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
                </span>
              </div>
            </div>
          </div>

          {/* ── REVENUE PLOTS RENDERING AREA ── */}
          <div className="relative z-10">
            {plotsLoading ? (
              <div className="h-[320px] flex items-center justify-center bg-white/70 rounded-[2rem] border border-white/80">
                <Skeleton className="h-full w-full rounded-[2rem]" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* 1. DAILY REVENUE VIEW (Line Chart: 1 to 31) */}
                {revenuePlotView === "daily" && (
                  <motion.div
                    key="daily-revenue-plot"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E] flex items-center gap-2">
                          <span>1. Daily Revenue Trend</span>
                          <span className="text-xs font-medium text-slate-400 font-normal">
                            • {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Line chart plotting daily revenue fluctuations across days 1–{bookingPlots?.daily?.length || 31} to pinpoint high-revenue and low-revenue days.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#0B3D5E] bg-[#0B3D5E]/5 px-3 py-1 rounded-full border border-[#0B3D5E]/15 shrink-0 self-start sm:self-auto">
                        <span className="w-2.5 h-0.5 bg-[#0B3D5E] rounded-full" />
                        <span>Daily Revenue ({revenueCurrency})</span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={revenueDailyData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="dailyRevLogoGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0B3D5E" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#0B3D5E" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={{ stroke: "#e2e8f0" }}
                          tickFormatter={(v) => `${v}`}
                        />
                        <YAxis 
                          allowDecimals={false} 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(v) => formatCompactRevenue(v, revenueCurrency)}
                        />
                        <Tooltip content={<CustomRevenuePlotTooltip mode="daily" />} />
                        <Area
                          type="monotone"
                          dataKey="revenueValue"
                          stroke="#0B3D5E"
                          strokeWidth={3.5}
                          fillOpacity={1}
                          fill="url(#dailyRevLogoGrad)"
                          dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.eurRevenue > 0) {
                              return <circle key={cx} cx={cx} cy={cy} r={5.5} fill="#FBBF24" stroke="#0B3D5E" strokeWidth={2.5} />;
                            }
                            return <circle key={cx} cx={cx} cy={cy} r={2} fill="#cbd5e1" opacity={0.6} />;
                          }}
                          activeDot={{ r: 7.5, fill: "#FBBF24", stroke: "#071E2E", strokeWidth: 3 }}
                          isAnimationActive={true}
                          animationDuration={1100}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* 2. MONTHLY REVENUE VIEW (Bar Chart: January to December) */}
                {revenuePlotView === "monthly" && (
                  <motion.div
                    key="monthly-revenue-plot"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E] flex items-center gap-2">
                          <span>2. Monthly Revenue Comparison</span>
                          <span className="text-xs font-medium text-slate-400 font-normal">
                            • {selectedYear}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bar chart comparing monthly revenue performance across all 12 calendar months to analyze seasonal revenue variance.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#B45309] bg-[#FBBF24]/15 px-3 py-1 rounded-full border border-[#FBBF24]/30 shrink-0 self-start sm:self-auto">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#FBBF24]" />
                        <span>Monthly Revenue ({revenueCurrency})</span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={revenueMonthlyData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="monthlyRevGoldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={{ stroke: "#e2e8f0" }} 
                        />
                        <YAxis 
                          allowDecimals={false} 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(v) => formatCompactRevenue(v, revenueCurrency)}
                        />
                        <Tooltip content={<CustomRevenuePlotTooltip mode="monthly" />} />
                        <Bar 
                          dataKey="revenueValue" 
                          radius={[8, 8, 0, 0]} 
                          maxBarSize={48} 
                          isAnimationActive={true} 
                          animationDuration={1100}
                        >
                          {revenueMonthlyData.map((entry) => (
                            <Cell
                              key={entry.month}
                              fill={entry.eurRevenue > 0 ? "url(#monthlyRevGoldGrad)" : "#e2e8f0"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* 3. YEARLY REVENUE VIEW (Bar Chart: 2023, 2024, 2025, 2026...) */}
                {revenuePlotView === "yearly" && (
                  <motion.div
                    key="yearly-revenue-plot"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E] flex items-center gap-2">
                          <span>3. Yearly Revenue Growth</span>
                          <span className="text-xs font-medium text-slate-400 font-normal">
                            • 2023 – 2026+
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Bar chart tracking multi-year revenue performance to evaluate long-term hospitality business expansion.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-[#0B3D5E] bg-[#0B3D5E]/5 px-3 py-1 rounded-full border border-[#0B3D5E]/15 shrink-0 self-start sm:self-auto">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#0B3D5E]" />
                        <span>Annual Revenue ({revenueCurrency})</span>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={revenueYearlyData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="yearlyRevLogoGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="50%" stopColor="#D97706" />
                            <stop offset="100%" stopColor="#0B3D5E" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 13, fill: "#0B3D5E", fontWeight: 700 }} 
                          tickLine={false} 
                          axisLine={{ stroke: "#e2e8f0" }} 
                        />
                        <YAxis 
                          allowDecimals={false} 
                          tick={{ fontSize: 11, fill: "#64748b" }} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(v) => formatCompactRevenue(v, revenueCurrency)}
                        />
                        <Tooltip content={<CustomRevenuePlotTooltip mode="yearly" />} />
                        <Bar 
                          dataKey="revenueValue" 
                          radius={[10, 10, 0, 0]} 
                          maxBarSize={64} 
                          isAnimationActive={true} 
                          animationDuration={1100}
                        >
                          {revenueYearlyData.map((entry) => (
                            <Cell
                              key={entry.year}
                              fill={entry.eurRevenue > 0 ? "url(#yearlyRevLogoGrad)" : "#e2e8f0"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* 4. ALL REVENUE PLOTS VIEW */}
                {revenuePlotView === "all" && (
                  <motion.div
                    key="all-revenue-plots"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {/* Daily Revenue Line Chart */}
                    <div className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">
                          1. Daily Revenue Line Chart • {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}
                        </h3>
                        <span className="text-xs font-bold text-[#0B3D5E] font-mono">Date 1–31 ({revenueCurrency})</span>
                      </div>
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={revenueDailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="allDailyRevLogoGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0B3D5E" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#0B3D5E" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompactRevenue(v, revenueCurrency)} />
                          <Tooltip content={<CustomRevenuePlotTooltip mode="daily" />} />
                          <Area
                            type="monotone"
                            dataKey="revenueValue"
                            stroke="#0B3D5E"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#allDailyRevLogoGrad)"
                            dot={(props: any) => {
                              const { cx, cy, payload } = props;
                              if (payload.eurRevenue > 0) {
                                return <circle key={cx} cx={cx} cy={cy} r={5} fill="#FBBF24" stroke="#0B3D5E" strokeWidth={2.5} />;
                              }
                              return <circle key={cx} cx={cx} cy={cy} r={2} fill="#cbd5e1" opacity={0.5} />;
                            }}
                            activeDot={{ r: 7, fill: "#FBBF24", stroke: "#071E2E", strokeWidth: 3 }}
                            isAnimationActive={true}
                            animationDuration={1000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Monthly & Yearly Side-by-Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Monthly Revenue Bar Chart */}
                      <div className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">
                            2. Monthly Revenue Bar Chart • {selectedYear}
                          </h3>
                          <span className="text-xs font-bold text-[#B45309] font-mono">Jan – Dec ({revenueCurrency})</span>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={revenueMonthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="allMonthlyRevGoldGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="100%" stopColor="#D97706" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompactRevenue(v, revenueCurrency)} />
                            <Tooltip content={<CustomRevenuePlotTooltip mode="monthly" />} />
                            <Bar dataKey="revenueValue" radius={[6, 6, 0, 0]} maxBarSize={38} isAnimationActive={true} animationDuration={1000}>
                              {revenueMonthlyData.map((entry) => (
                                <Cell
                                  key={entry.month}
                                  fill={entry.eurRevenue > 0 ? "url(#allMonthlyRevGoldGrad)" : "#e2e8f0"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Yearly Revenue Bar Chart */}
                      <div className="bg-white/90 rounded-[2rem] border border-white/95 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">
                            3. Yearly Revenue Bar Chart
                          </h3>
                          <span className="text-xs font-bold text-[#0B3D5E] font-mono">2023 – 2026+ ({revenueCurrency})</span>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart data={revenueYearlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="allYearlyRevLogoGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="50%" stopColor="#D97706" />
                                <stop offset="100%" stopColor="#0B3D5E" />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#0B3D5E", fontWeight: 700 }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompactRevenue(v, revenueCurrency)} />
                            <Tooltip content={<CustomRevenuePlotTooltip mode="yearly" />} />
                            <Bar dataKey="revenueValue" radius={[8, 8, 0, 0]} maxBarSize={48} isAnimationActive={true} animationDuration={1000}>
                              {revenueYearlyData.map((entry) => (
                                <Cell
                                  key={entry.year}
                                  fill={entry.eurRevenue > 0 ? "url(#allYearlyRevLogoGrad)" : "#e2e8f0"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* ── Operational Activity & Communications ── */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Check-ins */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">Upcoming Check-ins (7 days)</h2>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-200">{upcomingCheckins && Array.isArray(upcomingCheckins) ? upcomingCheckins.length : 0} Total</Badge>
            </div>
            {upcomingCheckins && Array.isArray(upcomingCheckins) && upcomingCheckins.length > 0 ? (
              <div className="overflow-x-auto max-h-[460px] overflow-y-auto rounded-[1.5rem] border border-slate-100 relative">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur shadow-sm">
                    <tr className="text-left text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6 py-4 rounded-tl-[1.5rem]">Reference</th>
                      <th className="px-6 py-4">Guest</th>
                      <th className="px-6 py-4">Check-in</th>
                      <th className="px-6 py-4">Nights</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 rounded-tr-[1.5rem]">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(upcomingCheckins as Array<{
                      id: string;
                      reference: string;
                      guestFullName: string;
                      checkIn: string;
                      nights: number;
                      status: string;
                      totalAmount: string;
                      currency: string;
                    }>).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group cursor-default" data-testid={`row-checkin-${b.id}`}>
                        <td className="px-6 py-5 font-mono text-xs font-bold text-[#4BBCCC] group-hover:text-[#0B3D5E] transition-colors">{b.reference}</td>
                        <td className="px-6 py-5 font-bold text-[#0B3D5E]">{b.guestFullName}</td>
                        <td className="px-6 py-5 text-slate-600 font-medium">{b.checkIn}</td>
                        <td className="px-6 py-5 text-slate-600 font-medium">{b.nights}n</td>
                        <td className="px-6 py-5">
                          <Badge className={`text-[10px] font-black uppercase tracking-widest border-0 ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            b.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>{b.status}</Badge>
                        </td>
                        <td className="px-6 py-5 font-black text-[#0B3D5E]">€{b.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 bg-slate-50 rounded-[1.5rem] border border-slate-100 border-dashed">
                <Calendar className="w-10 h-10 mb-3 text-slate-300" />
                <p className="text-sm font-bold">No upcoming check-ins</p>
                <p className="text-xs text-slate-500 mt-1">Your next 7 days are clear</p>
              </div>
            )}
          </motion.div>

          {/* Unread Messages */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#0B3D5E]">Unread Messages</h2>
              {messages && Array.isArray(messages) && messages.length > 0 && (
                <Badge className="bg-rose-100 text-rose-700 border-0 text-[10px] font-black px-2 py-0.5 rounded-full">{messages.length} New</Badge>
              )}
            </div>
            {messages && Array.isArray(messages) && messages.length > 0 ? (
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[460px]">
                {(messages as Array<{ id: string; fullName: string; email: string; subject?: string; createdAt: string }>).slice(0, 5).map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={msg.id} 
                    className="p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-colors cursor-pointer group"
                  >
                    <p className="font-bold text-sm text-[#0B3D5E] group-hover:text-sky-700 transition-colors">{msg.fullName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{msg.subject || msg.email}</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-[1.5rem] min-h-[220px]">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Mail className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold">Inbox zero</p>
                <p className="text-xs text-slate-500 mt-1">No unread messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
