import { useState, useEffect } from 'react';
import { Message } from 'shared';
import { UsernameInput } from './components/UsernameInput';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import * as socketService from './services/socketService';
import styles from './App.module.scss';

export const App = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    const socket = socketService.connect();
    
    socket.on('connect', () => {
      console.log('🔌 Connected to server');
      setIsConnecting(false);
    });

    socket.on('message', (message: Message) => {
      console.log('📨 Received message event:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('message:receive', (message: Message) => {
      console.log('📨 Received message:receive event:', message);
      setMessages(prev => [...prev, message]);
    });

    // Set a timeout to stop loading even if connect event doesn't fire
    const connectTimeout = setTimeout(() => {
      setIsConnecting(false);
    }, 3000);

    return () => {
      clearTimeout(connectTimeout);
      socketService.disconnect();
    };
  }, []);

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
  };

  const handleSendMessage = (username: string, content: string) => {
    socketService.sendMessage(username, content);
  };

  if (isConnecting) {
    return (
      <div className={styles.app}>
        <LoadingSpinner message="Connecting to chat server..." />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <ErrorBoundary>
        <div className={styles.header}>
          <UsernameInput 
            onUsernameSubmit={handleUsernameSubmit}
            isDisabled={username.length > 0}
            currentUsername={username}
          />
        </div>
        
        <div className={styles.messages}>
          <MessageList messages={messages} currentUsername={username} />
        </div>
        
        {username.length > 0 && (
          <div className={styles.input}>
            <MessageInput username={username} onSendMessage={handleSendMessage} />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};