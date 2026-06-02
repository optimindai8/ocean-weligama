import { AdminLayout } from "@/components/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getAdminGetMatrixPricingQueryKey, useAdminGetMatrixPricing, useAdminUpdateMatrixPricing } from "@workspace/api-client-react";
import { Check, Loader2 } from "lucide-react";

export default function AdminMatrixPricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matrixData, isLoading } = useAdminGetMatrixPricing({
    query: { queryKey: getAdminGetMatrixPricingQueryKey() },
  });

  const updatePrice = useAdminUpdateMatrixPricing();
  
  // Local state for editing to debounce / manage input
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const handlePriceChange = (roomId: string, packageId: string, value: string) => {
    const key = `${roomId}-${packageId}`;
    setEditingValues(prev => ({ ...prev, [key]: value }));
  };

  const savePrice = (roomId: string, packageId: string, value: string) => {
    const key = `${roomId}-${packageId}`;
    if (!value || isNaN(parseFloat(value))) return;

    setSavingKey(key);
    updatePrice.mutate(
      {
        data: {
          roomId,
          packageId,
          price: value,
          dailyPrice: value,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Price updated" });
          queryClient.invalidateQueries({ queryKey: getAdminGetMatrixPricingQueryKey() });
          setSavingKey(null);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Update failed" });
          setSavingKey(null);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <Skeleton className="w-full h-96 rounded-[2rem]" />
        </div>
      </AdminLayout>
    );
  }

  const { rooms = [], packages = [], prices = [] } = matrixData || {};

  const getPrice = (roomId: string, packageId: string) => {
    const p = prices.find(p => p.roomId === roomId && p.packageId === packageId);
    return p ? p.dailyPrice : "";
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">
            Matrix Pricing
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">
            Set inclusive package prices (Room + Package) per night for each combination.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left font-bold text-slate-700 whitespace-nowrap">
                    Rooms
                  </th>
                  {packages.map(pkg => (
                    <th key={pkg.id} className="px-6 py-4 text-center font-bold text-[#0B3D5E] min-w-[200px]">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map(room => (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-slate-800 whitespace-nowrap">
                      {room.name}
                    </td>
                    {packages.map(pkg => {
                      const key = `${room.id}-${pkg.id}`;
                      const currentVal = editingValues[key] !== undefined ? editingValues[key] : getPrice(room.id, pkg.id);
                      
                      return (
                        <td key={key} className="px-6 py-5">
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-slate-400 font-medium text-sm">€</span>
                            <Input
                              value={currentVal}
                              onChange={(e) => handlePriceChange(room.id, pkg.id, e.target.value)}
                              onBlur={(e) => savePrice(room.id, pkg.id, e.target.value)}
                              className="pl-7 pr-10 text-center font-bold h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B3D5E] focus-visible:bg-white transition-all"
                              placeholder="0.00"
                            />
                            {savingKey === key && (
                              <div className="absolute right-3">
                                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
