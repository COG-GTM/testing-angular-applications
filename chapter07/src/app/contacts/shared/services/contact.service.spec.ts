import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ContactService } from './contact.service';

describe('ContactsService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });
    service = TestBed.get(ContactService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getContacts', () => {
    it('should GET a list of contacts', () => {
      const mockContact = { id: 100, name: 'Erin Dee', email: 'edee@example.com' };

      service.getContacts()
        .subscribe((contacts) => {
          expect(contacts[0]).toEqual(mockContact);
        });

      const req = httpMock.expectOne('app/contacts');
      expect(req.request.method).toEqual('GET');
      req.flush({ data: [ mockContact ] });
    });
  });
});
