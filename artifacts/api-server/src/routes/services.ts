import { Router } from "express";
import { db } from "@workspace/db";
import { services, serviceTranslations } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getActiveGlobalRateAdjustment, calculateAdjustedPrice } from "../lib/rateAdjustments";

const router = Router();

async function getServiceWithTranslation(serviceId: string, locale: string, activeAdj?: any) {
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId));

  if (!service) return null;

  const translations = await db
    .select()
    .from(serviceTranslations)
    .where(eq(serviceTranslations.serviceId, serviceId));

  const translation =
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === "en") ??
    translations[0];

  let adjustedPrice = null;
  if (activeAdj) {
    const isPackage = service.category?.toLowerCase().includes('package') || service.type === 'main';
    const adjType = isPackage ? activeAdj.packageAdjustmentType : activeAdj.experienceAdjustmentType;
    const adjValue = isPackage ? activeAdj.packageAdjustmentValue : activeAdj.experienceAdjustmentValue;
    
    const calculated = calculateAdjustedPrice(service.basePrice, adjType, adjValue);
    if (calculated !== parseFloat(service.basePrice as string).toFixed(2)) {
      adjustedPrice = calculated;
    }
  }

  return {
    ...service,
    name: translation?.name ?? service.slug,
    description: translation?.description ?? "",
    shortDesc: translation?.shortDesc ?? null,
    originalPrice: service.basePrice,
    adjustedPrice,
  };
}

router.get("/v1/services", async (req, res) => {
  try {
    const { locale = "en" } = req.query as Record<string, string>;

    const allServices = await db
      .select()
      .from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.sortOrder);

    const activeAdj = await getActiveGlobalRateAdjustment();

    const result = await Promise.all(
      allServices.map((s) => getServiceWithTranslation(s.id, locale, activeAdj))
    );

    res.json(result.filter(Boolean));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/services/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = "en" } = req.query as Record<string, string>;

    const [service] = await db
      .select()
      .from(services)
      .where(and(eq(services.slug, slug), eq(services.isActive, true)));

    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }

    const activeAdj = await getActiveGlobalRateAdjustment();
    const result = await getServiceWithTranslation(service.id, locale, activeAdj);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/matrix-pricing", async (req, res) => {
  try {
    // We already have db from top-level import
    const { rooms, roomPackagePrices, roomTranslations } = await import("@workspace/db");
    const { isNull } = await import("drizzle-orm");

    const allRooms = await db
      .select({ id: rooms.id, name: rooms.slug, maxGuests: rooms.maxGuests, type: rooms.type }) 
      .from(rooms)
      .where(isNull(rooms.deletedAt))
      .orderBy(rooms.sortOrder);

    // Fetch translations for better names
    const rTranslations = await db.select().from(roomTranslations).where(eq(roomTranslations.locale, "en"));
    const roomsMap = allRooms.map(r => {
      const t = rTranslations.find(tr => tr.roomId === r.id);
      return { id: r.id, name: t?.name ?? r.name, maxGuests: r.maxGuests, type: r.type };
    });

    const sTranslations = await db.select().from(serviceTranslations).where(eq(serviceTranslations.locale, "en"));

    const packagesRecords = await db
      .select({ 
        id: services.id, 
        slug: services.slug, 
        isFeatured: services.isFeatured, 
        iconEmoji: services.iconEmoji,
        matrixLabel: services.matrixLabel,
        matrixExperienceLevel: services.matrixExperienceLevel
      })
      .from(services)
      .where(and(eq(services.type, "main"), eq(services.isActive, true)))
      .orderBy(services.sortOrder);
      
    const mainPackages = packagesRecords.map(p => {
      const t = sTranslations.find(tr => tr.serviceId === p.id);
      return { 
        id: p.id, 
        name: t?.name ?? p.slug, 
        slug: p.slug, 
        isFeatured: p.isFeatured, 
        iconEmoji: p.iconEmoji,
        matrixLabel: p.matrixLabel,
        matrixExperienceLevel: p.matrixExperienceLevel
      };
    });

    const activeAdj = await getActiveGlobalRateAdjustment();
    const prices = await db.select().from(roomPackagePrices);
    
    const adjustedPrices = prices.map(p => {
       let adjustedDailyPrice = null;
       if (activeAdj) {
          const calculated = calculateAdjustedPrice(p.dailyPrice, activeAdj.packageAdjustmentType, activeAdj.packageAdjustmentValue);
          if (calculated !== parseFloat(p.dailyPrice as string).toFixed(2)) {
             adjustedDailyPrice = calculated;
          }
       }
       return {
         ...p,
         originalDailyPrice: p.dailyPrice,
         adjustedDailyPrice,
       };
    });

    res.json({
      rooms: roomsMap,
      packages: mainPackages,
      prices: adjustedPrices,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
