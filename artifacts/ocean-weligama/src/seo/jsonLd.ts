import { defaultSEOConfig, getCanonicalUrl } from "./config";

/**
 * Generates Google Rich Snippet JSON-LD for Hotel / LodgingBusiness / Resort / BedAndBreakfast.
 * Implements complete Google Search Central lodging specifications including reviews,
 * aggregate ratings, amenities, opening hours, checkin/checkout times, and geo-coordinates.
 */
export function generateHotelSchema() {
  const baseUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": ["Hotel", "Resort", "LodgingBusiness", "BedAndBreakfast"],
    "@id": `${baseUrl}#hotel`,
    name: defaultSEOConfig.siteName,
    alternateName: [
      "Ocean Weligama",
      "Ocean Air Weligama",
      "Ocean Air Weligama Hotel & Villa",
      "Ocean Air Weligama Villa",
      "Ocean Weligama Hotel",
      "Weligama Hotel",
      "welgama hotel",
      "Ocean Air Sri Lanka",
    ],
    description: defaultSEOConfig.defaultDescription,
    url: baseUrl,
    sameAs: [
      defaultSEOConfig.primaryDomainLk,
      defaultSEOConfig.primaryDomainSriLanka,
      "https://www.facebook.com/profile.php?id=61583921572390",
      "https://www.instagram.com/oceanairweligama",
      "https://www.tiktok.com/@oceanairweligama",
    ],
    telephone: defaultSEOConfig.contact.telephone,
    email: defaultSEOConfig.contact.email,
    logo: `${baseUrl}images/logo.jpg`,
    image: [
      `${baseUrl}images/hero-video-poster.jpg`,
      `${baseUrl}images/logo.jpg`,
      `${baseUrl}images/service-stay.png`,
      `${baseUrl}images/opengraph.jpg`,
    ],
    priceRange: "$$",
    starRating: {
      "@type": "Rating",
      ratingValue: "4.9",
      bestRating: "5",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1050",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Sarah Jenkins" },
        datePublished: "2026-02-14",
        reviewBody:
          "The most peaceful week of my life. Waking up to the sound of waves and walking straight onto the sand is an unmatched experience. 100 steps to the surf break!",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "David Mueller" },
        datePublished: "2026-01-28",
        reviewBody:
          "Outstanding barefoot luxury in Weligama. The surf coaching with certified instructors was top notch and the sea-view suites are sparkling clean.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Elena Rostova" },
        datePublished: "2026-03-05",
        reviewBody:
          "Magical sunsets, delicious tropical Sri Lankan breakfasts, and friendly, genuine hosts. Direct booking gave us airport transfer perks. Highly recommended!",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
    ],
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "35",
      highPrice: "250",
      priceCurrency: "USD",
      offerCount: "12",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}rooms`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: defaultSEOConfig.location.streetAddress,
      addressLocality: defaultSEOConfig.location.addressLocality,
      addressRegion: defaultSEOConfig.location.addressRegion,
      postalCode: defaultSEOConfig.location.postalCode,
      addressCountry: defaultSEOConfig.location.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: defaultSEOConfig.location.latitude,
      longitude: defaultSEOConfig.location.longitude,
      elevation: defaultSEOConfig.location.elevation,
    },
    hasMap: "https://www.google.com/maps?q=Ocean+Air+Weligama+No+42+jayasayurupura+pelana+Weligama+Sri+Lanka",
    checkinTime: "14:00",
    checkoutTime: "11:00",
    currenciesAccepted: "USD, EUR, GBP, LKR, AUD",
    paymentAccepted: "Cash, Credit Card, Visa, MasterCard, Direct Bank Transfer",
    petsAllowed: false,
    knowsLanguage: ["English", "German", "Russian", "French", "Sinhala"],
    areaServed: [
      "Weligama",
      "Mirissa",
      "Midigama",
      "Ahangama",
      "Matara",
      "Southern Province",
      "Sri Lanka",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Beachfront Access (100 steps from Weligama Beach)", value: true },
      { "@type": "LocationFeatureSpecification", name: "High-Speed Fiber Optical Wi-Fi (100+ Mbps)", value: true },
      { "@type": "LocationFeatureSpecification", name: "ISA Certified Surf Coaching & Board Rentals", value: true },
      { "@type": "LocationFeatureSpecification", name: "Private Scooter & Motorbike Rentals", value: true },
      { "@type": "LocationFeatureSpecification", name: "Blue Whale Watching & Marine Safaris in Mirissa", value: true },
      { "@type": "LocationFeatureSpecification", name: "Morning Oceanfront Yoga & Wellness Retreats", value: true },
      { "@type": "LocationFeatureSpecification", name: "Airport Pick-up & Drop-off Transfers (BIA & Mattala)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Daily Housekeeping & Fresh Bed Linens", value: true },
      { "@type": "LocationFeatureSpecification", name: "Hot Water Showers & Air Conditioned Rooms", value: true },
      { "@type": "LocationFeatureSpecification", name: "Complimentary Sri Lankan & Continental Breakfast", value: true },
      { "@type": "LocationFeatureSpecification", name: "Secure Free On-Site Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "24/7 Front Desk & Concierge Care", value: true },
    ],
  };
}

/**
 * Generates Google Rich Snippet JSON-LD for HotelRoom (/rooms/:slug).
 */
export function generateRoomSchema(room: {
  slug: string;
  name: string;
  description?: string | null;
  heroImageUrl?: string | null;
  basePrice?: string | number | null;
  maxGuests?: number | null;
  bedType?: string | null;
  amenities?: string[] | null;
}) {
  const baseUrl = getCanonicalUrl("/");
  const roomUrl = `${baseUrl}rooms/${room.slug}`;
  const roomImage = room.heroImageUrl
    ? (room.heroImageUrl.startsWith("http") ? room.heroImageUrl : `${baseUrl}${room.heroImageUrl.replace(/^\//, "")}`)
    : `${baseUrl}images/service-stay.png`;

  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    "@id": `${roomUrl}#room`,
    name: `${room.name} — Ocean Air Weligama`,
    description: room.description || `Luxury accommodation ${room.name} at Ocean Air Weligama, 100 steps from the surf break in Weligama Bay Sri Lanka.`,
    url: roomUrl,
    image: [roomImage],
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.maxGuests || 2,
      unitText: "Guests",
    },
    bed: {
      "@type": "BedDetails",
      numberOfBeds: 1,
      typeOfBed: room.bedType || "King Bed or Twin Beds",
    },
    amenityFeature: (room.amenities || [
      "Free High-Speed Wi-Fi",
      "Air Conditioning",
      "Private Balcony / Terrace",
      "Hot Water Rain Shower",
      "Daily Housekeeping",
      "100 Steps from Surf Beach",
    ]).map((am) => ({
      "@type": "LocationFeatureSpecification",
      name: am,
      value: true,
    })),
    offers: {
      "@type": "Offer",
      price: String(room.basePrice || "45"),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
      url: roomUrl,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(room.basePrice || "45"),
        priceCurrency: "USD",
        unitText: "Per Night",
      },
    },
    isPartOf: {
      "@type": "Hotel",
      "@id": `${baseUrl}#hotel`,
      name: defaultSEOConfig.siteName,
    },
  };
}

