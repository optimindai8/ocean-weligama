import { useState, useEffect, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Users,
  Eye,
  Clock,
  Compass,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  MousePointerClick,
  RotateCcw,
  Calendar,
  Palmtree,
  UtensilsCrossed,
  RefreshCw,
  Trash2,
  TrendingUp,
  ShieldCheck,
  Activity,
  Layers,
  ArrowUpRight,
  MessageCircle,
  Phone,
  Mail,
  BookmarkCheck,
  CheckCircle2,
  Radio,
  ChevronDown,
  History,
  Search,
  Home,
  BedDouble,
  Package,
  ExternalLink,
  HelpCircle,
  BookOpen,
  Camera,
} from "lucide-react";
import { useListRooms, useListBlogs, useListServices } from "@workspace/api-client-react";

type ReportPeriod = "today" | "7d" | "30d" | "90d";

export interface VisitorSessionDto {
  id: number;
  sessionId: string;
  visitorId: string;
  ip: string;
  country: string;
  firstSeenAt: number;
  lastSeenAt: number;
  durationMs: number;
  pageViews: number;
  browser: string;
  os: string;
  deviceType: string;
  landingPage?: string;
}

interface DashboardAnalyticsDto {
  generatedAt: string;
  period: ReportPeriod;
  range: { from: string; to: string };
  utcOffsetMinutes: number;
  onlineNow: number;
  summary: {
    visitors: number;
    newVisitors: number;
    returningVisitors: number;
    pageViews: number;
    sessions: number;
    pagesPerSession: number;
    avgEngagedSeconds: number;
  };
  daily: Array<{
    date: string;
    visitors: number;
    pageViews: number;
  }>;
  topPages: Array<{
    label: string;
    title?: string;
    category?: string;
    visitors: number;
    views: number;
    avgDurationSeconds?: number;
    lastVisitedAt?: string | null;
    recentVisits?: Array<{
      occurredAt: number;
      time: string;
      country?: string;
      deviceType?: string;
      browser?: string;
    }>;
  }>;
  mediums: Array<{ label: string; visitors: number; views: number }>;
  sources: Array<{ label: string; visitors: number; views: number }>;
  countries: Array<{ label: string; visitors: number; views: number }>;
  devices: Array<{ label: string; visitors: number; views: number }>;
  browsers: Array<{ label: string; visitors: number; views: number }>;
  operatingSystems: Array<{ label: string; visitors: number; views: number }>;
  events: Array<{ name: string; count: number; visitors: number }>;
  visitorsList?: VisitorSessionDto[];
}

async function fetchAnalytics(period: ReportPeriod): Promise<DashboardAnalyticsDto> {
  const token = localStorage.getItem("ow-admin-token");
  const res = await fetch(`/api/v1/admin/visitors/analytics?period=${period}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to load visitor statistics (${res.status})`);
  }
  return res.json();
}

async function resetAllAnalytics(): Promise<{ ok: boolean; message: string }> {
  const token = localStorage.getItem("ow-admin-token");
  const res = await fetch("/api/v1/admin/visitors/reset", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to reset visitor statistics (${res.status})`);
  }
  return res.json();
}

function formatEngagement(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`;
}

function formatPageDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null || seconds <= 0) return "< 5s";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins}m`;
}

function formatRelativeVisitTime(isoString?: string | null): string {
  if (!isoString) return "No visits logged";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

function formatExactTime(isoOrMs: string | number): string {
  try {
    const d = new Date(isoOrMs);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  } catch {
    return "";
  }
}

function formatDayLabel(dateStr: string): string {
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return `${monthNames[m]} ${d}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function formatChartLabel(label: string): string {
  if (!label) return "";
  if (label.includes(":")) {
    const [hourStr] = label.split(":");
    const hour = parseInt(hourStr, 10);
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  }
  return formatDayLabel(label);
}

function getCountryDetails(rawCode: string): { name: string; flag: string; code: string } {
  if (!rawCode || rawCode === "Unknown" || rawCode === "UN") {
    return { name: "Sri Lanka", flag: "🇱🇰", code: "LK" };
  }
  const clean = rawCode.trim().toUpperCase();
  let name = clean;
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    name = regionNames.of(clean) || clean;
  } catch {
    name = clean;
  }
  let flag = "🌐";
  try {
    if (clean.length === 2) {
      const codePoints = clean.split("").map((c) => 127397 + c.charCodeAt(0));
      flag = String.fromCodePoint(...codePoints);
    }
  } catch {
    flag = "🌐";
  }
  return { name, flag, code: clean };
}

function formatVisitorDate(isoOrMs: string | number): string {
  try {
    const d = new Date(isoOrMs);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Colombo",
    });
  } catch {
    return "";
  }
}

function formatVisitorTime(isoOrMs: string | number): string {
  try {
    const d = new Date(isoOrMs);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Colombo",
    });
  } catch {
    return "";
  }
}

