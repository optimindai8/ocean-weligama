import { db } from "../lib/db/src/index";
import { rooms, services } from "../lib/db/src/schema/index";
import { inArray } from "drizzle-orm";

async function main() {
  await db.delete(services).where(inArray(services.slug, ["moderate-surf-guiding", "surf-and-yoga", "full-surf"]));
  await db.delete(rooms).where(inArray(rooms.slug, ["mixed-dorm", "private-single", "private-double", "private-triple"]));
  console.log("Deleted seeded data");
  process.exit(0);
}
main();