/**
 * Generates Google Rich Snippet JSON-LD for BlogPosting / Article (/blog/:id).
 */
export function generateBlogPostSchema(blog: {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  image?: string | null;
  author?: string | null;
  date?: string | null;
  category?: string | null;
  updatedAt?: string | null;
}) {
  const baseUrl = getCanonicalUrl("/");
  const blogUrl = `${baseUrl}blog/${blog.id}`;
  const blogImage = blog.image
    ? (blog.image.startsWith("http") ? blog.image : `${baseUrl}${blog.image.replace(/^\//, "")}`)
    : `${baseUrl}images/blog-hero-poster.jpg`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${blogUrl}#article`,
    headline: blog.title,
    description: blog.description || blog.title,
    url: blogUrl,
    image: [blogImage],
    datePublished: blog.date || "2026-01-15T08:00:00+05:30",
    dateModified: blog.updatedAt || blog.date || "2026-08-01T12:00:00+05:30",
    inLanguage: "en-US",
    articleSection: blog.category || "Sri Lanka Travel & Surfing",
    author: {
      "@type": "Person",
      name: blog.author || "Ocean Air Weligama Editorial Team",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: defaultSEOConfig.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}images/logo.jpg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
  };
}

/**
 * Generates Google Rich Snippet JSON-LD for TouristTrip / Service (/packages/:slug).
 */
