import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import styles from './MessageInput.module.scss';

type MessageInputProps = {
  username: string;
  onSendMessage: (username: string, content: string) => void;
};

export const MessageInput = ({ username, onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(username, message.trim());
    }
    setMessage('');
  }, [message, username, onSendMessage]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className={styles.input}
        autoFocus
      />
      <button type="submit" className={styles.button}>
        Send
      </button>
    </form>
  );
};