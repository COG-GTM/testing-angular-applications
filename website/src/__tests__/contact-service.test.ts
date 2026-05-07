import { describe, it, expect, beforeEach } from 'vitest';
import { contactService } from '../services/contact.service';

describe('contactService', () => {
  beforeEach(() => {
    contactService.reset();
  });

  it('should return all contacts', async () => {
    const contacts = await contactService.getContacts();
    expect(contacts).toHaveLength(4);
    expect(contacts[0].name).toBe('Adrian Directive');
  });

  it('should get a contact by id', async () => {
    const contact = await contactService.getContact(1);
    expect(contact).toBeDefined();
    expect(contact!.name).toBe('Adrian Directive');
  });

  it('should return undefined for non-existent id', async () => {
    const contact = await contactService.getContact(999);
    expect(contact).toBeUndefined();
  });

  it('should save (update) a contact', async () => {
    await contactService.save({ id: 1, name: 'Updated Name' });
    const contact = await contactService.getContact(1);
    expect(contact!.name).toBe('Updated Name');
  });

  it('should save (create) a new contact', async () => {
    await contactService.save({ id: 5, name: 'New Contact' });
    const contacts = await contactService.getContacts();
    expect(contacts).toHaveLength(5);
  });

  it('should delete a contact', async () => {
    await contactService.delete({ id: 1, name: 'Adrian Directive' });
    const contacts = await contactService.getContacts();
    expect(contacts).toHaveLength(3);
    expect(contacts.find((c) => c.id === 1)).toBeUndefined();
  });
});
