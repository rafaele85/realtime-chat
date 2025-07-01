import { test, expect } from '@playwright/test';

test.describe('Auto-scroll Behavior', () => {
  test('should auto-scroll to newest messages', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByPlaceholder('Enter your username').fill('scrolluser');
    await page.getByText('Join Chat').click();
    
    const messageInput = page.getByPlaceholder('Type your message...');
    
    // Send multiple messages to test scrolling
    const messages = [];
    for (let i = 1; i <= 3; i++) {
      const message = `Scroll test ${i} ${Date.now()}`;
      messages.push(message);
      await messageInput.fill(message);
      await page.getByRole('button', { name: 'Send' }).click();
      await expect(messageInput).toHaveValue('');
    }
    
    // Wait for potential scroll animation
    await page.waitForTimeout(100);
    
    // Last message should be visible
    const lastMessage = messages[messages.length - 1];
    await expect(page.getByText(lastMessage)).toBeVisible();
  });
});