import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";
import { ChevronDown, MessageCircle, HelpCircle, Waves, Plane, Bed, Wifi, CreditCard, Search, Map, Sun, CalendarCheck, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SEO, StructuredData } from "@/seo";

// Icon map for categories (matches by keyword)
const CATEGORY_ICONS: Record<string, React.ComponentType<any>> = {
  "The Stay": Bed,
  "Surf & Wellness": Waves,
  "Bookings & Payments": CreditCard,
  "The Journey": Plane,
};

function getCategoryIcon(category: string) {
  // Try exact match first
  if (CATEGORY_ICONS[category]) return CATEGORY_ICONS[category];
  // Fuzzy match
  if (category.toLowerCase().includes("stay") || category.toLowerCase().includes("room")) return Bed;
  if (category.toLowerCase().includes("surf") || category.toLowerCase().includes("yoga") || category.toLowerCase().includes("wellness")) return Waves;
  if (category.toLowerCase().includes("book") || category.toLowerCase().includes("payment") || category.toLowerCase().includes("cancel")) return CreditCard;
  if (category.toLowerCase().includes("journey") || category.toLowerCase().includes("travel") || category.toLowerCase().includes("transfer")) return Plane;
  return HelpCircle;
}

// Helper icon component since Lucide icons need to be imported
function Clock(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

const API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_URL || "http://localhost:8080"
  : "";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [dbFaqs, setDbFaqs] = useState<FaqItem[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // Fetch FAQs from database
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/faqs`);
        if (res.ok) {
          const data = await res.json();
          setDbFaqs(data);
        }
      } catch {
        // silently fall back to empty (will show no dynamic FAQs)
      } finally {
        setDbLoading(false);
      }
    })();
  }, []);

  // Build sections from DB FAQs
  const dbSections = useMemo(() => {
    const map: Record<string, FaqItem[]> = {};
    dbFaqs.forEach((f) => {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    });
    return Object.entries(map).map(([category, items]) => ({ category, items }));
  }, [dbFaqs]);

  const allCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(dbFaqs.map((f) => f.category))).sort()];
  }, [dbFaqs]);

  const filteredSections = useMemo(() => {
    return dbSections.map((section) => {
      const items = section.items.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...section, items };
    }).filter((section) => {
      const categoryMatch = activeCategory === "All" || section.category === activeCategory;
      return categoryMatch && section.items.length > 0;
    });
  }, [dbSections, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-[#0B3D5E] selection:bg-[#4BBCCC] selection:text-white overflow-hidden">
      <SEO
        title="Frequently Asked Questions — Ocean Air Weligama"
        description="Find answers to all questions regarding Ocean Air Weligama stays, surf lessons, airport transfers, cancellation policies & amenities."
        canonicalPath="/faq"
        keywords={["Weligama Hotel FAQ", "Ocean Weligama Questions", "Weligama Surf Camp Info", "Sri Lanka South Coast Stay Questions"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "FAQ", item: "/faq" },
        ]}
        faqs={dbFaqs.map((f) => ({ question: f.question, answer: f.answer }))}
      />
      
      <PageHero
        title="Frequently Asked Questions"
        description="Everything you need to know about your stay, surf packages, and the Ocean Weligama experience. Can't find an answer? Feel free to reach out to us directly."
        badgeText="Concierge Desk"
        badgeIcon={<HelpCircle className="w-3.5 h-3.5 text-[#4BBCCC]" />}
      />

      <main className="flex-1 py-20 relative" style={{ background: 'linear-gradient(160deg, #F0F4F8 0%, #E2EDF8 100%)' }}>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-teal-200/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-sky-200/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          
          {/* Interactive Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 relative group"
          >
            <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-2xl group-focus-within:bg-teal-400/30 transition-all duration-500" />
            <div className="relative flex items-center bg-white/60 backdrop-blur-xl border border-white/80 rounded-full p-2 shadow-lg focus-within:shadow-xl focus-within:border-teal-300 transition-all duration-300 hover:bg-white/80">
              <div className="p-3 text-teal-600 pl-6">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search questions or keywords... (e.g., 'airport', 'surfboard')" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIndex(null);
                }}
                className="flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground/60 py-3 pr-4"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="p-3 text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}
            </div>
          </motion.div>

          {/* Category Chips */}
          <div className="w-full flex overflow-x-auto hide-scrollbar smooth-inertia pt-2 pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
            <div className="flex gap-3 w-max mx-auto px-2">
              {allCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <motion.button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setOpenIndex(null);
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center justify-center px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-sm border backdrop-blur-md ${
                      isActive 
                        ? "bg-[#0B3D5E] text-white border-[#0B3D5E] shadow-lg shadow-[#0B3D5E]/20 scale-105" 
                        : "bg-white/40 text-slate-500 border-white/60 hover:border-teal-300 hover:text-[#0B3D5E] hover:bg-white/80"
                    }`}
                  >
                    <span className="relative z-10 whitespace-nowrap">{cat}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Accordion Content */}
          <div className="space-y-12">
            {dbLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-[#0B3D5E] animate-spin mb-4" />
                <p className="text-muted-foreground text-sm">Loading questions...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredSections.length > 0 ? filteredSections.map((section, sIdx) => {
                  const CategoryIcon = getCategoryIcon(section.category);
                  return (
                    <motion.div 
                      key={section.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.5, delay: sIdx * 0.1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-[#0B3D5E] text-white flex items-center justify-center shadow-lg shadow-[#0B3D5E]/20">
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-[#0B3D5E]">{section.category}</h2>
                      </div>
                      
                      <div className="space-y-3">
                        {section.items.map((faq, iIdx) => {
                          const id = `${section.category}-${faq.id}`;
                          const isOpen = openIndex === id;
                          
                          return (
                            <motion.div 
                              key={faq.id}
                              layout="position"
                              className={`group rounded-3xl border transition-all duration-400 overflow-hidden backdrop-blur-md ${
                                isOpen 
                                  ? "bg-white/90 border-teal-300 shadow-xl shadow-teal-500/10 scale-[1.01]" 
                                  : "bg-white/40 border-white/60 hover:border-teal-200 hover:bg-white/70 hover:shadow-lg"
                              }`}
                            >
                              <button 
                                onClick={() => setOpenIndex(isOpen ? null : id)}
                                className="w-full px-6 py-5 flex items-start sm:items-center justify-between text-left gap-4"
                              >
                                <div className="flex items-start sm:items-center gap-4 flex-1">
                                  <div className={`mt-0.5 sm:mt-0 p-2.5 rounded-xl transition-all duration-400 ${isOpen ? "bg-teal-500 text-white shadow-md shadow-teal-500/20" : "bg-white border border-white/60 text-slate-400 group-hover:text-teal-500 group-hover:border-teal-200 shadow-sm"}`}>
                                    <HelpCircle className="w-4 h-4" />
                                  </div>
                                  <span className={`text-base sm:text-lg font-bold transition-colors duration-300 flex-1 leading-snug ${isOpen ? "text-[#0B3D5E]" : "text-slate-600 group-hover:text-[#0B3D5E]"}`}>
                                    {faq.question}
                                  </span>
                                </div>
                                <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                                  isOpen 
                                    ? "border-teal-500 bg-teal-50 text-teal-600 rotate-180 shadow-sm" 
                                    : "border-white/60 text-slate-400 bg-white/40 group-hover:bg-white group-hover:border-teal-200 group-hover:text-teal-500"
                                }`}>
                                  <ChevronDown className="w-4 h-4" />
                                </div>
                              </button>
                              
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                                  >
                                    <div className="px-6 pb-6 pt-0 sm:pl-[4.5rem]">
                                      <p className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {faq.answer}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                }) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center border border-white/60 rounded-[3rem] bg-white/40 backdrop-blur-md shadow-lg"
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/80">
                      <Search className="w-10 h-10 text-teal-300" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B3D5E] mb-2">
                      {searchQuery ? "No results found" : "No FAQs yet"}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? `We couldn't find any questions matching "${searchQuery}".`
                        : "Check back soon — our team is adding answers."
                      }
                    </p>
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="mt-4 text-[#4BBCCC] font-bold hover:underline text-sm"
                      >
                        Clear search
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Premium Concierge CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-32 relative rounded-[4rem] overflow-hidden p-12 md:p-16 text-center shadow-[0_32px_80px_rgba(11,61,94,0.3)] border border-white/20 backdrop-blur-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,58,95,0.75) 100%)' }}
          >
            {/* Animated decorative background elements */}
            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-400/30 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-sky-400/20 blur-[80px] rounded-full pointer-events-none" />

            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 w-[40%] pointer-events-none z-0"
              style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)', skewX: '-15deg' }}
              animate={{ x: ['-200%', '350%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-md">Still have questions?</h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed font-light italic">
                If you couldn't find what you're looking for, our barefoot luxury concierge team is standing by to assist you personally.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="/contact" 
                  className="w-full sm:w-auto bg-white hover:bg-white/90 text-[#0B3D5E] px-10 py-4 rounded-full font-black tracking-widest text-sm uppercase transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 hover:scale-[1.03] overflow-hidden relative group"
                >
                  <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] translate-x-[-150%] group-hover:translate-x-[350%] transition-transform duration-700 ease-out pointer-events-none" />
                  <MessageCircle className="w-5 h-5 text-teal-500" />
                  Contact Concierge
                </a>
                <a 
                  href="https://wa.me/94765791763" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white/10 text-white backdrop-blur-md border border-white/30 px-10 py-4 rounded-full font-black tracking-widest text-sm uppercase hover:bg-white/20 transition-all flex items-center justify-center gap-3 hover:scale-[1.03] shadow-lg"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
