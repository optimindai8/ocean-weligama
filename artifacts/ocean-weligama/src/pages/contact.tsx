import { useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact, useGetSetting } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Globe,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Star,
  Car,
  Train,
  Waves,
  Compass,
  Copy,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { SEO, StructuredData } from "@/seo";
import { sendContactNotification } from "@/lib/notifications";

/* ─── Hero Motion Variants (Matches FAQ & Blog Pages) ────────── */
const heroContentVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08,
    },
  },
};

const heroEyebrowVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroHeadlineVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 70,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroSubtitleVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const heroCtaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const perksContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const perkItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ─── Map & Coordinates Header Motion Variants ─────────────────── */
const mapHeaderVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.12,
    },
  },
};

const mapWordVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -55,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

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
    gradient: "from-[#FBBF24] to-[#F59E0B]",
    glow: "rgba(251,191,36,0.30)",
    iconBg: "rgba(251,191,36,0.14)",
  },
  {
    icon: Phone,
    title: "Call / WhatsApp",
    value: "+94 76 579 1763",
    action: "Call Now",
    link: "https://wa.me/94765791763",
    gradient: "from-emerald-400 to-green-500",
    glow: "rgba(34,197,94,0.30)",
    iconBg: "rgba(34,197,94,0.12)",
  },
  {
    icon: MapPin,
    title: "Find Us",
    value: "No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700",
    action: "Open Maps",
    link: "https://www.google.com/maps?q=Ocean%20Air%20Weligama%20No%2042%20jayasayurupura%20pelana%20Weligama%20Sri%20Lanka",
    gradient: "from-[#0B3D5E] to-[#1A6B8A]",
    glow: "rgba(11,61,94,0.30)",
    iconBg: "rgba(11,61,94,0.10)",
  },
];

