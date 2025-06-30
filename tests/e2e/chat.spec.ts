import { test, expect } from '@playwright/test';

test.describe('Chat Application - Integration', () => {
  test('should complete full user flow from username to messaging', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Initial state
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByText('Join Chat')).toBeVisible();
    await expect(page.getByText('Welcome to the chat! Enter your username to start messaging.')).toBeVisible();
    
    // Enter username and join
    await page.getByPlaceholder('Enter your username').fill('integrationuser');
    await page.getByText('Join Chat').click();
    
    // Verify transition to messaging interface
    await expect(page.getByText('Username: integrationuser')).toBeVisible();
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible();
    await expect(page.getByText('Send')).toBeVisible();
    
    // Send a message and verify it appears
    const uniqueMessage = `Integration test ${Date.now()}`;
    await page.getByPlaceholder('Type your message...').fill(uniqueMessage);
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Verify complete message display
    await expect(page.getByText(uniqueMessage)).toBeVisible();
    const messageItem = page.getByTestId('message-item').filter({ hasText: uniqueMessage });
    await expect(messageItem).toContainText('integrationuser');
    
    // Verify input is ready for next message
    await expect(page.getByPlaceholder('Type your message...')).toHaveValue('');
  });
});