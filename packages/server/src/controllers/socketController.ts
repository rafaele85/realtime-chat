import { Server } from 'socket.io';
import * as messageService from '../services/messageService';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('message:send', async (data: { username: string; content: string }) => {
      const message = await messageService.createMessage(data.username, data.content);
      io.emit('message:receive', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};