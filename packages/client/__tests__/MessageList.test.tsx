import { render, screen } from '@testing-library/react';
import { MessageList } from '../src/components/MessageList';
import { Message } from 'shared';

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('MessageList integration', () => {
  beforeEach(() => {
    mockScrollIntoView.mockClear();
  });

  const mockMessages: Message[] = [
    {
      id: '1',
      username: 'user1',
      content: 'First message',
      timestamp: 1609459200000,
    },
    {
      id: '2',
      username: 'user2',
      content: 'Second message',
      timestamp: 1609459260000,
    },
  ];

  it('should display messages passed as props', () => {
    render(<MessageList messages={mockMessages} currentUsername="user1" />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('should display messages in order', () => {
    render(<MessageList messages={mockMessages} currentUsername="user1" />);

    const messageItems = screen.getAllByTestId('message-item');
    expect(messageItems).toHaveLength(2);
    expect(messageItems[0]).toHaveTextContent('First message');
    expect(messageItems[1]).toHaveTextContent('Second message');
  });

  it('should show placeholder when no messages', () => {
    render(<MessageList messages={[]} currentUsername="user1" />);

    expect(screen.getByText('Welcome to the chat! Enter your username to start messaging.')).toBeInTheDocument();
  });

  it('should handle empty messages array', () => {
    render(<MessageList messages={[]} currentUsername="user1" />);

    expect(screen.queryByTestId('message-item')).not.toBeInTheDocument();
  });

  it('should apply different styles for current user vs other users', () => {
    render(<MessageList messages={mockMessages} currentUsername="user1" />);

    const messageItems = screen.getAllByTestId('message-item');
    
    // First message is from current user (user1)
    expect(messageItems[0]).toHaveClass('currentUser');
    expect(messageItems[0]).not.toHaveClass('otherUser');
    
    // Second message is from other user (user2)
    expect(messageItems[1]).toHaveClass('otherUser');
    expect(messageItems[1]).not.toHaveClass('currentUser');
  });

  it('should apply bounce-in animation to the latest message only', () => {
    render(<MessageList messages={mockMessages} currentUsername="user1" />);

    const messageItems = screen.getAllByTestId('message-item');
    
    // Only the last message should have bounce-in animation
    expect(messageItems[0]).not.toHaveClass('bounceIn');
    expect(messageItems[1]).toHaveClass('bounceIn');
  });

  it('should display timestamps for all messages', () => {
    render(<MessageList messages={mockMessages} currentUsername="user1" />);

    // Check that timestamps are displayed (formatted as HH:MM:SS)
    const timestampRegex = /\d{2}:\d{2}:\d{2}/;
    const timestamps = screen.getAllByText(timestampRegex);
    expect(timestamps).toHaveLength(2); // Two messages should have timestamps
  });
});