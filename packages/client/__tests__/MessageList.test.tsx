import { render, screen } from '@testing-library/react';
import { MessageList } from '../src/components/MessageList';
import { Message } from 'shared';

describe('MessageList integration', () => {
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
    render(<MessageList messages={mockMessages} />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('should display messages in order', () => {
    render(<MessageList messages={mockMessages} />);

    const messageItems = screen.getAllByTestId('message-item');
    expect(messageItems).toHaveLength(2);
    expect(messageItems[0]).toHaveTextContent('First message');
    expect(messageItems[1]).toHaveTextContent('Second message');
  });

  it('should show placeholder when no messages', () => {
    render(<MessageList messages={[]} />);

    expect(screen.getByText('Welcome to the chat! Enter your username to start messaging.')).toBeInTheDocument();
  });

  it('should handle empty messages array', () => {
    render(<MessageList messages={[]} />);

    expect(screen.queryByTestId('message-item')).not.toBeInTheDocument();
  });
});