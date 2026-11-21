import pg from "pg";
const { Client } = pg;

async function main() {
  const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/ocean_weligama";
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  console.log("Connected to PostgreSQL database.");

  // Fetch current contact_settings
  const curRes = await client.query("SELECT value FROM site_settings WHERE key = 'contact_settings';");
  let currentValue = {};
  if (curRes.rows.length > 0) {
    currentValue = curRes.rows[0].value || {};
    console.log("Existing contact_settings found:", Object.keys(currentValue));
  } else {
    console.log("No existing contact_settings found, will insert new record.");
  }

  const defaultContactHero = {
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
  };

  const defaultContactChannels = {
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
  };

  const updatedValue = {
    ...currentValue,
    hero: {
      ...defaultContactHero,
      ...(currentValue.hero || {}),
    },
    channels: {
      ...defaultContactChannels,
      ...(currentValue.channels || {}),
    }
  };

  await client.query(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('contact_settings', $1, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = $1, updated_at = NOW();
  `, [JSON.stringify(updatedValue)]);

  console.log("Successfully seeded contact_settings (hero + channels) in PostgreSQL site_settings!");
  await client.end();
}

main().catch((err) => {
  console.error("Error seeding contact_settings:", err);
  process.exit(1);
});
