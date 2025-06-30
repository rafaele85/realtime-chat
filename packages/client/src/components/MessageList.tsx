import { useEffect, useRef } from 'react';
import { Message } from 'shared';
import { MessageListItem } from './MessageListItem';
import styles from './MessageList.module.scss';

type MessageListProps = {
  messages: Message[];
  currentUsername: string;
};

export const MessageList = ({ messages, currentUsername }: MessageListProps) => {
  console.log('📋 MessageList rendered with messages:', messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end', 
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          Welcome to the chat! Enter your username to start messaging.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {messages.map((message, index) => {
        const isCurrentUser = message.username === currentUsername;
        const isLatest = index === messages.length - 1;
        
        return (
          <MessageListItem
            key={message.id}
            message={message}
            isCurrentUser={isCurrentUser}
            isLatest={isLatest}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};