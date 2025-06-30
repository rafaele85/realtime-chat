import * as socketService from '../src/services/socketService';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

describe('socketService - messaging', () => {
  const eventHandlers: Record<string, (...args: any[]) => void> = {};
  
  const mockSocket = {
    connected: false,
    emit: jest.fn(),
    on: jest.fn((event: string, handler: (...args: any[]) => void) => {
      eventHandlers[event] = handler;
    }),
    triggerConnect: () => {
      mockSocket.connected = true;
      eventHandlers['connect']?.();
    },
  };

  const mockIo = require('socket.io-client').io as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(eventHandlers).forEach(key => delete eventHandlers[key]);
    mockSocket.connected = false;
    mockIo.mockReturnValue(mockSocket);
  });

  it('should send message when connected', () => {
    socketService.connect();
    mockSocket.triggerConnect();

    socketService.sendMessage('testuser', 'Hello world');

    expect(mockSocket.emit).toHaveBeenCalledWith('message:send', {
      username: 'testuser',
      content: 'Hello world',
    });
  });

  it('should not send message when disconnected', () => {
    socketService.connect();

    socketService.sendMessage('testuser', 'Hello world');

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});