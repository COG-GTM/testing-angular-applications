# Contacts App Starter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/browser/` directory. Use `ng build --configuration production` for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Protractor is no longer supported by Angular CLI 21, so `ng e2e` no longer runs. The browser end-to-end checks live in the Playwright parity suite in `../parity` (`cd ../parity && npm ci && npx playwright test`).
The parity suite expects all three apps served on their ports (baseline 4000-4002, upgraded 4200-4202, see `../parity/playwright.config.ts`); to check only this app, serve it and add `--project=upgraded -g "chapter06 "`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
