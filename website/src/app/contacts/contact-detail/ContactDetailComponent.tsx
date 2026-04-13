import React, { useState, useEffect } from 'react';

/**
 * React port of Angular ContactDetailComponent
 *
 * Original Angular component: contact-detail.component.ts
 * - @Input: none (route param `id` used)
 * - @Output: none
 * - Services: ContactService, ActivatedRoute, MatDialog
 * - Lifecycle: ngOnInit → useEffect
 */

interface Contact {
  id: number;
  name?: string;
  email?: string;
  number?: string;
  country?: string;
  favorite?: boolean;
}

const LOADING_CONTACT_MESSAGE = 'Loading contact...';
const NO_CONTACT_FOUND_MESSAGE = 'Contact not found';

/** TODO: Replace with a proper phone formatting library or utility */
function formatPhoneNumber(phone?: string, _format?: string, _country?: string): string {
  return phone ?? '';
}

interface ContactDetailComponentProps {
  /** The contact ID to fetch, typically from route params */
  contactId: number;
  /** Function to fetch contact data */
  getContact: (id: number) => Promise<Contact>;
  /** Callback to navigate back to contacts list */
  onNavigateBack: () => void;
  /** Callback to open the contact feed dialog */
  onOpenFeedDialog?: (contactName: string) => void;
}

export const ContactDetailComponent: React.FC<ContactDetailComponentProps> = ({
  contactId,
  getContact,
  onNavigateBack,
  onOpenFeedDialog,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);

  // Replaces ngOnInit + loadContact()
  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setContact(null);

    getContact(contactId)
      .then((data) => {
        if (!cancelled) {
          setIsLoading(false);
          setContact(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
          setContact(null);
        }
      });

    // Cleanup on unmount (replaces ngOnDestroy)
    return () => {
      cancelled = true;
    };
  }, [contactId, getContact]);

  // Replaces openDialog()
  const handleOpenDialog = () => {
    if (contact?.name && onOpenFeedDialog) {
      setTimeout(() => {
        onOpenFeedDialog(contact.name!);
      }, 500);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <h6 className="messages" style={{ textAlign: 'center' }}>
          {LOADING_CONTACT_MESSAGE}
        </h6>
        <div
          className="app-progress"
          aria-label="Indeterminate progress-bar example"
          style={{
            height: 4,
            background: 'linear-gradient(90deg, #3f51b5 30%, transparent 30%)',
            animation: 'indeterminate 1.5s infinite',
          }}
        />
      </div>
    );
  }

  // Contact loaded
  if (contact !== null) {
    return (
      <>
        <div>
          <div style={{ padding: 16, border: '1px solid #ccc', borderRadius: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span role="img" aria-label="mood" style={{ fontSize: 24 }}>😊</span>
              <div>
                <h3 style={{ margin: 0 }}>{contact.name}</h3>
                <p style={{ margin: 0, color: '#666' }}>{contact.email}</p>
                <p style={{ margin: 0, color: '#666' }}>
                  {formatPhoneNumber(contact.number, 'default', contact.country)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex' }}>
            <button
              className="back-button"
              onClick={onNavigateBack}
              style={{
                cursor: 'pointer',
                marginTop: 10,
                transform: 'rotate(180deg)',
                background: '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 56,
                height: 56,
                fontSize: 24,
              }}
              title="Add new contact"
            >
              ➤
            </button>
          </div>
          <div style={{ display: 'flex' }}>
            <button
              className="feed-button"
              onClick={handleOpenDialog}
              style={{
                cursor: 'pointer',
                marginTop: 10,
                background: '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 56,
                height: 56,
                fontSize: 24,
              }}
            >
              📡
            </button>
          </div>
        </div>
      </>
    );
  }

  // No contact found
  return (
    <div>
      <h6 className="messages" style={{ textAlign: 'center' }}>
        {NO_CONTACT_FOUND_MESSAGE}
      </h6>
    </div>
  );
};