function formatVisitorDuration(durationMs: number): string {
  if (!durationMs || durationMs < 5000) return "< 10s";
  const totalSeconds = Math.round(durationMs / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatVisitorIp(ip?: string | null): string {
  if (!ip) return "Direct Guest";
  const s = ip.trim();
  if (s === "127.0.0.1" || s === "::1" || s === "localhost") {
    return "127.0.0.1 (Localhost)";
  }
  if (s.includes(".") || s.includes(":")) {
    return s;
  }
  return s || "Direct Guest";
}

interface PageDisplayInfo {
  title: string;
  badge: string;
  badgeStyle: string;
  Icon: React.ElementType;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
}

function getPageDisplayInfo(
  rawPath: string,
  serverTitle?: string,
  serverCategory?: string,
  roomsList?: any[],
  blogsList?: any[],
  servicesList?: any[]
): PageDisplayInfo {
  const cleanPath = (rawPath || "/").split("?")[0].split("#")[0].trim();
  const normalized = cleanPath.length > 1 && cleanPath.endsWith("/") ? cleanPath.slice(0, -1) : cleanPath;
  const lower = normalized.toLowerCase();

  // 1. Home Page
  if (lower === "/" || lower === "") {
    return {
      title: "Home Page",
      badge: "Main Portal",
      badgeStyle: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
      Icon: Home,
      iconBg: "bg-blue-50 dark:bg-blue-950/50",
      iconBorder: "border-blue-200/60 dark:border-blue-800/50",
      iconColor: "text-blue-600 dark:text-blue-400",
    };
  }

  // 2. Room Detail: /rooms/:slug or /room/:slug
  if (lower.startsWith("/rooms/") || lower.startsWith("/room/")) {
    const slug = lower.replace(/^\/rooms?\/?/, "").trim();

    // Look up in dynamic roomsList (by slug or UUID id)
    let roomName: string | undefined;
    if (Array.isArray(roomsList)) {
      const matched = roomsList.find((r: any) => {
        if (!r) return false;
        const rSlug = String(r.slug || "").toLowerCase().trim();
        const rId = String(r.id || "").toLowerCase().trim();
        return rSlug === slug || rId === slug;
      });
      if (matched && matched.name) {
        roomName = matched.name.trim();
      }
    }

    // Known room aliases
    const knownMap: Record<string, string> = {
      "sunset-suite": "Sunset Suite — Deluxe Double Room (Room No 12)",
      "deluxe-ocean-view": "Deluxe Private Room with Ocean View & Balcony (Room No 09)",
      "private-beach-villa": "Deluxe Private Room with Ocean View & Balcony (Room No 10)",
      "deluxe-private-room-with-ocean-view-balcony-room-no-11": "Deluxe Private Room with Ocean View & Balcony (Room No 11)",
      "standard-twin-rooms-1st-floor-two-person": "Standard Twin Rooms - 1st Floor (2 Persons)",
      "deluxe-private-room-with-ocean-view-balcony-room-no-09-one-person": "Deluxe Private Room with Ocean View (Room No 09 - 1 Person)",
      "standard-private-rooms-ground-floor": "Standard Private Rooms - Ground Floor (2 Persons)",
      "standard-private-rooms-1st-floor-two-person": "Standard Private Rooms - 1st Floor (2 Persons)",
      "standard-private-rooms-1st-floor-one-person": "Standard Private Rooms - 1st Floor (1 Person)",
      "standard-private-rooms-ground-floor-one-person": "Standard Private Rooms - Ground Floor (1 Person)",
      "standard-twin-room-1st-floor-one-person-shared-maximum-2-people": "Standard Twin Room - 1st Floor (Shared 2 Persons)",
    };

    let title = roomName || (serverTitle && serverTitle !== slug && !serverTitle.toLowerCase().includes(slug) ? serverTitle : undefined) || knownMap[slug];
    if (!title) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      title = isUuid
        ? "Sanctuary Room Suite"
        : slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " (Room Sanctuary)";
    }
    // Clean up typos like Deulux -> Deluxe
    title = title.replace(/\bDeulux\b/gi, "Deluxe").replace(/\s+/g, " ").trim();

    if (slug === "sunset-suite" && !title.toLowerCase().includes("sunset")) {
      title = `Sunset Suite — ${title}`;
    }
    if (slug === "private-beach-villa" && !title.toLowerCase().includes("beach villa")) {
      title = `Private Beach Villa — ${title}`;
    }
    if (slug === "deluxe-ocean-view" && !title.toLowerCase().includes("deluxe ocean view")) {
      title = `Deluxe Ocean View — ${title}`;
    }

    return {
      title,
      badge: "Sanctuary Room",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
      Icon: BedDouble,
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      iconBorder: "border-amber-200/60 dark:border-amber-800/50",
      iconColor: "text-amber-600 dark:text-amber-400",
    };
  }

  // 3. Rooms listing
  if (lower === "/rooms" || lower === "/room") {
    return {
      title: "Rooms & Accommodations",
      badge: "Sanctuary Suites",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
      Icon: BedDouble,
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      iconBorder: "border-amber-200/60 dark:border-amber-800/50",
      iconColor: "text-amber-600 dark:text-amber-400",
    };
  }

  // 4. Packages & Curated Experiences Detail: /packages/:slug, /package/:slug, /experiences/:slug, /experience/:slug
  if (
    lower.startsWith("/packages/") ||
    lower.startsWith("/package/") ||
    lower.startsWith("/experiences/") ||
    lower.startsWith("/experience/")
  ) {
    const isExplicitExp = lower.startsWith("/experiences") || lower.startsWith("/experience");
    const slug = lower.replace(/^\/(packages?|experiences?)\/?/, "").trim();

    // Look up in dynamic servicesList (by slug or UUID id)
    let serviceName: string | undefined;
    let serviceCategoryHint: string | undefined;
    if (Array.isArray(servicesList)) {
      const matched = servicesList.find((s: any) => {
        if (!s) return false;
        const sSlug = String(s.slug || "").toLowerCase().trim();
        const sId = String(s.id || "").toLowerCase().trim();
        return sSlug === slug || sId === slug;
      });
      if (matched && matched.name) {
        serviceName = matched.name.trim();
        serviceCategoryHint = (matched.category || matched.type || "").toLowerCase();
      }
    }

    const knownPackages: Record<string, string> = {
      "surfer-advance-package": "Surfer Advance Package",
      "yoga-surf-retreat-package": "Yoga & Surf Retreat Package",
      "surf-lessons": "Surfer Starter Package (Beginner)",
      "scooter-rentals": "Scooter Rentals",
      "yoga-experiences": "Yoga Experiences",
      "beginner-surfing-lessons": "Beginner Surfing Lessons",
      "advanced-surfing-lessons": "Advanced Surfing Lessons",
      "safari-trips": "Safari Trips",
      "cookery-classes": "Traditional Cookery Classes",
      "whale-watching-tours": "Mirissa Whale Watching Tours",
    };

    let title =
      serviceName ||
      (serverTitle && serverTitle !== slug && !serverTitle.toLowerCase().includes(slug) ? serverTitle : undefined) ||
      knownPackages[slug];

    if (!title) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      title = isUuid
        ? (isExplicitExp ? "Curated Island Experience" : "Curated Special Package")
        : slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    }

    const isExp =
      isExplicitExp ||
      (serverCategory && serverCategory.toLowerCase().includes("experience")) ||
      (serviceCategoryHint &&
        (serviceCategoryHint.includes("adventure") ||
          serviceCategoryHint.includes("activities") ||
          serviceCategoryHint.includes("wellness") ||
          serviceCategoryHint.includes("tour") ||
          serviceCategoryHint.includes("lesson") ||
          serviceCategoryHint.includes("experience"))) ||
      slug.includes("lesson") ||
      slug.includes("scooter") ||
      slug.includes("yoga") ||
      slug.includes("safari") ||
      slug.includes("cookery") ||
      slug.includes("whale");

    return {
      title,
      badge: isExp ? "Curated Experience" : "Special Package",
      badgeStyle: isExp
        ? "bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50"
        : "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
      Icon: isExp ? Palmtree : Package,
      iconBg: isExp ? "bg-purple-50 dark:bg-purple-950/50" : "bg-emerald-50 dark:bg-emerald-950/50",
      iconBorder: isExp ? "border-purple-200/60 dark:border-purple-800/50" : "border-emerald-200/60 dark:border-emerald-800/50",
      iconColor: isExp ? "text-purple-600 dark:text-purple-400" : "text-emerald-600 dark:text-emerald-400",
    };
  }

  // 5. Contact
  if (lower === "/contact") {
    return {
      title: "Contact & Concierge",
      badge: "Guest Inquiries",
      badgeStyle: "bg-teal-50 text-teal-800 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/50",
      Icon: Phone,
      iconBg: "bg-teal-50 dark:bg-teal-950/50",
      iconBorder: "border-teal-200/60 dark:border-teal-800/50",
      iconColor: "text-teal-600 dark:text-teal-400",
    };
  }

  // 6. About
  if (lower === "/about") {
    return {
      title: "About Ocean Weligama",
      badge: "Hotel Sanctuary",
      badgeStyle: "bg-cyan-50 text-cyan-800 border-cyan-200/80 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/50",
      Icon: Compass,
      iconBg: "bg-cyan-50 dark:bg-cyan-950/50",
      iconBorder: "border-cyan-200/60 dark:border-cyan-800/50",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    };
  }

  // 7. Experiences listing
  if (lower === "/experiences" || lower === "/experience") {
    return {
      title: "Curated Experiences",
      badge: "Activities",
      badgeStyle: "bg-purple-50 text-purple-800 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50",
      Icon: Palmtree,
      iconBg: "bg-purple-50 dark:bg-purple-950/50",
      iconBorder: "border-purple-200/60 dark:border-purple-800/50",
      iconColor: "text-purple-600 dark:text-purple-400",
    };
  }

  // 8. Packages listing
  if (lower === "/packages" || lower === "/package") {
    return {
      title: "Packages & Special Offers",
      badge: "Curated Stays",
      badgeStyle: "bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50",
      Icon: Package,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
      iconBorder: "border-emerald-200/60 dark:border-emerald-800/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    };
  }

  // 9. Gallery
  if (lower === "/gallery") {
    return {
      title: "Visual Gallery",
      badge: "Photo Showcase",
      badgeStyle: "bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50",
      Icon: Camera,
      iconBg: "bg-rose-50 dark:bg-rose-950/50",
      iconBorder: "border-rose-200/60 dark:border-rose-800/50",
      iconColor: "text-rose-600 dark:text-rose-400",
    };
  }

  // 10. Booking
  if (lower.startsWith("/booking") || lower.startsWith("/book")) {
    return {
      title: lower.includes("confirm") ? "Booking Confirmation" : "Booking & Reservations",
      badge: "Direct Reservation",
      badgeStyle: "bg-indigo-50 text-indigo-800 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50",
      Icon: Calendar,
      iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
      iconBorder: "border-indigo-200/60 dark:border-indigo-800/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    };
  }

  // 11. FAQ
  if (lower === "/faq") {
    return {
      title: "Frequently Asked Questions",
      badge: "Support & FAQ",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
      Icon: HelpCircle,
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      iconBorder: "border-amber-200/60 dark:border-amber-800/50",
      iconColor: "text-amber-600 dark:text-amber-400",
    };
  }

  // 12. Blog & Stories: /blog/:slug, /blogs/:slug, /stories/:slug, /story/:slug
  if (
    lower.startsWith("/blog") ||
    lower.startsWith("/blogs") ||
    lower.startsWith("/stories") ||
    lower.startsWith("/story")
  ) {
    const slug = lower.replace(/^\/(blog|blogs|stories|story)\/?/, "").trim();
    if (!slug) {
      return {
        title: "Island Journal & Stories",
        badge: "Journal & Stories",
        badgeStyle: "bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50",
        Icon: BookOpen,
        iconBg: "bg-sky-50 dark:bg-sky-950/50",
        iconBorder: "border-sky-200/60 dark:border-sky-800/50",
        iconColor: "text-sky-600 dark:text-sky-400",
      };
    }

    // Look up in dynamic blogsList (by id, slug, or slugified title)
    let blogTitle: string | undefined;
    if (Array.isArray(blogsList)) {
      const matched = blogsList.find((b: any) => {
        if (!b) return false;
        const bId = String(b.id || "").toLowerCase().trim();
        const bSlug = String(b.slug || "").toLowerCase().trim();
        const bTitleSlug = (b.title || "")
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");
        return bId === slug || bSlug === slug || bTitleSlug === slug;
      });
      if (matched && matched.title) {
        blogTitle = matched.title.trim();
      }
    }

    // Known static fallback for initial or seed stories
    const knownBlogTitles: Record<string, string> = {
      "7106ede5-d106-4485-b09c-19d5f9841f0b": "Secret Surf Breaks of Weligama Bay: The Ultimate Dawn Patrol & Reef Guide",
      "e7dece7c-7879-4c7b-89e6-ecfe1265f4c4": "Our Story — Ocean Air Weligama",
      "f97111aa-6e7f-4d5e-92f1-382916ea28cb": "Southern Sri Lanka Coastal Flavours: From King Coconuts to Black Pepper Crab",
      "94c8adbd-65a3-439d-a2e4-b24351aea7dd": "Morning Yoga & Ocean Breath: Restorative Island Living on the South Coast",
      "6e4f5d61-e8a3-4cd4-b660-72f865c02ce1": "The Art of Slow Living: Why Weligama is Sri Lanka's Most Charming Coastal Escape",
      "61ac6bb6-4487-44b6-a60a-83b51cf1f544": "Beginner to Pro: Navigating the Surf Seasons and Swell Windows in Southern Sri Lanka",
      "323fd166-bbc0-4cb0-8c9b-df578bf2b53e": "Sunset Chasing & Rooftop Mixology: Golden Hour Culture at Ocean Weligama",
      "40714788-446b-4c51-b90d-d19ed98acf32": "Ancient Ayurvedic Wisdom: Coastal Herbs & Indigenous Healing of the South",
      "secret-surf-breaks-of-weligama-bay": "Secret Surf Breaks of Weligama Bay: Dawn Patrol Guide",
      "southern-sri-lanka-coastal-flavours": "Southern Sri Lanka Coastal Flavours & Rooftop Dining",
      "morning-yoga-ocean-breath": "Morning Yoga & Ocean Breath: Restorative Island Living",
      "day-trips-from-weligama": "Day Trips from Weligama: Galle Fort, Tea Hills & Whales",
    };

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let title =
      blogTitle ||
      (serverTitle && serverTitle !== slug && !serverTitle.toLowerCase().includes(slug) ? serverTitle : undefined) ||
      knownBlogTitles[slug];

    if (!title) {
      if (isUuid) {
        title = "Island Journal Story";
      } else {
        title = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " (Story)";
      }
    }

    return {
      title,
      badge: "Journal Story",
      badgeStyle: "bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50",
      Icon: BookOpen,
      iconBg: "bg-sky-50 dark:bg-sky-950/50",
      iconBorder: "border-sky-200/60 dark:border-sky-800/50",
      iconColor: "text-sky-600 dark:text-sky-400",
    };
  }

  // 13. Dining
  if (lower === "/dining") {
    return {
      title: "Dining & Coastal Flavors",
      badge: "Culinary",
      badgeStyle: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
      Icon: UtensilsCrossed,
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      iconBorder: "border-amber-200/60 dark:border-amber-800/50",
      iconColor: "text-amber-600 dark:text-amber-400",
    };
  }

  // 14. Generic fallback
  const fallbackTitle = serverTitle && serverTitle !== rawPath
    ? serverTitle
    : lower.replace(/^\//, "").split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Page";

  return {
    title: fallbackTitle,
    badge: serverCategory || "Website Page",
    badgeStyle: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    Icon: Globe,
    iconBg: "bg-slate-50 dark:bg-slate-800",
    iconBorder: "border-slate-200/60 dark:border-slate-700",
    iconColor: "text-slate-600 dark:text-slate-400",
  };
}

export default function AdminVisitors() {
  const { data: roomsList } = useListRooms();
  const { data: blogsList } = useListBlogs();
  const { data: servicesList } = useListServices();
  const [period, setPeriod] = useState<ReportPeriod>("7d");
  const [chartView, setChartView] = useState<"all" | "visitors" | "views">("all");
  const [activeTab, setActiveTab] = useState<"pages" | "visitors" | "sources" | "geo" | "devices">("pages");
  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitorSortOrder, setVisitorSortOrder] = useState<"desc" | "asc">("desc");
  const [expandedPage, setExpandedPage] = useState<string | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-visitors-analytics", period],
    queryFn: () => fetchAnalytics(period),
    refetchInterval: 10000, // Automatic real-time live update every 10 seconds
    placeholderData: (prev) => prev, // Smooth background updates without flash
  });

  useEffect(() => {
    if (data?.generatedAt) {
      setLastRefreshedAt(new Date(data.generatedAt));
    }
  }, [data?.generatedAt]);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    const start = Date.now();
    try {
      await refetch();
      const elapsed = Date.now() - start;
      const minSpinTime = 700; // tactile spin animation duration
      if (elapsed < minSpinTime) {
        await new Promise((resolve) => setTimeout(resolve, minSpinTime - elapsed));
      }
      setLastRefreshedAt(new Date());
      toast({
        title: "Visitor Statistics Updated",
        description: `Live metrics synchronized from Supabase PostgreSQL database.`,
      });
    } catch (err: any) {
      toast({
        title: "Sync Failed",
        description: err.message || "Could not reach database",
        variant: "destructive",
      });
    } finally {
      setIsManualRefreshing(false);
    }
  };

  const resetMutation = useMutation({
    mutationFn: resetAllAnalytics,
    onSuccess: () => {
      toast({
        title: "Visitor Statistics Reset",
        description: "All visitor statistics have been permanently cleared from database.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-visitors-analytics"] });
    },
    onError: (err: any) => {
      toast({
        title: "Reset Failed",
        description: err.message || "Failed to reset visitor statistics",
        variant: "destructive",
      });
    },
  });

  const handleReset = () => {
    const confirmed = window.confirm(
      "⚠️ Reset All Visitor Statistics?\n\nThis will permanently delete all guest tracking data from the database. All metrics, conversions, and trends will return to zero.\n\nAre you sure you want to proceed?"
    );
    if (confirmed) {
      resetMutation.mutate();
    }
  };

  const summary = data?.summary || {
    visitors: 0,
    newVisitors: 0,
    returningVisitors: 0,
    pageViews: 0,
    sessions: 0,
    pagesPerSession: 0,
    avgEngagedSeconds: 0,
  };

  const returningRate = summary.visitors > 0
    ? Math.round((summary.returningVisitors / summary.visitors) * 100)
    : 0;

  // Find custom conversion events
  const getEventStat = (name: string) => {
    const found = data?.events?.find((e) => e.name === name);
    return {
      count: found?.count || 0,
      visitors: found?.visitors || 0,
      rate: summary.visitors > 0 ? Math.round(((found?.visitors || 0) / summary.visitors) * 100) : 0,
    };
  };

  const bookingClicks = getEventStat("booking_click");
  const whatsappClicks = getEventStat("whatsapp_click");
  const phoneClicks = getEventStat("phone_click");
  const emailClicks = (() => {
    const eClick = getEventStat("email_click");
    const eInquiry = getEventStat("email_inquiry");
    const count = eClick.count + eInquiry.count;
    const visitors = Math.max(eClick.visitors, eInquiry.visitors, count > 0 ? 1 : 0);
    const rate = summary.visitors > 0 ? Math.round((visitors / summary.visitors) * 100) : 0;
    return { count, visitors, rate };
  })();
  const cookieConsents = getEventStat("cookie_consent_accepted");
  const cookieRejections = getEventStat("cookie_consent_rejected");
  const totalCookieDecisions = cookieConsents.count + cookieRejections.count;
  const cookieVisitors = Math.max(cookieConsents.visitors, cookieRejections.visitors, totalCookieDecisions > 0 ? 1 : 0);
  const cookieRate = summary.visitors > 0 ? Math.round((cookieVisitors / summary.visitors) * 100) : 0;

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-[#071E2E]/95 backdrop-blur-xl border border-[#F5A623]/30 rounded-2xl p-4 shadow-[0_15px_35px_rgba(7,30,46,0.5)] text-white min-w-[190px] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#F5A623] font-bold">
              {formatChartLabel(p.date)}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/70 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F5A623]" /> Unique Visitors:
              </span>
              <span className="text-sm font-serif font-black text-[#F5A623]">{p.visitors.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/70 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4BBCCC]" /> Page Views:
              </span>
              <span className="text-sm font-serif font-black text-[#4BBCCC]">{p.pageViews.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {/* Top Header & Range Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] dark:text-white tracking-tight">
              Visitor Analytics
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm">
              Live guest traffic, high-intent conversions, and device insights strictly for public website.
            </p>
          </div>

          {/* Top-Right Corner Controls */}
          <div className="flex items-center justify-end gap-2.5 flex-nowrap shrink-0 sm:ml-auto">
            {/* Live Sync Timestamp Indicator */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-mono text-slate-500">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>
                Synced {lastRefreshedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            </div>

            {/* Period Selector Tabs */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0">
              {(
                [
                  { id: "today", label: "Today" },
                  { id: "7d", label: "7 Days" },
                  { id: "30d", label: "30 Days" },
                  { id: "90d", label: "90 Days" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPeriod(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${period === tab.id
                    ? "bg-white dark:bg-[#0B3D5E] text-[#0B3D5E] dark:text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Reset All Statistics Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReset}
              disabled={resetMutation.isPending}
              title="Reset All Visitor Statistics in Database"
              aria-label="Reset All Visitor Statistics"
              className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:border-rose-300 transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <RotateCcw className={`w-4 h-4 text-rose-600 dark:text-rose-400 ${resetMutation.isPending ? "animate-spin" : ""}`} />
              <span className="text-xs font-bold">
                {resetMutation.isPending ? "Resetting..." : "Reset"}
              </span>
            </motion.button>

            {/* Top-Right Corner Refresh Button with Spin Animation */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleManualRefresh}
              disabled={isManualRefreshing || isFetching}
              title="Refresh Data from Supabase"
              aria-label="Refresh Data from Supabase"
              className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer shadow-sm flex items-center gap-2 shrink-0 ${isManualRefreshing
                ? "bg-[#0B3D5E] border-[#F5A623] text-[#F5A623] shadow-md ring-2 ring-[#F5A623]/30"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 active:scale-95"
                }`}
            >
              <motion.div
                animate={{ rotate: isManualRefreshing ? 360 : 0 }}
                transition={
                  isManualRefreshing
                    ? { repeat: Infinity, duration: 0.75, ease: "linear" }
                    : { duration: 0.3 }
                }
              >
                <RefreshCw className="w-4 h-4 text-[#F5A623]" />
              </motion.div>
              <span className="text-xs font-bold">Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Error Alert */}
        {isError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm">
            {(error as any)?.message || "Failed to load visitor tracking data from Supabase."}
          </div>
        )}

        {/* KPI Summary Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* 1. Online Now */}
          <div className="col-span-1 rounded-2xl p-5 bg-gradient-to-br from-emerald-500/10 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/60 dark:border-emerald-800/50 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
                Live Active
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {data?.onlineNow ?? 0}
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-1 font-medium">In the last 5 minutes</div>
          </div>

          {/* 2. Total Visitors */}
          <div className="col-span-1 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Unique Visitors
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#0B3D5E]/10 dark:bg-white/10 flex items-center justify-center text-[#0B3D5E] dark:text-[#F5A623]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {summary.visitors.toLocaleString()}
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-1 font-medium flex items-center gap-1.5">
              <span className="text-[#F5A623] font-bold">{summary.newVisitors} new</span>
              <span>•</span>
              <span className="text-slate-600 dark:text-slate-400">{summary.returningVisitors} return</span>
            </div>
          </div>

          {/* 3. Total Page Views */}
          <div className="col-span-1 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Page Views
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {summary.pageViews.toLocaleString()}
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-1 font-medium">
              {summary.pagesPerSession} views / session
            </div>
          </div>

          {/* 4. Total Sessions */}
          <div className="col-span-1 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Total Sessions
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-3xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {summary.sessions.toLocaleString()}
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Visitor visits</div>
          </div>

          {/* 5. Returning Rate */}
          <div className="col-span-1 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Returning %
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <RotateCcw className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {returningRate}%
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Guest loyalty index</div>
          </div>

          {/* 6. Avg. Engaged Time */}
          <div className="col-span-1 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Avg. Duration
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {formatEngagement(summary.avgEngagedSeconds)}
              </div>
            )}
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Active tab reading</div>
          </div>
        </div>

        {/* Interactive Traffic Plot Section */}
        <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F5A623]" />
                <h2 className="text-xl font-serif font-bold text-[#0B3D5E] dark:text-white">
                  {period === "today" ? "Today's Hourly Traffic Breakdown" : "Visitor & Page View Trends"}
                </h2>
              </div>
            </div>

            {/* Chart toggle filters */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setChartView("all")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartView === "all"
                  ? "bg-[#0B3D5E] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Combined
              </button>
              <button
                onClick={() => setChartView("visitors")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartView === "visitors"
                  ? "bg-[#F5A623] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Visitors
              </button>
              <button
                onClick={() => setChartView("views")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${chartView === "views"
                  ? "bg-[#4BBCCC] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Page Views
              </button>
            </div>
          </div>

          <div className="h-[320px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : !data?.daily || data.daily.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No visitor traffic recorded yet for this period.
              </div>
            ) : period === "today" ? (
              /* Bar Chart for Today */
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartLabel}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  {(chartView === "all" || chartView === "views") && (
                    <Bar
                      dataKey="pageViews"
                      name="Page Views"
                      fill="#4BBCCC"
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {(chartView === "all" || chartView === "visitors") && (
                    <Bar
                      dataKey="visitors"
                      name="Unique Visitors"
                      fill="#F5A623"
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              /* Area Chart for Multi-Day Periods */
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5A623" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F5A623" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4BBCCC" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4BBCCC" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartLabel}
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  {(chartView === "all" || chartView === "views") && (
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      name="Page Views"
                      stroke="#4BBCCC"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#viewsGradient)"
                    />
                  )}
                  {(chartView === "all" || chartView === "visitors") && (
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      name="Unique Visitors"
                      stroke="#F5A623"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#visitorGradient)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* High-Intent Conversion Events Section */}
        <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-[#F5A623]" />
              <h2 className="text-xl font-serif font-bold text-[#0B3D5E] dark:text-white">
                High-Intent Guest Conversions
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Automatic click & lead tracking</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {/* Booking Clicks */}
            <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <BookmarkCheck className="w-4 h-4" /> Book Now Clicks
              </div>
              <div className="text-2xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {bookingClicks.count}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {bookingClicks.visitors} guests ({bookingClicks.rate}%)
              </div>
            </div>

            {/* WhatsApp Inquiries */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <MessageCircle className="w-4 h-4" /> WhatsApp Chats
              </div>
              <div className="text-2xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {whatsappClicks.count}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {whatsappClicks.visitors} guests ({whatsappClicks.rate}%)
              </div>
            </div>

            {/* Email Inquiries */}
            <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/20">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Mail className="w-4 h-4" /> Email Inquiries
              </div>
              <div className="text-2xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {emailClicks.count}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {emailClicks.visitors} guests ({emailClicks.rate}%)
              </div>
            </div>

            {/* Cookie Consents Accepted & Rejected */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-[#F5A623]" /> Cookie Consents
              </div>
              <div className="text-2xl font-serif font-black text-[#0B3D5E] dark:text-white">
                {totalCookieDecisions}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                {cookieConsents.count} accepted • {cookieRejections.count} rejected ({cookieRate}%)
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Tabs Section */}
        <div className="rounded-3xl p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#F5A623]" />
              <h2 className="text-xl font-serif font-bold text-[#0B3D5E] dark:text-white">
                Traffic & Audience Breakdowns
              </h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setActiveTab("pages")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "pages"
                  ? "bg-[#0B3D5E] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Top Pages
              </button>
              <button
                onClick={() => setActiveTab("visitors")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "visitors"
                  ? "bg-[#0B3D5E] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Visitors</span>
              </button>
              <button
                onClick={() => setActiveTab("sources")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "sources"
                  ? "bg-[#0B3D5E] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Sources & Mediums
              </button>
              <button
                onClick={() => setActiveTab("geo")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "geo"
                  ? "bg-[#0B3D5E] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Guest Origins
              </button>
              <button
                onClick={() => setActiveTab("devices")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === "devices"
                  ? "bg-[#0B3D5E] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
              >
                Devices & Tech
              </button>
            </div>
          </div>

          {/* TAB 1: Top Pages */}
          {activeTab === "pages" && (
            <div className="space-y-3">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : !data?.topPages || data.topPages.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">No page view data yet.</div>
              ) : (
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto max-h-[540px] scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100/50 dark:[&::-webkit-scrollbar-track]:bg-slate-800/40 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 hover:[&::-webkit-scrollbar-thumb]:bg-[#F5A623] [&::-webkit-scrollbar-thumb]:rounded-full">
                    <table className="w-full text-left text-sm relative border-collapse">
                      <thead className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
                        <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-bold">
                          <th className="py-3 px-3.5 font-semibold bg-white/95 dark:bg-slate-900/95">Page URL / Path</th>
                          <th className="py-3 px-3.5 font-semibold text-right bg-white/95 dark:bg-slate-900/95">Unique Visitors</th>
                          <th className="py-3 px-3.5 font-semibold text-right bg-white/95 dark:bg-slate-900/95">Total Views</th>
                          <th className="py-3 px-3.5 font-semibold text-right bg-white/95 dark:bg-slate-900/95">Avg. Time on Page</th>
                          <th className="py-3 px-3.5 font-semibold text-right bg-white/95 dark:bg-slate-900/95">Last Visit Time</th>
                          <th className="py-3 px-3.5 font-semibold text-right w-36 bg-white/95 dark:bg-slate-900/95">Share of Views</th>
                          <th className="py-3 px-3.5 font-semibold text-center w-12 bg-white/95 dark:bg-slate-900/95">Log</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.topPages.map((row, i) => {
                          const pct = summary.pageViews > 0 ? Math.round((row.views / summary.pageViews) * 100) : 0;
                          const isExpanded = expandedPage === row.label;
                          const pageInfo = getPageDisplayInfo(row.label, row.title, row.category, roomsList, blogsList, servicesList);
                          return (
                            <Fragment key={i}>
                              <tr
                                onClick={() => setExpandedPage(isExpanded ? null : row.label)}
                                className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group ${isExpanded ? "bg-amber-50/30 dark:bg-amber-950/10" : ""
                                  }`}
                              >
                                <td className="py-3.5 px-3.5 pr-4 text-xs font-medium text-[#0B3D5E] dark:text-slate-200">
                                  <div className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-[11px] text-slate-600 dark:text-slate-400 font-bold shrink-0 mt-0.5 shadow-2xs">
                                      {i + 1}
                                    </span>
                                    <div className={`w-8 h-8 rounded-xl ${pageInfo.iconBg} flex items-center justify-center shrink-0 border ${pageInfo.iconBorder} shadow-2xs mt-0.5`}>
                                      <pageInfo.Icon className={`w-4 h-4 ${pageInfo.iconColor}`} />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-serif font-bold text-[#0B3D5E] dark:text-white group-hover:text-[#D97706] dark:group-hover:text-[#FBBF24] transition-colors leading-tight">
                                          {pageInfo.title}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${pageInfo.badgeStyle}`}>
                                          {pageInfo.badge}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-1">
                                        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                                          {row.label === "" || row.label === "/" ? "/" : row.label}
                                        </span>
                                        <a
                                          href={row.label.startsWith("/") ? row.label : `/${row.label}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="text-slate-400 hover:text-[#0B3D5E] dark:hover:text-[#FBBF24] p-0.5 transition-colors"
                                          title="Open page in new tab"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 text-right font-serif font-bold text-slate-700 dark:text-slate-300">
                                  {row.visitors.toLocaleString()}
                                </td>
                                <td className="py-3 px-3.5 text-right font-serif font-black text-[#0B3D5E] dark:text-white">
                                  {row.views.toLocaleString()}
                                </td>
                                <td className="py-3 px-3.5 text-right">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/50 dark:border-indigo-800/40">
                                    <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                                    <span>{formatPageDuration(row.avgDurationSeconds)}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 text-right">
                                  <div
                                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium cursor-help"
                                    title={row.lastVisitedAt ? new Date(row.lastVisitedAt).toLocaleString() : undefined}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                                    <span>{formatRelativeVisitTime(row.lastVisitedAt)}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <div className="w-20 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#F5A623] to-[#EE5A24]"
                                        style={{ width: `${Math.min(100, Math.max(3, pct))}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-slate-500 w-8">{pct}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3.5 text-center">
                                  <div className="p-1 rounded-md text-slate-400 group-hover:text-[#0B3D5E] dark:group-hover:text-white transition-all inline-flex items-center justify-center">
                                    <ChevronDown
                                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#F5A623]" : ""
                                        }`}
                                    />
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-slate-50/60 dark:bg-slate-800/30">
                                  <td colSpan={7} className="p-3.5 px-6">
                                    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs space-y-3">
                                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                          <History className="w-4 h-4 text-[#F5A623]" />
                                          <span className="text-xs font-bold text-[#0B3D5E] dark:text-white">
                                            Individual Visit Times for <span className="font-serif font-bold text-[#0B3D5E] dark:text-white">{pageInfo.title}</span> <span className="font-mono text-[11px] text-[#D97706] bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded ml-1">({row.label})</span>
                                          </span>
                                        </div>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                          Avg. Time: <strong className="text-slate-700 dark:text-slate-200">{formatPageDuration(row.avgDurationSeconds)}</strong>
                                        </span>
                                      </div>
                                      {(!row.recentVisits || row.recentVisits.length === 0) ? (
                                        <div className="text-xs text-slate-500 py-1">
                                          {row.lastVisitedAt
                                            ? `Last visited at ${new Date(row.lastVisitedAt).toLocaleTimeString()} (${formatRelativeVisitTime(row.lastVisitedAt)}). Additional granular intervals update in real time.`
                                            : "No individual visit timestamps logged yet for this path."}
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                          {row.recentVisits.map((v, vIdx) => (
                                            <div
                                              key={vIdx}
                                              className="flex items-center justify-between p-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                                            >
                                              <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                <span className="font-mono font-bold text-[#0B3D5E] dark:text-white">
                                                  {formatExactTime(v.occurredAt || v.time)}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                                <span>{formatRelativeVisitTime(v.time)}</span>
                                                <span>•</span>
                                                <span className="capitalize">{v.deviceType || "desktop"}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Vertical Scroll Info Footer */}
                  <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-400 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      Showing {data.topPages.length} active pages
                    </span>
                    <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                      <span>↕ Smooth vertical scroll enabled</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Visitors (Granular Individual Visitor Log) */}
          {activeTab === "visitors" && (
            <div className="space-y-4">
              {/* Header with Search and Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Logged Visitor Sessions
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0B3D5E]/10 dark:bg-white/10 text-[#0B3D5E] dark:text-white font-mono text-xs font-bold">
                    {data?.visitorsList?.length || 0}
                  </span>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={visitorSearch}
                    onChange={(e) => setVisitorSearch(e.target.value)}
                    placeholder="Search IP, Country, Browser, OS..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5A623]/40"
                  />
                  {visitorSearch && (
                    <button
                      onClick={() => setVisitorSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : !data?.visitorsList || data.visitorsList.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm space-y-1">
                  <p className="font-semibold text-slate-600 dark:text-slate-300">No visitor sessions recorded yet.</p>
                  <p className="text-xs text-slate-400">Visitor activity updates smoothly from Supabase PostgreSQL.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto max-h-[560px] scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100/50 dark:[&::-webkit-scrollbar-track]:bg-slate-800/40 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 hover:[&::-webkit-scrollbar-thumb]:bg-[#F5A623] [&::-webkit-scrollbar-thumb]:rounded-full">
                    <table className="w-full text-left text-sm relative border-collapse">
                      <thead className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs">
                        <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-bold">
                          <th
                            onClick={() => setVisitorSortOrder(visitorSortOrder === "desc" ? "asc" : "desc")}
                            className="py-3 px-3 font-semibold text-center w-24 cursor-pointer select-none hover:text-[#0B3D5E] dark:hover:text-white transition-colors bg-white/95 dark:bg-slate-900/95"
                            title="Click to toggle Newest or Oldest first"
                          >
                            <div className="inline-flex items-center justify-center gap-1">
                              <span>#</span>
                              <span className="text-[10px] text-[#F5A623]">
                                {visitorSortOrder === "desc" ? "↓" : "↑"}
                              </span>
                            </div>
                          </th>
                          <th className="py-3 px-3 font-semibold bg-white/95 dark:bg-slate-900/95">IP Address</th>
                          <th className="py-3 px-3 font-semibold bg-white/95 dark:bg-slate-900/95">Country</th>
                          <th className="py-3 px-3 font-semibold bg-white/95 dark:bg-slate-900/95">Date</th>
                          <th className="py-3 px-3 font-semibold bg-white/95 dark:bg-slate-900/95">Time</th>
                          <th className="py-3 px-3 font-semibold text-right bg-white/95 dark:bg-slate-900/95">Time Spent</th>
                          <th className="py-3 px-3 font-semibold text-center bg-white/95 dark:bg-slate-900/95">Browser</th>
                          <th className="py-3 px-3 font-semibold text-center bg-white/95 dark:bg-slate-900/95">Operating System</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(() => {
                          const filtered = (data?.visitorsList || [])
                            .filter((v) => {
                              if (!visitorSearch.trim()) return true;
                              const q = visitorSearch.toLowerCase();
                              const c = getCountryDetails(v.country).name.toLowerCase();
                              const ip = formatVisitorIp(v.ip).toLowerCase();
                              const browser = (v.browser || "").toLowerCase();
                              const os = (v.os || "").toLowerCase();
                              return c.includes(q) || ip.includes(q) || browser.includes(q) || os.includes(q);
                            })
                            .sort((a, b) => (visitorSortOrder === "asc" ? a.id - b.id : b.id - a.id));

                          return filtered.map((row, idx) => {
                            const country = getCountryDetails(row.country);
                            const ipDisplay = formatVisitorIp(row.ip);
                            const dateDisplay = formatVisitorDate(row.firstSeenAt);
                            const timeDisplay = formatVisitorTime(row.firstSeenAt);
                            const durationDisplay = formatVisitorDuration(row.durationMs);
                            const maxVisitorId = Math.max(0, ...(data?.visitorsList?.map((v) => Number(v.id)) || [0]));
                            const isLatest = Number(row.id) === maxVisitorId;

                            return (
                              <tr
                                key={row.sessionId || idx}
                                className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group ${isLatest ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                                  }`}
                              >
                                {/* 1. Count */}
                                <td className="py-3 px-3 text-center">
                                  <div className="inline-flex items-center justify-center gap-1.5">
                                    <span className="min-w-7 h-6 px-1.5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] text-[#0B3D5E] dark:text-slate-200 font-mono font-bold">
                                      {row.id}
                                    </span>
                                    {isLatest && (
                                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20 shrink-0">
                                        New
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* 2. IP Address */}
                                <td className="py-3 px-3">
                                  <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#0B3D5E] dark:text-slate-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>{ipDisplay}</span>
                                  </div>
                                </td>

                                {/* 3. Country */}
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base leading-none">{country.flag}</span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                                      {country.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                                      {country.code}
                                    </span>
                                  </div>
                                </td>

                                {/* 4. Date */}
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{dateDisplay}</span>
                                  </div>
                                </td>

                                {/* 5. Time */}
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 dark:text-slate-200 font-bold">
                                    <Clock className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                                    <span>{timeDisplay}</span>
                                  </div>
                                </td>

                                {/* 6. Time Spent */}
                                <td className="py-3 px-3 text-right">
                                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/40 bg-indigo-50/80 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-mono">
                                    <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                                    <span>{durationDisplay}</span>
                                  </div>
                                </td>

                                {/* 7. Browser Type */}
                                <td className="py-3 px-3 text-center">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {row.browser || "Other"}
                                  </span>
                                </td>

                                {/* 8. Operating System Type */}
                                <td className="py-3 px-3 text-center">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    {row.os || "Other"}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                  {/* Vertical Scroll Info Footer */}
                  <div className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-400 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      Showing {data?.visitorsList?.length || 0} logged visitor sessions
                    </span>
                    <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                      <span>↕ Smooth vertical scroll enabled</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Sources & Mediums */}
          {activeTab === "sources" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Traffic Sources */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#F5A623]" /> Acquisition Sources
                </h3>
                {!data?.sources || data.sources.length === 0 ? (
                  <div className="py-6 text-slate-400 text-xs">No referral or campaign sources yet.</div>
                ) : (
                  <div className="space-y-2">
                    {data.sources.map((row, i) => {
                      const pct = summary.visitors > 0 ? Math.round((row.visitors / summary.visitors) * 100) : 0;
                      return (
                        <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 shadow-xs">
                              {i + 1}
                            </span>
                            <span className="font-medium text-sm text-[#0B3D5E] dark:text-white capitalize">
                              {row.label === "" ? "Direct / None" : row.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-serif font-black text-slate-700 dark:text-slate-300">
                              {row.visitors} visitors
                            </span>
                            <span className="text-xs font-mono text-slate-400">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mediums */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-[#4BBCCC]" /> Channels & Mediums
                </h3>
                {!data?.mediums || data.mediums.length === 0 ? (
                  <div className="py-6 text-slate-400 text-xs">No mediums recorded yet.</div>
                ) : (
                  <div className="space-y-2">
                    {data.mediums.map((row, i) => {
                      const pct = summary.visitors > 0 ? Math.round((row.visitors / summary.visitors) * 100) : 0;
                      return (
                        <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 shadow-xs">
                              {i + 1}
                            </span>
                            <span className="font-medium text-sm text-[#0B3D5E] dark:text-white capitalize">
                              {row.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-serif font-black text-slate-700 dark:text-slate-300">
                              {row.visitors} visitors
                            </span>
                            <span className="text-xs font-mono text-slate-400">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Guest Origins (Countries) */}
          {activeTab === "geo" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" /> Geographic Guest Origins
                </h3>
                <span className="text-xs text-slate-400 font-medium">Accurate country resolution via CDN edge, timezone & browser locale</span>
              </div>
              {!data?.countries || data.countries.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No country records found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {data.countries.map((row, i) => {
                    const { name, flag, code } = getCountryDetails(row.label);
                    const pct = summary.visitors > 0 ? Math.round((row.visitors / summary.visitors) * 100) : 0;
                    return (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-[#F5A623]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl shadow-xs border border-slate-200/60 dark:border-slate-600/50">
                            {flag}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#0B3D5E] dark:text-white flex items-center gap-1.5">
                              <span>{name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold uppercase">
                                {code}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{row.views} views recorded</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-serif font-black text-lg text-[#0B3D5E] dark:text-white">
                            {row.visitors}
                          </div>
                          <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">{pct}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Devices & Tech */}
          {activeTab === "devices" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Devices */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#F5A623]" /> Device Category
                </h4>
                {data?.devices?.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 last:border-0">
                    <span className="text-sm font-medium capitalize text-[#0B3D5E] dark:text-white">
                      {d.label}
                    </span>
                    <span className="text-sm font-serif font-black text-[#0B3D5E] dark:text-white">
                      {d.visitors}
                    </span>
                  </div>
                ))}
              </div>

              {/* Browsers */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#4BBCCC]" /> Browsers
                </h4>
                {data?.browsers?.map((b, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 last:border-0">
                    <span className="text-sm font-medium text-[#0B3D5E] dark:text-white">
                      {b.label}
                    </span>
                    <span className="text-sm font-serif font-black text-[#0B3D5E] dark:text-white">
                      {b.visitors}
                    </span>
                  </div>
                ))}
              </div>

              {/* Operating Systems */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-purple-500" /> Operating Systems
                </h4>
                {data?.operatingSystems?.map((o, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200/60 dark:border-slate-700/60 last:border-0">
                    <span className="text-sm font-medium text-[#0B3D5E] dark:text-white">
                      {o.label}
                    </span>
                    <span className="text-sm font-serif font-black text-[#0B3D5E] dark:text-white">
                      {o.visitors}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
