import { test, expect } from '@playwright/test';

test.describe('Message Sending', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter your username').fill('sender');
    await page.getByText('Join Chat').click();
  });

  test('should send message with Send button', async ({ page }) => {
    const uniqueMessage = `Button test ${Date.now()}`;
    await page.getByPlaceholder('Type your message...').fill(uniqueMessage);
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Verify input clears and message appears
    await expect(page.getByPlaceholder('Type your message...')).toHaveValue('');
    await expect(page.getByText(uniqueMessage)).toBeVisible();
  });

  test('should send message with Enter key', async ({ page }) => {
    const messageInput = page.getByPlaceholder('Type your message...');
    const uniqueMessage = `Enter test ${Date.now()}`;
    await messageInput.fill(uniqueMessage);
    await messageInput.press('Enter');
    
    // Verify input clears and message appears
    await expect(messageInput).toHaveValue('');
    await expect(page.getByText(uniqueMessage)).toBeVisible();
  });
});