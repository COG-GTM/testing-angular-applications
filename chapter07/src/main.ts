import { enableProdMode, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { ContactService, ContactFeedService } from './app/contacts/shared/services';
import { BrowserStorage } from './app/contacts/shared/services/browser-storage.service';
import { PreferencesService } from './app/contacts/shared/services/preferences.service';
import { PreferencesAsyncService } from './app/contacts/shared/services/preferences-async.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './app/in-memory-data.service';
import { bootstrapApplication, provideProtractorTestingSupport } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideProtractorTestingSupport(),
    importProvidersFrom(BrowserAnimationsModule),
    provideRouter(routes),
    ContactService,
    ContactFeedService,
    BrowserStorage,
    PreferencesService,
    PreferencesAsyncService,
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: true }))
  ]
});
