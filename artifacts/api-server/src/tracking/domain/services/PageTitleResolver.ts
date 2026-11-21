export interface PageDisplayInfo {
  title: string;
  category: string;
}

const STATIC_PAGE_MAP: Record<string, PageDisplayInfo> = {
  "/": {
    title: "Home Page",
    category: "Main Portal",
  },
  "": {
    title: "Home Page",
    category: "Main Portal",
  },
  "/about": {
    title: "About Ocean Weligama",
    category: "Hotel Sanctuary",
  },
  "/contact": {
    title: "Contact & Concierge",
    category: "Guest Inquiries",
  },
  "/rooms": {
    title: "Rooms & Accommodations",
    category: "Sanctuary Suites",
  },
  "/packages": {
    title: "Packages & Special Offers",
    category: "Curated Stays",
  },
  "/experiences": {
    title: "Curated Experiences",
    category: "Adventures & Activities",
  },
  "/gallery": {
    title: "Visual Gallery",
    category: "Photo Showcase",
  },
  "/booking": {
    title: "Booking & Reservations",
    category: "Direct Reservation",
  },
  "/booking-confirmation": {
    title: "Booking Confirmation",
    category: "Direct Reservation",
  },
  "/faq": {
    title: "Frequently Asked Questions",
    category: "Support & FAQ",
  },
  "/blog": {
    title: "Journal & Stories",
    category: "Editorial Articles",
  },
  "/privacy": {
    title: "Privacy Policy",
    category: "Legal & Compliance",
  },
  "/terms": {
    title: "Terms & Conditions",
    category: "Legal & Compliance",
  },
};

const KNOWN_ROOM_NAMES: Record<string, string> = {
  "sunset-suite": "Sunset Suite (Room No 12)",
  "deluxe-ocean-view": "Deluxe Private Room with Ocean View & Balcony (Room No 09)",
  "private-beach-villa": "Deluxe Private Room with Ocean View & Balcony (Room No 10)",
  "deluxe-private-room-with-ocean-view-balcony-room-no-11": "Deluxe Private Room with Ocean View & Balcony (Room No 11)",
  "standard-twin-rooms-1st-floor-two-person": "Standard Twin Rooms - 1st Floor (2 Persons)",
  "deluxe-private-room-with-ocean-view-balcony-room-no-09-one-person": "Deluxe Private Room with Ocean View (Room No 09 - 1 Person)",
  "standard-private-rooms-ground-floor": "Standard Private Rooms - Ground Floor (2 Persons)",
  "standard-private-rooms-1st-floor-two-person": "Standard Private Rooms - 1st Floor (2 Persons)",
  "standard-private-rooms-1st-floor-one-person": "Standard Private Rooms - 1st Floor (1 Person)",
  "standard-private-rooms-ground-floor-one-person": "Standard Private Rooms - Ground Floor (1 Person)",
  "standard-twin-room-1st-floor-one-person-shared-maximum-2-people": "Standard Twin Room - 1st Floor (Shared 2 Persons)",
};

const KNOWN_PACKAGE_NAMES: Record<string, string> = {
  "surfer-advance-package": "Surfer Advance Package",
  "yoga-surf-retreat-package": "Yoga & Surf Retreat Package",
  "surf-lessons": "Surfer Starter Package (Beginner)",
  "scooter-rentals": "Scooter Rentals",
  "yoga-experiences": "Yoga Experiences",
  "beginner-surfing-lessons": "Beginner Surfing Lessons",
  "advanced-surfing-lessons": "Advanced Surfing Lessons",
  "safari-trips": "Safari Trips",
  "cookery-classes": "Traditional Cookery Classes",
  "whale-watching-tours": "Mirissa Whale Watching Tours",
};

