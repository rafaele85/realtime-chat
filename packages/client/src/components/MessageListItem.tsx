import { Message } from 'shared';
import { formatTime } from '../utils/timeUtils';
import styles from './MessageListItem.module.css';

type MessageListItemProps = {
  message: Message;
  isCurrentUser: boolean;
  isLatest: boolean;
};

export const MessageListItem = ({ message, isCurrentUser, isLatest }: MessageListItemProps) => {

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