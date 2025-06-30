import { Server } from 'socket.io';
import * as messageService from '../services/messageService';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('message:send', async (data: { username: string; content: string }) => {
      console.log('📨 Received message:send from', socket.id, 'data:', data);
      const message = await messageService.createMessage(data.username, data.content);
      console.log('🚀 Broadcasting message:receive:', message);
      io.emit('message:receive', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};