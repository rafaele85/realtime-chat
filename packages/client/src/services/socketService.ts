import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connect = () => {
  if (socket?.connected) return;

  socket = io('http://localhost:3001', {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (username: string, content: string) => {
  if (socket?.connected) {
    socket.emit('message:send', { username, content });
  }
};

export const isConnected = () => {
  return socket?.connected ?? false;
};