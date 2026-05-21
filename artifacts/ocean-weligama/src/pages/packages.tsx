import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useListServices, type Service } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Waves, Check, Sparkles, HelpCircle } from "lucide-react";

export default function PackagesPage() {
  const { data: rawServices, isLoading } = useListServices();
  const services = rawServices as Service[] | undefined;
  
  // Tab control for Optional Packages
  const [activeCategory, setActiveCategory] = useState("Beginner Surf Packages");

  // Separate main packages vs optional packages
  const mainPackages = services?.filter(s => s.type === "main" && s.isActive) || [];
  const optionalPackages = services?.filter(s => s.type === "optional" && s.isActive) || [];

  // Filter optional packages by active tab category
  const filteredOptionalPackages = optionalPackages.filter(
    s => s.category === activeCategory
  );

  const categories = [
    { id: "Beginner Surf Packages", label: "Beginner Surf" },
    { id: "Advance Surf Packages", label: "Advanced Surf" },
    { id: "Yoga Retreat Packages", label: "Yoga Retreats" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0B3D5E] overflow-hidden">

      {/* Hero */}
      <section className="relative pt-44 pb-28 bg-[#0B3D5E] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/4 w-full h-full bg-[#4BBCCC]/25 rounded-full blur-[120px]" 
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#4BBCCC] font-bold tracking-[0.4em] uppercase text-xs mb-4 block"
          >
            Ocean Air Surf &amp; Wellness
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight"
          >
            Our Curated Packages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Choose your perfect journey. Whether looking for comprehensive packages or customizable optional experiences, we have something tailored just for you.
          </motion.p>
        </div>
      </section>

      {/* Section 1: Surf Packages (Main Packages) */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[#1A6B8A] font-bold tracking-[0.2em] uppercase text-xs">All-Inclusive</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Surf Packages</h2>
          <p className="text-muted-foreground font-light text-base md:text-lg">
            Our premier, multi-night packages complete with accommodation, meals, guided surf lessons, and exclusive perks.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[550px] rounded-[2.5rem]" />
            ))}
          </div>
        ) : mainPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {mainPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative flex flex-col bg-white border border-[#0B3D5E]/10 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-[#0B3D5E]/10 transition-all duration-500"
              >
                {/* Image Aspect */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {pkg.imageUrl ? (
                    <img 
                      src={pkg.imageUrl} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A6B8A]/10 flex items-center justify-center text-[#1A6B8A]">
                      <Sparkles className="w-10 h-10 opacity-40 animate-pulse" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#0B3D5E] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-white/40 shadow-sm">
                    Surf Main
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif font-bold text-[#0B3D5E] group-hover:text-[#1A6B8A] transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-2xl font-black text-[#1A6B8A]">
                        €{pkg.basePrice}
                      </p>
                    </div>

                    <p className="text-muted-foreground text-sm font-light line-clamp-3">
                      {pkg.description || "Indulge in a premium surf experience featuring top-notch local guidance, safety, and modern comfort."}
                    </p>

                    {pkg.highlights && pkg.highlights.length > 0 && (
                      <div className="border-t border-[#0B3D5E]/10 pt-4 space-y-2.5">
                        {pkg.highlights.slice(0, 6).map((item, index) => (
                          <div key={index} className="flex items-start gap-2.5 text-xs text-foreground/80">
                            <Check className="w-4 h-4 text-[#4BBCCC] flex-shrink-0 mt-0.5" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                        {pkg.highlights.length > 6 && (
                          <p className="text-[10px] text-[#1A6B8A] font-semibold italic pl-6">
                            + {pkg.highlights.length - 6} more highlights
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <Link href={`/packages/${pkg.slug}`} className="flex-1">
                      <Button className="w-full rounded-full bg-[#0B3D5E] hover:bg-[#1A6B8A] text-white font-semibold py-6 shadow-md transition-all duration-300">
                        View Details
                      </Button>
                    </Link>
                    {pkg.isBookable && (
                      <Link href={`/book?service=${pkg.slug}`}>
                        <Button variant="outline" size="icon" className="rounded-full border-[#0B3D5E]/20 w-12 h-12 text-[#0B3D5E] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300" title="Book Now">
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-border/80">
            <Waves className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-light">No surf packages available at the moment.</p>
          </div>
        )}
      </section>

      {/* Section 2: Optional Packages (Add-on Packages) */}
      <section className="py-24 bg-[#0B3D5E]/5 border-t border-[#0B3D5E]/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[#1A6B8A] font-bold tracking-[0.2em] uppercase text-xs">Flexible Add-ons</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold">Optional Packages</h2>
            <p className="text-muted-foreground font-light text-base md:text-lg">
              Enhance your experience. Grouped by tier, pick these custom bundles to build your dream vacation.
            </p>

            {/* Premium Interactive Tabs */}
            <div className="w-full flex overflow-x-auto hide-scrollbar smooth-inertia whitespace-nowrap gap-2 md:justify-center md:gap-4 pt-6 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-[#0B3D5E] text-white border-[#0B3D5E] shadow-lg shadow-[#0B3D5E]/10"
                      : "bg-white text-muted-foreground hover:text-[#0B3D5E] hover:border-[#0B3D5E]/30 border-[#0B3D5E]/10"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-96 rounded-[2.5rem]" />
                ))
              ) : filteredOptionalPackages.length > 0 ? (
                filteredOptionalPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="group bg-white border border-[#0B3D5E]/5 rounded-[2.5rem] p-6 hover:shadow-xl hover:shadow-[#0B3D5E]/5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Image Thumbnail or Icon */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-4">
                        {pkg.imageUrl ? (
                          <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-[#4BBCCC]/10 flex items-center justify-center text-[#4BBCCC]">
                            <Sparkles className="w-8 h-8 opacity-40" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#1A6B8A] tracking-wider bg-[#1A6B8A]/10 px-2 py-0.5 rounded">
                          {catLabel(pkg.category)}
                        </span>
                        <h3 className="text-xl font-bold font-serif text-[#0B3D5E] pt-1">
                          {pkg.name}
                        </h3>
                        <p className="text-xl font-black text-[#1A6B8A]">
                          €{pkg.basePrice}
                        </p>
                      </div>

                      {pkg.highlights && pkg.highlights.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {pkg.highlights.map((item, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs text-foreground/75">
                              <Check className="w-3.5 h-3.5 text-[#4BBCCC] flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-border flex items-center gap-4">
                      <Link href={`/packages/${pkg.slug}`} className="flex-1">
                        <Button variant="outline" className="w-full rounded-full border-[#0B3D5E]/20 text-[#0B3D5E] hover:bg-[#0B3D5E] hover:text-white transition-all duration-300">
                          More Info
                        </Button>
                      </Link>
                      {pkg.isBookable && (
                        <Link href={`/book?service=${pkg.slug}`}>
                          <Button className="rounded-full bg-[#1A6B8A] hover:bg-[#1A6B8A]/90 text-white font-semibold">
                            Add
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-[2.5rem] border border-[#0B3D5E]/10 p-8">
                  <HelpCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4 animate-pulse" />
                  <p className="text-muted-foreground font-light">No optional packages listed under this category yet.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0B3D5E] relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">Ready to start your Sri Lankan Escape?</h2>
          <p className="text-white/70 max-w-lg mx-auto font-light text-sm md:text-base">
            Select your favorite Surf Package, add-on optional packs, and lock in your spots for the upcoming season!
          </p>
          <Link href="/book">
            <Button size="lg" className="rounded-full px-12 h-16 bg-[#F0A500] hover:bg-[#D99500] text-white text-lg font-bold shadow-xl shadow-[#F0A500]/20 transition-all duration-300">
              Check Availability
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function catLabel(cat: string | null | undefined): string {
  if (!cat) return "Optional";
  if (cat.toLowerCase().includes("beginner")) return "Beginner";
  if (cat.toLowerCase().includes("advance")) return "Advanced";
  if (cat.toLowerCase().includes("yoga")) return "Yoga";
  return cat;
}
