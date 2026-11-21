import pg from "pg";
const { Client } = pg;

async function main() {
  const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ocean_weligama";
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  console.log("Connected to PostgreSQL database.");

  // Fetch current about_settings
  const curRes = await client.query("SELECT value FROM site_settings WHERE key = 'about_settings';");
  let currentValue = {};
  if (curRes.rows.length > 0) {
    currentValue = curRes.rows[0].value || {};
    console.log("Existing about_settings found:", Object.keys(currentValue));
  } else {
    console.log("No existing about_settings found, will insert new record.");
  }

  const defaultAboutHero = {
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
  };

  const defaultAboutStory = {
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
  };

  const defaultAboutExperience = {
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
  };

  const defaultAboutSanctuary = {
    badge: "Sleep & Sanctuary",
    headingLead: "Designed For",
    headingHighlight: "Every Stay & Budget",
    tab1Label: "Basic Private Room",
    tab2Label: "Deluxe Double (Ocean View)",

    // Tab 1: Basic Private Room
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

    // Tab 2: Deluxe Double (Ocean View)
    deluxeEyebrow: "Elevated Horizon Experience",
    deluxeTitle: "Deluxe Double With Balcony",
    deluxeDescription: "Wake up to tropical light and breathtaking views across the bay. Our top-floor Deluxe Double features a private balcony terrace where ocean breeze and morning coffee start your day right.",
    deluxePerk1: "Private Ocean Balcony",
    deluxePerk2: "Panoramic Ocean Views",
    deluxePerk3: "Whisper-Quiet A/C",
    deluxePerk4: "Authentic Local Styling",
    deluxeCtaText: "View Rates",
    deluxeGuaranteeText: "Top-floor ocean horizon view",
    deluxeImageUrl: "/Deluxe_Double%20with_Balcony.jpeg",
    deluxeImageBadge: "Ocean Horizon • Private Balcony Terrace",
  };

  const defaultAboutRooftop = {
    headingLead: "The Rooftop Café",
    tab1Label: "Morning Vibes",
    tab2Label: "Golden Hour",

    // Morning Mode (Tab 1)
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

    // Sunset / Golden Hour Mode (Tab 2)
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
  };

  const defaultAboutValues = {
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
  };

  const defaultAboutSignature = {
    monogram: "OA",
    quote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    byline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    guarantee: "100% Genuine Hospitality",
    badge: "Resident Family Pledge",
    note: "We welcome every guest as personal family from the moment you step foot on our golden sand.",
  };

  const defaultAboutInvitation = {
    badge: "Your Weligama Escape",
    headingLead: "Ready to Discover",
    headingHighlight: "Southern Sri Lanka?",
    subtitle: "Whether catching your first Indian Ocean dawn wave, sipping sunrise artisan roasts, or unwinding under starlit coastal skies—your unforgettable island story begins at Ocean Air.",
    ctaText: "Book Your Experience",
    ctaLink: "/book?new=1",
    perk1: "Best Direct Rates Guaranteed",
    perk2: "Free 3-Min Beach Walk Location",
    perk3: "100% Flexible Booking Options",
  };

  const updatedValue = {
    ...currentValue,
    hero: {
      ...defaultAboutHero,
      ...(currentValue.hero || {}),
    },
    story: {
      ...defaultAboutStory,
      ...(currentValue.story || {}),
    },
    experience: {
      ...defaultAboutExperience,
      ...(currentValue.experience || {}),
    },
    sanctuary: {
      ...defaultAboutSanctuary,
      ...(currentValue.sanctuary || {}),
    },
    rooftop: {
      ...defaultAboutRooftop,
      ...(currentValue.rooftop || {}),
    },
    values: {
      ...defaultAboutValues,
      ...(currentValue.values || {}),
    },
    signature: {
      ...defaultAboutSignature,
      ...(currentValue.signature || {}),
    },
    invitation: {
      ...defaultAboutInvitation,
      ...(currentValue.invitation || {}),
    }
  };

  await client.query(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('about_settings', $1, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = $1, updated_at = NOW();
  `, [JSON.stringify(updatedValue)]);

  console.log("Successfully seeded about_settings (hero + story + experience + sanctuary + rooftop + values + signature + invitation) in PostgreSQL site_settings!");
  await client.end();
}

main().catch((err) => {
  console.error("Error seeding about_settings:", err);
  process.exit(1);
});
