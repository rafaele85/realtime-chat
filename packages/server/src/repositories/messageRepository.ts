import { Message } from 'shared';

const messages: Message[] = [];

export const addMessage = (message: Message) => {
  messages.push(message);
  return message;
};

export const getAllMessages = () => {
  return [...messages];
};

export const getMessageById = (id: string) => {
  return messages.find(msg => msg.id === id);
};