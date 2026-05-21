import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "@/components/footer";
import { ChevronDown, MessageCircle, HelpCircle, Waves, Plane, Bed } from "lucide-react";

const FAQ_DATA = [
  {
    category: "The Stay",
    icon: Bed,
    items: [
      {
        question: "What is the check-in and check-out time?",
        answer: "Check-in is from 2:00 PM, and check-out is by 11:00 AM. If you need an earlier check-in or later check-out, please let us know and we will do our best to accommodate you."
      },
      {
        question: "Is breakfast included in the room rate?",
        answer: "Most of our rates include a delicious Sri Lankan or Continental breakfast served on our ocean-view terrace. Please check your booking details for confirmation."
      }
    ]
  },
  {
    category: "The Waves",
    icon: Waves,
    items: [
      {
        question: "How far is the beach from the guest house?",
        answer: "We are located just steps away from the beautiful Weligama beach. You can walk to the surf in less than 2 minutes."
      },
      {
        question: "Are there surfing lessons available?",
        answer: "Absolutely! We partner with local surf schools to provide high-quality lessons for all levels, from beginners to advanced surfers."
      }
    ]
  },
  {
    category: "The Journey",
    icon: Plane,
    items: [
      {
        question: "Do you offer airport transfers?",
        answer: "Yes, we can arrange private airport transfers from Bandaranaike International Airport (CMB) directly to Ocean Air. Please contact us with your flight details to book."
      }
    ]
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const categories = ["All", ...FAQ_DATA.map(d => d.category)];

  const filteredFaqs = FAQ_DATA.filter(cat => 
    activeCategory === "All" || cat.category === activeCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      
      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white blur-[120px] rounded-full animate-pulse" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8"
          >
            <HelpCircle className="w-4 h-4 text-accent" />
            <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">Concierge Desk</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-0"
          >
            How Can We <br/> Help You Today?
          </motion.h1>
        </div>
      </section>

      <main className="flex-1 py-24 bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Category Chips */}
          <div className="w-full flex overflow-x-auto hide-scrollbar smooth-inertia whitespace-nowrap gap-3 mb-10 pb-2 md:mb-20 justify-start md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-500 whitespace-nowrap ${
                  activeCategory === cat 
                    ? "bg-primary text-white shadow-xl scale-105" 
                    : "bg-white text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Content */}
          <div className="space-y-16">
            {filteredFaqs.map((section, sIdx) => (
              <motion.div 
                key={section.category}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sIdx * 0.1 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <section.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">{section.category}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((faq, iIdx) => {
                    const id = `${sIdx}-${iIdx}`;
                    const isOpen = openIndex === id;
                    
                    return (
                      <motion.div 
                        key={id}
                        className={`group rounded-3xl border transition-all duration-500 overflow-hidden ${
                          isOpen ? "bg-white border-primary shadow-2xl" : "bg-white/50 border-border hover:border-primary/30"
                        }`}
                      >
                        <button 
                          onClick={() => setOpenIndex(isOpen ? null : id)}
                          className="w-full px-5 sm:px-8 py-4 sm:py-6 flex items-center justify-between text-left"
                        >
                          <span className={`text-base sm:text-lg font-bold transition-colors duration-300 ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                            {faq.question}
                          </span>
                          <div className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}>
                            <ChevronDown className={`w-5 h-5 ${isOpen ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                            >
                              <div className="px-5 pb-5 sm:px-8 sm:pb-8 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                <div className="pt-2 border-t border-muted/50">
                                  {faq.answer}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
            

          </div>

          {/* Premium Concierge CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 relative rounded-[3rem] overflow-hidden bg-primary p-12 md:p-20 text-center"
          >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10 max-w-xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">Still Curious?</h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed">
                If you couldn't find what you're looking for, our barefoot luxury team is standing by to help you personally.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a 
                  href="/contact" 
                  className="w-full sm:w-auto bg-accent text-primary px-10 py-4 rounded-full font-bold hover:bg-white transition-all shadow-xl hover:shadow-accent/20 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Concierge
                </a>
                <a 
                  href="https://wa.me/94765791763" 
                  className="text-white font-bold hover:text-accent transition-colors underline underline-offset-8"
                >
                  Chat with us now
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
