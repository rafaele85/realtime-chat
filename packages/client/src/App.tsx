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
      console.log('📨 Received message event:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('message:receive', (message: Message) => {
      console.log('📨 Received message:receive event:', message);
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handleSendMessage = (username: string, content: string) => {
    socketService.sendMessage(username, content);
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
          <MessageInput username={username} onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
};