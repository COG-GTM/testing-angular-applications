import { Component, OnInit, DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs'

@Component({
    selector: `contact-edit`,
    template: `<div class="contact-id">{{ contactId }}</div>`
})
class ContactEditComponent implements OnInit {
  private contactId: any;
  constructor(private activatedRoute: ActivatedRoute) { }
  ngOnInit () {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.contactId = id;
    });
  }
}

describe('Testing activated routes', () => {
  let fixture;
  const mockActivatedRoute = {
    snapshot: {
      params: {
        id: 'aMockId'
      }
    }
  };
  const paramsMock = Observable.create((observer) => {
    observer.next({
      id: 'aMockId'
    });
    observer.complete();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ContactEditComponent],
    providers: [{ provide: ActivatedRoute, useValue: { params: paramsMock } }],
});
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ContactEditComponent);
    fixture.detectChanges();
  }));

  it('Tries to route to a page', waitForAsync(() => {
    const testEl = fixture.debugElement.query(By.css('div'));
    // console.log('testEl', testEl);
    expect(testEl.nativeElement.textContent).toEqual('aMockId');
  }));

});

