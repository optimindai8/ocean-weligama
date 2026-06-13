import { db } from "../lib/db/src/index.ts";
import { reviews } from "../lib/db/src/schema/index.ts";
import { eq, and, isNull } from "drizzle-orm";

async function main() {
  try {
    const list = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.isApproved, true), isNull(reviews.deletedAt)));
    console.log("Approved reviews count:", list.length);
    console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    console.error("Error fetching reviews:", err);
  }
  process.exit(0);
}

main();
