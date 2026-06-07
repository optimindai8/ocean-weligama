import { AdminLayout } from "@/components/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getAdminGetMatrixPricingQueryKey, useAdminGetMatrixPricing, useAdminUpdateMatrixPricing, getGetMatrixPricingQueryKey } from "@workspace/api-client-react";
import { Check, Loader2, Save } from "lucide-react";

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
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  const handlePriceChange = (roomId: string, packageId: string, value: string) => {
    const key = `${roomId}-${packageId}`;
    setEditingValues(prev => ({ ...prev, [key]: value }));
    // Clear saved indicator when editing again
    setSavedKeys(prev => ({ ...prev, [key]: false }));
  };

  const savePrice = (roomId: string, packageId: string) => {
    const key = `${roomId}-${packageId}`;
    const value = editingValues[key];
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
          toast({ title: "Price updated successfully" });
          // Invalidate both admin and public caches so the frontend table updates
          queryClient.invalidateQueries({ queryKey: getAdminGetMatrixPricingQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMatrixPricingQueryKey() });
          setSavingKey(null);
          // Show saved indicator & clear dirty state for this cell
          setSavedKeys(prev => ({ ...prev, [key]: true }));
          setEditingValues(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
          // Clear the saved checkmark after 2 seconds
          setTimeout(() => {
            setSavedKeys(prev => ({ ...prev, [key]: false }));
          }, 2000);
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
            <table className="w-full min-w-max text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left font-bold text-slate-700 whitespace-nowrap sticky left-0 z-40 bg-slate-50 shadow-[1px_0_0_0_#f1f5f9]">
                    Rooms
                  </th>
                  {packages.map(pkg => (
                    <th key={pkg.id} className="px-6 py-4 text-center font-bold text-[#0B3D5E] min-w-[200px]">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="">
                {rooms.map(room => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0">
                    <td className="px-6 py-5 font-bold text-slate-800 whitespace-nowrap sticky left-0 z-30 bg-white group-hover:bg-slate-50 shadow-[1px_0_0_0_#f1f5f9] transition-colors">
                      {room.name}
                    </td>
                    {packages.map(pkg => {
                      const key = `${room.id}-${pkg.id}`;
                      const originalVal = getPrice(room.id!, pkg.id!);
                      const currentVal = editingValues[key] !== undefined ? editingValues[key] : originalVal;
                      const isDirty = editingValues[key] !== undefined && editingValues[key] !== originalVal;
                      const isSaving = savingKey === key;
                      const isSaved = savedKeys[key];
                      
                      return (
                        <td key={key} className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">€</span>
                              <Input
                                value={currentVal}
                                onChange={(e) => handlePriceChange(room.id!, pkg.id!, e.target.value)}
                                className={`pl-7 pr-3 text-center font-bold h-11 rounded-xl border transition-all ${
                                  isDirty
                                    ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-200 focus-visible:ring-amber-400'
                                    : isSaved
                                    ? 'bg-emerald-50 border-emerald-300'
                                    : 'bg-slate-50 border-slate-200 focus-visible:ring-1 focus-visible:ring-[#0B3D5E] focus-visible:bg-white'
                                }`}
                                placeholder="0.00"
                              />
                            </div>
                            {/* Save button - appears when value is changed */}
                            {isDirty && (
                              <button
                                onClick={() => savePrice(room.id!, pkg.id!)}
                                disabled={isSaving}
                                className="flex items-center gap-1.5 px-3 h-11 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0B3D5E] to-[#1A6B8A] hover:from-[#0a3450] hover:to-[#155d78] shadow-md shadow-[#0B3D5E]/20 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {isSaving ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Save className="w-3.5 h-3.5" />
                                )}
                                Save
                              </button>
                            )}
                            {/* Saved indicator */}
                            {isSaved && !isDirty && (
                              <div className="flex items-center gap-1 px-2.5 h-9 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 animate-in fade-in duration-300">
                                <Check className="w-3.5 h-3.5" />
                                Saved
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
