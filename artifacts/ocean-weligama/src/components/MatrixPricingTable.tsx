import { useGetMatrixPricing, getGetMatrixPricingQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import { Sparkles, ArrowRight } from "lucide-react";

const EXCLUDED_PACKAGES = [
  "Moderate Surf / Guiding",
  "Full Surf Package",
  "Surf And Yoga Package"
];

const EXCLUDED_ROOMS = [
  "Mixed Dormitory Bed",
  "Private Single Room",
  "Private Double / Twin Room",
  "Private Triple Room"
];

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

  const filteredRooms = rooms.filter((r) => !EXCLUDED_ROOMS.includes(r.name!));
  const filteredPackages = (packages || []).filter(
    (p) => !EXCLUDED_PACKAGES.includes(p.name!)
  );

  const getPrice = (roomId: string, packageId: string) => {
    const p = prices?.find(p => p.roomId === roomId && p.packageId === packageId);
    return p ? p.dailyPrice : null;
  };

  if (filteredRooms.length === 0 || filteredPackages.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#F0F7FA] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#4BBCCC]/10 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#1A6B8A]/10 to-transparent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-[#0B3D5E]/10 text-[#1A6B8A] text-sm font-bold mb-4"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Transparent Pricing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-black text-[#0B3D5E]"
          >
            Perfect Packages, <span className="text-[#1A6B8A] italic font-light">Tailored for You</span>
          </motion.h2>
          <p className="text-muted-foreground font-light text-base md:text-lg">
            Find the perfect balance of surf, comfort, and value. Our daily rates combine your preferred accommodation with world-class surf experiences.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-[#0B3D5E]/10 border border-white overflow-hidden relative"
        >
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-[2.5rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] pointer-events-none" />
          
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 md:p-8 bg-[#0B3D5E] text-white font-serif font-bold text-xl md:text-2xl min-w-[250px] shadow-[4px_0_15px_rgba(0,0,0,0.1)] relative z-20">
                    Room Type
                    <div className="text-sm font-light text-white/70 font-sans mt-1">Select your comfort</div>
                  </th>
                  {filteredPackages.map((pkg, idx) => (
                    <th key={pkg.id} className="p-6 md:p-8 text-center bg-[#0B3D5E] relative min-w-[200px]">
                      {idx !== 0 && <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-white/10" />}
                      <div className="font-black text-lg md:text-xl text-amber-400 tracking-wide">
                        {pkg.name}
                      </div>
                      <div className="text-xs text-white/60 font-light mt-1 uppercase tracking-widest">
                        Per Person / Night
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0B3D5E]/5 bg-white">
                {filteredRooms.map((room, idx) => (
                  <tr key={room.id} className="group hover:bg-[#F8FBFC] transition-all duration-300">
                    <td className="p-6 md:p-8 font-bold text-[#0B3D5E] text-lg bg-white group-hover:bg-[#F8FBFC] transition-colors relative z-10 shadow-[2px_0_10px_rgba(0,0,0,0.03)] border-r border-[#0B3D5E]/5">
                      {room.name}
                      <div className="flex items-center gap-1 text-xs text-[#1A6B8A] opacity-0 group-hover:opacity-100 transition-opacity mt-2 font-medium">
                        View Details <ArrowRight className="w-3 h-3" />
                      </div>
                    </td>
                    {filteredPackages.map((pkg) => {
                      const price = getPrice(room.id!, pkg.id!);
                      return (
                        <td key={pkg.id} className="p-6 md:p-8 text-center border-l border-[#0B3D5E]/5 relative">
                          {price && price !== "0" && price !== "0.00" ? (
                            <div className="relative inline-flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 w-full max-w-[160px] mx-auto">
                              <span className="text-2xl font-black text-[#0B3D5E] group-hover:text-[#1A6B8A] transition-colors">
                                {formatPrice(parseFloat(price as string))}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-light text-2xl">-</span>
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
