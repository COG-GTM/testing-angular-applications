import { Component } from '@angular/core';

import { Contact } from './shared/';
import { ContactListComponent } from './contact-list/contact-list.component';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css'],
    imports: [ContactListComponent]
})
export class ContactsComponent {
  contacts: Contact[] = [];

  constructor() {}
}
