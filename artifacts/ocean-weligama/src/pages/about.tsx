import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Footer } from "@/components/footer";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { TransparentLogo } from "@/components/transparent-logo";
import { 
  MapPin, 
  Heart, 
  Waves, 
  Sun, 
  Anchor, 
  Camera, 
  Compass, 
  Coffee, 
  Utensils, 
  Award, 
  Smile, 
  Sunset,
  TrendingUp, 
  Ship, 
  Bike, 
  Check, 
  ChevronRight, 
  Map,
  ArrowRight,
  Clock,
  Wifi,
  Wind,
  Star,
  ShieldCheck,
  HeartHandshake,
  BadgeCheck,
  Layers,
  CalendarDays,
  BedDouble,
  CheckCircle2,
  UtensilsCrossed
} from "lucide-react";
import { SEO, StructuredData } from "@/seo";
import { useGetSetting } from "@workspace/api-client-react";

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

// Neighborhood spots list with distances and descriptions
const NEIGHBORHOOD_SPOTS = [
  {
    id: "beach",
    name: "Weligama Beach",
    distance: "3 min walk",
    icon: Waves,
    details: "The perfect golden stretch of sand for surfers of all levels. Famous for its consistent, friendly waves and spectacular shallow-water learning areas."
  },
  {
    id: "dining",
    name: "Cafés & Restaurants",
    distance: "1-5 min walk",
    icon: Coffee,
    details: "A food lover's paradise. Stroll to a variety of highly rated spots serving authentic Sri Lankan rice & curry, fresh seafood, and specialty western coffee."
  },
  {
    id: "village",
    name: "Sri Lankan Village Life",
    distance: "On your doorstep",
    icon: MapPin,
    details: "Quiet, peaceful paths away from the bustling main road noise. Walk among swaying coconut trees and experience authentic, warm Sri Lankan village culture."
  },
  {
    id: "surf",
    name: "Surf Breaks & Points",
    distance: "3 min walk",
    icon: Compass,
    details: "Immediate access to local breaks. Whether you're catching your very first wave or seeking hidden points, our spot matches your travel style."
  }
];

// Experience Customizer activity list
const ACTIVITIES = [
  {
    id: "surf-pkg",
    name: "Surf Packages",
    desc: "Complete options designed for different skills, including board rentals & daily coach reviews.",
    icon: Award,
    category: "Adventure"
  },
  {
    id: "yoga",
    name: "Yoga Experiences",
    desc: "Restorative classes on our rooftop, perfect for deep surf recovery and centering your mind.",
    icon: Sun,
    category: "Wellness"
  },
  {
    id: "lessons",
    name: "Surfing Lessons",
    desc: "Step-by-step coaching from friendly, local ISA-certified instructors right at the beach.",
    icon: Waves,
    category: "Adventure"
  },
  {
    id: "whale-watching",
    name: "Whale Watching Tours",
    desc: "Stunning boat trips from neighboring Mirissa Harbor to see majestic blue whales up close.",
    icon: Ship,
    category: "Nature"
  },
  {
    id: "safari",
    name: "Safari Trips",
    desc: "Venture to Udawalawe or Yala National Parks to see wild elephants, leopards, and rich birdlife.",
    icon: NatureIcon,
    category: "Nature"
  },
  {
    id: "cooking",
    name: "Cookery Classes",
    desc: "Learn to grind local spices and cook the perfect, fragrant Sri Lankan rice & coconut curry.",
    icon: Utensils,
    category: "Culture"
  },
  {
    id: "scooters",
    name: "Scooter Rentals",
    desc: "Grab a scooter to explore pristine coastal roads and hidden bays at your own pace.",
    icon: Bike,
    category: "Adventure"
  }
];

// Custom icon for Safari since Compass is used
function NatureIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v12" />
      <path d="M8 10h8" />
      <path d="M8 14h8" />
    </svg>
  );
}

// Heritage Values
const VALUES = [
  {
    icon: ShieldCheck,
    tag: "INDEPENDENT HERITAGE",
    title: "100% Locally Owned & Run",
    desc: "Proudly independent and family-operated. Every booking directly supports Weligama families, local fishermen, surf instructors, and the sustainable vitality of our coastal community.",
    points: [
      "100% Sri Lankan family-owned & operated",
      "Local team hiring with fair living wages",
      "Direct reinvestment into Weligama village"
    ],
    highlight: "Pure Local Roots"
  },
  {
    icon: HeartHandshake,
    tag: "SOUTHERN HOSPITALITY",
    title: "Warm Family Atmosphere",
    desc: "You are never just a room number here. Our family is on-site daily to share authentic homemade breakfast tips, hidden surf breaks, and heartfelt care from check-in to farewell.",
    points: [
      "Genuine hosts living on-site 24/7",
      "Insider guidance for secret uncrowded spots",
      "True island home-away-from-home feeling"
    ],
    highlight: "Personal Host Care"
  },
  {
    icon: TrendingUp,
    tag: "UNCOMPROMISING COMFORT",
    title: "Dedicated Season Upgrades",
    desc: "We continuously reinvest each season into high-pressure rain showers, whisper-quiet air conditioning, luxury orthopedic bedding, and fast fiber Wi-Fi across all spaces.",
    points: [
      "Annual room comfort & amenity enhancements",
      "Whisper-quiet Daikin A/C & rain showers",
      "High-speed fiber connectivity in every space"
    ],
    highlight: "Yearly Refinements"
  }
];

