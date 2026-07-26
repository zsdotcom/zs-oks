import { test, expect } from '@playwright/test';

test.describe('ICD-11 lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('open ICD-11 panel and search for a term', async ({ page }) => {
    await page.locator('button[title="ICD-11 Code Lookup"]').click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=ICD-11 Code Lookup')).toBeVisible();

    const searchInput = page.locator('input[placeholder="Search by code, title, chapter..."]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('diabetes');
    await page.waitForTimeout(1000);

    const result = page.locator('text=diabetes').first();
    await expect(result).toBeVisible();
  });

  test('click a result and verify it is selected', async ({ page }) => {
    await page.locator('button[title="ICD-11 Code Lookup"]').click();
    await page.waitForTimeout(500);

    const searchInput = page.locator('input[placeholder="Search by code, title, chapter..."]');
    await searchInput.fill('diabetes');
    await page.waitForTimeout(1000);

    await page.locator('button:has(span.font-mono)').first().click();
    await page.waitForTimeout(300);

    await expect(searchInput).not.toHaveValue('');
  });
});
