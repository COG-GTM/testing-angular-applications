import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


import { Contact } from '../';

@Injectable()
export class ContactService {
  private contactsUrl = 'app/contacts';
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  public getContacts(): any {
    return this.http.get(this.contactsUrl)
               .pipe(map(response => response.json().data as Contact), catchError(this.handleError));
  }

  public getContact(id: number): Observable<Contact> {
    return this.getContacts()
               .pipe(map((contacts: Contact[]) => contacts.find(contact => contact.id === id)));
  }

  public save(contact: Contact): Observable<Contact> {
    if (contact.id) {
      return this.put(contact);
    }

    return this.post(contact);
  }

  public new(contact: Contact): Observable<Contact> {
    return this.post(contact);
  }

  public delete(contact: Contact): Observable<Contact> {
    const url = `${this.contactsUrl}/${contact.id}`;

    return this.http
             .delete(url, {headers: this.headers})
             .pipe(switchMap(() => EMPTY), catchError(this.handleError));
  }

  public post(contact: Contact): Observable<Contact> {
    return this.http
        .post(this.contactsUrl, JSON.stringify(contact), {headers: this.headers})
        .pipe(map(res => res.json()), catchError(this.handleError));
  }

  public put(contact: Contact): Observable<Contact> {
    const url = `${this.contactsUrl}/${contact.id}`;

    return this.http
             .put(url, JSON.stringify(contact), {headers: this.headers})
             .pipe(map(() => contact), catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