const KNOWN_BLOG_TITLES: Record<string, string> = {
  "7106ede5-d106-4485-b09c-19d5f9841f0b": "Secret Surf Breaks of Weligama Bay: The Ultimate Dawn Patrol & Reef Guide",
  "e7dece7c-7879-4c7b-89e6-ecfe1265f4c4": "Our Story — Ocean Air Weligama",
  "f97111aa-6e7f-4d5e-92f1-382916ea28cb": "Southern Sri Lanka Coastal Flavours: From King Coconuts to Black Pepper Crab",
  "94c8adbd-65a3-439d-a2e4-b24351aea7dd": "Morning Yoga & Ocean Breath: Restorative Island Living on the South Coast",
  "6e4f5d61-e8a3-4cd4-b660-72f865c02ce1": "The Art of Slow Living: Why Weligama is Sri Lanka's Most Charming Coastal Escape",
  "61ac6bb6-4487-44b6-a60a-83b51cf1f544": "Beginner to Pro: Navigating the Surf Seasons and Swell Windows in Southern Sri Lanka",
  "323fd166-bbc0-4cb0-8c9b-df578bf2b53e": "Sunset Chasing & Rooftop Mixology: Golden Hour Culture at Ocean Weligama",
  "40714788-446b-4c51-b90d-d19ed98acf32": "Ancient Ayurvedic Wisdom: Coastal Herbs & Indigenous Healing of the South",
  "secret-surf-breaks-of-weligama-bay": "Secret Surf Breaks of Weligama Bay: Dawn Patrol Guide",
  "southern-sri-lanka-coastal-flavours": "Southern Sri Lanka Coastal Flavours & Rooftop Dining",
  "morning-yoga-ocean-breath": "Morning Yoga & Ocean Breath: Restorative Island Living",
  "day-trips-from-weligama": "Day Trips from Weligama: Galle Fort, Tea Hills & Whales",
};

