import { useState, useEffect, useCallback } from 'react';

import { constants } from './contact-edit.constants';
import { countryDialingCodes } from '../shared/phone-number/country-dialing-codes';

/**
 * Contact model matching the Angular Contact interface
 * from shared/models/contact.model.ts
 */
export interface Contact {
  id: number;
  name?: string;
  email?: string;
  number?: string;
  country?: string;
  favorite?: boolean;
}

/**
 * Service interface matching the Angular ContactService API.
 * Consumers must provide an implementation via props.
 */
export interface ContactServiceLike {
  getContact(id: number): Promise<Contact>;
  save(contact: Contact): Promise<Contact>;
}

/**
 * Callback invoked when a validation modal should be shown.
 * `type` indicates which modal: 'email' or 'phone'.
 */
export type OnShowModal = (type: 'email' | 'phone') => void;

/**
 * Callback invoked to display a snack-bar / toast notification.
 */
export type OnShowSnackBar = (message: string, duration: number) => void;

export interface ContactEditComponentProps {
  /** Route param: the contact id to load */
  contactId: number;
  /** Service used to load and save contacts */
  contactService: ContactServiceLike;
  /** Called after a successful update to navigate away (replaces Angular Router.navigate) */
  onNavigateHome: () => void;
  /** Called when an invalid-email or invalid-phone-number modal should be opened */
  onShowModal?: OnShowModal;
  /** Called to display a snack-bar notification */
  onShowSnackBar?: OnShowSnackBar;
}

// ---------------------------------------------------------------------------
// Validation helpers (1:1 port of the Angular private methods)
// ---------------------------------------------------------------------------

function isEmailValid(email: string): boolean {
  return email === '' || (email !== '' && email.includes('@') && email.includes('.'));
}

function isPhoneNumberValid(phoneNumber: string): boolean {
  return phoneNumber === '' || (phoneNumber !== '' && phoneNumber.length === 10 && /^\d+$/.test(phoneNumber));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ContactEditComponent: React.FC<ContactEditComponentProps> = ({
  contactId,
  contactService,
  onNavigateHome,
  onShowModal,
  onShowSnackBar,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contact, setContact] = useState<Contact | null>(null);

  const countryDialingCodeKeys: string[] = Object.keys(countryDialingCodes);

  // --- ngOnInit equivalent: load contact on mount / when contactId changes ---
  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    contactService.getContact(contactId).then((loadedContact) => {
      if (!cancelled) {
        setIsLoading(false);
        setContact(loadedContact);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [contactId, contactService]);

  // --- ngOnDestroy equivalent ---
  // The Angular component closed its modal ref on destroy.
  // In React the parent controls the modal lifecycle via onShowModal,
  // so cleanup is handled externally. Nothing to do here.

  // --- Event handlers ---

  const handleFieldChange = useCallback(
    (field: keyof Contact, value: string) => {
      setContact((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    [],
  );

  const saveContact = useCallback(
    (currentContact: Contact) => {
      const updated: Contact = { ...currentContact, favorite: !currentContact.favorite };
      setContact(updated);
      contactService.save(updated);
    },
    [contactService],
  );

  const updateContact = useCallback(
    (currentContact: Contact) => {
      // Validate email
      if (!isEmailValid(currentContact.email ?? '')) {
        onShowModal?.('email');
        return;
      }

      // Validate phone number
      if (!isPhoneNumberValid(currentContact.number ?? '')) {
        onShowModal?.('phone');
        return;
      }

      // Show snack bar
      onShowSnackBar?.('Contact updated', 2000);

      contactService.save(currentContact).then(() => {
        onNavigateHome();
      });
    },
    [contactService, onNavigateHome, onShowModal, onShowSnackBar],
  );

  // --- Render ---

  if (isLoading) {
    return (
      <div>
        <h6 className="messages">{constants.LOADING_CONTACT_MESSAGE}</h6>
        {/* TODO: replace with a React progress bar component */}
        <div className="app-progress" role="progressbar" aria-label="Indeterminate progress-bar example" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div>
        <h6 className="messages">{constants.NO_CONTACT_FOUND_MESSAGE}</h6>
        {/* TODO: replace with React Router <Link> */}
        <a href="/contacts">
          <button className="back-button" type="button">
            <span className="back-button-icon" title="Add new contact">forward</span>
          </button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="mat-card">
          <div className="mat-card-title-group">
            <span className="material-icons">mood</span>
            <div className="mat-card-title">
              <i
                className={contact.favorite ? 'favorite-icon starred' : 'favorite-icon'}
                style={{ color: contact.favorite ? 'gold' : undefined, cursor: 'pointer' }}
                title={contact.favorite ? 'Starred' : 'Not Starred'}
                onClick={() => saveContact(contact)}
              />
              <div className="mat-form-field">
                <input
                  placeholder="Name"
                  value={contact.name ?? ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="contact-name"
                />
              </div>
            </div>
            <div className="mat-card-subtitle left-padding">
              <div className="mat-form-field">
                <input
                  placeholder="Email"
                  value={contact.email ?? ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>
            </div>
            <div className="mat-card-subtitle left-padding">
              <div className="mat-form-field">
                <input
                  placeholder="Phone Number"
                  value={contact.number ?? ''}
                  onChange={(e) => handleFieldChange('number', e.target.value)}
                />
              </div>
            </div>
            <div className="mat-card-subtitle left-padding">
              <div className="mat-form-field">
                <select
                  value={contact.country ?? ''}
                  onChange={(e) => handleFieldChange('country', e.target.value)}
                >
                  <option value="" disabled>
                    Country code
                  </option>
                  {countryDialingCodeKeys.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="update-contact-button">
            <button type="button" onClick={() => updateContact(contact)}>
              Update Contact
            </button>
          </div>
        </div>
      </div>

      {/* TODO: replace with React Router <Link> */}
      <a href="/contacts">
        <button className="back-button" type="button">
          <span className="back-button-icon" title="Add new contact">forward</span>
        </button>
      </a>
    </div>
  );
};
