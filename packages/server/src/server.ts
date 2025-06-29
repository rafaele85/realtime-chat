import Fastify from 'fastify';
import { Server } from 'socket.io';
import cors from '@fastify/cors';
import { setupSocketHandlers } from './controllers/socketController';

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
      credentials: true,
    });

    const io = new Server(fastify.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    setupSocketHandlers(io);

    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();