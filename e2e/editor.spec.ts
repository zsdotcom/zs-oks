import { test, expect } from '@playwright/test';

test.describe('Document editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Create a file via the UI so we have something to edit
    await page.locator('button[title="New file"]').click();
    await page.locator('input[placeholder="filename.md"]').fill('TestDoc.md');
    await page.locator('button:has-text("Create")').click();
    await page.waitForTimeout(500);
  });

  test('editor textarea appears after creating a file', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder="Start writing in Markdown..."]');
    await expect(textarea).toBeVisible();
  });

  test('typing in the editor updates the preview', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder="Start writing in Markdown..."]');
    await textarea.fill('# My Heading\n\nSome **bold** text');
    await page.waitForTimeout(500);
    const preview = page.locator('.prose');
    await expect(preview).toContainText('My Heading');
  });

  test('toolbar buttons are present', async ({ page }) => {
    await page.waitForTimeout(500);
    await expect(page.locator('button[title="Table of Contents"]')).toBeVisible();
    await expect(page.locator('button[title="Templates"]')).toBeVisible();
    await expect(page.locator('button[title="Export .md"]')).toBeVisible();
  });
});
