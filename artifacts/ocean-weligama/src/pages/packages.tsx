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

      {/* Experience Weligama Section */}
      {experienceServices.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-[#F0F7FA] to-[#E8F1F5] border-t border-[#0B3D5E]/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-serif font-bold italic text-[#0B3D5E]"
              >
                Experience Weligama
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground font-light text-base md:text-lg"
              >
                Everything you need for the perfect coastal escape
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experienceServices.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="group bg-white/90 backdrop-blur-sm border border-[#0B3D5E]/5 rounded-3xl p-8 hover:shadow-xl hover:shadow-[#0B3D5E]/8 transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  {/* Emoji Icon */}
                  <div className="w-14 h-14 bg-gradient-to-br from-[#F0F7FA] to-[#E0EFF5] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                    <span className="text-2xl">{exp.iconEmoji || '🌊'}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-bold text-[#0B3D5E] mb-2 group-hover:text-[#1A6B8A] transition-colors">
                    {exp.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 font-light leading-relaxed mb-4 flex-1 line-clamp-2">
                    {exp.shortDesc || exp.description || 'Experience the best of Weligama.'}
                  </p>

                  {/* Explore Link */}
                  <Link
                    href={`/packages/${exp.slug}`}
                    className="inline-flex items-center gap-2 text-[#1A6B8A] font-bold text-sm hover:text-[#0B3D5E] transition-colors group/link w-fit"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
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
