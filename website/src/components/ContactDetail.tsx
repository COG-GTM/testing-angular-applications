import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card, CardContent, Typography, Fab, LinearProgress, Dialog,
} from '@mui/material';
import { Mood, ArrowForward, RssFeed } from '@mui/icons-material';
import { Contact } from '../models/contact';
import { contactService } from '../services/contact.service';
import { formatPhoneNumber } from '../utils/phone-number';
import { ContactFeedDialog } from './ContactFeedDialog';

const LOADING_CONTACT_MESSAGE = 'Loading contact...';
const NO_CONTACT_FOUND_MESSAGE = 'Contact not found';

export function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedOpen, setFeedOpen] = useState(false);

  useEffect(() => {
    const loadContact = async () => {
      const result = await contactService.getContact(Number(id));
      setContact(result || null);
      setIsLoading(false);
    };
    loadContact();
  }, [id]);

  const openDialog = () => {
    setTimeout(() => setFeedOpen(true), 500);
  };

  if (isLoading) {
    return (
      <div>
        <h6 className="messages">{LOADING_CONTACT_MESSAGE}</h6>
        <LinearProgress />
      </div>
    );
  }

  if (!contact) {
    return (
      <div>
        <h6 className="messages">{NO_CONTACT_FOUND_MESSAGE}</h6>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Mood />
          <Typography variant="h5">{contact.name}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {contact.email}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {formatPhoneNumber(contact.number || '', 'default', contact.country || '')}
          </Typography>
        </CardContent>
      </Card>

      <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <Link to="/contacts">
          <Fab size="medium">
            <ArrowForward />
          </Fab>
        </Link>
        <Fab color="primary" onClick={openDialog}>
          <RssFeed />
        </Fab>
      </div>

      <Dialog open={feedOpen} onClose={() => setFeedOpen(false)}>
        <ContactFeedDialog name={contact.name || ''} onClose={() => setFeedOpen(false)} />
      </Dialog>
    </div>
  );
}


