import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin-layout";
import {
  Settings,
  Home,
  ImageIcon,
  Info,
  PhoneCall,
  Crown,
  FileText,
  Star,
  Users,
  Check,
  RotateCcw,
  Save,
  Eye,
  Loader2,
  ShieldCheck,
  MapPin,
  Waves,
  Award,
  Compass,
  BedDouble,
  UtensilsCrossed,
  Upload,
  ArrowRight,
  ExternalLink,
  Palmtree,
  Trophy,
  MessageSquare,
  Quote,
  Video,
  Film,
  Play,
  Camera,
  Plus,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Heart,
  Sunset,
  Coffee,
  ChevronRight,
  Map,
  BookOpen,
  Layers,
  BadgeCheck,
  CalendarDays,
  Sun,
  Ship,
  Utensils,
  Bike,
  Wifi,
  CheckCircle2,
  Wind,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";
import {
  useGetSetting,
  useAdminUpdateSetting,
  getGetSettingQueryKey,
  customFetch,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SettingsTabKey = "home" | "gallery" | "about" | "contact";

interface TabConfig {
  id: SettingsTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabConfig[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    description: "Homepage hero, highlights, & featured sections",
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: ImageIcon,
    description: "Visual media, category feeds, & photography layout",
  },
  {
    id: "about",
    label: "About",
    icon: Info,
    description: "Sanctuary story, team, heritage, & property details",
  },
  {
    id: "contact",
    label: "Contact",
    icon: PhoneCall,
    description: "Communication channels, inquiries, map, & directions",
  },
];

export const DEFAULT_HERO_SETTINGS = {
  ratingScore: 4.9,
  ratingLabel: "Rating",
  guestsCount: 1000,
  guestsSuffix: "+",
  guestsLabel: "Happy Guests",
  taglineHighlight: "100 steps from the ocean.",
  taglineText: "Barefoot beach living meets Sri Lankan hospitality.",
};

export interface ReassuranceCardConfig {
  stat: string;
  title: string;
  desc: string;
  suffix?: string;
}

export interface ReassuranceSettings {
  card1: ReassuranceCardConfig;
  card2: ReassuranceCardConfig;
  card3: ReassuranceCardConfig;
  card4: ReassuranceCardConfig;
}

export const DEFAULT_REASSURANCE_SETTINGS: ReassuranceSettings = {
  card1: {
    stat: "Secure",
    title: "Booking",
    desc: "Instant Confirmation",
  },
  card2: {
    stat: "100",
    title: "Steps to Beach",
    desc: "Prime Surf Location",
  },
  card3: {
    stat: "4.9",
    suffix: "★",
    title: "Guest Rating",
    desc: "Top-Rated Hospitality",
  },
  card4: {
    stat: "Expert",
    title: "Surf Hub",
    desc: "ISA Certified Team",
  },
};

export interface ExperienceCardConfig {
  id: string;
  num: string;
  title: string;
  tagline: string;
  description: string;
  img: string;
  href: string;
}

export interface ExperiencesSettings {
  badge: string;
  title: string;
  description: string;
  cards: ExperienceCardConfig[];
}

export const DEFAULT_EXPERIENCES_SETTINGS: ExperiencesSettings = {
  badge: "The Ocean Air Experience",
  title: "Surf • Stay • Taste • Explore",
  description: "Experience barefoot luxury, pristine Indian Ocean waves, authentic flavors, and tailored island adventures.",
  cards: [
    {
      id: "surf",
      num: "01",
      title: "Surf",
      tagline: "Ride the waves",
      description: "Experience the thrill of Weligama's world-class breaks with ISA certified instructors.",
      img: "/images/service-surf.png",
      href: "/packages",
    },
    {
      id: "stay",
      num: "02",
      title: "Stay",
      tagline: "Chill by the ocean",
      description: "Barefoot coastal luxury meets heartfelt Sri Lankan warmth 100 steps from the sand.",
      img: "/images/service-stay.png",
      href: "/rooms",
    },
    {
      id: "taste",
      num: "03",
      title: "Taste",
      tagline: "Taste the island",
      description: "Authentic coastal spices, freshly caught seafood, and wholesome tropical breakfast.",
      img: "/images/service-taste.png",
      href: "/about",
    },
    {
      id: "explore",
      num: "04",
      title: "Explore",
      tagline: "Local traditions",
      description: "From tranquil secret coves and stilt fishermen to unforgettable blue whale watching.",
      img: "/images/service-explore.jpg",
      href: "/packages",
    },
  ],
};

export interface WhyChooseUsFeature {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface WhyChooseUsSocialProof {
  score: string;
  text: string;
  avatars: string[];
  avatarBadge: string;
}

export interface WhyChooseUsShowcase {
  image: string;
  awardTag: string;
  awardTitle: string;
  awardIcon: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialAuthorRole: string;
  testimonialAuthorInitial: string;
}

export interface WhyChooseUsSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  description: string;
  features: WhyChooseUsFeature[];
  socialProof: WhyChooseUsSocialProof;
  showcase: WhyChooseUsShowcase;
}

export const DEFAULT_WHY_CHOOSE_US_SETTINGS: WhyChooseUsSettings = {
  badge: "Why Choose Us",
  headingLead: "More Than Just A",
  headingHighlight: "Stay",
  description: "We believe your vacation should be effortless. From the moment you arrive, every detail is handled with warmth and precision, so you can focus entirely on unwinding by the ocean.",
  features: [
    {
      id: "location",
      icon: "MapPin",
      title: "Unbeatable Location",
      desc: "Literally 100 steps from Weligama’s gentle surf break. Wake up, grab your board, and you're in the water in seconds."
    },
    {
      id: "luxury",
      icon: "Palmtree",
      title: "Authentic Barefoot Luxury",
      desc: "We blend high-end modern comforts with authentic Sri Lankan hospitality for a genuinely unique island experience."
    },
    {
      id: "effortless",
      icon: "Waves",
      title: "Effortless Experience",
      desc: "From airport transfers to personalized surf lessons and daily fresh breakfasts, we curate your entire journey."
    }
  ],
  socialProof: {
    score: "5.0 / 5.0",
    text: "Loved by 1,000+ guests worldwide",
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
    ],
    avatarBadge: "+1k"
  },
  showcase: {
    image: "/images/service-stay.png",
    awardTag: "Top Rated",
    awardTitle: "2026 Choice Award",
    awardIcon: "🏆",
    testimonialQuote: "The most peaceful week of my life. Waking up to the sound of waves and walking straight onto the sand is an unmatched experience.",
    testimonialAuthor: "Sarah Jenkins",
    testimonialAuthorRole: "Stayed 7 nights • Deluxe Ocean Suite",
    testimonialAuthorInitial: "S"
  }
};

import { normalizeAssetUrl } from "@/lib/assetUrl";

export function normalizeAssetPath(url: string | null | undefined): string {
  if (!url) return "";
  const s = url.trim();
  if (/^https?:\/(images|videos)\/\//i.test(s)) {
    return s.replace(/^https?:\/(images|videos)\/\//i, "https://");
  }
  if (/^(https?:|\/\/|data:|blob:)/i.test(s)) return s;
  let cleaned = s.replace(/^\/images\/images\//, "/images/").replace(/^\/videos\/videos\//, "/videos/");
  if (/^\/(images|videos|icons|thumbnails)\//i.test(cleaned)) return cleaned;
  if (/^\/[^/]+\.(mp4|webm|mov|m4v)$/i.test(cleaned)) return `/videos${cleaned}`;
  if (/^\/[^/]+\.(jpg|jpeg|png|webp|svg|gif|ico)$/i.test(cleaned)) return `/images${cleaned}`;
  return cleaned;
  return normalizeAssetUrl(url);
}

export interface FeaturedVideoCard {
  id: string;
  url: string;
  alt: string;
  caption: string;
  badge: string;
  location: string;
  subtitle: string;
  staggerClass?: string;
  fromY?: number;
  type?: string;
}

export interface FeaturedMomentsSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;
  journalStatus: string;
  journalSubtext: string;
  shareCtaText: string;
  videos: FeaturedVideoCard[];
}

export interface GallerySettings {
  featuredMoments: FeaturedMomentsSettings;
}

export const DEFAULT_GALLERY_SETTINGS: GallerySettings = {
  featuredMoments: {
    badge: "Curated Visual Stories",
    headingLead: "Featured",
    headingHighlight: "Moments",
    subtitle: "Curated highlights, ocean rhythms, and cinematic memories captured steps from Weligama Bay.",
    journalStatus: "Guest Journal Open",
    journalSubtext: "Be featured in our stories",
    shareCtaText: "Share Your Memory",
    videos: [
      {
        id: "f1",
        url: "/videos/148597-794221559_small.mp4",
        alt: "Ocean View",
        caption: "Ocean Vibes",
        badge: "Shoreline Soul",
        location: "Weligama Bay Waters",
        subtitle: "Golden hour shoreline strolls along Weligama's gentle, sun-warmed tides.",
        staggerClass: "md:-translate-y-5 lg:-translate-y-7",
        fromY: -60,
        type: "video"
      },
      {
        id: "f2",
        url: "/videos/123523-728292591_small.mp4",
        alt: "Serenity",
        caption: "Tropical Escape",
        badge: "Surf & Sunrise",
        location: "Main Surf Break",
        subtitle: "Gliding across glassy Indian Ocean breaks as the island awakens.",
        staggerClass: "md:translate-y-5 lg:translate-y-7",
        fromY: 60,
        type: "video"
      },
      {
        id: "f3",
        url: "/videos/vecteezy_majestic-green-sea-turtle-gliding-over-a-vibrant-coral-reef_71664992.mp4",
        alt: "Majestic Sea Turtle",
        caption: "Marine Life",
        badge: "Living Sanctuary",
        location: "Coral Reef Point",
        subtitle: "Gentle green sea turtles navigating vibrant tropical coral gardens.",
        staggerClass: "md:-translate-y-5 lg:-translate-y-7",
        fromY: -60,
        type: "video"
      }
    ]
  }
};

export interface ContactHeroSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;
  badge1: string;
  badge2: string;
  ctaText: string;
  whatsappText: string;
  whatsappNumber: string;
  videoUrl: string;
  poster: string;
  phone: string;
  email: string;
  location: string;
  hours: string;
}

export interface ContactChannelSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;
  emailTitle: string;
  emailValue: string;
  emailLink: string;
  phoneTitle: string;
  phoneValue: string;
  phoneLink: string;
  locationTitle: string;
  locationValue: string;
  locationLink: string;
  guaranteeBadge: string;
  guaranteeText: string;
}

export interface ContactSettings {
  hero: ContactHeroSettings;
  channels: ContactChannelSettings;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  hero: {
    badge: "Direct Concierge • 24/7 Island Care",
    headingLead: "Let's",
    headingHighlight: "Connect",
    subtitle: "Real people, genuine Sri Lankan hospitality. Whether you're booking direct, organizing an airport transfer, or asking about Weligama waves, we are just a moment away.",
    badge1: "Under 2-Hour Response Time",
    badge2: "Best Direct Booking Guarantee",
    ctaText: "Send A Message",
    whatsappText: "WhatsApp Direct",
    whatsappNumber: "94765791763",
    videoUrl: "/videos/contact-page-video.mp4",
    poster: "/images/contact-hero-poster.jpg",
    phone: "+94 76 579 1763",
    email: "pelanawhitehouse@gmail.com",
    location: "Pelana, Weligama, Sri Lanka",
    hours: "24/7 Concierge Support",
  },
  channels: {
    badge: "Get In Touch",
    headingLead: "We're just a",
    headingHighlight: "wave away.",
    subtitle: "Whether you're planning your first surf or looking for a long-term sanctuary, our team is ready to assist.",
    emailTitle: "Email Us",
    emailValue: "pelanawhitehouse@gmail.com",
    emailLink: "mailto:pelanawhitehouse@gmail.com",
    phoneTitle: "Call / WhatsApp",
    phoneValue: "+94 76 579 1763",
    phoneLink: "https://wa.me/94765791763",
    locationTitle: "Find Us",
    locationValue: "No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700",
    locationLink: "https://www.google.com/maps?q=Ocean%20Air%20Weligama%20No%2042%20jayasayurupura%20pelana%20Weligama%20Sri%20Lanka",
    guaranteeBadge: "Guaranteed Response",
    guaranteeText: "Within 2 hours, every time.",
  }
};

export interface AboutHeroSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;
  badge1: string;
  badge2: string;
  ctaText: string;
  perk1: string;
  perk2: string;
  perk3: string;
  perk4: string;
  videoUrl: string;
  poster: string;
}

export interface AboutStorySettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  paragraph1: string;
  paragraph2: string;
  highlight1Title: string;
  highlight1Subtitle: string;
  highlight2Title: string;
  highlight2Subtitle: string;
  ctaText: string;
  authorInitials: string;
  authorName: string;
  authorLocation: string;
  neighborhoodTitle: string;
  neighborhoodSubtitle: string;
  spot1Name: string;
  spot1Distance: string;
  spot1Details: string;
  spot2Name: string;
  spot2Distance: string;
  spot2Details: string;
  spot3Name: string;
  spot3Distance: string;
  spot3Details: string;
  spot4Name: string;
  spot4Distance: string;
  spot4Details: string;
}

export interface AboutExperienceSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;
  pill1: string;
  pill2: string;
  pill3: string;
  addOnsTitle: string;
  addOnsSubtitle: string;
  addOnsBadge: string;
  tailoredTitle: string;
  tailoredEyebrow: string;
  tailoredDesc: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  benefit4: string;
  freedomTitle: string;
  freedomText: string;
  ctaText: string;
  exp1Name: string;
  exp1Category: string;
  exp1Desc: string;
  exp2Name: string;
  exp2Category: string;
  exp2Desc: string;
  exp3Name: string;
  exp3Category: string;
  exp3Desc: string;
  exp4Name: string;
  exp4Category: string;
  exp4Desc: string;
  exp5Name: string;
  exp5Category: string;
  exp5Desc: string;
  exp6Name: string;
  exp6Category: string;
  exp6Desc: string;
  exp7Name: string;
  exp7Category: string;
  exp7Desc: string;
}

export interface AboutSanctuarySettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  tab1Label: string;
  tab2Label: string;

  // Basic Private Room
  basicEyebrow: string;
  basicTitle: string;
  basicDescription: string;
  basicPerk1: string;
  basicPerk2: string;
  basicPerk3: string;
  basicPerk4: string;
  basicCtaText: string;
  basicGuaranteeText: string;
  basicImageUrl: string;
  basicImageBadge: string;

  // Deluxe Double (Ocean View)
  deluxeEyebrow: string;
  deluxeTitle: string;
  deluxeDescription: string;
  deluxePerk1: string;
  deluxePerk2: string;
  deluxePerk3: string;
  deluxePerk4: string;
  deluxeCtaText: string;
  deluxeGuaranteeText: string;
  deluxeImageUrl: string;
  deluxeImageBadge: string;
}

export interface AboutRooftopSettings {
  headingLead: string;
  tab1Label: string;
  tab2Label: string;

  // Morning Mode
  morningBadge: string;
  morningHeadingHighlight: string;
  morningSubtitle: string;
  morningCard1Tag: string;
  morningCard1Title: string;
  morningCard1Desc: string;
  morningCard2Tag: string;
  morningCard2Title: string;
  morningCard2Desc: string;
  morningPerk1: string;
  morningPerk2: string;
  morningImageUrl: string;
  morningImageTag: string;
  morningDockNote: string;
  morningDockTime: string;

  // Sunset / Golden Hour Mode
  sunsetBadge: string;
  sunsetHeadingHighlight: string;
  sunsetSubtitle: string;
  sunsetCard1Tag: string;
  sunsetCard1Title: string;
  sunsetCard1Desc: string;
  sunsetCard2Tag: string;
  sunsetCard2Title: string;
  sunsetCard2Desc: string;
  sunsetPerk1: string;
  sunsetPerk2: string;
  sunsetImageUrl: string;
  sunsetImageTag: string;
  sunsetDockNote: string;
  sunsetDockTime: string;
}

export interface AboutValuesSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;

  // Pillar 1: Pure Local Roots
  pillar1Badge: string;
  pillar1Tag: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar1Point1: string;
  pillar1Point2: string;
  pillar1Point3: string;

  // Pillar 2: Personal Host Care
  pillar2Badge: string;
  pillar2Tag: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar2Point1: string;
  pillar2Point2: string;
  pillar2Point3: string;

  // Pillar 3: Dedicated Season Upgrades
  pillar3Badge: string;
  pillar3Tag: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar3Point1: string;
  pillar3Point2: string;
  pillar3Point3: string;

  // Host Signature Dock
  dockMonogram: string;
  dockQuote: string;
  dockByline: string;
  dockGuarantee: string;
}

export interface AboutSignatureSettings {
  monogram: string;
  quote: string;
  byline: string;
  guarantee: string;
  badge: string;
  note: string;
}

export interface AboutInvitationSettings {
  badge: string;
  headingLead: string;
  headingHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  perk1: string;
  perk2: string;
  perk3: string;
}

export interface AboutSettings {
  hero: AboutHeroSettings;
  story: AboutStorySettings;
  experience: AboutExperienceSettings;
  sanctuary: AboutSanctuarySettings;
  rooftop: AboutRooftopSettings;
  values: AboutValuesSettings;
  signature: AboutSignatureSettings;
  invitation: AboutInvitationSettings;
}

