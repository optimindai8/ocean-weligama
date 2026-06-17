import { db } from "@workspace/db";
import { globalRateAdjustments } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function getActiveGlobalRateAdjustment() {
  const now = new Date();

  const activeAdjustments = await db
    .select()
    .from(globalRateAdjustments)
    .where(eq(globalRateAdjustments.isActive, true));

  // Find the first active one that fits the date range, or has no date range
  let validAdjustment = null;
  
  for (const adj of activeAdjustments) {
    let isValid = true;
    
    // Auto-deactivate logic
    if (adj.dateTo) {
      const toDate = new Date(adj.dateTo);
      if (now > toDate) {
        // Time is up, deactivate it
        await db.update(globalRateAdjustments)
          .set({ isActive: false })
          .where(eq(globalRateAdjustments.id, adj.id));
        isValid = false;
      }
    }
    
    if (adj.dateFrom && new Date(adj.dateFrom) > now) {
      isValid = false;
    }
    
    if (isValid && !validAdjustment) {
      validAdjustment = adj;
    }
  }

  return validAdjustment;
}

export function calculateAdjustedPrice(
  basePrice: string | number,
  adjustmentType: string | null,
  adjustmentValue: string | null
): string {
  const price = parseFloat(basePrice as string);
  const value = parseFloat(adjustmentValue || "0");

  if (value === 0) return price.toFixed(2);

  let newPrice = price;
  if (adjustmentType === "percentage") {
    newPrice = price + (price * value) / 100;
  } else {
    // Fixed amount (e.g. -10 or +10)
    newPrice = price + value;
  }

  // Ensure price doesn't go negative
  return Math.max(0, newPrice).toFixed(2);
}
