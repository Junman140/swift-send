import pino from 'pino';
import { config } from './config';

export const logger = pino({
  level: config.logging.level,
  base: { service: 'swiftsend-backend', env: config.env },
  transport: config.logging.pretty
    ? {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' }
      }
    : undefined,
});

export const createLogger = (bindings: Record<string, unknown>) => logger.child(bindings);
