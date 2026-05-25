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
          className="max-w-4xl w-full"
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
          {booking && (() => {
            const parsed = parseSpecialRequests(booking.specialRequests || "");
            const currencySymbol = "€";
            
            return (
            <div className="bg-white rounded-[2.5rem] border border-border shadow-xl p-6 md:p-10 mb-8 space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-border/50">
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

              {/* Room & Stay */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                  <Home className="w-4 h-4" /> Stay Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="flex gap-4 items-center">
                    {(() => {
                        const r = roomsList?.find(x => x.id === booking.roomId);
                        const img = r?.heroImageUrl || (r?.gallery && r.gallery[0]);
                        if (img) {
                          return <img src={img} alt={booking.roomName} className="w-24 h-24 object-cover rounded-xl shadow-sm" />;
                        }
                        return null;
                    })()}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Room</p>
                      <p className="font-bold text-foreground text-lg leading-tight mb-1">{booking.roomName}</p>
                      <p className="text-sm text-muted-foreground">{booking.guestCount} {booking.guestCount === 1 ? 'Guest' : 'Guests'}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 md:justify-end">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Check-in</p>
                      <p className="font-bold text-lg">{booking.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Check-out</p>
                      <p className="font-bold text-lg">{booking.checkOut}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              {booking.services && booking.services.length > 0 && (
                <div className="bg-emerald-50/30 border border-emerald-100/50 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Add-Ons & Packages
                  </h3>
                  <div className="space-y-4">
                    {booking.services.map((s: any, idx: number) => {
                      const srv = servicesList?.find(
                        x => x.id === s.serviceId || x.name?.toLowerCase() === s.serviceName?.toLowerCase()
                      );
                      const isPackage = srv?.type === "main" || srv?.category?.toLowerCase()?.includes("package");
                      
                      if (isPackage) {
                        const tag = srv?.category ? (srv.category.toLowerCase().includes("surf") ? "SURF" : srv.category.toUpperCase()) : "SURF";
                        const type = srv?.type ? srv.type.toUpperCase() : "MAIN";
                        
                        return (
                          <div key={idx} className="bg-white rounded-3xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-6 p-6">
                            <div className="relative w-full md:w-44 h-44 md:h-36 shrink-0 rounded-2xl overflow-hidden bg-emerald-50">
                              {srv?.imageUrl || srv?.heroImageUrl ? (
                                <img src={srv.imageUrl || srv?.heroImageUrl} alt={s.serviceName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Award className="w-12 h-12 text-emerald-200" />
                                </div>
                              )}
                              <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm text-[#0B3D5E] font-black text-[8px] uppercase tracking-wider px-2.5 py-1.5 rounded-full shadow-sm z-10 border border-slate-100">
                                {tag} {type}
                              </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                                  <h4 className="text-xl font-serif font-black text-[#0B3D5E] leading-tight">{s.serviceName}</h4>
                                  <span className="font-black text-2xl text-[#0B3D5E]">{currencySymbol}{s.subtotal}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono mb-2">
                                  {srv?.slug || s.serviceName.toLowerCase().replace(/ /g, "-")}
                                </p>
                                {srv?.description && (
                                  <p className="text-xs text-slate-600 mb-3 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/50 italic font-medium">
                                    {srv.description}
                                  </p>
                                )}
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-bold">
                                <span>Quantity: {s.quantity}</span>
                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">Main Package</div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 items-center">
                          {srv?.heroImageUrl && (
                            <img src={srv.heroImageUrl} alt={srv.name || s.serviceName} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-emerald-900 text-base">{s.serviceName}</p>
                            {srv?.shortDesc && <p className="text-xs text-emerald-700/80 mt-1 line-clamp-1">{srv.shortDesc}</p>}
                            <p className="text-xs text-emerald-700 font-bold mt-2">Quantity: {s.quantity}</p>
                          </div>
                          <span className="font-bold text-lg text-emerald-700">{currencySymbol}{s.subtotal}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Airport Transfers */}
              {(parsed.pickup || parsed.drop) && (
                <div className="bg-sky-50/30 border border-sky-100/50 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-sky-800 mb-6 flex items-center gap-2">
                    <Plane className="w-4 h-4" /> Airport Transfer Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {parsed.pickup && (
                      <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
                              <Plane className="w-4 h-4 text-sky-600" /> Airport Pick-up
                            </span>
                            <div className="bg-sky-50 text-sky-800 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest">
                              Pay on Arrival: €{parsed.pickup.price}
                            </div>
                          </div>
                          <div className="space-y-3 text-sm text-sky-900/80">
                            <div className="flex justify-between items-center bg-sky-50/50 p-2 rounded-lg">
                              <span className="font-bold text-sky-950">Flight:</span>
                              <span className="font-mono font-bold text-sky-900">{parsed.pickup.flightNumber || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center bg-sky-50/50 p-2 rounded-lg">
                              <span className="font-bold text-sky-950">Arrival:</span>
                              <span className="font-bold flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> {parsed.pickup.flightDate || "N/A"}
                                <span className="text-sky-300">|</span>
                                <Clock className="w-3.5 h-3.5" /> {parsed.pickup.flightTime || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-sky-50 flex items-center justify-between text-xs">
                          <span className="font-bold text-sky-950">Bringing Surfboard:</span>
                          <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${parsed.pickup.bringingSurfboard === "Yes" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                            {parsed.pickup.bringingSurfboard || "No"}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {parsed.drop && (
                      <div className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                              <Plane className="w-4 h-4 text-indigo-600 rotate-180" /> Airport Drop-off
                            </span>
                            <div className="bg-indigo-50 text-indigo-800 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest">
                              Pay on Arrival: €{parsed.drop.price}
                            </div>
                          </div>
                          <p className="text-sm text-indigo-900/80 leading-relaxed bg-indigo-50/30 p-3 rounded-xl border border-indigo-50">
                            Professional private transfer back to CMB Airport. Safe and comfortable ride scheduled in alignment with your departure flight.
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-indigo-50 flex items-center justify-between text-xs">
                          <span className="font-bold text-indigo-950">Status:</span>
                          <span className="font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full">
                            <Check className="w-3.5 h-3.5" /> Booked
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {parsed.message && (
                <div className="bg-amber-50/30 border border-amber-100/50 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Special Requests & Notes
                  </h3>
                  <p className="text-sm text-amber-900/80 whitespace-pre-wrap leading-relaxed bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
                    {parsed.message}
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-sm mt-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payment Summary
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
                  <span className="font-bold text-lg text-foreground">Total Paid Online</span>
                  <span className="font-black text-4xl text-primary">€{booking.totalAmount} <span className="text-sm text-muted-foreground font-bold ml-1">EUR</span></span>
                </div>
              </div>
            </div>
            );
          })()}

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
