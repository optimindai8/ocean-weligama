import { ValidationError } from '../errors/DomainError.js';
import type { TrafficSource } from '../services/TrafficSourceClassifier.js';
import type { DeviceType, EventType } from '../types.js';
import type { EventName } from '../value-objects/EventName.js';
import type { PagePath } from '../value-objects/PagePath.js';
import type { SessionId } from '../value-objects/SessionId.js';
import type { VisitorId } from '../value-objects/VisitorId.js';

/** Longest engagement segment accepted: 2 hours. Anything above is a bug or abuse. */
export const MAX_ENGAGEMENT_MS = 2 * 60 * 60 * 1000;

export interface TrackingEventProps {
  type: EventType;
  name: EventName | null;
  occurredAt: Date;
  visitorId: VisitorId;
  sessionId: SessionId;
  path: PagePath;
  /** True when the visitor had already been to the website before this session started. */
  isReturning: boolean;
  durationMs: number | null;
  traffic: TrafficSource;
  deviceType: DeviceType;
  browser: string;
  os: string;
  country: string | null;
  language: string | null;
  timezone: string | null;
  screenWidth: number | null;
  /** Daily-rotating hash of the IP address. The raw IP is never stored. */
  ipHash: string;
}

/** One thing a guest did on the website. Immutable once created. */
export class TrackingEvent {
  private constructor(readonly props: Readonly<TrackingEventProps>) {}

  static create(props: TrackingEventProps): TrackingEvent {
    switch (props.type) {
      case 'pageview':
        if (props.name !== null || props.durationMs !== null) {
          throw new ValidationError('a pageview cannot carry a name or a duration');
        }
        break;
      case 'engagement':
        if (props.name !== null) throw new ValidationError('an engagement event cannot carry a name');
        if (
          props.durationMs === null ||
          !Number.isInteger(props.durationMs) ||
          props.durationMs < 1 ||
          props.durationMs > MAX_ENGAGEMENT_MS
        ) {
          throw new ValidationError('engagement durationMs must be between 1 ms and 2 hours');
        }
        break;
      case 'custom':
        if (props.name === null) throw new ValidationError('a custom event needs a name');
        if (props.durationMs !== null) throw new ValidationError('a custom event cannot carry a duration');
        break;
    }
    return new TrackingEvent(Object.freeze({ ...props }));
  }
}
