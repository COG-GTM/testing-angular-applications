import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';


import { Contact } from '../';

@Injectable()
export class ContactService {
  private contactsUrl = 'app/contacts';
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  public getContacts(): any {
    return this.http.get<{ data: Contact[] }>(this.contactsUrl)
               .pipe(map(response => response.data), catchError(this.handleError));
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
        .post(this.contactsUrl, contact, {headers: this.headers})
        .pipe(map(res => res as Contact), catchError(this.handleError));
  }

  public put(contact: Contact): Observable<Contact> {
    const url = `${this.contactsUrl}/${contact.id}`;

    return this.http
             .put(url, contact, {headers: this.headers})
             .pipe(map(() => contact), catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
