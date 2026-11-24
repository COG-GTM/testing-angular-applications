import { enableProdMode, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { ContactService, ContactFeedService } from './app/contacts/shared/services';
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
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: true }))
  ]
})
  .catch(err => console.log(err));
