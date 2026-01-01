import { FastifyInstance } from 'fastify';

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => fastify.container.services.health.readiness());
  fastify.get('/health/live', async () => fastify.container.services.health.liveness());
  fastify.get('/health/ready', async () => fastify.container.services.health.readiness());
}
