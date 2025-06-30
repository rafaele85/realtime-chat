import { test, expect } from '@playwright/test';

test.describe('Username Validation', () => {
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
});