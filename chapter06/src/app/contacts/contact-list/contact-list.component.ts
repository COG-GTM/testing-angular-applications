import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import {
  Contact,
  ContactService
} from '../shared';
import { constants } from './contact-list.constants';
import { CONTACTS } from '..//shared/data/mock-contacts';
import { ShowContactsDirective } from '../shared/show-contacts/show-contacts.directive';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FavoriteIconDirective } from '../shared/favorite-icon/favorite-icon.directive';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { PhoneNumberPipe } from '../shared/phone-number/phone-number.pipe';

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.css'],
    providers: [MatSnackBar],
    imports: [ShowContactsDirective, MatIcon, MatTooltip, FavoriteIconDirective, MatButton, MatFabButton, RouterLink, MatProgressBar, PhoneNumberPipe]
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public noContactsFoundMessage: string = constants.NO_CONTACTS_FOUND_MESSAGE;
  public loadingContactsMessage: string = constants.LOADING_CONTACTS_MESSAGE;
  public deletingContactsMessage: string = constants.DELETING_CONTACTS_MESSAGE;
  public deletingContactMessage: string = constants.DELETING_CONTACT_MESSAGE;
  public isLoading = true;
  public deletingContacts = false;
  public deletingContact = false;
  public readonly backupContacts: Array<Contact> = CONTACTS.slice();
  public selectedContact: Contact;

  @Input('contacts') contacts: Contact[];

  ngOnInit() {
    this.getContacts();
  }

  public onClick(contact: Contact): void {
    this.router.navigate(['/contact', contact.id]);
  }

  public editContact(contact: Contact): void {
      this.router.navigate(['/edit', contact.id]);
  }

  public displayDeleteSnackBar(contact: Contact): void {
    const message = `${contact.name} deleted.`;
    const snackConfig: MatSnackBarConfig = {duration: 2000};
    const actionLabel = '';

    this.snackBar.open(message, actionLabel, snackConfig);
  }

  public deleteContact(contact: Contact): void {
    this.deletingContact = true;
    this.displayDeleteSnackBar(contact);

    this.contactService
      .delete(contact)
      .toPromise()
      .then(() => {
        this.contacts = this.contacts.filter(c => c !== contact);

          if (this.selectedContact === contact) {
            this.selectedContact = null;
          }

          this.deletingContact = false;
    });
  }

  public deleteContacts(): void {
    this.deletingContacts = true;

    this.contacts.forEach((contact, index) => {
      this.contactService.delete(contact);

      if (index === this.contacts.length - 1) {
        this.getContacts();
      }
    });
  }

  public getContacts(): void {
    this.isLoading = true;

    this.contactService.getContacts()
      .toPromise()
      .then(contacts => {
        this.isLoading = false;
        this.deletingContacts = false;
        this.contacts = contacts;
      });
  }

  public refreshContacts() {
    this.backupContacts.forEach((contact, index) => {
      this.contactService.post(contact);

      if (index === this.backupContacts.length - 1) {
        this.getContacts();
      }
    });
  }

  public saveContact(contact: Contact) {
    contact.favorite = !contact.favorite;
    this.contactService.save(contact);
  }

  public onSelect(contact: Contact): void {
    this.selectedContact = contact;
  }

  public sortContacts(property, order) {
    this.contacts = this.contacts.sort((a, b) => {
      console.log('sorting', property, order);
      return (a[property] > b[property]) ? 1 : -1;
    });
  }
}
