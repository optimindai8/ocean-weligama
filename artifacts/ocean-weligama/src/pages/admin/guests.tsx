import { useState } from "react";
import { useAdminListGuests, getAdminListGuestsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, Download, Users } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminGuests() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: guests = [], isLoading } = useAdminListGuests({
    query: {
      queryKey: getAdminListGuestsQueryKey(),
    },
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: getAdminListGuestsQueryKey() });
    setTimeout(() => setIsRefreshing(false), 500); // Visual feedback
  };

  const handleDownloadExcel = () => {
    if (!guests || guests.length === 0) return;

    // Prepare data for Excel
    const excelData = guests.map((g) => ({
      Name: g.name,
      Email: g.email,
      "Phone Number": g.phone || "N/A",
      Source: g.source,
      "Last Active Date": format(new Date(g.lastActiveAt), "MMM d, yyyy HH:mm"),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guest Details");

    // Adjust column widths for better organization
    const maxWidths = excelData.reduce((acc: any, row: any) => {
      Object.keys(row).forEach(key => {
        const val = row[key] ? row[key].toString() : '';
        acc[key] = Math.max(acc[key] || key.length, val.length);
      });
      return acc;
    }, {});
    
    worksheet['!cols'] = Object.keys(maxWidths).map(key => ({ wch: maxWidths[key] + 2 }));

    // Generate Excel file buffer and trigger download
    XLSX.writeFile(workbook, `Guest_Details_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-[#0B3D5E]" /> Guest Details
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Manage and export all guest contacts from bookings and messages.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center gap-2 rounded-xl"
          >
            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleDownloadExcel}
            disabled={isLoading || guests.length === 0}
            className="bg-[#0B3D5E] hover:bg-[#0B3D5E]/90 text-white rounded-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Guest Info</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    Loading guests...
                  </td>
                </tr>
              ) : guests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    No guest details found.
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{guest.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-slate-600">{guest.email}</div>
                      {guest.phone && <div className="text-xs text-slate-500 mt-1">{guest.phone}</div>}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className={`font-bold border-0 ${
                        guest.source.includes("Booking") && guest.source.includes("Message") 
                          ? "bg-purple-100 text-purple-700" 
                          : guest.source.includes("Booking") 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {guest.source}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">
                      {format(new Date(guest.lastActiveAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
