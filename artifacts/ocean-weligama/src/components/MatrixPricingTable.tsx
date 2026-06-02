import { useGetMatrixPricing, getGetMatrixPricingQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";

export function MatrixPricingTable() {
  const { formatPrice } = useLanguage();
  const { data: matrixData, isLoading } = useGetMatrixPricing({
    query: { queryKey: getGetMatrixPricingQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Skeleton className="w-full h-96 rounded-[2.5rem]" />
      </div>
    );
  }

  if (!matrixData || !matrixData.rooms || matrixData.rooms.length === 0) {
    return null;
  }

  const { rooms, packages, prices } = matrixData;

  const getPrice = (roomId: string, packageId: string) => {
    const p = prices?.find(p => p.roomId === roomId && p.packageId === packageId);
    return p ? p.dailyPrice : null;
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#1A6B8A] font-bold tracking-[0.2em] uppercase text-xs block"
          >
            All-Inclusive Rates
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E]"
          >
            Room & Package Rates
          </motion.h2>
          <p className="text-muted-foreground font-light text-base md:text-lg">
            Daily rates including your room and selected package.
          </p>
          <div className="w-24 h-1 bg-[#4BBCCC] mx-auto rounded-full mt-6" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-[#0B3D5E]/5 border border-[#0B3D5E]/10 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F6]">
                  <th className="p-6 md:p-8 font-serif font-bold text-[#0B3D5E] text-lg border-b border-[#0B3D5E]/10 min-w-[200px]">
                    Room Type
                  </th>
                  {packages?.map((pkg) => (
                    <th key={pkg.id} className="p-6 md:p-8 text-center font-bold text-[#0B3D5E] border-b border-l border-[#0B3D5E]/10 min-w-[200px]">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3D5E]/5">
                {rooms.map((room, idx) => (
                  <tr key={room.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="p-6 md:p-8 font-bold text-[#0B3D5E]">
                      {room.name}
                    </td>
                    {packages?.map((pkg) => {
                      const price = getPrice(room.id, pkg.id);
                      return (
                        <td key={pkg.id} className="p-6 md:p-8 text-center border-l border-[#0B3D5E]/5 font-medium text-slate-600">
                          {price ? (
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-xl font-bold text-[#1A6B8A]">{formatPrice(price)}</span>
                              <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Per Night</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
