import { Component, OnInit, OnDestroy, NgZone, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import {ContactFeedService} from '../shared/services/contact-feed.service';
import {Subscription} from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatList, MatListItem } from '@angular/material/list';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-contact-feed',
    templateUrl: './contact-feed.component.html',
    styleUrls: ['./contact-feed.component.css'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatList, MatListItem, MatProgressBar, MatDialogActions, MatButton, MatDialogClose]
})
export class ContactFeedDialogComponent implements OnInit, OnDestroy {
  dialogRef = inject<MatDialogRef<ContactFeedDialogComponent>>(MatDialogRef);
  private feed = inject(ContactFeedService);
  private zone = inject(NgZone);

  sub: Subscription;
  updates: string[] = [];
  name: string;
  closeDisabled = true;

  constructor() {
    const data = inject(MAT_DIALOG_DATA, { optional: true });

    this.name = data.name;
  }

  ngOnInit() {
    /*
     This version runs inside the Angular zone, and will block Protractor testing indefinitely.
     this.sub = this.feed.getFeed().subscribe((x) => {
       this.updates.push(x);
       if (this.updates.length > 5) {
         this.updates.shift();
       }
     });
     */
    this.closeDisabled = false;

    this.zone.runOutsideAngular(() => {
      this.sub = this.feed.getFeed().subscribe((x) => {
        this.zone.run(() => {
          this.updates.push(x);
          if (this.updates.length > 4) {
            this.updates.shift();
          }
        });
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
