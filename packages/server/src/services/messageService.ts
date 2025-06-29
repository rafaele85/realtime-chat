import { Message } from 'shared';
import * as messageRepository from '../repositories/messageRepository';
import { v4 as uuidv4 } from 'uuid';

export const createMessage = (username: string, content: string) => {
  const message: Message = {
    id: uuidv4(),
    username,
    content,
    timestamp: Date.now(),
  };
  
  return messageRepository.addMessage(message);
};

export const getAllMessages = () => {
  return messageRepository.getAllMessages();
};