export function generatePackageSchema(service: {
  slug: string;
  name: string;
  description?: string | null;
  price?: string | number | null;
  category?: string | null;
  features?: string[] | null;
}) {
  const baseUrl = getCanonicalUrl("/");
  const packageUrl = `${baseUrl}packages/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": ["TouristTrip", "Service"],
    "@id": `${packageUrl}#service`,
    name: `${service.name} — Ocean Air Weligama Experiences`,
    description: service.description || `Curated ${service.name} experience at Ocean Air Weligama. Luxury ocean stay, certified coaching, and custom southern Sri Lanka adventures.`,
    url: packageUrl,
    provider: {
      "@type": "Hotel",
      "@id": `${baseUrl}#hotel`,
      name: defaultSEOConfig.siteName,
    },
    touristType: ["Surfers", "Couples", "Solo Travelers", "Ocean Enthusiasts", "Families"],
    offers: {
      "@type": "Offer",
      price: String(service.price || "65"),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: packageUrl,
    },
  };
}

/**
 * Generates Google ImageGallery Schema (/gallery).
 */
export function generateImageGallerySchema(items?: { url: string; title?: string }[]) {
  const baseUrl = getCanonicalUrl("/");
  const galleryUrl = `${baseUrl}gallery`;

  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${galleryUrl}#gallery`,
    name: "Ocean Air Weligama Visual Gallery — Barefoot Beach Luxury",
    description: "Visual tour of Ocean Air Weligama, beachfront rooms, surf breaks, and coastal sunsets in Weligama Bay, Sri Lanka.",
    url: galleryUrl,
    primaryImageOfPage: `${baseUrl}images/hero-video-poster.jpg`,
    isPartOf: {
      "@type": "Hotel",
      "@id": `${baseUrl}#hotel`,
    },
  };
}

/**
 * Generates Google WebSite Schema for Sitelinks SearchBox.
 */
export function generateWebSiteSchema() {
  const baseUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    url: baseUrl,
    name: defaultSEOConfig.siteName,
    alternateName: ["Ocean Weligama", "Ocean Air Weligama", "Ocean Air Sri Lanka", "welgama hotel"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}rooms?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates Google BreadcrumbList JSON-LD.
 */
export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.item.startsWith("http") ? it.item : getCanonicalUrl(it.item),
    })),
  };
}

/**
 * Generates Google FAQPage JSON-LD.
 */
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates Organization Schema.
 */
export function generateOrganizationSchema() {
  const baseUrl = getCanonicalUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    name: defaultSEOConfig.siteName,
    url: baseUrl,
    logo: `${baseUrl}images/logo.jpg`,
    sameAs: [
      defaultSEOConfig.primaryDomainLk,
      defaultSEOConfig.primaryDomainSriLanka,
      "https://www.facebook.com/profile.php?id=61583921572390",
      "https://www.instagram.com/oceanairweligama",
      "https://www.tiktok.com/@oceanairweligama",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: defaultSEOConfig.contact.telephone,
      contactType: "customer service",
      availableLanguage: ["English", "German", "Russian", "French", "Sinhala"],
    },
  };
}
