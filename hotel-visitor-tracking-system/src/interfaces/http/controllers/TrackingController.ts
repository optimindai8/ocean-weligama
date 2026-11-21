import type { Request, Response } from 'express';
import type { RecordTrackingEvent } from '../../../application/use-cases/RecordTrackingEvent.js';
import { ValidationError } from '../../../domain/errors/DomainError.js';
import { getClientIp, getCountryHint, getUserAgent } from '../support/clientInfo.js';
import { trackingSchema } from '../validation/trackingSchema.js';

export class TrackingController {
  constructor(
    private readonly recordTrackingEvent: RecordTrackingEvent,
    private readonly countryHeader: string | null,
  ) {}

  /**
   * POST /api/v1/collect
   * The tracker sends JSON as text/plain (a "simple" cross-site request): no CORS preflight,
   * so every tracking call costs one network request instead of two.
   */
  collect = async (req: Request, res: Response): Promise<void> => {
    const body: unknown = req.body;
    if (typeof body !== 'string' || body.length === 0) throw new ValidationError('empty body');

    let json: unknown;
    try {
      json = JSON.parse(body);
    } catch {
      throw new ValidationError('body is not valid JSON');
    }

    const parsed = trackingSchema.safeParse(json);
    if (!parsed.success) throw new ValidationError('payload has an invalid shape');
    const payload = parsed.data;

    await this.recordTrackingEvent.execute({
      type: payload.type === 'event' ? 'custom' : payload.type,
      ...(payload.name !== undefined && { name: payload.name }),
      visitorId: payload.visitorId,
      sessionId: payload.sessionId,
      path: payload.path,
      returning: payload.returning ?? false,
      ...(payload.durationMs !== undefined && { durationMs: payload.durationMs }),
      ...(payload.referrer !== undefined && { referrer: payload.referrer }),
      ...(payload.utmSource !== undefined && { utmSource: payload.utmSource }),
      ...(payload.utmCampaign !== undefined && { utmCampaign: payload.utmCampaign }),
      ...(payload.screenWidth !== undefined && { screenWidth: payload.screenWidth }),
      ...(payload.language !== undefined && { language: payload.language }),
      ...(payload.timezone !== undefined && { timezone: payload.timezone }),
      userAgent: getUserAgent(req),
      ip: getClientIp(req),
      countryHint: getCountryHint(req, this.countryHeader),
    });

    // Same answer for recorded and ignored (bot) traffic: nothing is revealed to scrapers.
    res.status(204).end();
  };
}
