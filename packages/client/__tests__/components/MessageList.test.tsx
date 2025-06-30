import { render } from '@testing-library/react';
import { MessageList } from '../../src/components/MessageList';
import { Message } from 'shared';

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('MessageList', () => {
  const mockMessages: Message[] = [
    {
      id: '1',
      username: 'user1',
      content: 'Hello',
      timestamp: Date.now() - 1000,
    },
    {
      id: '2',
      username: 'user2',
      content: 'Hi there',
      timestamp: Date.now(),
    },
  ];

  beforeEach(() => {
    mockScrollIntoView.mockClear();
  });

  it('should auto-scroll to latest message when new message is added', () => {
    const { rerender } = render(
      <MessageList messages={mockMessages} currentUsername="user1" />,
    );

    // Add a new message
    const newMessage: Message = {
      id: '3',
      username: 'user1',
      content: 'New message',
      timestamp: Date.now() + 1000,
    };

    rerender(
      <MessageList messages={[...mockMessages, newMessage]} currentUsername="user1" />,
    );

    // Should scroll to the latest message
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'end',
    });
  });

  it('should scroll to latest message on initial render', () => {
    render(<MessageList messages={mockMessages} currentUsername="user1" />);

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'end',
    });
  });

  it('should not scroll when messages array is empty', () => {
    render(<MessageList messages={[]} currentUsername="user1" />);

    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });
});