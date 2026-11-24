import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactService } from './contact.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ContactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
  });

  describe('getContacts', () => {

    let contactService: ContactService;
    let httpTestingController: HttpTestingController;
    let mockContact: any;

    beforeEach(() => {
      contactService = TestBed.inject(ContactService);
      httpTestingController = TestBed.inject(HttpTestingController);
      mockContact = { id: 100, name: 'Erin Dee', email: 'edee@example.com' };
    });

    it('should GET a list of contacts', () => {

      contactService.getContacts().subscribe((contacts) => {
        expect(contacts[0]).toEqual(mockContact);
      });

      const request = httpTestingController.expectOne('app/contacts');

      request.flush([mockContact]);

      httpTestingController.verify();
    });
  });
});
