import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsernameInput } from '../src/components/UsernameInput';

describe('UsernameInput', () => {
  const mockOnUsernameSubmit = jest.fn();

  beforeEach(() => {
    mockOnUsernameSubmit.mockClear();
  });

  it('should render input form when not disabled', () => {
    render(
      <UsernameInput 
        onUsernameSubmit={mockOnUsernameSubmit}
        isDisabled={false}
        currentUsername=""
      />
    );
    
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByText('Join Chat')).toBeInTheDocument();
  });

  it('should render current username when disabled', () => {
    render(
      <UsernameInput 
        onUsernameSubmit={mockOnUsernameSubmit}
        isDisabled={true}
        currentUsername="testuser"
      />
    );
    
    expect(screen.getByText('Username: testuser')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter your username')).not.toBeInTheDocument();
  });

  it('should call onUsernameSubmit with trimmed username', async () => {
    const user = userEvent.setup();
    render(
      <UsernameInput 
        onUsernameSubmit={mockOnUsernameSubmit}
        isDisabled={false}
        currentUsername=""
      />
    );
    
    const input = screen.getByPlaceholderText('Enter your username');
    const button = screen.getByText('Join Chat');
    
    await user.type(input, '  testuser  ');
    await user.click(button);
    
    expect(mockOnUsernameSubmit).toHaveBeenCalledWith('testuser');
  });

  it('should not submit empty username', async () => {
    const user = userEvent.setup();
    render(
      <UsernameInput 
        onUsernameSubmit={mockOnUsernameSubmit}
        isDisabled={false}
        currentUsername=""
      />
    );
    
    const button = screen.getByText('Join Chat');
    await user.click(button);
    
    expect(mockOnUsernameSubmit).not.toHaveBeenCalled();
  });
});