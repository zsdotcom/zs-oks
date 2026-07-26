import { test, expect } from '@playwright/test';

test.describe('Settings sandbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('open settings panel and verify sandbox settings are present', async ({ page }) => {
    await page.locator('button:has(svg[data-lucide="settings"])').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Settings')).toBeVisible();
    await expect(page.locator('text=Sandbox')).toBeVisible();
    await expect(page.locator('label:has-text("Strict sandbox mode")')).toBeVisible();
    await expect(page.locator('label:has-text("Allow outbound requests")')).toBeVisible();
    await expect(page.locator('label:has-text("Show audit ledger")')).toBeVisible();
  });

  test('toggle a sandbox setting', async ({ page }) => {
    await page.locator('button:has(svg[data-lucide="settings"])').click();
    await page.waitForTimeout(500);

    const strictCheckbox = page.locator('label:has-text("Strict sandbox mode") input[type="checkbox"]');
    await expect(strictCheckbox).toBeVisible();
    const initialChecked = await strictCheckbox.isChecked();
    await strictCheckbox.click();
    await expect(strictCheckbox).toBeChecked({ checked: !initialChecked });
  });
});
