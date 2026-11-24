import { test as base, expect, Locator, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export type ParityOptions = { basePort: number };

export interface AppDef {
  name: 'website' | 'chapter06' | 'chapter07';
  portOffset: number;
  // chapter06/07 ContactEditComponent calls .map() on the contact observable without subscribing,
  // so /edit/:id stays on "Loading contact..." forever. Kept as-is (pre-existing bug).
  editLoads: boolean;
  // chapter06/07 contact list has clickable column headers that sort the table.
  sortableHeaders: boolean;
  // chapter06/07 deleteContacts() calls contactService.delete() (a cold Observable) without subscribing,
  // so "Delete All Contacts" deletes nothing and the list reloads unchanged. Kept as-is (pre-existing bug).
  deleteAllWorks: boolean;
  // chapter06 saves a new contact with PUT app/contacts/<id>; in-memory-web-api answers 404 for an unknown id
  // over HttpClient, so the page stays on "Saving Contact...". Kept as-is (pre-existing bug).
  addSaves: boolean;
  // chapter06 opens ContactFeedDialogComponent without `data`, so its constructor throws on data.name and
  // an empty dialog shell is shown. Kept as-is (pre-existing bug).
  feedDialogWorks: boolean;
}

export const APPS: AppDef[] = [
  { name: 'website', portOffset: 0, editLoads: true, sortableHeaders: false, deleteAllWorks: true, addSaves: true, feedDialogWorks: true },
  { name: 'chapter06', portOffset: 1, editLoads: false, sortableHeaders: true, deleteAllWorks: false, addSaves: false, feedDialogWorks: false },
  { name: 'chapter07', portOffset: 2, editLoads: false, sortableHeaders: true, deleteAllWorks: false, addSaves: true, feedDialogWorks: true },
];

export const SEED = [
  { name: 'Adrian Directive', email: 'adrian.directive@example.com', phone: '+1 (703) 555-0123' },
  { name: 'Rusty Component', email: 'rusty.component@example.com', phone: '+1 (441) 555-0122' },
  { name: 'Jeff Pipe', email: 'jeff.pipe@example.com', phone: '+1 (714) 555-0111' },
  { name: 'Craig Service', email: 'craig.services@example.com', phone: '+1 (514) 555-0132' },
];

export const test = base.extend<ParityOptions & { app: AppDef; open: (app: AppDef, route: string) => Promise<void> }>({
  basePort: [4000, { option: true }],
  app: [APPS[0], { option: true }],
  open: async ({ page, basePort }, use) => {
    await use(async (app, route) => {
      await page.goto(`http://localhost:${basePort + app.portOffset}${route}`);
    });
  },
});

export { expect };

export const stamp = () => `${Date.now()}${Math.floor(Math.random() * 1000)}`;

/** A button identified by its visible text (dialog-close buttons carry an aria-label that differs between Material versions). */
export function button(scope: Page | Locator, text: string): Locator {
  return scope.getByRole('button').filter({ hasText: new RegExp(`^\\s*${text}\\s*$`) });
}

/** Tooltip text rendered in the CDK overlay (ignores the visually hidden aria-describedby copy). */
export function tooltip(page: Page, text: string): Locator {
  return page.locator('.cdk-overlay-container').getByText(text, { exact: true });
}

export function contactRows(page: Page): Locator {
  return page.locator('table tbody tr');
}

export function rowFor(page: Page, name: string): Locator {
  return contactRows(page).filter({ hasText: name });
}

export async function expectSeedList(page: Page) {
  await expect(contactRows(page)).toHaveCount(SEED.length);
  for (const c of SEED) {
    const row = rowFor(page, c.name);
    await expect(row).toContainText(c.email);
    await expect(row).toContainText(c.phone);
  }
}

/** Full-page screenshot saved under report/shots/<project>/<app>__<name>.png for the side-by-side report. */
export async function shot(page: Page, project: string, app: AppDef, name: string, mask: Locator[] = []) {
  await page.mouse.move(0, 0);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const dir = path.join(__dirname, '..', 'report', 'shots', project);
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({
    path: path.join(dir, `${app.name}__${name}.png`),
    fullPage: true,
    animations: 'disabled',
    caret: 'hide',
    mask,
  });
}

// Material <=9 renders the matInput placeholder as `placeholder`; Material 10+ moves it to
// `data-placeholder` (visible floating label is identical). Prefix match mirrors getByPlaceholder.
export function field(page: Page, placeholder: string): Locator {
  return page.locator(`input[placeholder^="${placeholder}"], input[data-placeholder^="${placeholder}"]`);
}
