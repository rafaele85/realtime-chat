import { Message } from 'shared';
import styles from './MessageListItem.module.css';

type MessageListItemProps = {
  message: Message;
  isCurrentUser: boolean;
  isLatest: boolean;
};

export const MessageListItem = ({ message, isCurrentUser, isLatest }: MessageListItemProps) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div 
      data-testid="message-item" 
      className={`${styles.message} ${
        isCurrentUser ? styles.currentUser : styles.otherUser
      } ${isLatest ? styles.bounceIn : ''}`}
    >
      <div className={styles.messageHeader}>
        <span className={styles.username}>{message.username}</span>
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
      </div>
      <div className={styles.messageContent}>
        {message.content}
      </div>
    </div>
  );
};