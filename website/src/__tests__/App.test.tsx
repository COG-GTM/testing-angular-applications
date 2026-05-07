import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { contactService } from '../services/contact.service';

describe('App', () => {
  beforeEach(() => {
    contactService.reset();
  });

  it('should render the app bar with Contacts title', () => {
    render(<App />);
    expect(screen.getByText('Contacts')).toBeInTheDocument();
  });

  it('should show contact list on default route', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Adrian Directive')).toBeInTheDocument();
    });
  });
});
