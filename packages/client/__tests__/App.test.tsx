import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

describe('App', () => {
  it('should render username input initially', () => {
    render(<App />);
    
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByText('Join Chat')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the chat! Enter your username to start messaging.')).toBeInTheDocument();
  });

  it('should show message input after username is set', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const joinButton = screen.getByText('Join Chat');
    
    await user.type(usernameInput, 'testuser');
    await user.click(joinButton);
    
    expect(screen.getByText('Username: testuser')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('should not show message input if username is not set', () => {
    render(<App />);
    
    expect(screen.queryByPlaceholderText('Type your message...')).not.toBeInTheDocument();
    expect(screen.queryByText('Send')).not.toBeInTheDocument();
  });
});