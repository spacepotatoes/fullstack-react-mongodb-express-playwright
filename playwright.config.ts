// playwright.config.ts  ← komplett ersetzen!
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  // <<< Das ist der entscheidende Teil >>>
  snapshotDir: './tests/__screenshots__',
  updateSnapshots: 'all',   // beim ersten Mal automatisch neue Screenshots akzeptieren
});