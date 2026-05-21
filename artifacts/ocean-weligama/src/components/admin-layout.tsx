import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdminLogout, useAdminGetMe, getAdminGetMeQueryKey } from "@workspace/api-client-react";
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
} from "lucide-react";

const NAV = [
  { href: "/ow-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ow-admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/ow-admin/rooms", label: "Rooms", icon: BedDouble },
  { href: "/ow-admin/packages", label: "Packages", icon: Sparkles },
  { href: "/ow-admin/addons", label: "Experiences", icon: Tag },
  { href: "/ow-admin/reviews", label: "Reviews", icon: Star },
  { href: "/ow-admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/ow-admin/pricing", label: "Pricing", icon: Star },
  { href: "/ow-admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/ow-admin/blogs", label: "Blogs", icon: BookOpen },
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
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <TransparentLogo 
              src="/logo.jpg" 
              className="w-10 h-10 object-contain brightness-0 invert" 
            />
            <div>
              <p className="font-bold text-white text-sm tracking-wide">OCEAN AIR</p>
              <p className="text-xs text-white/50">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const active = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`nav-admin-${item.label.toLowerCase()}`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/10 hover:text-white transition-all w-full"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