export const DEFAULT_ABOUT_SETTINGS: AboutSettings = {
  hero: {
    badge: "Authentic Island Heritage • 100% Locally Owned",
    headingLead: "Our Story &",
    headingHighlight: "Heritage",
    subtitle: "Welcome to Ocean Air — your locally owned coastal sanctuary in Weligama Bay, where barefoot luxury, warm Sri Lankan family hospitality, and authentic village living connect.",
    badge1: "100% Locally Owned & Operated",
    badge2: "100 Steps to Weligama Beach",
    ctaText: "Explore Our Story",
    perk1: "100% Locally Owned",
    perk2: "3-Min Walk to Surf Break",
    perk3: "Warm Family Hospitality",
    perk4: "Rooftop Yoga & Sunsets",
    videoUrl: "/videos/about-hero-video.mp4",
    poster: "/images/about-hero-poster.jpg",
  },
  story: {
    badge: "The Weligama Spirit",
    headingLead: "Where Sand, Surf,",
    headingHighlight: "& Local Vibe Connect",
    paragraph1: "Located in a peaceful Sri Lankan coastal enclave just a gentle stroll from the world-famous shores of Weligama Bay, Ocean Air is designed as a sanctuary where barefoot surf lifestyle, deep relaxation, and authentic island warmth naturally intertwine.",
    paragraph2: "Nestled along quiet village pathways away from the bustling main road noise, you enjoy undisturbed tranquility while remaining minutes from popular artisan cafés, beginner-friendly surf breaks, and oceanfront dining. Walk down peaceful local paths to catch the dawn swell, or grab a coffee at nearby hotspots—our boutique escape is built to serve your curiosity.",
    highlight1Title: "3-Min Beach Walk",
    highlight1Subtitle: "Step directly onto gentle sand-bottom surf breaks.",
    highlight2Title: "Family Owned & Run",
    highlight2Subtitle: "Authentic Sri Lankan hospitality, always personal.",
    ctaText: "Plan Your Stay",
    authorInitials: "OA",
    authorName: "Ocean Air Family Team",
    authorLocation: "Weligama, Sri Lanka",
    neighborhoodTitle: "Explore the Neighborhood",
    neighborhoodSubtitle: "Hover or tap on any destination below to discover what surrounds our peaceful tropical escape:",
    spot1Name: "Weligama Beach",
    spot1Distance: "3 min walk",
    spot1Details: "The perfect golden stretch of sand for surfers of all levels. Famous for its consistent, friendly waves and spectacular shallow-water learning areas.",
    spot2Name: "Cafés & Restaurants",
    spot2Distance: "1-5 min walk",
    spot2Details: "A food lover's paradise. Stroll to a variety of highly rated spots serving authentic Sri Lankan rice & curry, fresh seafood, and specialty western coffee.",
    spot3Name: "Sri Lankan Village Life",
    spot3Distance: "On your doorstep",
    spot3Details: "Quiet, peaceful paths away from the bustling main road noise. Walk among swaying coconut trees and experience authentic, warm Sri Lankan village culture.",
    spot4Name: "Surf Breaks & Points",
    spot4Distance: "3 min walk",
    spot4Details: "Immediate access to local breaks. Whether you're catching your very first wave or seeking hidden points, our spot matches your travel style."
  },
  experience: {
    badge: "Tailored Travel Styles",
    headingLead: "Sri Lanka,",
    headingHighlight: "At Your Own Pace",
    subtitle: "More than accommodation—your southern escape shaped around your personal rhythm. Add any combination of sunrise surf, rooftop yoga, or whale encounters whenever inspiration strikes.",
    pill1: "Zero Strict Schedules",
    pill2: "Book Now or On Arrival",
    pill3: "100% Curated Local Masters",
    addOnsTitle: "Our Custom Add-Ons",
    addOnsSubtitle: "Select or mix any experiences during your stay",
    addOnsBadge: "7 Experiences",
    tailoredTitle: "Your Tailored Stay",
    tailoredEyebrow: "Bespoke Coastal Concierge",
    tailoredDesc: "Design an island itinerary as spontaneous or structured as you like. Add experiences during reservation or decide once your feet touch the sand.",
    benefit1: "Add during booking or upon arrival",
    benefit2: "Zero strict schedules — enjoy at your pace",
    benefit3: "Premium surfboards & rooftop mats included",
    benefit4: "100% risk-free: modify or cancel anytime",
    freedomTitle: "Unrestricted Duration Freedom",
    freedomText: "Stay 2 nights or 2 weeks. Custom build an authentic coastal stay that matches your personal budget and rhythm.",
    ctaText: "Explore Curated Packages",
    exp1Name: "Surf Packages",
    exp1Category: "Adventure",
    exp1Desc: "Complete options designed for different skills, including board rentals & daily coach reviews.",
    exp2Name: "Yoga Experiences",
    exp2Category: "Wellness",
    exp2Desc: "Restorative classes on our rooftop, perfect for deep surf recovery and centering your mind.",
    exp3Name: "Surfing Lessons",
    exp3Category: "Adventure",
    exp3Desc: "Step-by-step coaching from friendly, local ISA-certified instructors right at the beach.",
    exp4Name: "Whale Watching Tours",
    exp4Category: "Nature",
    exp4Desc: "Stunning boat trips from neighboring Mirissa Harbor to see majestic blue whales up close.",
    exp5Name: "Safari Trips",
    exp5Category: "Nature",
    exp5Desc: "Venture to Udawalawe or Yala National Parks to see wild elephants, leopards, and rich birdlife.",
    exp6Name: "Cookery Classes",
    exp6Category: "Culture",
    exp6Desc: "Learn to grind local spices and cook the perfect, fragrant Sri Lankan rice & coconut curry.",
    exp7Name: "Scooter Rentals",
    exp7Category: "Adventure",
    exp7Desc: "Grab a scooter to explore pristine coastal roads and hidden bays at your own pace."
  },
  sanctuary: {
    badge: "Sleep & Sanctuary",
    headingLead: "Designed For",
    headingHighlight: "Every Stay & Budget",
    tab1Label: "Basic Private Room",
    tab2Label: "Deluxe Double (Ocean View)",

    // Basic Private Room
    basicEyebrow: "Cozy Comfort & Value",
    basicTitle: "Comfortable Basic Private",
    basicDescription: "Traveling on a budget or looking for quiet, peaceful privacy? Our Basic Private Rooms are prepared with authentic hospitality. Clean, cozy, and quiet, they offer the perfect sanctuary to sleep deeply and recharge after long hours catching waves at Weligama Beach.",
    basicPerk1: "Quiet Village Vibe",
    basicPerk2: "High-Speed Wi-Fi",
    basicPerk3: "Cozy Restful Space",
    basicPerk4: "Daily Housekeeping",
    basicCtaText: "View Rates",
    basicGuaranteeText: "Best direct price guarantee",
    basicImageUrl: "/images/Comfortable_Basic_Private.jpeg",
    basicImageBadge: "Quiet Ground-Floor Village Setting",

    // Deluxe Double (Ocean View)
    deluxeEyebrow: "Elevated Horizon Experience",
    deluxeTitle: "Deluxe Double With Balcony",
    deluxeDescription: "Wake up to tropical light and breathtaking views across the bay. Our top-floor Deluxe Double features a private balcony terrace where ocean breeze and morning coffee start your day right.",
    deluxePerk1: "Private Ocean Balcony",
    deluxePerk2: "Panoramic Ocean Views",
    deluxePerk3: "Whisper-Quiet A/C",
    deluxePerk4: "Authentic Local Styling",
    deluxeCtaText: "View Rates",
    deluxeGuaranteeText: "Top-floor ocean horizon view",
    deluxeImageUrl: "/images/Deluxe_Double%20with_Balcony.jpeg",
    deluxeImageBadge: "Ocean Horizon • Private Balcony Terrace",
  },
  rooftop: {
    headingLead: "The Rooftop Café",
    tab1Label: "Morning Vibes",
    tab2Label: "Golden Hour",

    // Morning Mode
    morningBadge: "Scenic Culinary Rooftop",
    morningHeadingHighlight: "• Sunrise Roasts & Vistas",
    morningSubtitle: "Wake up to freshly roasted Sri Lankan highland espresso, tropical smoothie bowls, and crisp morning offshore breezes. Check the morning surf sets rolling into Weligama Bay before paddling out into the waves.",
    morningCard1Tag: "7:00 AM – 11:30 AM",
    morningCard1Title: "Artisan Roasts & Bowls",
    morningCard1Desc: "Fresh single-origin Ceylon espresso, pour-overs, and organic tropical smoothie bowls crafted to fuel your surf morning.",
    morningCard2Tag: "180° Panoramic Vantage",
    morningCard2Title: "Dawn Surf Conditions",
    morningCard2Desc: "Check Weligama Bay wave sets and wind conditions from the highest terrace vantage while enjoying your morning brew.",
    morningPerk1: "Organic local ingredients",
    morningPerk2: "High-speed terrace Wi-Fi",
    morningImageUrl: "/images/morning-vibe.png",
    morningImageTag: "Morning Sunrise Service",
    morningDockNote: "Complimentary breakfast & espresso for resident bookings.",
    morningDockTime: "7AM - 11:30AM",

    // Sunset / Golden Hour Mode
    sunsetBadge: "Sunset Horizon Deck",
    sunsetHeadingHighlight: "• Golden Hour Rhythms",
    sunsetSubtitle: "As the sun dips below the Indian Ocean horizon, our rooftop transforms into Weligama's premier vantage point. Sip artisanal island cocktails, catch the golden swell glow, and soak in mellow ambient tunes.",
    sunsetCard1Tag: "5:00 PM – 9:30 PM",
    sunsetCard1Title: "Craft Sun-Downers",
    sunsetCard1Desc: "Signature island-infused mocktails, fresh coconut elixirs, and tapas paired with ambient dusk beats.",
    sunsetCard2Tag: "360° Sunset Horizon",
    sunsetCard2Title: "Golden Hour Ocean Vista",
    sunsetCard2Desc: "Watch the southern sky ignite in vivid shades of amber and magenta with unhindered views straight over the bay.",
    sunsetPerk1: "Ambient dusk acoustics",
    sunsetPerk2: "Resident VIP seating",
    sunsetImageUrl: "/images/gallery-sunset.png",
    sunsetImageTag: "Golden Hour Vista Deck",
    sunsetDockNote: "Weligama's premier sunset vista. Resident priority seating.",
    sunsetDockTime: "5PM - 9:30PM",
  },
  values: {
    badge: "Our Founding Identity",
    headingLead: "Rooted in Weligama,",
    headingHighlight: "Driven by Family Values",
    subtitle: "More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide. We combine authentic Southern Sri Lankan warmth with 5-star hospitality standards.",

    // Pillar 1: Pure Local Roots
    pillar1Badge: "Pure Local Roots",
    pillar1Tag: "INDEPENDENT HERITAGE",
    pillar1Title: "100% Locally Owned & Run",
    pillar1Desc: "Proudly independent and family-operated. Every booking directly supports Weligama families, local fishermen, surf instructors, and the sustainable vitality of our coastal community.",
    pillar1Point1: "100% Sri Lankan family-owned & operated",
    pillar1Point2: "Local team hiring with fair living wages",
    pillar1Point3: "Direct reinvestment into Weligama village",

    // Pillar 2: Personal Host Care
    pillar2Badge: "Personal Host Care",
    pillar2Tag: "SOUTHERN HOSPITALITY",
    pillar2Title: "Warm Family Atmosphere",
    pillar2Desc: "You are never just a room number here. Our family is on-site daily to share authentic homemade breakfast tips, hidden surf breaks, and heartfelt care from check-in to farewell.",
    pillar2Point1: "Genuine hosts living on-site 24/7",
    pillar2Point2: "Insider guidance for secret uncrowded spots",
    pillar2Point3: "True island home-away-from-home feeling",

    // Pillar 3: Dedicated Season Upgrades
    pillar3Badge: "Yearly Refinements",
    pillar3Tag: "UNCOMPROMISING COMFORT",
    pillar3Title: "Dedicated Season Upgrades",
    pillar3Desc: "We continuously reinvest each season into high-pressure rain showers, whisper-quiet air conditioning, luxury orthopedic bedding, and fast fiber Wi-Fi across all spaces.",
    pillar3Point1: "Annual room comfort & amenity enhancements",
    pillar3Point2: "Whisper-quiet Daikin A/C & rain showers",
    pillar3Point3: "High-speed fiber connectivity in every space",

    // Host Signature Dock
    dockMonogram: "OA",
    dockQuote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    dockByline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    dockGuarantee: "100% Genuine Hospitality",
  },
  signature: {
    monogram: "OA",
    quote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    byline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    guarantee: "100% Genuine Hospitality",
    badge: "Resident Family Pledge",
    note: "We welcome every guest as personal family from the moment you step foot on our golden sand.",
  },
  invitation: {
    badge: "Your Weligama Escape",
    headingLead: "Ready to Discover",
    headingHighlight: "Southern Sri Lanka?",
    subtitle: "Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts, or unwinding under starlit coastal skies—your unforgettable island story begins at Ocean Air.",
    ctaText: "Book Your Experience",
    ctaLink: "/book?new=1",
    perk1: "Best Direct Rates Guaranteed",
    perk2: "Free 3-Min Beach Walk Location",
    perk3: "100% Flexible Booking Options",
  }
};

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("home");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current live home settings
  const { data: homeSettingData, isLoading: isLoadingSettings } = useGetSetting("home_settings", {
    query: { refetchOnMount: "always", refetchOnWindowFocus: true, staleTime: 0 } as any
  });
  // Fetch current live gallery settings
  const { data: gallerySettingData, isLoading: isLoadingGallerySettings } = useGetSetting("gallery_settings", {
    query: { refetchOnMount: "always", refetchOnWindowFocus: true, staleTime: 0 } as any
  });
  // Fetch current live contact settings
  const { data: contactSettingData, isLoading: isLoadingContactSettings } = useGetSetting("contact_settings", {
    query: { refetchOnMount: "always", refetchOnWindowFocus: true, staleTime: 0 } as any
  });
  // Fetch current live about settings
  const { data: aboutSettingData, isLoading: isLoadingAboutSettings } = useGetSetting("about_settings", {
    query: { refetchOnMount: "always", refetchOnWindowFocus: true, staleTime: 0 } as any
  });
  const updateSetting = useAdminUpdateSetting();

  // Hero form state
  const [heroForm, setHeroForm] = useState(DEFAULT_HERO_SETTINGS);
  // Reassurance cards form state
  const [reassuranceForm, setReassuranceForm] = useState<ReassuranceSettings>(DEFAULT_REASSURANCE_SETTINGS);
  // Experiences pillars form state
  const [experiencesForm, setExperiencesForm] = useState<ExperiencesSettings>(DEFAULT_EXPERIENCES_SETTINGS);
  const [uploadingCardIndex, setUploadingCardIndex] = useState<number | null>(null);

  // Why Choose Us form state
  const [whyChooseUsForm, setWhyChooseUsForm] = useState<WhyChooseUsSettings>(DEFAULT_WHY_CHOOSE_US_SETTINGS);
  const [isUploadingShowcase, setIsUploadingShowcase] = useState(false);
  const [uploadingAvatarIndex, setUploadingAvatarIndex] = useState<number | null>(null);

  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Gallery tab form state
  const [galleryForm, setGalleryForm] = useState<GallerySettings>(DEFAULT_GALLERY_SETTINGS);
  const [uploadingVideoIndex, setUploadingVideoIndex] = useState<number | null>(null);
  const [isGallerySavedRecently, setIsGallerySavedRecently] = useState(false);

  // Contact tab form state
  const [contactForm, setContactForm] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [isUploadingContactVideo, setIsUploadingContactVideo] = useState(false);
  const [isUploadingContactPoster, setIsUploadingContactPoster] = useState(false);
  const [isContactSavedRecently, setIsContactSavedRecently] = useState(false);

  // About tab form state
  const [aboutForm, setAboutForm] = useState<AboutSettings>(DEFAULT_ABOUT_SETTINGS);
  const [isUploadingAboutVideo, setIsUploadingAboutVideo] = useState(false);
  const [isUploadingAboutPoster, setIsUploadingAboutPoster] = useState(false);
  const [isAboutSavedRecently, setIsAboutSavedRecently] = useState(false);
  const [isAboutStorySavedRecently, setIsAboutStorySavedRecently] = useState(false);
  const [isAboutExperienceSavedRecently, setIsAboutExperienceSavedRecently] = useState(false);
  const [isAboutSanctuarySavedRecently, setIsAboutSanctuarySavedRecently] = useState(false);
  const [isAboutRooftopSavedRecently, setIsAboutRooftopSavedRecently] = useState(false);
  const [isAboutValuesSavedRecently, setIsAboutValuesSavedRecently] = useState(false);
  const [isAboutSignatureSavedRecently, setIsAboutSignatureSavedRecently] = useState(false);
  const [isAboutInvitationSavedRecently, setIsAboutInvitationSavedRecently] = useState(false);
  const [adminActiveRoomTab, setAdminActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [previewActiveRoomTab, setPreviewActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [adminActiveAtmosphereTab, setAdminActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [previewActiveAtmosphereTab, setPreviewActiveAtmosphereTab] = useState<"morning" | "sunset">("morning");
  const [adminActivePillarTab, setAdminActivePillarTab] = useState<number>(1);
  const [isUploadingBasicRoomImg, setIsUploadingBasicRoomImg] = useState(false);
  const [isUploadingDeluxeRoomImg, setIsUploadingDeluxeRoomImg] = useState(false);
  const [isUploadingMorningImg, setIsUploadingMorningImg] = useState(false);
  const [isUploadingSunsetImg, setIsUploadingSunsetImg] = useState(false);
  const [previewAboutSpotHover, setPreviewAboutSpotHover] = useState<string | null>("village");

  // Sync form state when backend data arrives
  useEffect(() => {
    if (homeSettingData?.value) {
      const val = homeSettingData.value as any;
      if (val.hero) {
        const rawGuests = val.hero.guestsCount;
        const parsedGuests = typeof rawGuests === "number"
          ? rawGuests
          : parseInt(String(rawGuests || "").replace(/[^\d]/g, ""), 10);

        const rawRating = val.hero.ratingScore;
        const parsedRating = typeof rawRating === "number"
          ? rawRating
          : parseFloat(String(rawRating || "").replace(/[^0-9.]/g, ""));

        setHeroForm({
          ratingScore: Number.isFinite(parsedRating) && parsedRating > 0 ? parsedRating : DEFAULT_HERO_SETTINGS.ratingScore,
          ratingLabel: (val.hero.ratingLabel ? String(val.hero.ratingLabel).replace(/^\/+/, "").trim() : "") || DEFAULT_HERO_SETTINGS.ratingLabel,
          guestsCount: Number.isFinite(parsedGuests) && parsedGuests > 0 ? parsedGuests : DEFAULT_HERO_SETTINGS.guestsCount,
          guestsSuffix: (val.hero.guestsSuffix ? String(val.hero.guestsSuffix).replace(/^\/+/, "").trim() : "") || DEFAULT_HERO_SETTINGS.guestsSuffix,
          guestsLabel: (val.hero.guestsLabel ? String(val.hero.guestsLabel).replace(/^\/+/, "").trim() : "") || DEFAULT_HERO_SETTINGS.guestsLabel,
          taglineHighlight: (val.hero.taglineHighlight ? String(val.hero.taglineHighlight).replace(/^\/+/, "").trim() : "") || DEFAULT_HERO_SETTINGS.taglineHighlight,
          taglineText: (val.hero.taglineText ? String(val.hero.taglineText).replace(/^\/+/, "").trim() : "") || DEFAULT_HERO_SETTINGS.taglineText,
        });
      }
      if (val.reassurance) {
        setReassuranceForm({
          card1: {
            stat: val.reassurance.card1?.stat ?? DEFAULT_REASSURANCE_SETTINGS.card1.stat,
            title: val.reassurance.card1?.title ?? DEFAULT_REASSURANCE_SETTINGS.card1.title,
            desc: val.reassurance.card1?.desc ?? DEFAULT_REASSURANCE_SETTINGS.card1.desc,
          },
          card2: {
            stat: val.reassurance.card2?.stat ?? DEFAULT_REASSURANCE_SETTINGS.card2.stat,
            title: val.reassurance.card2?.title ?? DEFAULT_REASSURANCE_SETTINGS.card2.title,
            desc: val.reassurance.card2?.desc ?? DEFAULT_REASSURANCE_SETTINGS.card2.desc,
          },
          card3: {
            stat: val.reassurance.card3?.stat ?? DEFAULT_REASSURANCE_SETTINGS.card3.stat,
            suffix: val.reassurance.card3?.suffix ?? DEFAULT_REASSURANCE_SETTINGS.card3.suffix,
            title: val.reassurance.card3?.title ?? DEFAULT_REASSURANCE_SETTINGS.card3.title,
            desc: val.reassurance.card3?.desc ?? DEFAULT_REASSURANCE_SETTINGS.card3.desc,
          },
          card4: {
            stat: val.reassurance.card4?.stat ?? DEFAULT_REASSURANCE_SETTINGS.card4.stat,
            title: val.reassurance.card4?.title ?? DEFAULT_REASSURANCE_SETTINGS.card4.title,
            desc: val.reassurance.card4?.desc ?? DEFAULT_REASSURANCE_SETTINGS.card4.desc,
          },
        });
      }
      if (val.experiences) {
        setExperiencesForm({
          badge: val.experiences.badge ?? DEFAULT_EXPERIENCES_SETTINGS.badge,
          title: val.experiences.title ?? DEFAULT_EXPERIENCES_SETTINGS.title,
          description: val.experiences.description ?? DEFAULT_EXPERIENCES_SETTINGS.description,
          cards: (val.experiences.cards && Array.isArray(val.experiences.cards) && val.experiences.cards.length === 4)
            ? val.experiences.cards.map((c: any, i: number) => ({
              id: c.id || DEFAULT_EXPERIENCES_SETTINGS.cards[i].id,
              num: c.num || DEFAULT_EXPERIENCES_SETTINGS.cards[i].num,
              title: c.title || DEFAULT_EXPERIENCES_SETTINGS.cards[i].title,
              tagline: c.tagline || DEFAULT_EXPERIENCES_SETTINGS.cards[i].tagline,
              description: c.description || DEFAULT_EXPERIENCES_SETTINGS.cards[i].description,
              img: c.img || DEFAULT_EXPERIENCES_SETTINGS.cards[i].img,
              href: c.href || DEFAULT_EXPERIENCES_SETTINGS.cards[i].href,
            }))
            : DEFAULT_EXPERIENCES_SETTINGS.cards,
        });
      }
      if (val.whyChooseUs) {
        setWhyChooseUsForm({
          badge: val.whyChooseUs.badge ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.badge,
          headingLead: val.whyChooseUs.headingLead ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.headingLead,
          headingHighlight: val.whyChooseUs.headingHighlight ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.headingHighlight,
          description: val.whyChooseUs.description ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.description,
          features: (val.whyChooseUs.features && Array.isArray(val.whyChooseUs.features) && val.whyChooseUs.features.length === 3)
            ? val.whyChooseUs.features.map((f: any, i: number) => ({
              id: f.id || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].id,
              icon: f.icon || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].icon,
              title: f.title || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].title,
              desc: f.desc || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].desc,
            }))
            : DEFAULT_WHY_CHOOSE_US_SETTINGS.features,
          socialProof: {
            score: val.whyChooseUs.socialProof?.score ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.score,
            text: val.whyChooseUs.socialProof?.text ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.text,
            avatars: (val.whyChooseUs.socialProof?.avatars && Array.isArray(val.whyChooseUs.socialProof.avatars))
              ? val.whyChooseUs.socialProof.avatars.map((a: string) => normalizeAssetPath(a) || a)
              : DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.avatars,
            avatarBadge: val.whyChooseUs.socialProof?.avatarBadge ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.avatarBadge,
          },
          showcase: {
            image: normalizeAssetPath(val.whyChooseUs.showcase?.image) || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.image,
            awardTag: val.whyChooseUs.showcase?.awardTag ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.awardTag,
            awardTitle: val.whyChooseUs.showcase?.awardTitle ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.awardTitle,
            awardIcon: val.whyChooseUs.showcase?.awardIcon ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.awardIcon,
            testimonialQuote: val.whyChooseUs.showcase?.testimonialQuote ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.testimonialQuote,
            testimonialAuthor: val.whyChooseUs.showcase?.testimonialAuthor ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.testimonialAuthor,
            testimonialAuthorRole: val.whyChooseUs.showcase?.testimonialAuthorRole ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.testimonialAuthorRole,
            testimonialAuthorInitial: val.whyChooseUs.showcase?.testimonialAuthorInitial ?? DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.testimonialAuthorInitial,
          },
        });
      }
    }
  }, [homeSettingData]);

  // Sync gallery form state when backend data arrives
  useEffect(() => {
    if (gallerySettingData?.value) {
      const val = gallerySettingData.value as any;
      if (val.featuredMoments) {
        setGalleryForm({
          featuredMoments: {
            badge: val.featuredMoments.badge ?? DEFAULT_GALLERY_SETTINGS.featuredMoments.badge,
            headingLead: val.featuredMoments.headingLead ?? DEFAULT_GALLERY_SETTINGS.featuredMoments.headingLead,
            headingHighlight: val.featuredMoments.headingHighlight ?? DEFAULT_GALLERY_SETTINGS.featuredMoments.headingHighlight,
            subtitle: val.featuredMoments.subtitle ?? DEFAULT_GALLERY_SETTINGS.featuredMoments.subtitle,
            journalStatus: val.featuredMoments.journalStatus ?? DEFAULT_GALLERY_SETTINGS.featuredMoments.journalStatus,
            journalSubtext: val.featuredMoments.journalSubtext ?? DEFAULT_GALLERY_SETTINGS.featuredMoments.journalSubtext,
            shareCtaText: val.featuredMoments.shareCtaText ?? DEFAULT_GALLERY_SETTINGS.featuredMoments.shareCtaText,
            videos: (val.featuredMoments.videos && Array.isArray(val.featuredMoments.videos) && val.featuredMoments.videos.length > 0)
              ? val.featuredMoments.videos.map((v: any, i: number) => ({
                id: v.id || `f${i + 1}`,
                url: v.url || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.url || "",
                alt: v.alt || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.alt || "",
                caption: v.caption || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.caption || "",
                badge: v.badge || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.badge || "",
                location: v.location || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.location || "",
                subtitle: v.subtitle || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.subtitle || "",
                staggerClass: v.staggerClass || (i === 1 ? "md:translate-y-5 lg:translate-y-7" : "md:-translate-y-5 lg:-translate-y-7"),
                fromY: v.fromY ?? (i === 1 ? 60 : -60),
                type: v.type || "video",
              }))
              : DEFAULT_GALLERY_SETTINGS.featuredMoments.videos,
          }
        });
      }
    }
  }, [gallerySettingData]);

  // Sync contact form state when backend data arrives
  useEffect(() => {
    if (contactSettingData?.value) {
      const val = contactSettingData.value as any;
      setContactForm((prev) => ({
        hero: val.hero
          ? {
            badge: val.hero.badge ?? DEFAULT_CONTACT_SETTINGS.hero.badge,
            headingLead: val.hero.headingLead ?? DEFAULT_CONTACT_SETTINGS.hero.headingLead,
            headingHighlight: val.hero.headingHighlight ?? DEFAULT_CONTACT_SETTINGS.hero.headingHighlight,
            subtitle: val.hero.subtitle ?? DEFAULT_CONTACT_SETTINGS.hero.subtitle,
            badge1: val.hero.badge1 ?? DEFAULT_CONTACT_SETTINGS.hero.badge1,
            badge2: val.hero.badge2 ?? DEFAULT_CONTACT_SETTINGS.hero.badge2,
            ctaText: val.hero.ctaText ?? DEFAULT_CONTACT_SETTINGS.hero.ctaText,
            whatsappText: val.hero.whatsappText ?? DEFAULT_CONTACT_SETTINGS.hero.whatsappText,
            whatsappNumber: val.hero.whatsappNumber ?? DEFAULT_CONTACT_SETTINGS.hero.whatsappNumber,
            videoUrl: val.hero.videoUrl ?? DEFAULT_CONTACT_SETTINGS.hero.videoUrl,
            poster: val.hero.poster ?? DEFAULT_CONTACT_SETTINGS.hero.poster,
            phone: val.hero.phone ?? DEFAULT_CONTACT_SETTINGS.hero.phone,
            email: val.hero.email ?? DEFAULT_CONTACT_SETTINGS.hero.email,
            location: val.hero.location ?? DEFAULT_CONTACT_SETTINGS.hero.location,
            hours: val.hero.hours ?? DEFAULT_CONTACT_SETTINGS.hero.hours,
          }
          : prev.hero,
        channels: val.channels
          ? {
            badge: val.channels.badge ?? DEFAULT_CONTACT_SETTINGS.channels.badge,
            headingLead: val.channels.headingLead ?? DEFAULT_CONTACT_SETTINGS.channels.headingLead,
            headingHighlight: val.channels.headingHighlight ?? DEFAULT_CONTACT_SETTINGS.channels.headingHighlight,
            subtitle: val.channels.subtitle ?? DEFAULT_CONTACT_SETTINGS.channels.subtitle,
            emailTitle: val.channels.emailTitle ?? DEFAULT_CONTACT_SETTINGS.channels.emailTitle,
            emailValue: val.channels.emailValue ?? DEFAULT_CONTACT_SETTINGS.channels.emailValue,
            emailLink: val.channels.emailLink ?? DEFAULT_CONTACT_SETTINGS.channels.emailLink,
            phoneTitle: val.channels.phoneTitle ?? DEFAULT_CONTACT_SETTINGS.channels.phoneTitle,
            phoneValue: val.channels.phoneValue ?? DEFAULT_CONTACT_SETTINGS.channels.phoneValue,
            phoneLink: val.channels.phoneLink ?? DEFAULT_CONTACT_SETTINGS.channels.phoneLink,
            locationTitle: val.channels.locationTitle ?? DEFAULT_CONTACT_SETTINGS.channels.locationTitle,
            locationValue: val.channels.locationValue ?? DEFAULT_CONTACT_SETTINGS.channels.locationValue,
            locationLink: val.channels.locationLink ?? DEFAULT_CONTACT_SETTINGS.channels.locationLink,
            guaranteeBadge: val.channels.guaranteeBadge ?? DEFAULT_CONTACT_SETTINGS.channels.guaranteeBadge,
            guaranteeText: val.channels.guaranteeText ?? DEFAULT_CONTACT_SETTINGS.channels.guaranteeText,
          }
          : prev.channels,
      }));
    }
  }, [contactSettingData]);

  // Sync about form state when backend data arrives
  useEffect(() => {
    if (aboutSettingData?.value) {
      const val = aboutSettingData.value as any;
      setAboutForm({
        hero: {
          badge: val.hero?.badge ?? DEFAULT_ABOUT_SETTINGS.hero.badge,
          headingLead: val.hero?.headingLead ?? DEFAULT_ABOUT_SETTINGS.hero.headingLead,
          headingHighlight: val.hero?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.hero.headingHighlight,
          subtitle: val.hero?.subtitle ?? DEFAULT_ABOUT_SETTINGS.hero.subtitle,
          badge1: val.hero?.badge1 ?? DEFAULT_ABOUT_SETTINGS.hero.badge1,
          badge2: val.hero?.badge2 ?? DEFAULT_ABOUT_SETTINGS.hero.badge2,
          ctaText: val.hero?.ctaText ?? DEFAULT_ABOUT_SETTINGS.hero.ctaText,
          perk1: val.hero?.perk1 ?? DEFAULT_ABOUT_SETTINGS.hero.perk1,
          perk2: val.hero?.perk2 ?? DEFAULT_ABOUT_SETTINGS.hero.perk2,
          perk3: val.hero?.perk3 ?? DEFAULT_ABOUT_SETTINGS.hero.perk3,
          perk4: val.hero?.perk4 ?? DEFAULT_ABOUT_SETTINGS.hero.perk4,
          videoUrl: val.hero?.videoUrl ?? DEFAULT_ABOUT_SETTINGS.hero.videoUrl,
          poster: val.hero?.poster ?? DEFAULT_ABOUT_SETTINGS.hero.poster,
        },
        story: {
          badge: val.story?.badge ?? DEFAULT_ABOUT_SETTINGS.story.badge,
          headingLead: val.story?.headingLead ?? DEFAULT_ABOUT_SETTINGS.story.headingLead,
          headingHighlight: val.story?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.story.headingHighlight,
          paragraph1: val.story?.paragraph1 ?? DEFAULT_ABOUT_SETTINGS.story.paragraph1,
          paragraph2: val.story?.paragraph2 ?? DEFAULT_ABOUT_SETTINGS.story.paragraph2,
          highlight1Title: val.story?.highlight1Title ?? DEFAULT_ABOUT_SETTINGS.story.highlight1Title,
          highlight1Subtitle: val.story?.highlight1Subtitle ?? DEFAULT_ABOUT_SETTINGS.story.highlight1Subtitle,
          highlight2Title: val.story?.highlight2Title ?? DEFAULT_ABOUT_SETTINGS.story.highlight2Title,
          highlight2Subtitle: val.story?.highlight2Subtitle ?? DEFAULT_ABOUT_SETTINGS.story.highlight2Subtitle,
          ctaText: val.story?.ctaText ?? DEFAULT_ABOUT_SETTINGS.story.ctaText,
          authorInitials: val.story?.authorInitials ?? DEFAULT_ABOUT_SETTINGS.story.authorInitials,
          authorName: val.story?.authorName ?? DEFAULT_ABOUT_SETTINGS.story.authorName,
          authorLocation: val.story?.authorLocation ?? DEFAULT_ABOUT_SETTINGS.story.authorLocation,
          neighborhoodTitle: val.story?.neighborhoodTitle ?? DEFAULT_ABOUT_SETTINGS.story.neighborhoodTitle,
          neighborhoodSubtitle: val.story?.neighborhoodSubtitle ?? DEFAULT_ABOUT_SETTINGS.story.neighborhoodSubtitle,
          spot1Name: val.story?.spot1Name ?? DEFAULT_ABOUT_SETTINGS.story.spot1Name,
          spot1Distance: val.story?.spot1Distance ?? DEFAULT_ABOUT_SETTINGS.story.spot1Distance,
          spot1Details: val.story?.spot1Details ?? DEFAULT_ABOUT_SETTINGS.story.spot1Details,
          spot2Name: val.story?.spot2Name ?? DEFAULT_ABOUT_SETTINGS.story.spot2Name,
          spot2Distance: val.story?.spot2Distance ?? DEFAULT_ABOUT_SETTINGS.story.spot2Distance,
          spot2Details: val.story?.spot2Details ?? DEFAULT_ABOUT_SETTINGS.story.spot2Details,
          spot3Name: val.story?.spot3Name ?? DEFAULT_ABOUT_SETTINGS.story.spot3Name,
          spot3Distance: val.story?.spot3Distance ?? DEFAULT_ABOUT_SETTINGS.story.spot3Distance,
          spot3Details: val.story?.spot3Details ?? DEFAULT_ABOUT_SETTINGS.story.spot3Details,
          spot4Name: val.story?.spot4Name ?? DEFAULT_ABOUT_SETTINGS.story.spot4Name,
          spot4Distance: val.story?.spot4Distance ?? DEFAULT_ABOUT_SETTINGS.story.spot4Distance,
          spot4Details: val.story?.spot4Details ?? DEFAULT_ABOUT_SETTINGS.story.spot4Details,
        },
        experience: {
          badge: val.experience?.badge ?? DEFAULT_ABOUT_SETTINGS.experience.badge,
          headingLead: val.experience?.headingLead ?? DEFAULT_ABOUT_SETTINGS.experience.headingLead,
          headingHighlight: val.experience?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.experience.headingHighlight,
          subtitle: val.experience?.subtitle ?? DEFAULT_ABOUT_SETTINGS.experience.subtitle,
          pill1: val.experience?.pill1 ?? DEFAULT_ABOUT_SETTINGS.experience.pill1,
          pill2: val.experience?.pill2 ?? DEFAULT_ABOUT_SETTINGS.experience.pill2,
          pill3: val.experience?.pill3 ?? DEFAULT_ABOUT_SETTINGS.experience.pill3,
          addOnsTitle: val.experience?.addOnsTitle ?? DEFAULT_ABOUT_SETTINGS.experience.addOnsTitle,
          addOnsSubtitle: val.experience?.addOnsSubtitle ?? DEFAULT_ABOUT_SETTINGS.experience.addOnsSubtitle,
          addOnsBadge: val.experience?.addOnsBadge ?? DEFAULT_ABOUT_SETTINGS.experience.addOnsBadge,
          tailoredTitle: val.experience?.tailoredTitle ?? DEFAULT_ABOUT_SETTINGS.experience.tailoredTitle,
          tailoredEyebrow: val.experience?.tailoredEyebrow ?? DEFAULT_ABOUT_SETTINGS.experience.tailoredEyebrow,
          tailoredDesc: val.experience?.tailoredDesc ?? DEFAULT_ABOUT_SETTINGS.experience.tailoredDesc,
          benefit1: val.experience?.benefit1 ?? DEFAULT_ABOUT_SETTINGS.experience.benefit1,
          benefit2: val.experience?.benefit2 ?? DEFAULT_ABOUT_SETTINGS.experience.benefit2,
          benefit3: val.experience?.benefit3 ?? DEFAULT_ABOUT_SETTINGS.experience.benefit3,
          benefit4: val.experience?.benefit4 ?? DEFAULT_ABOUT_SETTINGS.experience.benefit4,
          freedomTitle: val.experience?.freedomTitle ?? DEFAULT_ABOUT_SETTINGS.experience.freedomTitle,
          freedomText: val.experience?.freedomText ?? DEFAULT_ABOUT_SETTINGS.experience.freedomText,
          ctaText: val.experience?.ctaText ?? DEFAULT_ABOUT_SETTINGS.experience.ctaText,
          exp1Name: val.experience?.exp1Name ?? DEFAULT_ABOUT_SETTINGS.experience.exp1Name,
          exp1Category: val.experience?.exp1Category ?? DEFAULT_ABOUT_SETTINGS.experience.exp1Category,
          exp1Desc: val.experience?.exp1Desc ?? DEFAULT_ABOUT_SETTINGS.experience.exp1Desc,
          exp2Name: val.experience?.exp2Name ?? DEFAULT_ABOUT_SETTINGS.experience.exp2Name,
          exp2Category: val.experience?.exp2Category ?? DEFAULT_ABOUT_SETTINGS.experience.exp2Category,
          exp2Desc: val.experience?.exp2Desc ?? DEFAULT_ABOUT_SETTINGS.experience.exp2Desc,
          exp3Name: val.experience?.exp3Name ?? DEFAULT_ABOUT_SETTINGS.experience.exp3Name,
          exp3Category: val.experience?.exp3Category ?? DEFAULT_ABOUT_SETTINGS.experience.exp3Category,
          exp3Desc: val.experience?.exp3Desc ?? DEFAULT_ABOUT_SETTINGS.experience.exp3Desc,
          exp4Name: val.experience?.exp4Name ?? DEFAULT_ABOUT_SETTINGS.experience.exp4Name,
          exp4Category: val.experience?.exp4Category ?? DEFAULT_ABOUT_SETTINGS.experience.exp4Category,
          exp4Desc: val.experience?.exp4Desc ?? DEFAULT_ABOUT_SETTINGS.experience.exp4Desc,
          exp5Name: val.experience?.exp5Name ?? DEFAULT_ABOUT_SETTINGS.experience.exp5Name,
          exp5Category: val.experience?.exp5Category ?? DEFAULT_ABOUT_SETTINGS.experience.exp5Category,
          exp5Desc: val.experience?.exp5Desc ?? DEFAULT_ABOUT_SETTINGS.experience.exp5Desc,
          exp6Name: val.experience?.exp6Name ?? DEFAULT_ABOUT_SETTINGS.experience.exp6Name,
          exp6Category: val.experience?.exp6Category ?? DEFAULT_ABOUT_SETTINGS.experience.exp6Category,
          exp6Desc: val.experience?.exp6Desc ?? DEFAULT_ABOUT_SETTINGS.experience.exp6Desc,
          exp7Name: val.experience?.exp7Name ?? DEFAULT_ABOUT_SETTINGS.experience.exp7Name,
          exp7Category: val.experience?.exp7Category ?? DEFAULT_ABOUT_SETTINGS.experience.exp7Category,
          exp7Desc: val.experience?.exp7Desc ?? DEFAULT_ABOUT_SETTINGS.experience.exp7Desc,
        },
        sanctuary: {
          badge: val.sanctuary?.badge ?? DEFAULT_ABOUT_SETTINGS.sanctuary.badge,
          headingLead: val.sanctuary?.headingLead ?? DEFAULT_ABOUT_SETTINGS.sanctuary.headingLead,
          headingHighlight: val.sanctuary?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.sanctuary.headingHighlight,
          tab1Label: val.sanctuary?.tab1Label ?? DEFAULT_ABOUT_SETTINGS.sanctuary.tab1Label,
          tab2Label: val.sanctuary?.tab2Label ?? DEFAULT_ABOUT_SETTINGS.sanctuary.tab2Label,
          basicEyebrow: val.sanctuary?.basicEyebrow ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicEyebrow,
          basicTitle: val.sanctuary?.basicTitle ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicTitle,
          basicDescription: val.sanctuary?.basicDescription ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicDescription,
          basicPerk1: val.sanctuary?.basicPerk1 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk1,
          basicPerk2: val.sanctuary?.basicPerk2 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk2,
          basicPerk3: val.sanctuary?.basicPerk3 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk3,
          basicPerk4: val.sanctuary?.basicPerk4 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk4,
          basicCtaText: val.sanctuary?.basicCtaText ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicCtaText,
          basicGuaranteeText: val.sanctuary?.basicGuaranteeText ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicGuaranteeText,
          basicImageUrl: val.sanctuary?.basicImageUrl ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicImageUrl,
          basicImageBadge: val.sanctuary?.basicImageBadge ?? DEFAULT_ABOUT_SETTINGS.sanctuary.basicImageBadge,
          deluxeEyebrow: val.sanctuary?.deluxeEyebrow ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeEyebrow,
          deluxeTitle: val.sanctuary?.deluxeTitle ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeTitle,
          deluxeDescription: val.sanctuary?.deluxeDescription ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeDescription,
          deluxePerk1: val.sanctuary?.deluxePerk1 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk1,
          deluxePerk2: val.sanctuary?.deluxePerk2 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk2,
          deluxePerk3: val.sanctuary?.deluxePerk3 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk3,
          deluxePerk4: val.sanctuary?.deluxePerk4 ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk4,
          deluxeCtaText: val.sanctuary?.deluxeCtaText ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeCtaText,
          deluxeGuaranteeText: val.sanctuary?.deluxeGuaranteeText ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeGuaranteeText,
          deluxeImageUrl: val.sanctuary?.deluxeImageUrl ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageUrl,
          deluxeImageBadge: val.sanctuary?.deluxeImageBadge ?? DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageBadge,
        },
        rooftop: {
          headingLead: val.rooftop?.headingLead ?? DEFAULT_ABOUT_SETTINGS.rooftop.headingLead,
          tab1Label: val.rooftop?.tab1Label ?? DEFAULT_ABOUT_SETTINGS.rooftop.tab1Label,
          tab2Label: val.rooftop?.tab2Label ?? DEFAULT_ABOUT_SETTINGS.rooftop.tab2Label,
          morningBadge: val.rooftop?.morningBadge ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningBadge,
          morningHeadingHighlight: val.rooftop?.morningHeadingHighlight ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningHeadingHighlight,
          morningSubtitle: val.rooftop?.morningSubtitle ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningSubtitle,
          morningCard1Tag: val.rooftop?.morningCard1Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Tag,
          morningCard1Title: val.rooftop?.morningCard1Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Title,
          morningCard1Desc: val.rooftop?.morningCard1Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Desc,
          morningCard2Tag: val.rooftop?.morningCard2Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Tag,
          morningCard2Title: val.rooftop?.morningCard2Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Title,
          morningCard2Desc: val.rooftop?.morningCard2Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Desc,
          morningPerk1: val.rooftop?.morningPerk1 ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk1,
          morningPerk2: val.rooftop?.morningPerk2 ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk2,
          morningImageUrl: val.rooftop?.morningImageUrl ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningImageUrl,
          morningImageTag: val.rooftop?.morningImageTag ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningImageTag,
          morningDockNote: val.rooftop?.morningDockNote ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningDockNote,
          morningDockTime: val.rooftop?.morningDockTime ?? DEFAULT_ABOUT_SETTINGS.rooftop.morningDockTime,
          sunsetBadge: val.rooftop?.sunsetBadge ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetBadge,
          sunsetHeadingHighlight: val.rooftop?.sunsetHeadingHighlight ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetHeadingHighlight,
          sunsetSubtitle: val.rooftop?.sunsetSubtitle ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetSubtitle,
          sunsetCard1Tag: val.rooftop?.sunsetCard1Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Tag,
          sunsetCard1Title: val.rooftop?.sunsetCard1Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Title,
          sunsetCard1Desc: val.rooftop?.sunsetCard1Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Desc,
          sunsetCard2Tag: val.rooftop?.sunsetCard2Tag ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Tag,
          sunsetCard2Title: val.rooftop?.sunsetCard2Title ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Title,
          sunsetCard2Desc: val.rooftop?.sunsetCard2Desc ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Desc,
          sunsetPerk1: val.rooftop?.sunsetPerk1 ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk1,
          sunsetPerk2: val.rooftop?.sunsetPerk2 ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk2,
          sunsetImageUrl: val.rooftop?.sunsetImageUrl ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageUrl,
          sunsetImageTag: val.rooftop?.sunsetImageTag ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageTag,
          sunsetDockNote: val.rooftop?.sunsetDockNote ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
          sunsetDockTime: val.rooftop?.sunsetDockTime ?? DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockTime,
        },
        values: {
          badge: val.values?.badge ?? DEFAULT_ABOUT_SETTINGS.values.badge,
          headingLead: val.values?.headingLead ?? DEFAULT_ABOUT_SETTINGS.values.headingLead,
          headingHighlight: val.values?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.values.headingHighlight,
          subtitle: val.values?.subtitle ?? DEFAULT_ABOUT_SETTINGS.values.subtitle,
          pillar1Badge: val.values?.pillar1Badge ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Badge,
          pillar1Tag: val.values?.pillar1Tag ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Tag,
          pillar1Title: val.values?.pillar1Title ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Title,
          pillar1Desc: val.values?.pillar1Desc ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Desc,
          pillar1Point1: val.values?.pillar1Point1 ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Point1,
          pillar1Point2: val.values?.pillar1Point2 ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Point2,
          pillar1Point3: val.values?.pillar1Point3 ?? DEFAULT_ABOUT_SETTINGS.values.pillar1Point3,
          pillar2Badge: val.values?.pillar2Badge ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Badge,
          pillar2Tag: val.values?.pillar2Tag ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Tag,
          pillar2Title: val.values?.pillar2Title ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Title,
          pillar2Desc: val.values?.pillar2Desc ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Desc,
          pillar2Point1: val.values?.pillar2Point1 ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Point1,
          pillar2Point2: val.values?.pillar2Point2 ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Point2,
          pillar2Point3: val.values?.pillar2Point3 ?? DEFAULT_ABOUT_SETTINGS.values.pillar2Point3,
          pillar3Badge: val.values?.pillar3Badge ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Badge,
          pillar3Tag: val.values?.pillar3Tag ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Tag,
          pillar3Title: val.values?.pillar3Title ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Title,
          pillar3Desc: val.values?.pillar3Desc ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Desc,
          pillar3Point1: val.values?.pillar3Point1 ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Point1,
          pillar3Point2: val.values?.pillar3Point2 ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Point2,
          pillar3Point3: val.values?.pillar3Point3 ?? DEFAULT_ABOUT_SETTINGS.values.pillar3Point3,
          dockMonogram: val.values?.dockMonogram ?? DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
          dockQuote: val.values?.dockQuote ?? DEFAULT_ABOUT_SETTINGS.values.dockQuote,
          dockByline: val.values?.dockByline ?? DEFAULT_ABOUT_SETTINGS.values.dockByline,
          dockGuarantee: val.values?.dockGuarantee ?? DEFAULT_ABOUT_SETTINGS.values.dockGuarantee,
        },
        signature: {
          monogram: val.signature?.monogram ?? DEFAULT_ABOUT_SETTINGS.signature.monogram,
          quote: val.signature?.quote ?? DEFAULT_ABOUT_SETTINGS.signature.quote,
          byline: val.signature?.byline ?? DEFAULT_ABOUT_SETTINGS.signature.byline,
          guarantee: val.signature?.guarantee ?? DEFAULT_ABOUT_SETTINGS.signature.guarantee,
          badge: val.signature?.badge ?? DEFAULT_ABOUT_SETTINGS.signature.badge,
          note: val.signature?.note ?? DEFAULT_ABOUT_SETTINGS.signature.note,
        },
        invitation: {
          badge: val.invitation?.badge ?? DEFAULT_ABOUT_SETTINGS.invitation.badge,
          headingLead: val.invitation?.headingLead ?? DEFAULT_ABOUT_SETTINGS.invitation.headingLead,
          headingHighlight: val.invitation?.headingHighlight ?? DEFAULT_ABOUT_SETTINGS.invitation.headingHighlight,
          subtitle: val.invitation?.subtitle ?? DEFAULT_ABOUT_SETTINGS.invitation.subtitle,
          ctaText: val.invitation?.ctaText ?? DEFAULT_ABOUT_SETTINGS.invitation.ctaText,
          ctaLink: val.invitation?.ctaLink ?? DEFAULT_ABOUT_SETTINGS.invitation.ctaLink,
          perk1: val.invitation?.perk1 ?? DEFAULT_ABOUT_SETTINGS.invitation.perk1,
          perk2: val.invitation?.perk2 ?? DEFAULT_ABOUT_SETTINGS.invitation.perk2,
          perk3: val.invitation?.perk3 ?? DEFAULT_ABOUT_SETTINGS.invitation.perk3,
        }
      });
    }
  }, [aboutSettingData]);

  const handleCardImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCardIndex(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setExperiencesForm((prev) => {
          const newCards = [...prev.cards];
          newCards[index] = { ...newCards[index], img: data.url };
          return { ...prev, cards: newCards };
        });
        toast({
          title: "Image Uploaded Successfully",
          description: `Image for Card ${index + 1} (${experiencesForm.cards[index].title}) uploaded and updated in live preview.`,
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload image. You can also paste an image URL directly.",
      });
    } finally {
      setUploadingCardIndex(null);
    }
  };

  const handleShowcaseImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingShowcase(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setWhyChooseUsForm((prev) => ({
          ...prev,
          showcase: { ...prev.showcase, image: data.url },
        }));
        toast({
          title: "Showcase Image Uploaded",
          description: "Right-hand showcase image updated in live preview.",
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload showcase image.",
      });
    } finally {
      setIsUploadingShowcase(false);
    }
  };

  const handleAvatarUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatarIndex(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setWhyChooseUsForm((prev) => {
          const newAvatars = [...prev.socialProof.avatars];
          newAvatars[index] = data.url;
          return {
            ...prev,
            socialProof: { ...prev.socialProof, avatars: newAvatars },
          };
        });
        toast({
          title: "Avatar Uploaded",
          description: `Guest avatar #${index + 1} updated in live preview.`,
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload guest avatar.",
      });
    } finally {
      setUploadingAvatarIndex(null);
    }
  };

  const handleVideoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideoIndex(index);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setGalleryForm((prev) => {
          const newVideos = [...prev.featuredMoments.videos];
          newVideos[index] = { ...newVideos[index], url: data.url };
          return {
            ...prev,
            featuredMoments: {
              ...prev.featuredMoments,
              videos: newVideos,
            },
          };
        });
        toast({
          title: "Video / Media Uploaded",
          description: `Video for Card ${index + 1} (${galleryForm.featuredMoments.videos[index].caption}) uploaded and updated in live preview.`,
        });
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload video. You can also paste a video URL directly.",
      });
    } finally {
      setUploadingVideoIndex(null);
    }
  };

  const handleSaveGallerySettings = () => {
    const existingVal = (gallerySettingData?.value as Record<string, unknown>) || {};
    const updatedPayload = {
      ...existingVal,
      featuredMoments: {
        badge: galleryForm.featuredMoments.badge.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.badge,
        headingLead: galleryForm.featuredMoments.headingLead.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.headingLead,
        headingHighlight: galleryForm.featuredMoments.headingHighlight.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.headingHighlight,
        subtitle: galleryForm.featuredMoments.subtitle.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.subtitle,
        journalStatus: galleryForm.featuredMoments.journalStatus.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.journalStatus,
        journalSubtext: galleryForm.featuredMoments.journalSubtext.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.journalSubtext,
        shareCtaText: galleryForm.featuredMoments.shareCtaText.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.shareCtaText,
        videos: galleryForm.featuredMoments.videos.map((v, i) => ({
          id: v.id || `f${i + 1}`,
          url: v.url.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.url || "",
          alt: v.alt.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.alt || "",
          caption: v.caption.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.caption || "",
          badge: v.badge.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.badge || "",
          location: v.location.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.location || "",
          subtitle: v.subtitle.trim() || DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i]?.subtitle || "",
          staggerClass: v.staggerClass || (i === 1 ? "md:translate-y-5 lg:translate-y-7" : "md:-translate-y-5 lg:-translate-y-7"),
          fromY: v.fromY ?? (i === 1 ? 60 : -60),
          type: v.type || "video",
        })),
      },
    };

    updateSetting.mutate(
      {
        key: "gallery_settings",
        data: {
          value: updatedPayload,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "🌟 Gallery Settings Saved!",
            description: "Featured Moments and videos updated on the live gallery page.",
          });
          setIsGallerySavedRecently(true);
          setTimeout(() => setIsGallerySavedRecently(false), 3000);
          queryClient.invalidateQueries({ queryKey: getGetSettingQueryKey("gallery_settings") });
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Failed to save gallery settings",
            description: err?.message || "An unexpected error occurred while saving.",
          });
        },
      }
    );
  };

  const handleResetGalleryDefaults = () => {
    setGalleryForm(DEFAULT_GALLERY_SETTINGS);
    toast({
      title: "Reset to Authentic Gallery Defaults",
      description: "Default copy populated in form. Click 'Save Changes' to apply.",
    });
  };

  const handleContactVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingContactVideo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setContactForm((prev) => ({
          ...prev,
          hero: { ...prev.hero, videoUrl: data.url },
        }));
        toast({
          title: "Contact Hero Video Uploaded",
          description: "Hero background video updated in live preview.",
        });
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload video.",
      });
    } finally {
      setIsUploadingContactVideo(false);
    }
  };

  const handleContactPosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingContactPoster(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setContactForm((prev) => ({
          ...prev,
          hero: { ...prev.hero, poster: data.url },
        }));
        toast({
          title: "Contact Poster Image Uploaded",
          description: "Hero poster image updated in live preview.",
        });
      }
    } catch (err: any) {
      console.error("Poster upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload poster.",
      });
    } finally {
      setIsUploadingContactPoster(false);
    }
  };

  const handleSaveContactSettings = () => {
    const existingVal = (contactSettingData?.value as Record<string, unknown>) || {};
    const updatedPayload = {
      ...existingVal,
      hero: {
        badge: contactForm.hero.badge.trim() || DEFAULT_CONTACT_SETTINGS.hero.badge,
        headingLead: contactForm.hero.headingLead.trim() || DEFAULT_CONTACT_SETTINGS.hero.headingLead,
        headingHighlight: contactForm.hero.headingHighlight.trim() || DEFAULT_CONTACT_SETTINGS.hero.headingHighlight,
        subtitle: contactForm.hero.subtitle.trim() || DEFAULT_CONTACT_SETTINGS.hero.subtitle,
        badge1: contactForm.hero.badge1.trim() || DEFAULT_CONTACT_SETTINGS.hero.badge1,
        badge2: contactForm.hero.badge2.trim() || DEFAULT_CONTACT_SETTINGS.hero.badge2,
        ctaText: contactForm.hero.ctaText.trim() || DEFAULT_CONTACT_SETTINGS.hero.ctaText,
        whatsappText: contactForm.hero.whatsappText.trim() || DEFAULT_CONTACT_SETTINGS.hero.whatsappText,
        whatsappNumber: contactForm.hero.whatsappNumber.trim() || DEFAULT_CONTACT_SETTINGS.hero.whatsappNumber,
        videoUrl: contactForm.hero.videoUrl.trim() || DEFAULT_CONTACT_SETTINGS.hero.videoUrl,
        poster: contactForm.hero.poster.trim() || DEFAULT_CONTACT_SETTINGS.hero.poster,
        phone: contactForm.hero.phone.trim() || DEFAULT_CONTACT_SETTINGS.hero.phone,
        email: contactForm.hero.email.trim() || DEFAULT_CONTACT_SETTINGS.hero.email,
        location: contactForm.hero.location.trim() || DEFAULT_CONTACT_SETTINGS.hero.location,
        hours: contactForm.hero.hours.trim() || DEFAULT_CONTACT_SETTINGS.hero.hours,
      },
      channels: {
        badge: contactForm.channels.badge.trim() || DEFAULT_CONTACT_SETTINGS.channels.badge,
        headingLead: contactForm.channels.headingLead.trim() || DEFAULT_CONTACT_SETTINGS.channels.headingLead,
        headingHighlight: contactForm.channels.headingHighlight.trim() || DEFAULT_CONTACT_SETTINGS.channels.headingHighlight,
        subtitle: contactForm.channels.subtitle.trim() || DEFAULT_CONTACT_SETTINGS.channels.subtitle,
        emailTitle: contactForm.channels.emailTitle.trim() || DEFAULT_CONTACT_SETTINGS.channels.emailTitle,
        emailValue: contactForm.channels.emailValue.trim() || DEFAULT_CONTACT_SETTINGS.channels.emailValue,
        emailLink: contactForm.channels.emailLink.trim() || DEFAULT_CONTACT_SETTINGS.channels.emailLink,
        phoneTitle: contactForm.channels.phoneTitle.trim() || DEFAULT_CONTACT_SETTINGS.channels.phoneTitle,
        phoneValue: contactForm.channels.phoneValue.trim() || DEFAULT_CONTACT_SETTINGS.channels.phoneValue,
        phoneLink: contactForm.channels.phoneLink.trim() || DEFAULT_CONTACT_SETTINGS.channels.phoneLink,
        locationTitle: contactForm.channels.locationTitle.trim() || DEFAULT_CONTACT_SETTINGS.channels.locationTitle,
        locationValue: contactForm.channels.locationValue.trim() || DEFAULT_CONTACT_SETTINGS.channels.locationValue,
        locationLink: contactForm.channels.locationLink.trim() || DEFAULT_CONTACT_SETTINGS.channels.locationLink,
        guaranteeBadge: contactForm.channels.guaranteeBadge.trim() || DEFAULT_CONTACT_SETTINGS.channels.guaranteeBadge,
        guaranteeText: contactForm.channels.guaranteeText.trim() || DEFAULT_CONTACT_SETTINGS.channels.guaranteeText,
      },
    };

    updateSetting.mutate(
      {
        key: "contact_settings",
        data: {
          value: updatedPayload,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "🌟 Contact Settings Saved!",
            description: "Landing hero and 'Wave Away' channels updated on the live contact page.",
          });
          setIsContactSavedRecently(true);
          setTimeout(() => setIsContactSavedRecently(false), 3000);
          queryClient.invalidateQueries({ queryKey: getGetSettingQueryKey("contact_settings") });
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Failed to save contact settings",
            description: err?.message || "An unexpected error occurred while saving.",
          });
        },
      }
    );
  };

  const handleResetContactDefaults = () => {
    setContactForm(DEFAULT_CONTACT_SETTINGS);
    toast({
      title: "Reset to Authentic Contact Defaults",
      description: "Default contact hero and channels copy populated in form. Click 'Save Changes' to apply.",
    });
  };

  const handleResetContactChannelsDefaults = () => {
    setContactForm((prev) => ({
      ...prev,
      channels: DEFAULT_CONTACT_SETTINGS.channels,
    }));
    toast({
      title: "Reset Section 2 Defaults",
      description: "'We\\'re just a wave away' defaults populated in form. Click 'Save Changes' to apply.",
    });
  };

  const handleAboutVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAboutVideo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setAboutForm((prev) => ({
          ...prev,
          hero: { ...prev.hero, videoUrl: data.url },
        }));
        toast({
          title: "About Video Uploaded",
          description: "Hero background video updated in live preview.",
        });
      }
    } catch (err: any) {
      console.error("Video upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload video.",
      });
    } finally {
      setIsUploadingAboutVideo(false);
    }
  };

  const handleAboutPosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAboutPoster(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await customFetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (data?.url) {
        setAboutForm((prev) => ({
          ...prev,
          hero: { ...prev.hero, poster: data.url },
        }));
        toast({
          title: "About Poster Image Uploaded",
          description: "Hero poster image updated in live preview.",
        });
      }
    } catch (err: any) {
      console.error("Poster upload error:", err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: err?.message || "Failed to upload poster.",
      });
    } finally {
      setIsUploadingAboutPoster(false);
    }
  };

  const handleSaveAboutSettings = () => {
    const existingVal = (aboutSettingData?.value as Record<string, unknown>) || {};
    const updatedPayload = {
      ...existingVal,
      hero: {
        badge: aboutForm.hero.badge.trim() || DEFAULT_ABOUT_SETTINGS.hero.badge,
        headingLead: aboutForm.hero.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.hero.headingLead,
        headingHighlight: aboutForm.hero.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.hero.headingHighlight,
        subtitle: aboutForm.hero.subtitle.trim() || DEFAULT_ABOUT_SETTINGS.hero.subtitle,
        badge1: aboutForm.hero.badge1.trim() || DEFAULT_ABOUT_SETTINGS.hero.badge1,
        badge2: aboutForm.hero.badge2.trim() || DEFAULT_ABOUT_SETTINGS.hero.badge2,
        ctaText: aboutForm.hero.ctaText.trim() || DEFAULT_ABOUT_SETTINGS.hero.ctaText,
        perk1: aboutForm.hero.perk1.trim() || DEFAULT_ABOUT_SETTINGS.hero.perk1,
        perk2: aboutForm.hero.perk2.trim() || DEFAULT_ABOUT_SETTINGS.hero.perk2,
        perk3: aboutForm.hero.perk3.trim() || DEFAULT_ABOUT_SETTINGS.hero.perk3,
        perk4: aboutForm.hero.perk4.trim() || DEFAULT_ABOUT_SETTINGS.hero.perk4,
        videoUrl: aboutForm.hero.videoUrl.trim() || DEFAULT_ABOUT_SETTINGS.hero.videoUrl,
        poster: aboutForm.hero.poster.trim() || DEFAULT_ABOUT_SETTINGS.hero.poster,
      },
      story: {
        badge: aboutForm.story.badge.trim() || DEFAULT_ABOUT_SETTINGS.story.badge,
        headingLead: aboutForm.story.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.story.headingLead,
        headingHighlight: aboutForm.story.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.story.headingHighlight,
        paragraph1: aboutForm.story.paragraph1.trim() || DEFAULT_ABOUT_SETTINGS.story.paragraph1,
        paragraph2: aboutForm.story.paragraph2.trim() || DEFAULT_ABOUT_SETTINGS.story.paragraph2,
        highlight1Title: aboutForm.story.highlight1Title.trim() || DEFAULT_ABOUT_SETTINGS.story.highlight1Title,
        highlight1Subtitle: aboutForm.story.highlight1Subtitle.trim() || DEFAULT_ABOUT_SETTINGS.story.highlight1Subtitle,
        highlight2Title: aboutForm.story.highlight2Title.trim() || DEFAULT_ABOUT_SETTINGS.story.highlight2Title,
        highlight2Subtitle: aboutForm.story.highlight2Subtitle.trim() || DEFAULT_ABOUT_SETTINGS.story.highlight2Subtitle,
        ctaText: aboutForm.story.ctaText.trim() || DEFAULT_ABOUT_SETTINGS.story.ctaText,
        authorInitials: aboutForm.story.authorInitials.trim() || DEFAULT_ABOUT_SETTINGS.story.authorInitials,
        authorName: aboutForm.story.authorName.trim() || DEFAULT_ABOUT_SETTINGS.story.authorName,
        authorLocation: aboutForm.story.authorLocation.trim() || DEFAULT_ABOUT_SETTINGS.story.authorLocation,
        neighborhoodTitle: aboutForm.story.neighborhoodTitle.trim() || DEFAULT_ABOUT_SETTINGS.story.neighborhoodTitle,
        neighborhoodSubtitle: aboutForm.story.neighborhoodSubtitle.trim() || DEFAULT_ABOUT_SETTINGS.story.neighborhoodSubtitle,
        spot1Name: aboutForm.story.spot1Name.trim() || DEFAULT_ABOUT_SETTINGS.story.spot1Name,
        spot1Distance: aboutForm.story.spot1Distance.trim() || DEFAULT_ABOUT_SETTINGS.story.spot1Distance,
        spot1Details: aboutForm.story.spot1Details.trim() || DEFAULT_ABOUT_SETTINGS.story.spot1Details,
        spot2Name: aboutForm.story.spot2Name.trim() || DEFAULT_ABOUT_SETTINGS.story.spot2Name,
        spot2Distance: aboutForm.story.spot2Distance.trim() || DEFAULT_ABOUT_SETTINGS.story.spot2Distance,
        spot2Details: aboutForm.story.spot2Details.trim() || DEFAULT_ABOUT_SETTINGS.story.spot2Details,
        spot3Name: aboutForm.story.spot3Name.trim() || DEFAULT_ABOUT_SETTINGS.story.spot3Name,
        spot3Distance: aboutForm.story.spot3Distance.trim() || DEFAULT_ABOUT_SETTINGS.story.spot3Distance,
        spot3Details: aboutForm.story.spot3Details.trim() || DEFAULT_ABOUT_SETTINGS.story.spot3Details,
        spot4Name: aboutForm.story.spot4Name.trim() || DEFAULT_ABOUT_SETTINGS.story.spot4Name,
        spot4Distance: aboutForm.story.spot4Distance.trim() || DEFAULT_ABOUT_SETTINGS.story.spot4Distance,
        spot4Details: aboutForm.story.spot4Details.trim() || DEFAULT_ABOUT_SETTINGS.story.spot4Details,
      },
      experience: {
        badge: aboutForm.experience.badge.trim() || DEFAULT_ABOUT_SETTINGS.experience.badge,
        headingLead: aboutForm.experience.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.experience.headingLead,
        headingHighlight: aboutForm.experience.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.experience.headingHighlight,
        subtitle: aboutForm.experience.subtitle.trim() || DEFAULT_ABOUT_SETTINGS.experience.subtitle,
        pill1: aboutForm.experience.pill1.trim() || DEFAULT_ABOUT_SETTINGS.experience.pill1,
        pill2: aboutForm.experience.pill2.trim() || DEFAULT_ABOUT_SETTINGS.experience.pill2,
        pill3: aboutForm.experience.pill3.trim() || DEFAULT_ABOUT_SETTINGS.experience.pill3,
        addOnsTitle: aboutForm.experience.addOnsTitle.trim() || DEFAULT_ABOUT_SETTINGS.experience.addOnsTitle,
        addOnsSubtitle: aboutForm.experience.addOnsSubtitle.trim() || DEFAULT_ABOUT_SETTINGS.experience.addOnsSubtitle,
        addOnsBadge: aboutForm.experience.addOnsBadge.trim() || DEFAULT_ABOUT_SETTINGS.experience.addOnsBadge,
        tailoredTitle: aboutForm.experience.tailoredTitle.trim() || DEFAULT_ABOUT_SETTINGS.experience.tailoredTitle,
        tailoredEyebrow: aboutForm.experience.tailoredEyebrow.trim() || DEFAULT_ABOUT_SETTINGS.experience.tailoredEyebrow,
        tailoredDesc: aboutForm.experience.tailoredDesc.trim() || DEFAULT_ABOUT_SETTINGS.experience.tailoredDesc,
        benefit1: aboutForm.experience.benefit1.trim() || DEFAULT_ABOUT_SETTINGS.experience.benefit1,
        benefit2: aboutForm.experience.benefit2.trim() || DEFAULT_ABOUT_SETTINGS.experience.benefit2,
        benefit3: aboutForm.experience.benefit3.trim() || DEFAULT_ABOUT_SETTINGS.experience.benefit3,
        benefit4: aboutForm.experience.benefit4.trim() || DEFAULT_ABOUT_SETTINGS.experience.benefit4,
        freedomTitle: aboutForm.experience.freedomTitle.trim() || DEFAULT_ABOUT_SETTINGS.experience.freedomTitle,
        freedomText: aboutForm.experience.freedomText.trim() || DEFAULT_ABOUT_SETTINGS.experience.freedomText,
        ctaText: aboutForm.experience.ctaText.trim() || DEFAULT_ABOUT_SETTINGS.experience.ctaText,
        exp1Name: aboutForm.experience.exp1Name.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp1Name,
        exp1Category: aboutForm.experience.exp1Category.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp1Category,
        exp1Desc: aboutForm.experience.exp1Desc.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp1Desc,
        exp2Name: aboutForm.experience.exp2Name.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp2Name,
        exp2Category: aboutForm.experience.exp2Category.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp2Category,
        exp2Desc: aboutForm.experience.exp2Desc.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp2Desc,
        exp3Name: aboutForm.experience.exp3Name.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp3Name,
        exp3Category: aboutForm.experience.exp3Category.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp3Category,
        exp3Desc: aboutForm.experience.exp3Desc.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp3Desc,
        exp4Name: aboutForm.experience.exp4Name.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp4Name,
        exp4Category: aboutForm.experience.exp4Category.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp4Category,
        exp4Desc: aboutForm.experience.exp4Desc.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp4Desc,
        exp5Name: aboutForm.experience.exp5Name.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp5Name,
        exp5Category: aboutForm.experience.exp5Category.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp5Category,
        exp5Desc: aboutForm.experience.exp5Desc.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp5Desc,
        exp6Name: aboutForm.experience.exp6Name.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp6Name,
        exp6Category: aboutForm.experience.exp6Category.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp6Category,
        exp6Desc: aboutForm.experience.exp6Desc.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp6Desc,
        exp7Name: aboutForm.experience.exp7Name.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp7Name,
        exp7Category: aboutForm.experience.exp7Category.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp7Category,
        exp7Desc: aboutForm.experience.exp7Desc.trim() || DEFAULT_ABOUT_SETTINGS.experience.exp7Desc,
      },
      sanctuary: {
        badge: aboutForm.sanctuary.badge.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.badge,
        headingLead: aboutForm.sanctuary.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.headingLead,
        headingHighlight: aboutForm.sanctuary.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.headingHighlight,
        tab1Label: aboutForm.sanctuary.tab1Label.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.tab1Label,
        tab2Label: aboutForm.sanctuary.tab2Label.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.tab2Label,
        basicEyebrow: aboutForm.sanctuary.basicEyebrow.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicEyebrow,
        basicTitle: aboutForm.sanctuary.basicTitle.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicTitle,
        basicDescription: aboutForm.sanctuary.basicDescription.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicDescription,
        basicPerk1: aboutForm.sanctuary.basicPerk1.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk1,
        basicPerk2: aboutForm.sanctuary.basicPerk2.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk2,
        basicPerk3: aboutForm.sanctuary.basicPerk3.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk3,
        basicPerk4: aboutForm.sanctuary.basicPerk4.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicPerk4,
        basicCtaText: aboutForm.sanctuary.basicCtaText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicCtaText,
        basicGuaranteeText: aboutForm.sanctuary.basicGuaranteeText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicGuaranteeText,
        basicImageUrl: aboutForm.sanctuary.basicImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicImageUrl,
        basicImageBadge: aboutForm.sanctuary.basicImageBadge.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.basicImageBadge,
        deluxeEyebrow: aboutForm.sanctuary.deluxeEyebrow.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeEyebrow,
        deluxeTitle: aboutForm.sanctuary.deluxeTitle.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeTitle,
        deluxeDescription: aboutForm.sanctuary.deluxeDescription.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeDescription,
        deluxePerk1: aboutForm.sanctuary.deluxePerk1.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk1,
        deluxePerk2: aboutForm.sanctuary.deluxePerk2.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk2,
        deluxePerk3: aboutForm.sanctuary.deluxePerk3.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk3,
        deluxePerk4: aboutForm.sanctuary.deluxePerk4.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxePerk4,
        deluxeCtaText: aboutForm.sanctuary.deluxeCtaText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeCtaText,
        deluxeGuaranteeText: aboutForm.sanctuary.deluxeGuaranteeText.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeGuaranteeText,
        deluxeImageUrl: aboutForm.sanctuary.deluxeImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageUrl,
        deluxeImageBadge: aboutForm.sanctuary.deluxeImageBadge.trim() || DEFAULT_ABOUT_SETTINGS.sanctuary.deluxeImageBadge,
      },
      rooftop: {
        headingLead: aboutForm.rooftop.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.headingLead,
        tab1Label: aboutForm.rooftop.tab1Label.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.tab1Label,
        tab2Label: aboutForm.rooftop.tab2Label.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.tab2Label,
        morningBadge: aboutForm.rooftop.morningBadge.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningBadge,
        morningHeadingHighlight: aboutForm.rooftop.morningHeadingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningHeadingHighlight,
        morningSubtitle: aboutForm.rooftop.morningSubtitle.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningSubtitle,
        morningCard1Tag: aboutForm.rooftop.morningCard1Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Tag,
        morningCard1Title: aboutForm.rooftop.morningCard1Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Title,
        morningCard1Desc: aboutForm.rooftop.morningCard1Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard1Desc,
        morningCard2Tag: aboutForm.rooftop.morningCard2Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Tag,
        morningCard2Title: aboutForm.rooftop.morningCard2Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Title,
        morningCard2Desc: aboutForm.rooftop.morningCard2Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningCard2Desc,
        morningPerk1: aboutForm.rooftop.morningPerk1.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk1,
        morningPerk2: aboutForm.rooftop.morningPerk2.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningPerk2,
        morningImageUrl: aboutForm.rooftop.morningImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningImageUrl,
        morningImageTag: aboutForm.rooftop.morningImageTag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningImageTag,
        morningDockNote: aboutForm.rooftop.morningDockNote.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningDockNote,
        morningDockTime: aboutForm.rooftop.morningDockTime.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.morningDockTime,
        sunsetBadge: aboutForm.rooftop.sunsetBadge.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetBadge,
        sunsetHeadingHighlight: aboutForm.rooftop.sunsetHeadingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetHeadingHighlight,
        sunsetSubtitle: aboutForm.rooftop.sunsetSubtitle.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetSubtitle,
        sunsetCard1Tag: aboutForm.rooftop.sunsetCard1Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Tag,
        sunsetCard1Title: aboutForm.rooftop.sunsetCard1Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Title,
        sunsetCard1Desc: aboutForm.rooftop.sunsetCard1Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard1Desc,
        sunsetCard2Tag: aboutForm.rooftop.sunsetCard2Tag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Tag,
        sunsetCard2Title: aboutForm.rooftop.sunsetCard2Title.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Title,
        sunsetCard2Desc: aboutForm.rooftop.sunsetCard2Desc.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetCard2Desc,
        sunsetPerk1: aboutForm.rooftop.sunsetPerk1.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk1,
        sunsetPerk2: aboutForm.rooftop.sunsetPerk2.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetPerk2,
        sunsetImageUrl: aboutForm.rooftop.sunsetImageUrl.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageUrl,
        sunsetImageTag: aboutForm.rooftop.sunsetImageTag.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetImageTag,
        sunsetDockNote: aboutForm.rooftop.sunsetDockNote.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockNote,
        sunsetDockTime: aboutForm.rooftop.sunsetDockTime.trim() || DEFAULT_ABOUT_SETTINGS.rooftop.sunsetDockTime,
      },
      values: {
        badge: aboutForm.values.badge.trim() || DEFAULT_ABOUT_SETTINGS.values.badge,
        headingLead: aboutForm.values.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.values.headingLead,
        headingHighlight: aboutForm.values.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.values.headingHighlight,
        subtitle: aboutForm.values.subtitle.trim() || DEFAULT_ABOUT_SETTINGS.values.subtitle,
        pillar1Badge: aboutForm.values.pillar1Badge.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Badge,
        pillar1Tag: aboutForm.values.pillar1Tag.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Tag,
        pillar1Title: aboutForm.values.pillar1Title.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Title,
        pillar1Desc: aboutForm.values.pillar1Desc.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Desc,
        pillar1Point1: aboutForm.values.pillar1Point1.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Point1,
        pillar1Point2: aboutForm.values.pillar1Point2.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Point2,
        pillar1Point3: aboutForm.values.pillar1Point3.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar1Point3,
        pillar2Badge: aboutForm.values.pillar2Badge.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Badge,
        pillar2Tag: aboutForm.values.pillar2Tag.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Tag,
        pillar2Title: aboutForm.values.pillar2Title.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Title,
        pillar2Desc: aboutForm.values.pillar2Desc.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Desc,
        pillar2Point1: aboutForm.values.pillar2Point1.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Point1,
        pillar2Point2: aboutForm.values.pillar2Point2.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Point2,
        pillar2Point3: aboutForm.values.pillar2Point3.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar2Point3,
        pillar3Badge: aboutForm.values.pillar3Badge.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Badge,
        pillar3Tag: aboutForm.values.pillar3Tag.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Tag,
        pillar3Title: aboutForm.values.pillar3Title.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Title,
        pillar3Desc: aboutForm.values.pillar3Desc.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Desc,
        pillar3Point1: aboutForm.values.pillar3Point1.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Point1,
        pillar3Point2: aboutForm.values.pillar3Point2.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Point2,
        pillar3Point3: aboutForm.values.pillar3Point3.trim() || DEFAULT_ABOUT_SETTINGS.values.pillar3Point3,
        dockMonogram: aboutForm.values.dockMonogram.trim() || DEFAULT_ABOUT_SETTINGS.values.dockMonogram,
        dockQuote: aboutForm.values.dockQuote.trim() || DEFAULT_ABOUT_SETTINGS.values.dockQuote,
        dockByline: aboutForm.values.dockByline.trim() || DEFAULT_ABOUT_SETTINGS.values.dockByline,
        dockGuarantee: aboutForm.values.dockGuarantee.trim() || DEFAULT_ABOUT_SETTINGS.values.dockGuarantee,
      },
      signature: {
        monogram: aboutForm.values.dockMonogram.trim() || aboutForm.signature.monogram.trim() || DEFAULT_ABOUT_SETTINGS.signature.monogram,
        quote: aboutForm.values.dockQuote.trim() || aboutForm.signature.quote.trim() || DEFAULT_ABOUT_SETTINGS.signature.quote,
        byline: aboutForm.values.dockByline.trim() || aboutForm.signature.byline.trim() || DEFAULT_ABOUT_SETTINGS.signature.byline,
        guarantee: aboutForm.values.dockGuarantee.trim() || aboutForm.signature.guarantee.trim() || DEFAULT_ABOUT_SETTINGS.signature.guarantee,
        badge: aboutForm.signature.badge.trim() || DEFAULT_ABOUT_SETTINGS.signature.badge,
        note: aboutForm.signature.note.trim() || DEFAULT_ABOUT_SETTINGS.signature.note,
      },
      invitation: {
        badge: aboutForm.invitation.badge.trim() || DEFAULT_ABOUT_SETTINGS.invitation.badge,
        headingLead: aboutForm.invitation.headingLead.trim() || DEFAULT_ABOUT_SETTINGS.invitation.headingLead,
        headingHighlight: aboutForm.invitation.headingHighlight.trim() || DEFAULT_ABOUT_SETTINGS.invitation.headingHighlight,
        subtitle: aboutForm.invitation.subtitle.trim() || DEFAULT_ABOUT_SETTINGS.invitation.subtitle,
        ctaText: aboutForm.invitation.ctaText.trim() || DEFAULT_ABOUT_SETTINGS.invitation.ctaText,
        ctaLink: aboutForm.invitation.ctaLink.trim() || DEFAULT_ABOUT_SETTINGS.invitation.ctaLink,
        perk1: aboutForm.invitation.perk1.trim() || DEFAULT_ABOUT_SETTINGS.invitation.perk1,
        perk2: aboutForm.invitation.perk2.trim() || DEFAULT_ABOUT_SETTINGS.invitation.perk2,
        perk3: aboutForm.invitation.perk3.trim() || DEFAULT_ABOUT_SETTINGS.invitation.perk3,
      }
    };

    updateSetting.mutate(
      {
        key: "about_settings",
        data: {
          value: updatedPayload,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "🌟 About Settings Saved!",
            description: "All About page sections, including Family Host Signature and Final Invitation CTA, updated live.",
          });
          setIsAboutSavedRecently(true);
          setIsAboutStorySavedRecently(true);
          setIsAboutExperienceSavedRecently(true);
          setIsAboutSanctuarySavedRecently(true);
          setIsAboutRooftopSavedRecently(true);
          setIsAboutValuesSavedRecently(true);
          setIsAboutSignatureSavedRecently(true);
          setIsAboutInvitationSavedRecently(true);
          setTimeout(() => {
            setIsAboutSavedRecently(false);
            setIsAboutStorySavedRecently(false);
            setIsAboutExperienceSavedRecently(false);
            setIsAboutSanctuarySavedRecently(false);
            setIsAboutRooftopSavedRecently(false);
            setIsAboutValuesSavedRecently(false);
            setIsAboutSignatureSavedRecently(false);
            setIsAboutInvitationSavedRecently(false);
          }, 3000);
          queryClient.invalidateQueries({ queryKey: getGetSettingQueryKey("about_settings") });
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Failed to save about settings",
            description: err?.message || "An unexpected error occurred while saving.",
          });
        },
      }
    );
  };

  const handleResetAboutDefaults = () => {
    setAboutForm(DEFAULT_ABOUT_SETTINGS);
    toast({
      title: "Reset to Authentic About Defaults",
      description: "Default story copy and micro-perks populated in form. Click 'Save Changes' to apply.",
    });
  };

  const handleResetAboutStoryDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      story: DEFAULT_ABOUT_SETTINGS.story,
    }));
    toast({
      title: "Reset to Authentic Story & Neighborhood Defaults",
      description: "Default narrative copy, micro-highlights, and neighborhood spots restored in form. Click 'Save' to apply.",
    });
  };

  const handleResetAboutExperienceDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      experience: DEFAULT_ABOUT_SETTINGS.experience,
    }));
    toast({
      title: "Reset to Authentic Experience Builder Defaults",
      description: "Default travel style headline, add-on experiences, and tailored stay concierge restored in form. Click 'Save' to apply.",
    });
  };

  const handleResetAboutSanctuaryDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      sanctuary: DEFAULT_ABOUT_SETTINGS.sanctuary,
    }));
    toast({
      title: "Reset to Sanctuary Switcher Defaults",
      description: "Default room titles, descriptions, perks, and imagery restored in form. Click 'Save' to apply.",
    });
  };

  const uploadMedia = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const data: any = await customFetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    return { url: data?.url || "" };
  };

  const handleUploadBasicRoomImage = async (file: File) => {
    setIsUploadingBasicRoomImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          sanctuary: { ...prev.sanctuary, basicImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Basic Private Room photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload basic room image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingBasicRoomImg(false);
    }
  };

  const handleUploadDeluxeRoomImage = async (file: File) => {
    setIsUploadingDeluxeRoomImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          sanctuary: { ...prev.sanctuary, deluxeImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Deluxe Double Room photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload deluxe room image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingDeluxeRoomImg(false);
    }
  };

  const handleResetAboutRooftopDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      rooftop: DEFAULT_ABOUT_SETTINGS.rooftop,
    }));
    toast({
      title: "Reset to Rooftop Café Defaults",
      description: "Default roasts, sunset cocktail texts, atmosphere badges, and imagery restored in form. Click 'Save' to apply.",
    });
  };

  const handleUploadMorningImage = async (file: File) => {
    setIsUploadingMorningImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          rooftop: { ...prev.rooftop, morningImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Morning Vibes photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload morning image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingMorningImg(false);
    }
  };

  const handleUploadSunsetImage = async (file: File) => {
    setIsUploadingSunsetImg(true);
    try {
      const res = await uploadMedia(file);
      if (res && res.url) {
        setAboutForm((prev) => ({
          ...prev,
          rooftop: { ...prev.rooftop, sunsetImageUrl: res.url },
        }));
        toast({
          title: "Image Uploaded",
          description: "Golden Hour photo uploaded successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload golden hour image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingSunsetImg(false);
    }
  };

  const handleResetAboutValuesDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      values: DEFAULT_ABOUT_SETTINGS.values,
    }));
    toast({
      title: "Reset to Heritage Values Defaults",
      description: "Default pillars, family host quote, and checklist points restored in form. Click 'Save' to apply.",
    });
  };

  const handleResetAboutSignatureDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      signature: DEFAULT_ABOUT_SETTINGS.signature,
    }));
    toast({
      title: "Reset to Signature Dock Defaults",
      description: "Default host monogram, quotation, and guarantee restored in form. Click 'Save' to apply.",
    });
  };

  const handleResetAboutInvitationDefaults = () => {
    setAboutForm((prev) => ({
      ...prev,
      invitation: DEFAULT_ABOUT_SETTINGS.invitation,
    }));
    toast({
      title: "Reset to Invitation Defaults",
      description: "Default invitation headline, button label, and perks restored in form. Click 'Save' to apply.",
    });
  };

  const handleSaveHomeSettings = () => {
    const existingVal = (homeSettingData?.value as Record<string, unknown>) || {};
    const updatedPayload = {
      ...existingVal,
      hero: {
        ratingScore: Number(heroForm.ratingScore) || 4.9,
        ratingLabel: heroForm.ratingLabel.replace(/^\/+/, "").trim() || "Rating",
        guestsCount: Number(heroForm.guestsCount) || 1000,
        guestsSuffix: heroForm.guestsSuffix.replace(/^\/+/, "").trim() || "+",
        guestsLabel: heroForm.guestsLabel.replace(/^\/+/, "").trim() || "Happy Guests",
        taglineHighlight: heroForm.taglineHighlight.replace(/^\/+/, "").trim() || DEFAULT_HERO_SETTINGS.taglineHighlight,
        taglineText: heroForm.taglineText.replace(/^\/+/, "").trim() || DEFAULT_HERO_SETTINGS.taglineText,
      },
      reassurance: {
        card1: {
          stat: reassuranceForm.card1.stat.trim() || DEFAULT_REASSURANCE_SETTINGS.card1.stat,
          title: reassuranceForm.card1.title.trim() || DEFAULT_REASSURANCE_SETTINGS.card1.title,
          desc: reassuranceForm.card1.desc.trim() || DEFAULT_REASSURANCE_SETTINGS.card1.desc,
        },
        card2: {
          stat: reassuranceForm.card2.stat.trim() || DEFAULT_REASSURANCE_SETTINGS.card2.stat,
          title: reassuranceForm.card2.title.trim() || DEFAULT_REASSURANCE_SETTINGS.card2.title,
          desc: reassuranceForm.card2.desc.trim() || DEFAULT_REASSURANCE_SETTINGS.card2.desc,
        },
        card3: {
          stat: reassuranceForm.card3.stat.trim() || DEFAULT_REASSURANCE_SETTINGS.card3.stat,
          suffix: reassuranceForm.card3.suffix?.trim() || "★",
          title: reassuranceForm.card3.title.trim() || DEFAULT_REASSURANCE_SETTINGS.card3.title,
          desc: reassuranceForm.card3.desc.trim() || DEFAULT_REASSURANCE_SETTINGS.card3.desc,
        },
        card4: {
          stat: reassuranceForm.card4.stat.trim() || DEFAULT_REASSURANCE_SETTINGS.card4.stat,
          title: reassuranceForm.card4.title.trim() || DEFAULT_REASSURANCE_SETTINGS.card4.title,
          desc: reassuranceForm.card4.desc.trim() || DEFAULT_REASSURANCE_SETTINGS.card4.desc,
        },
      },
      experiences: {
        badge: experiencesForm.badge.trim() || DEFAULT_EXPERIENCES_SETTINGS.badge,
        title: experiencesForm.title.trim() || DEFAULT_EXPERIENCES_SETTINGS.title,
        description: experiencesForm.description.trim() || DEFAULT_EXPERIENCES_SETTINGS.description,
        cards: experiencesForm.cards.map((card, idx) => ({
          id: card.id || DEFAULT_EXPERIENCES_SETTINGS.cards[idx].id,
          num: card.num.trim() || DEFAULT_EXPERIENCES_SETTINGS.cards[idx].num,
          title: card.title.trim() || DEFAULT_EXPERIENCES_SETTINGS.cards[idx].title,
          tagline: card.tagline.trim() || DEFAULT_EXPERIENCES_SETTINGS.cards[idx].tagline,
          description: card.description.trim() || DEFAULT_EXPERIENCES_SETTINGS.cards[idx].description,
          img: normalizeAssetPath(card.img) || DEFAULT_EXPERIENCES_SETTINGS.cards[idx].img,
          href: card.href.trim() || DEFAULT_EXPERIENCES_SETTINGS.cards[idx].href,
        })),
      },
      whyChooseUs: {
        badge: whyChooseUsForm.badge.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.badge,
        headingLead: whyChooseUsForm.headingLead.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.headingLead,
        headingHighlight: whyChooseUsForm.headingHighlight.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.headingHighlight,
        description: whyChooseUsForm.description.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.description,
        features: whyChooseUsForm.features.map((f, i) => ({
          id: f.id || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].id,
          icon: f.icon || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].icon,
          title: f.title.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].title,
          desc: f.desc.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.features[i].desc,
        })),
        socialProof: {
          score: whyChooseUsForm.socialProof.score.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.score,
          text: whyChooseUsForm.socialProof.text.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.text,
          avatars: whyChooseUsForm.socialProof.avatars.map((a, i) => normalizeAssetPath(a) || DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.avatars[i]),
          avatarBadge: whyChooseUsForm.socialProof.avatarBadge.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.avatarBadge,
        },
        showcase: {
          image: normalizeAssetPath(whyChooseUsForm.showcase.image) || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.image,
          awardTag: whyChooseUsForm.showcase.awardTag.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.awardTag,
          awardTitle: whyChooseUsForm.showcase.awardTitle.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.awardTitle,
          awardIcon: whyChooseUsForm.showcase.awardIcon.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.awardIcon,
          testimonialQuote: whyChooseUsForm.showcase.testimonialQuote.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.testimonialQuote,
          testimonialAuthor: whyChooseUsForm.showcase.testimonialAuthor.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.testimonialAuthor,
          testimonialAuthorRole: whyChooseUsForm.showcase.testimonialAuthorRole.trim() || DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.testimonialAuthorRole,
          testimonialAuthorInitial: whyChooseUsForm.showcase.testimonialAuthorInitial.trim() || (whyChooseUsForm.showcase.testimonialAuthor.trim().charAt(0) || "S"),
        },
      },
    };

    updateSetting.mutate(
      {
        key: "home_settings",
        data: {
          value: updatedPayload,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Home Settings Saved!",
            description: "Landing hero, reassurance, experiences, and Why Choose Us updated on live site.",
          });
          setIsSavedRecently(true);
          setTimeout(() => setIsSavedRecently(false), 3000);
          queryClient.invalidateQueries({ queryKey: getGetSettingQueryKey("home_settings") });
          queryClient.invalidateQueries({ queryKey: ["/api/v1/settings"] });
          queryClient.invalidateQueries({ queryKey: ["/api/v1/settings/home_settings"] });
          localStorage.setItem("ow_settings_updated", String(Date.now()));
          window.dispatchEvent(new Event("storage"));
        },
        onError: (err: any) => {
          toast({
            variant: "destructive",
            title: "Failed to save settings",
            description: err?.message || "An unexpected error occurred while saving.",
          });
        },
      }
    );
  };

  const handleResetDefaults = () => {
    setHeroForm(DEFAULT_HERO_SETTINGS);
    setReassuranceForm(DEFAULT_REASSURANCE_SETTINGS);
    setExperiencesForm(DEFAULT_EXPERIENCES_SETTINGS);
    setWhyChooseUsForm(DEFAULT_WHY_CHOOSE_US_SETTINGS);
    toast({
      title: "Reset to Defaults",
      description: "Default copy populated in form. Click 'Save Changes' to apply.",
    });
  };

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];
  const ActiveIcon = currentTab.icon;

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8 lg:p-12 max-w-6xl mx-auto">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Luxury Logo-Matched Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B3D5E] via-[#0E4A71] to-[#072438] flex items-center justify-center shadow-lg shadow-[#0B3D5E]/20 shrink-0 border border-white/15">
                <Settings className="w-7 h-7 text-[#FBBF24]" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight">
                    Settings
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                    Page Config
                  </span>
                </div>
                <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">
                  Dynamic page content, section copy, and live site customizations
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 self-start sm:self-center bg-white/90 backdrop-blur-md border border-slate-200/80 px-4 py-2 rounded-2xl shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-[#0B3D5E]">
                Backend Connected
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation Dock */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="relative inline-flex p-1.5 rounded-2xl sm:rounded-full bg-white border border-slate-200/90 shadow-[0_8px_30px_rgba(11,61,94,0.06)] gap-1.5 flex-wrap sm:flex-nowrap">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`settings-tab-${tab.id}`}
                  className={cn(
                    "relative flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold transition-colors duration-200 cursor-pointer select-none outline-none focus:ring-2 focus:ring-[#0B3D5E]/20",
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-[#0B3D5E] hover:bg-slate-100/70"
                  )}
                >
                  {/* Sliding Highlight Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSettingsTabIndicator"
                      className="absolute inset-0 rounded-xl sm:rounded-full bg-gradient-to-r from-[#0B3D5E] via-[#0E4A71] to-[#0B3D5E] shadow-[0_6px_20px_rgba(11,61,94,0.25)]"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <Icon
                    className={cn(
                      "w-4 h-4 relative z-10 transition-colors duration-200 shrink-0",
                      isActive ? "text-[#FBBF24]" : "text-slate-400 group-hover:text-[#0B3D5E]"
                    )}
                  />

                  {/* Label */}
                  <span className="relative z-10 tracking-wide">{tab.label}</span>

                  {/* Golden Active Dot */}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#FBBF24] shrink-0"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === "home" ? (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Hero Section Live Controls Card */}
              <div className="rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] overflow-hidden">
                {/* Section Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
                      <Crown className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight">
                          Hero Section Details
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                          Section 1
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Controls the live floating trust badges and the bold coastal tagline on the landing hero.
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetDefaults}
                      className="rounded-full text-xs font-bold gap-1.5 h-10 px-4 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveHomeSettings}
                      disabled={updateSetting.isPending}
                      data-testid="button-save-home-settings"
                      className="rounded-full text-xs font-bold gap-2 h-10 px-6 bg-[#0B3D5E] hover:bg-[#072438] text-white shadow-md shadow-[#0B3D5E]/20 cursor-pointer"
                    >
                      {updateSetting.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isSavedRecently ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Group 1: Floating Trust Badges */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          1. Floating Trust Badges
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Top of Hero Section
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {/* Rating Score */}
                      <div className="space-y-1.5">
                        <Label htmlFor="ratingScore" className="text-xs font-bold text-slate-700">
                          Rating Score
                        </Label>
                        <Input
                          id="ratingScore"
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={heroForm.ratingScore}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, ratingScore: parseFloat(e.target.value) || 0 })
                          }
                          data-testid="input-rating-score"
                          className="rounded-xl h-11 text-sm font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: 4.9</span>
                      </div>

                      {/* Rating Label */}
                      <div className="space-y-1.5">
                        <Label htmlFor="ratingLabel" className="text-xs font-bold text-slate-700">
                          Rating Label
                        </Label>
                        <Input
                          id="ratingLabel"
                          value={heroForm.ratingLabel}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, ratingLabel: e.target.value })
                          }
                          data-testid="input-rating-label"
                          placeholder="Rating"
                          className="rounded-xl h-11 text-sm font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Rating</span>
                      </div>

                      {/* Happy Guests Count */}
                      <div className="space-y-1.5">
                        <Label htmlFor="guestsCount" className="text-xs font-bold text-slate-700">
                          Guests Count
                        </Label>
                        <Input
                          id="guestsCount"
                          type="number"
                          step="10"
                          min="0"
                          value={heroForm.guestsCount}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, guestsCount: parseInt(e.target.value, 10) || 0 })
                          }
                          data-testid="input-guests-count"
                          className="rounded-xl h-11 text-sm font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: 1000</span>
                      </div>

                      {/* Guests Suffix */}
                      <div className="space-y-1.5">
                        <Label htmlFor="guestsSuffix" className="text-xs font-bold text-slate-700">
                          Guests Suffix
                        </Label>
                        <Input
                          id="guestsSuffix"
                          value={heroForm.guestsSuffix}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, guestsSuffix: e.target.value })
                          }
                          data-testid="input-guests-suffix"
                          placeholder="+"
                          className="rounded-xl h-11 text-sm font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: +</span>
                      </div>

                      {/* Guests Label */}
                      <div className="space-y-1.5">
                        <Label htmlFor="guestsLabel" className="text-xs font-bold text-slate-700">
                          Guests Label
                        </Label>
                        <Input
                          id="guestsLabel"
                          value={heroForm.guestsLabel}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, guestsLabel: e.target.value })
                          }
                          data-testid="input-guests-label"
                          placeholder="Happy Guests"
                          className="rounded-xl h-11 text-sm font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Happy Guests</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: Hero Tagline & Subtitle */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#FBBF24]" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          2. Hero Tagline & Description
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Under "Your Ocean Home in Weligama"
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Tagline Highlight (Lead bold text) */}
                      <div className="lg:col-span-5 space-y-1.5">
                        <Label htmlFor="taglineHighlight" className="text-xs font-bold text-slate-700">
                          Tagline Highlight (Lead Callout)
                        </Label>
                        <Input
                          id="taglineHighlight"
                          value={heroForm.taglineHighlight}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, taglineHighlight: e.target.value })
                          }
                          data-testid="input-tagline-highlight"
                          placeholder="100 steps from the ocean."
                          className="rounded-xl h-11 text-sm font-semibold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">
                          Default: "100 steps from the ocean."
                        </span>
                      </div>

                      {/* Tagline Description */}
                      <div className="lg:col-span-7 space-y-1.5">
                        <Label htmlFor="taglineText" className="text-xs font-bold text-slate-700">
                          Tagline Subtitle (Secondary Description)
                        </Label>
                        <Input
                          id="taglineText"
                          value={heroForm.taglineText}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, taglineText: e.target.value })
                          }
                          data-testid="input-tagline-text"
                          placeholder="Barefoot beach living meets Sri Lankan hospitality."
                          className="rounded-xl h-11 text-sm font-semibold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">
                          Default: "Barefoot beach living meets Sri Lankan hospitality."
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Group 3: Real-Time Live Hero Preview */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                          Real-Time Live Hero Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ● Instant Preview
                      </span>
                    </div>

                    <div
                      className="rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden shadow-2xl text-center"
                      style={{
                        background: "linear-gradient(135deg, #071E2E 0%, #0B3D5E 55%, #051622 100%)",
                      }}
                    >
                      {/* Ambient golden lighting */}
                      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#0B3D5E]/30 rounded-full blur-3xl pointer-events-none" />

                      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        {/* Live Trust Badges */}
                        <div className="flex flex-wrap justify-center items-center gap-3">
                          {/* Rating Badge */}
                          <div className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2.5">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <span className="text-white text-xs font-black tracking-widest uppercase">
                              {Number(heroForm.ratingScore || 4.9).toFixed(1)} {heroForm.ratingLabel.replace(/^\/+/, "").trim() || "Rating"}
                            </span>
                          </div>

                          {/* Happy Guests Badge */}
                          <div className="bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full border border-white/20 shadow-lg flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-white text-xs font-black tracking-widest uppercase">
                              {Number(heroForm.guestsCount || 1000).toLocaleString()}{heroForm.guestsSuffix.replace(/^\/+/, "").trim() || "+"} {heroForm.guestsLabel.replace(/^\/+/, "").trim() || "Happy Guests"}
                            </span>
                          </div>
                        </div>

                        {/* Hero Headline Silhouette */}
                        <div>
                          <p className="text-2xl sm:text-3xl font-serif font-black text-white leading-tight">
                            Your Ocean Home{" "}
                            <span className="text-amber-400 italic font-normal">
                              in Weligama
                            </span>
                          </p>
                        </div>

                        {/* Live Tagline */}
                        <div className="relative inline-block text-left">
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.6)]" />
                          <p className="text-sm sm:text-base text-white/90 leading-relaxed pl-3 italic">
                            <span className="text-white font-bold">
                              {heroForm.taglineHighlight}
                            </span>{" "}
                            {heroForm.taglineText}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Reassurance & Feature Badges */}
              <div className="rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] overflow-hidden">
                {/* Section Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight">
                          Reassurance & Feature Badges
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                          Section 2
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Controls the 4 highlighted trust cards displayed directly below the hero section on the homepage.
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetDefaults}
                      className="rounded-full text-xs font-bold gap-1.5 h-10 px-4 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveHomeSettings}
                      disabled={updateSetting.isPending}
                      data-testid="button-save-reassurance-settings"
                      className="rounded-full text-xs font-bold gap-2 h-10 px-6 bg-[#0B3D5E] hover:bg-[#072438] text-white shadow-md shadow-[#0B3D5E]/20 cursor-pointer"
                    >
                      {updateSetting.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isSavedRecently ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Grid of 4 Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Booking */}
                    <div className="rounded-2xl p-5 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200/60">
                        <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4 text-[#0B3D5E]" strokeWidth={2.4} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Badge 1</span>
                          <h4 className="text-xs font-bold text-[#0B3D5E]">Instant Booking</h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="card1-stat" className="text-[11px] font-bold text-slate-700">
                            Stat / Highlight
                          </Label>
                          <Input
                            id="card1-stat"
                            value={reassuranceForm.card1.stat}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card1: { ...reassuranceForm.card1, stat: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card1-stat"
                            placeholder="Secure"
                            className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card1-title" className="text-[11px] font-bold text-slate-700">
                            Card Title
                          </Label>
                          <Input
                            id="card1-title"
                            value={reassuranceForm.card1.title}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card1: { ...reassuranceForm.card1, title: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card1-title"
                            placeholder="Booking"
                            className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card1-desc" className="text-[11px] font-bold text-slate-700">
                            Subtitle (Uppercase)
                          </Label>
                          <Input
                            id="card1-desc"
                            value={reassuranceForm.card1.desc}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card1: { ...reassuranceForm.card1, desc: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card1-desc"
                            placeholder="Instant Confirmation"
                            className="rounded-xl h-10 text-xs font-semibold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Beach Location */}
                    <div className="rounded-2xl p-5 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200/60">
                        <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-[#0B3D5E]" strokeWidth={2.4} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Badge 2</span>
                          <h4 className="text-xs font-bold text-[#0B3D5E]">Beach Location</h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="card2-stat" className="text-[11px] font-bold text-slate-700">
                            Stat / Distance Number
                          </Label>
                          <Input
                            id="card2-stat"
                            value={reassuranceForm.card2.stat}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card2: { ...reassuranceForm.card2, stat: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card2-stat"
                            placeholder="100"
                            className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card2-title" className="text-[11px] font-bold text-slate-700">
                            Card Title
                          </Label>
                          <Input
                            id="card2-title"
                            value={reassuranceForm.card2.title}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card2: { ...reassuranceForm.card2, title: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card2-title"
                            placeholder="Steps to Beach"
                            className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card2-desc" className="text-[11px] font-bold text-slate-700">
                            Subtitle (Uppercase)
                          </Label>
                          <Input
                            id="card2-desc"
                            value={reassuranceForm.card2.desc}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card2: { ...reassuranceForm.card2, desc: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card2-desc"
                            placeholder="Prime Surf Location"
                            className="rounded-xl h-10 text-xs font-semibold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Guest Rating */}
                    <div className="rounded-2xl p-5 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200/60">
                        <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                          <Star className="w-4 h-4 text-[#0B3D5E] fill-[#FBBF24] stroke-[#0B3D5E]" strokeWidth={2.4} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Badge 3</span>
                          <h4 className="text-xs font-bold text-[#0B3D5E]">Guest Rating</h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2 space-y-1">
                            <Label htmlFor="card3-stat" className="text-[11px] font-bold text-slate-700">
                              Score
                            </Label>
                            <Input
                              id="card3-stat"
                              value={reassuranceForm.card3.stat}
                              onChange={(e) =>
                                setReassuranceForm({
                                  ...reassuranceForm,
                                  card3: { ...reassuranceForm.card3, stat: e.target.value },
                                })
                              }
                              data-testid="input-reassurance-card3-stat"
                              placeholder="4.9"
                              className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="card3-suffix" className="text-[11px] font-bold text-slate-700">
                              Suffix
                            </Label>
                            <Input
                              id="card3-suffix"
                              value={reassuranceForm.card3.suffix ?? "★"}
                              onChange={(e) =>
                                setReassuranceForm({
                                  ...reassuranceForm,
                                  card3: { ...reassuranceForm.card3, suffix: e.target.value },
                                })
                              }
                              data-testid="input-reassurance-card3-suffix"
                              placeholder="★"
                              className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card3-title" className="text-[11px] font-bold text-slate-700">
                            Card Title
                          </Label>
                          <Input
                            id="card3-title"
                            value={reassuranceForm.card3.title}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card3: { ...reassuranceForm.card3, title: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card3-title"
                            placeholder="Guest Rating"
                            className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card3-desc" className="text-[11px] font-bold text-slate-700">
                            Subtitle (Uppercase)
                          </Label>
                          <Input
                            id="card3-desc"
                            value={reassuranceForm.card3.desc}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card3: { ...reassuranceForm.card3, desc: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card3-desc"
                            placeholder="Top-Rated Hospitality"
                            className="rounded-xl h-10 text-xs font-semibold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Surf Hub */}
                    <div className="rounded-2xl p-5 border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4">
                      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200/60">
                        <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                          <Waves className="w-4 h-4 text-[#0B3D5E]" strokeWidth={2.4} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Badge 4</span>
                          <h4 className="text-xs font-bold text-[#0B3D5E]">Surf Hub</h4>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="card4-stat" className="text-[11px] font-bold text-slate-700">
                            Stat / Highlight
                          </Label>
                          <Input
                            id="card4-stat"
                            value={reassuranceForm.card4.stat}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card4: { ...reassuranceForm.card4, stat: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card4-stat"
                            placeholder="Expert"
                            className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card4-title" className="text-[11px] font-bold text-slate-700">
                            Card Title
                          </Label>
                          <Input
                            id="card4-title"
                            value={reassuranceForm.card4.title}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card4: { ...reassuranceForm.card4, title: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card4-title"
                            placeholder="Surf Hub"
                            className="rounded-xl h-10 text-xs font-bold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="card4-desc" className="text-[11px] font-bold text-slate-700">
                            Subtitle (Uppercase)
                          </Label>
                          <Input
                            id="card4-desc"
                            value={reassuranceForm.card4.desc}
                            onChange={(e) =>
                              setReassuranceForm({
                                ...reassuranceForm,
                                card4: { ...reassuranceForm.card4, desc: e.target.value },
                              })
                            }
                            data-testid="input-reassurance-card4-desc"
                            placeholder="ISA Certified Team"
                            className="rounded-xl h-10 text-xs font-semibold text-[#0B3D5E] border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Live Reassurance Strip Preview */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                          Real-Time Live Reassurance Strip Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ● Instant Preview
                      </span>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-[2rem] border border-amber-200/50 shadow-[0_20px_50px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.18)_inset] backdrop-blur-2xl p-4 sm:p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(254,251,243,0.85) 50%, rgba(245,249,252,0.92) 100%)',
                      }}
                    >
                      {/* Top golden accent line */}
                      <div
                        className="absolute top-0 left-8 right-8 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.7), transparent)' }}
                      />

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Card 1 Preview */}
                        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-amber-200/40 shadow-xs flex flex-col items-center text-center transition-all hover:shadow-md">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-2 bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#0B3D5E]">
                            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E]" strokeWidth={2.2} />
                          </div>
                          <span className="text-lg sm:text-xl md:text-2xl font-black mb-0.5 bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent leading-none">
                            {reassuranceForm.card1.stat || "Secure"}
                          </span>
                          <h4 className="font-serif font-bold text-[#0B3D5E] text-xs sm:text-sm tracking-tight leading-tight mb-0.5">
                            {reassuranceForm.card1.title || "Booking"}
                          </h4>
                          <p className="text-[#D97706] text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.18em] font-black">
                            {reassuranceForm.card1.desc || "Instant Confirmation"}
                          </p>
                        </div>

                        {/* Card 2 Preview */}
                        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-amber-200/40 shadow-xs flex flex-col items-center text-center transition-all hover:shadow-md">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-2 bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#0B3D5E]">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E]" strokeWidth={2.2} />
                          </div>
                          <span className="text-lg sm:text-xl md:text-2xl font-black mb-0.5 bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent leading-none">
                            {reassuranceForm.card2.stat || "100"}
                          </span>
                          <h4 className="font-serif font-bold text-[#0B3D5E] text-xs sm:text-sm tracking-tight leading-tight mb-0.5">
                            {reassuranceForm.card2.title || "Steps to Beach"}
                          </h4>
                          <p className="text-[#D97706] text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.18em] font-black">
                            {reassuranceForm.card2.desc || "Prime Surf Location"}
                          </p>
                        </div>

                        {/* Card 3 Preview */}
                        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-amber-200/40 shadow-xs flex flex-col items-center text-center transition-all hover:shadow-md">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-2 bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#0B3D5E]">
                            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E] fill-[#FBBF24] stroke-[#0B3D5E]" strokeWidth={2.4} />
                          </div>
                          <span className="text-lg sm:text-xl md:text-2xl font-black mb-0.5 bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent leading-none">
                            {reassuranceForm.card3.stat || "4.9"}{reassuranceForm.card3.suffix || "★"}
                          </span>
                          <h4 className="font-serif font-bold text-[#0B3D5E] text-xs sm:text-sm tracking-tight leading-tight mb-0.5">
                            {reassuranceForm.card3.title || "Guest Rating"}
                          </h4>
                          <p className="text-[#D97706] text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.18em] font-black">
                            {reassuranceForm.card3.desc || "Top-Rated Hospitality"}
                          </p>
                        </div>

                        {/* Card 4 Preview */}
                        <div className="rounded-2xl p-4 sm:p-5 bg-white border border-amber-200/40 shadow-xs flex flex-col items-center text-center transition-all hover:shadow-md">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-2 bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#0B3D5E]">
                            <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B3D5E]" strokeWidth={2.2} />
                          </div>
                          <span className="text-lg sm:text-xl md:text-2xl font-black mb-0.5 bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent leading-none">
                            {reassuranceForm.card4.stat || "Expert"}
                          </span>
                          <h4 className="font-serif font-bold text-[#0B3D5E] text-xs sm:text-sm tracking-tight leading-tight mb-0.5">
                            {reassuranceForm.card4.title || "Surf Hub"}
                          </h4>
                          <p className="text-[#D97706] text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.18em] font-black">
                            {reassuranceForm.card4.desc || "ISA Certified Team"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: The Ocean Air Experience Pillars & Imagery */}
              <div className="rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] overflow-hidden">
                {/* Section Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
                      <Compass className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight">
                          Experience Pillars & Imagery
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                          Section 3
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Controls the top section details and the 4 interactive cards with custom imagery, tags, and descriptions.
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetDefaults}
                      className="rounded-full text-xs font-bold gap-1.5 h-10 px-4 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveHomeSettings}
                      disabled={updateSetting.isPending}
                      data-testid="button-save-experiences-settings"
                      className="rounded-full text-xs font-bold gap-2 h-10 px-6 bg-[#0B3D5E] hover:bg-[#072438] text-white shadow-md shadow-[#0B3D5E]/20 cursor-pointer"
                    >
                      {updateSetting.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isSavedRecently ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Group 1: Section Header Details (Details top of this image) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          1. Section Header (Top of Images)
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Heading, Overline & Subtitle
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Badge Text */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="experience-badge" className="text-xs font-bold text-slate-700">
                          Overline Badge
                        </Label>
                        <Input
                          id="experience-badge"
                          value={experiencesForm.badge}
                          onChange={(e) =>
                            setExperiencesForm({ ...experiencesForm, badge: e.target.value })
                          }
                          data-testid="input-experience-badge"
                          placeholder="The Ocean Air Experience"
                          className="rounded-xl h-11 text-xs font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: The Ocean Air Experience</span>
                      </div>

                      {/* Section Title */}
                      <div className="md:col-span-8 space-y-1.5">
                        <Label htmlFor="experience-title" className="text-xs font-bold text-slate-700">
                          Main Title (Pillars separated by •)
                        </Label>
                        <Input
                          id="experience-title"
                          value={experiencesForm.title}
                          onChange={(e) =>
                            setExperiencesForm({ ...experiencesForm, title: e.target.value })
                          }
                          data-testid="input-experience-title"
                          placeholder="Surf • Stay • Taste • Explore"
                          className="rounded-xl h-11 text-sm font-serif font-black text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Surf • Stay • Taste • Explore</span>
                      </div>

                      {/* Section Description */}
                      <div className="md:col-span-12 space-y-1.5">
                        <Label htmlFor="experience-desc" className="text-xs font-bold text-slate-700">
                          Section Subtitle / Description
                        </Label>
                        <Input
                          id="experience-desc"
                          value={experiencesForm.description}
                          onChange={(e) =>
                            setExperiencesForm({ ...experiencesForm, description: e.target.value })
                          }
                          data-testid="input-experience-desc"
                          placeholder="Experience barefoot luxury, pristine Indian Ocean waves, authentic flavors, and tailored island adventures."
                          className="rounded-xl h-11 text-xs font-medium text-slate-700 border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Experience barefoot luxury, pristine Indian Ocean waves, authentic flavors, and tailored island adventures.</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: The 4 Experience Cards (With Image Upload & Custom Details) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#0B3D5E]" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          2. The 4 Experience Cards (Images & Details)
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Upload custom imagery or edit text per card
                      </span>
                    </div>

                    {/* Grid of the 4 Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {experiencesForm.cards.map((card, idx) => {
                        const isUploadingThis = uploadingCardIndex === idx;
                        const cardIcons = [
                          <Waves key="surf" className="w-4 h-4 text-amber-500" />,
                          <BedDouble key="stay" className="w-4 h-4 text-amber-500" />,
                          <UtensilsCrossed key="taste" className="w-4 h-4 text-amber-500" />,
                          <Compass key="explore" className="w-4 h-4 text-amber-500" />
                        ];
                        return (
                          <div
                            key={card.id || idx}
                            className="rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50/80 transition-colors p-5 space-y-4"
                          >
                            {/* Card Title & Pillar Indicator */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-amber-100/70 flex items-center justify-center text-[#0B3D5E]">
                                  {cardIcons[idx] || <Compass className="w-4 h-4 text-amber-500" />}
                                </div>
                                <div>
                                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                                    Card {card.num || `0${idx + 1}`}
                                  </span>
                                  <h4 className="text-sm font-serif font-black text-[#0B3D5E]">
                                    {card.title} ({card.tagline})
                                  </h4>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
                                Pillar {idx + 1}
                              </span>
                            </div>

                            {/* Image Uploader & Preview Box */}
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-slate-700">
                                Card Cover Image
                              </Label>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Image Thumbnail */}
                                <div className="relative w-28 h-20 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-800 shrink-0 shadow-xs group">
                                  <img
                                    src={card.img}
                                    alt={card.title}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = DEFAULT_EXPERIENCES_SETTINGS.cards[idx].img;
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-[9px] font-bold text-white uppercase tracking-wider">Preview</span>
                                  </div>
                                </div>

                                {/* Upload Button + File Input + Reset */}
                                <div className="flex-1 space-y-2 w-full">
                                  <div className="flex items-center gap-2">
                                    <label
                                      htmlFor={`upload-card-image-${idx}`}
                                      className={cn(
                                        "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs",
                                        isUploadingThis
                                          ? "bg-slate-100 text-slate-400 pointer-events-none"
                                          : "bg-[#0B3D5E] hover:bg-[#072438] text-white"
                                      )}
                                    >
                                      {isUploadingThis ? (
                                        <>
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          <span>Uploading Image...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="w-3.5 h-3.5 text-[#FBBF24]" />
                                          <span>Upload New Image</span>
                                        </>
                                      )}
                                      <input
                                        id={`upload-card-image-${idx}`}
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        disabled={isUploadingThis}
                                        onChange={(e) => handleCardImageUpload(idx, e)}
                                      />
                                    </label>

                                    {card.img !== DEFAULT_EXPERIENCES_SETTINGS.cards[idx].img && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const newCards = [...experiencesForm.cards];
                                          newCards[idx] = {
                                            ...newCards[idx],
                                            img: DEFAULT_EXPERIENCES_SETTINGS.cards[idx].img,
                                          };
                                          setExperiencesForm({ ...experiencesForm, cards: newCards });
                                          toast({ title: "Reset image to default" });
                                        }}
                                        className="text-[11px] font-bold text-slate-500 hover:text-amber-700 h-8 px-2"
                                      >
                                        <RotateCcw className="w-3 h-3 mr-1" />
                                        Default Image
                                      </Button>
                                    )}
                                  </div>

                                  <Input
                                    value={card.img}
                                    onChange={(e) => {
                                      const newCards = [...experiencesForm.cards];
                                      newCards[idx] = { ...newCards[idx], img: e.target.value };
                                      setExperiencesForm({ ...experiencesForm, cards: newCards });
                                    }}
                                    data-testid={`input-experience-card-${idx}-img`}
                                    placeholder="/images/service-surf.png or image URL"
                                    className="rounded-xl h-9 text-xs font-mono text-slate-700 bg-white border-slate-200"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Text Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {/* Number Badge & Title */}
                              <div className="space-y-1">
                                <Label htmlFor={`card-num-${idx}`} className="text-[11px] font-bold text-slate-700">
                                  Badge Number
                                </Label>
                                <Input
                                  id={`card-num-${idx}`}
                                  value={card.num}
                                  onChange={(e) => {
                                    const newCards = [...experiencesForm.cards];
                                    newCards[idx] = { ...newCards[idx], num: e.target.value };
                                    setExperiencesForm({ ...experiencesForm, cards: newCards });
                                  }}
                                  data-testid={`input-experience-card-${idx}-num`}
                                  placeholder={`0${idx + 1}`}
                                  className="rounded-xl h-9 text-xs font-bold text-[#0B3D5E] bg-white border-slate-200"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor={`card-title-${idx}`} className="text-[11px] font-bold text-slate-700">
                                  Card Title
                                </Label>
                                <Input
                                  id={`card-title-${idx}`}
                                  value={card.title}
                                  onChange={(e) => {
                                    const newCards = [...experiencesForm.cards];
                                    newCards[idx] = { ...newCards[idx], title: e.target.value };
                                    setExperiencesForm({ ...experiencesForm, cards: newCards });
                                  }}
                                  data-testid={`input-experience-card-${idx}-title`}
                                  placeholder="Surf"
                                  className="rounded-xl h-9 text-xs font-bold text-[#0B3D5E] bg-white border-slate-200"
                                />
                              </div>

                              {/* Overline Tagline & Destination Link */}
                              <div className="space-y-1">
                                <Label htmlFor={`card-tagline-${idx}`} className="text-[11px] font-bold text-slate-700">
                                  Overline Tagline
                                </Label>
                                <Input
                                  id={`card-tagline-${idx}`}
                                  value={card.tagline}
                                  onChange={(e) => {
                                    const newCards = [...experiencesForm.cards];
                                    newCards[idx] = { ...newCards[idx], tagline: e.target.value };
                                    setExperiencesForm({ ...experiencesForm, cards: newCards });
                                  }}
                                  data-testid={`input-experience-card-${idx}-tagline`}
                                  placeholder="Ride the waves"
                                  className="rounded-xl h-9 text-xs font-semibold text-amber-700 bg-white border-slate-200"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor={`card-href-${idx}`} className="text-[11px] font-bold text-slate-700">
                                  Click Link / Route
                                </Label>
                                <Input
                                  id={`card-href-${idx}`}
                                  value={card.href}
                                  onChange={(e) => {
                                    const newCards = [...experiencesForm.cards];
                                    newCards[idx] = { ...newCards[idx], href: e.target.value };
                                    setExperiencesForm({ ...experiencesForm, cards: newCards });
                                  }}
                                  data-testid={`input-experience-card-${idx}-href`}
                                  placeholder="/packages"
                                  className="rounded-xl h-9 text-xs font-mono text-slate-600 bg-white border-slate-200"
                                />
                              </div>

                              {/* Description */}
                              <div className="sm:col-span-2 space-y-1">
                                <Label htmlFor={`card-desc-${idx}`} className="text-[11px] font-bold text-slate-700">
                                  Card Description
                                </Label>
                                <Textarea
                                  id={`card-desc-${idx}`}
                                  rows={2}
                                  value={card.description}
                                  onChange={(e) => {
                                    const newCards = [...experiencesForm.cards];
                                    newCards[idx] = { ...newCards[idx], description: e.target.value };
                                    setExperiencesForm({ ...experiencesForm, cards: newCards });
                                  }}
                                  data-testid={`input-experience-card-${idx}-desc`}
                                  placeholder="Card description..."
                                  className="rounded-xl text-xs font-medium text-slate-700 bg-white border-slate-200 resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 3: Real-Time Live Experience Section Preview */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                          Real-Time Live Experience Section Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ● Instant Preview
                      </span>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-[2rem] border border-amber-200/50 shadow-2xl p-6 sm:p-10"
                      style={{
                        background: 'linear-gradient(180deg, #FDFBF7 0%, #F5F9FC 100%)',
                      }}
                    >
                      {/* Ambient golden top accent */}
                      <div
                        className="absolute top-0 left-12 right-12 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.75), transparent)' }}
                      />

                      {/* Live Section Header */}
                      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24]/15 border border-[#FBBF24]/35 mb-3.5 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
                          <span className="text-[#D97706] font-bold tracking-[0.25em] uppercase text-[10.5px]">
                            {experiencesForm.badge || "The Ocean Air Experience"}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight mb-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                          {(experiencesForm.title || "Surf • Stay • Taste • Explore")
                            .split("•")
                            .map((word, idx) => (
                              <span key={idx} className="inline-flex items-center gap-x-2">
                                {idx > 0 && <span className="text-[#FBBF24] font-light">•</span>}
                                <span>{word.trim()}</span>
                              </span>
                            ))}
                        </h3>

                        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent mx-auto rounded-full mb-3" />

                        <p className="text-slate-600 text-xs sm:text-sm font-normal max-w-lg mx-auto leading-relaxed">
                          {experiencesForm.description || "Experience barefoot luxury, pristine Indian Ocean waves, authentic flavors, and tailored island adventures."}
                        </p>
                      </div>

                      {/* Live 4 Staggered Cards Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
                        {experiencesForm.cards.map((card, idx) => {
                          const cardIcons = [
                            <Waves key="surf" className="w-3.5 h-3.5 text-[#FBBF24]" />,
                            <BedDouble key="stay" className="w-3.5 h-3.5 text-[#FBBF24]" />,
                            <UtensilsCrossed key="taste" className="w-3.5 h-3.5 text-[#FBBF24]" />,
                            <Compass key="explore" className="w-3.5 h-3.5 text-[#FBBF24]" />
                          ];
                          const staggerClasses = [
                            "lg:-translate-y-3",
                            "lg:translate-y-3",
                            "lg:-translate-y-3",
                            "lg:translate-y-3"
                          ];
                          return (
                            <div
                              key={card.id || idx}
                              className={`relative ${staggerClasses[idx]} transition-transform duration-300`}
                            >
                              <div className="group relative h-[320px] sm:h-[350px] rounded-[1.75rem] overflow-hidden shadow-lg border border-white/60 bg-slate-900 cursor-pointer">
                                {/* Image */}
                                <img
                                  src={card.img}
                                  alt={card.title}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = DEFAULT_EXPERIENCES_SETTINGS.cards[idx].img;
                                  }}
                                />
                                {/* Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-80" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />

                                {/* Top Badge */}
                                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FBBF24] text-[9.5px] font-bold tracking-wider uppercase">
                                    {cardIcons[idx]}
                                    <span>{card.num || `0${idx + 1}`}</span>
                                  </div>
                                </div>

                                {/* Bottom Content */}
                                <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end z-10 text-left">
                                  <span className="text-[#FBBF24] text-[9.5px] font-bold tracking-[0.2em] uppercase mb-1 block drop-shadow-xs">
                                    {card.tagline}
                                  </span>
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <h4 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight drop-shadow-xs">
                                      {card.title}
                                    </h4>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/35 flex items-center justify-center text-white shrink-0 group-hover:bg-[#FBBF24] group-hover:text-[#0B3D5E] transition-colors">
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                  <p className="text-white/80 text-[11px] leading-relaxed line-clamp-2 drop-shadow-xs">
                                    {card.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Why Choose Us • Value Propositions & Showcase */}
              <div className="rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] overflow-hidden">
                {/* Section Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
                      <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight">
                          Why Choose Us & Showcase
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                          Section 4
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Customise headline, value proposition cards, guest rating social proof, showcase imagery, award badge, and testimonial comment card.
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetDefaults}
                      className="rounded-full text-xs font-bold gap-1.5 h-10 px-4 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveHomeSettings}
                      disabled={updateSetting.isPending}
                      data-testid="button-save-why-choose-us-settings"
                      className="rounded-full text-xs font-bold gap-2 h-10 px-6 bg-[#0B3D5E] hover:bg-[#072438] text-white shadow-md shadow-[#0B3D5E]/20 cursor-pointer"
                    >
                      {updateSetting.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isSavedRecently ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8 space-y-10">
                  {/* Group 1: Headline & Introduction (Left Side Top) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          1. Headline & Introduction
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Overline, Main Title & Description
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Badge Text */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="why-badge" className="text-xs font-bold text-slate-700">
                          Eyebrow Badge
                        </Label>
                        <Input
                          id="why-badge"
                          value={whyChooseUsForm.badge}
                          onChange={(e) =>
                            setWhyChooseUsForm({ ...whyChooseUsForm, badge: e.target.value })
                          }
                          data-testid="input-why-badge"
                          placeholder="Why Choose Us"
                          className="rounded-xl h-11 text-xs font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Why Choose Us</span>
                      </div>

                      {/* Heading Lead */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="why-heading-lead" className="text-xs font-bold text-slate-700">
                          Heading Lead (Navy text)
                        </Label>
                        <Input
                          id="why-heading-lead"
                          value={whyChooseUsForm.headingLead}
                          onChange={(e) =>
                            setWhyChooseUsForm({ ...whyChooseUsForm, headingLead: e.target.value })
                          }
                          data-testid="input-why-heading-lead"
                          placeholder="More Than Just A"
                          className="rounded-xl h-11 text-sm font-serif font-black text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: More Than Just A</span>
                      </div>

                      {/* Heading Highlight */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="why-heading-highlight" className="text-xs font-bold text-slate-700">
                          Heading Highlight (Golden Italic)
                        </Label>
                        <Input
                          id="why-heading-highlight"
                          value={whyChooseUsForm.headingHighlight}
                          onChange={(e) =>
                            setWhyChooseUsForm({ ...whyChooseUsForm, headingHighlight: e.target.value })
                          }
                          data-testid="input-why-heading-highlight"
                          placeholder="Stay"
                          className="rounded-xl h-11 text-sm font-serif font-black text-[#D97706] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Stay</span>
                      </div>

                      {/* Section Description */}
                      <div className="md:col-span-12 space-y-1.5">
                        <Label htmlFor="why-desc" className="text-xs font-bold text-slate-700">
                          Section Introduction / Subtitle
                        </Label>
                        <Textarea
                          id="why-desc"
                          rows={2}
                          value={whyChooseUsForm.description}
                          onChange={(e) =>
                            setWhyChooseUsForm({ ...whyChooseUsForm, description: e.target.value })
                          }
                          data-testid="input-why-desc"
                          placeholder="We believe your vacation should be effortless. From the moment you arrive, every detail is handled with warmth and precision, so you can focus entirely on unwinding by the ocean."
                          className="rounded-xl text-xs text-slate-700 border-slate-200 resize-none font-medium leading-relaxed"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">
                          Default: We believe your vacation should be effortless. From the moment you arrive, every detail is handled with warmth and precision, so you can focus entirely on unwinding by the ocean.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: The 3 Value Proposition Cards (Left Side Middle) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          2. Value Proposition Cards (3 Benefits)
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Title & Description for each feature
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {whyChooseUsForm.features.map((feature, idx) => {
                        const iconBadge = idx === 0 ? (
                          <MapPin className="w-4 h-4 text-[#0B3D5E]" />
                        ) : idx === 1 ? (
                          <Palmtree className="w-4 h-4 text-[#0B3D5E]" />
                        ) : (
                          <Waves className="w-4 h-4 text-[#0B3D5E]" />
                        );

                        return (
                          <div
                            key={feature.id || idx}
                            className="rounded-2xl p-4.5 bg-slate-50/70 border border-slate-200/80 shadow-xs space-y-3.5 relative group hover:border-amber-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-100/70 border border-amber-200/80 flex items-center justify-center">
                                  {iconBadge}
                                </div>
                                <span className="text-xs font-black text-[#0B3D5E] uppercase tracking-wider">
                                  Card 0{idx + 1}
                                </span>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                {idx === 0 ? "Location" : idx === 1 ? "Hospitality" : "Services"}
                              </span>
                            </div>

                            {/* Feature Title */}
                            <div className="space-y-1">
                              <Label className="text-[11px] font-bold text-slate-700">
                                Feature Title
                              </Label>
                              <Input
                                value={feature.title}
                                onChange={(e) => {
                                  const updated = [...whyChooseUsForm.features];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setWhyChooseUsForm({ ...whyChooseUsForm, features: updated });
                                }}
                                data-testid={`input-why-feature-title-${idx}`}
                                placeholder="Feature Title"
                                className="rounded-xl h-10 text-xs font-serif font-black text-[#0B3D5E] border-slate-200 bg-white"
                              />
                            </div>

                            {/* Feature Description */}
                            <div className="space-y-1">
                              <Label className="text-[11px] font-bold text-slate-700">
                                Feature Description
                              </Label>
                              <Textarea
                                rows={3}
                                value={feature.desc}
                                onChange={(e) => {
                                  const updated = [...whyChooseUsForm.features];
                                  updated[idx] = { ...updated[idx], desc: e.target.value };
                                  setWhyChooseUsForm({ ...whyChooseUsForm, features: updated });
                                }}
                                data-testid={`input-why-feature-desc-${idx}`}
                                placeholder="Feature Description"
                                className="rounded-xl text-xs text-slate-600 border-slate-200 bg-white resize-none font-medium leading-relaxed"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 3: Social Proof & Guest Rating (Bottom Left) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          3. Social Proof & Guest Rating
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Score, Subtext & 4 Guest Avatars
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Rating Score */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="why-score" className="text-xs font-bold text-slate-700">
                          Rating Score
                        </Label>
                        <Input
                          id="why-score"
                          value={whyChooseUsForm.socialProof.score}
                          onChange={(e) =>
                            setWhyChooseUsForm({
                              ...whyChooseUsForm,
                              socialProof: { ...whyChooseUsForm.socialProof, score: e.target.value },
                            })
                          }
                          data-testid="input-why-score"
                          placeholder="5.0 / 5.0"
                          className="rounded-xl h-10 text-xs font-black text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: 5.0 / 5.0</span>
                      </div>

                      {/* Subtext */}
                      <div className="md:col-span-5 space-y-1.5">
                        <Label htmlFor="why-score-text" className="text-xs font-bold text-slate-700">
                          Social Proof Subtext
                        </Label>
                        <Input
                          id="why-score-text"
                          value={whyChooseUsForm.socialProof.text}
                          onChange={(e) =>
                            setWhyChooseUsForm({
                              ...whyChooseUsForm,
                              socialProof: { ...whyChooseUsForm.socialProof, text: e.target.value },
                            })
                          }
                          data-testid="input-why-score-text"
                          placeholder="Loved by 1,000+ guests worldwide"
                          className="rounded-xl h-10 text-xs font-bold text-slate-700 border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Loved by 1,000+ guests worldwide</span>
                      </div>

                      {/* Avatar Badge (+1k) */}
                      <div className="md:col-span-3 space-y-1.5">
                        <Label htmlFor="why-avatar-badge" className="text-xs font-bold text-slate-700">
                          Avatar Stack Badge
                        </Label>
                        <Input
                          id="why-avatar-badge"
                          value={whyChooseUsForm.socialProof.avatarBadge}
                          onChange={(e) =>
                            setWhyChooseUsForm({
                              ...whyChooseUsForm,
                              socialProof: { ...whyChooseUsForm.socialProof, avatarBadge: e.target.value },
                            })
                          }
                          data-testid="input-why-avatar-badge"
                          placeholder="+1k"
                          className="rounded-xl h-10 text-xs font-black text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: +1k</span>
                      </div>

                      {/* 4 Guest Avatars */}
                      <div className="md:col-span-12 space-y-2 pt-2">
                        <Label className="text-xs font-bold text-slate-700 block">
                          Guest Avatar Images (4 Profiles)
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {whyChooseUsForm.socialProof.avatars.map((avatarUrl, aIdx) => (
                            <div
                              key={aIdx}
                              className="rounded-xl p-3 bg-slate-50 border border-slate-200/90 flex flex-col gap-2.5"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-200 shrink-0">
                                  <img
                                    src={avatarUrl}
                                    alt={`Avatar ${aIdx + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.avatars[aIdx];
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[11px] font-black text-[#0B3D5E] block truncate">
                                    Guest Avatar {aIdx + 1}
                                  </span>
                                  <label className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer">
                                    <Upload className="w-2.5 h-2.5" />
                                    <span>{uploadingAvatarIndex === aIdx ? "Uploading..." : "Upload Photo"}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      disabled={uploadingAvatarIndex === aIdx}
                                      onChange={(e) => handleAvatarUpload(aIdx, e)}
                                    />
                                  </label>
                                </div>
                              </div>
                              <Input
                                value={avatarUrl}
                                onChange={(e) => {
                                  const updated = [...whyChooseUsForm.socialProof.avatars];
                                  updated[aIdx] = e.target.value;
                                  setWhyChooseUsForm({
                                    ...whyChooseUsForm,
                                    socialProof: { ...whyChooseUsForm.socialProof, avatars: updated },
                                  });
                                }}
                                placeholder="Avatar Image URL"
                                className="rounded-lg h-8 text-[11px] text-slate-600 bg-white border-slate-200"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group 4: Showcase Media, Floating Award Badge & Testimonial Card (Right Side) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          4. Showcase Media, Award Badge & Testimonial Card
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Right Side Showcase Image & Floating Overlays
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Showcase Image Uploader */}
                      <div className="lg:col-span-5 rounded-2xl p-5 bg-slate-50/70 border border-slate-200/90 space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold text-[#0B3D5E] uppercase tracking-wider">
                            Showcase Cover Photo
                          </Label>
                          <span className="text-[10px] font-bold text-slate-400">Right Column Visual</span>
                        </div>

                        <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                          <img
                            src={whyChooseUsForm.showcase.image}
                            alt="Showcase Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.image;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#0B3D5E] text-xs font-bold shadow-lg cursor-pointer hover:bg-slate-50 transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploadingShowcase ? "Uploading..." : "Change Image"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingShowcase}
                                onChange={handleShowcaseImageUpload}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Image URL / Path</span>
                            <label className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer">
                              <Upload className="w-3 h-3" />
                              <span>{isUploadingShowcase ? "Uploading..." : "Upload New File"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingShowcase}
                                onChange={handleShowcaseImageUpload}
                              />
                            </label>
                          </div>
                          <Input
                            value={whyChooseUsForm.showcase.image}
                            onChange={(e) =>
                              setWhyChooseUsForm({
                                ...whyChooseUsForm,
                                showcase: { ...whyChooseUsForm.showcase, image: e.target.value },
                              })
                            }
                            data-testid="input-why-showcase-image"
                            placeholder="/images/service-stay.png or https://..."
                            className="rounded-xl h-10 text-xs text-slate-700 border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      {/* Right Sub-forms: Award Badge & Testimonial Details */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* Award Badge Details */}
                        <div className="rounded-2xl p-4.5 bg-slate-50/70 border border-slate-200/90 space-y-3">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3D5E]">
                              Top Right Floating Award Badge
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <div className="sm:col-span-3 space-y-1">
                              <Label className="text-[11px] font-bold text-slate-700">Icon / Emoji</Label>
                              <Input
                                value={whyChooseUsForm.showcase.awardIcon}
                                onChange={(e) =>
                                  setWhyChooseUsForm({
                                    ...whyChooseUsForm,
                                    showcase: { ...whyChooseUsForm.showcase, awardIcon: e.target.value },
                                  })
                                }
                                data-testid="input-why-award-icon"
                                placeholder="🏆"
                                className="rounded-xl h-10 text-center text-sm font-bold border-slate-200 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-4 space-y-1">
                              <Label className="text-[11px] font-bold text-slate-700">Badge Tag</Label>
                              <Input
                                value={whyChooseUsForm.showcase.awardTag}
                                onChange={(e) =>
                                  setWhyChooseUsForm({
                                    ...whyChooseUsForm,
                                    showcase: { ...whyChooseUsForm.showcase, awardTag: e.target.value },
                                  })
                                }
                                data-testid="input-why-award-tag"
                                placeholder="Top Rated"
                                className="rounded-xl h-10 text-xs font-bold text-[#D97706] border-slate-200 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-5 space-y-1">
                              <Label className="text-[11px] font-bold text-slate-700">Award Title</Label>
                              <Input
                                value={whyChooseUsForm.showcase.awardTitle}
                                onChange={(e) =>
                                  setWhyChooseUsForm({
                                    ...whyChooseUsForm,
                                    showcase: { ...whyChooseUsForm.showcase, awardTitle: e.target.value },
                                  })
                                }
                                data-testid="input-why-award-title"
                                placeholder="2026 Choice Award"
                                className="rounded-xl h-10 text-xs font-serif font-black text-[#0B3D5E] border-slate-200 bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Testimonial Details */}
                        <div className="rounded-2xl p-4.5 bg-slate-50/70 border border-slate-200/90 space-y-3">
                          <div className="flex items-center gap-2">
                            <Quote className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#0B3D5E]">
                              Floating Testimonial Comment Card
                            </h4>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label className="text-[11px] font-bold text-slate-700">
                                Testimonial Quote
                              </Label>
                              <Textarea
                                rows={2}
                                value={whyChooseUsForm.showcase.testimonialQuote}
                                onChange={(e) =>
                                  setWhyChooseUsForm({
                                    ...whyChooseUsForm,
                                    showcase: { ...whyChooseUsForm.showcase, testimonialQuote: e.target.value },
                                  })
                                }
                                data-testid="input-why-testimonial-quote"
                                placeholder="The most peaceful week of my life. Waking up to the sound of waves and walking straight onto the sand is an unmatched experience."
                                className="rounded-xl text-xs text-slate-700 border-slate-200 bg-white resize-none font-serif italic leading-relaxed"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                              <div className="sm:col-span-2 space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700">Initial</Label>
                                <Input
                                  value={whyChooseUsForm.showcase.testimonialAuthorInitial}
                                  onChange={(e) =>
                                    setWhyChooseUsForm({
                                      ...whyChooseUsForm,
                                      showcase: {
                                        ...whyChooseUsForm.showcase,
                                        testimonialAuthorInitial: e.target.value,
                                      },
                                    })
                                  }
                                  data-testid="input-why-testimonial-initial"
                                  placeholder="S"
                                  className="rounded-xl h-10 text-center text-xs font-black text-[#0B3D5E] border-slate-200 bg-white"
                                />
                              </div>
                              <div className="sm:col-span-5 space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700">Author Name</Label>
                                <Input
                                  value={whyChooseUsForm.showcase.testimonialAuthor}
                                  onChange={(e) =>
                                    setWhyChooseUsForm({
                                      ...whyChooseUsForm,
                                      showcase: {
                                        ...whyChooseUsForm.showcase,
                                        testimonialAuthor: e.target.value,
                                      },
                                    })
                                  }
                                  data-testid="input-why-testimonial-author"
                                  placeholder="Sarah Jenkins"
                                  className="rounded-xl h-10 text-xs font-black text-[#0B3D5E] border-slate-200 bg-white"
                                />
                              </div>
                              <div className="sm:col-span-5 space-y-1">
                                <Label className="text-[11px] font-bold text-slate-700">Stay / Room Details</Label>
                                <Input
                                  value={whyChooseUsForm.showcase.testimonialAuthorRole}
                                  onChange={(e) =>
                                    setWhyChooseUsForm({
                                      ...whyChooseUsForm,
                                      showcase: {
                                        ...whyChooseUsForm.showcase,
                                        testimonialAuthorRole: e.target.value,
                                      },
                                    })
                                  }
                                  data-testid="input-why-testimonial-role"
                                  placeholder="Stayed 7 nights • Deluxe Ocean Suite"
                                  className="rounded-xl h-10 text-xs font-medium text-slate-600 border-slate-200 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Group 5: Real-Time Live Showcase Preview */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                          Real-Time Live Showcase Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ● Instant Preview
                      </span>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-[2rem] border border-amber-200/50 shadow-2xl p-6 sm:p-10"
                      style={{
                        background: 'linear-gradient(180deg, #FDFBF7 0%, #F5F9FC 100%)',
                      }}
                    >
                      {/* Ambient golden top accent */}
                      <div
                        className="absolute top-0 left-12 right-12 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.75), transparent)' }}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        {/* Left Column: Heading, Features, Social Proof */}
                        <div className="lg:col-span-7">
                          {/* Eyebrow badge */}
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/40 shadow-xs mb-3 w-fit">
                            <Palmtree className="w-3 h-3 text-[#0B3D5E]" />
                            <span>{whyChooseUsForm.badge || "Why Choose Us"}</span>
                          </div>

                          {/* Main Heading */}
                          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] mb-3 leading-tight tracking-tight">
                            {whyChooseUsForm.headingLead || "More Than Just A"}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] italic">
                              {whyChooseUsForm.headingHighlight || "Stay"}
                            </span>
                          </h3>

                          {/* Description */}
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal mb-5 max-w-xl">
                            {whyChooseUsForm.description || "We believe your vacation should be effortless. From the moment you arrive, every detail is handled with warmth and precision, so you can focus entirely on unwinding by the ocean."}
                          </p>

                          {/* The 3 Feature Cards */}
                          <div className="space-y-2.5 mb-6">
                            {whyChooseUsForm.features.map((item, i) => {
                              const IconComponent =
                                i === 0 ? MapPin : i === 1 ? Palmtree : Waves;
                              return (
                                <div
                                  key={i}
                                  className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3 hover:border-amber-300 transition-colors"
                                >
                                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/60 border border-[#FDE68A] flex items-center justify-center shrink-0 text-[#0B3D5E] shadow-xs">
                                    <IconComponent className="w-4 h-4 text-[#0B3D5E]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-serif font-black text-[#0B3D5E] mb-0.5">
                                      {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                                      {item.desc}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Social Proof Row */}
                          <div className="pt-4 border-t border-slate-200/70 flex items-center gap-4 flex-wrap">
                            <div className="flex -space-x-2.5 items-center">
                              {whyChooseUsForm.socialProof.avatars.map((src, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-xs"
                                >
                                  <img
                                    src={src}
                                    alt="Guest"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        DEFAULT_WHY_CHOOSE_US_SETTINGS.socialProof.avatars[i];
                                    }}
                                  />
                                </div>
                              ))}
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0B3D5E] text-[#FBBF24] flex items-center justify-center font-black text-[10px] shadow-xs">
                                {whyChooseUsForm.socialProof.avatarBadge || "+1k"}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-1 text-[#FBBF24] mb-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-[#FBBF24] text-[#FBBF24]" />
                                ))}
                                <span className="text-xs font-black text-[#0B3D5E] ml-1">
                                  {whyChooseUsForm.socialProof.score || "5.0 / 5.0"}
                                </span>
                              </div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                {whyChooseUsForm.socialProof.text || "Loved by 1,000+ guests worldwide"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Showcase Cover Image + Floating Award + Testimonial */}
                        <div className="lg:col-span-5 flex justify-center relative w-full">
                          <div className="relative w-full max-w-[380px]">
                            {/* Showcase Image Frame */}
                            <div className="relative h-[420px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/80 group bg-slate-900">
                              <img
                                src={whyChooseUsForm.showcase.image}
                                alt="Showcase Live Preview"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    DEFAULT_WHY_CHOOSE_US_SETTINGS.showcase.image;
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/85 via-black/20 to-transparent pointer-events-none" />

                              {/* Floating Testimonial Comment Card */}
                              <div className="absolute bottom-0 left-0 p-3.5 sm:p-4 w-full z-10">
                                <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 text-white shadow-xl">
                                  <div className="flex items-center gap-1 text-[#FBBF24] mb-1.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className="w-2.5 h-2.5 fill-[#FBBF24] text-[#FBBF24]" />
                                    ))}
                                  </div>
                                  <p className="font-serif italic text-xs mb-2.5 leading-relaxed text-white/95 line-clamp-3">
                                    "{whyChooseUsForm.showcase.testimonialQuote || "The most peaceful week of my life. Waking up to the sound of waves and walking straight onto the sand is an unmatched experience."}"
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-[#0B3D5E] font-black flex items-center justify-center shadow-md text-xs shrink-0">
                                      {whyChooseUsForm.showcase.testimonialAuthorInitial || (whyChooseUsForm.showcase.testimonialAuthor ? whyChooseUsForm.showcase.testimonialAuthor.charAt(0) : "S")}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-black text-xs text-white truncate">
                                        {whyChooseUsForm.showcase.testimonialAuthor || "Sarah Jenkins"}
                                      </p>
                                      <p className="text-white/80 text-[9.5px] font-medium truncate">
                                        {whyChooseUsForm.showcase.testimonialAuthorRole || "Stayed 7 nights • Deluxe Ocean Suite"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Floating Top-Right Award Badge */}
                            <div className="absolute -top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-[#FBBF24]/40 flex items-center gap-2.5 z-20">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] border border-[#FDE68A] rounded-xl flex items-center justify-center shadow-xs shrink-0">
                                <span className="text-base">
                                  {whyChooseUsForm.showcase.awardIcon || "🏆"}
                                </span>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706]">
                                  {whyChooseUsForm.showcase.awardTag || "Top Rated"}
                                </p>
                                <p className="text-xs font-serif font-black text-[#0B3D5E] leading-tight">
                                  {whyChooseUsForm.showcase.awardTitle || "2026 Choice Award"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "gallery" ? (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {/* Section 1: Featured Moments & Video Showcase */}
              <div className="rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] overflow-hidden">
                {/* Section Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-xs">
                      <Film className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight">
                          Featured Moments & Video Showcase
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                          Gallery Tab
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        Customise headline, narrative, looping video cards, and guest memory submission banner on the public Gallery page.
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2.5 self-start sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResetGalleryDefaults}
                      className="rounded-full text-xs font-bold gap-1.5 h-10 px-4 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveGallerySettings}
                      disabled={updateSetting.isPending}
                      data-testid="button-save-gallery-settings"
                      className="rounded-full text-xs font-bold gap-2 h-10 px-6 bg-[#0B3D5E] hover:bg-[#072438] text-white shadow-md shadow-[#0B3D5E]/20 cursor-pointer"
                    >
                      {updateSetting.isPending ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isGallerySavedRecently ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Saved!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8 space-y-10">
                  {/* Group 1: Section Header Details (Top of Videos) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          1. Section Header & Narrative (Top of Videos)
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Headline, Overline & Subtitle
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Eyebrow Badge */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="gallery-badge" className="text-xs font-bold text-slate-700">
                          Eyebrow Badge
                        </Label>
                        <Input
                          id="gallery-badge"
                          value={galleryForm.featuredMoments.badge}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              featuredMoments: { ...galleryForm.featuredMoments, badge: e.target.value },
                            })
                          }
                          data-testid="input-gallery-badge"
                          placeholder="Curated Visual Stories"
                          className="rounded-xl h-11 text-xs font-bold text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Curated Visual Stories</span>
                      </div>

                      {/* Heading Lead */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="gallery-heading-lead" className="text-xs font-bold text-slate-700">
                          Heading Lead (Navy text)
                        </Label>
                        <Input
                          id="gallery-heading-lead"
                          value={galleryForm.featuredMoments.headingLead}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              featuredMoments: { ...galleryForm.featuredMoments, headingLead: e.target.value },
                            })
                          }
                          data-testid="input-gallery-heading-lead"
                          placeholder="Featured"
                          className="rounded-xl h-11 text-sm font-serif font-black text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Featured</span>
                      </div>

                      {/* Heading Highlight */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="gallery-heading-highlight" className="text-xs font-bold text-slate-700">
                          Heading Highlight (Golden Gradient)
                        </Label>
                        <Input
                          id="gallery-heading-highlight"
                          value={galleryForm.featuredMoments.headingHighlight}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              featuredMoments: { ...galleryForm.featuredMoments, headingHighlight: e.target.value },
                            })
                          }
                          data-testid="input-gallery-heading-highlight"
                          placeholder="Moments"
                          className="rounded-xl h-11 text-sm font-serif font-black text-[#D97706] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Moments</span>
                      </div>

                      {/* Subtitle / Description */}
                      <div className="md:col-span-12 space-y-1.5">
                        <Label htmlFor="gallery-subtitle" className="text-xs font-bold text-slate-700">
                          Section Subtitle / Narrative
                        </Label>
                        <Textarea
                          id="gallery-subtitle"
                          rows={2}
                          value={galleryForm.featuredMoments.subtitle}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              featuredMoments: { ...galleryForm.featuredMoments, subtitle: e.target.value },
                            })
                          }
                          data-testid="input-gallery-subtitle"
                          placeholder="Curated highlights, ocean rhythms, and cinematic memories captured steps from Weligama Bay."
                          className="rounded-xl text-xs text-slate-700 border-slate-200 resize-none font-medium leading-relaxed"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">
                          Default: Curated highlights, ocean rhythms, and cinematic memories captured steps from Weligama Bay.
                        </span>
                      </div>

                      {/* Right Header Elements: Guest Journal Status, Subtext, CTA Label */}
                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="gallery-journal-status" className="text-xs font-bold text-slate-700">
                          Journal Indicator Status
                        </Label>
                        <Input
                          id="gallery-journal-status"
                          value={galleryForm.featuredMoments.journalStatus}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              featuredMoments: { ...galleryForm.featuredMoments, journalStatus: e.target.value },
                            })
                          }
                          data-testid="input-gallery-journal-status"
                          placeholder="Guest Journal Open"
                          className="rounded-xl h-10 text-xs font-black text-[#0B3D5E] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Guest Journal Open</span>
                      </div>

                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="gallery-journal-subtext" className="text-xs font-bold text-slate-700">
                          Journal Subtext
                        </Label>
                        <Input
                          id="gallery-journal-subtext"
                          value={galleryForm.featuredMoments.journalSubtext}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              featuredMoments: { ...galleryForm.featuredMoments, journalSubtext: e.target.value },
                            })
                          }
                          data-testid="input-gallery-journal-subtext"
                          placeholder="Be featured in our stories"
                          className="rounded-xl h-10 text-xs text-slate-600 border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Be featured in our stories</span>
                      </div>

                      <div className="md:col-span-4 space-y-1.5">
                        <Label htmlFor="gallery-share-cta" className="text-xs font-bold text-slate-700">
                          Share CTA Button Label
                        </Label>
                        <Input
                          id="gallery-share-cta"
                          value={galleryForm.featuredMoments.shareCtaText}
                          onChange={(e) =>
                            setGalleryForm({
                              ...galleryForm,
                              featuredMoments: { ...galleryForm.featuredMoments, shareCtaText: e.target.value },
                            })
                          }
                          data-testid="input-gallery-share-cta"
                          placeholder="Share Your Memory"
                          className="rounded-xl h-10 text-xs font-black text-[#D97706] border-slate-200"
                        />
                        <span className="text-[10px] text-slate-400 font-medium">Default: Share Your Memory</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: The 3 Featured Video Cards */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-amber-500" />
                        <h3 className="text-sm font-black uppercase tracking-wider text-[#0B3D5E]">
                          2. Featured Video Cards (3 Looping Clips)
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400">
                        Upload or link MP4/WebM videos, locations & captions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {galleryForm.featuredMoments.videos.map((card, idx) => (
                        <div
                          key={card.id || idx}
                          className="rounded-2xl p-5 bg-slate-50/70 border border-slate-200/90 shadow-xs space-y-4 relative group hover:border-amber-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-amber-100/70 border border-amber-200/80 flex items-center justify-center">
                                <Film className="w-4 h-4 text-[#0B3D5E]" />
                              </div>
                              <span className="text-xs font-black text-[#0B3D5E] uppercase tracking-wider">
                                Video 0{idx + 1}
                              </span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              {card.badge || (idx === 0 ? "Shoreline" : idx === 1 ? "Surf" : "Marine")}
                            </span>
                          </div>

                          {/* Video Media Box */}
                          <div className="relative h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-inner group/video">
                            <video
                              src={card.url}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/video:scale-105"
                              onError={(e) => {
                                (e.target as HTMLVideoElement).src = DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[idx].url;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/video:opacity-100 transition-opacity flex items-center justify-center p-3">
                              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#0B3D5E] text-xs font-bold shadow-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <Upload className="w-3.5 h-3.5" />
                                <span>{uploadingVideoIndex === idx ? "Uploading..." : "Upload Video / File"}</span>
                                <input
                                  type="file"
                                  accept="video/*,image/*"
                                  className="hidden"
                                  disabled={uploadingVideoIndex === idx}
                                  onChange={(e) => handleVideoUpload(idx, e)}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Video URL Input */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label className="text-[11px] font-bold text-slate-700">Video URL / Path</Label>
                              <label className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 hover:text-amber-800 cursor-pointer">
                                <Upload className="w-2.5 h-2.5" />
                                <span>{uploadingVideoIndex === idx ? "Uploading..." : "Upload New File"}</span>
                                <input
                                  type="file"
                                  accept="video/*,image/*"
                                  className="hidden"
                                  disabled={uploadingVideoIndex === idx}
                                  onChange={(e) => handleVideoUpload(idx, e)}
                                />
                              </label>
                            </div>
                            <Input
                              value={card.url}
                              onChange={(e) => {
                                const updated = [...galleryForm.featuredMoments.videos];
                                updated[idx] = { ...updated[idx], url: e.target.value };
                                setGalleryForm({
                                  ...galleryForm,
                                  featuredMoments: { ...galleryForm.featuredMoments, videos: updated },
                                });
                              }}
                              data-testid={`input-gallery-video-url-${idx}`}
                              placeholder="/video.mp4 or https://..."
                              className="rounded-xl h-9 text-xs text-slate-600 bg-white border-slate-200"
                            />
                          </div>

                          {/* Location Tag */}
                          <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700">Location Tag</Label>
                            <Input
                              value={card.location}
                              onChange={(e) => {
                                const updated = [...galleryForm.featuredMoments.videos];
                                updated[idx] = { ...updated[idx], location: e.target.value };
                                setGalleryForm({
                                  ...galleryForm,
                                  featuredMoments: { ...galleryForm.featuredMoments, videos: updated },
                                });
                              }}
                              data-testid={`input-gallery-video-location-${idx}`}
                              placeholder="e.g. Weligama Bay Waters"
                              className="rounded-xl h-9 text-xs font-bold text-[#D97706] bg-white border-slate-200"
                            />
                          </div>

                          {/* Title / Caption */}
                          <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700">Video Title / Caption</Label>
                            <Input
                              value={card.caption}
                              onChange={(e) => {
                                const updated = [...galleryForm.featuredMoments.videos];
                                updated[idx] = { ...updated[idx], caption: e.target.value };
                                setGalleryForm({
                                  ...galleryForm,
                                  featuredMoments: { ...galleryForm.featuredMoments, videos: updated },
                                });
                              }}
                              data-testid={`input-gallery-video-caption-${idx}`}
                              placeholder="e.g. Ocean Vibes"
                              className="rounded-xl h-9 text-xs font-serif font-black text-[#0B3D5E] bg-white border-slate-200"
                            />
                          </div>

                          {/* Subtitle / Narrative */}
                          <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700">Narrative Subtitle</Label>
                            <Textarea
                              rows={2}
                              value={card.subtitle}
                              onChange={(e) => {
                                const updated = [...galleryForm.featuredMoments.videos];
                                updated[idx] = { ...updated[idx], subtitle: e.target.value };
                                setGalleryForm({
                                  ...galleryForm,
                                  featuredMoments: { ...galleryForm.featuredMoments, videos: updated },
                                });
                              }}
                              data-testid={`input-gallery-video-subtitle-${idx}`}
                              placeholder="Description"
                              className="rounded-xl text-xs text-slate-600 bg-white border-slate-200 resize-none font-medium leading-relaxed"
                            />
                          </div>

                          {/* Badge Tag & Alt Text */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold text-slate-600">Vibe Tag</Label>
                              <Input
                                value={card.badge}
                                onChange={(e) => {
                                  const updated = [...galleryForm.featuredMoments.videos];
                                  updated[idx] = { ...updated[idx], badge: e.target.value };
                                  setGalleryForm({
                                    ...galleryForm,
                                    featuredMoments: { ...galleryForm.featuredMoments, videos: updated },
                                  });
                                }}
                                data-testid={`input-gallery-video-badge-${idx}`}
                                placeholder="e.g. Shoreline Soul"
                                className="rounded-lg h-8 text-[11px] bg-white border-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold text-slate-600">Alt Text</Label>
                              <Input
                                value={card.alt}
                                onChange={(e) => {
                                  const updated = [...galleryForm.featuredMoments.videos];
                                  updated[idx] = { ...updated[idx], alt: e.target.value };
                                  setGalleryForm({
                                    ...galleryForm,
                                    featuredMoments: { ...galleryForm.featuredMoments, videos: updated },
                                  });
                                }}
                                data-testid={`input-gallery-video-alt-${idx}`}
                                placeholder="e.g. Ocean View"
                                className="rounded-lg h-8 text-[11px] bg-white border-slate-200"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Group 3: Real-Time Live Gallery Showcase Preview */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                          Real-Time Live Featured Moments Preview
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        ● Instant Preview
                      </span>
                    </div>

                    <div
                      className="relative overflow-hidden rounded-[2.5rem] border border-amber-200/50 shadow-2xl p-6 sm:p-10 lg:p-12"
                      style={{
                        background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.72) 45%, rgba(245, 249, 252, 0.85) 100%)',
                      }}
                    >
                      {/* Internal Halos */}
                      <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#FBBF24]/15 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#0B3D5E]/6 rounded-full blur-3xl pointer-events-none" />

                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
                        <div className="max-w-xl">
                          {/* Eyebrow Badge */}
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.22em] text-[#0B3D5E] bg-[#FBBF24]/20 border border-[#FBBF24]/50 mb-3 shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
                            <Camera className="w-3 h-3 text-[#D97706]" />
                            <span>{galleryForm.featuredMoments.badge || "Curated Visual Stories"}</span>
                          </div>

                          {/* Title */}
                          <div className="mb-2">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                              <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight">
                                {galleryForm.featuredMoments.headingLead || "Featured"}
                              </span>
                              <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#F59E0B] tracking-tight">
                                {galleryForm.featuredMoments.headingHighlight || "Moments"}
                              </span>
                            </div>
                            <div className="w-14 h-1 rounded-full bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-transparent mt-2" />
                          </div>

                          {/* Subtitle */}
                          <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed mt-2">
                            {galleryForm.featuredMoments.subtitle || "Curated highlights, ocean rhythms, and cinematic memories captured steps from Weligama Bay."}
                          </p>
                        </div>

                        {/* Right Side Guest Journal info + CTA */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="hidden sm:flex flex-col items-end text-right">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#0B3D5E] flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {galleryForm.featuredMoments.journalStatus || "Guest Journal Open"}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {galleryForm.featuredMoments.journalSubtext || "Be featured in our stories"}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#F59E0B] text-[#0B3D5E] font-black text-xs uppercase tracking-wider shadow-md">
                            <Plus className="w-3.5 h-3.5 stroke-[3]" />
                            <span>{galleryForm.featuredMoments.shareCtaText || "Share Your Memory"}</span>
                          </div>
                        </div>
                      </div>

                      {/* The 3 Video Cards Preview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 pt-2 pb-6 relative z-10">
                        {galleryForm.featuredMoments.videos.map((item, i) => (
                          <div
                            key={item.id || i}
                            className={`relative ${i === 1 ? 'md:translate-y-4' : 'md:-translate-y-3'} transition-transform duration-500`}
                          >
                            <div className="group relative aspect-[3/4] sm:aspect-[9/13] rounded-[2rem] overflow-hidden cursor-pointer bg-slate-950 border-2 border-white/80 shadow-xl flex flex-col justify-end">
                              {/* Video */}
                              <div className="absolute inset-0 overflow-hidden bg-slate-950">
                                <video
                                  src={item.url}
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLVideoElement).src = DEFAULT_GALLERY_SETTINGS.featuredMoments.videos[i].url;
                                  }}
                                />
                              </div>

                              {/* Cinematic Gradient Overlays */}
                              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                              {/* Bottom Content Plaque */}
                              <div className="relative z-10 p-4 sm:p-5 text-left">
                                <div className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-[0.2em] text-[#FBBF24] mb-1">
                                  <MapPin className="w-3 h-3 text-[#FBBF24]" />
                                  <span>{item.location || "Weligama Bay Waters"}</span>
                                </div>
                                <h4 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight mb-1 tracking-tight">
                                  {item.caption || "Featured Moment"}
                                </h4>
                                <p className="text-[11px] text-white/85 font-normal leading-relaxed line-clamp-2">
                                  {item.subtitle}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === "about" ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {/* SECTION 1: ABOUT HERO & ISLAND HERITAGE DOCK */}
              <div className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0B3D5E]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <Compass className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 1</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Our Story &amp; Island Heritage Hero
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Customize the main heritage greeting, narrative copy, local ownership badges, micro-perks dock, and cinematic background video.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset Defaults</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        data-testid="button-save-about-settings"
                        className={`rounded-xl text-xs font-semibold gap-1.5 shadow-md transition-all ${isAboutSavedRecently
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-[#0B3D5E] hover:bg-[#08293f] text-white shadow-[#0B3D5E]/20"
                          }`}
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save About Settings</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* FORM FIELDS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: HERO HEADLINE & BADGES */}
                    <div className="space-y-6">
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Crown className="w-4 h-4 text-[#FBBF24]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Hero Eyebrow &amp; Story Headline
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Eyebrow Badge Text
                          </label>
                          <input
                            type="text"
                            value={aboutForm.hero.badge}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, badge: e.target.value },
                              }))
                            }
                            data-testid="input-about-hero-badge"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Authentic Island Heritage • 100% Locally Owned"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Lead (White Serif)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.headingLead}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, headingLead: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-lead"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Our Story &"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Highlight (Amber Gold)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.headingHighlight}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, headingHighlight: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-highlight"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Heritage"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Hero Story Narrative / Subtitle
                          </label>
                          <textarea
                            rows={3}
                            value={aboutForm.hero.subtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, subtitle: e.target.value },
                              }))
                            }
                            data-testid="input-about-hero-subtitle"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition leading-relaxed"
                            placeholder="Welcome to Ocean Air — your locally owned coastal sanctuary in Weligama Bay..."
                          />
                        </div>
                      </div>

                      {/* HERITAGE BADGES & CTA */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Award className="w-4 h-4 text-[#FBBF24]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Heritage Badges &amp; Action CTA
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Heritage Badge 1
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.badge1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, badge1: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-badge1"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="100% Locally Owned & Operated"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Heritage Badge 2
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.badge2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, badge2: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-badge2"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="100 Steps to Weligama Beach"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Primary CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={aboutForm.hero.ctaText}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, ctaText: e.target.value },
                              }))
                            }
                            data-testid="input-about-hero-cta"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Explore Our Story"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: MICRO-PERKS DOCK & MEDIA */}
                    <div className="space-y-6">
                      {/* MICRO-PERKS DOCK (4 ITEMS) */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Waves className="w-4 h-4 text-[#FBBF24]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Island Heritage Micro-Perks Dock (4 Items)
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <Award className="w-3.5 h-3.5 text-[#FBBF24]" />
                              <span>Perk 1 (Ownership)</span>
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.perk1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, perk1: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-perk1"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="100% Locally Owned"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <Waves className="w-3.5 h-3.5 text-[#FBBF24]" />
                              <span>Perk 2 (Surf Proximity)</span>
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.perk2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, perk2: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-perk2"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="3-Min Walk to Surf Break"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                              <span>Perk 3 (Hospitality)</span>
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.perk3}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, perk3: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-perk3"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="Warm Family Hospitality"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <Sunset className="w-3.5 h-3.5 text-amber-500" />
                              <span>Perk 4 (Rooftop &amp; Vibe)</span>
                            </label>
                            <input
                              type="text"
                              value={aboutForm.hero.perk4}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, perk4: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-perk4"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="Rooftop Yoga & Sunsets"
                            />
                          </div>
                        </div>
                      </div>

                      {/* HERO MEDIA CONTROLS */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Video className="w-4 h-4 text-[#0B3D5E]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Hero Background Video &amp; Poster Media
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Background Video URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={aboutForm.hero.videoUrl}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, videoUrl: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-video-url"
                              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="/videos/about-hero-video.mp4"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition">
                              {isUploadingAboutVideo ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleAboutVideoUpload}
                                disabled={isUploadingAboutVideo}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Poster / Fallback Image URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={aboutForm.hero.poster}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, poster: e.target.value },
                                }))
                              }
                              data-testid="input-about-hero-poster-url"
                              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="/images/about-hero-poster.jpg"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition">
                              {isUploadingAboutPoster ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleAboutPosterUpload}
                                disabled={isUploadingAboutPoster}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF ABOUT HERO */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#FBBF24]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E] uppercase tracking-wider">
                          Real-Time Live Hero &amp; Heritage Dock Preview
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Mirrors public About page header &amp; reassurance dock
                      </span>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-[#052439] text-white min-h-[480px] flex flex-col justify-between p-6 sm:p-10">
                      {/* Background Media */}
                      {aboutForm.hero.videoUrl ? (
                        <video
                          key={aboutForm.hero.videoUrl}
                          src={aboutForm.hero.videoUrl}
                          poster={aboutForm.hero.poster}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      ) : (
                        <img
                          src={aboutForm.hero.poster || "/images/about-hero-poster.jpg"}
                          alt="About Hero Background"
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      )}

                      {/* Luxury Dark Ocean Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/80 via-[#0B3D5E]/50 to-[#052439]/95 pointer-events-none" />
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-[#FBBF24]/20 rounded-full blur-[100px] pointer-events-none" />

                      {/* Hero Content */}
                      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto pt-4 sm:pt-6 space-y-4">
                        {/* Eyebrow Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/50 text-[#FBBF24] text-xs font-semibold uppercase tracking-[0.2em] shadow-lg">
                          <Waves className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>{aboutForm.hero.badge}</span>
                        </div>

                        {/* Grand Serif Headline */}
                        <h2 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight leading-tight">
                          {aboutForm.hero.headingLead}{" "}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FDE68A] to-[#F59E0B]">
                            {aboutForm.hero.headingHighlight}
                          </span>
                        </h2>

                        {/* Narrative Subtitle */}
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal max-w-xl">
                          {aboutForm.hero.subtitle}
                        </p>

                        {/* Badges Pill */}
                        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white/90 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#FBBF24]" />
                            {aboutForm.hero.badge1}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FBBF24]" />
                            {aboutForm.hero.badge2}
                          </span>
                        </div>

                        {/* Action CTA */}
                        <div className="pt-2">
                          <div className="px-7 py-3 rounded-full bg-[#FBBF24] text-[#0B3D5E] text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg shadow-[#FBBF24]/30 inline-flex items-center gap-2">
                            <span>{aboutForm.hero.ctaText}</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Micro-Perks Dock / Heritage Bar */}
                      <div className="relative z-10 mt-8">
                        <div className="max-w-3xl mx-auto rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 p-2 sm:p-2.5 flex flex-wrap items-center justify-around gap-2 text-white text-xs font-semibold">
                          <div className="flex items-center gap-2 px-3 py-1">
                            <Award className="w-4 h-4 text-[#FBBF24]" />
                            <span>{aboutForm.hero.perk1}</span>
                          </div>
                          <div className="hidden sm:block w-px h-4 bg-white/20" />
                          <div className="flex items-center gap-2 px-3 py-1">
                            <Waves className="w-4 h-4 text-[#FBBF24]" />
                            <span>{aboutForm.hero.perk2}</span>
                          </div>
                          <div className="hidden md:block w-px h-4 bg-white/20" />
                          <div className="flex items-center gap-2 px-3 py-1">
                            <Heart className="w-4 h-4 text-[#FBBF24]" />
                            <span>{aboutForm.hero.perk3}</span>
                          </div>
                          <div className="hidden lg:block w-px h-4 bg-white/20" />
                          <div className="flex items-center gap-2 px-3 py-1">
                            <Sunset className="w-4 h-4 text-[#FBBF24]" />
                            <span>{aboutForm.hero.perk4}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: OUR STORY NARRATIVE & NEIGHBORHOOD GUIDE */}
              <div className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FBBF24]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#0B3D5E]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 2</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Our Story Narrative &amp; Neighborhood Guide
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically customize the story headline, editorial narrative, psychological highlight badges, host monogram, and the "Explore the Neighborhood" interactive guide card.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutStoryDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset Section Defaults</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        data-testid="button-save-about-story"
                        className={`rounded-xl text-xs font-semibold gap-1.5 shadow-md transition-all ${isAboutStorySavedRecently
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-[#0B3D5E] hover:bg-[#08293f] text-white shadow-[#0B3D5E]/20"
                          }`}
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutStorySavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Story &amp; Neighborhood</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* FORM FIELDS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: EDITORIAL NARRATIVE & HIGHLIGHTS */}
                    <div className="space-y-6">
                      {/* Eyebrow & Two-Tone Headline */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Compass className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Story Eyebrow &amp; Two-Tone Serif Headline
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Eyebrow Badge Text
                          </label>
                          <input
                            type="text"
                            value={aboutForm.story.badge}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                story: { ...prev.story, badge: e.target.value },
                              }))
                            }
                            data-testid="input-about-story-badge"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="The Weligama Spirit"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Lead (Navy Serif)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.story.headingLead}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, headingLead: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-heading-lead"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Where Sand, Surf,"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Highlight (Amber Gradient)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.story.headingHighlight}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, headingHighlight: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-heading-highlight"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="& Local Vibe Connect"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Editorial Narrative Paragraphs */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <BookOpen className="w-4 h-4 text-[#0B3D5E]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Narrative Story (2 Distinct Editorial Paragraphs)
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Paragraph 1 (Coastal Sanctuary &amp; Waves Lead)
                          </label>
                          <textarea
                            rows={3}
                            value={aboutForm.story.paragraph1}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                story: { ...prev.story, paragraph1: e.target.value },
                              }))
                            }
                            data-testid="textarea-about-story-p1"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition resize-y leading-relaxed"
                            placeholder="Located in a peaceful Sri Lankan coastal enclave just a gentle stroll..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Paragraph 2 (Village Paths &amp; Artisan Cafés Detail)
                          </label>
                          <textarea
                            rows={4}
                            value={aboutForm.story.paragraph2}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                story: { ...prev.story, paragraph2: e.target.value },
                              }))
                            }
                            data-testid="textarea-about-story-p2"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition resize-y leading-relaxed"
                            placeholder="Nestled along quiet village pathways away from the bustling main road noise..."
                          />
                        </div>
                      </div>

                      {/* Micro-Feature Highlight Badges */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Waves className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Micro-Highlight Cards (2 Badges)
                          </h4>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-slate-200/70 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center font-bold text-xs">
                              1
                            </span>
                            <span className="text-xs font-bold text-[#0B3D5E]">Highlight Card 1 (Beach Access)</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Title</label>
                              <input
                                type="text"
                                value={aboutForm.story.highlight1Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, highlight1Title: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-hl1-title"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="3-Min Beach Walk"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subtitle</label>
                              <input
                                type="text"
                                value={aboutForm.story.highlight1Subtitle}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, highlight1Subtitle: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-hl1-subtitle"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="Step directly onto gentle sand-bottom surf breaks."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white border border-slate-200/70 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#0B3D5E]/10 text-[#0B3D5E] flex items-center justify-center font-bold text-xs">
                              2
                            </span>
                            <span className="text-xs font-bold text-[#0B3D5E]">Highlight Card 2 (Family Hospitality)</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Title</label>
                              <input
                                type="text"
                                value={aboutForm.story.highlight2Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, highlight2Title: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-hl2-title"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="Family Owned & Run"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subtitle</label>
                              <input
                                type="text"
                                value={aboutForm.story.highlight2Subtitle}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, highlight2Subtitle: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-hl2-subtitle"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="Authentic Sri Lankan hospitality, always personal."
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA & Host Monogram Details */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Heart className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Action Button &amp; Host Signature Monogram
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              CTA Button Label
                            </label>
                            <input
                              type="text"
                              value={aboutForm.story.ctaText}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, ctaText: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-cta-text"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Plan Your Stay"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Host Avatar Initials (Monogram)
                            </label>
                            <input
                              type="text"
                              maxLength={4}
                              value={aboutForm.story.authorInitials}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, authorInitials: e.target.value.toUpperCase() },
                                }))
                              }
                              data-testid="input-about-story-author-initials"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition uppercase font-bold"
                              placeholder="OA"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Host / Team Name
                            </label>
                            <input
                              type="text"
                              value={aboutForm.story.authorName}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, authorName: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-author-name"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Ocean Air Family Team"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Host Location Subtitle
                            </label>
                            <input
                              type="text"
                              value={aboutForm.story.authorLocation}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, authorLocation: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-author-location"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Weligama, Sri Lanka"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: EXPLORE THE NEIGHBORHOOD GUIDE CARD */}
                    <div className="space-y-6">
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Map className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Neighborhood Guide Card Header
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={aboutForm.story.neighborhoodTitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                story: { ...prev.story, neighborhoodTitle: e.target.value },
                              }))
                            }
                            data-testid="input-about-story-neighborhood-title"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Explore the Neighborhood"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Card Subtitle / Prompt
                          </label>
                          <input
                            type="text"
                            value={aboutForm.story.neighborhoodSubtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                story: { ...prev.story, neighborhoodSubtitle: e.target.value },
                              }))
                            }
                            data-testid="input-about-story-neighborhood-subtitle"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Hover or tap on any destination below to discover what surrounds our peaceful tropical escape:"
                          />
                        </div>
                      </div>

                      {/* Destination Spots 1 - 4 */}
                      <div className="space-y-4">
                        {/* SPOT 1 */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center">
                                <Waves className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-[#0B3D5E]">Destination 1: Beach Access</span>
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Spot #1</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Name</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot1Name}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot1Name: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot1-name"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="Weligama Beach"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Walking Distance / Timing</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot1Distance}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot1Distance: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot1-distance"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="3 min walk"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expanded Description</label>
                            <textarea
                              rows={2}
                              value={aboutForm.story.spot1Details}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, spot1Details: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-spot1-details"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E] resize-y"
                              placeholder="The perfect golden stretch of sand for surfers of all levels..."
                            />
                          </div>
                        </div>

                        {/* SPOT 2 */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#0B3D5E]/10 text-[#0B3D5E] flex items-center justify-center">
                                <Coffee className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-[#0B3D5E]">Destination 2: Dining &amp; Cafés</span>
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Spot #2</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Name</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot2Name}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot2Name: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot2-name"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="Cafés & Restaurants"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Walking Distance / Timing</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot2Distance}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot2Distance: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot2-distance"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="1-5 min walk"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expanded Description</label>
                            <textarea
                              rows={2}
                              value={aboutForm.story.spot2Details}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, spot2Details: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-spot2-details"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E] resize-y"
                              placeholder="A food lover's paradise. Stroll to a variety of highly rated spots..."
                            />
                          </div>
                        </div>

                        {/* SPOT 3 */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-[#0B3D5E]">Destination 3: Village Life</span>
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Spot #3</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Name</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot3Name}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot3Name: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot3-name"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="Sri Lankan Village Life"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Walking Distance / Timing</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot3Distance}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot3Distance: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot3-distance"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="On your doorstep"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expanded Description</label>
                            <textarea
                              rows={2}
                              value={aboutForm.story.spot3Details}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, spot3Details: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-spot3-details"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E] resize-y"
                              placeholder="Quiet, peaceful paths away from the bustling main road noise. Walk among swaying coconut trees..."
                            />
                          </div>
                        </div>

                        {/* SPOT 4 */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                                <Compass className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-bold text-[#0B3D5E]">Destination 4: Surf Breaks &amp; Points</span>
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Spot #4</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Name</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot4Name}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot4Name: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot4-name"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="Surf Breaks & Points"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Walking Distance / Timing</label>
                              <input
                                type="text"
                                value={aboutForm.story.spot4Distance}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    story: { ...prev.story, spot4Distance: e.target.value },
                                  }))
                                }
                                data-testid="input-about-story-spot4-distance"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                placeholder="3 min walk"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expanded Description</label>
                            <textarea
                              rows={2}
                              value={aboutForm.story.spot4Details}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  story: { ...prev.story, spot4Details: e.target.value },
                                }))
                              }
                              data-testid="input-about-story-spot4-details"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E] resize-y"
                              placeholder="Immediate access to local breaks. Whether you're catching your very first wave..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 2 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Editorial &amp; Neighborhood Card Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-[#D97706] bg-[#FBBF24]/10 border border-[#FBBF24]/30 px-2.5 py-0.5 rounded-full">
                        ✨ Synchronized Live with Form
                      </span>
                    </div>

                    {/* Preview Canvas mirroring public About Page Section 2 */}
                    <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F4F9FC] border border-slate-200 shadow-inner overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
                        {/* LEFT COLUMN PREVIEW */}
                        <div className="space-y-6">
                          {/* Eyebrow Badge */}
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] text-xs font-black uppercase tracking-widest shadow-2xs">
                            <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>{aboutForm.story.badge}</span>
                          </div>

                          {/* Headline */}
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] leading-[1.15] tracking-tight">
                            <span className="block">{aboutForm.story.headingLead}</span>
                            <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]">
                              {aboutForm.story.headingHighlight}
                            </span>
                          </h2>

                          {/* Paragraphs */}
                          <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                            <p className="text-[#0B3D5E] font-medium leading-relaxed whitespace-pre-line">
                              {aboutForm.story.paragraph1}
                            </p>
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                              {aboutForm.story.paragraph2}
                            </p>
                          </div>

                          {/* Highlights Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                              <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center shrink-0 text-[#D97706]">
                                <Waves className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[#0B3D5E] block">{aboutForm.story.highlight1Title}</span>
                                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{aboutForm.story.highlight1Subtitle}</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                              <div className="w-8 h-8 rounded-xl bg-[#0B3D5E]/10 border border-[#0B3D5E]/20 flex items-center justify-center shrink-0 text-[#0B3D5E]">
                                <Heart className="w-4 h-4 text-[#D97706]" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-[#0B3D5E] block">{aboutForm.story.highlight2Title}</span>
                                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{aboutForm.story.highlight2Subtitle}</span>
                              </div>
                            </div>
                          </div>

                          {/* CTA & Host Monogram */}
                          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <button
                              type="button"
                              className="px-6 py-3 rounded-full bg-[#0B3D5E] text-white font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md hover:bg-[#08293f] transition"
                            >
                              <span>{aboutForm.story.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#FBBF24]" />
                            </button>

                            <div className="flex items-center gap-3 pl-1 sm:border-l sm:border-slate-200 sm:pl-4">
                              <div className="w-9 h-9 rounded-full bg-[#0B3D5E] text-[#FBBF24] flex items-center justify-center font-serif font-black text-xs shadow-xs border border-white">
                                {aboutForm.story.authorInitials}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-serif font-bold text-[#0B3D5E] text-xs leading-tight">
                                  {aboutForm.story.authorName}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest text-[#D97706] font-black mt-0.5">
                                  {aboutForm.story.authorLocation}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN PREVIEW: NEIGHBORHOOD CARD */}
                        <div className="relative p-6 sm:p-7 rounded-[2rem] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_20px_50px_-15px_rgba(11,61,94,0.1),0_0_0_1px_rgba(251,191,36,0.25)] overflow-hidden">
                          {/* Ambient golden and sky blur */}
                          <div className="absolute top-0 right-0 w-36 h-36 bg-[#FBBF24]/15 blur-2xl rounded-full pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-36 h-36 bg-sky-200/25 blur-2xl rounded-full pointer-events-none" />

                          <div className="relative z-10 flex items-center gap-2.5 mb-1.5">
                            <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#D97706] shadow-2xs">
                              <Map className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-black text-[#0B3D5E]">
                              {aboutForm.story.neighborhoodTitle}
                            </h3>
                          </div>
                          <p className="relative z-10 text-xs text-slate-500 mb-4 font-normal leading-relaxed">
                            {aboutForm.story.neighborhoodSubtitle}
                          </p>

                          {/* 4 Interactive Spots */}
                          <div className="space-y-2.5 relative z-10">
                            {[
                              {
                                id: "beach",
                                name: aboutForm.story.spot1Name,
                                distance: aboutForm.story.spot1Distance,
                                icon: Waves,
                                details: aboutForm.story.spot1Details,
                              },
                              {
                                id: "dining",
                                name: aboutForm.story.spot2Name,
                                distance: aboutForm.story.spot2Distance,
                                icon: Coffee,
                                details: aboutForm.story.spot2Details,
                              },
                              {
                                id: "village",
                                name: aboutForm.story.spot3Name,
                                distance: aboutForm.story.spot3Distance,
                                icon: MapPin,
                                details: aboutForm.story.spot3Details,
                              },
                              {
                                id: "surf",
                                name: aboutForm.story.spot4Name,
                                distance: aboutForm.story.spot4Distance,
                                icon: Compass,
                                details: aboutForm.story.spot4Details,
                              },
                            ].map((spot) => {
                              const Icon = spot.icon;
                              const isHovered = previewAboutSpotHover === spot.id;
                              return (
                                <div
                                  key={spot.id}
                                  onClick={() =>
                                    setPreviewAboutSpotHover(previewAboutSpotHover === spot.id ? null : spot.id)
                                  }
                                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isHovered
                                      ? "bg-white border-[#FBBF24]/80 shadow-sm"
                                      : "bg-white/85 border-slate-200/70 hover:bg-white hover:border-[#FBBF24]/50"
                                    }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isHovered
                                            ? "bg-[#0B3D5E] text-[#FBBF24]"
                                            : "bg-slate-100 text-[#0B3D5E]"
                                          }`}
                                      >
                                        <Icon className="w-4 h-4" />
                                      </div>
                                      <div>
                                        <h5
                                          className={`text-xs font-bold ${isHovered ? "text-[#0B3D5E]" : "text-slate-800"
                                            }`}
                                        >
                                          {spot.name}
                                        </h5>
                                        <p className="text-[9px] text-[#D97706] font-black tracking-wider uppercase">
                                          {spot.distance}
                                        </p>
                                      </div>
                                    </div>
                                    <ChevronRight
                                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isHovered ? "rotate-90 text-[#D97706]" : ""
                                        }`}
                                    />
                                  </div>
                                  {isHovered && (
                                    <p className="text-[11px] text-slate-600 mt-2.5 pt-2.5 border-t border-slate-100 leading-relaxed font-normal">
                                      {spot.details}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: AT YOUR OWN PACE • EXPERIENCE BUILDER & TAILORED STAY */}
              <div className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FBBF24]/10 via-[#0B3D5E]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#0B3D5E]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <Layers className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 3</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Experience Builder &amp; Tailored Stay Concierge
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically customize the "Sri Lanka, At Your Own Pace" headline, reassuring trust pills, add-ons list &amp; items, and the "Your Tailored Stay" concierge guide with live preview.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        data-testid="button-reset-about-experience"
                        onClick={handleResetAboutExperienceDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset Section Defaults</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        data-testid="button-save-about-experience"
                        className={`rounded-xl text-xs font-semibold gap-1.5 shadow-md transition-all ${isAboutExperienceSavedRecently
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-[#0B3D5E] hover:bg-[#08293f] text-white shadow-[#0B3D5E]/20"
                          }`}
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutExperienceSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Experience Settings</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* FORM FIELDS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: HERO HEADLINE, PILLS & ADD-ONS */}
                    <div className="space-y-6">
                      {/* Eyebrow & Two-Tone Headline */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Compass className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Section Eyebrow &amp; Two-Tone Serif Headline
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Eyebrow Badge Text
                          </label>
                          <input
                            type="text"
                            value={aboutForm.experience.badge}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                experience: { ...prev.experience, badge: e.target.value },
                              }))
                            }
                            data-testid="input-about-exp-badge"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Tailored Travel Styles"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Lead (Navy Bold)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.headingLead}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, headingLead: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-heading-lead"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Sri Lanka,"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Highlight (Amber Gradient)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.headingHighlight}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, headingHighlight: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-heading-highlight"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="At Your Own Pace"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Narrative Subtitle / Description
                          </label>
                          <textarea
                            rows={3}
                            value={aboutForm.experience.subtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                experience: { ...prev.experience, subtitle: e.target.value },
                              }))
                            }
                            data-testid="textarea-about-exp-subtitle"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition resize-y leading-relaxed"
                            placeholder="More than accommodation—your southern escape shaped around your personal rhythm..."
                          />
                        </div>
                      </div>

                      {/* Reassurance Trust Pills */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Clock className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Reassurance Trust Pills (3 Pills)
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Pill 1 (Schedules)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.pill1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, pill1: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-pill1"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="Zero Strict Schedules"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Pill 2 (Booking)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.pill2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, pill2: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-pill2"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="Book Now or On Arrival"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Pill 3 (Local Masters)
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.pill3}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, pill3: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-pill3"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="100% Curated Local Masters"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Custom Add-Ons Section Header */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Layers className="w-4 h-4 text-[#0B3D5E]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Add-Ons List Header &amp; Counter Badge
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Section Title
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.addOnsTitle}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, addOnsTitle: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-addons-title"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="Our Custom Add-Ons"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Counter Badge
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.addOnsBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, addOnsBadge: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-addons-badge"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="7 Experiences"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Section Subtitle / Prompt
                          </label>
                          <input
                            type="text"
                            value={aboutForm.experience.addOnsSubtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                experience: { ...prev.experience, addOnsSubtitle: e.target.value },
                              }))
                            }
                            data-testid="input-about-exp-addons-subtitle"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                            placeholder="Select or mix any experiences during your stay"
                          />
                        </div>
                      </div>

                      {/* 7 Experience Items Configuration */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Award className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            7 Add-On Experience Items
                          </h4>
                        </div>

                        <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                          {[
                            { num: 1, key: "exp1", name: aboutForm.experience.exp1Name, cat: aboutForm.experience.exp1Category, desc: aboutForm.experience.exp1Desc, icon: Award },
                            { num: 2, key: "exp2", name: aboutForm.experience.exp2Name, cat: aboutForm.experience.exp2Category, desc: aboutForm.experience.exp2Desc, icon: Sun },
                            { num: 3, key: "exp3", name: aboutForm.experience.exp3Name, cat: aboutForm.experience.exp3Category, desc: aboutForm.experience.exp3Desc, icon: Waves },
                            { num: 4, key: "exp4", name: aboutForm.experience.exp4Name, cat: aboutForm.experience.exp4Category, desc: aboutForm.experience.exp4Desc, icon: Ship },
                            { num: 5, key: "exp5", name: aboutForm.experience.exp5Name, cat: aboutForm.experience.exp5Category, desc: aboutForm.experience.exp5Desc, icon: Compass },
                            { num: 6, key: "exp6", name: aboutForm.experience.exp6Name, cat: aboutForm.experience.exp6Category, desc: aboutForm.experience.exp6Desc, icon: Utensils },
                            { num: 7, key: "exp7", name: aboutForm.experience.exp7Name, cat: aboutForm.experience.exp7Category, desc: aboutForm.experience.exp7Desc, icon: Bike },
                          ].map((exp) => {
                            const Icon = exp.icon;
                            return (
                              <div key={exp.num} className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center">
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-[#0B3D5E]">Experience #{exp.num}</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Title</label>
                                    <input
                                      type="text"
                                      value={exp.name}
                                      onChange={(e) =>
                                        setAboutForm((prev) => ({
                                          ...prev,
                                          experience: { ...prev.experience, [`${exp.key}Name`]: e.target.value } as any,
                                        }))
                                      }
                                      data-testid={`input-about-${exp.key}-name`}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Category</label>
                                    <input
                                      type="text"
                                      value={exp.cat}
                                      onChange={(e) =>
                                        setAboutForm((prev) => ({
                                          ...prev,
                                          experience: { ...prev.experience, [`${exp.key}Category`]: e.target.value } as any,
                                        }))
                                      }
                                      data-testid={`input-about-${exp.key}-category`}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Description</label>
                                  <input
                                    type="text"
                                    value={exp.desc}
                                    onChange={(e) =>
                                      setAboutForm((prev) => ({
                                        ...prev,
                                        experience: { ...prev.experience, [`${exp.key}Desc`]: e.target.value } as any,
                                      }))
                                    }
                                    data-testid={`input-about-${exp.key}-desc`}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: TAILORED STAY SIDEBAR, BENEFITS & CTA */}
                    <div className="space-y-6">
                      {/* Tailored Stay Header & Narrative */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Compass className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Tailored Stay Sidebar Card Header
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Sidebar Card Title
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.tailoredTitle}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, tailoredTitle: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-tailored-title"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Your Tailored Stay"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Sidebar Card Eyebrow
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.tailoredEyebrow}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, tailoredEyebrow: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-tailored-eyebrow"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Bespoke Coastal Concierge"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Sidebar Concierge Description
                          </label>
                          <textarea
                            rows={3}
                            value={aboutForm.experience.tailoredDesc}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                experience: { ...prev.experience, tailoredDesc: e.target.value },
                              }))
                            }
                            data-testid="textarea-about-exp-tailored-desc"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition resize-y leading-relaxed"
                            placeholder="Design an island itinerary as spontaneous or structured as you like..."
                          />
                        </div>
                      </div>

                      {/* 4 Psychological Benefits Checklist */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Check className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            4 Psychological Benefits Checklist
                          </h4>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Benefit 1
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.benefit1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, benefit1: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-benefit1"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="Add during booking or upon arrival"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Benefit 2
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.benefit2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, benefit2: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-benefit2"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="Zero strict schedules — enjoy at your pace"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Benefit 3
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.benefit3}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, benefit3: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-benefit3"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="Premium surfboards & rooftop mats included"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Benefit 4
                            </label>
                            <input
                              type="text"
                              value={aboutForm.experience.benefit4}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  experience: { ...prev.experience, benefit4: e.target.value },
                                }))
                              }
                              data-testid="input-about-exp-benefit4"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs focus:ring-1 focus:ring-[#0B3D5E]"
                              placeholder="100% risk-free: modify or cancel anytime"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Unrestricted Flexibility Callout & CTA */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <CalendarDays className="w-4 h-4 text-[#D97706]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Duration Freedom Banner &amp; CTA
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Freedom Banner Title
                          </label>
                          <input
                            type="text"
                            value={aboutForm.experience.freedomTitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                experience: { ...prev.experience, freedomTitle: e.target.value },
                              }))
                            }
                            data-testid="input-about-exp-freedom-title"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Unrestricted Duration Freedom"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Freedom Banner Description
                          </label>
                          <textarea
                            rows={2}
                            value={aboutForm.experience.freedomText}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                experience: { ...prev.experience, freedomText: e.target.value },
                              }))
                            }
                            data-testid="textarea-about-exp-freedom-text"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition resize-y leading-relaxed"
                            placeholder="Stay 2 nights or 2 weeks. Custom build an authentic coastal stay that matches your personal budget and rhythm."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={aboutForm.experience.ctaText}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                experience: { ...prev.experience, ctaText: e.target.value },
                              }))
                            }
                            data-testid="input-about-exp-cta-text"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Explore Curated Packages"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 3 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Experience Builder &amp; Tailored Stay Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-[#D97706] bg-[#FBBF24]/10 border border-[#FBBF24]/30 px-2.5 py-0.5 rounded-full">
                        ✨ Synchronized Live with Form
                      </span>
                    </div>

                    {/* Preview Canvas */}
                    <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#FAF8F5] via-[#F4F9FC] to-[#EEF5FA] border border-slate-200 shadow-inner overflow-hidden">
                      {/* Top Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#FBBF24]/50 shadow-2xs mb-3">
                          <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
                            {aboutForm.experience.badge}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight leading-tight">
                          <span>{aboutForm.experience.headingLead}</span>{" "}
                          <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]">
                            {aboutForm.experience.headingHighlight}
                          </span>
                        </h2>

                        <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-normal whitespace-pre-line">
                          {aboutForm.experience.subtitle}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                            <span>{aboutForm.experience.pill1}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                            <Waves className="w-3.5 h-3.5 text-[#0B3D5E]" />
                            <span>{aboutForm.experience.pill2}</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                            <BadgeCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>{aboutForm.experience.pill3}</span>
                          </div>
                        </div>
                      </div>

                      {/* 2-Column Content Layout */}
                      <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Add-ons preview */}
                        <div className="lg:col-span-7 space-y-3">
                          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/70">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center">
                                <Layers className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-serif font-bold text-[#0B3D5E]">
                                  {aboutForm.experience.addOnsTitle}
                                </h4>
                                <p className="text-[10px] text-slate-500">
                                  {aboutForm.experience.addOnsSubtitle}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706] bg-[#FBBF24]/15 border border-[#FBBF24]/30 px-2.5 py-0.5 rounded-full">
                              {aboutForm.experience.addOnsBadge}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {[
                              { num: 1, name: aboutForm.experience.exp1Name, cat: aboutForm.experience.exp1Category, desc: aboutForm.experience.exp1Desc, icon: Award },
                              { num: 2, name: aboutForm.experience.exp2Name, cat: aboutForm.experience.exp2Category, desc: aboutForm.experience.exp2Desc, icon: Sun },
                              { num: 3, name: aboutForm.experience.exp3Name, cat: aboutForm.experience.exp3Category, desc: aboutForm.experience.exp3Desc, icon: Waves },
                              { num: 4, name: aboutForm.experience.exp4Name, cat: aboutForm.experience.exp4Category, desc: aboutForm.experience.exp4Desc, icon: Ship },
                            ].map((exp) => {
                              const Icon = exp.icon;
                              return (
                                <div key={exp.num} className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#FBBF24]/15 text-[#0B3D5E] flex items-center justify-center shrink-0">
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-serif font-bold text-xs text-[#0B3D5E]">{exp.name}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-50 text-[#D97706] border border-amber-200/60">{exp.cat}</span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 line-clamp-1">{exp.desc}</p>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right: Tailored Stay Sidebar preview */}
                        <div className="lg:col-span-5">
                          <div className="rounded-2xl p-5 bg-white/95 border border-white shadow-lg space-y-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center shrink-0">
                                <Compass className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-base font-serif font-bold text-[#0B3D5E]">
                                  {aboutForm.experience.tailoredTitle}
                                </h4>
                                <p className="text-[10px] text-[#D97706] font-bold uppercase tracking-wider">
                                  {aboutForm.experience.tailoredEyebrow}
                                </p>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                              {aboutForm.experience.tailoredDesc}
                            </p>

                            <div className="border-t border-slate-100 pt-3 space-y-2">
                              {[
                                aboutForm.experience.benefit1,
                                aboutForm.experience.benefit2,
                                aboutForm.experience.benefit3,
                                aboutForm.experience.benefit4,
                              ].map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                                  <div className="w-4 h-4 rounded-full bg-[#FBBF24]/20 text-[#D97706] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3" />
                                  </div>
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>

                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-xl border border-[#FBBF24]/30 text-xs">
                              <div className="flex items-start gap-2">
                                <CalendarDays className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-[#0B3D5E] block text-xs">
                                    {aboutForm.experience.freedomTitle}
                                  </span>
                                  <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                                    {aboutForm.experience.freedomText}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="w-full py-2.5 px-4 rounded-full bg-[#0B3D5E] text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:bg-[#08293f] transition"
                            >
                              <span>{aboutForm.experience.ctaText}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#FBBF24]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* SECTION 4: SLEEP & SANCTUARY • ACCOMMODATIONS & BUDGET SWITCHER */}
              <div className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0B3D5E]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <BedDouble className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Section 4 • Room Sanctuary &amp; Budget Switcher</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Designed For Every Stay &amp; Budget
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Configure the dual-tab room showcase: Basic Private Room vs Deluxe Double Ocean View, including headlines, descriptions, amenities, and imagery.
                      </p>
                    </div>

                    {/* Action Buttons: Reset & Save */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        data-testid="button-reset-about-sanctuary"
                        onClick={handleResetAboutSanctuaryDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset Section Defaults</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        data-testid="button-save-about-sanctuary"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        className="rounded-xl bg-gradient-to-r from-[#0B3D5E] to-[#124e78] text-white hover:opacity-95 shadow-md shadow-[#0B3D5E]/15 text-xs font-semibold gap-1.5 px-4"
                      >
                        {updateSetting.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : isAboutSanctuarySavedRecently ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isAboutSanctuarySavedRecently ? "Saved!" : "Save Room Switcher"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* SECTION-LEVEL HEADLINE & TAB LABELS */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Eyebrow Badge
                      </label>
                      <Input
                        type="text"
                        data-testid="input-about-sanc-badge"
                        value={aboutForm.sanctuary.badge}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            sanctuary: { ...prev.sanctuary, badge: e.target.value },
                          }))
                        }
                        placeholder="Sleep & Sanctuary"
                        className="rounded-xl bg-white border-slate-200"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Heading Lead (Navy)
                      </label>
                      <Input
                        type="text"
                        data-testid="input-about-sanc-heading-lead"
                        value={aboutForm.sanctuary.headingLead}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            sanctuary: { ...prev.sanctuary, headingLead: e.target.value },
                          }))
                        }
                        placeholder="Designed For"
                        className="rounded-xl bg-white border-slate-200 font-semibold text-[#0B3D5E]"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Heading Highlight (Amber Gradient)
                      </label>
                      <Input
                        type="text"
                        data-testid="input-about-sanc-heading-highlight"
                        value={aboutForm.sanctuary.headingHighlight}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            sanctuary: { ...prev.sanctuary, headingHighlight: e.target.value },
                          }))
                        }
                        placeholder="Every Stay & Budget"
                        className="rounded-xl bg-white border-slate-200 font-serif italic text-[#D97706]"
                      />
                    </div>

                    <div className="md:col-span-6">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tab 1 Label (Basic)
                      </label>
                      <Input
                        type="text"
                        data-testid="input-about-sanc-tab1-label"
                        value={aboutForm.sanctuary.tab1Label}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            sanctuary: { ...prev.sanctuary, tab1Label: e.target.value },
                          }))
                        }
                        placeholder="Basic Private Room"
                        className="rounded-xl bg-white border-slate-200"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tab 2 Label (Deluxe)
                      </label>
                      <Input
                        type="text"
                        data-testid="input-about-sanc-tab2-label"
                        value={aboutForm.sanctuary.tab2Label}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            sanctuary: { ...prev.sanctuary, tab2Label: e.target.value },
                          }))
                        }
                        placeholder="Deluxe Double (Ocean View)"
                        className="rounded-xl bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  {/* ADMIN TAB SWITCHER FOR EDITING */}
                  <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 max-w-md">
                    <button
                      type="button"
                      data-testid="admin-room-tab-basic"
                      onClick={() => setAdminActiveRoomTab("basic")}
                      className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminActiveRoomTab === "basic"
                          ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      {aboutForm.sanctuary.tab1Label || "Basic Private Room"}
                    </button>
                    <button
                      type="button"
                      data-testid="admin-room-tab-deluxe"
                      onClick={() => setAdminActiveRoomTab("deluxe")}
                      className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${adminActiveRoomTab === "deluxe"
                          ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      {aboutForm.sanctuary.tab2Label || "Deluxe Double (Ocean View)"}
                    </button>
                  </div>

                  {/* TAB 1: BASIC PRIVATE ROOM FORM */}
                  {adminActiveRoomTab === "basic" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 rounded-3xl bg-amber-50/40 border border-amber-200/60">
                      {/* Left: Content */}
                      <div className="lg:col-span-7 space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-amber-200/50">
                          <BedDouble className="w-4 h-4 text-[#D97706]" />
                          <span className="text-xs font-black uppercase tracking-wider text-[#D97706]">
                            Tab 1 Configuration • Basic Private Room
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Room Eyebrow Badge
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-basic-eyebrow"
                              value={aboutForm.sanctuary.basicEyebrow}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, basicEyebrow: e.target.value },
                                }))
                              }
                              placeholder="Cozy Comfort & Value"
                              className="rounded-xl bg-white border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Room Title
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-basic-title"
                              value={aboutForm.sanctuary.basicTitle}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, basicTitle: e.target.value },
                                }))
                              }
                              placeholder="Comfortable Basic Private"
                              className="rounded-xl bg-white border-slate-200 font-serif font-bold text-[#0B3D5E]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Room Narrative Description
                          </label>
                          <Textarea
                            rows={4}
                            data-testid="textarea-about-sanc-basic-desc"
                            value={aboutForm.sanctuary.basicDescription}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                sanctuary: { ...prev.sanctuary, basicDescription: e.target.value },
                              }))
                            }
                            placeholder="Traveling on a budget or looking for quiet, peaceful privacy?..."
                            className="rounded-xl bg-white border-slate-200 text-sm leading-relaxed"
                          />
                        </div>

                        {/* 4 Feature Perks */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            4 Room Feature Perks
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 1 (Compass)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-basic-perk1"
                                value={aboutForm.sanctuary.basicPerk1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, basicPerk1: e.target.value },
                                  }))
                                }
                                placeholder="Quiet Village Vibe"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 2 (Wifi)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-basic-perk2"
                                value={aboutForm.sanctuary.basicPerk2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, basicPerk2: e.target.value },
                                  }))
                                }
                                placeholder="High-Speed Wi-Fi"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 3 (Heart)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-basic-perk3"
                                value={aboutForm.sanctuary.basicPerk3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, basicPerk3: e.target.value },
                                  }))
                                }
                                placeholder="Cozy Restful Space"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 4 (Daily Housekeeping)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-basic-perk4"
                                value={aboutForm.sanctuary.basicPerk4}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, basicPerk4: e.target.value },
                                  }))
                                }
                                placeholder="Daily Housekeeping"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                          </div>
                        </div>

                        {/* CTA & Guarantee */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Button CTA Label
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-basic-cta"
                              value={aboutForm.sanctuary.basicCtaText}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, basicCtaText: e.target.value },
                                }))
                              }
                              placeholder="View Rates"
                              className="rounded-xl bg-white border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Direct Price Guarantee Note
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-basic-guarantee"
                              value={aboutForm.sanctuary.basicGuaranteeText}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, basicGuaranteeText: e.target.value },
                                }))
                              }
                              placeholder="Best direct price guarantee"
                              className="rounded-xl bg-white border-slate-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Basic Room Image & Location Badge */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Basic Room Photo &amp; Location Tag
                          </label>

                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                            <img
                              src={aboutForm.sanctuary.basicImageUrl || "/images/Comfortable_Basic_Private.jpeg"}
                              alt="Basic Room Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-200 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-[#D97706]" />
                              <span className="text-[11px] font-bold text-[#0B3D5E]">
                                {aboutForm.sanctuary.basicImageBadge || "Quiet Ground-Floor Village Setting"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Image URL / Path
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-basic-img-url"
                              value={aboutForm.sanctuary.basicImageUrl}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, basicImageUrl: e.target.value },
                                }))
                              }
                              placeholder="/images/Comfortable_Basic_Private.jpeg"
                              className="rounded-xl bg-slate-50 border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Location Badge Text
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-basic-img-badge"
                              value={aboutForm.sanctuary.basicImageBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, basicImageBadge: e.target.value },
                                }))
                              }
                              placeholder="Quiet Ground-Floor Village Setting"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-[#0B3D5E]/30 bg-slate-50 hover:bg-[#0B3D5E]/5 text-xs font-semibold text-[#0B3D5E] cursor-pointer transition-colors">
                              {isUploadingBasicRoomImg ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload New Basic Room Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingBasicRoomImg}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadBasicRoomImage(f);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DELUXE DOUBLE ROOM FORM */}
                  {adminActiveRoomTab === "deluxe" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 rounded-3xl bg-sky-50/40 border border-sky-200/60">
                      {/* Left: Content */}
                      <div className="lg:col-span-7 space-y-5">
                        <div className="flex items-center gap-2 pb-3 border-b border-sky-200/50">
                          <Waves className="w-4 h-4 text-[#0B3D5E]" />
                          <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E]">
                            Tab 2 Configuration • Deluxe Double (Ocean View)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Room Eyebrow Badge
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-deluxe-eyebrow"
                              value={aboutForm.sanctuary.deluxeEyebrow}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, deluxeEyebrow: e.target.value },
                                }))
                              }
                              placeholder="Elevated Horizon Experience"
                              className="rounded-xl bg-white border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Room Title
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-deluxe-title"
                              value={aboutForm.sanctuary.deluxeTitle}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, deluxeTitle: e.target.value },
                                }))
                              }
                              placeholder="Deluxe Double With Balcony"
                              className="rounded-xl bg-white border-slate-200 font-serif font-bold text-[#0B3D5E]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Room Narrative Description
                          </label>
                          <Textarea
                            rows={4}
                            data-testid="textarea-about-sanc-deluxe-desc"
                            value={aboutForm.sanctuary.deluxeDescription}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                sanctuary: { ...prev.sanctuary, deluxeDescription: e.target.value },
                              }))
                            }
                            placeholder="Wake up to tropical light and breathtaking views across the bay..."
                            className="rounded-xl bg-white border-slate-200 text-sm leading-relaxed"
                          />
                        </div>

                        {/* 4 Feature Perks */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            4 Room Feature Perks
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 1 (Balcony)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-deluxe-perk1"
                                value={aboutForm.sanctuary.deluxePerk1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, deluxePerk1: e.target.value },
                                  }))
                                }
                                placeholder="Private Ocean Balcony"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 2 (Waves)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-deluxe-perk2"
                                value={aboutForm.sanctuary.deluxePerk2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, deluxePerk2: e.target.value },
                                  }))
                                }
                                placeholder="Panoramic Ocean Views"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 3 (A/C)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-deluxe-perk3"
                                value={aboutForm.sanctuary.deluxePerk3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, deluxePerk3: e.target.value },
                                  }))
                                }
                                placeholder="Whisper-Quiet A/C"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 mb-1 block">Perk 4 (Award)</span>
                              <Input
                                type="text"
                                data-testid="input-about-sanc-deluxe-perk4"
                                value={aboutForm.sanctuary.deluxePerk4}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    sanctuary: { ...prev.sanctuary, deluxePerk4: e.target.value },
                                  }))
                                }
                                placeholder="Authentic Local Styling"
                                className="rounded-xl bg-white border-slate-200"
                              />
                            </div>
                          </div>
                        </div>

                        {/* CTA & Guarantee */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Button CTA Label
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-deluxe-cta"
                              value={aboutForm.sanctuary.deluxeCtaText}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, deluxeCtaText: e.target.value },
                                }))
                              }
                              placeholder="View Rates"
                              className="rounded-xl bg-white border-slate-200"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                              Direct Price Guarantee Note
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-deluxe-guarantee"
                              value={aboutForm.sanctuary.deluxeGuaranteeText}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, deluxeGuaranteeText: e.target.value },
                                }))
                              }
                              placeholder="Top-floor ocean horizon view"
                              className="rounded-xl bg-white border-slate-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Deluxe Room Image & Location Badge */}
                      <div className="lg:col-span-5 space-y-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Deluxe Room Photo &amp; Location Tag
                          </label>

                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                            <img
                              src={aboutForm.sanctuary.deluxeImageUrl || "/images/Deluxe_Double%20with_Balcony.jpeg"}
                              alt="Deluxe Room Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-200 flex items-center gap-1.5">
                              <Waves className="w-3 h-3 text-[#D97706]" />
                              <span className="text-[11px] font-bold text-[#0B3D5E]">
                                {aboutForm.sanctuary.deluxeImageBadge || "Ocean Horizon • Private Balcony Terrace"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Image URL / Path
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-deluxe-img-url"
                              value={aboutForm.sanctuary.deluxeImageUrl}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, deluxeImageUrl: e.target.value },
                                }))
                              }
                              placeholder="/images/Deluxe_Double%20with_Balcony.jpeg"
                              className="rounded-xl bg-slate-50 border-slate-200 text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Location Badge Text
                            </label>
                            <Input
                              type="text"
                              data-testid="input-about-sanc-deluxe-img-badge"
                              value={aboutForm.sanctuary.deluxeImageBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  sanctuary: { ...prev.sanctuary, deluxeImageBadge: e.target.value },
                                }))
                              }
                              placeholder="Ocean Horizon • Private Balcony Terrace"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-[#0B3D5E]/30 bg-slate-50 hover:bg-[#0B3D5E]/5 text-xs font-semibold text-[#0B3D5E] cursor-pointer transition-colors">
                              {isUploadingDeluxeRoomImg ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload New Deluxe Room Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingDeluxeRoomImg}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadDeluxeRoomImage(f);
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 4 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Sanctuary Switcher &amp; Room Card Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        Interactive Dual Tab Live Replica
                      </span>
                    </div>

                    <div className="rounded-[2.5rem] bg-gradient-to-b from-[#FAF8F5] via-[#F4F9FC] to-[#EEF5FA] p-6 sm:p-10 border border-slate-200 shadow-inner relative overflow-hidden">
                      {/* Ambient glows */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0B3D5E]/5 rounded-full blur-3xl pointer-events-none" />

                      <div className="relative z-10 space-y-8">
                        {/* Preview Top Header & Tabs */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FBBF24]/50 shadow-xs mb-3">
                              <Sun className="w-3.5 h-3.5 text-[#D97706]" />
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B3D5E]">
                                {aboutForm.sanctuary.badge || "Sleep & Sanctuary"}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#0B3D5E] tracking-tight">
                              <span>{aboutForm.sanctuary.headingLead || "Designed For"} </span>
                              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]">
                                {aboutForm.sanctuary.headingHighlight || "Every Stay & Budget"}
                              </span>
                            </h3>
                          </div>

                          {/* Preview Interactive Tab Buttons */}
                          <div className="p-1 rounded-full bg-white border border-slate-200 shadow-sm flex items-center">
                            <button
                              type="button"
                              data-testid="preview-room-tab-basic"
                              onClick={() => setPreviewActiveRoomTab("basic")}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${previewActiveRoomTab === "basic"
                                  ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
                                  : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                              {aboutForm.sanctuary.tab1Label || "Basic Private Room"}
                            </button>
                            <button
                              type="button"
                              data-testid="preview-room-tab-deluxe"
                              onClick={() => setPreviewActiveRoomTab("deluxe")}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${previewActiveRoomTab === "deluxe"
                                  ? "bg-[#0B3D5E] text-[#FBBF24] shadow-sm"
                                  : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                              {aboutForm.sanctuary.tab2Label || "Deluxe Double (Ocean View)"}
                            </button>
                          </div>
                        </div>

                        {/* Preview Selected Room Card */}
                        {previewActiveRoomTab === "basic" ? (
                          <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-[2rem] bg-white border border-white/90 shadow-sm">
                            <div className="lg:col-span-7 space-y-4">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#D97706] text-[10px] font-black uppercase tracking-widest">
                                <BedDouble className="w-3 h-3" />
                                <span>{aboutForm.sanctuary.basicEyebrow || "Cozy Comfort & Value"}</span>
                              </div>

                              <h4 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                                {aboutForm.sanctuary.basicTitle || "Comfortable Basic Private"}
                              </h4>

                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                {aboutForm.sanctuary.basicDescription || "Traveling on a budget or looking for quiet, peaceful privacy?..."}
                              </p>

                              <div className="grid grid-cols-2 gap-2.5 pt-2">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.basicPerk1 || "Quiet Village Vibe"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <Wifi className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.basicPerk2 || "High-Speed Wi-Fi"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <Heart className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.basicPerk3 || "Cozy Restful Space"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.basicPerk4 || "Daily Housekeeping"}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 flex items-center gap-3">
                                <button
                                  type="button"
                                  className="px-4 py-2 rounded-full bg-[#0B3D5E] text-white text-xs font-bold shadow-sm"
                                >
                                  {aboutForm.sanctuary.basicCtaText || "View Rates"}
                                </button>
                                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                                  {aboutForm.sanctuary.basicGuaranteeText || "Best direct price guarantee"}
                                </span>
                              </div>
                            </div>

                            <div className="lg:col-span-5">
                              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
                                <img
                                  src={aboutForm.sanctuary.basicImageUrl || "/images/Comfortable_Basic_Private.jpeg"}
                                  alt="Basic Room"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-200 flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 text-[#D97706]" />
                                  <span className="text-[10px] font-bold text-[#0B3D5E]">
                                    {aboutForm.sanctuary.basicImageBadge || "Quiet Ground-Floor Village Setting"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-[2rem] bg-white border border-white/90 shadow-sm">
                            <div className="lg:col-span-7 space-y-4">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#D97706] text-[10px] font-black uppercase tracking-widest">
                                <Sunset className="w-3 h-3" />
                                <span>{aboutForm.sanctuary.deluxeEyebrow || "Elevated Horizon Experience"}</span>
                              </div>

                              <h4 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                                {aboutForm.sanctuary.deluxeTitle || "Deluxe Double With Balcony"}
                              </h4>

                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                {aboutForm.sanctuary.deluxeDescription || "Wake up to tropical light and breathtaking views across the bay..."}
                              </p>

                              <div className="grid grid-cols-2 gap-2.5 pt-2">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <Sunset className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.deluxePerk1 || "Private Ocean Balcony"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <Waves className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.deluxePerk2 || "Panoramic Ocean Views"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <Wind className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.deluxePerk3 || "Whisper-Quiet A/C"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                                  <Award className="w-3.5 h-3.5 text-[#D97706]" />
                                  <span className="text-xs font-bold text-[#0B3D5E] truncate">
                                    {aboutForm.sanctuary.deluxePerk4 || "Authentic Local Styling"}
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 flex items-center gap-3">
                                <button
                                  type="button"
                                  className="px-4 py-2 rounded-full bg-[#0B3D5E] text-white text-xs font-bold shadow-sm"
                                >
                                  {aboutForm.sanctuary.deluxeCtaText || "View Rates"}
                                </button>
                                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                                  {aboutForm.sanctuary.deluxeGuaranteeText || "Top-floor ocean horizon view"}
                                </span>
                              </div>
                            </div>

                            <div className="lg:col-span-5">
                              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
                                <img
                                  src={aboutForm.sanctuary.deluxeImageUrl || "/images/Deluxe_Double%20with_Balcony.jpeg"}
                                  alt="Deluxe Room"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-200 flex items-center gap-1.5">
                                  <Waves className="w-3 h-3 text-[#D97706]" />
                                  <span className="text-[10px] font-bold text-[#0B3D5E]">
                                    {aboutForm.sanctuary.deluxeImageBadge || "Ocean Horizon • Private Balcony Terrace"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: THE ROOFTOP CAFÉ • ATMOSPHERE SHIFT SIMULATOR */}
              <div data-testid="admin-about-rooftop-section" className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-[#0B3D5E]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <Coffee className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 5</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        The Rooftop Café • Atmosphere Shift Simulator
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically configure morning roasts vs golden hour atmospheres, time windows, signature culinary cards, atmosphere badges, and floating vista photography.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutRooftopDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        className="rounded-xl bg-gradient-to-r from-[#0B3D5E] to-[#134e7c] hover:from-[#082d46] hover:to-[#0f3d61] text-white shadow-md shadow-[#0B3D5E]/20 gap-2 text-xs font-semibold min-w-[130px]"
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutRooftopSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Rooftop Café</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Common Headline & Dual Atmosphere Switcher Tabs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Section Headline Lead (Common)
                      </label>
                      <Input
                        value={aboutForm.rooftop.headingLead}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            rooftop: { ...prev.rooftop, headingLead: e.target.value },
                          }))
                        }
                        placeholder="The Rooftop Café"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Day Mode Tab Label
                      </label>
                      <Input
                        value={aboutForm.rooftop.tab1Label}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            rooftop: { ...prev.rooftop, tab1Label: e.target.value },
                          }))
                        }
                        placeholder="Morning Vibes"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Dusk Mode Tab Label
                      </label>
                      <Input
                        value={aboutForm.rooftop.tab2Label}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            rooftop: { ...prev.rooftop, tab2Label: e.target.value },
                          }))
                        }
                        placeholder="Golden Hour"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Active Atmosphere Tab Selector for Editing */}
                  <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 max-w-md">
                    <button
                      type="button"
                      onClick={() => setAdminActiveAtmosphereTab("morning")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${adminActiveAtmosphereTab === "morning"
                          ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                          : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                    >
                      <Coffee className="w-3.5 h-3.5 text-amber-500" />
                      <span>{aboutForm.rooftop.tab1Label || "Morning Vibes"} Editor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminActiveAtmosphereTab("sunset")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${adminActiveAtmosphereTab === "sunset"
                          ? "bg-[#0B3D5E] text-white shadow-sm"
                          : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                    >
                      <Sunset className="w-3.5 h-3.5 text-[#FBBF24]" />
                      <span>{aboutForm.rooftop.tab2Label || "Golden Hour"} Editor</span>
                    </button>
                  </div>

                  {/* TAB 1: MORNING VIBES FORM */}
                  {adminActiveAtmosphereTab === "morning" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 rounded-3xl bg-amber-50/40 border border-amber-200/60">
                      {/* Left: Content & Cards */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                          <Coffee className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                            Morning Mode Atmosphere & Curations
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Morning Eyebrow Badge
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningBadge: e.target.value },
                                }))
                              }
                              placeholder="Scenic Culinary Rooftop"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Morning Heading Highlight
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningHeadingHighlight}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningHeadingHighlight: e.target.value },
                                }))
                              }
                              placeholder="• Sunrise Roasts & Vistas"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-amber-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Morning Subtitle Narrative
                          </label>
                          <Textarea
                            value={aboutForm.rooftop.morningSubtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                rooftop: { ...prev.rooftop, morningSubtitle: e.target.value },
                              }))
                            }
                            rows={3}
                            placeholder="Wake up to freshly roasted Sri Lankan highland espresso..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium leading-relaxed"
                          />
                        </div>

                        {/* Morning Card 1 */}
                        <div className="p-4 rounded-2xl bg-white border border-amber-200/70 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Coffee className="w-3.5 h-3.5 text-amber-500" /> Morning Feature Card 1 (Artisan Roasts)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Time Tag</label>
                              <Input
                                value={aboutForm.rooftop.morningCard1Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard1Tag: e.target.value },
                                  }))
                                }
                                placeholder="7:00 AM – 11:30 AM"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.morningCard1Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard1Title: e.target.value },
                                  }))
                                }
                                placeholder="Artisan Roasts & Bowls"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.morningCard1Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningCard1Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Fresh single-origin Ceylon espresso..."
                              className="rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Morning Card 2 */}
                        <div className="p-4 rounded-2xl bg-white border border-amber-200/70 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                            <Waves className="w-3.5 h-3.5 text-sky-500" /> Morning Feature Card 2 (Dawn Surf Conditions)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Vantage Tag</label>
                              <Input
                                value={aboutForm.rooftop.morningCard2Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard2Tag: e.target.value },
                                  }))
                                }
                                placeholder="180° Panoramic Vantage"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.morningCard2Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningCard2Title: e.target.value },
                                  }))
                                }
                                placeholder="Dawn Surf Conditions"
                                className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.morningCard2Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningCard2Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Check Weligama Bay wave sets..."
                              className="rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Morning Bottom Micro-Strip Perks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Micro Perk 1</label>
                            <Input
                              value={aboutForm.rooftop.morningPerk1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningPerk1: e.target.value },
                                }))
                              }
                              placeholder="Organic local ingredients"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Micro Perk 2</label>
                            <Input
                              value={aboutForm.rooftop.morningPerk2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningPerk2: e.target.value },
                                }))
                              }
                              placeholder="High-speed terrace Wi-Fi"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Morning Showcase & Photo */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-amber-200/60">
                          <ImageIcon className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                            Morning Vista Media & Reassurance Dock
                          </span>
                        </div>

                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-amber-200/80 shadow-md bg-slate-100">
                          <img
                            src={aboutForm.rooftop.morningImageUrl || "/images/morning-vibe.png"}
                            alt="Morning Vibes Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-200 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-[#0B3D5E]">
                              {aboutForm.rooftop.morningImageTag || "Morning Sunrise Service"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Status Badge Text
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningImageTag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningImageTag: e.target.value },
                                }))
                              }
                              placeholder="Morning Sunrise Service"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Image URL / Path
                            </label>
                            <Input
                              value={aboutForm.rooftop.morningImageUrl}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, morningImageUrl: e.target.value },
                                }))
                              }
                              placeholder="/images/morning-vibe.png"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold font-mono"
                            />
                          </div>

                          <div>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-[#0B3D5E]/30 bg-white hover:bg-[#0B3D5E]/5 text-xs font-semibold text-[#0B3D5E] cursor-pointer transition-colors">
                              {isUploadingMorningImg ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload New Morning Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingMorningImg}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadMorningImage(f);
                                }}
                              />
                            </label>
                          </div>

                          <div className="pt-2 border-t border-amber-200/60 space-y-3">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Bottom Reassurance Note
                              </label>
                              <Input
                                value={aboutForm.rooftop.morningDockNote}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningDockNote: e.target.value },
                                  }))
                                }
                                placeholder="Complimentary breakfast & espresso for resident bookings."
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Reassurance Hours Tag
                              </label>
                              <Input
                                value={aboutForm.rooftop.morningDockTime}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, morningDockTime: e.target.value },
                                  }))
                                }
                                placeholder="7AM - 11:30AM"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: GOLDEN HOUR FORM */}
                  {adminActiveAtmosphereTab === "sunset" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 rounded-3xl bg-slate-900/90 text-white border border-amber-400/30">
                      {/* Left: Content & Cards */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                          <Sunset className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                            Golden Hour Dusk Mode & Curations
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Sunset Eyebrow Badge
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetBadge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetBadge: e.target.value },
                                }))
                              }
                              placeholder="Sunset Horizon Deck"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Sunset Heading Highlight
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetHeadingHighlight}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetHeadingHighlight: e.target.value },
                                }))
                              }
                              placeholder="• Golden Hour Rhythms"
                              className="rounded-xl bg-slate-800 border-slate-700 text-amber-400 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1">
                            Sunset Subtitle Narrative
                          </label>
                          <Textarea
                            value={aboutForm.rooftop.sunsetSubtitle}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                rooftop: { ...prev.rooftop, sunsetSubtitle: e.target.value },
                              }))
                            }
                            rows={3}
                            placeholder="As the sun dips below the Indian Ocean horizon..."
                            className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-medium leading-relaxed"
                          />
                        </div>

                        {/* Sunset Card 1 */}
                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-400/20 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" /> Sunset Feature Card 1 (Craft Sun-Downers)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Time Tag</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard1Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard1Tag: e.target.value },
                                  }))
                                }
                                placeholder="5:00 PM – 9:30 PM"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard1Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard1Title: e.target.value },
                                  }))
                                }
                                placeholder="Craft Sun-Downers"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.sunsetCard1Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetCard1Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Signature island-infused mocktails..."
                              className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Sunset Card 2 */}
                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-400/20 space-y-3">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                            <Sunset className="w-3.5 h-3.5 text-amber-400" /> Sunset Feature Card 2 (Golden Hour Ocean Vista)
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Vantage Tag</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard2Tag}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard2Tag: e.target.value },
                                  }))
                                }
                                placeholder="360° Sunset Horizon"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-400 block mb-1">Card Title</label>
                              <Input
                                value={aboutForm.rooftop.sunsetCard2Title}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetCard2Title: e.target.value },
                                  }))
                                }
                                placeholder="Golden Hour Ocean Vista"
                                className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Description</label>
                            <Textarea
                              value={aboutForm.rooftop.sunsetCard2Desc}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetCard2Desc: e.target.value },
                                }))
                              }
                              rows={2}
                              placeholder="Watch the southern sky ignite..."
                              className="rounded-xl bg-slate-900 border-slate-700 text-white text-xs font-medium"
                            />
                          </div>
                        </div>

                        {/* Sunset Bottom Micro-Strip Perks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Micro Perk 1</label>
                            <Input
                              value={aboutForm.rooftop.sunsetPerk1}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetPerk1: e.target.value },
                                }))
                              }
                              placeholder="Ambient dusk acoustics"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-slate-400 block mb-1">Micro Perk 2</label>
                            <Input
                              value={aboutForm.rooftop.sunsetPerk2}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetPerk2: e.target.value },
                                }))
                              }
                              placeholder="Resident VIP seating"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Sunset Showcase & Photo */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                            Dusk Vista Media & Reassurance Dock
                          </span>
                        </div>

                        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-amber-400/30 shadow-md bg-slate-800">
                          <img
                            src={aboutForm.rooftop.sunsetImageUrl || "/images/gallery-sunset.png"}
                            alt="Golden Hour Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/95 backdrop-blur-md shadow-xs border border-amber-400/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-white">
                              {aboutForm.rooftop.sunsetImageTag || "Golden Hour Vista Deck"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Status Badge Text
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetImageTag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetImageTag: e.target.value },
                                }))
                              }
                              placeholder="Golden Hour Vista Deck"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-300 block mb-1">
                              Image URL / Path
                            </label>
                            <Input
                              value={aboutForm.rooftop.sunsetImageUrl}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  rooftop: { ...prev.rooftop, sunsetImageUrl: e.target.value },
                                }))
                              }
                              placeholder="/images/gallery-sunset.png"
                              className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold font-mono"
                            />
                          </div>

                          <div>
                            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-400/40 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 cursor-pointer transition-colors">
                              {isUploadingSunsetImg ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload New Golden Hour Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingSunsetImg}
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadSunsetImage(f);
                                }}
                              />
                            </label>
                          </div>

                          <div className="pt-2 border-t border-white/10 space-y-3">
                            <div>
                              <label className="text-xs font-bold text-slate-300 block mb-1">
                                Bottom Reassurance Note
                              </label>
                              <Input
                                value={aboutForm.rooftop.sunsetDockNote}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetDockNote: e.target.value },
                                  }))
                                }
                                placeholder="Weligama's premier sunset vista. Resident priority seating."
                                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-slate-300 block mb-1">
                                Reassurance Hours Tag
                              </label>
                              <Input
                                value={aboutForm.rooftop.sunsetDockTime}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    rooftop: { ...prev.rooftop, sunsetDockTime: e.target.value },
                                  }))
                                }
                                placeholder="5PM - 9:30PM"
                                className="rounded-xl bg-slate-800 border-slate-700 text-white text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LIVE INTERACTIVE ATMOSPHERE SHIFT SIMULATOR PREVIEW */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Atmosphere Shift Simulator Preview
                        </h4>
                      </div>
                      {/* Interactive toggle for the preview */}
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-xs self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setPreviewActiveAtmosphereTab("morning")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${previewActiveAtmosphereTab === "morning"
                              ? "bg-[#0B3D5E] text-white shadow-xs"
                              : "text-slate-600 hover:text-[#0B3D5E]"
                            }`}
                        >
                          <Coffee className="w-3 h-3 text-amber-400" />
                          <span>{aboutForm.rooftop.tab1Label || "Morning Vibes"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewActiveAtmosphereTab("sunset")}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${previewActiveAtmosphereTab === "sunset"
                              ? "bg-amber-500 text-slate-950 shadow-xs"
                              : "text-slate-600 hover:text-[#0B3D5E]"
                            }`}
                        >
                          <Sunset className="w-3 h-3 text-slate-900" />
                          <span>{aboutForm.rooftop.tab2Label || "Golden Hour"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Preview Container mirroring Section 5 */}
                    <div
                      className={`relative p-6 sm:p-10 rounded-3xl transition-all duration-700 shadow-xl overflow-hidden border ${previewActiveAtmosphereTab === "sunset"
                          ? "border-amber-400/25 shadow-[0_24px_60px_rgba(7,30,46,0.45)] text-white"
                          : "border-white/85 shadow-[0_24px_60px_rgba(11,61,94,0.08)] text-slate-800"
                      }`}
                      style={{
                        background: previewActiveAtmosphereTab === "sunset"
                          ? "linear-gradient(140deg, rgba(7,30,46,0.96) 0%, rgba(11,46,70,0.93) 50%, rgba(18,57,84,0.95) 100%)"
                          : "linear-gradient(140deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.92) 50%, rgba(240,247,253,0.94) 100%)",
                      }}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left: Copy & Cards */}
                        <div className="lg:col-span-7 space-y-6">
                          {/* Eyebrow */}
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md"
                            style={{
                              background: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.12)" : "#FEF3C7",
                              borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.3)" : "#FDE68A",
                              color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#B45309",
                            }}
                          >
                            {previewActiveAtmosphereTab === "sunset" ? (
                              <Sunset className="w-3.5 h-3.5" />
                            ) : (
                              <Coffee className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetBadge || "Sunset Horizon Deck"
                                : aboutForm.rooftop.morningBadge || "Scenic Culinary Rooftop"}
                            </span>
                          </div>

                          {/* Headline */}
                          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight leading-tight">
                            <span>{aboutForm.rooftop.headingLead || "The Rooftop Café"} </span>
                            <span className="italic font-serif" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#D97706" }}>
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetHeadingHighlight || "• Golden Hour Rhythms"
                                : aboutForm.rooftop.morningHeadingHighlight || "• Sunrise Roasts & Vistas"}
                            </span>
                          </h2>

                          {/* Subtitle */}
                          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#94A3B8" : "#475569" }}>
                            {previewActiveAtmosphereTab === "sunset"
                              ? aboutForm.rooftop.sunsetSubtitle || "As the sun dips below the Indian Ocean horizon..."
                              : aboutForm.rooftop.morningSubtitle || "Wake up to freshly roasted Sri Lankan highland espresso..."}
                          </p>

                          {/* Atmosphere Shift Badge Simulator */}
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#94A3B8" : "#64748B" }}>
                              Atmosphere Shift:
                            </span>
                            <div className="inline-flex items-center p-1 rounded-full border border-slate-300/40 bg-black/10 backdrop-blur-md">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                previewActiveAtmosphereTab === "morning"
                                  ? "bg-[#0B3D5E] text-white shadow-xs"
                                  : "text-slate-400"
                              }`}>
                                ☀️ {aboutForm.rooftop.tab1Label || "Morning Vibes"}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                previewActiveAtmosphereTab === "sunset"
                                  ? "bg-amber-500 text-slate-950 shadow-xs"
                                  : "text-slate-400"
                              }`}>
                                🌅 {aboutForm.rooftop.tab2Label || "Golden Hour"}
                              </span>
                            </div>
                          </div>

                          {/* Dual Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {/* Card 1 */}
                            <div
                              className="p-4 rounded-2xl border transition-all"
                              style={{
                                background: previewActiveAtmosphereTab === "sunset" ? "rgba(11,46,70,0.6)" : "rgba(255,255,255,0.8)",
                                borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.2)" : "#E2E8F0",
                              }}
                            >
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5"
                                style={{
                                  background: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.15)" : "#FEF3C7",
                                  color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#B45309",
                                }}
                              >
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard1Tag || "5:00 PM – 9:30 PM"
                                  : aboutForm.rooftop.morningCard1Tag || "7:00 AM – 11:30 AM"}
                              </span>
                              <h4 className="text-sm font-bold font-serif mb-1" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#FFFFFF" : "#0B3D5E" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard1Title || "Craft Sun-Downers"
                                  : aboutForm.rooftop.morningCard1Title || "Artisan Roasts & Bowls"}
                              </h4>
                              <p className="text-[11px] leading-relaxed" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#CBD5E1" : "#64748B" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard1Desc || "Signature island-infused mocktails..."
                                  : aboutForm.rooftop.morningCard1Desc || "Fresh single-origin Ceylon espresso..."}
                              </p>
                            </div>

                            {/* Card 2 */}
                            <div
                              className="p-4 rounded-2xl border transition-all"
                              style={{
                                background: previewActiveAtmosphereTab === "sunset" ? "rgba(11,46,70,0.6)" : "rgba(255,255,255,0.8)",
                                borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.2)" : "#E2E8F0",
                              }}
                            >
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1.5"
                                style={{
                                  background: previewActiveAtmosphereTab === "sunset" ? "rgba(56,189,248,0.15)" : "#E0F2FE",
                                  color: previewActiveAtmosphereTab === "sunset" ? "#38BDF8" : "#0369A1",
                                }}
                              >
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard2Tag || "360° Sunset Horizon"
                                  : aboutForm.rooftop.morningCard2Tag || "180° Panoramic Vantage"}
                              </span>
                              <h4 className="text-sm font-bold font-serif mb-1" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#FFFFFF" : "#0B3D5E" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard2Title || "Golden Hour Ocean Vista"
                                  : aboutForm.rooftop.morningCard2Title || "Dawn Surf Conditions"}
                              </h4>
                              <p className="text-[11px] leading-relaxed" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#CBD5E1" : "#64748B" }}>
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetCard2Desc || "Watch the southern sky ignite..."
                                  : aboutForm.rooftop.morningCard2Desc || "Check Weligama Bay wave sets..."}
                              </p>
                            </div>
                          </div>

                          {/* Micro-perks strip */}
                          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-bold" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#E2E8F0" : "#475569" }}>
                            <span className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetPerk1 || "Ambient dusk acoustics"
                                : aboutForm.rooftop.morningPerk1 || "Organic local ingredients"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Wifi className="w-3.5 h-3.5 text-[#0B3D5E]" />
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetPerk2 || "Resident VIP seating"
                                : aboutForm.rooftop.morningPerk2 || "High-speed terrace Wi-Fi"}
                            </span>
                          </div>
                        </div>

                        {/* Right: Floating Media & Reassurance Dock */}
                        <div className="lg:col-span-5 relative">
                          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                            <img
                              src={
                                previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetImageUrl || "/gallery-sunset.png"
                                  : aboutForm.rooftop.morningImageUrl || "/morning-vibe.png"
                              }
                              alt="Rooftop Vista Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                              <span className="text-[10px] font-bold text-white">
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetImageTag || "Golden Hour Vista Deck"
                                  : aboutForm.rooftop.morningImageTag || "Morning Sunrise Service"}
                              </span>
                            </div>
                          </div>

                          {/* Floating Dock */}
                          <div
                            className="mt-3 p-3 rounded-2xl border backdrop-blur-md flex items-center justify-between gap-3 shadow-lg"
                            style={{
                              background: previewActiveAtmosphereTab === "sunset" ? "rgba(11,46,70,0.85)" : "rgba(255,255,255,0.9)",
                              borderColor: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.3)" : "#E2E8F0",
                            }}
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: previewActiveAtmosphereTab === "sunset" ? "#F1F5F9" : "#0B3D5E" }}>
                              <Coffee className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="text-[11px] truncate">
                                {previewActiveAtmosphereTab === "sunset"
                                  ? aboutForm.rooftop.sunsetDockNote || "Weligama's premier sunset vista. Resident priority seating."
                                  : aboutForm.rooftop.morningDockNote || "Complimentary breakfast & espresso for resident bookings."}
                              </span>
                            </div>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0B3D5E]/10 text-[#0B3D5E] shrink-0"
                              style={{
                                background: previewActiveAtmosphereTab === "sunset" ? "rgba(251,191,36,0.2)" : "rgba(11,61,94,0.1)",
                                color: previewActiveAtmosphereTab === "sunset" ? "#FBBF24" : "#0B3D5E",
                              }}
                            >
                              {previewActiveAtmosphereTab === "sunset"
                                ? aboutForm.rooftop.sunsetDockTime || "5PM - 9:30PM"
                                : aboutForm.rooftop.morningDockTime || "7AM - 11:30AM"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: FAMILY VALUES & HERITAGE PILLARS */}
              <div data-testid="admin-about-values-section" className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0B3D5E]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <HeartHandshake className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 6</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Rooted in Weligama • Family Values &amp; Heritage Pillars
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically configure independent heritage identity, 3 core proof pillars, proof points, and family host signature reassurance dock.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutValuesDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        className="rounded-xl bg-gradient-to-r from-[#0B3D5E] to-[#134e7c] hover:from-[#082d46] hover:to-[#0f3d61] text-white shadow-md shadow-[#0B3D5E]/20 gap-2 text-xs font-semibold min-w-[140px]"
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutValuesSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Values &amp; Heritage</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Section Eyebrow, Two-Tone Headline & Subtitle */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Section Header &amp; Mission Narrative
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Eyebrow Badge Text
                        </label>
                        <Input
                          value={aboutForm.values.badge}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, badge: e.target.value },
                            }))
                          }
                          placeholder="Our Founding Identity"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Lead
                        </label>
                        <Input
                          value={aboutForm.values.headingLead}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, headingLead: e.target.value },
                            }))
                          }
                          placeholder="Rooted in Weligama,"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Highlight (Italic Amber)
                        </label>
                        <Input
                          value={aboutForm.values.headingHighlight}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, headingHighlight: e.target.value },
                            }))
                          }
                          placeholder="Driven by Family Values"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Subtitle Paragraph Narrative
                      </label>
                      <Textarea
                        value={aboutForm.values.subtitle}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            values: { ...prev.values, subtitle: e.target.value },
                          }))
                        }
                        rows={2}
                        placeholder="More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide..."
                        className="rounded-xl bg-white border-slate-200 text-xs font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 3 Heritage Pillars Editor Tabs */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/80 max-w-xl">
                      <button
                        type="button"
                        onClick={() => setAdminActivePillarTab(1)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          adminActivePillarTab === 1
                            ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                            : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pillar 1: Roots</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminActivePillarTab(2)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          adminActivePillarTab === 2
                            ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                            : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-rose-500" />
                        <span>Pillar 2: Host Care</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminActivePillarTab(3)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                          adminActivePillarTab === 3
                            ? "bg-white text-[#0B3D5E] shadow-sm border border-slate-200/80"
                            : "text-slate-600 hover:text-[#0B3D5E]"
                        }`}
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-sky-500" />
                        <span>Pillar 3: Refinements</span>
                      </button>
                    </div>

                    {/* PILLAR 1 FORM */}
                    {adminActivePillarTab === 1 && (
                      <div className="p-6 rounded-3xl bg-amber-50/40 border border-amber-200/60 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-amber-200/60">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                            Pillar 1: Pure Local Roots &amp; Independent Heritage
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                            <Input
                              value={aboutForm.values.pillar1Badge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar1Badge: e.target.value },
                                }))
                              }
                              placeholder="Pure Local Roots"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Category Micro-Tag</label>
                            <Input
                              value={aboutForm.values.pillar1Tag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar1Tag: e.target.value },
                                }))
                              }
                              placeholder="INDEPENDENT HERITAGE"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pillar Title</label>
                            <Input
                              value={aboutForm.values.pillar1Title}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar1Title: e.target.value },
                                }))
                              }
                              placeholder="100% Locally Owned & Run"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                          <Textarea
                            value={aboutForm.values.pillar1Desc}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                values: { ...prev.values, pillar1Desc: e.target.value },
                              }))
                            }
                            rows={2}
                            placeholder="Proudly independent and family-operated. Every booking directly supports..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium"
                          />
                        </div>

                        <div className="pt-2 border-t border-amber-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block mb-2">
                            Checklist Proof Points
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 1</label>
                              <Input
                                value={aboutForm.values.pillar1Point1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar1Point1: e.target.value },
                                  }))
                                }
                                placeholder="100% Sri Lankan family-owned & operated"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 2</label>
                              <Input
                                value={aboutForm.values.pillar1Point2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar1Point2: e.target.value },
                                  }))
                                }
                                placeholder="Local team hiring with fair living wages"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 3</label>
                              <Input
                                value={aboutForm.values.pillar1Point3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar1Point3: e.target.value },
                                  }))
                                }
                                placeholder="Direct reinvestment into Weligama village"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PILLAR 2 FORM */}
                    {adminActivePillarTab === 2 && (
                      <div className="p-6 rounded-3xl bg-rose-50/40 border border-rose-200/60 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-rose-200/60">
                          <HeartHandshake className="w-4 h-4 text-rose-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-rose-900">
                            Pillar 2: Personal Host Care &amp; Southern Hospitality
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                            <Input
                              value={aboutForm.values.pillar2Badge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar2Badge: e.target.value },
                                }))
                              }
                              placeholder="Personal Host Care"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Category Micro-Tag</label>
                            <Input
                              value={aboutForm.values.pillar2Tag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar2Tag: e.target.value },
                                }))
                              }
                              placeholder="SOUTHERN HOSPITALITY"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pillar Title</label>
                            <Input
                              value={aboutForm.values.pillar2Title}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar2Title: e.target.value },
                                }))
                              }
                              placeholder="Warm Family Atmosphere"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                          <Textarea
                            value={aboutForm.values.pillar2Desc}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                values: { ...prev.values, pillar2Desc: e.target.value },
                              }))
                            }
                            rows={2}
                            placeholder="You are never just a room number here. Our family is on-site daily..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium"
                          />
                        </div>

                        <div className="pt-2 border-t border-rose-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-rose-900 block mb-2">
                            Checklist Proof Points
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 1</label>
                              <Input
                                value={aboutForm.values.pillar2Point1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar2Point1: e.target.value },
                                  }))
                                }
                                placeholder="Genuine hosts living on-site 24/7"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 2</label>
                              <Input
                                value={aboutForm.values.pillar2Point2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar2Point2: e.target.value },
                                  }))
                                }
                                placeholder="Insider guidance for secret uncrowded spots"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 3</label>
                              <Input
                                value={aboutForm.values.pillar2Point3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar2Point3: e.target.value },
                                  }))
                                }
                                placeholder="True island home-away-from-home feeling"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PILLAR 3 FORM */}
                    {adminActivePillarTab === 3 && (
                      <div className="p-6 rounded-3xl bg-sky-50/40 border border-sky-200/60 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-sky-200/60">
                          <TrendingUp className="w-4 h-4 text-sky-600" />
                          <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                            Pillar 3: Dedicated Season Upgrades &amp; Uncompromising Comfort
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Highlight Badge</label>
                            <Input
                              value={aboutForm.values.pillar3Badge}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar3Badge: e.target.value },
                                }))
                              }
                              placeholder="Yearly Refinements"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Category Micro-Tag</label>
                            <Input
                              value={aboutForm.values.pillar3Tag}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar3Tag: e.target.value },
                                }))
                              }
                              placeholder="UNCOMPROMISING COMFORT"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Pillar Title</label>
                            <Input
                              value={aboutForm.values.pillar3Title}
                              onChange={(e) =>
                                setAboutForm((prev) => ({
                                  ...prev,
                                  values: { ...prev.values, pillar3Title: e.target.value },
                                }))
                              }
                              placeholder="Dedicated Season Upgrades"
                              className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                          <Textarea
                            value={aboutForm.values.pillar3Desc}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                values: { ...prev.values, pillar3Desc: e.target.value },
                              }))
                            }
                            rows={2}
                            placeholder="We continuously reinvest each season into high-pressure rain showers..."
                            className="rounded-xl bg-white border-slate-200 text-xs font-medium"
                          />
                        </div>

                        <div className="pt-2 border-t border-sky-200/60">
                          <span className="text-[11px] font-black uppercase tracking-wider text-sky-900 block mb-2">
                            Checklist Proof Points
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 1</label>
                              <Input
                                value={aboutForm.values.pillar3Point1}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar3Point1: e.target.value },
                                  }))
                                }
                                placeholder="Annual room comfort & amenity enhancements"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 2</label>
                              <Input
                                value={aboutForm.values.pillar3Point2}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar3Point2: e.target.value },
                                  }))
                                }
                                placeholder="Whisper-quiet Daikin A/C & rain showers"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold text-slate-600 block mb-1">Point 3</label>
                              <Input
                                value={aboutForm.values.pillar3Point3}
                                onChange={(e) =>
                                  setAboutForm((prev) => ({
                                    ...prev,
                                    values: { ...prev.values, pillar3Point3: e.target.value },
                                  }))
                                }
                                placeholder="High-speed fiber connectivity in every space"
                                className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Family Host Signature & Reassurance Dock Editor */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Family Host Signature &amp; Reassurance Dock
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Monogram
                        </label>
                        <Input
                          value={aboutForm.values.dockMonogram}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, dockMonogram: e.target.value },
                            }))
                          }
                          placeholder="OA"
                          className="rounded-xl bg-white border-slate-200 text-xs font-bold"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Family Host Quote
                        </label>
                        <Input
                          value={aboutForm.values.dockQuote}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, dockQuote: e.target.value },
                            }))
                          }
                          placeholder="“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”"
                          className="rounded-xl bg-white border-slate-200 text-xs font-serif italic"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Guarantee Label
                        </label>
                        <Input
                          value={aboutForm.values.dockGuarantee}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              values: { ...prev.values, dockGuarantee: e.target.value },
                            }))
                          }
                          placeholder="100% Genuine Hospitality"
                          className="rounded-xl bg-white border-slate-200 text-xs font-bold text-[#0B3D5E]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Family Host Byline
                      </label>
                      <Input
                        value={aboutForm.values.dockByline}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            values: { ...prev.values, dockByline: e.target.value },
                          }))
                        }
                        placeholder="The Ocean Air Family • Weligama Bay, Sri Lanka"
                        className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-[#D97706]"
                      />
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 6 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Family Values &amp; Heritage Pillars Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        Live Desktop &amp; Mobile Replica
                      </span>
                    </div>

                    <div
                      className="p-8 sm:p-12 rounded-3xl border border-white/90 shadow-xl overflow-hidden"
                      style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #E6EFF6 40%, #EEF5FA 100%)' }}
                    >
                      {/* Centered Header */}
                      <div className="text-center mb-10 max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-amber-200/60 text-[#D97706] text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-xs mb-3">
                          <HeartHandshake className="w-3 h-3 text-[#D97706]" />
                          <span>{aboutForm.values.badge || "Our Founding Identity"}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B3D5E] tracking-tight leading-tight">
                          <span>{aboutForm.values.headingLead || "Rooted in Weligama,"} </span>
                          <span className="italic font-normal text-[#D97706]">
                            {aboutForm.values.headingHighlight || "Driven by Family Values"}
                          </span>
                        </h3>
                        <p className="text-slate-600 mt-2 text-xs sm:text-sm leading-relaxed">
                          {aboutForm.values.subtitle || "More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide..."}
                        </p>
                      </div>

                      {/* 3 Pillars Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-10">
                        {/* Card 1 */}
                        <div
                          className="flex flex-col justify-between p-6 rounded-3xl border border-white/90 shadow-md bg-white/90 backdrop-blur-md text-left"
                          style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E]">
                                {aboutForm.values.pillar1Badge || "Pure Local Roots"}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] block mb-1">
                              {aboutForm.values.pillar1Tag || "INDEPENDENT HERITAGE"}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#0B3D5E] mb-2 leading-snug">
                              {aboutForm.values.pillar1Title || "100% Locally Owned & Run"}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-600 mb-4">
                              {aboutForm.values.pillar1Desc || "Proudly independent and family-operated..."}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-100 space-y-1.5 mt-auto">
                            {[aboutForm.values.pillar1Point1, aboutForm.values.pillar1Point2, aboutForm.values.pillar1Point3].map((pt, i) => (
                              <div key={i} className="flex items-start gap-2 text-[10px] text-[#0B3D5E] font-medium">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                                  <Check className="w-2 h-2" />
                                </div>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card 2 */}
                        <div
                          className="flex flex-col justify-between p-6 rounded-3xl border border-white/90 shadow-md bg-white/90 backdrop-blur-md text-left md:translate-y-2"
                          style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
                                <HeartHandshake className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E]">
                                {aboutForm.values.pillar2Badge || "Personal Host Care"}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] block mb-1">
                              {aboutForm.values.pillar2Tag || "SOUTHERN HOSPITALITY"}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#0B3D5E] mb-2 leading-snug">
                              {aboutForm.values.pillar2Title || "Warm Family Atmosphere"}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-600 mb-4">
                              {aboutForm.values.pillar2Desc || "You are never just a room number here..."}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-100 space-y-1.5 mt-auto">
                            {[aboutForm.values.pillar2Point1, aboutForm.values.pillar2Point2, aboutForm.values.pillar2Point3].map((pt, i) => (
                              <div key={i} className="flex items-start gap-2 text-[10px] text-[#0B3D5E] font-medium">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                                  <Check className="w-2 h-2" />
                                </div>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card 3 */}
                        <div
                          className="flex flex-col justify-between p-6 rounded-3xl border border-white/90 shadow-md bg-white/90 backdrop-blur-md text-left"
                          style={{
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706]">
                                <TrendingUp className="w-5 h-5" />
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E]">
                                {aboutForm.values.pillar3Badge || "Yearly Refinements"}
                              </span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D97706] block mb-1">
                              {aboutForm.values.pillar3Tag || "UNCOMPROMISING COMFORT"}
                            </span>
                            <h4 className="text-base font-serif font-bold text-[#0B3D5E] mb-2 leading-snug">
                              {aboutForm.values.pillar3Title || "Dedicated Season Upgrades"}
                            </h4>
                            <p className="text-[11px] leading-relaxed text-slate-600 mb-4">
                              {aboutForm.values.pillar3Desc || "We continuously reinvest each season into high-pressure rain showers..."}
                            </p>
                          </div>
                          <div className="pt-3 border-t border-slate-100 space-y-1.5 mt-auto">
                            {[aboutForm.values.pillar3Point1, aboutForm.values.pillar3Point2, aboutForm.values.pillar3Point3].map((pt, i) => (
                              <div key={i} className="flex items-start gap-2 text-[10px] text-[#0B3D5E] font-medium">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                                  <Check className="w-2 h-2" />
                                </div>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Host Signature Dock Preview */}
                      <div className="p-4 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-md border border-white/95 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D5E] to-[#052439] flex items-center justify-center text-[#FBBF24] font-serif font-bold text-sm shadow-xs shrink-0">
                            {aboutForm.values.dockMonogram || "OA"}
                          </div>
                          <div>
                            <p className="text-xs font-serif italic text-[#0B3D5E] font-medium leading-tight">
                              {aboutForm.values.dockQuote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”"}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] mt-0.5">
                              {aboutForm.values.dockByline || "The Ocean Air Family • Weligama Bay, Sri Lanka"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-[#0B3D5E]">
                            {aboutForm.values.dockGuarantee || "100% Genuine Hospitality"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 7: FINAL INVITATION CTA */}
              <div data-testid="admin-about-invitation-section" className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0B3D5E]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <Compass className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>About Page • Section 7</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Final Invitation CTA • "Ready to Discover Southern Sri Lanka?"
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically configure high-converting dusk invitation header, two-tone typography, lead narrative, action button, and 3 booking assurance perks.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetAboutInvitationDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveAboutSettings}
                        disabled={updateSetting.isPending}
                        className="rounded-xl bg-gradient-to-r from-[#0B3D5E] to-[#134e7c] hover:from-[#082d46] hover:to-[#0f3d61] text-white shadow-md shadow-[#0B3D5E]/20 gap-2 text-xs font-semibold min-w-[140px]"
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isAboutInvitationSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Invitation CTA</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Header & Typography Controls */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Headline &amp; Lead Narrative
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Eyebrow Badge Text
                        </label>
                        <Input
                          value={aboutForm.invitation.badge}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, badge: e.target.value },
                            }))
                          }
                          placeholder="Your Weligama Escape"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Lead
                        </label>
                        <Input
                          value={aboutForm.invitation.headingLead}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, headingLead: e.target.value },
                            }))
                          }
                          placeholder="Ready to Discover"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Headline Highlight (Italic Gold)
                        </label>
                        <Input
                          value={aboutForm.invitation.headingHighlight}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, headingHighlight: e.target.value },
                            }))
                          }
                          placeholder="Southern Sri Lanka?"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold text-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Lead Narrative Paragraph
                      </label>
                      <Textarea
                        value={aboutForm.invitation.subtitle}
                        onChange={(e) =>
                          setAboutForm((prev) => ({
                            ...prev,
                            invitation: { ...prev.invitation, subtitle: e.target.value },
                          }))
                        }
                        rows={2}
                        placeholder="Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts..."
                        className="rounded-xl bg-white border-slate-200 text-xs font-medium leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Button & 3 Reassurance Perks */}
                  <div className="p-6 rounded-3xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0B3D5E] block">
                      Call-to-Action Button &amp; 3 Booking Perks
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Button Label
                        </label>
                        <Input
                          value={aboutForm.invitation.ctaText}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, ctaText: e.target.value },
                            }))
                          }
                          placeholder="Book Your Experience"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Button Destination Link
                        </label>
                        <Input
                          value={aboutForm.invitation.ctaLink}
                          onChange={(e) =>
                            setAboutForm((prev) => ({
                              ...prev,
                              invitation: { ...prev.invitation, ctaLink: e.target.value },
                            }))
                          }
                          placeholder="/book?new=1"
                          className="rounded-xl bg-white border-slate-200 text-xs font-semibold font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0B3D5E] block mb-2">
                        3 Psychological Reassurance Perks
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Perk 1</label>
                          <Input
                            value={aboutForm.invitation.perk1}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                invitation: { ...prev.invitation, perk1: e.target.value },
                              }))
                            }
                            placeholder="Best Direct Rates Guaranteed"
                            className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Perk 2</label>
                          <Input
                            value={aboutForm.invitation.perk2}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                invitation: { ...prev.invitation, perk2: e.target.value },
                              }))
                            }
                            placeholder="Free 3-Min Beach Walk Location"
                            className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Perk 3</label>
                          <Input
                            value={aboutForm.invitation.perk3}
                            onChange={(e) =>
                              setAboutForm((prev) => ({
                                ...prev,
                                invitation: { ...prev.invitation, perk3: e.target.value },
                              }))
                            }
                            placeholder="100% Flexible Booking Options"
                            className="rounded-xl bg-white border-slate-200 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 8 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#0B3D5E]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E]">
                          Live Real-Time Final Invitation CTA Preview
                        </h4>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                        Exact Dusk Card Replica
                      </span>
                    </div>

                    <div
                      className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center text-white border border-amber-400/30 shadow-2xl"
                      style={{ background: 'linear-gradient(145deg, rgba(7,30,46,0.97) 0%, rgba(11,46,70,0.94) 45%, rgba(18,57,84,0.96) 100%)' }}
                    >
                      {/* Top Gold Accent */}
                      <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

                      <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-[0.25em]">
                          <Compass className="w-3 h-3 text-amber-300" />
                          <span>{aboutForm.invitation.badge || "Your Weligama Escape"}</span>
                        </div>

                        <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                          <span>{aboutForm.invitation.headingLead || "Ready to Discover"} </span>
                          <span className="italic font-normal text-amber-300">
                            {aboutForm.invitation.headingHighlight || "Southern Sri Lanka?"}
                          </span>
                        </h3>

                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-light">
                          {aboutForm.invitation.subtitle || "Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts..."}
                        </p>

                        <div className="pt-2 flex flex-col items-center gap-4">
                          <button
                            type="button"
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
                          >
                            <span>{aboutForm.invitation.ctaText || "Book Your Experience"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-amber-200/80 font-medium pt-1">
                            {[aboutForm.invitation.perk1, aboutForm.invitation.perk2, aboutForm.invitation.perk3].map((item, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-amber-400" /> {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          ) : activeTab === "contact" ? (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              {/* SECTION 1: CONTACT HERO & DIRECT CONCIERGE DOCK */}
              <div className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0B3D5E]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <PhoneCall className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>Contact Page • Section 1</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Contact Hero & Direct Concierge Dock
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Dynamically customize greeting copy, response badges, direct concierge details, and background media.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetContactDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset Defaults</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveContactSettings}
                        disabled={updateSetting.isPending}
                        data-testid="button-save-contact-settings"
                        className={`rounded-xl text-xs font-semibold gap-1.5 shadow-md transition-all ${
                          isContactSavedRecently
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-[#0B3D5E] hover:bg-[#08293f] text-white shadow-[#0B3D5E]/20"
                        }`}
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isContactSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Contact Settings</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* FORM FIELDS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: HERO HEADLINE & BADGES */}
                    <div className="space-y-6">
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Compass className="w-4 h-4 text-[#FBBF24]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Hero Eyebrow & Headline Copy
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Eyebrow Badge Text
                          </label>
                          <input
                            type="text"
                            value={contactForm.hero.badge}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, badge: e.target.value },
                              }))
                            }
                            data-testid="input-contact-hero-badge"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Direct Concierge • 24/7 Island Care"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Lead (White Serif)
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.headingLead}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, headingLead: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-lead"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Let's"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Highlight (Amber Gold)
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.headingHighlight}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, headingHighlight: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-highlight"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Connect"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Hero Narrative / Subtitle
                          </label>
                          <textarea
                            rows={3}
                            value={contactForm.hero.subtitle}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                hero: { ...prev.hero, subtitle: e.target.value },
                              }))
                            }
                            data-testid="input-contact-hero-subtitle"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition leading-relaxed"
                            placeholder="Real people, genuine Sri Lankan hospitality. Whether you're booking direct, organizing an airport transfer, or asking about Weligama waves, we are just a moment away."
                          />
                        </div>
                      </div>

                      {/* QUICK REASSURANCE BADGES & CTAS */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Quick Reassurance Badges & Buttons
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Reassurance Badge 1
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.badge1}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, badge1: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-badge1"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Under 2-Hour Response Time"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Reassurance Badge 2
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.badge2}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, badge2: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-badge2"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Best Direct Booking Guarantee"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Primary CTA Label
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.ctaText}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, ctaText: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-cta"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Send A Message"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              WhatsApp CTA Label
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.whatsappText}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, whatsappText: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-whatsapp-text"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="WhatsApp Direct"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              WhatsApp Number
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.whatsappNumber}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, whatsappNumber: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-whatsapp-number"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition font-mono text-xs"
                              placeholder="94765791763"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: DIRECT CONCIERGE DOCK & MEDIA */}
                    <div className="space-y-6">
                      {/* DIRECT CONCIERGE DOCK / CONTACT BAR */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <PhoneCall className="w-4 h-4 text-[#FBBF24]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Direct Concierge Hotline Bar (Dock)
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#FBBF24]" />
                              <span>Direct Phone Number</span>
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.phone}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, phone: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-phone"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition font-mono text-xs"
                              placeholder="+94 76 579 1763"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <Mail className="w-3.5 h-3.5 text-[#FBBF24]" />
                              <span>Concierge Email</span>
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.email}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, email: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-email"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition font-mono text-xs"
                              placeholder="pelanawhitehouse@gmail.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#FBBF24]" />
                              <span>Location Placemark</span>
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.location}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, location: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-location"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Pelana, Weligama, Sri Lanka"
                            />
                          </div>

                          <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                              <span>Concierge Hours / Support</span>
                            </label>
                            <input
                              type="text"
                              value={contactForm.hero.hours}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, hours: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-hours"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="24/7 Concierge Support"
                            />
                          </div>
                        </div>
                      </div>

                      {/* HERO MEDIA CONTROLS */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Video className="w-4 h-4 text-[#0B3D5E]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Hero Background Video & Poster Media
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Background Video URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={contactForm.hero.videoUrl}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, videoUrl: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-video-url"
                              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="/contact-page-video.mp4"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition">
                              {isUploadingContactVideo ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleContactVideoUpload}
                                disabled={isUploadingContactVideo}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Poster / Fallback Image URL
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={contactForm.hero.poster}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  hero: { ...prev.hero, poster: e.target.value },
                                }))
                              }
                              data-testid="input-contact-hero-poster-url"
                              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="/contact-hero-poster.jpg"
                            />
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition">
                              {isUploadingContactPoster ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleContactPosterUpload}
                                disabled={isUploadingContactPoster}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#FBBF24]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E] uppercase tracking-wider">
                          Real-Time Live Hero & Dock Preview
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Mirrors public Contact page banner & reassurance dock
                      </span>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950 text-white min-h-[460px] flex flex-col justify-between p-6 sm:p-10">
                      {/* Background Media */}
                      {contactForm.hero.videoUrl ? (
                        <video
                          key={contactForm.hero.videoUrl}
                          src={contactForm.hero.videoUrl}
                          poster={contactForm.hero.poster}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      ) : (
                        <img
                          src={contactForm.hero.poster || "/contact-hero-poster.jpg"}
                          alt="Contact Background"
                          className="absolute inset-0 w-full h-full object-cover opacity-50"
                        />
                      )}

                      {/* Luxury Dark Ocean Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0B3D5E]/85 pointer-events-none" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

                      {/* Hero Content */}
                      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto pt-4 sm:pt-8 space-y-4">
                        {/* Eyebrow Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FBBF24] text-xs font-semibold uppercase tracking-[0.2em] shadow-lg">
                          <Compass className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>{contactForm.hero.badge}</span>
                        </div>

                        {/* Grand Serif Headline */}
                        <h2 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight leading-tight">
                          {contactForm.hero.headingLead}{" "}
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706]">
                            {contactForm.hero.headingHighlight}
                          </span>
                        </h2>

                        {/* Narrative Subtitle */}
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal max-w-xl">
                          {contactForm.hero.subtitle}
                        </p>

                        {/* Badges Pill */}
                        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white/90 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#FBBF24]" />
                            {contactForm.hero.badge1}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#FBBF24]" />
                            {contactForm.hero.badge2}
                          </span>
                        </div>

                        {/* Hero CTAs */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <div className="px-5 py-2.5 rounded-full bg-[#FBBF24] text-[#0B3D5E] text-xs sm:text-sm font-bold shadow-lg shadow-[#FBBF24]/30 flex items-center gap-2">
                            <span>{contactForm.hero.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>

                          <div className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/25 backdrop-blur-md flex items-center gap-2">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{contactForm.hero.whatsappText}</span>
                          </div>
                        </div>
                      </div>

                      {/* Concierge Dock / Reassurance Bar */}
                      <div className="relative z-10 mt-8">
                        <div className="max-w-3xl mx-auto rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center sm:text-left">
                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                              <Phone className="w-4 h-4 text-[#FBBF24]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Phone</div>
                              <div className="text-xs font-semibold text-white truncate">{contactForm.hero.phone}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                              <Mail className="w-4 h-4 text-[#FBBF24]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Email</div>
                              <div className="text-xs font-semibold text-white truncate">{contactForm.hero.email}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4 text-[#FBBF24]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Location</div>
                              <div className="text-xs font-semibold text-white truncate">{contactForm.hero.location}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                            <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/20 flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4 text-[#FBBF24]" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Hours</div>
                              <div className="text-xs font-semibold text-white truncate">{contactForm.hero.hours}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: GET IN TOUCH • DIRECT CHANNELS & RESPONSE GUARANTEE */}
              <div className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                {/* Ambient Decorative Accents */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FBBF24]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#0B3D5E]/10 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 space-y-8">
                  {/* Section Title & Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] text-xs font-semibold uppercase tracking-wider mb-2">
                        <MessageSquare className="w-3.5 h-3.5 text-[#FBBF24]" />
                        <span>Contact Page • Section 2</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E]">
                        Get In Touch • Direct Channels & Guaranteed Response
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Customize "We're just a wave away", contact channel tiles (Email, WhatsApp, Google Maps), and response guarantee banner.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResetContactChannelsDefaults}
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset Section Defaults</span>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={handleSaveContactSettings}
                        disabled={updateSetting.isPending}
                        data-testid="button-save-contact-channels"
                        className={`rounded-xl text-xs font-semibold gap-1.5 shadow-md transition-all ${
                          isContactSavedRecently
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-[#0B3D5E] hover:bg-[#08293f] text-white shadow-[#0B3D5E]/20"
                        }`}
                      >
                        {updateSetting.isPending ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : isContactSavedRecently ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-[#FBBF24]" />
                            <span>Save Channel Settings</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* FORM FIELDS GRID */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT COLUMN: HEADLINE, SUBTITLE & RESPONSE GUARANTEE */}
                    <div className="space-y-6">
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Compass className="w-4 h-4 text-[#FBBF24]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Section Eyebrow & Wave Headline Copy
                          </h4>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Eyebrow Badge Text
                          </label>
                          <input
                            type="text"
                            value={contactForm.channels.badge}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                channels: { ...prev.channels, badge: e.target.value },
                              }))
                            }
                            data-testid="input-contact-channel-badge"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                            placeholder="Get In Touch"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Lead (Navy Bold Serif)
                            </label>
                            <input
                              type="text"
                              value={contactForm.channels.headingLead}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, headingLead: e.target.value },
                                }))
                              }
                              data-testid="input-contact-channel-lead"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="We're just a"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Headline Highlight (Amber Wave)
                            </label>
                            <input
                              type="text"
                              value={contactForm.channels.headingHighlight}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, headingHighlight: e.target.value },
                                }))
                              }
                              data-testid="input-contact-channel-highlight"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="wave away."
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Channels Narrative / Subtitle
                          </label>
                          <textarea
                            rows={3}
                            value={contactForm.channels.subtitle}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                channels: { ...prev.channels, subtitle: e.target.value },
                              }))
                            }
                            data-testid="input-contact-channel-subtitle"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition leading-relaxed"
                            placeholder="Whether you're planning your first surf or looking for a long-term sanctuary, our team is ready to assist."
                          />
                        </div>
                      </div>

                      {/* GUARANTEED RESPONSE TRUST CARD */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Guaranteed Response Trust Banner
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Guarantee Badge Title
                            </label>
                            <input
                              type="text"
                              value={contactForm.channels.guaranteeBadge}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, guaranteeBadge: e.target.value },
                                }))
                              }
                              data-testid="input-contact-guarantee-badge"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Guaranteed Response"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Guarantee Text Statement
                            </label>
                            <input
                              type="text"
                              value={contactForm.channels.guaranteeText}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, guaranteeText: e.target.value },
                                }))
                              }
                              data-testid="input-contact-guarantee-text"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E] transition"
                              placeholder="Within 2 hours, every time."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: 3 INTERACTIVE CONTACT METHOD TILES */}
                    <div className="space-y-6">
                      {/* TILE 1: EMAIL US */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Mail className="w-4 h-4 text-[#FBBF24]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Tile 1 • Direct Email Us
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tile Label</label>
                            <input
                              type="text"
                              value={contactForm.channels.emailTitle}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, emailTitle: e.target.value },
                                }))
                              }
                              data-testid="input-contact-email-title"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="Email Us"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Value)</label>
                            <input
                              type="text"
                              value={contactForm.channels.emailValue}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, emailValue: e.target.value },
                                }))
                              }
                              data-testid="input-contact-email-value"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="pelanawhitehouse@gmail.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Clickable Mailto Link</label>
                          <input
                            type="text"
                            value={contactForm.channels.emailLink}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                channels: { ...prev.channels, emailLink: e.target.value },
                              }))
                            }
                            data-testid="input-contact-email-link"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                            placeholder="mailto:pelanawhitehouse@gmail.com"
                          />
                        </div>
                      </div>

                      {/* TILE 2: CALL / WHATSAPP */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Tile 2 • Call / WhatsApp Channel
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tile Label</label>
                            <input
                              type="text"
                              value={contactForm.channels.phoneTitle}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, phoneTitle: e.target.value },
                                }))
                              }
                              data-testid="input-contact-phone-title"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="Call / WhatsApp"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Value)</label>
                            <input
                              type="text"
                              value={contactForm.channels.phoneValue}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, phoneValue: e.target.value },
                                }))
                              }
                              data-testid="input-contact-phone-value"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="+94 76 579 1763"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Clickable WhatsApp Link</label>
                          <input
                            type="text"
                            value={contactForm.channels.phoneLink}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                channels: { ...prev.channels, phoneLink: e.target.value },
                              }))
                            }
                            data-testid="input-contact-phone-link"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                            placeholder="https://wa.me/94765791763"
                          />
                        </div>
                      </div>

                      {/* TILE 3: FIND US / GOOGLE MAPS */}
                      <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60">
                          <MapPin className="w-4 h-4 text-[#0B3D5E]" />
                          <h4 className="text-sm font-bold text-[#0B3D5E]">
                            Tile 3 • Find Us Location & Maps
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tile Label</label>
                            <input
                              type="text"
                              value={contactForm.channels.locationTitle}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, locationTitle: e.target.value },
                                }))
                              }
                              data-testid="input-contact-location-title"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="Find Us"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Location Address</label>
                            <input
                              type="text"
                              value={contactForm.channels.locationValue}
                              onChange={(e) =>
                                setContactForm((prev) => ({
                                  ...prev,
                                  channels: { ...prev.channels, locationValue: e.target.value },
                                }))
                              }
                              data-testid="input-contact-location-value"
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                              placeholder="No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps URL</label>
                          <input
                            type="text"
                            value={contactForm.channels.locationLink}
                            onChange={(e) =>
                              setContactForm((prev) => ({
                                ...prev,
                                channels: { ...prev.channels, locationLink: e.target.value },
                              }))
                            }
                            data-testid="input-contact-location-link"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono focus:ring-2 focus:ring-[#0B3D5E]/20 focus:border-[#0B3D5E]"
                            placeholder="https://www.google.com/maps?q=Ocean%20Air%20Weligama..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REAL-TIME LIVE PREVIEW OF SECTION 2 */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#FBBF24]" />
                        <h4 className="text-sm font-bold text-[#0B3D5E] uppercase tracking-wider">
                          Real-Time Live Preview • Direct Channels & Guarantee
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Mirrors public Contact page "We're just a wave away" column
                      </span>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 p-6 sm:p-10 max-w-2xl mx-auto" style={{ background: 'linear-gradient(160deg, #EEF5FA 0%, #E6EFF6 40%, #EDF2F7 100%)' }}>
                      {/* Ambient Glows */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

                      <div className="relative z-10 space-y-6">
                        {/* Eyebrow Badge */}
                        <div className="inline-flex">
                          <span className="inline-flex items-center gap-2 bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs cursor-default">
                            <MessageCircle className="w-3.5 h-3.5 text-[#D97706]" /> {contactForm.channels.badge}
                          </span>
                        </div>

                        {/* Grand Serif Headline */}
                        <h3 className="text-3xl sm:text-4xl font-serif font-black text-[#0B3D5E] leading-tight">
                          {contactForm.channels.headingLead} <br />
                          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]">
                            {contactForm.channels.headingHighlight}
                          </span>
                        </h3>

                        {/* Narrative Subtitle */}
                        <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                          {contactForm.channels.subtitle}
                        </p>

                        {/* 3 Contact Tiles */}
                        <div className="space-y-3 pt-2">
                          {/* Tile 1: Email */}
                          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/95 border border-white/80 shadow-xs hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[#FBBF24]/30 bg-[#FBBF24]/15">
                              <Mail className="w-5 h-5 text-[#0B3D5E]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] block mb-0.5">
                                {contactForm.channels.emailTitle}
                              </span>
                              <p className="text-sm font-bold text-[#0B3D5E] truncate">
                                {contactForm.channels.emailValue}
                              </p>
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 shrink-0 shadow-2xs">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Tile 2: Phone / WhatsApp */}
                          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/95 border border-white/80 shadow-xs hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-emerald-400/30 bg-emerald-50">
                              <Phone className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] block mb-0.5">
                                {contactForm.channels.phoneTitle}
                              </span>
                              <p className="text-sm font-bold text-[#0B3D5E] truncate">
                                {contactForm.channels.phoneValue}
                              </p>
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 shrink-0 shadow-2xs">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Tile 3: Find Us */}
                          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/95 border border-white/80 shadow-xs hover:shadow-md transition">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[#0B3D5E]/20 bg-[#0B3D5E]/10">
                              <MapPin className="w-5 h-5 text-[#0B3D5E]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#D97706] block mb-0.5">
                                {contactForm.channels.locationTitle}
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-[#0B3D5E] line-clamp-2">
                                {contactForm.channels.locationValue}
                              </p>
                            </div>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-200 bg-white text-slate-500 shrink-0 shadow-2xs">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Guaranteed Response Banner */}
                        <div className="p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/85 backdrop-blur-md flex items-center gap-4 shadow-sm">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#FBBF24]/20 border border-white/80">
                            <ShieldCheck className="w-5 h-5 text-[#D97706]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#D97706] font-black text-[9.5px] uppercase tracking-widest">
                              {contactForm.channels.guaranteeBadge}
                            </span>
                            <span className="text-[#0B3D5E] text-xs sm:text-sm font-bold">
                              {contactForm.channels.guaranteeText}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_60px_rgba(11,61,94,0.06)] p-8 sm:p-14 lg:p-16 overflow-hidden"
            >
              {/* Ambient Warm Golden Glow in top-right */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FBBF24]/10 via-[#FBBF24]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#0B3D5E]/5 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-auto py-8 sm:py-12">
                {/* Elegant Icon Badge */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-slate-50 to-[#FAF9F6] border-2 border-slate-100 flex items-center justify-center mb-6 shadow-md shadow-slate-100 relative group"
                >
                  <div className="absolute inset-0 rounded-[2rem] bg-[#FBBF24]/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                  <ActiveIcon className="w-9 h-9 text-[#0B3D5E] relative z-10" />
                </motion.div>

                {/* Tab Title */}
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#0B3D5E] mb-2 tracking-tight">
                  {currentTab.label} Settings
                </h2>

                {/* Tab Description */}
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                  {currentTab.description}
                </p>

                {activeTab === "about" && (
                  <div className="w-full mb-6 p-5 rounded-2xl bg-[#0B3D5E]/5 border border-[#0B3D5E]/15 text-left space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B3D5E]">
                      <Compass className="w-4 h-4 text-[#FBBF24]" />
                      <span>Direct Channels & Wave Away Settings</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Looking to customize <strong>"We're just a wave away."</strong>, Email, WhatsApp, and Google Maps location? Those channels and guaranteed response badges are managed under the <strong>Contact</strong> settings tab.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setActiveTab("contact")}
                      className="w-full rounded-xl bg-[#0B3D5E] hover:bg-[#08293f] text-white text-xs font-semibold gap-1.5 shadow-md shadow-[#0B3D5E]/20"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#FBBF24]" />
                      <span>Open Contact Tab Channels</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}

                {/* Ready Status Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span>Ready for custom controls</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
