import type { TrackingEvent } from '../../domain/entities/TrackingEvent.js';

/** Write side of storage. Implemented by the infrastructure layer. */
export interface EventRepository {
  save(event: TrackingEvent): Promise<void>;
  /** Deletes everything recorded before the cutoff. Returns the number of rows removed. */
  deleteOlderThan(cutoff: Date): Promise<number>;
}
