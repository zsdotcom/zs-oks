import { test, expect } from '@playwright/test';

test.describe('Chat flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('chat textarea exists and accepts input', async ({ page }) => {
    const textarea = page.getByPlaceholder('Ask anything... (Enter to send, Shift+Enter for new line)');
    await expect(textarea).toBeVisible();
    await textarea.fill('Hello, AI!');
    await expect(textarea).toHaveValue('Hello, AI!');
  });

  test('typing a message and sending it makes it appear in chat', async ({ page }) => {
    const textarea = page.getByPlaceholder('Ask anything... (Enter to send, Shift+Enter for new line)');
    await textarea.fill('What is Open Knowledge Studio?');
    await textarea.press('Enter');

    const userMessage = page.locator('.chat-container').getByText('What is Open Knowledge Studio?');
    await expect(userMessage).toBeVisible();
  });

  test('suggestion chips appear when chat is empty', async ({ page }) => {
    await page.waitForTimeout(2000);
    const tryAsking = page.locator('text=Try asking');
    await expect(tryAsking).toBeVisible();
  });

  test('voice button exists', async ({ page }) => {
    const voiceButton = page.locator('button[title="Voice input"]');
    await expect(voiceButton).toBeVisible();
  });

  test('formatting toolbar buttons exist', async ({ page }) => {
    await expect(page.locator('button[title="Bold"]')).toBeVisible();
    await expect(page.locator('button[title="Italic"]')).toBeVisible();
    await expect(page.locator('button[title="Heading"]')).toBeVisible();
  });
});