function formatSlug(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function cleanRoomName(name: string): string {
  let cleaned = name.trim().replace(/\s+/g, " ");
  // Fix known common typos like "Deulux" -> "Deluxe"
  cleaned = cleaned.replace(/\bDeulux\b/gi, "Deluxe");
  return cleaned;
}

function formatRoomTitle(slug: string, dbName?: string): string {
  if (!dbName) {
    if (KNOWN_ROOM_NAMES[slug]) return KNOWN_ROOM_NAMES[slug];
    return `${formatSlug(slug)} (Room Sanctuary)`;
  }
  const cleanDb = cleanRoomName(dbName);
  if (slug === "sunset-suite" && !cleanDb.toLowerCase().includes("sunset")) {
    return `Sunset Suite — ${cleanDb}`;
  }
  if (slug === "private-beach-villa" && !cleanDb.toLowerCase().includes("beach villa")) {
    return `Private Beach Villa — ${cleanDb}`;
  }
  if (slug === "deluxe-ocean-view" && !cleanDb.toLowerCase().includes("deluxe")) {
    return `Deluxe Ocean View — ${cleanDb}`;
  }
  return cleanDb;
}

export function resolvePageTitle(
  rawPath: string,
  roomMap?: Map<string, string>,
  serviceMap?: Map<string, string>,
  blogMap?: Map<string, string>,
  serviceCategoryMap?: Map<string, string>
): PageDisplayInfo {
  if (!rawPath || rawPath === "/" || rawPath === "") {
    return STATIC_PAGE_MAP["/"];
  }

  // Normalize: remove query params, hash, trailing slashes, and lowercase
  const cleanPath = rawPath.split("?")[0].split("#")[0].trim();
  const normalized = cleanPath.length > 1 && cleanPath.endsWith("/") ? cleanPath.slice(0, -1) : cleanPath;
  const lower = normalized.toLowerCase();

  // 1. Static match
  if (STATIC_PAGE_MAP[lower]) {
    return STATIC_PAGE_MAP[lower];
  }

  // 2. Room Detail Routes: /rooms/:slug or /room/:slug
  if (lower.startsWith("/rooms/") || lower.startsWith("/room/")) {
    const slug = lower.replace(/^\/rooms?\/?/, "").trim();
    
    // Check dynamic DB room map (keyed by both slug and id)
    if (roomMap && roomMap.has(slug)) {
      const rawName = roomMap.get(slug)!;
      return {
        title: formatRoomTitle(slug, rawName),
        category: "Sanctuary Room",
      };
    }

    // Check known room names dictionary
    if (KNOWN_ROOM_NAMES[slug]) {
      return {
        title: KNOWN_ROOM_NAMES[slug],
        category: "Sanctuary Room",
      };
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    return {
      title: isUuid ? "Sanctuary Room Suite" : `${formatSlug(slug)} (Room Sanctuary)`,
      category: "Sanctuary Room",
    };
  }

  // 3. Package & Experience Detail Routes: /packages/:slug, /package/:slug, /experiences/:slug, /experience/:slug
  if (
    lower.startsWith("/packages/") ||
    lower.startsWith("/package/") ||
    lower.startsWith("/experiences/") ||
    lower.startsWith("/experience/")
  ) {
    const isExplicitExpRoute = lower.startsWith("/experiences") || lower.startsWith("/experience");
    const slug = lower.replace(/^\/(packages?|experiences?)\/?/, "").trim();

    // Check dynamic DB service map (keyed by both slug and id)
    if (serviceMap && serviceMap.has(slug)) {
      const rawName = cleanRoomName(serviceMap.get(slug)!);
      const categoryHint = serviceCategoryMap?.get(slug)?.toLowerCase() || "";
      const isExperience =
        isExplicitExpRoute ||
        categoryHint.includes("adventure") ||
        categoryHint.includes("activities") ||
        categoryHint.includes("wellness") ||
        categoryHint.includes("tour") ||
        categoryHint.includes("lesson") ||
        categoryHint.includes("experience");

      return {
        title: rawName,
        category: isExperience ? "Curated Experience" : "Curated Package",
      };
    }

    // Check known package dictionary
    if (KNOWN_PACKAGE_NAMES[slug]) {
      const knownTitle = KNOWN_PACKAGE_NAMES[slug];
      const isExp =
        isExplicitExpRoute ||
        slug.includes("lesson") ||
        slug.includes("scooter") ||
        slug.includes("yoga") ||
        slug.includes("safari") ||
        slug.includes("cookery") ||
        slug.includes("whale");

      return {
        title: knownTitle,
        category: isExp ? "Curated Experience" : "Curated Package",
      };
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    return {
      title: isUuid
        ? (isExplicitExpRoute ? "Curated Island Experience" : "Curated Special Package")
        : `${formatSlug(slug)} (${isExplicitExpRoute ? "Curated Experience" : "Special Package"})`,
      category: isExplicitExpRoute ? "Curated Experience" : "Curated Package",
    };
  }

  // 4. Blog Detail Routes: /blog/:slug, /blogs/:slug, /stories/:slug, /story/:slug
  if (
    lower.startsWith("/blog/") ||
    lower.startsWith("/blogs/") ||
    lower.startsWith("/stories/") ||
    lower.startsWith("/story/")
  ) {
    const slug = lower.replace(/^\/(blog|blogs|stories|story)\/?/, "").trim();

    // Check dynamic DB blog map (keyed by both id and title-slug)
    if (blogMap && blogMap.has(slug)) {
      return {
        title: blogMap.get(slug)!,
        category: "Journal Story",
      };
    }

    // Check known blog dictionary
    if (KNOWN_BLOG_TITLES[slug]) {
      return {
        title: KNOWN_BLOG_TITLES[slug],
        category: "Journal Story",
      };
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    return {
      title: isUuid ? "Island Journal Story" : `${formatSlug(slug)} (Journal Story)`,
      category: "Journal Story",
    };
  }

  // 5. Generic route fallback
  const cleanSegment = lower.replace(/^\//, "");
  return {
    title: formatSlug(cleanSegment),
    category: "Website Page",
  };
}
