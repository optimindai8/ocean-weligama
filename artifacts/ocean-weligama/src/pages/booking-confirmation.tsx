import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGetBookingByReference, getGetBookingByReferenceQueryKey, useListRooms, useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Check, MessageCircle, Calendar, Users, ArrowRight, Home, Plane, MessageSquare, CreditCard, Award, Sparkles, Clock } from "lucide-react";

function getUnitLabel(unit: string | undefined, qty: number) {
  if (unit === 'per_day') return `${qty} Day${qty > 1 ? 's' : ''}`;
  if (unit === 'per_tour') return `${qty} Tour${qty > 1 ? 's' : ''}`;
  if (unit === 'per_trip') return `${qty} Trip${qty > 1 ? 's' : ''}`;
  if (unit === 'per_lesson') return `${qty} Lesson${qty > 1 ? 's' : ''}`;
  if (unit === 'per_session') return `${qty} Session${qty > 1 ? 's' : ''}`;
  return `Quantity: ${qty}`;
}

function parseSpecialRequests(text: string) {
  if (!text) return { customizations: [] as { packageName: string; changes: { from: string; to: string }[] }[], message: "" };
  const customizations: { packageName: string; changes: { from: string; to: string }[] }[] = [];
  const lines = text.split("\n");
  const remainingLines: string[] = [];
  
  let inCustomSection = false;
  let currentCustomPkg: { packageName: string; changes: { from: string; to: string }[] } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("[Package Customization:")) {
      inCustomSection = true;
      const nameMatch = line.match(/\[Package Customization:\s*(.+)\]/);
      currentCustomPkg = { packageName: nameMatch ? nameMatch[1] : "Package", changes: [] };
      customizations.push(currentCustomPkg);
      continue;
    }

    if (inCustomSection) {
      const arrowMatch = line.match(/^(.+?)\s*→\s*(.+)$/);
      if (arrowMatch && currentCustomPkg) {
        currentCustomPkg.changes.push({ from: arrowMatch[1].trim(), to: arrowMatch[2].trim() });
        continue;
      } else {
        inCustomSection = false;
        currentCustomPkg = null;
      }
    }
    
    if (!inCustomSection) {
      if (line !== "" || (remainingLines.length > 0 && remainingLines[remainingLines.length - 1] !== "")) {
        remainingLines.push(lines[i]);
      }
    }
  }
  
  return { customizations, message: remainingLines.join("\n").trim() };
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
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <div className="flex flex-col gap-4">
                    {((booking as any).roomIds?.length ? (booking as any).roomIds : [booking.roomId]).map((rId: string, i: number) => {
                      const r = roomsList?.find(x => x.id === rId);
                      const img = r?.heroImageUrl || (r?.gallery && r.gallery[0]);
                      const roomName = r?.name || booking.roomName || `Room ${i + 1}`;
                      return (
                        <div key={i} className="flex gap-4 items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                          {img && (
                            <img src={img} alt={roomName} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                          )}
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Room {i + 1}</p>
                            <p className="font-bold text-foreground text-sm leading-tight mb-0.5 line-clamp-1">{roomName}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-1 px-2">
                      <p className="text-sm text-muted-foreground font-bold">{booking.guestCount} {booking.guestCount === 1 ? 'Guest total' : 'Guests total'}</p>
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
                          <div key={idx} className="bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col w-full max-w-md mx-auto mb-6">
                            <div className="relative w-full h-64 shrink-0 bg-emerald-50">
                              {srv?.gallery?.[0] || srv?.heroImageUrl ? (
                                <img src={srv.gallery?.[0] || srv?.heroImageUrl} alt={s.serviceName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Award className="w-16 h-16 text-emerald-200" />
                                </div>
                              )}
                              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#0B3D5E] font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-md z-10 border border-white/20">
                                {tag} {type}
                              </div>
                            </div>
                            
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                              <h4 className="text-2xl font-serif font-black text-[#0B3D5E] mb-2 leading-tight px-1">
                                {s.serviceName}
                              </h4>
                              {/* Price intentionally hidden per client request */}
                              <p className="text-xs text-slate-400 font-mono mb-4 px-1">
                                {srv?.slug || s.serviceName.toLowerCase().replace(/ /g, "-")}
                              </p>
                              
                              <hr className="border-slate-100 my-4" />
                              
                              {srv?.highlights && srv.highlights.length > 0 && (
                                <div className="space-y-3 mb-6 flex-1 px-1">
                                  {(() => {
                                    const isExpanded = expandedPkgs[idx.toString()];
                                    const visibleHighlights = isExpanded ? srv.highlights : srv.highlights.slice(0, 6);
                                    const hasMore = srv.highlights.length > 6;

                                    return (
                                      <>
                                        {visibleHighlights.map((hl: string, i: number) => (
                                          <div key={i} className="flex items-start gap-2.5">
                                            <Check className="w-4 h-4 text-[#4BBCCC] shrink-0 mt-0.5" />
                                            <span className="text-slate-600 font-medium text-sm leading-relaxed">{hl}</span>
                                          </div>
                                        ))}
                                        
                                        {hasMore && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setExpandedPkgs(prev => ({ ...prev, [idx.toString()]: !prev[idx.toString()] }));
                                            }}
                                            className="text-[#4BBCCC] hover:text-[#4BBCCC]/80 font-extrabold text-xs italic hover:underline mt-2 inline-block cursor-pointer"
                                          >
                                            {isExpanded ? "show less highlights" : `+ ${srv.highlights.length - 6} more highlights`}
                                          </button>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              )}
                              
                              {!srv?.highlights?.length && srv?.description && (
                                <p className="text-sm text-slate-600 mb-6 leading-relaxed px-1">
                                  {srv.description}
                                </p>
                              )}
                              
                              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                                <span>{getUnitLabel(srv?.unit, s.quantity)}</span>
                                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold">Main Package</div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white border border-emerald-100 items-center shadow-sm">
                          {srv?.heroImageUrl && (
                            <img src={srv.heroImageUrl} alt={srv.name || s.serviceName} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                          )}
                          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-emerald-950 text-base">{s.serviceName}</p>
                              {srv?.shortDesc && <p className="text-xs text-emerald-800/70 mt-1 line-clamp-1">{srv.shortDesc}</p>}
                            </div>
                            <p className="text-sm font-black text-emerald-800 bg-emerald-50 px-4 py-2 rounded-xl text-right">
                              {getUnitLabel(srv?.unit, s.quantity)} — €{parseFloat(s.subtotal).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Airport Transfers */}
              {((booking as any).airportPickup || (booking as any).airportDrop) && (
                <div className="bg-sky-50/30 border border-sky-100/50 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-sky-800 mb-6 flex items-center gap-2">
                    <Plane className="w-4 h-4" /> Airport Transfer Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(booking as any).airportPickup && (() => {
                      const details = (booking as any).flightDetails ? JSON.parse((booking as any).flightDetails) : {};
                      return (
                      <div className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
                              <Plane className="w-4 h-4 text-sky-600" /> Airport Pick-up
                            </span>
                            <div className="bg-sky-50 text-sky-800 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest">
                              €{(booking as any).airportPickupPrice}
                            </div>
                          </div>
                          <div className="space-y-3 text-sm text-sky-900/80">
                            <div className="flex justify-between items-center bg-sky-50/50 p-2 rounded-lg">
                              <span className="font-bold text-sky-950">Flight:</span>
                              <span className="font-mono font-bold text-sky-900">{details.flightNumber || "N/A"}</span>
                            </div>
                            <div className="flex justify-between items-center bg-sky-50/50 p-2 rounded-lg">
                              <span className="font-bold text-sky-950">Arrival:</span>
                              <span className="font-bold flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" /> {details.flightDate || "N/A"}
                                <span className="text-sky-300">|</span>
                                <Clock className="w-3.5 h-3.5" /> {details.flightTime || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-sky-50 flex items-center justify-between text-xs">
                          <span className="font-bold text-sky-950">Bringing Surfboard:</span>
                          <span className={`px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${details.bringingSurfboard ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                            {details.bringingSurfboard ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                      )
                    })()}
                    
                    {(booking as any).airportDrop && (
                      <div className="p-5 rounded-2xl bg-white border border-indigo-100 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                              <Plane className="w-4 h-4 text-indigo-600 rotate-180" /> Airport Drop-off
                            </span>
                            <div className="bg-indigo-50 text-indigo-800 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest">
                              €{(booking as any).airportDropPrice}
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

              {/* Package Customizations */}
              {parsed.customizations && parsed.customizations.length > 0 && (
                <div className="bg-emerald-50/30 border border-emerald-100/50 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                    <Award className="w-4 h-4" /> Package Customizations
                  </h3>
                  <div className="space-y-4">
                    {parsed.customizations.map((cust, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm">
                        <p className="font-bold text-emerald-900 text-sm mb-3">{cust.packageName}</p>
                        <div className="space-y-2">
                          {cust.changes.map((ch, ci) => (
                            <div key={ci} className="flex items-center justify-between text-sm bg-emerald-50/50 px-4 py-2 rounded-xl">
                              <span className="text-muted-foreground">{ch.from}</span>
                              <span className="font-bold text-emerald-700 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" /> {ch.to}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
                  {/* Room subtotal */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-muted-foreground font-medium block">Room Price{booking.nights ? ` (${booking.nights} nights)` : ''}</span>
                      {booking.nights && booking.roomRatePerNight && (
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
                          €{parseFloat(booking.roomRatePerNight).toFixed(2)} × {booking.nights} = €{(parseFloat(booking.roomSubtotal || "0")).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-foreground text-base">
                      €{(parseFloat(booking.roomSubtotal || "0")).toFixed(2)}
                    </span>
                  </div>

                  {/* Addons and Packages */}
                  {booking.services && booking.services.map((s: any, idx: number) => {
                    const srv = servicesList?.find(
                      x => x.id === s.serviceId || x.name?.toLowerCase() === s.serviceName?.toLowerCase()
                    );
                    return (
                      <div key={idx} className="flex justify-between items-start">
                        <div>
                          <span className="text-muted-foreground font-medium block">{s.serviceName}</span>
                          <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">{getUnitLabel(srv?.unit, s.quantity)}</span>
                        </div>
                        <span className="font-bold text-foreground text-base">
                          €{(parseFloat(s.subtotal || "0")).toFixed(2)}
                        </span>
                      </div>
                    )
                  })}

                  {/* Airport Pickup */}
                  {(booking as any).airportPickup && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Airport Pick-up Transfer</span>
                      <span className="font-bold text-foreground text-base">€{(parseFloat((booking as any).airportPickupPrice || "0")).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Airport Drop */}
                  {(booking as any).airportDrop && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Airport Drop-off Transfer</span>
                      <span className="font-bold text-foreground text-base">€{(parseFloat((booking as any).airportDropPrice || "0")).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Cleaning Fee */}
                  {parseFloat(booking.cleaningFee || "0") > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Cleaning Fee</span>
                      <span className="font-bold text-foreground text-base">€{(parseFloat(booking.cleaningFee || "0")).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Payment Status */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-muted-foreground font-medium">Payment Status</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {booking.paymentStatus || 'unpaid'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between sm:items-end pt-6 gap-4">
                  <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground max-w-[200px] leading-tight">Total price = Room price + Packages + Experiences + airport transfer</span>
                  <span className="font-black text-3xl sm:text-4xl text-primary whitespace-nowrap">
                    €{(parseFloat(booking.totalAmount || "0")).toFixed(2)} <span className="text-sm font-bold text-muted-foreground ml-1">{booking.currency || "EUR"}</span>
                  </span>
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
