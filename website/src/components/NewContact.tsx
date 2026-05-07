import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card, CardContent, TextField, Button, Fab, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Contact } from '../models/contact';
import { contactService } from '../services/contact.service';
import { isEmailValid, isPhoneNumberValid } from '../utils/validation';

export function NewContact() {
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [savingContact, setSavingContact] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      const contacts = await contactService.getContacts();
      setContact({
        id: contacts.length + 1,
        name: '',
        email: '',
        number: '',
        country: 'us',
        favorite: false,
      });
    };
    init();
  }, []);

  const handleAdd = async () => {
    if (!contact) return;

    if (!isEmailValid(contact.email || '')) {
      setEmailModalOpen(true);
      return;
    }

    if (!isPhoneNumberValid(contact.number || '')) {
      setPhoneModalOpen(true);
      return;
    }

    setSavingContact(true);
    await contactService.save(contact);
    setSavingContact(false);
    navigate('/');
  };

  if (savingContact) {
    return (
      <div>
        <h6 className="messages">Saving Contact...</h6>
        <LinearProgress />
      </div>
    );
  }

  if (!contact) {
    return <LinearProgress />;
  }

  return (
    <div>
      <Card>
        <CardContent>
          <h4>Add New Contact</h4>
          <TextField
            label="Name"
            id="contact-name"
            value={contact.name || ''}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          {contact.name && (
            <>
              <TextField
                label="Email"
                id="contact-email"
                type="email"
                value={contact.email || ''}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number (10 digits)"
                id="contact-tel"
                type="tel"
                value={contact.number || ''}
                onChange={(e) => setContact({ ...contact, number: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Create
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Link to="/contacts">
        <Fab size="medium" sx={{ marginTop: '16px' }}>
          <ArrowForward />
        </Fab>
      </Link>

      <Dialog open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
        <DialogTitle>Invalid Email</DialogTitle>
        <DialogContent>Please enter a valid email address.</DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailModalOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={phoneModalOpen} onClose={() => setPhoneModalOpen(false)}>
        <DialogTitle>Invalid Phone Number</DialogTitle>
        <DialogContent>
          Please enter a phone number with 10 digits (For example, 2125551234).
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhoneModalOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
