export interface SEOConfig {
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultKeywords: string[];
  primaryDomainCom: string;
  primaryDomainLk: string;
  defaultOgImage: string;
  twitterHandle: string;
  location: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    latitude: number;
    longitude: number;
  };
  contact: {
    telephone: string;
    email: string;
  };
}

export const defaultSEOConfig: SEOConfig = {
  siteName: "Ocean Air Weligama",
  defaultTitle: "Ocean Weligama — #1 Boutique Luxury Resort, Hotel & Surf Sanctuary in Weligama",
  titleTemplate: "%s | Ocean Air Weligama Resort & Villa",
  defaultDescription:
    "Experience Ocean Weligama — Sri Lanka's premier beachfront luxury boutique hotel, villa & surf sanctuary in Weligama Bay. 100 steps from the ocean with world-class rooms, surf lessons, wellness & dining. Book directly on .com or .lk for best rate guarantees.",
  defaultKeywords: [
    // Brand & Core Keywords
    "Ocean",
    "Weligama",
    "Ocean Weligama",
    "Ocean Air Weligama",
    "Ocean Air Weligama Sri Lanka",
    "Ocean Air Weligama LK",
    "Ocean Air Weligama COM",
    "Ocean Weligama Hotel",
    "Ocean Weligama Resort",

    // Location & Accommodation Keywords
    "Weligama Hotel",
    "Weligama Hotels",
    "Weligama Villa",
    "Weligama Villas",
    "Weligama Resort",
    "Weligama Resorts",
    "Weligama Beach Hotel",
    "Weligama Guest House",
    "Weligama Accommodation",
    "Weligama Beachfront Hotel",
    "Luxury Hotel Weligama",
    "Boutique Hotel Weligama",
    "Pelana Weligama Hotel",
    "Jayasayurupura Weligama",

    // Surf & Experience Keywords
    "Weligama Surf Hotel",
    "Weligama Surf Camp",
    "Surfing Weligama Sri Lanka",
    "Surf Lessons Weligama",
    "Weligama Surf School",
    "Whale Watching Weligama",
    "Weligama Yoga Retreat",
    "Scooter Rental Weligama",

    // General Tourism & Regional Keywords
    "Best place to stay in Weligama",
    "Sri Lanka South Coast Luxury Hotel",
    "Barefoot Luxury Sri Lanka",
    "Beachside Boutique Villa Weligama",
    "Weligama Bay Accommodation",
    "Direct Booking Weligama Hotel",
  ],
  primaryDomainCom: "https://oceanairweligama.com",
  primaryDomainLk: "https://oceanairweligama.lk",
  defaultOgImage: "https://oceanairweligama.com/logo.jpg",
  twitterHandle: "@oceanairweligama",
  location: {
    streetAddress: "No 42 Jayasayurupura Pelana",
    addressLocality: "Weligama",
    addressRegion: "Southern Province",
    postalCode: "81700",
    addressCountry: "LK",
    latitude: 5.9723,
    longitude: 80.4286,
  },
  contact: {
    telephone: "+94765791763",
    email: "pelanawhitehouse@gmail.com",
  },
};

/**
 * Resolves canonical URL ensuring both .com and .lk domains unify link authority cleanly.
 */
export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.endsWith(".lk")) {
      return `${defaultSEOConfig.primaryDomainLk}${cleanPath}`;
    }
  }
  return `${defaultSEOConfig.primaryDomainCom}${cleanPath}`;
}
