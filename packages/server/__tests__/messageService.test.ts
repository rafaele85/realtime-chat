import * as messageService from '../src/services/messageService';
import * as messageRepository from '../src/repositories/messageRepository';

describe('messageService', () => {
  jest.mock('uuid', () => ({
    v4: () => 'mock-uuid-123',
  }));

  beforeEach(async () => {
    // Clear messages before each test
    await messageRepository.clearMessages();
  });

  it('should create message with generated id and timestamp', async () => {
    const username = 'testuser';
    const content = 'test message';
    const beforeTime = Date.now();
    
    const result = await messageService.createMessage(username, content);
    const afterTime = Date.now();
    
    expect(result.id).toBeDefined();
    expect(result.username).toBe(username);
    expect(result.content).toBe(content);
    expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(result.timestamp).toBeLessThanOrEqual(afterTime);
  });

  it('should store created message in repository', async () => {
    await messageService.createMessage('user1', 'message1');
    
    const allMessages = await messageService.getAllMessages();
    expect(allMessages).toHaveLength(1);
    expect(allMessages[0].username).toBe('user1');
    expect(allMessages[0].content).toBe('message1');
  });

  it('should return all messages from repository', async () => {
    await messageService.createMessage('user1', 'message1');
    await messageService.createMessage('user2', 'message2');
    
    const result = await messageService.getAllMessages();
    expect(result).toHaveLength(2);
  });
});