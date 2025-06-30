import { Message } from 'shared';
import styles from './MessageList.module.scss';

type MessageListProps = {
  messages: Message[];
};

export const MessageList = ({ messages }: MessageListProps) => {
  console.log('📋 MessageList rendered with messages:', messages);
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
      {messages.map((message) => (
        <div key={message.id} data-testid="message-item" className={styles.message}>
          <span className={styles.username}>{message.username}</span>
          <span className={styles.content}>{message.content}</span>
        </div>
      ))}
    </div>
  );
};