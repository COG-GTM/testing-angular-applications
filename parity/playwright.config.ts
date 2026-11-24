import { defineConfig } from '@playwright/test';
import type { ParityOptions } from './tests/fixtures';

// Each Angular app in the repo is served on its own port:
//   baseline (default branch, legacy Angular): website 4000, chapter06 4001, chapter07 4002
//   upgraded (this branch, Angular 21):        website 4200, chapter06 4201, chapter07 4202
export default defineConfig<ParityOptions>({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'report/results.json' }]],
  use: {
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'baseline', use: { basePort: 4000 } },
    { name: 'upgraded', use: { basePort: 4200 } },
  ],
});
