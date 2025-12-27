import { FastifyInstance } from 'fastify';
import { transferService } from '../services/transferService';

export default async function transferRoutes(fastify: FastifyInstance) {
  fastify.post('/transfers', async (req, reply) => {
    const body = req.body as any;
    try {
      const t = await transferService.createTransfer(body);
      return reply.status(201).send(t);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/transfers/:id', async (req, reply) => {
    const id = (req.params as any).id;
    const t = transferService.getTransfer(id);
    if (!t) return reply.status(404).send({ error: 'not found' });
    return t;
  });
}
