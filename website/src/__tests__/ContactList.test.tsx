import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactList } from '../components/ContactList';
import { contactService } from '../services/contact.service';

describe('ContactList', () => {
  beforeEach(() => {
    contactService.reset();
  });

  it('should display loading message initially', () => {
    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading contacts...')).toBeInTheDocument();
  });

  it('should display contacts after loading', async () => {
    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Adrian Directive')).toBeInTheDocument();
    });

    expect(screen.getByText('Rusty Component')).toBeInTheDocument();
    expect(screen.getByText('Jeff Pipe')).toBeInTheDocument();
    expect(screen.getByText('Craig Service')).toBeInTheDocument();
  });

  it('should display no contacts message when list is empty', async () => {
    const contacts = await contactService.getContacts();
    for (const c of contacts) {
      await contactService.delete(c);
    }

    render(
      <MemoryRouter>
        <ContactList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('You do not have any contacts yet')).toBeInTheDocument();
    });
  });
});
