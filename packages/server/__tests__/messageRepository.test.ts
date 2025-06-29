import * as messageRepository from '../src/repositories/messageRepository';
import { Message } from 'shared';

describe('messageRepository', () => {
  const mockMessage: Message = {
    id: '123',
    username: 'testuser',
    content: 'test message',
    timestamp: 1234567890,
  };

  beforeEach(async () => {
    // Clear messages before each test
    await messageRepository.clearMessages();
  });

  it('should add a message and return it', async () => {
    const result = await messageRepository.addMessage(mockMessage);
    
    expect(result).toEqual(mockMessage);
    const allMessages = await messageRepository.getAllMessages();
    expect(allMessages).toHaveLength(1);
  });

  it('should return empty array when no messages', async () => {
    const result = await messageRepository.getAllMessages();
    expect(result).toEqual([]);
  });

  it('should return all messages', async () => {
    await messageRepository.addMessage(mockMessage);
    const secondMessage = { ...mockMessage, id: '456' };
    await messageRepository.addMessage(secondMessage);

    const result = await messageRepository.getAllMessages();
    expect(result).toHaveLength(2);
    expect(result).toContain(mockMessage);
    expect(result).toContain(secondMessage);
  });

  it('should return message when found by id', async () => {
    await messageRepository.addMessage(mockMessage);
    
    const result = await messageRepository.getMessageById('123');
    expect(result).toEqual(mockMessage);
  });

  it('should return undefined when message not found by id', async () => {
    const result = await messageRepository.getMessageById('nonexistent');
    expect(result).toBeUndefined();
  });
});