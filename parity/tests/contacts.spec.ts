import { APPS, SEED, button, contactRows, expect, expectSeedList, field, rowFor, shot, stamp, test, tooltip } from './fixtures';

for (const app of APPS) {
  test.describe(`${app.name}`, () => {
    test('contacts list shows the seeded contacts', async ({ page, open }, info) => {
      await open(app, '/');
      await expect(page.getByRole('link', { name: 'Contacts' })).toBeVisible();
      await expectSeedList(page);
      await expect(page.getByRole('button', { name: 'Delete All Contacts' })).toBeEnabled();
      await shot(page, info.project.name, app, '01-list');
    });

    test('toolbar title navigates to /contacts', async ({ page, open }) => {
      await open(app, '/add');
      await expect(page.getByText('Add New Contact')).toBeVisible();
      await page.getByRole('link', { name: 'Contacts' }).click();
      await expect(page).toHaveURL(/\/contacts$/);
      await expectSeedList(page);
    });

    test('clicking a contact opens its detail page', async ({ page, open }, info) => {
      await open(app, '/');
      await rowFor(page, 'Adrian Directive').getByText('Adrian Directive').click();
      await expect(page).toHaveURL(/\/contact\/1$/);
      await expect(page.getByText('Adrian Directive')).toBeVisible();
      await expect(page.getByText('adrian.directive@example.com')).toBeVisible();
      await expect(page.getByText('+1 (703) 555-0123')).toBeVisible();
      await shot(page, info.project.name, app, '02-detail');
    });

    // Pre-existing bug kept: getContact() resolves undefined (not null), so "Contact not found" never shows;
    // the page renders an empty card with the back/feed buttons.
    test('unknown contact id renders no contact', async ({ page, open }) => {
      await open(app, '/contact/999');
      await expect(page.getByText('forward', { exact: true })).toBeVisible();
      for (const c of SEED) {
        await expect(page.getByText(c.name)).toHaveCount(0);
      }
    });

    test('contact feed dialog opens and closes', async ({ page, open }, info) => {
      await open(app, '/contact/2');
      await expect(page.getByText('Rusty Component')).toBeVisible();
      await page.getByText('rss_feed', { exact: true }).click();
      const dialog = page.getByRole('dialog');
      if (!app.feedDialogWorks) {
        await expect(dialog).toHaveCount(1);
        await page.waitForTimeout(1000);
        await expect(page.getByText('Latest posts from')).toHaveCount(0);
        await shot(page, info.project.name, app, '03-feed-dialog');
        return;
      }
      await expect(dialog.getByText('Latest posts from Rusty Component')).toBeVisible();
      const close = button(dialog, 'Close');
      await expect(close).toBeEnabled();
      await expect(button(dialog, 'Follow')).toBeDisabled();
      // each streamed post shows its text with the timestamp on its own line underneath
      const post = dialog.locator('h4').first();
      const time = dialog.getByText('at Wed 12:00').first();
      await expect(time).toBeVisible({ timeout: 15000 });
      await expect(post).toBeVisible();
      const [postBox, timeBox] = [await post.boundingBox(), await time.boundingBox()];
      expect(timeBox!.height).toBeGreaterThan(0);
      expect(timeBox!.y).toBeGreaterThan(postBox!.y + postBox!.height / 2);
      // feed posts are random; mask the dialog body in the screenshot
      await shot(page, info.project.name, app, '03-feed-dialog', [dialog.locator('mat-dialog-content, md-dialog-content, [mat-dialog-content], .mat-dialog-content, .mat-mdc-dialog-content')]);
      await close.click();
      await expect(dialog).toHaveCount(0);
    });

    test('add contact creates a new row', async ({ page, open }, info) => {
      const id = stamp();
      const name = `Parity User ${id}`;
      await open(app, '/add');
      await expect(page.getByText('Add New Contact')).toBeVisible();
      await expect(field(page, 'Email')).toHaveCount(0);
      await shot(page, info.project.name, app, '04-add-empty');
      await field(page, 'Name').fill(name);
      await field(page, 'Email').fill(`parity+${id}@example.com`);
      await field(page, 'Phone Number (10 digits)').fill('2125550199');
      await shot(page, info.project.name, app, '05-add-filled');
      await page.getByRole('button', { name: 'Create' }).click();
      if (!app.addSaves) {
        await page.waitForTimeout(1500);
        await expect(page.getByText('Saving Contact...')).toBeVisible();
        await expect(page).toHaveURL(/\/add$/);
        return;
      }
      await expect(page).toHaveURL(/localhost:\d+\/$/);
      await expect(contactRows(page)).toHaveCount(SEED.length + 1);
      const row = rowFor(page, name);
      await expect(row).toContainText(`parity+${id}@example.com`);
      await expect(row).toContainText('+1 (212) 555-0199');
    });

    test('add contact rejects an invalid email', async ({ page, open }, info) => {
      await open(app, '/add');
      await field(page, 'Name').fill(`Bad Email ${stamp()}`);
      await field(page, 'Email').fill('not-an-email');
      await page.getByRole('button', { name: 'Create' }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog.getByText('Invalid Email Address')).toBeVisible();
      await expect(dialog.getByText('Please enter a valid email address.')).toBeVisible();
      await shot(page, info.project.name, app, '06-add-invalid-email');
      await button(dialog, 'Ok').click();
      await expect(dialog).toHaveCount(0);
      await expect(page).toHaveURL(/\/add$/);
    });

    test('add contact rejects an invalid phone number', async ({ page, open }, info) => {
      await open(app, '/add');
      await field(page, 'Name').fill(`Bad Phone ${stamp()}`);
      await field(page, 'Phone Number (10 digits)').fill('12345');
      await page.getByRole('button', { name: 'Create' }).click();
      const dialog = page.getByRole('dialog');
      await expect(dialog.getByText('Invalid Phone Number')).toBeVisible();
      await expect(dialog.getByText('Please enter a phone number with 10 digits (For example, 2125551234).')).toBeVisible();
      await shot(page, info.project.name, app, '07-add-invalid-phone');
      await button(dialog, 'Ok').click();
      await expect(dialog).toHaveCount(0);
      await expect(page).toHaveURL(/\/add$/);
    });

    test('edit icon opens the edit page', async ({ page, open }, info) => {
      await open(app, '/');
      await rowFor(page, 'Adrian Directive').getByText('edit', { exact: true }).click();
      await expect(page).toHaveURL(/\/edit\/1$/);
      if (app.editLoads) {
        await expect(field(page, 'Name')).toHaveValue('Adrian Directive');
        await expect(field(page, 'Email')).toHaveValue('adrian.directive@example.com');
        await expect(field(page, 'Phone Number')).toHaveValue('7035550123');
        await expect(page.getByRole('button', { name: 'Update Contact' })).toBeEnabled();
      } else {
        await page.waitForTimeout(1500);
        await expect(page.getByText('Loading contact...')).toBeVisible();
      }
      await shot(page, info.project.name, app, '08-edit', app.editLoads ? [] : [page.locator('mat-progress-bar, md-progress-bar')]);
    });

    if (app.editLoads) {
      test('edit contact saves and returns to the list', async ({ page, open }) => {
        const name = `Edited ${stamp()}`;
        await open(app, '/edit/3');
        await expect(field(page, 'Name')).toHaveValue('Jeff Pipe');
        await field(page, 'Name').fill(name);
        await page.getByRole('button', { name: 'Update Contact' }).click();
        await expect(page.getByText('Contact updated')).toBeVisible();
        await expect(page).toHaveURL(/localhost:\d+\/$/);
        await expect(rowFor(page, name)).toContainText('jeff.pipe@example.com');
        await expect(rowFor(page, 'Jeff Pipe')).toHaveCount(0);
      });

      test('edit contact rejects invalid email and phone', async ({ page, open }, info) => {
        await open(app, '/edit/2');
        await expect(field(page, 'Name')).toHaveValue('Rusty Component');
        await field(page, 'Email').fill('broken');
        await page.getByRole('button', { name: 'Update Contact' }).click();
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByText('Invalid Email Address')).toBeVisible();
        await shot(page, info.project.name, app, '09-edit-invalid-email');
        await button(dialog, 'Ok').click();
        await expect(dialog).toHaveCount(0);
        await field(page, 'Email').fill('rusty@example.com');
        await field(page, 'Phone Number').fill('99');
        await page.getByRole('button', { name: 'Update Contact' }).click();
        await expect(dialog.getByText('Invalid Phone Number')).toBeVisible();
        await button(dialog, 'Ok').click();
        await expect(dialog).toHaveCount(0);
        await expect(page).toHaveURL(/\/edit\/2$/);
      });
    }

    test('delete icon removes a contact', async ({ page, open }) => {
      await open(app, '/');
      await expectSeedList(page);
      await rowFor(page, 'Jeff Pipe').getByText('delete', { exact: true }).click();
      await expect(page.getByText('Jeff Pipe deleted.')).toBeVisible();
      await expect(contactRows(page)).toHaveCount(SEED.length - 1);
      await expect(rowFor(page, 'Jeff Pipe')).toHaveCount(0);
    });

    test('delete all contacts', async ({ page, open }, info) => {
      await open(app, '/');
      await expectSeedList(page);
      await page.getByRole('button', { name: 'Delete All Contacts' }).click();
      if (app.deleteAllWorks) {
        await expect(page.getByText('You do not have any contacts yet')).toBeVisible();
        await shot(page, info.project.name, app, '10-empty');
        await page.getByRole('button', { name: 'Add Contacts' }).click();
      } else {
        await page.waitForTimeout(1500);
      }
      await expectSeedList(page);
    });

    test('favorite star toggles', async ({ page, open }) => {
      await open(app, '/');
      const star = rowFor(page, 'Craig Service').locator('td').last().locator('i');
      await star.hover();
      await expect(tooltip(page, 'Not Starred')).toBeAttached();
      await star.click();
      await page.mouse.move(0, 0);
      await expect(tooltip(page, 'Not Starred')).toHaveCount(0);
      // let the tooltip hide animation finish, otherwise newer Material ignores the next hover
      await page.waitForTimeout(800);
      await star.hover();
      await expect(tooltip(page, 'Starred')).toBeAttached();
    });

    if (app.sortableHeaders) {
      test('clicking column headers sorts the list', async ({ page, open }) => {
        await open(app, '/');
        await expectSeedList(page);
        const names = () => contactRows(page).locator('td:nth-child(2)').allInnerTexts();
        await page.locator('th').filter({ hasText: /^\s*Name\s*$/ }).click();
        await expect.poll(names).toEqual(['Adrian Directive', 'Craig Service', 'Jeff Pipe', 'Rusty Component']);
        await page.locator('th').filter({ hasText: /^\s*Number\s*$/ }).click();
        await expect.poll(names).toEqual(['Rusty Component', 'Craig Service', 'Adrian Directive', 'Jeff Pipe']);
      });
    }

    test('unknown route shows the 404 page', async ({ page, open }, info) => {
      await open(app, '/does-not-exist');
      await expect(page.getByText('404 - Sorry page not found.')).toBeVisible();
      await shot(page, info.project.name, app, '11-not-found');
    });
  });
}
