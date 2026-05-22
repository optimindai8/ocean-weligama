import { useState } from "react";
import {
  useAdminListBookings,
  useAdminUpdateBooking,
  useAdminDeleteBooking,
  getAdminListBookingsQueryKey,
  useAdminListRooms,
  useAdminListServices,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Filter, Trash2, Eye, User, Phone, Mail, Globe, Home, Calendar, Sparkles, CreditCard, MessageSquare, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  checked_in: "bg-green-100 text-green-800 border-green-200",
  checked_out: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  no_show: "bg-orange-100 text-orange-800 border-orange-200",
};

const PAYMENT_COLORS: Record<string, string> = {
  unpaid: "bg-red-50 text-red-700",
  partial: "bg-yellow-50 text-yellow-700",
  paid: "bg-green-50 text-green-700",
  refunded: "bg-gray-50 text-gray-700",
  failed: "bg-red-100 text-red-800",
};

const STATUSES = ["", "pending", "confirmed", "checked_in", "checked_out", "cancelled"];

export default function AdminBookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const params = { page, limit: 20, ...(statusFilter ? { status: statusFilter } : {}) };
  const { data, isLoading } = useAdminListBookings(params, {
    query: { queryKey: getAdminListBookingsQueryKey(params) },
  });

  const { data: roomsResponse } = useAdminListRooms();
  const { data: servicesResponse } = useAdminListServices();
  const roomsList = roomsResponse as any[] | undefined;
  const servicesList = servicesResponse as any[] | undefined;

  const updateBooking = useAdminUpdateBooking();
  const deleteBooking = useAdminDeleteBooking();

  const bookingsData = data as {
    bookings: Array<{
      id: string;
      reference: string;
      guestFullName: string;
      guestEmail: string;
      guestPhone: string;
      guestNationality: string;
      specialRequests: string;
      roomId: string;
      roomName: string;
      checkIn: string;
      checkOut: string;
      nights: number;
      guestCount: number;
      status: string;
      paymentStatus: string;
      totalAmount: string;
      currency: string;
      createdAt: string;
      services: Array<{
        serviceName: string;
        quantity: number;
        subtotal: string;
      }>;
    }>;
    total: number;
    page: number;
    limit: number;
  } | undefined;

  function handleStatusChange(id: string, status: string) {
    updateBooking.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          toast({ title: "Status updated" });
          queryClient.invalidateQueries({ queryKey: getAdminListBookingsQueryKey(params) });
          setSelectedBookingId(null);
        },
        onError: () => toast({ variant: "destructive", title: "Update failed" }),
      }
    );
  }

  function handleDeleteBooking(id: string) {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      deleteBooking.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Booking deleted successfully" });
            queryClient.invalidateQueries({ queryKey: getAdminListBookingsQueryKey(params) });
          },
          onError: () => toast({ variant: "destructive", title: "Failed to delete booking" }),
        }
      );
    }
  }

  const totalPages = Math.ceil((bookingsData?.total ?? 0) / 20);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground text-sm mt-1">{bookingsData?.total ?? 0} total bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground mt-2" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              data-testid={`filter-status-${s || "all"}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border capitalize ${
                statusFilter === s ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : bookingsData?.bookings && bookingsData.bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    {["Reference", "Name", "Email", "Phone", "Check-in", "Check-out", "Nights", "Status", "Payment", "Total", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookingsData.bookings.map((b) => (
                    <tr 
                      key={b.id} 
                      className="hover:bg-muted/20 transition-colors cursor-pointer" 
                      onClick={() => setSelectedBooking(b)}
                      data-testid={`row-booking-${b.id}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary font-bold">{b.reference}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-foreground">{b.guestFullName}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{b.guestEmail}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{b.guestPhone || "N/A"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.checkIn}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.checkOut}</td>
                      <td className="px-4 py-3 text-center">{b.nights}n</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium border capitalize ${STATUS_COLORS[b.status] ?? ""}`}>
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${PAYMENT_COLORS[b.paymentStatus] ?? ""}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">${b.totalAmount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={b.status}
                            onChange={(e) => handleStatusChange(b.id, e.target.value)}
                            className="text-xs border border-border rounded-lg px-2 py-1 bg-background text-foreground cursor-pointer"
                            data-testid={`select-status-${b.id}`}
                          >
                            {["pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show"].map((s) => (
                              <option key={s} value={s}>{s.replace("_", " ")}</option>
                            ))}
                          </select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteBooking(b.id)}
                            disabled={deleteBooking.isPending}
                            title="Delete Booking"
                            data-testid={`delete-booking-${b.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              No bookings found
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} data-testid="button-prev-page">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} data-testid="button-next-page">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Detailed Booking Modal */}
        <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0 rounded-2xl gap-0 border-0 shadow-2xl">
            {selectedBooking && (
              <>
                {/* Header */}
                <div className="bg-primary p-6 sm:p-8 text-white relative">
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20 uppercase tracking-widest text-[10px]">
                        {selectedBooking.status.replace("_", " ")}
                      </Badge>
                      <span className="font-mono text-white/70 text-sm">Ref: {selectedBooking.reference}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-1">{selectedBooking.guestFullName}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-white/80 mt-3">
                      <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {selectedBooking.guestEmail}</div>
                      {selectedBooking.guestPhone && <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {selectedBooking.guestPhone}</div>}
                      {selectedBooking.guestNationality && <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {selectedBooking.guestNationality}</div>}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-6 bg-slate-50">
                  
                  {/* Room & Stay */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Home className="w-4 h-4" /> Stay Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="flex gap-4 items-center">
                        {(() => {
                           const r = roomsList?.find(x => x.id === selectedBooking.roomId);
                           const img = r?.heroImageUrl || (r?.gallery && r.gallery[0]);
                           if (img) {
                             return <img src={img} alt={selectedBooking.roomName} className="w-24 h-24 object-cover rounded-xl shadow-sm" />;
                           }
                           return null;
                        })()}
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Room</p>
                          <p className="font-bold text-foreground text-lg leading-tight mb-1">{selectedBooking.roomName}</p>
                          <p className="text-sm text-muted-foreground">{selectedBooking.guestCount} {selectedBooking.guestCount === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                      </div>
                      <div className="flex gap-6 md:justify-end">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Check-in</p>
                          <p className="font-bold text-lg">{selectedBooking.checkIn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">Check-out</p>
                          <p className="font-bold text-lg">{selectedBooking.checkOut}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons */}
                  {selectedBooking.services && selectedBooking.services.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Add-Ons & Packages
                      </h3>
                      <div className="space-y-3">
                        {selectedBooking.services.map((s: any, idx: number) => {
                          const srv = servicesList?.find(x => x.id === s.serviceId);
                          return (
                            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 items-center">
                              {srv?.heroImageUrl && (
                                <img src={srv.heroImageUrl} alt={srv.name || s.serviceName} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                              )}
                              <div className="flex-1">
                                <p className="font-bold text-emerald-900 text-base">{s.serviceName}</p>
                                {srv?.shortDesc && <p className="text-xs text-emerald-700/80 mt-1 line-clamp-1">{srv.shortDesc}</p>}
                                <p className="text-xs text-emerald-700 font-bold mt-2">Quantity: {s.quantity}</p>
                              </div>
                              <span className="font-bold text-lg text-emerald-700">${s.subtotal}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Special Requests & Notes
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                        {selectedBooking.specialRequests}
                      </p>
                    </div>
                  )}

                  {/* Payment */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Payment Summary
                    </h3>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-muted-foreground">Payment Status</span>
                      <Badge className={PAYMENT_COLORS[selectedBooking.paymentStatus] || "bg-muted text-muted-foreground"} variant="outline">
                        {selectedBooking.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="font-bold text-lg text-foreground">Total</span>
                      <span className="font-black text-2xl text-primary">${selectedBooking.totalAmount} <span className="text-base text-muted-foreground">{selectedBooking.currency}</span></span>
                    </div>
                  </div>

                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}
