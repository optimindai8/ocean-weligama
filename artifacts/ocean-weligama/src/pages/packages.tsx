import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListServices, type Service } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Waves, Check, Sparkles, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/page-hero";

import { PackageComparisonTable } from "@/components/PackageComparisonTable";
import { MatrixPricingTable } from "@/components/MatrixPricingTable";
import { StayInStyleSection } from "@/components/stay-in-style-section";

export default function PackagesPage() {
  const { data: rawServices, isLoading } = useListServices();
  const services = rawServices as Service[] | undefined;
  
  // Separate main packages vs optional packages
  const optionalPackages = services?.filter(s => s.type === "optional" && s.isActive) || [];
  const experienceServices = optionalPackages.filter(s => !s.category?.toLowerCase().includes("package"));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0B3D5E] overflow-hidden">

      <PageHero
        title="Our Curated Packages"
        description="Choose your perfect journey. Whether looking for comprehensive packages or customizable optional experiences, we have something tailored just for you."
        badgeText="Ocean Air Surf & Wellness"
        badgeIcon={<Sparkles className="w-3.5 h-3.5 text-[#4BBCCC]" />}
      />

      {/* Comparison Table Section */}
      <section className="bg-white">
        <PackageComparisonTable />
      </section>

      {/* Matrix Pricing Section */}
      <MatrixPricingTable />

      <StayInStyleSection />

      {experienceServices.length > 0 && (
        <section className="py-28 relative overflow-hidden border-t border-[#0B3D5E]/5"
          style={{ background: 'linear-gradient(160deg, #EEF5FA 0%, #E6EFF6 40%, #EDF2F7 100%)' }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/70 text-indigo-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> Experience Weligama
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="text-3xl md:text-5xl font-serif font-bold italic text-[#0B3D5E] leading-tight"
              >
                Curate Your Perfect Stay
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16 }}
                className="text-slate-500 font-light text-base md:text-lg"
              >
                Everything you need for the perfect coastal escape
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experienceServices.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.09, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="group backdrop-blur-md border border-white/60 rounded-3xl p-7 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.62) 0%, rgba(238,245,253,0.52) 100%)' }}
                >
                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(79,172,254,0.04) 100%)' }}
                  />

                  {/* Emoji Icon */}
                  <div className="w-14 h-14 bg-white/70 border border-white/90 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 shadow-sm group-hover:bg-gradient-to-br group-hover:from-indigo-50 group-hover:to-sky-50 group-hover:border-indigo-100/70 relative z-10">
                    <span className="text-2xl">{exp.iconEmoji || '🌊'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif font-bold text-[#0B3D5E] mb-2 group-hover:text-indigo-700 transition-colors duration-300 relative z-10">
                    {exp.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500/90 font-light leading-relaxed mb-5 flex-1 line-clamp-2 relative z-10">
                    {exp.shortDesc || exp.description || 'Experience the best of Weligama.'}
                  </p>

                  {/* Explore Link */}
                  <Link
                    href={`/packages/${exp.slug}`}
                    className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-[#0B3D5E] transition-colors group/link w-fit relative z-10 mt-auto"
                  >
                    <span className="relative">
                      Explore
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#0B3D5E] group-hover/link:w-full transition-all duration-300" />
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-[#0B3D5E] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">Ready to start your Sri Lankan Escape?</h2>
          <p className="text-white/70 max-w-lg mx-auto font-light text-sm md:text-base">
            Select your favorite Surf Package, add-on optional packs, and lock in your spots for the upcoming season!
          </p>
          <motion.div 
            className="relative inline-block mt-8"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Glowing/pulsing rings for the heartbeat "lightning" effect */}
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-400 via-[#F0A500] to-yellow-500 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute -inset-1 bg-[#F0A500] rounded-full blur-md opacity-80 animate-pulse" style={{ animationDuration: '1.5s' }} />
            
            <Link href="/book" className="relative block z-10">
              <Button size="lg" className="rounded-full px-12 h-16 bg-[#F0A500] hover:bg-yellow-400 hover:text-[#0B3D5E] text-white text-lg font-black tracking-widest shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20">
                Check Availability
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
