import Fastify from 'fastify';
import cors from '@fastify/cors';
import healthRoutes from './routes/health';
import transferRoutes from './routes/transfers';
import escrowRoutes from './routes/escrow';
import { config } from './config';
import { logger } from './logger';
import { createContainer } from './container';

export function buildApp() {
  const app = Fastify({ logger });
  const container = createContainer();

  app.decorate('container', container);
  app.register(cors, { origin: true });

  app.register(healthRoutes, { prefix: container.config.server.basePath });
  app.register(transferRoutes, { prefix: container.config.server.basePath });
  app.register(escrowRoutes, { prefix: container.config.server.basePath });

  app.addHook('onClose', async () => {
    logger.info('Server shutting down');
  });

  return app;
}

export async function start() {
  const app = buildApp();
  await app.listen({ port: config.server.port, host: config.server.host });
}
