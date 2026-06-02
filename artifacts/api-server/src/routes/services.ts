import { Router } from "express";
import { db } from "@workspace/db";
import { services, serviceTranslations } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

async function getServiceWithTranslation(serviceId: string, locale: string) {
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

  return {
    ...service,
    name: translation?.name ?? service.slug,
    description: translation?.description ?? "",
    shortDesc: translation?.shortDesc ?? null,
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

    const result = await Promise.all(
      allServices.map((s) => getServiceWithTranslation(s.id, locale))
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

    const result = await getServiceWithTranslation(service.id, locale);
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/matrix-pricing", async (req, res) => {
  try {
    const { rooms, services, roomPackagePrices } = await import("@workspace/db");
    const { isNull, and, eq } = await import("drizzle-orm");

    const allRooms = await db
      .select({ id: rooms.id, name: rooms.slug }) 
      .from(rooms)
      .where(isNull(rooms.deletedAt))
      .orderBy(rooms.sortOrder);

    // Fetch translations for better names
    const { roomTranslations } = await import("@workspace/db");
    const rTranslations = await db.select().from(roomTranslations).where(eq(roomTranslations.locale, "en"));
    const roomsMap = allRooms.map(r => {
      const t = rTranslations.find(tr => tr.roomId === r.id);
      return { id: r.id, name: t?.name ?? r.name };
    });

    const mainPackages = await db
      .select({ id: services.id, name: services.name, slug: services.slug })
      .from(services)
      .where(and(eq(services.type, "main"), eq(services.isActive, true)))
      .orderBy(services.sortOrder);

    const prices = await db.select().from(roomPackagePrices);

    res.json({
      rooms: roomsMap,
      packages: mainPackages,
      prices: prices,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
