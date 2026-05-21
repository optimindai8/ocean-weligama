import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "@/components/footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Waves, Sun, Wind, Anchor, Camera, Compass } from "lucide-react";

const PHILOSOPHY = [
  { icon: Waves, title: "Ocean Proximity", desc: "100 steps to the surf. We believe life is better lived with sand between your toes." },
  { icon: Sun, title: "Solar Pacing", desc: "We follow the rhythm of the sun, from dawn patrols to golden hour dinners." },
  { icon: Heart, title: "Authentic Soul", desc: "Not a hotel, but a home. Real Sri Lankan hospitality, from our family to yours." },
  { icon: Anchor, title: "Rooted Luxury", desc: "Barefoot comfort meets curated design. Luxury that doesn't feel forced." },
];

const AREA_GUIDE = [
  { name: "Weligama Bay", desc: "The crown jewel of beginner surf. Safe, shallow, and endlessly beautiful.", distance: "2 min walk", icon: Waves },
  { name: "Mirissa Harbor", desc: "Where the giants of the deep roam. World-class whale watching experiences.", distance: "10 min drive", icon: Anchor },
  { name: "Historic Galle", desc: "Colonial echoes meet modern boutiques in this UNESCO-protected fort city.", distance: "30 min drive", icon: Camera },
  { name: "Secret Surf Spots", desc: "From Midigama to Ahangama, we know every hidden reef and point break.", distance: "15 min drive", icon: Compass },
];

export default function AboutPage() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">

      {/* Cinematic Hero Anchor */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
          <img 
            src="/gallery-beach-coastline.jpg" 
            className="w-full h-full object-cover scale-110" 
            alt="Weligama Coastline"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/30" />
        </motion.div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 mb-8"
          >
            <Waves className="w-4 h-4 text-accent" />
            <span className="text-white text-[10px] font-bold tracking-[0.4em] uppercase drop-shadow-md">Born from the tides</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-9xl font-serif font-bold text-white mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            Ocean Air
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-xl md:text-3xl text-white/95 font-serif italic max-w-2xl mx-auto px-2 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          >
            "A surfer's dream, a traveler's home, and the soul of the Southern Coast."
          </motion.p>
        </div>
      </section>

      {/* The Origin Narrative */}
      <section className="py-16 sm:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -left-10 -top-10 text-[15rem] font-serif font-black text-muted/20 -z-10 select-none">
                "
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-primary mb-6 sm:mb-10 leading-tight">
                Where the Sand Meets <br/> Our Story
              </h2>
              <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Ocean Air Weligama wasn't built from a blueprint; it was built from a feeling. A feeling of waking up to the smell of salt air, of catching the first light on the waves, and of gathering around a table of fresh curry as the sun dips below the horizon.
                </p>
                <p>
                  We are a family-run boutique destination dedicated to the art of "Barefoot Luxury." We believe that true luxury isn't about marble floors—it's about the perfect view, the warmest smile, and the knowledge that you are exactly where you belong.
                </p>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <Link href="/book">
                  <Button className="bg-primary text-white rounded-full px-10 py-6 h-auto text-lg shadow-2xl hover:scale-105 transition-transform">
                    Stay With Us
                  </Button>
                </Link>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-primary italic">The Team</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Ocean Air Weligama</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="/gallery-interior.png" 
                className="w-full h-full object-cover" 
                alt="Our Interior"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Barefoot Philosophy Grid */}
      <section className="py-16 sm:py-32 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <span className="text-primary font-black tracking-[0.4em] uppercase text-xs mb-4 block">Our Pillars</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground">The Barefoot Philosophy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {PHILOSOPHY.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-border"
              >
                <div className="absolute -inset-2 bg-primary/5 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center mx-auto mb-8 transition-transform group-hover:rotate-12">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Guide */}
      <section className="py-16 sm:py-32 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-4 block">Insider Knowledge</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground">Weligama Discovery Guide</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-sm">
            We don't just host you; we guide you to the hidden rhythms of the South Coast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {AREA_GUIDE.map((place, idx) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-border hover:border-primary transition-colors flex flex-col justify-between"
            >
              <div>
                <place.icon className="w-10 h-10 text-accent mb-8" />
                <h3 className="text-xl font-bold text-foreground mb-2">{place.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">{place.desc}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary">
                <MapPin className="w-4 h-4" />
                {place.distance}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final Invitation */}
      <section className="py-20 sm:py-40 bg-primary relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-serif font-bold text-white mb-8">Ready to Write <br/> Your Island Story?</h2>
          <p className="text-white/80 text-xl mb-12 leading-relaxed">
            The surf is clean, the air is salt-sweet, and your room is waiting. Join us for a stay that feels less like a holiday and more like a homecoming.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-accent text-primary px-8 sm:px-16 py-6 sm:py-8 rounded-full font-bold text-base sm:text-xl shadow-2xl hover:bg-white transition-all">
              Book Your Experience
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
