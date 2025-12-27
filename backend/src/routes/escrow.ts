import { FastifyInstance } from 'fastify';
import { escrowService } from '../services/escrowService';

export default async function escrowRoutes(fastify: FastifyInstance) {
  fastify.post('/escrow/:transferId/release', async (req, reply) => {
    const transferId = (req.params as any).transferId;
    const e = await escrowService.release(transferId);
    if (!e) return reply.status(404).send({ error: 'escrow not found' });
    return e;
  });

  fastify.post('/escrow/:transferId/refund', async (req, reply) => {
    const transferId = (req.params as any).transferId;
    const e = await escrowService.refund(transferId);
    if (!e) return reply.status(404).send({ error: 'escrow not found' });
    return e;
  });
}
