import { useState } from "react";
import {
  useAdminListBookings,
  useAdminUpdateBooking,
  useAdminDeleteBooking,
  getAdminListBookingsQueryKey,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Filter, Trash2 } from "lucide-react";

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

  const params = { page, limit: 20, ...(statusFilter ? { status: statusFilter } : {}) };
  const { data, isLoading } = useAdminListBookings(params, {
    query: { queryKey: getAdminListBookingsQueryKey(params) },
  });

  const updateBooking = useAdminUpdateBooking();
  const deleteBooking = useAdminDeleteBooking();

  const bookingsData = data as {
    bookings: Array<{
      id: string;
      reference: string;
      guestFullName: string;
      guestEmail: string;
      checkIn: string;
      checkOut: string;
      nights: number;
      guestCount: number;
      status: string;
      paymentStatus: string;
      totalAmount: string;
      currency: string;
      createdAt: string;
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
                    {["Reference", "Guest", "Check-in", "Check-out", "Nights", "Status", "Payment", "Total", "Actions"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookingsData.bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/20 transition-colors" data-testid={`row-booking-${b.id}`}>
                      <td className="px-4 py-3 font-mono text-xs text-primary font-bold">{b.reference}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{b.guestFullName}</p>
                        <p className="text-xs text-muted-foreground">{b.guestEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{b.checkIn}</td>
                      <td className="px-4 py-3 text-muted-foreground">{b.checkOut}</td>
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
                        <div className="flex items-center gap-2">
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
      </div>
    </AdminLayout>
  );
}
