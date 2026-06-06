import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAdminListGuests,
  getAdminListGuestsQueryKey,
  useAdminDeleteGuest,
  useAdminDeleteAllGuests,
} from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RefreshCcw, Download, Users, Trash2, AlertTriangle, Search, Mail, Phone, UserCircle, ShieldCheck, MessageSquare, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminGuests() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>("");
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: guests = [], isLoading } = useAdminListGuests({
    query: {
      queryKey: getAdminListGuestsQueryKey(),
    },
  });

  const deleteGuest = useAdminDeleteGuest();
  const deleteAllGuests = useAdminDeleteAllGuests();

  const filteredGuests = (guests as any[]).filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.name?.toLowerCase().includes(q) ||
      g.email?.toLowerCase().includes(q) ||
      g.phone?.toLowerCase().includes(q)
    );
  });

  const bookingCount = (guests as any[]).filter((g) => g.source?.includes("Booking")).length;
  const messageCount = (guests as any[]).filter((g) => g.source?.includes("Message")).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: getAdminListGuestsQueryKey() });
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleDeleteSingle = (email: string, name: string) => {
    setDeletingEmail(email);
    setDeletingName(name);
  };

  const confirmDeleteSingle = () => {
    if (!deletingEmail) return;
    deleteGuest.mutate(
      { email: encodeURIComponent(deletingEmail) },
      {
        onSuccess: () => {
          toast({
            title: "Guest Removed",
            description: `${deletingName}'s records have been deleted successfully.`,
          });
          queryClient.invalidateQueries({ queryKey: getAdminListGuestsQueryKey() });
          setDeletingEmail(null);
          setDeletingName("");
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to delete guest. Please try again.",
            variant: "destructive",
          });
          setDeletingEmail(null);
          setDeletingName("");
        },
      }
    );
  };

  const confirmDeleteAll = () => {
    deleteAllGuests.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "All Guests Removed",
          description: "All guest records have been deleted successfully.",
        });
        queryClient.invalidateQueries({ queryKey: getAdminListGuestsQueryKey() });
        setIsDeleteAllOpen(false);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete guests. Please try again.",
          variant: "destructive",
        });
        setIsDeleteAllOpen(false);
      },
    });
  };

  const handleDownloadExcel = () => {
    if (!guests || guests.length === 0) return;

    const excelData = (guests as any[]).map((g) => ({
      Name: g.name,
      Email: g.email,
      "Phone Number": g.phone || "N/A",
      Source: g.source,
      "Last Active Date": format(new Date(g.lastActiveAt), "MMM d, yyyy HH:mm"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guest Details");

    const maxWidths = excelData.reduce((acc: any, row: any) => {
      Object.keys(row).forEach((key) => {
        const val = row[key] ? row[key].toString() : "";
        acc[key] = Math.max(acc[key] || key.length, val.length);
      });
      return acc;
    }, {});

    worksheet["!cols"] = Object.keys(maxWidths).map((key) => ({
      wch: maxWidths[key] + 2,
    }));

    XLSX.writeFile(workbook, `Guest_Details_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-serif font-black text-[#0B3D5E] flex items-center gap-3">
              Guest Details
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              All guest contacts from bookings and messages in one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0B3D5E] focus:ring-1 focus:ring-[#0B3D5E] w-64 shadow-sm transition-all"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="bg-white border-slate-200 text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-50 shadow-sm rounded-xl h-9"
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#1a6b8a] flex items-center justify-center shadow-md shadow-[#0B3D5E]/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#0B3D5E]">{(guests as any[]).length}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Total Guests</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200/50">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-blue-700">{bookingCount}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">From Bookings</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200/50">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-700">{messageCount}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">From Messages</p>
            </div>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-sm font-bold text-slate-400">
            {filteredGuests.length} {filteredGuests.length === 1 ? "guest" : "guests"} found
            {searchQuery && <span className="text-slate-500"> for "{searchQuery}"</span>}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteAllOpen(true)}
              disabled={isLoading || (guests as any[]).length === 0}
              className="flex items-center gap-2 rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all h-9 text-xs font-bold"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete All
            </Button>
            <Button
              onClick={handleDownloadExcel}
              disabled={isLoading || (guests as any[]).length === 0}
              className="bg-gradient-to-r from-[#0B3D5E] to-[#1a6b8a] hover:from-[#0a3452] hover:to-[#155a75] text-white rounded-xl flex items-center gap-2 h-9 text-xs font-bold shadow-md shadow-[#0B3D5E]/20 hover:shadow-lg hover:shadow-[#0B3D5E]/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download Excel
            </Button>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden"
        >
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 rounded-2xl" />
              ))}
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
                <UserCircle className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-base font-bold text-[#0B3D5E]">No guests found</p>
              <p className="text-sm mt-1">
                {searchQuery ? "Try adjusting your search" : "Guest details will appear here after bookings or messages"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto relative">
              <table className="w-full text-sm relative">
                <thead className="border-b border-slate-100 bg-slate-50/95 backdrop-blur sticky top-0 z-10 shadow-sm">
                  <tr>
                    {["Guest", "Email", "Phone", "Source", "Last Active", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredGuests.map((guest: any, idx: number) => (
                      <motion.tr
                        key={guest.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        className="hover:bg-sky-50/40 transition-all duration-200 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0B3D5E] to-[#1a6b8a] flex items-center justify-center text-white text-xs font-black shadow-sm">
                              {guest.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                            <span className="font-bold text-[#0B3D5E] group-hover:text-sky-700 transition-colors">
                              {guest.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {guest.email}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {guest.phone ? (
                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              {guest.phone}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300 italic">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <Badge
                            variant="outline"
                            className={`font-bold border-0 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${
                              guest.source.includes("Booking") && guest.source.includes("Message")
                                ? "bg-purple-100 text-purple-700"
                                : guest.source.includes("Booking")
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {guest.source.includes("Booking") && guest.source.includes("Message") ? (
                              <><ShieldCheck className="w-3 h-3 mr-1 inline" /> Both</>
                            ) : guest.source.includes("Booking") ? (
                              <><CalendarDays className="w-3 h-3 mr-1 inline" /> Booking</>
                            ) : (
                              <><MessageSquare className="w-3 h-3 mr-1 inline" /> Message</>
                            )}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-slate-400">
                          {format(new Date(guest.lastActiveAt), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => handleDeleteSingle(guest.email, guest.name)}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500"
                            title="Delete guest"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Delete Single Guest Confirmation */}
        <AlertDialog open={!!deletingEmail} onOpenChange={(open) => !open && setDeletingEmail(null)}>
          <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
            <AlertDialogHeader>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mb-3 shadow-sm"
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </motion.div>
              <AlertDialogTitle className="text-center text-xl font-serif">Delete Guest Record?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm leading-relaxed">
                Are you sure you want to delete all records for{" "}
                <span className="font-bold text-slate-700">{deletingName}</span>?<br />
                This will remove their bookings and messages from the system.<br />
                <span className="text-red-500 font-semibold mt-2 inline-block">This action cannot be undone.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
              <AlertDialogCancel className="rounded-xl px-8 font-bold hover:bg-slate-100 transition-all">
                No, Keep
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteSingle}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-8 font-bold shadow-md shadow-red-200/50 hover:shadow-lg transition-all"
              >
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete All Guests Confirmation */}
        <AlertDialog open={isDeleteAllOpen} onOpenChange={setIsDeleteAllOpen}>
          <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
            <AlertDialogHeader>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mb-3 shadow-sm"
              >
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </motion.div>
              <AlertDialogTitle className="text-center text-xl font-serif">Delete All Guest Records?</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-700">all {(guests as any[]).length} guest records</span>?<br />
                This will remove all bookings and messages from the system.<br />
                <span className="text-red-500 font-semibold mt-2 inline-block">This action cannot be undone.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 sm:justify-center mt-2">
              <AlertDialogCancel className="rounded-xl px-8 font-bold hover:bg-slate-100 transition-all">
                No, Keep All
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteAll}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-8 font-bold shadow-md shadow-red-200/50 hover:shadow-lg transition-all"
              >
                Yes, Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
