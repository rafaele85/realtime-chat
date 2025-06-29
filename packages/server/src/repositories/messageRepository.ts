import { Message } from 'shared';

const messages: Message[] = [];

export const addMessage = async (message: Message) => {
  messages.push(message);
  return message;
};

export const getAllMessages = async () => {
  return [...messages];
};

export const getMessageById = async (id: string) => {
  return messages.find(msg => msg.id === id);
};

export const clearMessages = async () => {
  messages.length = 0;
};