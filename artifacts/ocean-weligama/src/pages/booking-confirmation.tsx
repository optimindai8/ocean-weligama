import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGetBookingByReference, getGetBookingByReferenceQueryKey, useListRooms, useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Check, MessageCircle, Calendar, Users, ArrowRight, Home, Plane, MessageSquare, CreditCard, Award, Sparkles, Clock } from "lucide-react";

function parseSpecialRequests(text: string) {
  if (!text) return { pickup: null, drop: null, message: "" };
  let pickup: any = null;
  let drop: any = null;
  const lines = text.split("\n");
  const remainingLines: string[] = [];
  
  let inPickupSection = false;
  let inDropSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("[Airport Pick-up:")) {
      inPickupSection = true;
      inDropSection = false;
      const priceMatch = line.match(/€(\d+(\.\d+)?)/);
      const price = priceMatch ? priceMatch[1] : "0";
      pickup = { price, flightNumber: "", flightDate: "", flightTime: "", bringingSurfboard: "No" };
      continue;
    }
    
    if (line.startsWith("[Airport Drop:")) {
      inPickupSection = false;
      inDropSection = true;
      const priceMatch = line.match(/€(\d+(\.\d+)?)/);
      const price = priceMatch ? priceMatch[1] : "0";
      drop = { price };
      continue;
    }
    
    if (inPickupSection) {
      if (line.startsWith("Flight:")) {
        const match = line.match(/Flight:\s*([^,]+),\s*Date:\s*([^,]+),\s*Time:\s*(.+)/);
        if (match) {
          pickup.flightNumber = match[1].trim();
          pickup.flightDate = match[2].trim();
          pickup.flightTime = match[3].trim();
        }
        continue;
      } else if (line.startsWith("Surfboard:")) {
        const match = line.match(/Surfboard:\s*(.+)/);
        if (match) {
          pickup.bringingSurfboard = match[1].trim();
        }
        continue;
      } else {
        inPickupSection = false;
      }
    }
    
    if (inDropSection) {
      inDropSection = false;
    }
    
    if (!inPickupSection && !inDropSection) {
      if (line !== "" || (remainingLines.length > 0 && remainingLines[remainingLines.length - 1] !== "")) {
        remainingLines.push(lines[i]);
      }
    }
  }
  
  return { pickup, drop, message: remainingLines.join("\n").trim() };
}


export default function BookingConfirmationPage() {
  const [location] = useLocation();
  const ref = new URLSearchParams(window.location.search).get("ref") ?? "";

  const { data: booking, isLoading } = useGetBookingByReference(ref, {
    query: {
      enabled: !!ref,
      queryKey: getGetBookingByReferenceQueryKey(ref),
    },
  });

  const { data: roomsResponse } = useListRooms();
  const { data: servicesResponse } = useListServices();
  const roomsList = roomsResponse as any[] | undefined;
  const servicesList = servicesResponse as any[] | undefined;
  const [expandedPkgs, setExpandedPkgs] = useState<Record<string, boolean>>({});

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
            <div className="bg-white rounded-[2.5rem] border border-border shadow-xl p-6 md:p-10 mb-8">
              <div className="flex items-center justify-between pb-6 border-b border-border/50 mb-8">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-2">Booking Reference</h2>
                  <span className="font-mono font-bold text-primary text-2xl" data-testid="text-booking-reference">
                    {booking.reference}
                  </span>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm">
                  Confirmed
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Check-in</span>
                  </div>
                  <span className="font-bold text-foreground text-lg">{booking.checkIn}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Check-out</span>
                  </div>
                  <span className="font-bold text-foreground text-lg">{booking.checkOut}</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Guests</span>
                </div>
                <span className="font-bold text-foreground text-lg">{booking.guestCount} {booking.guestCount === 1 ? 'Guest' : 'Guests'}</span>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-sm">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-6">
                  Payment Summary
                </h3>
                <div className="space-y-4 pb-6 border-b border-border text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Room{booking.nights ? ` (${booking.nights} nights)` : ''}</span>
                    <span className="font-bold text-foreground text-base">
                      €{booking.roomSubtotal || "0.00"}
                    </span>
                  </div>
                  {parseFloat(booking.cleaningFee || "0") > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Cleaning Fee</span>
                      <span className="font-bold text-foreground text-base">€{booking.cleaningFee}</span>
                    </div>
                  )}
                  {parseFloat(booking.servicesSubtotal || "0") > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Add-ons & Packages</span>
                      <span className="font-bold text-foreground text-base">€{booking.servicesSubtotal}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="font-bold text-lg text-foreground">Total</span>
                  <span className="font-black text-4xl text-primary">€{booking.totalAmount} <span className="text-sm text-muted-foreground font-bold ml-1">EUR</span></span>
                </div>
              </div>
            </div>
          )}

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
