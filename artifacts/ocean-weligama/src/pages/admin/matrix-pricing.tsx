import { AdminLayout } from "@/components/admin-layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { 
  getAdminGetMatrixPricingQueryKey, 
  useAdminGetMatrixPricing, 
  useAdminUpdateMatrixPricing, 
  getGetMatrixPricingQueryKey,
  useAdminUpdateRoom,
  useAdminUpdateService,
  Room,
  Service
} from "@workspace/api-client-react";
import { Check, Loader2, Save, Edit2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";

export default function AdminMatrixPricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matrixData, isLoading } = useAdminGetMatrixPricing({
    query: { queryKey: getAdminGetMatrixPricingQueryKey() },
  });

  const updatePrice = useAdminUpdateMatrixPricing();
  const updateRoomMutation = useAdminUpdateRoom();
  const updateServiceMutation = useAdminUpdateService();
  
  // Local state for editing to debounce / manage input
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  // Sort logic state
  const [editMode, setEditMode] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [localRooms, setLocalRooms] = useState<Room[]>([]);
  const [localPackages, setLocalPackages] = useState<Service[]>([]);

  useEffect(() => {
    if (matrixData?.rooms && matrixData?.packages) {
      setLocalRooms(matrixData.rooms as Room[]);
      setLocalPackages(matrixData.packages as Service[]);
      setHasOrderChanges(false);
    }
  }, [matrixData]);

  const handleMoveColLeft = (idx: number) => {
    if (idx === 0) return;
    const newPkgs = [...localPackages];
    [newPkgs[idx - 1], newPkgs[idx]] = [newPkgs[idx], newPkgs[idx - 1]];
    setLocalPackages(newPkgs);
    setHasOrderChanges(true);
  };

  const handleMoveColRight = (idx: number) => {
    if (idx === localPackages.length - 1) return;
    const newPkgs = [...localPackages];
    [newPkgs[idx], newPkgs[idx + 1]] = [newPkgs[idx + 1], newPkgs[idx]];
    setLocalPackages(newPkgs);
    setHasOrderChanges(true);
  };

  const handleMoveRowUp = (idx: number) => {
    if (idx === 0) return;
    const newRooms = [...localRooms];
    [newRooms[idx - 1], newRooms[idx]] = [newRooms[idx], newRooms[idx - 1]];
    setLocalRooms(newRooms);
    setHasOrderChanges(true);
  };

  const handleMoveRowDown = (idx: number) => {
    if (idx === localRooms.length - 1) return;
    const newRooms = [...localRooms];
    [newRooms[idx], newRooms[idx + 1]] = [newRooms[idx + 1], newRooms[idx]];
    setLocalRooms(newRooms);
    setHasOrderChanges(true);
  };

  const handleSaveOrder = async () => {
    try {
      setIsSavingOrder(true);
      
      const roomPromises = localRooms.map((room, idx) => 
        updateRoomMutation.mutateAsync({
          id: room.id!,
          data: { sortOrder: idx } as any
        })
      );
      
      const pkgPromises = localPackages.map((pkg, idx) => 
        updateServiceMutation.mutateAsync({
          id: pkg.id!,
          data: { sortOrder: idx } as any
        })
      );

      await Promise.all([...roomPromises, ...pkgPromises]);

      toast({ title: "Order saved successfully!" });
      setHasOrderChanges(false);
      setEditMode(false);
      queryClient.invalidateQueries({ queryKey: getAdminGetMatrixPricingQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetMatrixPricingQueryKey() });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to save order" });
      console.error(error);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handlePriceChange = (roomId: string, packageId: string, value: string) => {
    const key = `${roomId}-${packageId}`;
    setEditingValues(prev => ({ ...prev, [key]: value }));
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
          queryClient.invalidateQueries({ queryKey: getAdminGetMatrixPricingQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetMatrixPricingQueryKey() });
          setSavingKey(null);
          setSavedKeys(prev => ({ ...prev, [key]: true }));
          setEditingValues(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
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

  const { prices = [] } = matrixData || {};

  const getPrice = (roomId: string, packageId: string) => {
    const p = prices.find(p => p.roomId === roomId && p.packageId === packageId);
    return p ? p.dailyPrice : "";
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-black text-[#0B3D5E]">
              Matrix Pricing
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-sm">
              Set inclusive package prices (Room + Package) per night for each combination.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {editMode ? (
              <>
                <Button variant="outline" className="rounded-full" onClick={() => {
                  setEditMode(false);
                  setLocalRooms(matrixData?.rooms as Room[] || []);
                  setLocalPackages(matrixData?.packages as Service[] || []);
                  setHasOrderChanges(false);
                }}>
                  Cancel
                </Button>
                {hasOrderChanges && (
                  <Button onClick={handleSaveOrder} disabled={isSavingOrder} className="rounded-full bg-teal-600 hover:bg-teal-700 text-white">
                    {isSavingOrder ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Order
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={() => setEditMode(true)} className="rounded-full bg-[#0B3D5E] hover:bg-[#0B3D5E]/90 text-white shadow-lg shadow-[#0B3D5E]/20">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Order
              </Button>
            )}
          </div>
        </div>

        <div className={`bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border transition-all duration-300 ${editMode ? 'border-teal-300 ring-4 ring-teal-50' : 'border-slate-100'}`}>
          {editMode && (
             <div className="bg-teal-50 border-b border-teal-100 p-4 text-center">
               <p className="text-sm font-bold text-teal-800">EDIT MODE: Use the arrows to reorder rows and columns.</p>
             </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left font-bold text-slate-700 whitespace-nowrap sticky left-0 z-40 bg-slate-50 shadow-[1px_0_0_0_#f1f5f9]">
                    Rooms
                  </th>
                  {localPackages.map((pkg, idx) => (
                    <th key={pkg.id} className="px-6 py-4 text-center font-bold text-[#0B3D5E] min-w-[200px] relative">
                      {editMode && (
                        <div className="flex justify-center gap-1 mb-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-200" disabled={idx === 0} onClick={() => handleMoveColLeft(idx)}>
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-200" disabled={idx === localPackages.length - 1} onClick={() => handleMoveColRight(idx)}>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="">
                {localRooms.map((room, idx) => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0">
                    <td className="px-6 py-5 font-bold text-slate-800 whitespace-nowrap sticky left-0 z-30 bg-white group-hover:bg-slate-50 shadow-[1px_0_0_0_#f1f5f9] transition-colors">
                      <div className="flex items-center gap-3">
                        {editMode && (
                          <div className="flex flex-col gap-0.5 shrink-0 mr-1">
                            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-slate-200" disabled={idx === 0} onClick={() => handleMoveRowUp(idx)}>
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full hover:bg-slate-200" disabled={idx === localRooms.length - 1} onClick={() => handleMoveRowDown(idx)}>
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <span>{room.name}</span>
                      </div>
                    </td>
                    {localPackages.map(pkg => {
                      const key = `${room.id}-${pkg.id}`;
                      const originalVal = getPrice(room.id!, pkg.id!);
                      const currentVal = editingValues[key] !== undefined ? editingValues[key] : originalVal;
                      const isDirty = editingValues[key] !== undefined && editingValues[key] !== originalVal;
                      const isSaving = savingKey === key;
                      const isSaved = savedKeys[key];
                      
                      return (
                        <td key={key} className="px-6 py-5">
                          <div className={`flex items-center gap-2 transition-opacity duration-300 ${editMode ? 'opacity-30 pointer-events-none' : ''}`}>
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">€</span>
                              <Input
                                value={currentVal}
                                onChange={(e) => handlePriceChange(room.id!, pkg.id!, e.target.value)}
                                disabled={editMode}
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
                            {isDirty && !editMode && (
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
                            {isSaved && !isDirty && !editMode && (
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
