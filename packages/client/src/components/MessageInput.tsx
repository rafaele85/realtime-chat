import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import styles from './MessageInput.module.scss';

type MessageInputProps = {
  username: string;
};

export const MessageInput = ({ username }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: Send message via socket
      console.log('Sending message:', { username, content: message.trim() });
      setMessage('');
    }
  }, [message, username]);

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
      />
      <button type="submit" className={styles.button}>
        Send
      </button>
    </form>
  );
};