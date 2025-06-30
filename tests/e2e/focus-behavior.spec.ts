import { test, expect } from '@playwright/test';

test.describe('Focus Behavior', () => {
  test('should auto-focus username input on page load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const usernameInput = page.getByPlaceholder('Enter your username');
    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toBeFocused();
  });

  test('should auto-focus message input after username entry', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.getByPlaceholder('Enter your username').fill('focususer');
    await page.getByText('Join Chat').click();
    
    const messageInput = page.getByPlaceholder('Type your message...');
    await expect(messageInput).toBeVisible();
    await expect(messageInput).toBeFocused();
  });
});