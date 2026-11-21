with open("Ocean-Weligama/scripts/seed_about_settings.mjs", "r") as f:
    content = f.read()

target = """    sunsetDockNote: "Weligama's premier sunset vista. Resident priority seating.",
    sunsetDockTime: "5PM - 9:30PM",
  };

  const updatedValue = {"""

replacement = """    sunsetDockNote: "Weligama's premier sunset vista. Resident priority seating.",
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

  const updatedValue = {"""

content = content.replace(target, replacement, 1)

target2 = """    rooftop: {
      ...defaultAboutRooftop,
      ...(currentValue.rooftop || {}),
    }
  };"""

replacement2 = """    rooftop: {
      ...defaultAboutRooftop,
      ...(currentValue.rooftop || {}),
    },
    values: {
      ...defaultAboutValues,
      ...(currentValue.values || {}),
    }
  };"""

content = content.replace(target2, replacement2, 1)

target3 = 'console.log("Successfully seeded about_settings (hero + story + experience + sanctuary + rooftop) in PostgreSQL site_settings!");'
replacement3 = 'console.log("Successfully seeded about_settings (hero + story + experience + sanctuary + rooftop + values) in PostgreSQL site_settings!");'

content = content.replace(target3, replacement3, 1)

with open("Ocean-Weligama/scripts/seed_about_settings.mjs", "w") as f:
    f.write(content)

print("Updated seed_about_settings.mjs successfully!")
