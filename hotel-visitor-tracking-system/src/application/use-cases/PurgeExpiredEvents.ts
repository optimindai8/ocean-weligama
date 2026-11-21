import type { Clock } from '../ports/Clock.js';
import type { EventRepository } from '../ports/EventRepository.js';

interface Dependencies {
  events: EventRepository;
  clock: Clock;
  retentionDays: number;
}

/** Data minimisation: raw events are deleted once they are older than the retention period. */
export class PurgeExpiredEvents {
  constructor(private readonly deps: Dependencies) {}

  async execute(): Promise<number> {
    const { events, clock, retentionDays } = this.deps;
    const cutoff = new Date(clock.now().getTime() - retentionDays * 86_400_000);
    return events.deleteOlderThan(cutoff);
  }
}
