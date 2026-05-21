import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGetBookingByReference, getGetBookingByReferenceQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Check, MessageCircle, Calendar, Users, ArrowRight } from "lucide-react";

export default function BookingConfirmationPage() {
  const [location] = useLocation();
  const ref = new URLSearchParams(window.location.search).get("ref") ?? "";

  const { data: booking, isLoading } = useGetBookingByReference(ref, {
    query: {
      enabled: !!ref,
      queryKey: getGetBookingByReferenceQueryKey(ref),
    },
  });

  if (!ref) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No booking reference found.</p>
          <Link href="/book"><Button>Start a new booking</Button></Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md w-full px-4">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col pt-24">
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full"
        >
          {/* Success icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">You're booked!</h1>
            <p className="text-muted-foreground">A confirmation email is on its way to you.</p>
          </div>

          {/* Booking details */}
          {booking && (
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground">Booking Reference</h2>
                <span className="font-mono font-bold text-primary text-lg bg-primary/10 px-3 py-1 rounded-lg" data-testid="text-booking-reference">
                  {booking.reference}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-medium">{booking.checkIn}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium">{booking.checkOut}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-medium">{booking.guestCount}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${booking.totalAmount} {booking.currency}</span>
                </div>
              </div>
            </div>
          )}

          {/* What to bring */}
          <div className="bg-accent/10 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-foreground mb-3">What to Pack</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Reef-safe sunscreen",
                "Light cotton clothes for the evenings",
                "USD cash for local markets and tips",
                "Flip flops (you'll barely take them off)",
                "An open mind and a hungry stomach",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-accent">→</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full py-3 text-sm font-medium transition-colors"
              data-testid="link-whatsapp-confirm"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Us
            </a>
            <Link href="/">
              <Button variant="outline" className="w-full rounded-full" data-testid="button-home-confirm">
                Back to Home <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
