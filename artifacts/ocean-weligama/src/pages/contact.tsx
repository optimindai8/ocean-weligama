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
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Globe, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { SEO, StructuredData } from "@/seo";

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
    link: "mailto:pelanawhitehouse@gmail.com",
    gradient: "from-teal-400 to-cyan-500",
    glow: "rgba(20,184,166,0.25)",
    iconBg: "rgba(20,184,166,0.12)",
  },
  {
    icon: Phone,
    title: "Call / WhatsApp",
    value: "+94 76 579 1763",
    action: "Call Now",
    link: "tel:+94765791763",
    gradient: "from-green-400 to-emerald-500",
    glow: "rgba(34,197,94,0.25)",
    iconBg: "rgba(34,197,94,0.10)",
  },
  {
    icon: MapPin,
    title: "Find Us",
    value: "No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700",
    action: "Open Maps",
    link: "https://maps.google.com",
    gradient: "from-indigo-400 to-violet-500",
    glow: "rgba(99,102,241,0.25)",
    iconBg: "rgba(99,102,241,0.10)",
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
      <SEO
        title="Contact Us & Direct Booking — Ocean Air Weligama"
        description="Contact Ocean Air Weligama resort & villa concierge team via WhatsApp (+94 76 579 1763), email, or contact form for instant 2-hour response times."
        canonicalPath="/contact"
        keywords={["Contact Ocean Weligama", "Weligama Hotel Phone Number", "Weligama Villa WhatsApp", "Weligama Accommodation Contact"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Contact Concierge", item: "/contact" },
        ]}
      />

      <PageHero
        title="Let's Connect"
        description="Real people, island hospitality. Always here for you."
        badgeText="Global Concierge"
        badgeIcon={<Globe className="w-3.5 h-3.5 text-[#4BBCCC]" />}
      />

      {/* Main contact area */}
      <main
        className="flex-1 py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #EEF5FA 0%, #E6EFF6 40%, #EDF2F7 100%)' }}
      >
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-sky-100/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-violet-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">

            {/* ── Left Column ── */}
            <div className="lg:col-span-5 space-y-6">

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-3 mb-10"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/70 text-indigo-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Get In Touch
                </motion.span>
                <h2 className="text-4xl font-serif font-bold text-[#0B3D5E] leading-tight">
                  We're just a <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-500">
                    wave away.
                  </span>
                </h2>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  Whether you're planning your first surf or looking for a long-term sanctuary, our team is ready to assist.
                </p>
              </motion.div>

              {/* Contact Method Tiles */}
              <div className="space-y-4">
                {CONTACT_METHODS.map((method, idx) => (
                  <motion.a
                    key={method.title}
                    href={method.link}
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    viewport={{ once: true }}
                    whileHover={{ x: 6, scale: 1.02 }}
                    className="group relative flex items-center gap-5 p-5 sm:p-6 rounded-2xl border border-white/60 backdrop-blur-md transition-all duration-400 overflow-hidden cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(238,245,253,0.55) 100%)' }}
                  >
                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                      style={{ background: `radial-gradient(ellipse at left center, ${method.glow} 0%, transparent 70%)` }}
                    />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.12 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/60 shadow-sm transition-all duration-400 group-hover:shadow-md"
                      style={{ background: method.iconBg, backdropFilter: 'blur(8px)', width: '56px', height: '56px' }}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        style={{ background: `linear-gradient(135deg, ${method.glow}, transparent)` }}
                      />
                      <method.icon
                        className="w-6 h-6 relative z-10 transition-all duration-300"
                        style={{ stroke: `url(#grad-${idx})` }}
                      />
                      <svg width="0" height="0" className="absolute">
                        <defs>
                          <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={idx === 0 ? '#2dd4bf' : idx === 1 ? '#4ade80' : '#818cf8'} />
                            <stop offset="100%" stopColor={idx === 0 ? '#06b6d4' : idx === 1 ? '#10b981' : '#a855f7'} />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 relative z-10">
                      <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent`}>
                        {method.title}
                      </span>
                      <p className="text-sm sm:text-base font-bold text-[#0B3D5E] break-all sm:break-normal leading-snug mt-0.5">
                        {method.value}
                      </p>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center border border-white/60 shrink-0 relative z-10"
                      style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(6px)' }}
                    >
                      <ArrowRight className={`w-4 h-4 bg-gradient-to-r ${method.gradient} bg-clip-text`}
                        style={{ stroke: idx === 0 ? '#2dd4bf' : idx === 1 ? '#4ade80' : '#818cf8' }}
                      />
                    </motion.div>
                  </motion.a>
                ))}
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="relative mt-6 p-5 sm:p-6 rounded-2xl border border-white/60 backdrop-blur-md flex items-center gap-4 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(232,245,253,0.55) 100%)' }}
              >
                <div className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.07) 0%, rgba(99,102,241,0.05) 100%)' }}
                />
                {/* Top accent */}
                <div className="absolute top-0 left-6 right-6 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(20,184,166,0.5), rgba(99,102,241,0.4), transparent)' }}
                />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/60 relative z-10"
                  style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(99,102,241,0.12))', backdropFilter: 'blur(8px)' }}
                >
                  <ShieldCheck className="w-6 h-6 text-teal-500" />
                </div>
                <div className="flex flex-col relative z-10">
                  <span className="text-teal-600 font-black text-[10px] uppercase tracking-widest">Guaranteed Response</span>
                  <span className="text-[#0B3D5E] text-sm font-bold">Within 2 hours, every time.</span>
                </div>
              </motion.div>
            </div>

            {/* ── Right Column: Glass Form ── */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative overflow-hidden rounded-3xl border border-white/40 shadow-[0_32px_80px_rgba(11,61,94,0.12),0_0_0_1px_rgba(255,255,255,0.15)_inset]"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(238,247,253,0.68) 50%, rgba(237,242,250,0.72) 100%)', backdropFilter: 'blur(24px)' }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 w-[35%] pointer-events-none z-0"
                  style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)', skewX: '-15deg' }}
                  animate={{ x: ['-160%', '360%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
                />

                {/* Top accent */}
                <div className="absolute top-0 left-8 right-8 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(75,188,204,0.6), rgba(99,102,241,0.5), transparent)' }}
                />

                {/* Ambient corner accent */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
                  style={{ background: 'radial-gradient(circle, rgba(75,188,204,0.3) 0%, transparent 70%)' }}
                />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-30"
                  style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
                />

                <div className="relative z-10 p-6 sm:p-10 md:p-14">
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.div
                        key="contact-form"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.03 }}
                        transition={{ duration: 0.35 }}
                      >
                        {/* Form header */}
                        <div className="mb-8">
                          <h2 className="text-3xl font-serif font-bold text-[#0B3D5E] leading-tight mb-1">
                            Send a Message
                          </h2>
                          <p className="text-slate-400 text-sm font-light">We'll get back to you within 2 hours.</p>
                        </div>

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                              <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Full Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your Name"
                                        className="h-13 rounded-2xl border-white/50 bg-white/50 backdrop-blur-sm focus:bg-white/80 focus:border-teal-300/60 transition-all duration-300 px-5 text-[#0B3D5E] placeholder:text-slate-300 shadow-sm"
                                        style={{ height: '52px' }}
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
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Email Address</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="h-13 rounded-2xl border-white/50 bg-white/50 backdrop-blur-sm focus:bg-white/80 focus:border-teal-300/60 transition-all duration-300 px-5 text-[#0B3D5E] placeholder:text-slate-300 shadow-sm"
                                        style={{ height: '52px' }}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-bold" />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Phone Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="+94 7X XXX XXXX"
                                        className="h-13 rounded-2xl border-white/50 bg-white/50 backdrop-blur-sm focus:bg-white/80 focus:border-indigo-300/60 transition-all duration-300 px-5 text-[#0B3D5E] placeholder:text-slate-300 shadow-sm"
                                        style={{ height: '52px' }}
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
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Subject</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Booking, Event, etc."
                                        className="h-13 rounded-2xl border-white/50 bg-white/50 backdrop-blur-sm focus:bg-white/80 focus:border-indigo-300/60 transition-all duration-300 px-5 text-[#0B3D5E] placeholder:text-slate-300 shadow-sm"
                                        style={{ height: '52px' }}
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
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-400">Message</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell us about your trip..."
                                      rows={5}
                                      className="rounded-2xl border-white/50 bg-white/50 backdrop-blur-sm focus:bg-white/80 focus:border-teal-300/60 transition-all duration-300 p-5 min-h-[150px] text-[#0B3D5E] placeholder:text-slate-300 shadow-sm resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                              )}
                            />

                            {/* Submit button */}
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                              <button
                                type="submit"
                                disabled={submitContact.isPending}
                                className="group relative w-full h-14 rounded-2xl text-white font-bold text-base overflow-hidden shadow-lg transition-all duration-400 hover:shadow-xl disabled:opacity-70"
                                style={{ background: 'linear-gradient(135deg, #0B3D5E 0%, #1A6B8A 50%, #4BBCCC 100%)' }}
                              >
                                {/* Shimmer on button hover */}
                                <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-160%] group-hover:translate-x-[360%] transition-transform duration-700 ease-out pointer-events-none" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
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
                                </span>
                              </button>
                            </motion.div>
                          </form>
                        </Form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success-message"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="text-center py-16"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/50 shadow-lg"
                          style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(99,102,241,0.12))', backdropFilter: 'blur(8px)' }}
                        >
                          <CheckCircle2 className="w-12 h-12 text-teal-500" />
                        </motion.div>
                        <h2 className="text-4xl font-serif font-bold text-[#0B3D5E] mb-4 italic">Message Delivered</h2>
                        <p className="text-slate-500 text-lg mb-10 max-w-sm mx-auto font-light leading-relaxed">
                          Thank you for reaching out. A member of our concierge team will respond within 2 hours.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSubmitted(false)}
                          className="px-10 h-12 rounded-2xl font-bold text-xs uppercase tracking-widest text-indigo-600 border border-white/60 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                          style={{ background: 'rgba(255,255,255,0.60)' }}
                        >
                          Send Another Message
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Map & Connection Section ── */}
          <section className="mt-28 space-y-14">
            <div className="text-center space-y-3">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/70 text-indigo-600 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5" /> Where We Are
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 }}
                className="text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E] italic"
              >
                Follow the Rhythm
              </motion.h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[300px] sm:h-[440px] rounded-3xl overflow-hidden border border-white/50 shadow-[0_20px_60px_rgba(11,61,94,0.12)] group"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                <iframe
                  title="Ocean Weligama Location"
                  width="100%"
                  height="100%"
                  className="transition-all duration-500"
                  style={{ border: 0 }}
                  src="https://www.google.com/maps?q=Ocean%20Air%20Weligama%20No%2042%20jayasayurupura%20pelana%20Weligama%20Sri%20Lanka&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen
                />

                {/* Pulse marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2.2 }}
                      className="absolute -inset-8 bg-primary/25 rounded-full blur-xl"
                    />
                    <div className="w-5 h-5 bg-primary rounded-full border-4 border-white shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-125" />
                  </div>
                </div>

                {/* Location card */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.92 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
                  className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-56 sm:w-68 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-white/40 z-20 group/card"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(238,247,253,0.85) 100%)', width: '260px' }}
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-4 right-4 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(75,188,204,0.5), transparent)' }}
                  />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/60 shrink-0"
                      style={{ background: 'rgba(11,61,94,0.08)', backdropFilter: 'blur(6px)' }}
                    >
                      <MapPin className="w-4 h-4 text-[#0B3D5E]" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-teal-500">Location Hub</span>
                      <h4 className="text-base font-serif font-bold text-[#0B3D5E] italic leading-tight">Ocean Air Weligama</h4>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
                    No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700
                  </p>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Ocean+Air+Weligama+Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white overflow-hidden transition-all duration-300 hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #0B3D5E, #1A6B8A)' }}
                  >
                    <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-160%] group-hover/btn:translate-x-[360%] transition-transform duration-600 pointer-events-none" />
                    Get Directions
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </motion.div>
              </motion.div>

              {/* WhatsApp + Social */}
              <div className="space-y-6">

                {/* WhatsApp card */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden rounded-3xl border border-white/50 p-8 sm:p-10 text-center"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(238,253,244,0.62) 100%)', backdropFilter: 'blur(20px)' }}
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 w-[35%] pointer-events-none"
                    style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.14), transparent)', skewX: '-15deg' }}
                    animate={{ x: ['-160%', '360%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 5 }}
                  />
                  {/* Top line */}
                  <div className="absolute top-0 left-8 right-8 h-px"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)' }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/60 shadow-sm"
                      style={{ background: 'rgba(34,197,94,0.12)', backdropFilter: 'blur(8px)' }}
                    >
                      <MessageCircle className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <h3 className="text-2xl font-serif font-bold text-[#0B3D5E] mb-3 italic">Instant Connection</h3>
                    <p className="text-slate-500 mb-8 text-sm font-light leading-relaxed max-w-xs mx-auto">
                      Prefer a quicker chat? Reach out on WhatsApp for instant booking &amp; travel tips.
                    </p>
                    <motion.a
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      href="https://wa.me/94765791763"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/wa relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                      style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}
                    >
                      <span className="absolute inset-0 w-[35%] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] translate-x-[-160%] group-hover/wa:translate-x-[360%] transition-transform duration-600 pointer-events-none" />
                      <MessageCircle className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Chat on WhatsApp</span>
                    </motion.a>
                  </div>
                </motion.div>

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center gap-4"
                >
                  {[
                    {
                      name: "Instagram",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      ),
                      href: "https://www.instagram.com/oceanairweligama",
                      gradient: "from-pink-500 to-rose-500",
                      glow: "rgba(236,72,153,0.30)",
                    },
                    {
                      name: "Facebook",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      ),
                      href: "https://www.facebook.com/profile.php?id=61583921572390",
                      gradient: "from-blue-500 to-indigo-600",
                      glow: "rgba(59,130,246,0.30)",
                    },
                    {
                      name: "TikTok",
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                      ),
                      href: "https://www.tiktok.com/@oceanairweligama",
                      gradient: "from-slate-700 to-slate-900",
                      glow: "rgba(15,23,42,0.25)",
                    },
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.12, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="group relative w-14 h-14 rounded-2xl flex items-center justify-center border border-white/60 backdrop-blur-sm text-slate-500 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.60)' }}
                    >
                      {/* Hover bg */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        style={{ background: `linear-gradient(135deg, ${social.glow.replace('0.30', '0.85')}, ${social.glow.replace('0.30', '0.70')})` }}
                      />
                      <span className="relative z-10">{social.icon}</span>
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
