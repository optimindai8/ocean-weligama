import { db } from "./lib/db/src/index.ts";
import { services, rooms, roomPackagePrices } from "./lib/db/src/schema/index.ts";
async function main() {
  const allServices = await db.select().from(services);
  const allRooms = await db.select().from(rooms);
  const allPrices = await db.select().from(roomPackagePrices);
  console.log("Services:", allServices.length);
  console.log("Rooms:", allRooms.length);
  console.log("Prices:", allPrices.length);
  process.exit(0);
}
main();
