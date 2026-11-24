import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContactFeedDialogComponent } from '../contact-feed';

import {
  Contact,
  ContactService,
} from '../shared';
import { constants } from './contact-detail.constants';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCard, MatCardTitleGroup, MatCardTitle, MatCardSubtitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { PhoneNumberPipe } from '../shared/phone-number/phone-number.pipe';

@Component({
    selector: 'app-contact-detail',
    templateUrl: './contact-detail.component.html',
    styleUrls: ['./contact-detail.component.css'],
    imports: [MatProgressBar, MatCard, MatCardTitleGroup, MatIcon, MatCardTitle, MatCardSubtitle, RouterLink, MatFabButton, MatTooltip, PhoneNumberPipe]
})
export class ContactDetailComponent implements OnInit {
  private contactService = inject(ContactService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  public loadingContactMessage: string = constants.LOADING_CONTACT_MESSAGE;
  public noContactFoundMessage: string = constants.NO_CONTACT_FOUND_MESSAGE;
  public isLoading = true;
  public contact: Contact = null;

  ngOnInit() {
    this.loadContact();
  }

  private loadContact(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.contactService.getContact(id)
        .subscribe(contact => {
          this.isLoading = false;
          this.contact = contact;
      });
    });
  }

  openDialog(): void {
    // For instructional purposes, insert a slight delay before opening the dialog
    setTimeout(() => {
      const dialogRef = this.dialog.open(ContactFeedDialogComponent, {disableClose: true, data: {name: this.contact.name}});
      dialogRef.afterClosed().subscribe(result => {
        // TODO do something here if Follow is clicked
      });
    }, 500);
  }
}
