import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { constants } from '../modal.constants';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-invalid-email-modal',
    templateUrl: './invalid-email-modal.component.html',
    styleUrls: ['./invalid-email-modal.component.css'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton, MatDialogClose]
})
export class InvalidEmailModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<InvalidEmailModalComponent>>(MatDialogRef);

  invalidEmailMessage = constants.INVALID_EMAIL_ADDRESS_MESSAGE;

  ngOnInit() {
  }

}