export default function AboutPage() {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [activeRoomTab, setActiveRoomTab] = useState<"basic" | "deluxe">("basic");
  const [sunsetMode, setSunsetMode] = useState<boolean>(false);

  // Dynamic About Hero Settings
  const { data: aboutSetting, refetch: refetchAboutSetting } = useGetSetting("about_settings", {
    query: {
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      staleTime: 0,
    } as any,
  });

  useEffect(() => {
    const handleStorage = () => {
      refetchAboutSetting();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refetchAboutSetting]);
  const heroConfig = (aboutSetting?.value as any)?.hero;
  const storyConfig = (aboutSetting?.value as any)?.story;

  const heroBadge = heroConfig?.badge || "Authentic Island Heritage • 100% Locally Owned";
  const heroHeadingLead = heroConfig?.headingLead || "Our Story &";
  const heroHeadingHighlight = heroConfig?.headingHighlight || "Heritage";
  const heroSubtitle = heroConfig?.subtitle || "Welcome to Ocean Air — your locally owned coastal sanctuary in Weligama Bay, where barefoot luxury, warm Sri Lankan family hospitality, and authentic village living connect.";
  const heroBadge1 = heroConfig?.badge1 || "100% Locally Owned & Operated";
  const heroBadge2 = heroConfig?.badge2 || "100 Steps to Weligama Beach";
  const heroCtaText = heroConfig?.ctaText || "Explore Our Story";
  const heroPerk1 = heroConfig?.perk1 || "100% Locally Owned";
  const heroPerk2 = heroConfig?.perk2 || "3-Min Walk to Surf Break";
  const heroPerk3 = heroConfig?.perk3 || "Warm Family Hospitality";
  const heroPerk4 = heroConfig?.perk4 || "Rooftop Yoga & Sunsets";
  const heroVideoUrl = heroConfig?.videoUrl || "/videos/about-hero-video.mp4";
  const heroPoster = heroConfig?.poster || "/images/about-hero-poster.jpg";

  // Dynamic Story & Neighborhood Settings
  const storyBadge: string = storyConfig?.badge || "The Weligama Spirit";
  const storyHeadingLead: string = storyConfig?.headingLead || "Where Sand, Surf,";
  const storyHeadingHighlight: string = storyConfig?.headingHighlight || "& Local Vibe Connect";
  const storyParagraph1 = storyConfig?.paragraph1 || "Located in a peaceful Sri Lankan coastal enclave just a gentle stroll from the world-famous shores of Weligama Bay, Ocean Air is designed as a sanctuary where barefoot surf lifestyle, deep relaxation, and authentic island warmth naturally intertwine.";
  const storyParagraph2 = storyConfig?.paragraph2 || "Nestled along quiet village pathways away from the bustling main road noise, you enjoy undisturbed tranquility while remaining minutes from popular artisan cafés, beginner-friendly surf breaks, and oceanfront dining. Walk down peaceful local paths to catch the dawn swell, or grab a coffee at nearby hotspots—our boutique escape is built to serve your curiosity.";
  const storyHighlight1Title = storyConfig?.highlight1Title || "3-Min Beach Walk";
  const storyHighlight1Subtitle = storyConfig?.highlight1Subtitle || "Step directly onto gentle sand-bottom surf breaks.";
  const storyHighlight2Title = storyConfig?.highlight2Title || "Family Owned & Run";
  const storyHighlight2Subtitle = storyConfig?.highlight2Subtitle || "Authentic Sri Lankan hospitality, always personal.";
  const storyCtaText = storyConfig?.ctaText || "Plan Your Stay";
  const storyAuthorInitials = storyConfig?.authorInitials || "OA";
  const storyAuthorName = storyConfig?.authorName || "Ocean Air Family Team";
  const storyAuthorLocation = storyConfig?.authorLocation || "Weligama, Sri Lanka";

  const neighborhoodTitle = storyConfig?.neighborhoodTitle || "Explore the Neighborhood";
  const neighborhoodSubtitle = storyConfig?.neighborhoodSubtitle || "Hover or tap on any destination below to discover what surrounds our peaceful tropical escape:";

  const dynamicNeighborhoodSpots = [
    {
      id: "beach",
      name: storyConfig?.spot1Name || "Weligama Beach",
      distance: storyConfig?.spot1Distance || "3 min walk",
      icon: Waves,
      details: storyConfig?.spot1Details || "The perfect golden stretch of sand for surfers of all levels. Famous for its consistent, friendly waves and spectacular shallow-water learning areas."
    },
    {
      id: "dining",
      name: storyConfig?.spot2Name || "Cafés & Restaurants",
      distance: storyConfig?.spot2Distance || "1-5 min walk",
      icon: Coffee,
      details: storyConfig?.spot2Details || "A food lover's paradise. Stroll to a variety of highly rated spots serving authentic Sri Lankan rice & curry, fresh seafood, and specialty western coffee."
    },
    {
      id: "village",
      name: storyConfig?.spot3Name || "Sri Lankan Village Life",
      distance: storyConfig?.spot3Distance || "On your doorstep",
      icon: MapPin,
      details: storyConfig?.spot3Details || "Quiet, peaceful paths away from the bustling main road noise. Walk among swaying coconut trees and experience authentic, warm Sri Lankan village culture."
    },
    {
      id: "surf",
      name: storyConfig?.spot4Name || "Surf Breaks & Points",
      distance: storyConfig?.spot4Distance || "3 min walk",
      icon: Compass,
      details: storyConfig?.spot4Details || "Immediate access to local breaks. Whether you're catching your very first wave or seeking hidden points, our spot matches your travel style."
    }
  ];

  // Dynamic Experience Customizer Settings (Section 3)
  const experienceConfig = (aboutSetting?.value as any)?.experience;
  const expBadge: string = experienceConfig?.badge || "Tailored Travel Styles";
  const expHeadingLead: string = experienceConfig?.headingLead || "Sri Lanka,";
  const expHeadingHighlight: string = experienceConfig?.headingHighlight || "At Your Own Pace";
  const expSubtitle = experienceConfig?.subtitle || "More than accommodation—your southern escape shaped around your personal rhythm. Add any combination of sunrise surf, rooftop yoga, or whale encounters whenever inspiration strikes.";
  const expPill1 = experienceConfig?.pill1 || "Zero Strict Schedules";
  const expPill2 = experienceConfig?.pill2 || "Book Now or On Arrival";
  const expPill3 = experienceConfig?.pill3 || "100% Curated Local Masters";
  const expAddOnsTitle = experienceConfig?.addOnsTitle || "Our Custom Add-Ons";
  const expAddOnsSubtitle = experienceConfig?.addOnsSubtitle || "Select or mix any experiences during your stay";
  const expAddOnsBadge = experienceConfig?.addOnsBadge || "7 Experiences";
  const expTailoredTitle = experienceConfig?.tailoredTitle || "Your Tailored Stay";
  const expTailoredEyebrow = experienceConfig?.tailoredEyebrow || "Bespoke Coastal Concierge";
  const expTailoredDesc = experienceConfig?.tailoredDesc || "Design an island itinerary as spontaneous or structured as you like. Add experiences during reservation or decide once your feet touch the sand.";
  const expBenefit1 = experienceConfig?.benefit1 || "Add during booking or upon arrival";
  const expBenefit2 = experienceConfig?.benefit2 || "Zero strict schedules — enjoy at your pace";
  const expBenefit3 = experienceConfig?.benefit3 || "Premium surfboards & rooftop mats included";
  const expBenefit4 = experienceConfig?.benefit4 || "100% risk-free: modify or cancel anytime";
  const expFreedomTitle = experienceConfig?.freedomTitle || "Unrestricted Duration Freedom";
  const expFreedomText = experienceConfig?.freedomText || "Stay 2 nights or 2 weeks. Custom build an authentic coastal stay that matches your personal budget and rhythm.";
  const expCtaText = experienceConfig?.ctaText || "Explore Curated Packages";

    // Dynamic Sanctuary Switcher Settings (Section 4)
  const sanctuaryConfig = (aboutSetting?.value as any)?.sanctuary;
  const sancBadge: string = sanctuaryConfig?.badge || "Sleep & Sanctuary";
  const sancHeadingLead: string = sanctuaryConfig?.headingLead || "Designed For";
  const sancHeadingHighlight: string = sanctuaryConfig?.headingHighlight || "Every Stay & Budget";
  const sancTab1Label: string = sanctuaryConfig?.tab1Label || "Basic Private Room";
  const sancTab2Label: string = sanctuaryConfig?.tab2Label || "Deluxe Double (Ocean View)";

  // Basic Private Room
  const sancBasicEyebrow: string = sanctuaryConfig?.basicEyebrow || "Cozy Comfort & Value";
  const sancBasicTitle: string = sanctuaryConfig?.basicTitle || "Comfortable Basic Private";
  const sancBasicDescription = sanctuaryConfig?.basicDescription || "Traveling on a budget or looking for quiet, peaceful privacy? Our Basic Private Rooms are prepared with authentic hospitality. Clean, cozy, and quiet, they offer the perfect sanctuary to sleep deeply and recharge after long hours catching waves at Weligama Beach.";
  const sancBasicPerk1 = sanctuaryConfig?.basicPerk1 || "Quiet Village Vibe";
  const sancBasicPerk2 = sanctuaryConfig?.basicPerk2 || "High-Speed Wi-Fi";
  const sancBasicPerk3 = sanctuaryConfig?.basicPerk3 || "Cozy Restful Space";
  const sancBasicPerk4 = sanctuaryConfig?.basicPerk4 || "Daily Housekeeping";
  const sancBasicCtaText = sanctuaryConfig?.basicCtaText || "View Rates";
  const sancBasicGuaranteeText = sanctuaryConfig?.basicGuaranteeText || "Best direct price guarantee";
  const sancBasicImageUrl = sanctuaryConfig?.basicImageUrl || "/images/Comfortable_Basic_Private.jpeg";
  const sancBasicImageBadge = sanctuaryConfig?.basicImageBadge || "Quiet Ground-Floor Village Setting";

  // Deluxe Double (Ocean View)
  const sancDeluxeEyebrow: string = sanctuaryConfig?.deluxeEyebrow || "Elevated Horizon Experience";
  const sancDeluxeTitle: string = sanctuaryConfig?.deluxeTitle || "Deluxe Double With Balcony";
  const sancDeluxeDescription = sanctuaryConfig?.deluxeDescription || "Wake up to tropical light and breathtaking views across the bay. Our top-floor Deluxe Double features a private balcony terrace where ocean breeze and morning coffee start your day right.";
  const sancDeluxePerk1 = sanctuaryConfig?.deluxePerk1 || "Private Ocean Balcony";
  const sancDeluxePerk2 = sanctuaryConfig?.deluxePerk2 || "Panoramic Ocean Views";
  const sancDeluxePerk3 = sanctuaryConfig?.deluxePerk3 || "Whisper-Quiet A/C";
  const sancDeluxePerk4 = sanctuaryConfig?.deluxePerk4 || "Authentic Local Styling";
  const sancDeluxeCtaText = sanctuaryConfig?.deluxeCtaText || "View Rates";
  const sancDeluxeGuaranteeText = sanctuaryConfig?.deluxeGuaranteeText || "Top-floor ocean horizon view";
  const sancDeluxeImageUrl = sanctuaryConfig?.deluxeImageUrl || "/images/Deluxe_Double%20with_Balcony.jpeg";
  const sancDeluxeImageBadge = sanctuaryConfig?.deluxeImageBadge || "Ocean Horizon • Private Balcony Terrace";

  // Dynamic Rooftop Café Atmosphere Shift Settings (Section 5)
  const rooftopConfig = (aboutSetting?.value as any)?.rooftop;
  const roofHeadingLead: string = rooftopConfig?.headingLead || "The Rooftop Café";
  const roofTab1Label = rooftopConfig?.tab1Label || "Morning Vibes";
  const roofTab2Label = rooftopConfig?.tab2Label || "Golden Hour";

  // Morning Mode (Tab 1)
  const roofMorningBadge = rooftopConfig?.morningBadge || "Scenic Culinary Rooftop";
  const roofMorningHeadingHighlight = rooftopConfig?.morningHeadingHighlight || "• Sunrise Roasts & Vistas";
  const roofMorningSubtitle = rooftopConfig?.morningSubtitle || "Wake up to freshly roasted Sri Lankan highland espresso, tropical smoothie bowls, and crisp morning offshore breezes. Check the morning surf sets rolling into Weligama Bay before paddling out into the waves.";
  const roofMorningCard1Tag = rooftopConfig?.morningCard1Tag || "7:00 AM – 11:30 AM";
  const roofMorningCard1Title = rooftopConfig?.morningCard1Title || "Artisan Roasts & Bowls";
  const roofMorningCard1Desc = rooftopConfig?.morningCard1Desc || "Fresh single-origin Ceylon espresso, pour-overs, and organic tropical smoothie bowls crafted to fuel your surf morning.";
  const roofMorningCard2Tag = rooftopConfig?.morningCard2Tag || "180° Panoramic Vantage";
  const roofMorningCard2Title = rooftopConfig?.morningCard2Title || "Dawn Surf Conditions";
  const roofMorningCard2Desc = rooftopConfig?.morningCard2Desc || "Check Weligama Bay wave sets and wind conditions from the highest terrace vantage while enjoying your morning brew.";
  const roofMorningPerk1 = rooftopConfig?.morningPerk1 || "Organic local ingredients";
  const roofMorningPerk2 = rooftopConfig?.morningPerk2 || "High-speed terrace Wi-Fi";
  const roofMorningImageUrl = rooftopConfig?.morningImageUrl || "/images/morning-vibe.png";
  const roofMorningImageTag = rooftopConfig?.morningImageTag || "Morning Sunrise Service";
  const roofMorningDockNote = rooftopConfig?.morningDockNote || "Complimentary breakfast & espresso for resident bookings.";
  const roofMorningDockTime = rooftopConfig?.morningDockTime || "7AM - 11:30AM";

  // Sunset / Golden Hour Mode (Tab 2)
  const roofSunsetBadge = rooftopConfig?.sunsetBadge || "Sunset Horizon Deck";
  const roofSunsetHeadingHighlight = rooftopConfig?.sunsetHeadingHighlight || "• Golden Hour Rhythms";
  const roofSunsetSubtitle = rooftopConfig?.sunsetSubtitle || "As the sun dips below the Indian Ocean horizon, our rooftop transforms into Weligama's premier vantage point. Sip artisanal island cocktails, catch the golden swell glow, and soak in mellow ambient tunes.";
  const roofSunsetCard1Tag = rooftopConfig?.sunsetCard1Tag || "5:00 PM – 9:30 PM";
  const roofSunsetCard1Title = rooftopConfig?.sunsetCard1Title || "Craft Sun-Downers";
  const roofSunsetCard1Desc = rooftopConfig?.sunsetCard1Desc || "Signature island-infused mocktails, fresh coconut elixirs, and tapas paired with ambient dusk beats.";
  const roofSunsetCard2Tag = rooftopConfig?.sunsetCard2Tag || "360° Sunset Horizon";
  const roofSunsetCard2Title = rooftopConfig?.sunsetCard2Title || "Golden Hour Ocean Vista";
  const roofSunsetCard2Desc = rooftopConfig?.sunsetCard2Desc || "Watch the southern sky ignite in vivid shades of amber and magenta with unhindered views straight over the bay.";
  const roofSunsetPerk1 = rooftopConfig?.sunsetPerk1 || "Ambient dusk acoustics";
  const roofSunsetPerk2 = rooftopConfig?.sunsetPerk2 || "Resident VIP seating";
  const roofSunsetImageUrl = rooftopConfig?.sunsetImageUrl || "/images/gallery-sunset.png";
  const roofSunsetImageTag = rooftopConfig?.sunsetImageTag || "Golden Hour Vista Deck";
  const roofSunsetDockNote = rooftopConfig?.sunsetDockNote || "Weligama's premier sunset vista. Resident priority seating.";
  const roofSunsetDockTime = rooftopConfig?.sunsetDockTime || "5PM - 9:30PM";

  // Dynamic Family Values & Heritage Pillars (Section 6)
  const valuesConfig = (aboutSetting?.value as any)?.values;
  const valuesBadge: string = valuesConfig?.badge || "Our Founding Identity";
  const valuesHeadingLead: string = valuesConfig?.headingLead || "Rooted in Weligama,";
  const valuesHeadingHighlight: string = valuesConfig?.headingHighlight || "Driven by Family Values";
  const valuesSubtitle = valuesConfig?.subtitle || "More than a boutique hotel, Ocean Air is our family home shared with travelers worldwide. We combine authentic Southern Sri Lankan warmth with 5-star hospitality standards.";

  // Pillar 1: Pure Local Roots
  const valPillar1Badge = valuesConfig?.pillar1Badge || "Pure Local Roots";
  const valPillar1Tag = valuesConfig?.pillar1Tag || "INDEPENDENT HERITAGE";
  const valPillar1Title = valuesConfig?.pillar1Title || "100% Locally Owned & Run";
  const valPillar1Desc = valuesConfig?.pillar1Desc || "Proudly independent and family-operated. Every booking directly supports Weligama families, local fishermen, surf instructors, and the sustainable vitality of our coastal community.";
  const valPillar1Point1 = valuesConfig?.pillar1Point1 || "100% Sri Lankan family-owned & operated";
  const valPillar1Point2 = valuesConfig?.pillar1Point2 || "Local team hiring with fair living wages";
  const valPillar1Point3 = valuesConfig?.pillar1Point3 || "Direct reinvestment into Weligama village";

  // Pillar 2: Personal Host Care
  const valPillar2Badge = valuesConfig?.pillar2Badge || "Personal Host Care";
  const valPillar2Tag = valuesConfig?.pillar2Tag || "SOUTHERN HOSPITALITY";
  const valPillar2Title = valuesConfig?.pillar2Title || "Warm Family Atmosphere";
  const valPillar2Desc = valuesConfig?.pillar2Desc || "You are never just a room number here. Our family is on-site daily to share authentic homemade breakfast tips, hidden surf breaks, and heartfelt care from check-in to farewell.";
  const valPillar2Point1 = valuesConfig?.pillar2Point1 || "Genuine hosts living on-site 24/7";
  const valPillar2Point2 = valuesConfig?.pillar2Point2 || "Insider guidance for secret uncrowded spots";
  const valPillar2Point3 = valuesConfig?.pillar2Point3 || "True island home-away-from-home feeling";

  // Pillar 3: Dedicated Season Upgrades
  const valPillar3Badge = valuesConfig?.pillar3Badge || "Yearly Refinements";
  const valPillar3Tag = valuesConfig?.pillar3Tag || "UNCOMPROMISING COMFORT";
  const valPillar3Title = valuesConfig?.pillar3Title || "Dedicated Season Upgrades";
  const valPillar3Desc = valuesConfig?.pillar3Desc || "We continuously reinvest each season into high-pressure rain showers, whisper-quiet air conditioning, luxury orthopedic bedding, and fast fiber Wi-Fi across all spaces.";
  const valPillar3Point1 = valuesConfig?.pillar3Point1 || "Annual room comfort & amenity enhancements";
  const valPillar3Point2 = valuesConfig?.pillar3Point2 || "Whisper-quiet Daikin A/C & rain showers";
  const valPillar3Point3 = valuesConfig?.pillar3Point3 || "High-speed fiber connectivity in every space";

  // Host Signature Dock (Integrated into Section 6)
  const signatureConfig = (aboutSetting?.value as any)?.signature;
  const sigMonogram = valuesConfig?.dockMonogram || signatureConfig?.monogram || "OA";
  const sigQuote = valuesConfig?.dockQuote || signatureConfig?.quote || "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”";
  const sigByline = valuesConfig?.dockByline || signatureConfig?.byline || "The Ocean Air Family • Weligama Bay, Sri Lanka";
  const sigGuarantee = valuesConfig?.dockGuarantee || signatureConfig?.guarantee || "100% Genuine Hospitality";

  // Dynamic Final Invitation CTA (Section 7)
  const invitationConfig = (aboutSetting?.value as any)?.invitation;
  const invBadge: string = invitationConfig?.badge || "Your Weligama Escape";
  const invHeadingLead: string = invitationConfig?.headingLead || "Ready to Discover";
  const invHeadingHighlight: string = invitationConfig?.headingHighlight || "Southern Sri Lanka?";
  const invSubtitle = invitationConfig?.subtitle || "Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts, or unwinding under starlit coastal skies—your unforgettable island story begins at Ocean Air.";
  const invCtaText = invitationConfig?.ctaText || "Book Your Experience";
  const invCtaLink = invitationConfig?.ctaLink || "/book?new=1";
  const invPerk1 = invitationConfig?.perk1 || "Best Direct Rates Guaranteed";
  const invPerk2 = invitationConfig?.perk2 || "Free 3-Min Beach Walk Location";
  const invPerk3 = invitationConfig?.perk3 || "100% Flexible Booking Options";

  const dynamicValues = [
    {
      icon: ShieldCheck,
      highlight: valPillar1Badge,
      tag: valPillar1Tag,
      title: valPillar1Title,
      desc: valPillar1Desc,
      points: [valPillar1Point1, valPillar1Point2, valPillar1Point3]
    },
    {
      icon: HeartHandshake,
      highlight: valPillar2Badge,
      tag: valPillar2Tag,
      title: valPillar2Title,
      desc: valPillar2Desc,
      points: [valPillar2Point1, valPillar2Point2, valPillar2Point3]
    },
    {
      icon: TrendingUp,
      highlight: valPillar3Badge,
      tag: valPillar3Tag,
      title: valPillar3Title,
      desc: valPillar3Desc,
      points: [valPillar3Point1, valPillar3Point2, valPillar3Point3]
    }
  ];

  const dynamicActivities = [
    {
      id: "surf-pkg",
      name: experienceConfig?.exp1Name || "Surf Packages",
      desc: experienceConfig?.exp1Desc || "Complete options designed for different skills, including board rentals & daily coach reviews.",
      icon: Award,
      category: experienceConfig?.exp1Category || "Adventure"
    },
    {
      id: "yoga",
      name: experienceConfig?.exp2Name || "Yoga Experiences",
      desc: experienceConfig?.exp2Desc || "Restorative classes on our rooftop, perfect for deep surf recovery and centering your mind.",
      icon: Sun,
      category: experienceConfig?.exp2Category || "Wellness"
    },
    {
      id: "lessons",
      name: experienceConfig?.exp3Name || "Surfing Lessons",
      desc: experienceConfig?.exp3Desc || "Step-by-step coaching from friendly, local ISA-certified instructors right at the beach.",
      icon: Waves,
      category: experienceConfig?.exp3Category || "Adventure"
    },
    {
      id: "whale-watching",
      name: experienceConfig?.exp4Name || "Whale Watching Tours",
      desc: experienceConfig?.exp4Desc || "Stunning boat trips from neighboring Mirissa Harbor to see majestic blue whales up close.",
      icon: Ship,
      category: experienceConfig?.exp4Category || "Nature"
    },
    {
      id: "safari",
      name: experienceConfig?.exp5Name || "Safari Trips",
      desc: experienceConfig?.exp5Desc || "Venture to Udawalawe or Yala National Parks to see wild elephants, leopards, and rich birdlife.",
      icon: NatureIcon,
      category: experienceConfig?.exp5Category || "Nature"
    },
    {
      id: "cooking",
      name: experienceConfig?.exp6Name || "Cookery Classes",
      desc: experienceConfig?.exp6Desc || "Learn to grind local spices and cook the perfect, fragrant Sri Lankan rice & coconut curry.",
      icon: Utensils,
      category: experienceConfig?.exp6Category || "Culture"
    },
    {
      id: "scooters",
      name: experienceConfig?.exp7Name || "Scooter Rentals",
      desc: experienceConfig?.exp7Desc || "Grab a scooter to explore pristine coastal roads and hidden bays at your own pace.",
      icon: Bike,
      category: experienceConfig?.exp7Category || "Adventure"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-white">
      <SEO
        title="Our Story & Heritage — Ocean Air Weligama"
        description="Discover Ocean Air Weligama — a 100% locally owned boutique guest house & villa 100 steps from Weligama Beach in Sri Lanka."
        canonicalPath="/about"
        keywords={["About Ocean Weligama", "Weligama Hotel History", "Locally Owned Weligama Villa", "Ocean Air Weligama Heritage"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Our Story", item: "/about" },
        ]}
      />
      
      {/* Cinematic About Video Hero Section (Exact Same Architecture as FAQ & Blog Pages) */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#052439]">
        {/* Cinematic Video Background */}
        <div className="absolute inset-0 z-0 bg-slate-950">
          <video
            key={heroVideoUrl}
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
            <source src="/videos/Drone_entering_hotel_reception_w…_6b70d88b_1080p.mp4" type="video/mp4" />
          </video>

          {/* Deep coastal ocean overlay for supreme text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#052439]/78 via-[#0B3D5E]/48 to-[#052439]/92" />

          {/* Golden sunrise ambient warmth matching hotel logo yellow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#FBBF24]/18 rounded-full blur-[140px] pointer-events-none" />

          {/* Cinematic radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,36,57,0.55)_100%)] pointer-events-none" />

          {/* Bottom subtle edge fade transitioning smoothly into the neighborhood story section */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />
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
            <Waves className="w-3.5 h-3.5 text-[#FBBF24]" />
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

          {/* Live Heritage Badges Row */}
          <motion.div
            variants={heroSubtitleVariants}
            className="mt-5 flex items-center justify-center gap-3 text-white/80 text-xs font-semibold flex-wrap"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Award className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{heroBadge1}</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>{heroBadge2}</span>
            </div>
          </motion.div>

          {/* Action CTA - From Bottom to Up */}
          <motion.div
            variants={heroCtaVariants}
            className="mt-8 sm:mt-10 flex items-center justify-center relative z-20"
          >
            <button
              onClick={() => {
                const el = document.getElementById("story-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#FBBF24] text-[#0B3D5E] shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:bg-white hover:text-[#0B3D5E] transition-all duration-300 hover:scale-105 group/btn cursor-pointer"
            >
              <span>{heroCtaText}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
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
              <Award className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroPerk1}</span>
            </motion.div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Waves className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroPerk2}</span>
            </motion.div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Heart className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroPerk3}</span>
            </motion.div>
            <div className="hidden lg:block w-px h-4 bg-white/20" />
            <motion.div variants={perkItemVariants} className="flex items-center gap-2 px-3 py-1.5 cursor-default">
              <Sunset className="w-4 h-4 text-[#FBBF24] shrink-0" />
              <span>{heroPerk4}</span>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* The Neighborhood & Introduction Narrative */}
      <section id="story-section" className="py-20 sm:py-28 bg-gradient-to-b from-white via-[#F8FAFC] to-white relative overflow-hidden scroll-mt-20">
        {/* Ambient warm glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#FBBF24]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-sky-200/25 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Story Editorial */}
            <div className="space-y-6 sm:space-y-7">
              {/* Eyebrow Badge - From Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#0B3D5E] text-xs font-black uppercase tracking-widest shadow-xs cursor-default"
              >
                <Compass className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{storyBadge}</span>
              </motion.div>

              {/* Main Headline - Words One by One From Left Side */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] leading-[1.12] tracking-tight">
                <span className="block">
                  {storyHeadingLead.split(" ").filter(Boolean).map((word: string, i: number) => (
                    <motion.span
                      key={`${word}-${i}`}
                      initial={{ opacity: 0, x: -35 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.6, delay: 0.08 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-block mr-2.5 sm:mr-3.5"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
                <span className="block mt-1">
                  {storyHeadingHighlight.split(" ").filter(Boolean).map((word: string, i: number) => (
                    <motion.span
                      key={`${word}-${i}`}
                      initial={{ opacity: 0, x: -35 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.6, delay: 0.32 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-block mr-2.5 sm:mr-3.5 italic text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h2>

              {/* Narrative Story - From Down to Up */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="space-y-4 text-slate-600 text-base sm:text-[17px] leading-relaxed font-normal"
              >
                <p className="text-[#0B3D5E] font-medium leading-relaxed whitespace-pre-line">
                  {storyParagraph1}
                </p>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {storyParagraph2}
                </p>
              </motion.div>

              {/* Psychological Highlights Grid - One by One From Right Side and Upward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <motion.div
                  initial={{ opacity: 0, x: 55, y: 25 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 shadow-2xs hover:shadow-sm transition-shadow duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center shrink-0 text-[#D97706]">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0B3D5E] block">{storyHighlight1Title}</span>
                    <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{storyHighlight1Subtitle}</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 55, y: 25 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.70, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 shadow-2xs hover:shadow-sm transition-shadow duration-300"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0B3D5E]/10 border border-[#0B3D5E]/20 flex items-center justify-center shrink-0 text-[#0B3D5E]">
                    <Heart className="w-4 h-4 text-[#D97706]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0B3D5E] block">{storyHighlight2Title}</span>
                    <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">{storyHighlight2Subtitle}</span>
                  </div>
                </motion.div>
              </div>

              {/* CTA & Host Monogram Row - Button From Left Side */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.82, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <Link href="/book?new=1">
                    <button className="btn-plan-stay cursor-pointer">
                      <span>{storyCtaText}</span>
                      <ArrowRight className="w-4 h-4 btn-plan-stay-icon" />
                    </button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.92, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex items-center gap-3.5 pl-1 sm:pl-0 sm:border-l sm:border-slate-200/90 sm:pl-5"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0B3D5E] text-[#FBBF24] flex items-center justify-center font-serif font-black text-xs shadow-xs border border-white">
                    {storyAuthorInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-[#0B3D5E] text-sm leading-tight">{storyAuthorName}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#D97706] font-black mt-0.5">{storyAuthorLocation}</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Interactive Location Guide Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="relative p-7 sm:p-9 rounded-[2.5rem] bg-white/90 backdrop-blur-2xl border border-white/95 shadow-[0_24px_60px_-15px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.2)] overflow-hidden"
            >
              {/* Ambient Golden and Sky Glows behind card */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/15 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-200/25 blur-[60px] rounded-full pointer-events-none" />
              
              {/* Header - From Right Side */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="relative z-10 flex items-center gap-3 mb-2"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#D97706] shadow-2xs">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight">
                    {neighborhoodTitle}
                  </h3>
                </div>
              </motion.div>

              {/* Subtitle - From Down to Up */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="relative z-10 text-xs sm:text-sm text-slate-500 mb-6 font-normal leading-relaxed"
              >
                {neighborhoodSubtitle}
              </motion.p>

              {/* Destination Cards - One by One From Left Side (Optimized 60fps GPU Pipeline) */}
              <div className="space-y-3 relative z-10">
                {dynamicNeighborhoodSpots.map((spot, idx) => {
                  const Icon = spot.icon;
                  const isHovered = hoveredLocation === spot.id;
                  return (
                    <motion.div
                      key={spot.id}
                      initial={{ opacity: 0, x: -32 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.55, delay: 0.1 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div
                        onMouseEnter={() => setHoveredLocation(spot.id)}
                        onMouseLeave={() => setHoveredLocation(null)}
                        onClick={() => setHoveredLocation(hoveredLocation === spot.id ? null : spot.id)}
                        className={`group relative p-4 sm:p-4.5 rounded-2xl border cursor-pointer overflow-hidden transition-[background-color,border-color,box-shadow,transform] duration-200 ${
                          isHovered 
                            ? "bg-white border-[#FBBF24]/80 shadow-md translate-x-1" 
                            : "bg-white/85 border-slate-200/70 hover:bg-white hover:border-[#FBBF24]/50 shadow-2xs"
                        }`}
                      >
                        {/* Subtle golden inner glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-[#FBBF24]/10 to-transparent transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 shadow-2xs border ${
                              isHovered 
                                ? "bg-[#0B3D5E] border-[#0B3D5E] text-[#FBBF24] scale-105" 
                                : "bg-white border-slate-200/80 text-[#0B3D5E]"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className={`font-bold transition-colors text-sm sm:text-base ${isHovered ? "text-[#0B3D5E]" : "text-slate-800"}`}>
                                {spot.name}
                              </h4>
                              <p className="text-[10px] text-[#D97706] font-black tracking-[0.2em] uppercase mt-0.5">
                                {spot.distance}
                              </p>
                            </div>
                          </div>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isHovered ? "bg-[#FBBF24]/20 text-[#D97706]" : "bg-transparent text-slate-300"
                          }`}>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isHovered ? "rotate-90 scale-110" : ""}`} />
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="relative z-10 overflow-hidden"
                            >
                              <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed font-normal">
                                {spot.details}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Builder Widget ("Sri Lanka at Your Own Pace") */}
      <section data-testid="public-about-experience-section" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4F9FC] to-[#EEF5FA]">
        {/* Ambient Warm Golden & Coastal Blue Lighting */}
        <div className="absolute -top-12 right-1/4 w-96 h-96 bg-[#FBBF24]/12 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-200/35 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-14 sm:mb-16">
            {/* Eyebrow Badge - From Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#FBBF24]/50 shadow-[0_4px_20px_rgba(251,191,36,0.18)] mb-4 cursor-default"
            >
              <div className="w-5 h-5 rounded-full bg-[#FBBF24]/20 flex items-center justify-center text-[#D97706]">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0B3D5E]">
                {expBadge}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            </motion.div>

            {/* Main Headline - Words One by One From Left Side */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-serif font-black text-[#0B3D5E] tracking-tight leading-[1.14]">
              <span className="inline-block">
                {expHeadingLead.split(" ").filter(Boolean).map((word: string, i: number) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.08 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2 sm:mr-3"
                  >
                    {word}{" "}
                  </motion.span>
                ))}
              </span>{" "}
              <span className="inline-block">
                {expHeadingHighlight.split(" ").filter(Boolean).map((word: string, i: number) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.24 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2 sm:mr-3 italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]"
                  >
                    {word}{" "}
                  </motion.span>
                ))}
              </span>
            </h2>

            {/* Subtitle / Psychological Narrative - From Down to Up */}
            <motion.p
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="text-slate-600 mt-4 max-w-2xl mx-auto text-base sm:text-[17px] leading-relaxed font-normal whitespace-pre-line"
            >
              {expSubtitle}
            </motion.p>

            {/* Psychological Reassurance Trust Pills - One by One From Left Side */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, x: -45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700 backdrop-blur-xs"
              >
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{expPill1}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700 backdrop-blur-xs"
              >
                <Waves className="w-3.5 h-3.5 text-[#0B3D5E]" />
                <span>{expPill2}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.65, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700 backdrop-blur-xs"
              >
                <BadgeCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{expPill3}</span>
              </motion.div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Interactive Selector list - Uncluttered, Luxury, Logo Main Color Harmonized */}
            <div className="lg:col-span-7 space-y-3.5">
              {/* Add-Ons Header - From Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 55 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/70"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#D97706] shadow-2xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0B3D5E]">
                      {expAddOnsTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {expAddOnsSubtitle}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#D97706] bg-[#FBBF24]/15 border border-[#FBBF24]/30 px-3 py-1 rounded-full shadow-2xs">
                  {expAddOnsBadge}
                </span>
              </motion.div>

              {/* Add-Ons Cards - One by One From Left Side (Optimized 60/120fps Silky Smooth) */}
              <div className="grid gap-3">
                {dynamicActivities.map((activity, idx) => {
                  const Icon = activity.icon;

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -32 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.55, delay: 0.06 + idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <div className="group relative flex items-center justify-between gap-4 p-4 sm:p-4.5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(11,61,94,0.04)] hover:border-[#FBBF24] hover:shadow-[0_12px_28px_-6px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.35)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden">
                        {/* Subtle Warm Amber Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FBBF24]/8 via-[#FBBF24]/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                        <div className="flex items-center gap-3.5 sm:gap-4 relative z-10 flex-1 min-w-0">
                          {/* Luxury Icon Badge - Inverts to Navy & Gold on Hover */}
                          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FBBF24]/15 border border-[#FBBF24]/35 text-[#0B3D5E] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#0B3D5E] group-hover:border-[#0B3D5E] group-hover:text-[#FBBF24] transition-all duration-200 group-hover:scale-105">
                            <Icon className="w-5 h-5 transition-transform duration-200" />
                          </div>

                          {/* Title & Description */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className="font-serif font-bold text-[#0B3D5E] group-hover:text-[#052439] text-sm sm:text-base tracking-tight transition-colors">
                                {activity.name}
                              </h4>
                              <span className="text-[10px] font-black uppercase tracking-[0.16em] px-2 py-0.5 rounded-full bg-amber-50 text-[#D97706] border border-amber-200/70 group-hover:bg-[#FBBF24]/20 group-hover:border-[#FBBF24]/50 transition-colors">
                                {activity.category}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2 font-normal">
                              {activity.desc}
                            </p>
                          </div>
                        </div>

                        {/* Right Action Affordance - Interactive Golden Chevron Pill */}
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100/80 border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-[#FBBF24] group-hover:border-[#FBBF24] group-hover:text-[#0B3D5E] group-hover:shadow-xs transition-all duration-200 shrink-0 relative z-10">
                          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Info sidebar - Transparent Luxury Glassmorphism Matched to Brand Gold & Navy */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="relative overflow-hidden rounded-[2.5rem] p-7 sm:p-9 bg-white/85 backdrop-blur-2xl border border-white/95 shadow-[0_24px_60px_-15px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.25)]"
              >
                {/* Ambient Warm Golden & Azure Backdrops */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/15 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-200/25 blur-[60px] rounded-full pointer-events-none" />
                
                {/* Header */}
                <div className="relative z-10 flex items-center gap-3 mb-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="w-10 h-10 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/40 flex items-center justify-center text-[#D97706] shadow-2xs shrink-0"
                  >
                    <Compass className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <motion.h3 
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="text-xl sm:text-2xl font-serif font-black text-[#0B3D5E] tracking-tight"
                    >
                      {expTailoredTitle}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0, x: -40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="text-[11px] text-[#D97706] font-black uppercase tracking-widest mt-0.5"
                    >
                      {expTailoredEyebrow}
                    </motion.p>
                  </div>
                </div>

                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="relative z-10 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal whitespace-pre-line"
                >
                  {expTailoredDesc}
                </motion.p>

                {/* 4 Psychological Benefits */}
                <div className="relative z-10 border-t border-slate-200/80 pt-5 mb-6 space-y-3">
                  {[
                    expBenefit1,
                    expBenefit2,
                    expBenefit3,
                    expBenefit4,
                  ].map((benefit, idx) => (
                    <motion.div 
                      key={benefit}
                      initial={{ opacity: 0, x: -35 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.65, delay: 0.32 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/35 flex items-center justify-center text-[#D97706] shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Unrestricted Flexibility Banner */}
                <div className="relative z-10 bg-gradient-to-r from-amber-50/90 to-yellow-50/80 p-4 rounded-2xl mb-7 border border-[#FBBF24]/35 text-xs text-slate-700 leading-relaxed shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="shrink-0 mt-0.5"
                    >
                      <CalendarDays className="w-4 h-4 text-[#D97706]" />
                    </motion.div>
                    <div>
                      <motion.strong 
                        initial={{ opacity: 0, x: 45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.75, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: "transform, opacity" }}
                        className="text-[#0B3D5E] font-bold block"
                      >
                        {expFreedomTitle}
                      </motion.strong>
                      <motion.span 
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.75, delay: 0.73, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: "transform, opacity" }}
                        className="text-slate-600 mt-0.5 block leading-relaxed whitespace-pre-line"
                      >
                        {expFreedomText}
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* CTA Button - Uiverse by Ali-Tahmazi99 Skew Blades Animation */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="relative z-10"
                >
                  <Link href="/packages" className="block">
                    <button className="btn-curated-packages group">
                      <span className="btn-curated-packages__text">
                        <span>{expCtaText}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                      </span>
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sanctuary Switcher (Basic Private vs Deluxe Ocean View) */}
      <section data-testid="public-about-sanctuary-section" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-[#EEF5FA] via-[#FAF8F5] to-white">
        {/* Soft Ambient Warm & Coastal Backgrounds */}
        <div className="absolute top-10 right-0 w-[550px] h-[550px] bg-[#FBBF24]/12 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[550px] h-[550px] bg-sky-200/25 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-8">
            <div>
              {/* Eyebrow Badge - From Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#FBBF24]/50 shadow-[0_4px_20px_rgba(251,191,36,0.18)] mb-3 cursor-default"
              >
                <div className="w-5 h-5 rounded-full bg-[#FBBF24]/20 flex items-center justify-center text-[#D97706]">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0B3D5E]">
                  {sancBadge}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              </motion.div>

              {/* Main Headline - Words One by One From Left Side */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#0B3D5E] tracking-tight leading-[1.12]">
                <span className="inline-block">
                  {sancHeadingLead.split(" ").filter(Boolean).map((word: string, i: number) => (
                    <motion.span
                      key={`${word}-${i}`}
                      initial={{ opacity: 0, x: -35 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-block mr-2.5 sm:mr-3.5"
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </span>
                <span className="inline-block">
                  {sancHeadingHighlight.split(" ").filter(Boolean).map((word: string, i: number) => (
                    <motion.span
                      key={`${word}-${i}`}
                      initial={{ opacity: 0, x: -35 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: 0.22 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-block mr-2.5 sm:mr-3.5 italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#0B3D5E]"
                    >
                      {word}{" "}
                    </motion.span>
                  ))}
                </span>
              </h2>
            </div>

            {/* Premium Frosted Room tab triggers - Strictly Single Row with whitespace-nowrap, From Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 55 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="relative p-1.5 rounded-full flex items-center shrink-0 self-start md:self-end bg-white/90 border border-slate-200/80 shadow-[0_4px_20px_rgba(11,61,94,0.06)] backdrop-blur-md max-w-full overflow-x-auto no-scrollbar"
            >
              <button
                onClick={() => setActiveRoomTab("basic")}
                className={`relative z-10 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer ${
                  activeRoomTab === "basic" 
                    ? "text-[#FBBF24] shadow-md" 
                    : "text-slate-600 hover:text-[#0B3D5E]"
                }`}
              >
                {activeRoomTab === "basic" && (
                  <motion.div 
                    layoutId="activeTabBg" 
                    className="absolute inset-0 bg-[#0B3D5E] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="whitespace-nowrap">{sancTab1Label}</span>
              </button>
              <button
                onClick={() => setActiveRoomTab("deluxe")}
                className={`relative z-10 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer ${
                  activeRoomTab === "deluxe" 
                    ? "text-[#FBBF24] shadow-md" 
                    : "text-slate-600 hover:text-[#0B3D5E]"
                }`}
              >
                {activeRoomTab === "deluxe" && (
                  <motion.div 
                    layoutId="activeTabBg" 
                    className="absolute inset-0 bg-[#0B3D5E] rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="whitespace-nowrap">{sancTab2Label}</span>
              </button>
            </motion.div>
          </div>

          <div className="relative p-7 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] bg-white/85 backdrop-blur-2xl border border-white/95 shadow-[0_24px_70px_-15px_rgba(11,61,94,0.08),0_0_0_1px_rgba(251,191,36,0.22)] overflow-hidden">
            {/* Ambient Golden & Azure Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FBBF24]/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-200/25 blur-[80px] rounded-full pointer-events-none" />

            <AnimatePresence mode="wait">
              {activeRoomTab === "basic" ? (
                <motion.div
                  key="basic-room"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 grid lg:grid-cols-12 gap-8 sm:gap-14 items-center"
                >
                  <div className="lg:col-span-5 space-y-6">
                    {/* Badge - From Right Side */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-[#D97706] text-[10px] font-black uppercase tracking-widest shadow-2xs"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>{sancBasicEyebrow}</span>
                    </motion.div>

                    {/* Headline - Words One by One From Left Side */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight">
                      {sancBasicTitle.split(" ").filter(Boolean).map((word: string, i: number) => (
                        <motion.span
                          key={`${word}-${i}`}
                          initial={{ opacity: 0, x: -35 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, amount: 0.15 }}
                          transition={{ duration: 0.6, delay: 0.18 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          style={{ willChange: "transform, opacity" }}
                          className="inline-block mr-2 sm:mr-3"
                        >
                          {word}{" "}
                        </motion.span>
                      ))}
                    </h3>

                    {/* Paragraph - From Down to Up */}
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal"
                    >
                      {sancBasicDescription}
                    </motion.p>

                    {/* 4 Cards - One by One From Left Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200/80 pt-6">
                      {[
                        { title: sancBasicPerk1, icon: Compass },
                        { title: sancBasicPerk2, icon: Wifi },
                        { title: sancBasicPerk3, icon: Heart },
                        { title: sancBasicPerk4, icon: CheckCircle2 },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: -35 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.6, delay: 0.42 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 shadow-2xs hover:border-[#FBBF24]/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/35 flex items-center justify-center text-[#D97706] shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-[#0B3D5E]">{item.title}</span>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Button - From Left Side */}
                      <motion.div
                        initial={{ opacity: 0, x: -45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: "transform, opacity" }}
                      >
                        <Link href="/rooms">
                          <button className="btn-view-rates group">
                            <span>{sancBasicCtaText}</span>
                            <ArrowRight className="w-4 h-4 btn-view-rates-icon" />
                          </button>
                        </Link>
                      </motion.div>
                      {/* Price Note - From Right Side */}
                      <motion.span
                        initial={{ opacity: 0, x: 45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: "transform, opacity" }}
                        className="text-xs text-slate-500 font-semibold flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-[#10B981]" /> {sancBasicGuaranteeText}
                      </motion.span>
                    </div>
                  </div>

                  {/* Image - From Right Side */}
                  <div className="lg:col-span-7">
                    <motion.div
                      initial={{ opacity: 0, x: 55 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(11,61,94,0.15)] bg-slate-100 border-4 border-white/90 group"
                    >
                      <img
                        src={sancBasicImageUrl}
                        alt={sancBasicTitle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/30 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/95 shadow-md flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                        <span className="text-xs font-bold text-[#0B3D5E]">{sancBasicImageBadge}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="deluxe-room"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 grid lg:grid-cols-12 gap-8 sm:gap-14 items-center"
                >
                  <div className="lg:col-span-5 space-y-6">
                    {/* Badge - From Right Side */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBBF24]/20 border border-[#FBBF24]/40 text-[#D97706] text-[10px] font-black uppercase tracking-widest shadow-2xs"
                    >
                      <Sunset className="w-3.5 h-3.5" />
                      <span>{sancDeluxeEyebrow}</span>
                    </motion.div>

                    {/* Headline - Words One by One From Left Side */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#0B3D5E] tracking-tight">
                      {sancDeluxeTitle.split(" ").filter(Boolean).map((word: string, i: number) => (
                        <motion.span
                          key={`${word}-${i}`}
                          initial={{ opacity: 0, x: -35 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false, amount: 0.15 }}
                          transition={{ duration: 0.6, delay: 0.18 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          style={{ willChange: "transform, opacity" }}
                          className="inline-block mr-2 sm:mr-3"
                        >
                          {word}{" "}
                        </motion.span>
                      ))}
                    </h3>

                    {/* Paragraph - From Down to Up */}
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal"
                    >
                      {sancDeluxeDescription}
                    </motion.p>

                    {/* 4 Cards - One by One From Left Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200/80 pt-6">
                      {[
                        { title: sancDeluxePerk1, icon: Sunset },
                        { title: sancDeluxePerk2, icon: Waves },
                        { title: sancDeluxePerk3, icon: Wind },
                        { title: sancDeluxePerk4, icon: Award },
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.title}
                            initial={{ opacity: 0, x: -35 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.6, delay: 0.42 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 shadow-2xs hover:border-[#FBBF24]/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/20 border border-[#FBBF24]/35 flex items-center justify-center text-[#D97706] shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-[#0B3D5E]">{item.title}</span>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Button - From Left Side */}
                      <motion.div
                        initial={{ opacity: 0, x: -45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: "transform, opacity" }}
                      >
                        <Link href="/rooms">
                          <button className="btn-view-rates group">
                            <span>{sancDeluxeCtaText}</span>
                            <ArrowRight className="w-4 h-4 btn-view-rates-icon" />
                          </button>
                        </Link>
                      </motion.div>
                      {/* View note - From Right Side */}
                      <motion.span
                        initial={{ opacity: 0, x: 45 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: "transform, opacity" }}
                        className="text-xs text-slate-500 font-semibold flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-[#10B981]" /> {sancDeluxeGuaranteeText}
                      </motion.span>
                    </div>
                  </div>

                  {/* Image - From Right Side */}
                  <div className="lg:col-span-7">
                    <motion.div
                      initial={{ opacity: 0, x: 55 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(11,61,94,0.15)] bg-slate-100 border-4 border-white/90 group"
                    >
                      <img
                        src={sancDeluxeImageUrl}
                        alt={sancDeluxeTitle}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/30 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/95 shadow-md flex items-center gap-2">
                        <Waves className="w-3.5 h-3.5 text-[#D97706]" />
                        <span className="text-xs font-bold text-[#0B3D5E]">{sancDeluxeImageBadge}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

{/* Rooftop Café Vibe Shift Simulator */}
      <section data-testid="public-about-rooftop-section" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EEF5FA 0%, #E6EFF6 40%, #EDF2F7 100%)' }}>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Shiftable glassmorphism container block */}
          <div 
            className={`relative p-6 sm:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[3rem] transition-all duration-700 shadow-2xl overflow-hidden border ${
              sunsetMode 
                ? "border-amber-400/25 shadow-[0_32px_90px_rgba(7,30,46,0.45)]" 
                : "border-white/85 shadow-[0_32px_80px_rgba(11,61,94,0.08)]"
            }`}
            style={{
              background: sunsetMode 
                ? 'linear-gradient(140deg, rgba(7,30,46,0.96) 0%, rgba(11,46,70,0.93) 50%, rgba(18,57,84,0.95) 100%)' 
                : 'linear-gradient(140deg, rgba(255,255,255,0.94) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)'
            }}
          >
            {/* Ambient warm amber & ocean navy glow orbs */}
            <div className={`absolute top-0 right-0 w-[450px] h-[450px] blur-[130px] rounded-full transition-all duration-700 pointer-events-none ${
              sunsetMode ? "bg-amber-500/25" : "bg-amber-300/15"
            }`} />
            <div className={`absolute bottom-0 left-0 w-[450px] h-[450px] blur-[130px] rounded-full transition-all duration-700 pointer-events-none ${
              sunsetMode ? "bg-orange-600/20" : "bg-[#0B3D5E]/10"
            }`} />
            
            {/* Top gold accent line */}
            <div className={`absolute top-0 left-12 right-12 h-px transition-colors duration-700 ${
              sunsetMode 
                ? "bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" 
                : "bg-gradient-to-r from-transparent via-amber-400/35 to-transparent"
            }`} />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Text & Features column */}
              <div className="lg:col-span-6 space-y-6">
                {/* Eyebrow badge - From Right Side */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex items-center gap-2.5"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sunsetMode ? "sunset-badge" : "morning-badge"}
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex items-center gap-2.5"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                        sunsetMode 
                          ? "bg-amber-500/15 border-amber-400/30 text-amber-300 shadow-sm shadow-amber-500/20" 
                          : "bg-amber-500/10 border-amber-500/20 text-[#D97706] shadow-sm"
                      }`}>
                        {sunsetMode ? <Sunset className="w-4 h-4 text-amber-400" /> : <Coffee className="w-4 h-4 text-[#D97706]" />}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-300 ${
                        sunsetMode ? "text-amber-300" : "text-[#D97706]"
                      }`}>
                        {sunsetMode ? roofSunsetBadge : roofMorningBadge}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Editorial Headline - Words One by One From Left Side & Smooth Subtitle Swap */}
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-[1.15] tracking-tight transition-colors duration-500 ${
                  sunsetMode ? "text-white" : "text-[#0B3D5E]"
                }`}>
                  <span className="inline-block">
                    {roofHeadingLead.split(" ").filter(Boolean).map((word: string, i: number) => (
                      <motion.span
                        key={`${word}-${i}`}
                        initial={{ opacity: 0, x: -35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.15 }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        style={{ willChange: "transform, opacity" }}
                        className="inline-block mr-2 sm:mr-3"
                      >
                        {word}{" "}
                      </motion.span>
                    ))}
                  </span>
                  {" "}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={sunsetMode ? "sunset-sub" : "morning-sub"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      style={{ willChange: "transform, opacity" }}
                      className={`inline-block italic font-normal text-2xl sm:text-3xl lg:text-4xl ${
                        sunsetMode ? "text-amber-300" : "text-[#D97706]"
                      }`}
                    >
                      {sunsetMode ? roofSunsetHeadingHighlight : roofMorningHeadingHighlight}
                    </motion.span>
                  </AnimatePresence>
                </h2>

                {/* Narrative description - From Down to Up & Smooth Crossfade on Swap */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={sunsetMode ? "sunset-desc" : "morning-desc"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.26, ease: "easeOut" }}
                      style={{ willChange: "transform, opacity" }}
                      className={`text-sm sm:text-base leading-relaxed font-normal min-h-[4.5rem] sm:min-h-[3.8rem] transition-colors duration-300 ${
                        sunsetMode ? "text-slate-200/90" : "text-slate-600"
                      }`}
                    >
                      {sunsetMode ? roofSunsetSubtitle : roofMorningSubtitle}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>

                {/* Atmosphere switcher dock - Sliding Magnetic Pill Indicator */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                  <motion.span
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.7, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] shrink-0 transition-colors duration-300 ${
                      sunsetMode ? "text-amber-200/80" : "text-slate-400"
                    }`}
                  >
                    Atmosphere Shift:
                  </motion.span>
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.7, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className={`p-1.5 rounded-full flex items-center border transition-all duration-300 self-start sm:self-auto overflow-x-auto whitespace-nowrap shrink-0 relative ${
                      sunsetMode 
                        ? "bg-black/40 border-white/15 shadow-inner" 
                        : "bg-slate-100/90 border-slate-200/90 shadow-inner"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSunsetMode(false)}
                      className={`relative z-10 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                        !sunsetMode 
                          ? "text-white" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {!sunsetMode && (
                        <motion.div
                          layoutId="activeAtmosphereTab"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          className="absolute inset-0 rounded-full bg-[#0B3D5E] shadow-md shadow-[#0B3D5E]/25 -z-10"
                        />
                      )}
                      <Sun className={`w-3.5 h-3.5 ${!sunsetMode ? "text-amber-400" : "text-slate-400"}`} />
                      <span>{roofTab1Label}</span>
                      {!sunsetMode && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSunsetMode(true)}
                      className={`relative z-10 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                        sunsetMode 
                          ? "text-white" 
                          : "text-slate-600 hover:text-[#0B3D5E]"
                      }`}
                    >
                      {sunsetMode && (
                        <motion.div
                          layoutId="activeAtmosphereTab"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-md shadow-amber-500/35 -z-10"
                        />
                      )}
                      <Sunset className={`w-3.5 h-3.5 ${sunsetMode ? "text-white" : "text-slate-400"}`} />
                      <span>{roofTab2Label}</span>
                      {sunsetMode && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </button>
                  </motion.div>
                </div>

                {/* Dynamic Dual Feature Cards - One by One From Left Side */}
                <div className="pt-2 min-h-[160px]">
                  <AnimatePresence mode="wait">
                    {!sunsetMode ? (
                      <motion.div
                        key="morning-features"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: 15, transition: { duration: 0.18 } }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Card 1: Sunrise Roasts & Bowls - From Left Side */}
                          <motion.div
                            initial={{ opacity: 0, x: -45 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="p-4 rounded-2xl bg-white/90 border border-white/95 hover:border-amber-300/60 shadow-sm transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#D97706] group-hover:scale-105 transition-transform">
                                <Coffee className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706] block">
                                  {roofMorningCard1Tag}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-[#0B3D5E]">
                                  {roofMorningCard1Title}
                                </h4>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-normal">
                              {roofMorningCard1Desc}
                            </p>
                          </motion.div>

                          {/* Card 2: Dawn Bay Surf Watch - One by One From Left Side */}
                          <motion.div
                            initial={{ opacity: 0, x: -45 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.65, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="p-4 rounded-2xl bg-white/90 border border-white/95 hover:border-amber-300/60 shadow-sm transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-7 h-7 rounded-lg bg-[#0B3D5E]/10 border border-[#0B3D5E]/15 flex items-center justify-center text-[#0B3D5E] group-hover:scale-105 transition-transform">
                                <Waves className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#0B3D5E] block">
                                  {roofMorningCard2Tag}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-[#0B3D5E]">
                                  {roofMorningCard2Title}
                                </h4>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-normal">
                              {roofMorningCard2Desc}
                            </p>
                          </motion.div>
                        </div>

                        {/* Reassurance Micro-Strip - One by One From Down to Up */}
                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium pt-1">
                          <motion.span
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.65, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" /> {roofMorningPerk1}
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.15 }}
                            transition={{ duration: 0.65, delay: 0.50, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="inline-flex items-center gap-1.5 text-slate-600 font-semibold"
                          >
                            <Wifi className="w-3.5 h-3.5 text-[#0B3D5E]" /> {roofMorningPerk2}
                          </motion.span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="sunset-features"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: 15, transition: { duration: 0.18 } }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {/* Card 1: Sunset Sundowners - From Left Side */}
                          <motion.div
                            initial={{ opacity: 0, x: -45 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:border-amber-400/40 shadow-sm transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                                <UtensilsCrossed className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                                  {roofSunsetCard1Tag}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-white">
                                  {roofSunsetCard1Title}
                                </h4>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                              {roofSunsetCard1Desc}
                            </p>
                          </motion.div>

                          {/* Card 2: 360° Sunset Panorama - One by One From Left Side */}
                          <motion.div
                            initial={{ opacity: 0, x: -45 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:border-amber-400/40 shadow-sm transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                                <Sunset className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                                  {roofSunsetCard2Tag}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-white">
                                  {roofSunsetCard2Title}
                                </h4>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                              {roofSunsetCard2Desc}
                            </p>
                          </motion.div>
                        </div>

                        {/* Reassurance Micro-Strip - One by One From Down to Up */}
                        <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium pt-1">
                          <motion.span
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="inline-flex items-center gap-1.5 text-amber-300 font-semibold"
                          >
                            <Check className="w-3.5 h-3.5 text-amber-400" /> {roofSunsetPerk1}
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.50, ease: [0.16, 1, 0.3, 1] }}
                            style={{ willChange: "transform, opacity" }}
                            className="inline-flex items-center gap-1.5 text-slate-300 font-semibold"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-300" /> {roofSunsetPerk2}
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Photo & Showcase frame - From Right Side */}
              <div className="lg:col-span-6">
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className={`relative p-2 sm:p-2.5 rounded-[2.5rem] border transition-all duration-700 shadow-2xl overflow-hidden ${
                    sunsetMode 
                      ? "bg-white/10 border-white/20 shadow-[0_24px_60px_rgba(0,0,0,0.4)]" 
                      : "bg-white/60 border-white/80 shadow-[0_24px_60px_rgba(11,61,94,0.12)]"
                  }`}
                >
                  <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-900">
                    {/* Morning Image Layer - Crossfades without blank flash */}
                    <motion.div
                      animate={{ 
                        opacity: !sunsetMode ? 1 : 0, 
                        scale: !sunsetMode ? 1 : 1.04 
                      }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      <img
                        src={roofMorningImageUrl}
                        alt="Morning Rooftop Atmosphere"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D5E]/60 via-transparent to-black/20 pointer-events-none" />
                    </motion.div>

                    {/* Sunset Image Layer - Crossfades without blank flash */}
                    <motion.div
                      animate={{ 
                        opacity: sunsetMode ? 1 : 0, 
                        scale: sunsetMode ? 1 : 1.04 
                      }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      <img
                        src={roofSunsetImageUrl}
                        alt="Sunset Rooftop Atmosphere"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#051824]/80 via-transparent to-black/30 pointer-events-none" />
                    </motion.div>

                    {/* Floating Top Badge - From Down to Up & Text Crossfade */}
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-white/95 shadow-md"
                    >
                      <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${sunsetMode ? "bg-amber-500 animate-pulse" : "bg-emerald-500 animate-pulse"}`} />
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={sunsetMode ? "sunset-badge-text" : "morning-badge-text"}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2 }}
                          className="text-[11px] font-bold text-[#0B3D5E] tracking-tight inline-block"
                        >
                          {sunsetMode ? roofSunsetImageTag : roofMorningImageTag}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>

                    {/* Floating Bottom Reassurance Dock - From Down to Up & Content Crossfade */}
                    <motion.div
                      initial={{ opacity: 0, y: 35 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.75, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ willChange: "transform, opacity" }}
                      className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-white/95 border border-white/95 shadow-lg flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#D97706] shrink-0">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={sunsetMode ? "sunset-icon" : "morning-icon"}
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.7 }}
                              transition={{ duration: 0.2 }}
                            >
                              {sunsetMode ? <Sunset className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={sunsetMode ? "sunset-dock-p" : "morning-dock-p"}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.25 }}
                            className="text-[11px] sm:text-xs font-medium text-[#0B3D5E] leading-snug truncate sm:whitespace-normal"
                          >
                            {sunsetMode ? roofSunsetDockNote : roofMorningDockNote}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={sunsetMode ? "sunset-time" : "morning-time"}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.2 }}
                          className="hidden sm:inline-flex text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0B3D5E]/10 text-[#0B3D5E] shrink-0"
                        >
                          {sunsetMode ? roofSunsetDockTime : roofMorningDockTime}
                        </motion.span>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Locally Owned & Family Heritage section */}
      <section data-testid="public-about-values-section" className="py-20 sm:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #E6EFF6 40%, #EEF5FA 100%)' }}>
        {/* Soft ambient brand orbs */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-amber-200/20 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-sky-200/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-14 sm:mb-18">
            {/* Eyebrow Badge - From Right Side */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-amber-200/60 text-[#D97706] text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-sm mb-4"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#D97706]" /> {valuesBadge}
            </motion.div>

            {/* Editorial Headline - Words One by One From Left Side */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#0B3D5E] tracking-tight">
              <span className="inline-block">
                {valuesHeadingLead.split(" ").filter(Boolean).map((word: string, i: number) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.12 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2.5 sm:mr-3.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              {" "}
              <span className="inline-block">
                {valuesHeadingHighlight.split(" ").filter(Boolean).map((word: string, i: number) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.33 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2.5 sm:mr-3.5 italic font-normal text-[#D97706]"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h2>

            {/* Subtitle Paragraph - From Down to Up */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="text-slate-600 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-normal"
            >
              {valuesSubtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4 pb-4">
            {dynamicValues.map((val, idx) => {
              const Icon = val.icon;
              const isUp = idx === 0 || idx === 2; // Up, Down, Up pattern

              return (
                <motion.div
                  key={`${val.title}-${idx}`}
                  initial={{ opacity: 0, y: isUp ? -80 : 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: 0.12 + idx * 0.16, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className={isUp ? "md:-translate-y-5" : "md:translate-y-6"}
                >
                  <div
                    className="group relative h-full flex flex-col justify-between text-left p-8 sm:p-9 rounded-[2.5rem] border border-white/90 backdrop-blur-2xl shadow-[0_16px_45px_rgba(11,61,94,0.06)] hover:shadow-[0_28px_65px_rgba(11,61,94,0.12)] transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1.5 overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(246,251,254,0.88) 50%, rgba(240,247,253,0.92) 100%)',
                      willChange: 'transform, box-shadow'
                    }}
                  >
                    {/* Subtle top amber hairline glow on hover */}
                    <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Ambient radial glow on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem]"
                      style={{ background: 'radial-gradient(circle at top center, rgba(251, 191, 36, 0.12) 0%, transparent 70%)' }}
                    />

                    <div className="relative z-10">
                      {/* Top row: Icon emblem & Highlight badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-[#D97706] shadow-sm group-hover:scale-105 group-hover:bg-[#0B3D5E] group-hover:text-[#FBBF24] group-hover:border-[#0B3D5E] transition-all duration-300">
                          <Icon className="w-6 h-6 transition-colors duration-300" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0B3D5E]/5 text-[#0B3D5E] border border-[#0B3D5E]/10 group-hover:border-amber-400/40 group-hover:bg-amber-50 group-hover:text-[#D97706] transition-all duration-300">
                          {val.highlight}
                        </span>
                      </div>

                      {/* Category Micro-tag */}
                      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#D97706] block mb-2">
                        {val.tag}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B3D5E] mb-3 leading-snug">
                        {val.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal mb-6">
                        {val.desc}
                      </p>
                    </div>

                    {/* Structured Proof Points Checklist */}
                    <div className="relative z-10 pt-5 border-t border-slate-100/90 space-y-2.5 mt-auto">
                      {val.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-[#0B3D5E] font-medium leading-relaxed">
                          <div className="w-4 h-4 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[#D97706]">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Family Host Signature & Reassurance Dock */}
          <motion.div
            data-testid="public-about-signature-dock"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform, opacity" }}
            className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-[2rem] bg-white/85 backdrop-blur-2xl border border-white/95 shadow-[0_16px_45px_rgba(11,61,94,0.06)] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
          >
            <div className="flex items-center gap-4 text-left flex-1 min-w-0">
              {/* OA Monogram Badge - Smooth Pop */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B3D5E] to-[#052439] flex items-center justify-center text-[#FBBF24] font-serif font-bold text-lg shadow-md shrink-0"
              >
                {sigMonogram}
              </motion.div>
              <div className="min-w-0">
                {/* Quote Text - From Right Side */}
                <motion.p
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-xs sm:text-sm font-serif italic text-[#0B3D5E] font-medium leading-snug"
                >
                  {sigQuote}
                </motion.p>
                {/* Family Byline - From Left Side */}
                <motion.p
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.75, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ willChange: "transform, opacity" }}
                  className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mt-1"
                >
                  {sigByline}
                </motion.p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-between sm:justify-start">
              {/* 5 Stars - Filling Little by Little Slowly with Golden Yellow */}
              <div className="relative inline-flex items-center">
                {/* Background: Unfilled Base Stars */}
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-3.5 h-3.5 fill-slate-200/70 text-slate-300" 
                    />
                  ))}
                </div>

                {/* Foreground: Golden Yellow Stars Filling Smoothly and Slowly from Left to Right */}
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ 
                    duration: 1.9, 
                    delay: 0.45, 
                    ease: "easeInOut" 
                  }}
                  style={{ willChange: "width" }}
                  className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                >
                  <div className="flex items-center gap-1.5 w-max">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] drop-shadow-[0_1px_3px_rgba(245,158,11,0.4)]" 
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
              {/* Guarantee text */}
              <motion.span
                initial={{ opacity: 0, x: 45 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="text-xs font-bold text-[#0B3D5E] whitespace-nowrap"
              >
                {sigGuarantee}
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final Invitation Call to Action */}
      <section data-testid="public-about-invitation-section" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EDF2F7 0%, #EEF5FA 100%)' }}>
        {/* Subtle background ambient glows matching brand */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-200/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0B3D5E]/10 blur-[130px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-6xl mx-auto rounded-[3rem] sm:rounded-[4rem] overflow-hidden text-center text-white shadow-[0_36px_90px_rgba(7,30,46,0.45)] border border-amber-400/25 backdrop-blur-2xl"
          style={{ background: 'linear-gradient(145deg, rgba(7,30,46,0.97) 0%, rgba(11,46,70,0.94) 45%, rgba(18,57,84,0.96) 100%)' }}
        >
          {/* Top Gold Accent Line */}
          <div className="absolute top-0 left-16 right-16 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none" />

          {/* Golden Sunset Halo at Top */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-b from-amber-500/25 via-amber-500/10 to-transparent blur-[80px] pointer-events-none rounded-full" />

          {/* OCEAN AIR LOGO WATERMARK - Centered in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.12, 0.18, 0.12]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] flex items-center justify-center"
            >
              <TransparentLogo 
                src="/images/logo.jpg" 
                className="w-full h-full object-contain brightness-0 invert drop-shadow-[0_0_50px_rgba(251,191,36,0.35)]" 
              />
            </motion.div>
          </div>

          {/* Decorative Corner Nautical Wave & Sun Vectors */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 4, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 left-8 sm:top-12 sm:left-12 text-amber-400/10 pointer-events-none"
          >
            <Waves className="w-28 h-28 sm:w-40 sm:h-40" />
          </motion.div>
          
          <motion.div 
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -4, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-8 right-8 sm:bottom-12 sm:right-12 text-[#FBBF24]/10 pointer-events-none"
          >
            <Sun className="w-32 h-32 sm:w-48 sm:h-48" />
          </motion.div>

          {/* Shimmer sweep overlay across card body */}
          <motion.div
            className="absolute inset-0 w-[40%] pointer-events-none z-0"
            style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(251,191,36,0.06) 50%, transparent 100%)', skewX: '-15deg' }}
            animate={{ x: ['-200%', '350%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', repeatDelay: 5 }}
          />

          <div className="relative z-10 px-6 sm:px-12 py-18 sm:py-24 max-w-4xl mx-auto">
            {/* Eyebrow Badge - From Right Side */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-[0.25em] backdrop-blur-md shadow-sm">
                <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                <span>{invBadge}</span>
              </div>
            </motion.div>

            {/* Editorial Dynamic Headline - Words One by One From Left Side */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight leading-[1.15] drop-shadow-md">
              <span className="inline-block mr-3">
                {invHeadingLead.split(" ").filter(Boolean).map((word: string, i: number) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.14 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-block mr-2.5 sm:mr-4"
                  >
                    {word}{" "}
                  </motion.span>
                ))}
              </span>
              <br className="hidden sm:inline" />
              <span className="inline-block italic font-normal text-amber-300 drop-shadow-sm pr-4">
                {invHeadingHighlight.split(" ").filter(Boolean).map((word: string, i: number) => (
                  <motion.span
                    key={`${word}-${i}`}
                    initial={{ opacity: 0, x: -35 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.6, delay: 0.36 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className={`inline-block mr-2.5 sm:mr-4 ${i === invHeadingHighlight.split(" ").length - 1 ? "pr-4" : ""}`}
                  >
                    {word}{" "}
                  </motion.span>
                ))}
              </span>
            </h2>
            
            {/* Lead Narrative - From Down to Up */}
            <motion.p 
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ delay: 0.55, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: "transform, opacity" }}
              className="text-slate-200 text-sm sm:text-base md:text-lg mb-10 sm:mb-12 leading-relaxed max-w-2xl mx-auto font-light"
            >
              {invSubtitle}
            </motion.p>
            
            {/* High-Converting Radiant CTA Button & Reassurance Strip */}
            <div className="flex flex-col items-center gap-6">
              {/* Button - From Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ delay: 0.68, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
                className="relative inline-block"
              >
                <Link href={invCtaLink} className="inline-block">
                  <button type="button" className="animated-cta-button">
                    <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                      />
                    </svg>
                    <span className="text">{invCtaText}</span>
                    <span className="circle" />
                    <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                      />
                    </svg>
                  </button>
                </Link>
              </motion.div>

              {/* Psychological Reassurance Strip below Button */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-amber-200/80 font-medium pt-2">
                {[invPerk1, invPerk2, invPerk3].map((item, idx) => (
                  <motion.span
                    key={`${item}-${idx}`}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{ duration: 0.65, delay: 0.78 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-400" /> {item}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
