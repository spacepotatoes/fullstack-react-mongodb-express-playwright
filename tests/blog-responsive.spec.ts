// tests/blog-responsive.spec.ts  ← komplett ersetzen!
import { test, expect } from '@playwright/test';

// Nur eine Seite zum Start – später kannst du wieder mehrere machen
const urls = ['/'];

test.describe('Responsive Design – Visual Regression', () => {
  const viewports = [
  { name: 'mobile',   width: 375,  height: 667 },
  { name: 'tablet',   width: 768,  height: 1024 },
  { name: 'desktop',  width: 1280, height: 720 },
  { name: 'wide',     width: 1920, height: 1080 },
  // ← neu: echte große Monitore
  { name: 'ultrawide', width: 3440, height: 1440 }, // 34" Ultrawide
  { name: '5k',        width: 5120, height: 2880 }, // 5K iMac / Studio Display
];

  for (const url of urls) {
    for (const vp of viewports) {
      test(`[${url || 'home'}] ${vp.name} ${vp.width}×${vp.height} – OK`, async ({ page }) => {
        // page ist hier die Playwright-Fixture → kein Namenskonflikt mehr
        await page.goto(url);
        await page.setViewportSize({ width: vp.width, height: vp.height });

        // Warte bis alles geladen ist
        await page.waitForLoadState('networkidle');

        await expect(page).toHaveScreenshot(
          `${url.replace(/\//g, '') || 'home'}-${vp.name}.png`,
          {
            animations: 'disabled',
            caret: 'hide',
            maxDiffPixels: 150,   // kleine Rendering-Unterschiede ignorieren
            threshold: 0.2,
          }
        );
      });
    }
  }
});