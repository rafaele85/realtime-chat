import { render, screen } from '@testing-library/react';
import { MessageListItem } from '../src/components/MessageListItem';

describe('MessageListItem', () => {
  const mockMessage = {
    id: '1',
    username: 'testuser',
    content: 'Test message content',
    timestamp: 1609459200000, // 2021-01-01 00:00:00 UTC
  };

  it('should render message content and username', () => {
    render(
      <MessageListItem 
        message={mockMessage} 
        isCurrentUser={false} 
        isLatest={false} 
      />,
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('should display formatted timestamp', () => {
    render(
      <MessageListItem 
        message={mockMessage} 
        isCurrentUser={false} 
        isLatest={false} 
      />,
    );

    // Should display time in HH:MM:SS format
    const timestampRegex = /\d{2}:\d{2}:\d{2}/;
    expect(screen.getByText(timestampRegex)).toBeInTheDocument();
  });

  it('should apply currentUser class when isCurrentUser is true', () => {
    render(
      <MessageListItem 
        message={mockMessage} 
        isCurrentUser={true} 
        isLatest={false} 
      />,
    );

    const messageElement = screen.getByTestId('message-item');
    expect(messageElement).toHaveClass('currentUser');
    expect(messageElement).not.toHaveClass('otherUser');
  });

  it('should apply otherUser class when isCurrentUser is false', () => {
    render(
      <MessageListItem 
        message={mockMessage} 
        isCurrentUser={false} 
        isLatest={false} 
      />,
    );

    const messageElement = screen.getByTestId('message-item');
    expect(messageElement).toHaveClass('otherUser');
    expect(messageElement).not.toHaveClass('currentUser');
  });

  it('should apply bounceIn class when isLatest is true', () => {
    render(
      <MessageListItem 
        message={mockMessage} 
        isCurrentUser={false} 
        isLatest={true} 
      />,
    );

    const messageElement = screen.getByTestId('message-item');
    expect(messageElement).toHaveClass('bounceIn');
  });

  it('should not apply bounceIn class when isLatest is false', () => {
    render(
      <MessageListItem 
        message={mockMessage} 
        isCurrentUser={false} 
        isLatest={false} 
      />,
    );

    const messageElement = screen.getByTestId('message-item');
    expect(messageElement).not.toHaveClass('bounceIn');
  });

  it('should combine classes correctly for current user latest message', () => {
    render(
      <MessageListItem 
        message={mockMessage} 
        isCurrentUser={true} 
        isLatest={true} 
      />,
    );

    const messageElement = screen.getByTestId('message-item');
    expect(messageElement).toHaveClass('currentUser');
    expect(messageElement).toHaveClass('bounceIn');
    expect(messageElement).not.toHaveClass('otherUser');
  });

  it('should handle long message content properly', () => {
    const longMessage = {
      ...mockMessage,
      content: 'This is a very long message that should wrap properly and not break the layout of the message bubble component.',
    };

    render(
      <MessageListItem 
        message={longMessage} 
        isCurrentUser={false} 
        isLatest={false} 
      />,
    );

    expect(screen.getByText(longMessage.content)).toBeInTheDocument();
  });

  it('should handle special characters in message content', () => {
    const specialMessage = {
      ...mockMessage,
      content: 'Message with special chars: !@#$%^&*()_+ 🚀 <script>alert("test")</script>',
    };

    render(
      <MessageListItem 
        message={specialMessage} 
        isCurrentUser={false} 
        isLatest={false} 
      />,
    );

    expect(screen.getByText(specialMessage.content)).toBeInTheDocument();
  });

  it('should handle different timezone timestamps correctly', () => {
    const futureMessage = {
      ...mockMessage,
      timestamp: Date.now(), // Current timestamp
    };

    render(
      <MessageListItem 
        message={futureMessage} 
        isCurrentUser={false} 
        isLatest={false} 
      />,
    );

    // Should still display a valid time format
    const timestampRegex = /\d{2}:\d{2}:\d{2}/;
    expect(screen.getByText(timestampRegex)).toBeInTheDocument();
  });
});