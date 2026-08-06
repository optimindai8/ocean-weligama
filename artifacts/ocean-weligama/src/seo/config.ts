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
    elevation: string;
  };
  contact: {
    telephone: string;
    email: string;
  };
}

export const defaultSEOConfig: SEOConfig = {
  siteName: "Ocean Air Weligama",
  defaultTitle: "Ocean Weligama — #1 Best Weligama Hotel, Beach Villa & Surf Resort Sri Lanka",
  titleTemplate: "%s | Ocean Air Weligama Resort & Hotel",
  defaultDescription:
    "Ocean Air Weligama (welgama hotel) — #1 beachfront luxury boutique hotel, villa & surf sanctuary in Weligama Bay, Sri Lanka. 100 steps from the ocean with luxury rooms, surf lessons, whale watching, scooter rentals & dining. Book direct on .com or .lk for best rate guarantees.",
  defaultKeywords: [
    // Primary Keywords & Exact Searches requested by user
    "Ocean",
    "Weligama",
    "Ocean Weligama",
    "Ocean Air Weligama",
    "Ocean Air Weligama Sri Lanka",
    "Ocean Air Weligama LK",
    "Ocean Air Weligama COM",
    "Ocean Weligama Hotel",
    "Ocean Weligama Resort",
    "Ocean Weligama Villa",

    // Misspellings & High-Volume Search Variations
    "welgama hotel",
    "welgama hotels",
    "welgama villa",
    "welgama resorts",
    "welligama hotel",
    "welligama resorts",
    "welligama beach hotel",
    "welgama surf",
    "welgama sri lanka hotel",

    // Target High-Intent Search Phrases
    "Weligama Hotel",
    "Weligama Hotels",
    "Best Weligama Hotel",
    "Top Hotel in Weligama",
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
    "Weligama Beach House",
    "Weligama Boutique Villa",
    "Weligama Sea View Hotel",

    // Surf, Wellness & Activity Keywords
    "Weligama Surf Hotel",
    "Weligama Surf Camp",
    "Weligama Surf Resort",
    "Surfing Weligama Sri Lanka",
    "Surf Lessons Weligama",
    "Weligama Surf School",
    "Whale Watching Weligama Hotel",
    "Weligama Yoga Retreat",
    "Scooter Rental Weligama",
    "Weligama Airport Transfer",

    // Regional & Multilingual Target Queries
    "Best place to stay in Weligama",
    "Sri Lanka South Coast Luxury Hotel",
    "Barefoot Luxury Sri Lanka",
    "Beachside Boutique Villa Weligama",
    "Weligama Bay Accommodation",
    "Direct Booking Weligama Hotel",
    "Hotel Weligama Sri Lanka",
    "Weligama Unterkünfte",
    "Отель Велигама Шри Ланка",
    "Hôtel Weligama Sri Lanka",
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
    elevation: "3m",
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
