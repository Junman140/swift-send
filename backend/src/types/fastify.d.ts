import 'fastify';
import type { AppContainer } from '../container';

declare module 'fastify' {
  interface FastifyInstance {
    container: AppContainer;
  }
}
