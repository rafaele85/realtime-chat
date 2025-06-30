import { test, expect } from '@playwright/test';

test.describe('Chat Application', () => {
  test('should allow user to set username and show message input', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Should show username input initially
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByText('Join Chat')).toBeVisible();
    await expect(page.getByText('Welcome to the chat! Enter your username to start messaging.')).toBeVisible();
    
    // Enter username
    await page.getByPlaceholder('Enter your username').fill('testuser');
    await page.getByText('Join Chat').click();
    
    // Should show username and message input
    await expect(page.getByText('Username: testuser')).toBeVisible();
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible();
    await expect(page.getByText('Send')).toBeVisible();
  });

  test('should not allow empty username submission', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Try to submit empty username
    await page.getByText('Join Chat').click();
    
    // Should still show username input
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByText('Join Chat')).toBeVisible();
  });

  test('should trim whitespace from username', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Enter username with whitespace
    await page.getByPlaceholder('Enter your username').fill('  testuser  ');
    await page.getByText('Join Chat').click();
    
    // Should show trimmed username
    await expect(page.getByText('Username: testuser')).toBeVisible();
  });

  test('should send message when Send button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set username first
    await page.getByPlaceholder('Enter your username').fill('alice');
    await page.getByText('Join Chat').click();
    
    // Verify message input is visible
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible();
    
    // Type and send message
    const uniqueMessage = `Hello e2e world ${Date.now()}`;
    await page.getByPlaceholder('Type your message...').fill(uniqueMessage);
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Verify input clears
    await expect(page.getByPlaceholder('Type your message...')).toHaveValue('');
    
    // Verify specific message appears
    await expect(page.getByText(uniqueMessage)).toBeVisible();
    
    // Verify username appears in message (not just header)
    const messageWithContent = page.getByTestId('message-item').filter({ hasText: uniqueMessage });
    await expect(messageWithContent).toContainText('alice');
  });

  test('should send message when Enter key is pressed', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set username first
    await page.getByPlaceholder('Enter your username').fill('bob');
    await page.getByText('Join Chat').click();
    
    // Type message and press Enter
    const messageInput = page.getByPlaceholder('Type your message...');
    const uniqueMessage = `Enter key test ${Date.now()}`;
    await messageInput.fill(uniqueMessage);
    await messageInput.press('Enter');
    
    // Verify input clears
    await expect(messageInput).toHaveValue('');
    
    // Verify specific message appears
    await expect(page.getByText(uniqueMessage)).toBeVisible();
    
    // Verify username appears in message (not just header)
    const messageWithContent = page.getByTestId('message-item').filter({ hasText: uniqueMessage });
    await expect(messageWithContent).toContainText('bob');
  });

  test('should not send empty message', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set username first
    const testUsername = `charlie${Date.now()}`;
    await page.getByPlaceholder('Enter your username').fill(testUsername);
    await page.getByText('Join Chat').click();
    
    // Try to send empty message by clicking Send button
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Try to send empty message by pressing Enter
    await page.getByPlaceholder('Type your message...').press('Enter');
    
    // Verify no message from this user exists in chat messages
    const userMessages = page.getByTestId('message-item').filter({ hasText: testUsername });
    await expect(userMessages).toHaveCount(0);
  });

  test('should not send whitespace-only message', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set username first
    const testUsername = `diana${Date.now()}`;
    await page.getByPlaceholder('Enter your username').fill(testUsername);
    await page.getByText('Join Chat').click();
    
    // Try to send whitespace-only message
    const messageInput = page.getByPlaceholder('Type your message...');
    await messageInput.fill('   \t  \n  ');
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Verify input is cleared
    await expect(messageInput).toHaveValue('');
    
    // Verify no message from this user exists in chat messages
    const userMessages = page.getByTestId('message-item').filter({ hasText: testUsername });
    await expect(userMessages).toHaveCount(0);
  });

  test('should trim whitespace from message before sending', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set username first
    await page.getByPlaceholder('Enter your username').fill('eve');
    await page.getByText('Join Chat').click();
    
    // Send message with leading and trailing whitespace
    const uniqueContent = `Trimmed message ${Date.now()}`;
    await page.getByPlaceholder('Type your message...').fill(`  ${uniqueContent}  `);
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Verify input clears
    await expect(page.getByPlaceholder('Type your message...')).toHaveValue('');
    
    // Verify message appears with exactly trimmed content
    const messageWithContent = page.getByTestId('message-item').filter({ hasText: uniqueContent });
    await expect(messageWithContent).toHaveCount(1);
    
    // Check exact content in the content span (second span element)
    const messageContent = messageWithContent.locator('span').nth(1);
    await expect(messageContent).toHaveText(uniqueContent);
  });

  test('should handle multiple messages in sequence', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Set username first
    await page.getByPlaceholder('Enter your username').fill('frank');
    await page.getByText('Join Chat').click();
    
    const messageInput = page.getByPlaceholder('Type your message...');
    const timestamp = Date.now();
    
    // Send first message
    const firstMessage = `First message ${timestamp}`;
    await messageInput.fill(firstMessage);
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(messageInput).toHaveValue('');
    
    // Send second message using Enter key
    const secondMessage = `Second message ${timestamp}`;
    await messageInput.fill(secondMessage);
    await messageInput.press('Enter');
    await expect(messageInput).toHaveValue('');
    
    // Verify both specific messages appear
    await expect(page.getByText(firstMessage)).toBeVisible();
    await expect(page.getByText(secondMessage)).toBeVisible();
    
    // Verify both messages are from frank
    const frankMessages = page.getByTestId('message-item').filter({ hasText: 'frank' });
    await expect(frankMessages.filter({ hasText: firstMessage })).toHaveCount(1);
    await expect(frankMessages.filter({ hasText: secondMessage })).toHaveCount(1);
  });
});