let lastEmailClickTs = 0;
export function trackEmailInquiry() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastEmailClickTs < 4000) {
    return; // Ignore duplicate rapid clicks within 4s
  }
  lastEmailClickTs = now;

  try {
    const tracker = (window as any).hotelTracker;
    if (tracker && typeof tracker.track === "function") {
      tracker.track("email_click");
      return;
    }
  } catch {}

  // Direct fallback beacon only if hotelTracker is not available
  try {
    const rawSession = sessionStorage.getItem("hv_session");
    let s: any = null;
    if (rawSession) {
      try { s = JSON.parse(rawSession); } catch {}
    }
    const payload = JSON.stringify({
      type: "custom",
      name: "email_click",
      visitorId: s?.vid || "guest-email-visitor",
      sessionId: s?.id || "guest-email-session",
      path: window.location.pathname || "/contact",
      country: "LK",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/v1/collect", payload);
    } else {
      fetch("/api/v1/collect", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(true);
    toast({
      title: "Email Copied!",
      description: `${emailStr} copied to clipboard.`,
    });
    setTimeout(() => setCopiedEmail(false), 2500);
  };
  const submitContact = useSubmitContact();
  const { data: contactSetting, refetch: refetchContactSetting } = useGetSetting("contact_settings", {
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    } as any,
  });

  useEffect(() => {
    const handleStorage = () => {
      refetchContactSetting();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refetchContactSetting]);
  const heroConfig = (contactSetting?.value as any)?.hero;

  const heroBadge = heroConfig?.badge || "Direct Concierge • 24/7 Island Care";
  const heroHeadingLead = heroConfig?.headingLead || "Let's";
  const heroHeadingHighlight = heroConfig?.headingHighlight || "Connect";
  const heroSubtitle = heroConfig?.subtitle || "Real people, genuine Sri Lankan hospitality. Whether you're booking direct, organizing an airport transfer, or asking about Weligama waves, we are just a moment away.";
  const heroBadge1 = heroConfig?.badge1 || "Under 2-Hour Response Time";
  const heroBadge2 = heroConfig?.badge2 || "Best Direct Booking Guarantee";
  const heroCtaText = heroConfig?.ctaText || "Send A Message";
  const heroWhatsappText = heroConfig?.whatsappText || "WhatsApp Direct";
  const heroWhatsappNumber = heroConfig?.whatsappNumber || "94765791763";
  const heroVideoUrl = heroConfig?.videoUrl || "/videos/contact-page-video.mp4";
  const heroPoster = heroConfig?.poster || "/images/contact-hero-poster.jpg";
  const heroPhone = heroConfig?.phone || "+94 76 579 1763";
  const heroEmail = heroConfig?.email || "pelanawhitehouse@gmail.com";
  const heroLocation = heroConfig?.location || "Pelana, Weligama, Sri Lanka";
  const heroHours = heroConfig?.hours || "24/7 Concierge Support";

  // Dynamic Contact Channels & Response Guarantee (Section 2)
  const channelsConfig = (contactSetting?.value as any)?.channels;
  const channelBadge = channelsConfig?.badge || "Get In Touch";
  const channelHeadingLead = channelsConfig?.headingLead || "We're just a";
  const channelHeadingHighlight = channelsConfig?.headingHighlight || "wave away.";
  const channelSubtitle = channelsConfig?.subtitle || "Whether you're planning your first surf or looking for a long-term sanctuary, our team is ready to assist.";
  const channelEmailTitle = channelsConfig?.emailTitle || "Email Us";
  const channelEmailValue = channelsConfig?.emailValue || "pelanawhitehouse@gmail.com";
  const channelEmailLink = channelsConfig?.emailLink || "mailto:pelanawhitehouse@gmail.com";
  const emailSubject = encodeURIComponent("Inquiry - Ocean Air Weligama");
  const emailBody = encodeURIComponent("Hello Ocean Air Weligama Concierge Team,\n\nI would like to inquire about...");
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(channelEmailValue)}&su=${emailSubject}&body=${emailBody}`;
  const outlookComposeUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(channelEmailValue)}&subject=${emailSubject}&body=${emailBody}`;
  const defaultMailtoUrl = `mailto:${channelEmailValue}?subject=${emailSubject}&body=${emailBody}`;
  const channelPhoneTitle = channelsConfig?.phoneTitle || "Call / WhatsApp";
  const channelPhoneValue = channelsConfig?.phoneValue || "+94 76 579 1763";
  const channelPhoneLink = channelsConfig?.phoneLink || "https://wa.me/94765791763";
  const channelLocationTitle = channelsConfig?.locationTitle || "Find Us";
  const channelLocationValue = channelsConfig?.locationValue || "No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700";
  const channelLocationLink = channelsConfig?.locationLink || "https://www.google.com/maps?q=Ocean%20Air%20Weligama%20No%2042%20jayasayurupura%20pelana%20Weligama%20Sri%20Lanka";
  const channelGuaranteeBadge = channelsConfig?.guaranteeBadge || "Guaranteed Response";
  const channelGuaranteeText = channelsConfig?.guaranteeText || "Within 2 hours, every time.";

  const dynamicContactMethods = [
    {
      icon: Mail,
      title: channelEmailTitle,
      value: channelEmailValue,
      action: "Send Email",
      link: channelEmailLink,
      gradient: "from-[#FBBF24] to-[#F59E0B]",
      glow: "rgba(251,191,36,0.30)",
      iconBg: "rgba(251,191,36,0.14)",
    },
    {
      icon: Phone,
      title: channelPhoneTitle,
      value: channelPhoneValue,
      action: "Call Now",
      link: channelPhoneLink,
      gradient: "from-emerald-400 to-green-500",
      glow: "rgba(34,197,94,0.30)",
      iconBg: "rgba(34,197,94,0.12)",
    },
    {
      icon: MapPin,
      title: channelLocationTitle,
      value: channelLocationValue,
      action: "Open Maps",
      link: channelLocationLink,
      gradient: "from-[#0B3D5E] to-[#1A6B8A]",
      glow: "rgba(11,61,94,0.30)",
      iconBg: "rgba(11,61,94,0.10)",
    },
  ];

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
          trackEmailInquiry();
          toast({ title: "Message delivered!", description: "Check your email for a confirmation shortly." });
          form.reset();

          // Dispatch EmailJS notification to hotel inbox
          sendContactNotification({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
          });
        },
        onError: () => {
          toast({ variant: "destructive", title: "Transmission Error", description: "Please check your connection and try again." });
        },
      }
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-[#0B3D5E] selection:bg-[#FBBF24]/30 selection:text-[#0B3D5E] overflow-x-clip">
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

      {/* Cinematic Contact Video Hero Section (Exact Same Architecture as FAQ & Blog Pages) */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#052439]">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            preload="auto"
            poster={heroPoster}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
          >
            <source src={heroVideoUrl} type="video/mp4" />
            <source src="/videos/contact%20page%20video.mp4" type="video/mp4" />
          </video>

          {/* Deep coastal ocean overlay for supreme text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/78 via-[#0B3D5E]/48 to-[#052439]/92" />

          {/* Golden sunrise ambient warmth matching hotel logo yellow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.55)_100%)] pointer-events-none" />

          {/* Bottom subtle edge fade transitioning smoothly into the main contact section */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#EEF5FA] via-[#EEF5FA]/40 to-transparent pointer-events-none" />
        </div>

        {/* Row 1: Navbar Clearance Spacer */}
        <div className="h-24 md:h-32 shrink-0 relative z-10" />

        {/* Row 2: Main Hero Content (Clean, Focused, Staggered Directional Entrances) */}
        <motion.div
          variants={heroContentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="container mx-auto px-4 sm:px-6 relative z-10 text-center my-auto py-8"
        >
          {/* Eyebrow Badge - From Left Side */}
          <motion.div
            variants={heroEyebrowVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.25em] bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#FBBF24] backdrop-blur-md shadow-[0_4px_25px_rgba(251,191,36,0.25)] mb-5 cursor-default"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>{heroBadge}</span>
          </motion.div>

          {/* Main Headline - From Right Side */}
          <motion.h1
            variants={heroHeadlineVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.1] tracking-tight max-w-4xl mx-auto drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
          >
            {heroHeadingLead}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#F59E0B] drop-shadow-[0_2px_20px_rgba(251,191,36,0.5)]">
              {heroHeadingHighlight}
            </span>
          </motion.h1>

          {/* Subtitle - From Left Side */}
          <motion.p
            variants={heroSubtitleVariants}
            className="mt-5 text-white/85 text-base sm:text-lg md:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md font-sans"
          >
            {heroSubtitle}
          </motion.p>

          {/* Live Contact Quick Badges */}
          <motion.div
            variants={heroSubtitleVariants}
            className="mt-5 flex items-center justify-center gap-3 text-white/80 text-xs font-semibold flex-wrap"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{heroBadge1}</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{heroBadge2}</span>
            </div>
          </motion.div>

          {/* Action CTA - From Bottom to Up */}
          <motion.div
            variants={heroCtaVariants}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 relative z-20"
          >
            <button
              onClick={() => {
                const el = document.getElementById("contact-form-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:bg-white hover:text-[#0B3D5E] transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
            >
              <span>{heroCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>

            <a
              href={`https://wa.me/${heroWhatsappNumber.replace(/\+/g, "").replace(/\s+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{heroWhatsappText}</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Row 3: Reassurance Dock - Items come from left side one by one */}
        <motion.div
          variants={perksContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="w-full max-w-5xl mx-auto px-4 pb-12 sm:pb-16 pt-4 relative z-10"
        >
          {/* Frosted Glass Micro-Perks Dock */}
          <div className="rounded-2xl sm:rounded-full bg-black/40 backdrop-blur-xl border border-white/20 p-2 sm:p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-wrap items-center justify-around gap-2 text-white/95 text-[11px] sm:text-xs font-semibold">
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Phone className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroPhone}</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <motion.div
              variants={perkItemVariants}
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:text-[#FBBF24] transition-colors"
              title="Click to send email"
            >
              <Mail className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroEmail}</span>
            </motion.div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <MapPin className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroLocation}</span>
            </motion.div>
            <div className="hidden lg:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Clock className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroHours}</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Main contact area */}
      <main
        id="contact-form-section"
        className="flex-1 py-24 relative overflow-hidden scroll-mt-20"
        style={{ background: 'linear-gradient(160deg, #EEF5FA 0%, #E6EFF6 40%, #EDF2F7 100%)' }}
      >
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sky-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-sky-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">

            {/* ── Left Column ── */}
            <div className="lg:col-span-5 space-y-6">

              {/* Header */}
              <div className="space-y-3 mb-10">
                {/* Badge: comes from right side to inside */}
                <motion.div
                  initial={{ opacity: 0, x: 70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="inline-flex"
                >
                  <span className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs cursor-default">
                    <MessageCircle className="w-3.5 h-3.5 text-[#D97706]" /> {channelBadge}
                  </span>
                </motion.div>

                {/* Headline: comes from left side to inside */}
                <motion.h2
                  initial={{ opacity: 0, x: -70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-4xl font-serif font-black text-[#0B3D5E] leading-tight"
                >
                  {channelHeadingLead} <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]">
                    {channelHeadingHighlight}
                  </span>
                </motion.h2>

                {/* Subtitle: comes from down to up smoothly */}
                <motion.p
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-slate-600 text-lg font-light leading-relaxed"
                >
                  {channelSubtitle}
                </motion.p>
              </div>

              {/* Contact Method Tiles with Uiverse Bubble Hover Effect - Comes from Left one by one */}
              <div className="space-y-4">
                {dynamicContactMethods.map((method, idx) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, x: -70 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      delay: 0.28 + idx * 0.12,
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <a
                      href={method.title === channelEmailTitle || method.icon === Mail ? undefined : method.link}
                      target={method.title === channelEmailTitle || method.icon === Mail ? undefined : (method.link.startsWith("http") ? "_blank" : undefined)}
                      rel={method.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (method.title === channelEmailTitle || method.icon === Mail) {
                          e.preventDefault();
                          setIsEmailModalOpen(true);
                        }
                      }}
                      className="contact-bubbles-card flex items-center gap-5 p-5 sm:p-6 rounded-2xl block cursor-pointer"
                    >
                      {/* Icon Container */}
                      <div
                        className="bubble-icon-box w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-[#FBBF24]/30 bg-[#FBBF24]/15 shadow-xs"
                      >
                        <method.icon className="bubble-icon w-6 h-6 text-[#0B3D5E]" />
                      </div>

                      {/* Content */}
                      <div className="bubble-content flex-1 min-w-0">
                        <span className="bubble-title text-[10px] font-black uppercase tracking-widest text-[#D97706] block mb-1">
                          {method.title}
                        </span>
                        <p className="bubble-value text-sm sm:text-base font-bold text-[#0B3D5E] break-all sm:break-normal leading-snug">
                          {method.value}
                        </p>
                      </div>

                      {/* Arrow Button */}
                      <div
                        className="bubble-arrow w-9 h-9 rounded-full flex items-center justify-center border border-slate-200/90 bg-white text-slate-500 shrink-0 shadow-xs"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badge - Comes from Down to Up */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: 0.65, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(240,246,252,0.75) 100%)',
                  willChange: 'transform, opacity',
                }}
                className="relative mt-6 p-5 sm:p-6 rounded-2xl border border-white/80 backdrop-blur-md flex items-center gap-4 overflow-hidden shadow-sm"
              >
                <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-r from-[#FBBF24]/10 to-transparent" />
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-white/80 relative z-10 bg-[#FBBF24]/20"
                >
                  <ShieldCheck className="w-6 h-6 text-[#D97706]" />
                </div>
                <div className="flex flex-col relative z-10">
                  <span className="text-[#D97706] font-black text-[10px] uppercase tracking-widest">{channelGuaranteeBadge}</span>
                  <span className="text-[#0B3D5E] text-sm font-bold">{channelGuaranteeText}</span>
                </div>
              </motion.div>
            </div>

            {/* ── Right Column: Glass Form ── */}
            <div className="lg:col-span-7">
              {/* Contact Form Box - Comes from Right Side to Inside */}
              <motion.div
                initial={{ opacity: 0, x: 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(245,249,254,0.88) 100%)',
                  backdropFilter: 'blur(24px)',
                  willChange: 'transform, opacity',
                }}
                className="relative overflow-hidden rounded-3xl border border-white/90 shadow-[0_30px_70px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.2)_inset]"
              >
                {/* Ambient Warm Golden Glow behind form */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#FBBF24]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 p-6 sm:p-10 md:p-12">
                  <AnimatePresence mode="wait">
                    {!submitted ? (
                      <motion.div
                        key="contact-form"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.35 }}
                      >
                        {/* Form header */}
                        <div className="mb-8">
                          <h2 className="text-3xl font-serif font-black text-[#0B3D5E] leading-tight mb-1">
                            Send a Message
                          </h2>
                          <p className="text-slate-500 text-sm font-normal">We'll get back to you within 2 hours.</p>
                        </div>

                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                              <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">Full Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Your Name"
                                        className="h-12 rounded-2xl border-slate-200 bg-[#FAF9F6]/80 hover:bg-white focus:bg-white focus:border-[#FBBF24] focus:ring-4 focus:ring-[#FBBF24]/20 transition-all duration-300 px-4 text-[#0B3D5E] placeholder:text-slate-400 shadow-inner text-sm font-medium"
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
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">Email Address</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className="h-12 rounded-2xl border-slate-200 bg-[#FAF9F6]/80 hover:bg-white focus:bg-white focus:border-[#FBBF24] focus:ring-4 focus:ring-[#FBBF24]/20 transition-all duration-300 px-4 text-[#0B3D5E] placeholder:text-slate-400 shadow-inner text-sm font-medium"
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
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">Phone Number (Optional)</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="+94 7X XXX XXXX"
                                        className="h-12 rounded-2xl border-slate-200 bg-[#FAF9F6]/80 hover:bg-white focus:bg-white focus:border-[#FBBF24] focus:ring-4 focus:ring-[#FBBF24]/20 transition-all duration-300 px-4 text-[#0B3D5E] placeholder:text-slate-400 shadow-inner text-sm font-medium"
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
                                    <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">Subject</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Booking, Transfer, Surf Lesson, etc."
                                        className="h-12 rounded-2xl border-slate-200 bg-[#FAF9F6]/80 hover:bg-white focus:bg-white focus:border-[#FBBF24] focus:ring-4 focus:ring-[#FBBF24]/20 transition-all duration-300 px-4 text-[#0B3D5E] placeholder:text-slate-400 shadow-inner text-sm font-medium"
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
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1 text-slate-500">Message</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell us about your trip dates, room choices, or questions..."
                                      rows={5}
                                      className="rounded-2xl border-slate-200 bg-[#FAF9F6]/80 hover:bg-white focus:bg-white focus:border-[#FBBF24] focus:ring-4 focus:ring-[#FBBF24]/20 transition-all duration-300 p-4 min-h-[140px] text-[#0B3D5E] placeholder:text-slate-400 shadow-inner resize-none text-sm font-medium"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-[10px] font-bold" />
                                </FormItem>
                              )}
                            />

                            {/* Submit button with Uiverse alexroumi hover slide animation */}
                            <div>
                              <button
                                type="submit"
                                disabled={submitContact.isPending}
                                className="contact-submit-btn group w-full h-14 rounded-full text-xs uppercase tracking-wider disabled:opacity-70 flex items-center justify-center gap-3 cursor-pointer"
                              >
                                {submitContact.isPending ? (
                                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <Clock className="w-4 h-4" />
                                  </motion.div>
                                ) : (
                                  <>
                                    <span>Deliver Message</span>
                                    <Send className="submit-btn-icon w-4 h-4 transition-transform" />
                                  </>
                                )}
                              </button>
                            </div>
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
          <section className="mt-28 space-y-12">
            <div className="text-center space-y-3">
              {/* Badge: comes from right side to inside */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 70 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs cursor-default"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Sanctuary Coordinates</span>
                </motion.div>
              </div>

              {/* Title: word by word from left side to inside */}
              <motion.h2
                variants={mapHeaderVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.15 }}
                className="text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] tracking-tight flex items-center justify-center gap-x-2 sm:gap-x-3 flex-wrap"
              >
                {["Find", "Us", "&", "Connect", "With", "Ease"].map((word, idx) => (
                  <motion.span
                    key={idx}
                    variants={mapWordVariants}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>

              {/* Subtitle: comes from down to up */}
              <motion.p
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
              >
                Just 2 minutes from gentle Weligama Bay surf breaks. Navigate directly to our sanctuary or connect with our concierge desk.
              </motion.p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">

              {/* LEFT: Transparent Sanctuary Map Suite (7 cols on lg) - Smooth entrance from left side without lag */}
              <motion.div
                initial={{ opacity: 0, x: -75 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="lg:col-span-7 relative rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.2)] flex flex-col justify-between overflow-hidden"
              >
                {/* Ambient Golden Glow behind card */}
                <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#FBBF24]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Map Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight">
                        Ocean Air Weligama
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shrink-0 self-start sm:self-center shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>4.9 Verified Guest Rating</span>
                    </div>
                  </div>

                  {/* Framed Interactive Map */}
                  <div className="relative h-[260px] sm:h-[280px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-inner group">
                    <iframe
                      title="Ocean Weligama Location"
                      width="100%"
                      height="100%"
                      className="transition-all duration-500 grayscale-[15%] group-hover:grayscale-0"
                      style={{ border: 0 }}
                      src="https://www.google.com/maps?q=Ocean%20Air%20Weligama%20No%2042%20jayasayurupura%20pelana%20Weligama%20Sri%20Lanka&t=&z=16&ie=UTF8&iwloc=&output=embed"
                      allowFullScreen
                    />

                    {/* Floating Proximity Pill */}
                    <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/95 text-[11px] font-bold text-[#0B3D5E] shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span>2-Min Walk to Beach</span>
                    </div>
                  </div>

                  {/* Proximity Distance Badges (Key Traveler Psychology) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                      <span className="text-[10px] uppercase font-black text-slate-600 block flex items-center justify-center gap-1">
                        <Waves className="w-3 h-3 text-[#D97706]" /> Surf Break
                      </span>
                      <span className="text-xs font-bold text-[#0B3D5E] mt-0.5 block">180m • 2 mins</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                      <span className="text-[10px] uppercase font-black text-slate-600 block flex items-center justify-center gap-1">
                        <Train className="w-3 h-3 text-[#D97706]" /> Station
                      </span>
                      <span className="text-xs font-bold text-[#0B3D5E] mt-0.5 block">1.8km • 5 mins</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                      <span className="text-[10px] uppercase font-black text-slate-600 block flex items-center justify-center gap-1">
                        <Compass className="w-3 h-3 text-[#D97706]" /> Mirissa
                      </span>
                      <span className="text-xs font-bold text-[#0B3D5E] mt-0.5 block">6.5km • 10 mins</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-center">
                      <span className="text-[10px] uppercase font-black text-slate-600 block flex items-center justify-center gap-1">
                        <Car className="w-3 h-3 text-[#D97706]" /> Airport (CMB)
                      </span>
                      <span className="text-xs font-bold text-[#0B3D5E] mt-0.5 block">2.2 hrs Highway</span>
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Ocean+Air+Weligama+Sri+Lanka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3 px-6 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-[#0B3D5E] bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#FBBF24] hover:scale-[1.02] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                    >
                      <span>Get Driving Directions</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="https://www.google.com/maps?q=Ocean+Air+Weligama+No+42+jayasayurupura+pelana+Weligama+Sri+Lanka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3 px-6 rounded-full font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-[#0B3D5E] bg-white hover:bg-slate-50 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT: Transparent Instant Concierge & Social Suite (5 cols on lg) - Smooth entrance from right side without lag */}
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="lg:col-span-5 relative rounded-[2.5rem] bg-white/85 backdrop-blur-2xl border border-white/95 p-6 sm:p-8 shadow-[0_24px_60px_-15px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.2)] overflow-hidden h-fit"
              >
                {/* Ambient Emerald/Golden Glow behind card */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  {/* Concierge Header */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0B3D5E] tracking-tight">
                      Instant Concierge
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                      Need quick confirmation for your trip? Start a direct chat on WhatsApp with our front desk for instant assistance.
                    </p>
                  </div>

                  {/* Primary WhatsApp Action */}
                  <div className="pt-2">
                    <motion.a
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      href="https://wa.me/94765791763"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-600 hover:from-emerald-600 hover:to-green-700 shadow-[0_10px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-white" />
                      <span>Chat on WhatsApp Now</span>
                    </motion.a>
                  </div>

                  {/* Integrated Transparent Social Community Shelf */}
                  <div className="pt-4 border-t border-slate-100/90">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Join Our Island Community
                      </span>
                      <span className="text-[11px] font-bold text-[#D97706]">@oceanairweligama</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {
                          name: "Instagram",
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon w-4 h-4">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          ),
                          href: "https://www.instagram.com/oceanairweligama",
                          platformClass: "social-ig",
                        },
                        {
                          name: "Facebook",
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon w-4 h-4">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          ),
                          href: "https://www.facebook.com/profile.php?id=61583921572390",
                          platformClass: "social-fb",
                        },
                        {
                          name: "TikTok",
                          icon: (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="social-icon w-4 h-4">
                              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                            </svg>
                          ),
                          href: "https://www.tiktok.com/@oceanairweligama",
                          platformClass: "social-tt",
                        },
                      ].map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`boton-elegante ${social.platformClass}`}
                        >
                          <span className="social-icon">{social.icon}</span>
                          <span className="text-[10px] font-bold block">{social.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </section>
        </div>
      </main>

      {/* Email Chooser Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0B1B2B]/50 backdrop-blur-[4px]"
            onClick={() => setIsEmailModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[460px] rounded-[30px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(11,61,94,0.3)] p-6 sm:p-7 overflow-hidden text-left"
            >
              {/* Ambient Top Glow */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-[#FBBF24]/15 blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close email options"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#D97706] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] block">
                    Direct Concierge
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#0B3D5E] dark:text-white leading-tight">
                    Send an Email
                  </h3>
                </div>
              </div>

              {/* Recipient Display Pill with Copy Button */}
              <div className="flex items-center justify-between gap-2 p-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 mb-5">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Recipient Address
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-semibold text-[#0B3D5E] dark:text-white truncate">
                    {channelEmailValue}
                  </div>
                </div>
                <button
                  onClick={() => handleCopyEmail(channelEmailValue)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B3D5E] dark:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Email Direct Action */}
              <div className="space-y-3">
                {/* 1. Gmail Webmail (Primary & Recommended) */}
                <a
                  href={gmailComposeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEmailInquiry();
                    setIsEmailModalOpen(false);
                  }}
                  className="flex items-center justify-between p-4 px-4.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/70 dark:from-slate-800 dark:to-slate-800/80 border border-amber-300/80 dark:border-amber-500/40 hover:border-amber-400 transition-all group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs text-red-500 font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#0B3D5E] dark:text-white flex items-center gap-2">
                        Open in Gmail
                        <span className="text-[10px] font-bold bg-[#FBBF24]/20 text-[#D97706] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Opens compose with concierge recipient pre-filled
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>
              </div>

              {/* Fast Form Jump */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Prefer sending right now?</span>
                <button
                  onClick={() => {
                    setIsEmailModalOpen(false);
                    const el = document.getElementById("contact-form-section");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Use On-Page Form <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
