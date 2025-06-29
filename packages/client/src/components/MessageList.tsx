import styles from './MessageList.module.scss';

export const MessageList = () => {
  return (
    <div className={styles.container}>
      <div className={styles.placeholder}>
        Welcome to the chat! Enter your username to start messaging.
      </div>
    </div>
  );
};