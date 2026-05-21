import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Globe, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email Us",
    value: "pelanawhitehouse@gmail.com",
    action: "Send Email",
    link: "mailto:pelanawhitehouse@gmail.com"
  },
  {
    icon: Phone,
    title: "Call / WhatsApp",
    value: "+94 76 579 1763",
    action: "Call Now",
    link: "tel:+94765791763"
  },
  {
    icon: MapPin,
    title: "Find Us",
    value: "No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700",
    action: "Open Maps",
    link: "https://maps.google.com"
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const submitContact = useSubmitContact();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", email: "", phone: "", subject: "", message: "" },
  });

  function onSubmit(data: ContactForm) {
    submitContact.mutate(
      { data },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast({ title: "Message delivered!", description: "Check your email for a confirmation shortly." });
          form.reset();
        },
        onError: () => {
          toast({ variant: "destructive", title: "Transmission Error", description: "Please check your connection and try again." });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">

      {/* Cinematic Contact Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8"
          >
            <Globe className="w-4 h-4 text-accent" />
            <span className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">Global Concierge</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-white mb-8"
          >
            Let's <span className="italic font-normal text-accent text-5xl sm:text-7xl md:text-9xl">Connect</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 text-white/80 font-serif italic text-base sm:text-xl px-4"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            "Real people, island hospitality. Always here for you."
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-16 max-w-7xl mx-auto">

            {/* Left: Interactive Concierge Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4 mb-12">
                <h2 className="text-4xl font-serif font-bold text-foreground leading-tight">We're just a <br /> wave away.</h2>
                <p className="text-muted-foreground text-lg">Whether you're planning your first surf or looking for a long-term sanctuary, our team is ready to assist.</p>
              </div>

              <div className="space-y-4">
                {CONTACT_METHODS.map((method, idx) => (
                  <motion.a
                    key={method.title}
                    href={method.link}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex items-center gap-4 sm:gap-6 bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors duration-500 shrink-0">
                      <method.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/50 group-hover:text-primary transition-colors">{method.title}</span>
                      <p className="text-sm sm:text-lg font-bold text-foreground block break-all sm:break-normal">{method.value}</p>
                    </div>
                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-muted items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Instant Trust Badge */}
              <div className="mt-8 sm:mt-12 p-5 sm:p-8 bg-primary/5 rounded-[2rem] sm:rounded-[2.5rem] border border-primary/10 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <div className="flex flex-col">
                  <span className="text-primary font-black text-[10px] uppercase tracking-widest">Guaranteed Response</span>
                  <span className="text-foreground text-sm font-bold">Within 2 hours, every time.</span>
                </div>
              </div>
            </div>

            {/* Right: Liquid-Glass Contact Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] sm:rounded-[3.5rem] p-5 sm:p-10 md:p-16 shadow-2xl border border-border/50 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] rounded-full" />

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div
                      key="contact-form"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                    >
                      <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Send a Message</h2>

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-bold uppercase tracking-widest ml-4 text-primary/50">Full Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Your Name"
                                      className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-white transition-all px-6"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-bold uppercase tracking-widest ml-4 text-primary/50">Email Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="hello@example.com"
                                      className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-white transition-all px-6"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-bold uppercase tracking-widest ml-4 text-primary/50">Phone Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="+94 7X XXX XXXX"
                                      className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-white transition-all px-6"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs font-bold uppercase tracking-widest ml-4 text-primary/50">Subject</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Booking, Event, etc."
                                      className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-white transition-all px-6"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs font-bold uppercase tracking-widest ml-4 text-primary/50">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tell us about your trip..."
                                    rows={5}
                                    className="rounded-3xl border-border/50 bg-muted/30 focus:bg-white transition-all p-6 min-h-[160px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-[10px] font-bold" />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={submitContact.isPending}
                            className="w-full bg-primary hover:bg-secondary text-white rounded-full h-16 text-lg font-bold shadow-xl hover:scale-[1.02] transition-all flex items-center gap-3"
                          >
                            {submitContact.isPending ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                <Clock className="w-5 h-5" />
                              </motion.div>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                Deliver Message
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                      </div>
                      <h2 className="text-4xl font-serif font-bold text-foreground mb-4 italic">Message Delivered</h2>
                      <p className="text-muted-foreground text-lg mb-10 max-w-sm mx-auto">
                        Thank you for reaching out. A member of our concierge team will respond to your email within 2 hours.
                      </p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="rounded-full px-10 h-14 font-bold uppercase tracking-widest text-[10px] border-primary/20 text-primary hover:bg-primary/5"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Immersive Map & Connection Hub */}
          <section className="mt-32 space-y-16">
            <div className="text-center space-y-4">
              <span className="text-accent font-black tracking-[0.4em] uppercase text-xs block">Where We Are</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground italic">Follow the Rhythm</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Refined Interactive Map Portal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-[300px] sm:h-[450px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 group"
              >
                {/* Vibrant Discovery Map */}
                <iframe
                  title="Ocean Weligama Location"
                  width="100%"
                  height="100%"
                  className="transition-all duration-500"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps?q=Ocean%20Air%20Weligama%20No%2042%20jayasayurupura%20pelana%20Weligama%20Sri%20Lanka&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen
                ></iframe>

                {/* Liquid Pulse Marker Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -inset-8 bg-primary/20 rounded-full blur-xl"
                    />
                    <div className="w-5 h-5 bg-primary rounded-full border-4 border-white shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-125" />
                  </div>
                </div>

                {/* Compact Interactive Pop-up Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
                  className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-56 sm:w-72 bg-white/95 backdrop-blur-2xl p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 z-20 group/card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary">Location Hub</span>
                      <h4 className="text-lg font-serif font-bold text-foreground italic leading-tight">Ocean Air Weligama</h4>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-[11px] leading-relaxed mb-5">
                    No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700
                  </p>

                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Ocean+Air+Weligama+Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-primary text-white py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-lg hover:scale-[1.02]"
                  >
                    Get Directions
                    <ArrowRight className="w-3 h-3 group-hover/card:translate-x-1 transition-transform" />
                  </a>
                </motion.div>

              </motion.div>

              {/* Social & WhatsApp Hub */}
              <div className="space-y-10">
                <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] shadow-2xl border border-border/50 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10">
                    <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-6 animate-bounce" />
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-4 italic">Instant Connection</h3>
                    <p className="text-muted-foreground mb-10 text-lg">Prefer a quicker chat? Reach out on WhatsApp for instant booking & travel tips.</p>
                    <a
                      href="https://wa.me/94765791763"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 sm:gap-4 bg-green-500 hover:bg-green-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-xl shadow-xl transition-all hover:scale-105"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Follow Hub */}
                <div className="flex justify-center gap-6">
                  {[
                    {
                      name: "Instagram", icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      ), href: "https://www.instagram.com/oceanairweligama"
                    },
                    {
                      name: "Facebook", icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                      ), href: "https://www.facebook.com/profile.php?id=61583921572390"
                    },
                    {
                      name: "TikTok", icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                      ), href: "https://www.tiktok.com/@oceanairweligama"
                    }
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, y: -5 }}
                      className="w-16 h-16 rounded-full bg-white border border-border flex items-center justify-center text-primary shadow-xl hover:bg-primary hover:text-white transition-all duration-500"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
