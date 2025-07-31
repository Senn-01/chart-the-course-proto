import { test, expect } from '@playwright/test';

test.describe('Idea Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start at the homepage
    await page.goto('http://localhost:3000');
  });

  test('should create a new idea successfully', async ({ page }) => {
    // Since we have DEV_BYPASS_AUTH, we should be automatically logged in
    // Navigate to territories (ideas) page
    await page.goto('http://localhost:3000/territories');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we're on the territories page
    await expect(page).toHaveURL(/.*territories/);
    
    // Look for the idea form
    const ideaInput = page.locator('input[placeholder*="idea"]');
    await expect(ideaInput).toBeVisible();
    
    // Create a new idea
    const testIdea = `Test idea ${Date.now()}`;
    await ideaInput.fill(testIdea);
    
    // Submit the form (press Enter or click submit button)
    await ideaInput.press('Enter');
    
    // Wait for the idea to appear in the list
    await page.waitForSelector(`text="${testIdea}"`, { timeout: 10000 });
    
    // Verify the idea was created
    const ideaElement = page.locator(`text="${testIdea}"`);
    await expect(ideaElement).toBeVisible();
  });

  test('should navigate through all main modules', async ({ page }) => {
    // Test navigation to each module
    const modules = [
      { name: 'Territories', url: '/territories' },
      { name: 'Compass', url: '/compass' },
      { name: 'Chart', url: '/chart' },
      { name: 'Expedition', url: '/expedition' },
      { name: 'Log', url: '/log' },
      { name: 'Wake', url: '/wake' }
    ];

    for (const module of modules) {
      await page.goto(`http://localhost:3000${module.url}`);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(new RegExp(module.url));
      
      // Take a screenshot for debugging
      await page.screenshot({ 
        path: `tests/screenshots/${module.name.toLowerCase()}.png`,
        fullPage: true 
      });
    }
  });
});