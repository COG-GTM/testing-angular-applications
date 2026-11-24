import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { constants } from '../modal.constants';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-invalid-phone-number-modal',
    templateUrl: './invalid-phone-number-modal.component.html',
    styleUrls: ['./invalid-phone-number-modal.component.css'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class InvalidPhoneNumberModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<InvalidPhoneNumberModalComponent>>(MatDialogRef);

  invalidPhoneNumberMessage = constants.INVALID_PHONE_NUMBER_MESSAGE;

  ngOnInit() {
  }
}
