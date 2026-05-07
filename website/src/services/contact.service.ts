import { Contact } from '../models/contact';
import { CONTACTS } from './mock-contacts';

let contacts: Contact[] = [...CONTACTS];

function delay<T>(value: T, ms: number = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const contactService = {
  getContacts(): Promise<Contact[]> {
    return delay([...contacts]);
  },

  getContact(id: number): Promise<Contact | undefined> {
    return delay(contacts.find((c) => c.id === id));
  },

  save(contact: Contact): Promise<Contact> {
    const index = contacts.findIndex((c) => c.id === contact.id);
    if (index >= 0) {
      contacts[index] = { ...contact };
    } else {
      contacts.push({ ...contact });
    }
    return delay(contact);
  },

  delete(contact: Contact): Promise<void> {
    contacts = contacts.filter((c) => c.id !== contact.id);
    return delay(undefined);
  },

  reset(): void {
    contacts = [...CONTACTS];
  },
};
