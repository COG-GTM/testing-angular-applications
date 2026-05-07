import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, TextField, Button, Fab, LinearProgress,
  Snackbar, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Mood, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Contact } from '../models/contact';
import { contactService } from '../services/contact.service';
import { countryDialingCodes } from '../utils/phone-number';
import { isEmailValid, isPhoneNumberValid } from '../utils/validation';
import { FavoriteIcon } from './FavoriteIcon';

const LOADING_CONTACT_MESSAGE = 'Loading contact...';
const NO_CONTACT_FOUND_MESSAGE = 'Contact not found';

export function ContactEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);

  useEffect(() => {
    const loadContact = async () => {
      const result = await contactService.getContact(Number(id));
      setContact(result ? { ...result } : null);
      setIsLoading(false);
    };
    loadContact();
  }, [id]);

  const handleSaveFavorite = async () => {
    if (!contact) return;
    const updated = { ...contact, favorite: !contact.favorite };
    setContact(updated);
    await contactService.save(updated);
  };

  const handleUpdate = async () => {
    if (!contact) return;

    if (!isEmailValid(contact.email || '')) {
      setEmailModalOpen(true);
      return;
    }

    if (!isPhoneNumberValid(contact.number || '')) {
      setPhoneModalOpen(true);
      return;
    }

    setSnackbarOpen(true);
    await contactService.save(contact);
    navigate('/');
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
          <FavoriteIcon
            isFavorite={!!contact.favorite}
            color="gold"
            onClick={handleSaveFavorite}
          />
          <TextField
            label="Name"
            value={contact.name || ''}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={contact.email || ''}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            value={contact.number || ''}
            onChange={(e) => setContact({ ...contact, number: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Country code</InputLabel>
            <Select
              value={contact.country || ''}
              label="Country code"
              onChange={(e) => setContact({ ...contact, country: e.target.value })}
            >
              {Object.keys(countryDialingCodes).map((code) => (
                <MenuItem key={code} value={code.toLowerCase()}>
                  {code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update Contact
          </Button>
        </CardContent>
      </Card>

      <Link to="/contacts">
        <Fab size="medium" sx={{ marginTop: '16px' }}>
          <ArrowForward />
        </Fab>
      </Link>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Contact updated"
      />

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
