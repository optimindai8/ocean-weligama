with open("Ocean-Weligama/scripts/seed_about_settings.mjs", "r") as f:
    content = f.read()

target = """  const defaultAboutSignature = {
    monogram: "OA",
    quote: "“When you stay with us, you are not just a guest in a hotel—you are welcomed as family into our island sanctuary.”",
    byline: "The Ocean Air Family • Weligama Bay, Sri Lanka",
    guarantee: "100% Genuine Hospitality",
    badge: "Resident Family Pledge",
    note: "We welcome every guest as personal family from the moment you step foot on our golden sand.",
  };

  const updatedValue = {"""

replacement = """  const defaultAboutSignature = {
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

  const updatedValue = {"""

content = content.replace(target, replacement, 1)

target2 = """    signature: {
      ...defaultAboutSignature,
      ...(currentValue.signature || {}),
    }
  };"""

replacement2 = """    signature: {
      ...defaultAboutSignature,
      ...(currentValue.signature || {}),
    },
    invitation: {
      ...defaultAboutInvitation,
      ...(currentValue.invitation || {}),
    }
  };"""

content = content.replace(target2, replacement2, 1)

target3 = 'console.log("Successfully seeded about_settings (hero + story + experience + sanctuary + rooftop + values + signature) in PostgreSQL site_settings!");'
replacement3 = 'console.log("Successfully seeded about_settings (hero + story + experience + sanctuary + rooftop + values + signature + invitation) in PostgreSQL site_settings!");'

content = content.replace(target3, replacement3, 1)

with open("Ocean-Weligama/scripts/seed_about_settings.mjs", "w") as f:
    f.write(content)

print("Updated seed_about_settings.mjs with invitation successfully!")
