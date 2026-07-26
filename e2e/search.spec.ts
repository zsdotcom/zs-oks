import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Create a file so we have content to search
    await page.locator('button[title="New file"]').click();
    await page.locator('input[placeholder="filename.md"]').fill('SearchableDoc.md');
    await page.locator('button:has-text("Create")').click();
    await page.waitForTimeout(500);
  });

  test('search query returns results', async ({ page }) => {
    await page.locator('[aria-label="Switch to Search view"]').click();
    await page.waitForTimeout(500);

    const searchInput = page.locator('input[placeholder="Search all documents... (Ctrl+K)"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('SearchableDoc');
    await page.waitForTimeout(500);

    await expect(page.locator('text=SearchableDoc.md')).toBeVisible();
  });

  test('clicking a result navigates to editor', async ({ page }) => {
    await page.locator('[aria-label="Switch to Search view"]').click();
    await page.waitForTimeout(500);

    const searchInput = page.locator('input[placeholder="Search all documents... (Ctrl+K)"]');
    await searchInput.fill('SearchableDoc');
    await page.waitForTimeout(500);

    await page.locator('button:has-text("SearchableDoc.md")').first().click();

    const textarea = page.locator('textarea[placeholder="Start writing in Markdown..."]');
    await expect(textarea).toBeVisible();
  });
});
