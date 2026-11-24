import { enableProdMode, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { ContactService, ContactFeedService } from './app/contacts/shared/services';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './app/in-memory-data.service';

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(BrowserModule, BrowserAnimationsModule, FormsModule, RoutingModule),
    ContactService,
    ContactFeedService,
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(InMemoryWebApiModule.forRoot(InMemoryDataService, { dataEncapsulation: true }))
]
})
  .catch(err => console.log(err));
