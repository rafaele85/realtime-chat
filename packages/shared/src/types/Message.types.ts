export type Message = {
  id: string;
  username: string;
  content: string;
  timestamp: number;
};

export type SocketEvents = {
  'message:send': (message: Omit<Message, 'id' | 'timestamp'>) => void;
  'message:receive': (message: Message) => void;
  'user:joined': (username: string) => void;
  'user:left': (username: string) => void;
};