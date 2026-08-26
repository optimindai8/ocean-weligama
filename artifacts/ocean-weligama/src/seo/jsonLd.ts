import { defaultSEOConfig, getCanonicalUrl } from "./config";

/**
 * Generates Google Rich Snippet JSON-LD for Hotel / LodgingBusiness / Resort / BedAndBreakfast.
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
    logo: `${baseUrl}logo.jpg`,
    image: [
      `${baseUrl}hero-video-poster.jpg`,
      `${baseUrl}logo.jpg`,
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
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "35",
      highPrice: "250",
      priceCurrency: "USD",
      offerCount: "5",
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
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Beachfront Access (100 steps from Ocean)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free High-Speed Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Surf Lessons & Equipment Rental", value: true },
      { "@type": "LocationFeatureSpecification", name: "Scooter Rental Services", value: true },
      { "@type": "LocationFeatureSpecification", name: "Whale Watching Tours", value: true },
      { "@type": "LocationFeatureSpecification", name: "Yoga & Wellness Retreats", value: true },
      { "@type": "LocationFeatureSpecification", name: "Airport Pickup & Drop Transfers", value: true },
      { "@type": "LocationFeatureSpecification", name: "Sri Lankan & International Dining", value: true },
    ],
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
    name: defaultSEOConfig.siteName,
    url: baseUrl,
    logo: `${baseUrl}logo.jpg`,
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
      availableLanguage: ["English", "German", "Russian", "French"],
    },
  };
}
