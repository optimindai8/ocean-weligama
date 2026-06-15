import { db } from "@workspace/db";
import { globalRateAdjustments } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function getActiveGlobalRateAdjustment() {
  const today = new Date().toISOString().split('T')[0];

  const activeAdjustments = await db
    .select()
    .from(globalRateAdjustments)
    .where(eq(globalRateAdjustments.isActive, true));

  // Find the first active one that fits the date range, or has no date range
  const adjustment = activeAdjustments.find((adj) => {
    if (adj.dateFrom && adj.dateFrom > today) return false;
    if (adj.dateTo && adj.dateTo < today) return false;
    return true;
  });

  return adjustment || null;
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
