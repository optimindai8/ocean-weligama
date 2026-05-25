import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";
import { ChevronDown, MessageCircle, HelpCircle, Waves, Plane, Bed, Wifi, CreditCard, Search, Map, Sun, Surfboard, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/page-hero";

const FAQ_DATA = [
  {
    category: "The Stay",
    icon: Bed,
    items: [
      {
        question: "What is the check-in and check-out time?",
        icon: Clock,
        answer: "Check-in begins at 2:00 PM, and check-out is by 11:00 AM. We understand travel schedules can vary, so if you need an earlier check-in or a later check-out, please contact our concierge in advance and we will do our absolute best to accommodate you based on availability."
      },
      {
        question: "Is breakfast included in the room rate?",
        icon: Sun,
        answer: "Yes, most of our direct bookings and packages include a complimentary, freshly prepared breakfast. You can choose between a hearty traditional Sri Lankan breakfast or a healthy Continental option, served daily in our ocean-view dining area."
      },
      {
        question: "Do you have high-speed Wi-Fi available?",
        icon: Wifi,
        answer: "Absolutely. We provide complimentary high-speed fiber-optic Wi-Fi throughout the entire property, including all rooms, common areas, and the restaurant, making it perfect for remote workers or sharing your vacation moments."
      },
      {
        question: "Are all rooms air-conditioned?",
        icon: Sparkles,
        answer: "Yes, every room at Ocean Weligama is fully air-conditioned and features ceiling fans, ensuring you have a cool and comfortable sanctuary to return to after a long day in the tropical sun."
      },
      {
        question: "Can I request a late check-out?",
        icon: CalendarCheck,
        answer: "Late check-outs are subject to room availability on the day of your departure. A half-day charge may apply for check-outs past 2:00 PM. We also offer secure luggage storage and access to our lounge and shower facilities if you have a late flight."
      }
    ]
  },
  {
    category: "Surf & Wellness",
    icon: Waves,
    items: [
      {
        question: "How far is the beach from the guest house?",
        icon: Map,
        answer: "Ocean Weligama is located just a stone's throw away from Weligama beach. A short, beautiful 2-minute walk is all it takes to feel the sand between your toes and paddle out to the lineup."
      },
      {
        question: "Are surfing lessons suitable for complete beginners?",
        icon: Waves,
        answer: "Yes! Weligama is globally renowned as one of the best and safest bays for beginner surfers. Our ISA-certified instructors provide personalized, step-by-step guidance ensuring you catch your very first wave safely and confidently."
      },
      {
        question: "Do I need to bring my own surfboard?",
        icon: Surfboard,
        answer: "Not at all. We have a comprehensive quiver of high-quality surfboards for rent, ranging from soft-top longboards for beginners to performance shortboards for advanced riders. You can rent them daily or include them in your package."
      },
      {
        question: "Are yoga classes included in my stay?",
        icon: Sun,
        answer: "Yoga sessions are included if you book our specialized 'Yoga & Surf Retreat Package'. For guests on room-only or surf-only packages, you can easily add morning or sunset yoga sessions as an optional 'Experience' during or after booking."
      },
      {
        question: "Do you offer packages for advanced surfers?",
        icon: ShieldCheck,
        answer: "Yes, we offer an 'Advanced Surf Package' tailored for experienced surfers. Instead of basic lessons, this package includes guided surf trips to hidden reef breaks around the south coast (like Mirissa, Midigama, and Ram's) with our local surf guides."
      }
    ]
  },
  {
    category: "Bookings & Payments",
    icon: CreditCard,
    items: [
      {
        question: "How does the deposit and payment system work?",
        icon: CreditCard,
        answer: "To secure your reservation, we typically require a 25% to 50% deposit depending on the package, payable securely online. The remaining balance can be settled upon arrival at the property via credit card or cash."
      },
      {
        question: "What is your cancellation policy?",
        icon: ShieldCheck,
        answer: "Bookings cancelled up to 14 days before arrival receive a full refund of the deposit. Cancellations within 14 days of arrival may incur a fee. We always recommend comprehensive travel insurance to cover unexpected changes to your plans."
      },
      {
        question: "Can I customize my package with different add-ons?",
        icon: Sparkles,
        answer: "Absolutely. Our booking engine allows you to first select your preferred Surf or Yoga package, and then independently add specific 'Experiences' such as Whale Watching, Safari Trips, Cookery Classes, or Scooter Rentals to create your perfect bespoke itinerary."
      }
    ]
  },
  {
    category: "The Journey",
    icon: Plane,
    items: [
      {
        question: "Do you offer airport transfers from Colombo (CMB)?",
        icon: Plane,
        answer: "Yes, we provide seamless, private, air-conditioned airport transfers directly from Bandaranaike International Airport (CMB) to Ocean Weligama. You can seamlessly add this to your booking during checkout by providing your flight details."
      },
      {
        question: "What other activities can I do around Weligama?",
        icon: Map,
        answer: "Beyond surfing and yoga, the south coast is vibrant and full of adventure! We can arrange whale watching tours in Mirissa, Udawalawe National Park safaris, local Sri Lankan cookery classes, and scooter rentals to explore hidden beaches."
      }
    ]
  }
];

// Helper icon component since Lucide icons need to be imported
function Clock(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const categories = ["All", ...FAQ_DATA.map(d => d.category)];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.map(section => {
      const items = section.items.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...section, items };
    }).filter(section => {
      const categoryMatch = activeCategory === "All" || section.category === activeCategory;
      return categoryMatch && section.items.length > 0;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0B3D5E] selection:bg-primary selection:text-white overflow-hidden">
      
      <PageHero
        title="Frequently Asked Questions"
        description="Everything you need to know about your stay, surf packages, and the Ocean Weligama experience. Can't find an answer? Feel free to reach out to us directly."
        badgeText="Concierge Desk"
        badgeIcon={<HelpCircle className="w-3.5 h-3.5 text-[#4BBCCC]" />}
      />

      <main className="flex-1 py-20 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute bottom-[20%] left-[-10%] w-[30rem] h-[30rem] bg-[#4BBCCC]/5 rounded-full blur-3xl mix-blend-multiply" />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          
          {/* Interactive Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 relative group"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-all duration-500" />
            <div className="relative flex items-center bg-white border border-[#0B3D5E]/10 rounded-2xl p-2 shadow-sm focus-within:shadow-md focus-within:border-[#0B3D5E]/30 transition-all duration-300">
              <div className="p-3 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Search questions or keywords... (e.g., 'airport', 'surfboard')" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setOpenIndex(null); // Close accordion on search
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

          {/* Category Chips with Animated Background */}
          <div className="w-full flex overflow-x-auto hide-scrollbar smooth-inertia pt-2 pb-6 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
            <div className="flex gap-2 p-1.5 bg-white border border-[#0B3D5E]/10 rounded-full shadow-sm w-max mx-auto">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setOpenIndex(null);
                    }}
                    className={`relative px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300 ${
                      isActive ? "text-white" : "text-muted-foreground hover:text-[#0B3D5E]"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeCategoryIndicator"
                        className="absolute inset-0 bg-[#0B3D5E] rounded-full shadow-md"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accordion Content */}
          <div className="space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.length > 0 ? filteredFaqs.map((section, sIdx) => (
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
                      <section.icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-[#0B3D5E]">{section.category}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {section.items.map((faq, iIdx) => {
                      const id = `${section.category}-${iIdx}`;
                      const isOpen = openIndex === id;
                      const Icon = faq.icon;
                      
                      return (
                        <motion.div 
                          key={id}
                          layout="position"
                          className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                            isOpen 
                              ? "bg-white border-[#0B3D5E] shadow-xl shadow-[#0B3D5E]/5" 
                              : "bg-white/80 border-[#0B3D5E]/10 hover:border-[#0B3D5E]/30 hover:bg-white"
                          }`}
                        >
                          <button 
                            onClick={() => setOpenIndex(isOpen ? null : id)}
                            className="w-full px-6 py-5 flex items-start sm:items-center justify-between text-left gap-4"
                          >
                            <div className="flex items-start sm:items-center gap-4 flex-1">
                              <div className={`mt-0.5 sm:mt-0 p-2 rounded-lg transition-colors duration-300 ${isOpen ? "bg-[#0B3D5E]/5 text-[#0B3D5E]" : "bg-muted text-muted-foreground group-hover:bg-[#0B3D5E]/5 group-hover:text-[#0B3D5E]"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-base sm:text-[17px] font-bold transition-colors duration-300 flex-1 leading-snug ${isOpen ? "text-[#0B3D5E]" : "text-[#0B3D5E]/80 group-hover:text-[#0B3D5E]"}`}>
                                {faq.question}
                              </span>
                            </div>
                            <div className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                              isOpen 
                                ? "border-[#0B3D5E] bg-[#0B3D5E] text-white rotate-180" 
                                : "border-border text-muted-foreground group-hover:border-[#0B3D5E]/30 group-hover:text-[#0B3D5E]"
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
                                  <p className="text-[15px] text-muted-foreground leading-relaxed">
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
              )) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-16 text-center border border-dashed border-[#0B3D5E]/20 rounded-[2rem] bg-white/50"
                >
                  <Search className="w-12 h-12 text-[#0B3D5E]/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#0B3D5E] mb-2">No results found</h3>
                  <p className="text-muted-foreground">We couldn't find any questions matching "{searchQuery}".</p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-[#4BBCCC] font-bold hover:underline text-sm"
                  >
                    Clear search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Premium Concierge CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-32 relative rounded-[2.5rem] overflow-hidden bg-[#0B3D5E] p-12 md:p-16 text-center group"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 transition-opacity duration-700 group-hover:opacity-20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Still have questions?</h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed font-light">
                If you couldn't find what you're looking for, our barefoot luxury concierge team is standing by to assist you personally.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="/contact" 
                  className="w-full sm:w-auto bg-[#F0A500] text-white px-10 py-4 rounded-full font-bold hover:bg-[#D99500] transition-all shadow-xl shadow-[#F0A500]/20 flex items-center justify-center gap-3 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Concierge
                </a>
                <a 
                  href="https://wa.me/94765791763" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-white/10 text-white backdrop-blur-md border border-white/20 px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-3"
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
