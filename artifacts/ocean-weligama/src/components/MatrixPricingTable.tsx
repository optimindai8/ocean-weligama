import { useGetMatrixPricing, getGetMatrixPricingQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import { Sparkles, ArrowRight, CheckCircle2, Star } from "lucide-react";

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
        <Skeleton className="w-full h-96 rounded-[2rem]" />
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
    <section className="py-20 bg-[#FAF9F6] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-[#0B3D5E]/10 text-[#1A6B8A] text-xs font-bold mb-2 uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Transparent Pricing
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] leading-tight"
          >
            Perfect Packages, <br className="hidden md:block"/> <span className="text-[#1A6B8A] italic font-light">Tailored for You</span>
          </motion.h2>
          <p className="text-muted-foreground font-light text-sm md:text-base leading-relaxed px-4">
            Find the perfect balance of surf, comfort, and value. Our daily rates combine your preferred accommodation with world-class surf experiences.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative max-w-[1100px] mx-auto"
        >
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-5 md:p-6 bg-gradient-to-br from-slate-50 to-white text-[#0B3D5E] border-b border-slate-100 font-serif font-bold text-lg md:text-xl min-w-[220px] max-w-[280px] align-bottom">
                    Room Type
                    <div className="text-xs font-light text-slate-400 font-sans mt-1">Select your comfort</div>
                  </th>
                  {filteredPackages.map((pkg) => {
                    const isPopular = pkg.name?.toLowerCase().includes('advance');
                    return (
                      <th key={pkg.id} className={`p-4 md:p-6 text-center bg-white border-b border-slate-100 relative min-w-[160px] align-bottom ${isPopular ? 'border-t-4 border-t-teal-400' : ''}`}>
                        {isPopular && (
                          <div className="absolute inset-0 bg-gradient-to-b from-teal-50/40 to-transparent pointer-events-none rounded-t-none" />
                        )}
                        <div className="flex flex-col items-center justify-end h-full gap-2 relative z-10">
                          {isPopular && (
                            <span className="flex items-center gap-1.5 bg-gradient-to-r from-[#006064] via-[#00838F] to-[#26C6DA] text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-teal-200/50 uppercase tracking-[0.15em] mb-1">
                              <Star className="w-3 h-3 fill-white" /> Most Popular
                            </span>
                          )}
                          <div className={`font-bold text-sm md:text-base tracking-tight leading-snug whitespace-normal max-w-[180px] ${isPopular ? 'text-[#00838F]' : 'text-[#0B3D5E]'}`}>
                            {pkg.name}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="group transition-colors duration-200 hover:bg-slate-50/50">
                    <td className="p-5 md:p-6 text-sm md:text-base text-[#0B3D5E] bg-white group-hover:bg-slate-50/50 transition-colors relative z-10 font-medium border-r border-slate-50 leading-relaxed whitespace-normal max-w-[280px]">
                      {room.name}
                      <div className="flex items-center gap-1.5 text-[11px] text-[#4BBCCC] opacity-0 group-hover:opacity-100 transition-opacity mt-2 font-bold uppercase tracking-wider">
                        View Details <ArrowRight className="w-3 h-3" />
                      </div>
                    </td>
                    {filteredPackages.map((pkg) => {
                      const price = getPrice(room.id!, pkg.id!);
                      const isPopular = pkg.name?.toLowerCase().includes('advance');
                      return (
                        <td key={pkg.id} className={`p-4 md:p-6 text-center relative transition-colors duration-200 ${isPopular ? 'bg-teal-50/10' : ''}`}>
                          {price && price !== "0" && price !== "0.00" ? (
                            <div className="flex flex-col items-center justify-center gap-1 group/price">
                              <span className={`text-lg md:text-xl font-black transition-colors tracking-tight ${isPopular ? 'text-[#00838F]' : 'text-[#0B3D5E]'}`}>
                                {formatPrice(parseFloat(price as string))}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-200 font-light text-xl">-</span>
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
