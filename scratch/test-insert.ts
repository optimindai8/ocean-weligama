import { db, rooms, roomTranslations } from "@workspace/db";

async function run() {
  console.log("Testing insert...");
  try {
    const [room] = await db
      .insert(rooms)
      .values({
        slug: "test-room-slug-" + Date.now(),
        type: "room",
        maxGuests: 2,
        bedrooms: 1,
        bathrooms: 1,
        basePricePerNight: "150.00",
        currency: "EUR",
        isFeatured: false,
        category: "solo",
        gallery: [],
        highlights: ["Test highlight"],
      })
      .returning();

    console.log("Successfully inserted room:", room);

    await db.insert(roomTranslations).values({
      roomId: room.id,
      locale: "en",
      name: "Test Room Name",
      description: "Test Room Description",
    });
    console.log("Successfully inserted translation!");
  } catch (err) {
    console.error("Insert failed with error:", err);
  }
  process.exit(0);
}

run();
