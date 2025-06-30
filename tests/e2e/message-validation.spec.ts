import { test, expect } from '@playwright/test';

test.describe('Message Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter your username').fill('testuser');
    await page.getByText('Join Chat').click();
  });

  test('should not send empty message', async ({ page }) => {
    // Use unique username to avoid interference
    const uniqueUser = `emptyuser${Date.now()}`;
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter your username').fill(uniqueUser);
    await page.getByText('Join Chat').click();
    
    // Try to send empty message by clicking Send button
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Try to send empty message by pressing Enter
    await page.getByPlaceholder('Type your message...').press('Enter');
    
    // Verify no message from this user exists
    const userMessages = page.getByTestId('message-item').filter({ hasText: uniqueUser });
    await expect(userMessages).toHaveCount(0);
  });

  test('should not send whitespace-only message', async ({ page }) => {
    // Use unique username to avoid interference
    const uniqueUser = `whitespaceuser${Date.now()}`;
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter your username').fill(uniqueUser);
    await page.getByText('Join Chat').click();
    
    const messageInput = page.getByPlaceholder('Type your message...');
    await messageInput.fill('   \t  \n  ');
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Verify input is cleared
    await expect(messageInput).toHaveValue('');
    
    // Verify no message exists
    const userMessages = page.getByTestId('message-item').filter({ hasText: uniqueUser });
    await expect(userMessages).toHaveCount(0);
  });

  test('should trim whitespace from message content', async ({ page }) => {
    const uniqueContent = `Trimmed message ${Date.now()}`;
    await page.getByPlaceholder('Type your message...').fill(`  ${uniqueContent}  `);
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Verify message appears with trimmed content
    const messageWithContent = page.getByTestId('message-item').filter({ hasText: uniqueContent });
    await expect(messageWithContent).toHaveCount(1);
    
    const messageContent = messageWithContent.locator('div').last();
    await expect(messageContent).toHaveText(uniqueContent);
  });
});