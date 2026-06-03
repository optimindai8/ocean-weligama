import { db } from "../lib/db/src/index";
import { rooms, services, roomPackagePrices, roomTranslations, serviceTranslations } from "../lib/db/src/schema/index";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding Matrix Pricing Data...");

  // 1. Ensure Packages (Services) exist
  const packagesToSeed = [
    { name: "Moderate Surf / Guiding", slug: "moderate-surf-guiding", basePrice: "290" },
    { name: "Surf And Yoga Package", slug: "surf-and-yoga", basePrice: "350" },
    { name: "Full Surf Package", slug: "full-surf", basePrice: "390" }
  ];

  const createdPackages = [];
  for (let i = 0; i < packagesToSeed.length; i++) {
    const pkg = packagesToSeed[i];
    let [service] = await db.select().from(services).where(eq(services.slug, pkg.slug));
    if (!service) {
      const [inserted] = await db.insert(services).values({
        slug: pkg.slug,
        type: "main",
        category: "Main Package",
        unit: "per_person",
        basePrice: pkg.basePrice,
        currency: "EUR",
        isActive: true,
        sortOrder: i
      }).returning();
      service = inserted;
      await db.insert(serviceTranslations).values({
        serviceId: service.id,
        locale: "en",
        name: pkg.name,
        description: "Package description"
      });
    }
    createdPackages.push(service);
  }

  // 2. Ensure Rooms exist
  const roomsToSeed = [
    { name: "Mixed Dormitory Bed", slug: "mixed-dorm", type: "dormitory" as const, maxGuests: 5, basePrice: "40" },
    { name: "Private Single Room", slug: "private-single", type: "room" as const, maxGuests: 1, basePrice: "55" },
    { name: "Private Double / Twin Room", slug: "private-double", type: "room" as const, maxGuests: 2, basePrice: "41" },
    { name: "Private Triple Room", slug: "private-triple", type: "room" as const, maxGuests: 3, basePrice: "41" }
  ];

  const createdRooms = [];
  for (let i = 0; i < roomsToSeed.length; i++) {
    const rm = roomsToSeed[i];
    let [room] = await db.select().from(rooms).where(eq(rooms.slug, rm.slug));
    if (!room) {
      const [inserted] = await db.insert(rooms).values({
        slug: rm.slug,
        type: rm.type,
        maxGuests: rm.maxGuests,
        basePricePerNight: rm.basePrice,
        currency: "EUR",
        status: "active",
        category: "solo",
        sortOrder: i
      }).returning();
      room = inserted;
      await db.insert(roomTranslations).values({
        roomId: room.id,
        locale: "en",
        name: rm.name,
        description: "Room description"
      });
    }
    createdRooms.push(room);
  }

  // 3. Set Prices
  const pricesGrid = [
    // Mixed Dormitory Bed
    [{ price: "290", dailyPrice: "41.43" }, { price: "350", dailyPrice: "50.0" }, { price: "390", dailyPrice: "55.71" }],
    // Private Single Room
    [{ price: "390", dailyPrice: "55.71" }, { price: "450", dailyPrice: "64.29" }, { price: "490", dailyPrice: "70.0" }],
    // Private Double / Twin Room
    [{ price: "290", dailyPrice: "41.43" }, { price: "350", dailyPrice: "50.0" }, { price: "390", dailyPrice: "55.71" }],
    // Private Triple Room
    [{ price: "290", dailyPrice: "41.43" }, { price: "350", dailyPrice: "50.0" }, { price: "390", dailyPrice: "55.71" }]
  ];

  for (let r = 0; r < createdRooms.length; r++) {
    const room = createdRooms[r];
    for (let p = 0; p < createdPackages.length; p++) {
      const pkg = createdPackages[p];
      const pData = pricesGrid[r][p];
      
      const existing = await db.select().from(roomPackagePrices)
        .where(eq(roomPackagePrices.roomId, room.id));
      
      const existingPrice = existing.find(e => e.packageId === pkg.id);
      
      if (!existingPrice) {
        await db.insert(roomPackagePrices).values({
          roomId: room.id,
          packageId: pkg.id,
          price: pData.price,
          dailyPrice: pData.dailyPrice
        });
      }
    }
  }
}
main();
