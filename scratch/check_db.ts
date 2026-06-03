import { db } from "../lib/db/src/index";
import { rooms, services, roomPackagePrices } from "../lib/db/src/schema/index";

async function main() {
  const allRooms = await db.select().from(rooms);
  console.log("Rooms:", allRooms.length);
  
  const allServices = await db.select().from(services);
  console.log("Services:", allServices.length);
  
  const allPrices = await db.select().from(roomPackagePrices);
  console.log("Prices:", allPrices.length);
  
  process.exit(0);
}
main();
