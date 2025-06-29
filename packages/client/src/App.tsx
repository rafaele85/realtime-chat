import { useState } from 'react';
import { UsernameInput } from './components/UsernameInput';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import styles from './App.module.scss';

export const App = () => {
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
    setIsUsernameSet(true);
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <UsernameInput 
          onUsernameSubmit={handleUsernameSubmit}
          isDisabled={isUsernameSet}
          currentUsername={username}
        />
      </div>
      
      <div className={styles.messages}>
        <MessageList />
      </div>
      
      {isUsernameSet && (
        <div className={styles.input}>
          <MessageInput username={username} />
        </div>
      )}
    </div>
  );
};