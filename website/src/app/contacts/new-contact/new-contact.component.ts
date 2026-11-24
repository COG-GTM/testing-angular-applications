import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';

import { ContactService } from '../shared/services/contact.service';
import { Contact } from '../shared/models/contact.model';
import { InvalidEmailModalComponent } from '../shared';
import { InvalidPhoneNumberModalComponent } from '../shared';
import { MatCard } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
    selector: 'app-new-contact',
    templateUrl: './new-contact.component.html',
    styleUrls: ['./new-contact.component.css'],
    imports: [MatCard, MatFormField, MatInput, FormsModule, MatButton, RouterLink, MatFabButton, MatIcon, MatProgressBar]
})
export class NewContactComponent implements OnInit {
  public contact: Contact;
  public id: number;
  public savingContact = false;

  constructor(private contactService: ContactService, private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.contactService.getContacts()
        .then(contacts => { this.createNewContact(contacts.length); });
  }

  createNewContact(numContacts: number) {
    const contactId = numContacts + 1;

    this.contact = {
      id: contactId,
      email: '',
      number: '',
      country: 'us',
      favorite: false
    };
  }

  public addNewContact(contact: Contact): void {
    if (!this.isFormValid()) {
      return;
    }

    this.savingContact = true;

    this.contactService.save(contact)
        .then(() => {
          this.savingContact = false;
          this.router.navigate(['/']);
    });
  }

  private isEmailValid(): boolean {
    return this.contact.email === '' ||
        (this.contact.email !== '' && this.contact.email.includes('@') && this.contact.email.includes('.'));
  }

  private isPhoneNumberValid(): boolean {
    return this.contact.number === '' ||
        this.contact.number !== '' && this.contact.number.length === 10 && /^\d+$/.test(this.contact.number);
  }

  private isFormValid(): boolean {
    if (!this.isEmailValid()) {
      this.dialog.open(InvalidEmailModalComponent);
      return false;
    }

    if (!this.isPhoneNumberValid()) {
      this.dialog.open(InvalidPhoneNumberModalComponent);
      return false;
    }

    return true;
  }
}
