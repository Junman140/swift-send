import Fastify from 'fastify';
import cors from '@fastify/cors';
import healthRoutes from './routes/health';
import transferRoutes from './routes/transfers';
import escrowRoutes from './routes/escrow';
import { config } from './config';
import { info } from './logger';

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: true });

  // register routes
  app.register(healthRoutes);
  app.register(transferRoutes);
  app.register(escrowRoutes);

  // basic readiness
  app.addHook('onClose', async () => {
    info('Server closing');
  });

  return app;
}

export async function start() {
  const app = buildApp();
  await app.listen({ port: config.port, host: '0.0.0.0' });
}
