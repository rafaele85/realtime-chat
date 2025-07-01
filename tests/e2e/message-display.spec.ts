import { test, expect } from '@playwright/test';

test.describe('Message Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter your username').fill('displayuser');
    await page.getByText('Join Chat').click();
  });

  test('should display message with username and timestamp', async ({ page }) => {
    const uniqueMessage = `Display test ${Date.now()}`;
    await page.getByPlaceholder('Type your message...').fill(uniqueMessage);
    await page.getByRole('button', { name: 'Send' }).click();
    
    const messageItem = page.getByTestId('message-item').filter({ hasText: uniqueMessage });
    await expect(messageItem).toBeVisible();
    
    // Check username is displayed
    await expect(messageItem.getByText('displayuser')).toBeVisible();
    
    // Check timestamp format (HH:MM:SS)
    const messageText = await messageItem.textContent();
    expect(messageText).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  test('should handle multiple messages correctly', async ({ page }) => {
    // Use unique username to avoid interference with other tests
    const uniqueUser = `multiuser${Date.now()}`;
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter your username').fill(uniqueUser);
    await page.getByText('Join Chat').click();
    
    const messageInput = page.getByPlaceholder('Type your message...');
    const timestamp = Date.now();
    
    // Send two messages
    const firstMessage = `First ${timestamp}`;
    const secondMessage = `Second ${timestamp}`;
    
    await messageInput.fill(firstMessage);
    await page.getByRole('button', { name: 'Send' }).click();
    
    await messageInput.fill(secondMessage);
    await messageInput.press('Enter');
    
    // Verify both messages appear
    await expect(page.getByText(firstMessage)).toBeVisible();
    await expect(page.getByText(secondMessage)).toBeVisible();
    
    const userMessages = page.getByTestId('message-item').filter({ hasText: uniqueUser });
    await expect(userMessages).toHaveCount(2);
  });
});