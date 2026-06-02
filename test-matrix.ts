import { db } from "./lib/db/src/index.ts";
import { rooms, services, roomPackagePrices } from "./lib/db/src/schema/index.ts";
import { isNull } from "drizzle-orm";

async function main() {
  try {
    const allRooms = await db.select().from(rooms).where(isNull(rooms.deletedAt));
    console.log("Rooms:", allRooms.length);
    const allPackages = await db.select().from(services);
    console.log("Packages:", allPackages.length);
  } catch(e) {
    console.error(e);
  }
}
main();
