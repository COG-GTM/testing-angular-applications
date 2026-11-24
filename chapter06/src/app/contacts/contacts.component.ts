import { Component } from '@angular/core';

import { Contact } from './shared/';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css'],
    standalone: false
})
export class ContactsComponent {
  contacts: Contact[] = [];

  constructor() {}
}
