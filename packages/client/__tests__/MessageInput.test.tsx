import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageInput } from '../src/components/MessageInput';

// Mock console.log to avoid output during tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe('MessageInput', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('should render message input form', () => {
    render(<MessageInput username="testuser" />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('should clear input after sending message', async () => {
    const user = userEvent.setup();
    render(<MessageInput username="testuser" />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByText('Send');
    
    await user.type(input, 'Hello world');
    await user.click(button);
    
    expect(input).toHaveValue('');
    expect(mockConsoleLog).toHaveBeenCalledWith('Sending message:', {
      username: 'testuser',
      content: 'Hello world',
    });
  });

  it('should not send empty message', async () => {
    const user = userEvent.setup();
    render(<MessageInput username="testuser" />);
    
    const button = screen.getByText('Send');
    await user.click(button);
    
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should trim whitespace from message', async () => {
    const user = userEvent.setup();
    render(<MessageInput username="testuser" />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByText('Send');
    
    await user.type(input, '  Hello world  ');
    await user.click(button);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('Sending message:', {
      username: 'testuser',
      content: 'Hello world',
    });
  });
});