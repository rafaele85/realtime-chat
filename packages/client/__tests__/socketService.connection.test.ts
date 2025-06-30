import * as socketService from '../src/services/socketService';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}));

describe('socketService - connection', () => {
  const eventHandlers: Record<string, (...args: any[]) => void> = {};
  
  const mockSocket = {
    connected: false,
    disconnect: jest.fn(() => {
      mockSocket.connected = false;
    }),
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

  it('should connect to server on localhost:3001', () => {
    socketService.connect();

    expect(mockIo).toHaveBeenCalledWith('http://localhost:3001', {
      transports: ['websocket'],
    });
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
  });

  it('should not connect if already connected', () => {
    socketService.connect();
    mockSocket.triggerConnect();
    
    socketService.connect();

    expect(mockIo).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from server', () => {
    socketService.connect();
    socketService.disconnect();

    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should return connection status', () => {
    expect(socketService.isConnected()).toBe(false);

    socketService.connect();
    mockSocket.triggerConnect();
    
    expect(socketService.isConnected()).toBe(true);
  });
});