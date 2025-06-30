import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import * as socketService from '../src/services/socketService';

// Mock socket object
const mockSocket = {
  on: jest.fn(),
  disconnect: jest.fn(),
};

// Mock the socket service
jest.mock('../src/services/socketService', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe('App socket integration', () => {
  const mockConnect = socketService.connect as jest.Mock;
  const mockDisconnect = socketService.disconnect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockReturnValue(mockSocket);
  });

  it('should connect to socket service on mount', () => {
    render(<App />);

    expect(mockConnect).toHaveBeenCalled();
    expect(mockSocket.on).toHaveBeenCalledWith('message', expect.any(Function));
  });

  it('should disconnect from socket on unmount', () => {
    const { unmount } = render(<App />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should display received messages in MessageList', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Set username first
    await act(async () => {
      await user.type(screen.getByPlaceholderText('Enter your username'), 'testuser');
    });
    
    await act(async () => {
      await user.click(screen.getByText('Join Chat'));
    });
    
    // Get the message handler function passed to socket.on
    const messageHandler = mockSocket.on.mock.calls.find(call => call[0] === 'message')[1];
    
    // Simulate receiving a message
    const testMessage = {
      id: '1',
      username: 'otheruser',
      content: 'Hello from socket',
      timestamp: Date.now(),
    };
    
    act(() => {
      messageHandler(testMessage);
    });

    await waitFor(() => {
      expect(screen.getByText('otheruser')).toBeInTheDocument();
      expect(screen.getByText('Hello from socket')).toBeInTheDocument();
    });
  });

  it('should accumulate multiple received messages', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Set username first
    await act(async () => {
      await user.type(screen.getByPlaceholderText('Enter your username'), 'testuser');
    });
    
    await act(async () => {
      await user.click(screen.getByText('Join Chat'));
    });
    
    const messageHandler = mockSocket.on.mock.calls.find(call => call[0] === 'message')[1];
    
    // Simulate receiving multiple messages
    act(() => {
      messageHandler({
        id: '1',
        username: 'user1',
        content: 'First message',
        timestamp: Date.now(),
      });
      
      messageHandler({
        id: '2',
        username: 'user2',
        content: 'Second message',
        timestamp: Date.now() + 1000,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('First message')).toBeInTheDocument();
      expect(screen.getByText('Second message')).toBeInTheDocument();
    });
  });
});