import { z } from 'zod';

/**
 * Shape of the message sent by the browser tracker. This only checks the *shape*
 * (types and sizes); business rules such as "is this a real UUID" live in the domain layer.
 * Unknown fields are ignored.
 */
export const trackingSchema = z.object({
  type: z.enum(['pageview', 'engagement', 'event']),
  name: z.string().max(40).optional(),
  visitorId: z.string().max(36),
  sessionId: z.string().max(36),
  path: z.string().max(300),
  returning: z.boolean().optional(),
  durationMs: z.number().int().min(1).max(7_200_000).optional(),
  referrer: z.string().max(500).optional(),
  utmSource: z.string().max(100).optional(),
  utmCampaign: z.string().max(150).optional(),
  screenWidth: z.number().int().min(1).max(20_000).optional(),
  language: z.string().max(35).optional(),
  timezone: z.string().max(64).optional(),
});

export type TrackingPayload = z.infer<typeof trackingSchema>;
