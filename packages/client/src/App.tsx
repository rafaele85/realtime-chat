import { useState, useEffect } from 'react';
import { Message } from 'shared';
import { UsernameInput } from './components/UsernameInput';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import * as socketService from './services/socketService';
import styles from './App.module.scss';

export const App = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <UsernameInput 
          onUsernameSubmit={handleUsernameSubmit}
          isDisabled={username.length > 0}
          currentUsername={username}
        />
      </div>
      
      <div className={styles.messages}>
        <MessageList messages={messages} />
      </div>
      
      {username.length > 0 && (
        <div className={styles.input}>
          <MessageInput username={username} />
        </div>
      )}
    </div>
  );
};