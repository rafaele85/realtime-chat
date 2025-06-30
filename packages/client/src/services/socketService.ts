import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connect = () => {
  if (socket?.connected) {
    return socket;
  }

  socket = io('http://localhost:3001', {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return socket;
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (username: string, content: string) => {
  console.log('🚀 Sending message:', { username, content });
  if (socket?.connected) {
    console.log('✅ Socket connected, emitting message:send');
    socket.emit('message:send', { username, content });
  } else {
    console.log('❌ Socket not connected!');
  }
};

export const isConnected = () => {
  return socket?.connected ?? false;
};