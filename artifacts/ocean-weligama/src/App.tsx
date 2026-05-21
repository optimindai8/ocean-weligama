import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import RoomsPage from "@/pages/rooms";
import RoomDetailPage from "@/pages/room-detail";
import PackagesPage from "@/pages/packages";
import PackageDetailPage from "@/pages/package-detail";
import GalleryPage from "@/pages/gallery";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import BookingPage from "@/pages/booking";
import BookingConfirmationPage from "@/pages/booking-confirmation";
import FAQPage from "@/pages/faq";
import BlogPage from "@/pages/blog";
import BlogDetailPage from "@/pages/blog-detail";
import NotFound from "@/pages/not-found";

import AdminLoginPage from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBookings from "@/pages/admin/bookings";
import AdminRooms from "@/pages/admin/rooms";
import AdminPackages from "@/pages/admin/packages";
import AdminAddons from "@/pages/admin/addons";
import AdminReviews from "@/pages/admin/reviews";
import AdminMessages from "@/pages/admin/messages";
import AdminPricing from "@/pages/admin/pricing";
import AdminGallery from "@/pages/admin/gallery";
import AdminBlogs from "@/pages/admin/blogs";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useLocation } from "wouter";
import { LanguageProvider } from "@/components/LanguageContext";

function App() {
  const [location] = useLocation();
  const isAdminPage = location.startsWith("/ow-admin");

  // Instant scroll to top on every route change to prevent janky layout shifts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
          {!isAdminPage && <Navbar />}
          <div className="flex-1">
            <Switch>
              {/* Public routes */}
              <Route path="/" component={Home} />
              <Route path="/rooms" component={RoomsPage} />
              <Route path="/rooms/:slug" component={RoomDetailPage} />
              <Route path="/packages" component={PackagesPage} />
              <Route path="/packages/:slug" component={PackageDetailPage} />
              <Route path="/gallery" component={GalleryPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/book" component={BookingPage} />
              <Route path="/book/confirmation" component={BookingConfirmationPage} />
              <Route path="/faq" component={FAQPage} />
              <Route path="/blog" component={BlogPage} />
              <Route path="/blog/:id" component={BlogDetailPage} />

              {/* Admin routes */}
              <Route path="/ow-admin" component={AdminLoginPage} />
              <Route path="/ow-admin/dashboard" component={AdminDashboard} />
              <Route path="/ow-admin/bookings" component={AdminBookings} />
              <Route path="/ow-admin/rooms" component={AdminRooms} />
              <Route path="/ow-admin/packages" component={AdminPackages} />
              <Route path="/ow-admin/addons" component={AdminAddons} />
              <Route path="/ow-admin/reviews" component={AdminReviews} />
              <Route path="/ow-admin/messages" component={AdminMessages} />
              <Route path="/ow-admin/pricing" component={AdminPricing} />
              <Route path="/ow-admin/gallery" component={AdminGallery} />
              <Route path="/ow-admin/blogs" component={AdminBlogs} />

              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
        <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
