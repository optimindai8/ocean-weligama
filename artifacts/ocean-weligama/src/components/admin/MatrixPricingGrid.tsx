import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Room {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  slug: string;
}

interface PriceRecord {
  id: string;
  roomId: string;
  packageId: string;
  price: string;
  dailyPrice: string;
}

interface MatrixData {
  rooms: Room[];
  packages: Package[];
  prices: PriceRecord[];
}

export function MatrixPricingGrid() {
  const { toast } = useToast();
  const [data, setData] = useState<MatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingCells, setSavingCells] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      const isDev = import.meta.env.DEV;
      const apiUrl = isDev ? (import.meta.env.VITE_API_URL || "http://localhost:8080") : "";
      const res = await fetch(`${apiUrl}/v1/admin/matrix-pricing`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("ow-admin-token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch matrix data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      toast({
        title: "Error fetching matrix",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (roomId: string, packageId: string, value: string) => {
    if (!data) return;
    const newPrices = [...data.prices];
    const index = newPrices.findIndex(p => p.roomId === roomId && p.packageId === packageId);
    
    // Ensure we don't save invalid inputs
    const parsed = parseFloat(value);
    const validValue = isNaN(parsed) ? "0.00" : value;
    const daily = isNaN(parsed) ? "0.00" : (parsed / 7).toFixed(2);

    if (index >= 0) {
      newPrices[index] = { ...newPrices[index], price: validValue, dailyPrice: daily };
    } else {
      newPrices.push({
        id: "",
        roomId,
        packageId,
        price: validValue,
        dailyPrice: daily,
      });
    }
    setData({ ...data, prices: newPrices });
  };

  const saveCell = async (roomId: string, packageId: string) => {
    if (!data) return;
    const record = data.prices.find(p => p.roomId === roomId && p.packageId === packageId);
    if (!record) return;

    const cellKey = `${roomId}-${packageId}`;
    setSavingCells(prev => ({ ...prev, [cellKey]: true }));

    try {
      const isDev = import.meta.env.DEV;
      const apiUrl = isDev ? (import.meta.env.VITE_API_URL || "http://localhost:8080") : "";
      
      const payload = {
        roomId,
        packageId,
        price: record.price,
        dailyPrice: (parseFloat(record.price) / 7).toFixed(2),
      };

      const res = await fetch(`${apiUrl}/v1/admin/matrix-pricing`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("ow-admin-token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update price");
      
      toast({
        title: "Price updated",
        description: "The matrix price was saved successfully.",
      });
      
      // Refresh to get any updated daily prices from backend if needed
      await fetchMatrix();
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSavingCells(prev => ({ ...prev, [cellKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data || data.packages.length === 0) {
    return <div className="text-slate-500 italic">No packages found for matrix pricing.</div>;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-[#0B3D5E] sticky left-0 z-10 w-48">
              Room Types
            </th>
            {data.packages.map(pkg => (
              <th key={pkg.id} className="p-4 border-b border-l border-slate-200 bg-slate-50 font-bold text-[#0B3D5E] text-center min-w-[200px]">
                {pkg.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rooms.map(room => (
            <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 border-b border-slate-200 font-medium text-slate-700 sticky left-0 bg-white shadow-[1px_0_0_0_#e2e8f0]">
                {room.name}
              </td>
              {data.packages.map(pkg => {
                const record = data.prices.find(p => p.roomId === room.id && p.packageId === pkg.id);
                const val = record ? record.price : "0.00";
                const isSaving = savingCells[`${room.id}-${pkg.id}`];

                return (
                  <td key={pkg.id} className="p-4 border-b border-l border-slate-200 text-center">
                    <div className="flex flex-col gap-2 max-w-[150px] mx-auto">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">€</span>
                        <Input
                          type="number"
                          value={val}
                          onChange={(e) => handlePriceChange(room.id, pkg.id, e.target.value)}
                          className="pl-8 text-center font-bold text-[#0B3D5E] h-10 border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-[#0B3D5E]/20"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant={isSaving ? "secondary" : "outline"}
                        onClick={() => saveCell(room.id, pkg.id)}
                        disabled={isSaving}
                        className="h-8 text-xs font-bold w-full"
                      >
                        {isSaving ? "Saving..." : <><Save className="w-3 h-3 mr-1" /> Save</>}
                      </Button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
