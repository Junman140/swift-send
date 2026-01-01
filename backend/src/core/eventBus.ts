import { logger } from '../logger';

export interface DomainEvent<TPayload = Record<string, unknown>> {
  type: string;
  timestamp: string;
  payload: TPayload;
  metadata?: Record<string, unknown>;
}

export type EventHandler<TPayload> = (event: DomainEvent<TPayload>) => Promise<void> | void;

export class EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  subscribe<TPayload>(eventType: string, handler: EventHandler<TPayload>) {
    const existing = this.handlers.get(eventType) || [];
    existing.push(handler as EventHandler<any>);
    this.handlers.set(eventType, existing);

    return () => {
      const list = this.handlers.get(eventType) || [];
      this.handlers.set(
        eventType,
        list.filter((fn) => fn !== handler)
      );
    };
  }

  async publish<TPayload>(event: DomainEvent<TPayload>) {
    const list = this.handlers.get(event.type) || [];
    for (const handler of list) {
      try {
        await handler(event);
      } catch (err) {
        logger.error({ event: event.type, err }, 'event handler failed');
      }
    }
  }
}
