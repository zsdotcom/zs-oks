import { test, expect } from '@playwright/test';

test.describe('Theme switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('theme toggle switches between light and dark mode', async ({ page }) => {
    const sunButton = page.locator('button[title="Switch to light mode"]');
    await expect(sunButton).toBeVisible();
    await sunButton.click();
    await page.waitForTimeout(300);

    const moonButton = page.locator('button[title="Switch to dark mode"]');
    await expect(moonButton).toBeVisible();
  });

  test('theme state persists after toggle', async ({ page }) => {
    await page.locator('button[title="Switch to light mode"]').click();
    await page.waitForTimeout(300);
    const hasDarkToggle = await page.locator('button[title="Switch to dark mode"]').count();
    expect(hasDarkToggle).toBe(1);
  });
});
