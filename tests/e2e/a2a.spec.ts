import { test, expect } from '@playwright/test';

test.describe('A2A panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('open A2A Dashboard and verify heading is displayed', async ({ page }) => {
    await page.locator('[aria-label="Switch to Dashboard view"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=A2A Observability Dashboard')).toBeVisible();
  });

  test('Settings panel has Run Demo Debate button', async ({ page }) => {
    await page.locator('button:has(svg[data-lucide="settings"])').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Run Demo Debate')).toBeVisible();
  });
});
