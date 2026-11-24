import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';

import {
  Contact,
  ContactService,
} from '../shared';
import { constants } from './contact-edit.constants';
import { InvalidEmailModalComponent } from '../shared';
import { InvalidPhoneNumberModalComponent } from '../shared';
import { countryDialingCodes } from '../shared';

import { map } from 'rxjs/operators';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCard, MatCardTitleGroup, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FavoriteIconDirective } from '../shared/favorite-icon/favorite-icon.directive';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatButton, MatFabButton } from '@angular/material/button';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-edit.component.html',
    styleUrls: ['./contact-edit.component.css'],
    providers: [MatSnackBar],
    imports: [MatProgressBar, MatCard, MatCardTitleGroup, MatIcon, MatCardTitle, FavoriteIconDirective, MatTooltip, MatFormField, MatInput, FormsModule, MatCardSubtitle, MatSelect, MatOption, MatButton, RouterLink, MatFabButton]
})
export class ContactEditComponent implements OnInit {
  public loadingContactMessage: string = constants.LOADING_CONTACT_MESSAGE;
  public noContactFoundMessage: string = constants.NO_CONTACT_FOUND_MESSAGE;
  public isLoading = true;
  public contact: Contact = null;
  public countryDialingCodes: string[] = this.getKeys(countryDialingCodes);

  constructor(private contactService: ContactService, private route: ActivatedRoute, private router: Router,
              private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.loadContact();
  }

  public getKeys(object: Object): string[] {
    return Object.keys(object).map((key, value) => key);
  }

  public saveContact(contact: Contact) {
    contact.favorite = !contact.favorite;
    this.contactService.save(contact);
  }

  public loadContact(): void {
    console.log('snapshot', this.route.snapshot);
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.contactService.getContact(id).pipe(
        map(contact => {
          this.isLoading = false;
          this.contact = contact;
        }));
    });
  }

  public displayEditSnackBar(): void {
    const message = 'Contact updated';
    const snackConfig: MatSnackBarConfig = <MatSnackBarConfig>{duration: 2000};
    const actionLabel = '';

    this.snackBar.open(message, actionLabel, snackConfig);
  }

  public updateContact(contact: Contact): void {
    if (!this.isContactValid(contact)) {
      return;
    }

    this.displayEditSnackBar();
    this.contactService.save(contact)
      .toPromise()
      .then(() => {
        this.router.navigate(['/']);
      });
  }

  public isEmailValid(email: string): boolean {
    return email === '' || (email !== '' && email.includes('@') && email.includes('.'));
  }

  public isPhoneNumberValid(phoneNumber: string): boolean {
    return phoneNumber === '' || (phoneNumber !== '' && phoneNumber.length === 10 && /^\d+$/.test(phoneNumber));
  }

  public isContactValid(contact: Contact): boolean {
    if (!this.isEmailValid(contact.email)) {
      this.dialog.open(InvalidEmailModalComponent);
      return false;
    }

    if (!this.isPhoneNumberValid(contact.number)) {
      this.dialog.open(InvalidPhoneNumberModalComponent);
      return false;
    }

    return true;
  }
}
