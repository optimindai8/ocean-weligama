import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdminLogout, useAdminGetMe, getAdminGetMeQueryKey, useAdminGetNotificationCounts, getAdminGetNotificationCountsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { TransparentLogo } from "./transparent-logo";
import {
  LayoutDashboard,
  Calendar,
  BedDouble,
  Sparkles,
  Star,
  MessageSquare,
  Tag,
  LogOut,
  ImageIcon,
  BookOpen,
  Plane,
} from "lucide-react";

const NAV = [
  { href: "/ow-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ow-admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/ow-admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/ow-admin/packages", label: "Packages", icon: Sparkles },
  { href: "/ow-admin/addons", label: "Experiences", icon: Tag },
  { href: "/ow-admin/reviews", label: "Reviews", icon: Star },
  { href: "/ow-admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/ow-admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/ow-admin/blogs", label: "Blogs", icon: BookOpen },
  { href: "/ow-admin/airport", label: "Airport", icon: Plane },
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
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B3D5E] text-white flex flex-col fixed left-0 top-0 h-full z-40 shadow-xl shadow-[#0B3D5E]/20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <TransparentLogo 
              src="/logo.jpg" 
              className="w-10 h-10 object-contain brightness-0 invert opacity-90" 
            />
            <div>
              <p className="font-bold text-white text-sm tracking-widest uppercase">OCEAN AIR</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV.map((item) => {
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
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-white/15 text-white shadow-sm scale-[1.02]"
                      : "text-white/60 hover:bg-white/5 hover:text-white hover:scale-[1.01]"
                  }`}
                  data-testid={`nav-admin-${item.label.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${active ? "scale-110 text-sky-300" : ""}`} />
                    {item.label}
                  </div>
                  {badgeCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                      {badgeCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-4 h-4" /> Sign Out
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
