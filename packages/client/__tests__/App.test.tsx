import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import * as socketService from '../src/services/socketService';

// Mock socket object
const mockSocket = {
  on: jest.fn((event, callback) => {
    // Immediately call connect callback to simulate connected state
    if (event === 'connect') {
      setTimeout(callback, 0);
    }
  }),
  disconnect: jest.fn(),
};

// Mock the socket service
jest.mock('../src/services/socketService', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe('App', () => {
  const mockConnect = socketService.connect as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect.mockReturnValue(mockSocket);
  });

  it('should render username input initially', async () => {
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Join Chat')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the chat! Enter your username to start messaging.')).toBeInTheDocument();
  });

  it('should show message input after username is set', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    });
    
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const joinButton = screen.getByText('Join Chat');
    
    await act(async () => {
      await user.type(usernameInput, 'testuser');
    });
    
    await act(async () => {
      await user.click(joinButton);
    });
    
    expect(screen.getByText('Username: testuser')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('should not show message input if username is not set', async () => {
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    });
    
    expect(screen.queryByPlaceholderText('Type your message...')).not.toBeInTheDocument();
    expect(screen.queryByText('Send')).not.toBeInTheDocument();
  });
});