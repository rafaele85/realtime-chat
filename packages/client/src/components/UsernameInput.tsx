import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import styles from './UsernameInput.module.scss';

type UsernameInputProps = {
  onUsernameSubmit: (username: string) => void;
  isDisabled: boolean;
  currentUsername: string;
};

export const UsernameInput = ({ onUsernameSubmit, isDisabled, currentUsername }: UsernameInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onUsernameSubmit(inputValue.trim());
    }
  }, [inputValue, onUsernameSubmit]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  if (isDisabled) {
    return (
      <div className={styles.container}>
        <span className={styles.label}>Username: {currentUsername}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter your username"
        className={styles.input}
        autoFocus
      />
      <button type="submit" className={styles.button}>
        Join Chat
      </button>
    </form>
  );
};