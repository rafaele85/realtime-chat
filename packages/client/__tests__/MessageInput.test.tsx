import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MessageInput } from '../src/components/MessageInput';

describe('MessageInput', () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    mockOnSendMessage.mockClear();
  });

  it('should render message input form', () => {
    render(<MessageInput username="testuser" onSendMessage={mockOnSendMessage} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('should call onSendMessage and clear input after sending message', async () => {
    const user = userEvent.setup();
    render(<MessageInput username="testuser" onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByText('Send');
    
    await act(async () => {
      await user.type(input, 'Hello world');
    });
    
    await act(async () => {
      await user.click(button);
    });
    
    expect(input).toHaveValue('');
    expect(mockOnSendMessage).toHaveBeenCalledWith('testuser', 'Hello world');
  });

  it('should not call onSendMessage for empty message', async () => {
    const user = userEvent.setup();
    render(<MessageInput username="testuser" onSendMessage={mockOnSendMessage} />);
    
    const button = screen.getByText('Send');
    
    await act(async () => {
      await user.click(button);
    });
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it('should trim whitespace from message before sending', async () => {
    const user = userEvent.setup();
    render(<MessageInput username="testuser" onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByText('Send');
    
    await act(async () => {
      await user.type(input, '  Hello world  ');
    });
    
    await act(async () => {
      await user.click(button);
    });
    
    expect(mockOnSendMessage).toHaveBeenCalledWith('testuser', 'Hello world');
  });

  it('should not call onSendMessage for whitespace-only message', async () => {
    const user = userEvent.setup();
    render(<MessageInput username="testuser" onSendMessage={mockOnSendMessage} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    const button = screen.getByText('Send');
    
    await act(async () => {
      await user.type(input, '   ');
    });
    
    await act(async () => {
      await user.click(button);
    });
    
    expect(mockOnSendMessage).not.toHaveBeenCalled();
    expect(input).toHaveValue('');
  });
});