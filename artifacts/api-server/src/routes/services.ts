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

export default router;
