import { test, expect } from '@playwright/test';

test.describe('Chart The Course - Critical Bug Fixes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Captain\'s Log - Should allow manual entry creation', async ({ page }) => {
    // Navigate to Captain's Log
    await page.click('text=Captain\'s Log');
    await page.waitForURL('**/log');
    
    // Click on create written entry
    await page.click('text=create a written entry');
    
    // Wait for the entry to be created
    await page.waitForSelector('text=Today\'s Entry Complete', { timeout: 10000 });
    
    // Verify the entry was created
    await expect(page.locator('text=Today\'s Entry Complete')).toBeVisible();
  });

  test('Daily Expedition - Should start a new session', async ({ page }) => {
    // Navigate to Daily Expedition
    await page.click('text=Daily Expedition');
    await page.waitForURL('**/expedition');
    
    // Click Begin Expedition button
    await page.click('text=Begin Expedition');
    
    // Wait for session to start (timer should appear)
    await page.waitForSelector('text=End Expedition', { timeout: 10000 });
    
    // Verify session started
    await expect(page.locator('text=End Expedition')).toBeVisible();
  });

  test('Ideas Module - Should update idea status', async ({ page }) => {
    // Navigate to Uncharted Territories
    await page.click('text=Uncharted Territories');
    await page.waitForURL('**/territories');
    
    // Create a new idea first
    await page.click('text=Drop Anchor');
    await page.fill('input[placeholder*="title"]', 'Test Idea for Status Update');
    await page.fill('textarea[placeholder*="description"]', 'This is a test idea');
    await page.click('button:has-text("Save")');
    
    // Wait for idea to be created
    await page.waitForSelector('text=Test Idea for Status Update');
    
    // Hover over the idea card to show actions
    await page.hover('text=Test Idea for Status Update');
    
    // Click Explore button
    await page.click('text=🧭 Explore');
    
    // Verify status changed
    await page.waitForSelector('text=explored');
    await expect(page.locator('text=explored')).toBeVisible();
  });

  test('Chart Room - Should update initiative status via dropdown', async ({ page }) => {
    // Navigate to Chart Room
    await page.click('text=Chart Room');
    await page.waitForURL('**/chart');
    
    // Create a new initiative first
    await page.click('text=Plot New Course');
    await page.fill('input[placeholder*="name"]', 'Test Initiative for Status');
    await page.fill('textarea[placeholder*="description"]', 'Testing status dropdown');
    
    // Set impact and effort
    await page.click('button[aria-label*="impact"]:nth-of-type(3)');
    await page.click('button[aria-label*="effort"]:nth-of-type(2)');
    
    await page.click('button:has-text("Chart Course")');
    
    // Wait for initiative to be created
    await page.waitForSelector('text=Test Initiative for Status');
    
    // Change status via dropdown
    await page.selectOption('select:near(:text("Test Initiative for Status"))', 'active');
    
    // Verify status changed
    await page.waitForSelector('option[value="active"][selected]');
    await expect(page.locator('text=🚧 Active')).toBeVisible();
  });
});