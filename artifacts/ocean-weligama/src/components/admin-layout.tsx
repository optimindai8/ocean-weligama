import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdminLogout, useAdminGetMe, getAdminGetMeQueryKey, useAdminGetNotificationCounts, getAdminGetNotificationCountsQueryKey } from "@workspace/api-client-react";
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  Package,
  Layers,
  Megaphone,
  Star,
  MessageSquare,
  Tag,
  LogOut,
  ImageIcon,
  BookOpen,
  Plane,
  Users,
  HelpCircle,
  TrendingDown,
  ExternalLink,
  Settings,
  Activity,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Operations",
    items: [
      { href: "/ow-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/ow-admin/visitors", label: "Visitors", icon: Activity },
      { href: "/ow-admin/bookings", label: "Bookings", icon: Calendar },
      { href: "/ow-admin/guests", label: "Guest Details", icon: Users },
    ],
  },
  {
    title: "Sanctuary & Pricing",
    items: [
      { href: "/ow-admin/rooms", label: "Rooms", icon: BedDouble },
      { href: "/ow-admin/packages", label: "Packages", icon: Package },
      { href: "/ow-admin/matrix-pricing", label: "Matrix Pricing", icon: Layers },
      { href: "/ow-admin/addons", label: "Experiences", icon: Tag },
      { href: "/ow-admin/rate-adjustments", label: "Rate Adjustment", icon: TrendingDown },
    ],
  },
  {
    title: "Guest Relations",
    items: [
      { href: "/ow-admin/reviews", label: "Reviews", icon: Star },
      { href: "/ow-admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/ow-admin/offer-ads", label: "Offer Ads", icon: Megaphone },
    ],
  },
  {
    title: "Content & Logistics",
    items: [
      { href: "/ow-admin/gallery", label: "Gallery", icon: ImageIcon },
      { href: "/ow-admin/blogs", label: "Blogs", icon: BookOpen },
      { href: "/ow-admin/airport", label: "Airport", icon: Plane },
      { href: "/ow-admin/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    title: "System & Config",
    items: [
      { href: "/ow-admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const adminLogout = useAdminLogout();

  const { isError, error } = useAdminGetMe({
    query: {
      queryKey: getAdminGetMeQueryKey(),
      retry: false,
    },
  });

  const { data: notifications } = useAdminGetNotificationCounts({
    query: {
      queryKey: getAdminGetNotificationCountsQueryKey(),
      refetchInterval: 30000,
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("ow-admin-token");
    if (!token || (isError && (error as any)?.status === 401)) {
      localStorage.removeItem("ow-admin-token");
      setLocation("/ow-admin");
    }
  }, [setLocation, isError, error]);

  function handleLogout() {
    adminLogout.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("ow-admin-token");
        setLocation("/ow-admin");
      },
    });
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Executive Sidebar */}
      <aside 
        className="w-64 text-white flex flex-col fixed left-0 top-0 h-full z-40 border-r border-white/10 shadow-[8px_0_30px_rgba(7,30,46,0.35)]"
        style={{
          background: "linear-gradient(180deg, #071E2E 0%, #0B3D5E 40%, #061B29 100%)",
        }}
      >
        {/* Subtle top golden accent hairline */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-80 pointer-events-none" />

        {/* Sidebar Header: Brand Medallion & Live Indicator */}
        <div className="p-5 pb-5 border-b border-white/10 relative overflow-hidden shrink-0">
          {/* Ambient soft glow */}
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#FBBF24]/12 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3.5 relative z-10">
            {/* Circular Medallion */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-b from-[#FBBF24] via-[#F59E0B]/70 to-[#FBBF24]/30 shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
                <div className="w-full h-full rounded-full bg-[#FAF9F6] p-0.5 flex items-center justify-center overflow-hidden">
                  <img 
                    src="/images/logo.jpg" 
                    alt="Ocean Air Sanctuary" 
                    className="w-full h-full object-contain rounded-full" 
                  />
                </div>
              </div>
            </div>

            {/* Brand Title & Live Status */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1.5">
                <p className="font-serif font-black text-white text-[13px] tracking-[0.18em] uppercase truncate">
                  OCEAN AIR
                </p>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[10px] text-[#FBBF24] uppercase tracking-[0.22em] font-extrabold mt-0.5">
                Management Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto hide-scrollbar">
          {NAV_SECTIONS.map((section, secIdx) => (
            <div key={secIdx} className="space-y-1">
              {/* Category Section Header */}
              <div className="px-3 pt-1 pb-1 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#FBBF24]/75">
                  {section.title}
                </span>
                <span className="w-8 h-px bg-white/10" />
              </div>

              {/* Category Links */}
              {section.items.map((item) => {
                const active = location === item.href || location.startsWith(item.href + "/");
                let badgeCount = 0;
                if (notifications) {
                  if (item.label === "Bookings") badgeCount = notifications.bookings || 0;
                  if (item.label === "Reviews") badgeCount = notifications.reviews || 0;
                  if (item.label === "Messages") badgeCount = notifications.messages || 0;
                  if (item.label === "Gallery") badgeCount = notifications.gallery || 0;
                }

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border-l-[3.5px] ${
                        active
                          ? "bg-gradient-to-r from-[#FBBF24]/20 via-[#FBBF24]/08 to-transparent text-white border-[#FBBF24] shadow-[0_2px_12px_rgba(251,191,36,0.12)] font-extrabold"
                          : "border-transparent text-white/70 hover:bg-white/8 hover:text-white hover:border-[#FBBF24]/40 hover:translate-x-0.5"
                      }`}
                      data-testid={`nav-admin-${item.label.toLowerCase()}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <item.icon 
                          className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                            active 
                              ? "text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.7)] scale-110" 
                              : "text-white/55 group-hover:text-[#FBBF24] group-hover:scale-105"
                          }`} 
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Notification Count Badge - Warm Gold Brand Pill */}
                      {badgeCount > 0 && (
                        <span className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] text-[#071E2E] text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-[0_2px_8px_rgba(251,191,36,0.45)] shrink-0">
                          {badgeCount}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: View Site Shortcut & Sign Out */}
        <div className="p-3 border-t border-white/10 bg-black/20 shrink-0 space-y-1">
          {/* Quick link to view public site */}
          <Link href="/" target="_blank">
            <div className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-[#FBBF24] hover:bg-white/8 transition-all duration-200 cursor-pointer group border border-transparent hover:border-[#FBBF24]/20">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#FBBF24] group-hover:scale-110 transition-transform" />
                <span>Live Website</span>
              </div>
              <span className="text-[10px] text-white/40 group-hover:text-[#FBBF24] font-medium">Guest View ↗</span>
            </div>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-white/70 hover:text-rose-300 hover:bg-rose-500/15 border border-transparent hover:border-rose-500/25 transition-all duration-200 w-full cursor-pointer group"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-3.5 h-3.5 text-white/50 group-hover:text-rose-300 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}