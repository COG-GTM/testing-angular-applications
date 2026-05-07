import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Button, Fab, Snackbar, LinearProgress, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Mood } from '@mui/icons-material';
import { Contact } from '../models/contact';
import { contactService } from '../services/contact.service';
import { CONTACTS } from '../services/mock-contacts';
import { formatPhoneNumber } from '../utils/phone-number';
import { FavoriteIcon } from './FavoriteIcon';

const NO_CONTACTS_FOUND_MESSAGE = 'You do not have any contacts yet';
const LOADING_CONTACTS_MESSAGE = 'Loading contacts...';
const DELETING_CONTACTS_MESSAGE = 'Deleting contacts...';
const DELETING_CONTACT_MESSAGE = 'Deleting contact...';

export function ContactList() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingContacts, setDeletingContacts] = useState(false);
  const [deletingContact, setDeletingContact] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getContacts = useCallback(async () => {
    setIsLoading(true);
    const data = await contactService.getContacts();
    setContacts(data);
    setIsLoading(false);
    setDeletingContacts(false);
  }, []);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const handleClick = (contact: Contact) => {
    navigate(`/contact/${contact.id}`);
  };

  const handleEdit = (contact: Contact) => {
    navigate(`/edit/${contact.id}`);
  };

  const handleDelete = async (contact: Contact) => {
    setDeletingContact(true);
    setSnackbarMessage(`${contact.name} deleted.`);
    setSnackbarOpen(true);
    await contactService.delete(contact);
    setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    setDeletingContact(false);
  };

  const handleDeleteAll = async () => {
    setDeletingContacts(true);
    for (const contact of contacts) {
      await contactService.delete(contact);
    }
    await getContacts();
  };

  const handleRefresh = async () => {
    for (const contact of CONTACTS) {
      await contactService.save({ ...contact });
    }
    await getContacts();
  };

  const handleSaveContact = async (contact: Contact) => {
    const updated = { ...contact, favorite: !contact.favorite };
    await contactService.save(updated);
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  if (deletingContact) {
    return (
      <div>
        <h6 className="messages">{DELETING_CONTACT_MESSAGE}</h6>
        <LinearProgress />
      </div>
    );
  }

  if (deletingContacts) {
    return (
      <div>
        <h6 className="messages">{DELETING_CONTACTS_MESSAGE}</h6>
        <LinearProgress />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h6 className="messages">{LOADING_CONTACTS_MESSAGE}</h6>
        <LinearProgress />
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div>
        <h6 className="messages">{NO_CONTACTS_FOUND_MESSAGE}</h6>
        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Add Contacts
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Table sx={{ width: '50%', margin: '0 auto' }}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Number</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} hover sx={{ cursor: 'pointer' }}>
              <TableCell onClick={() => handleClick(contact)}>
                <Mood />
              </TableCell>
              <TableCell onClick={() => handleClick(contact)}>
                <strong>{contact.name}</strong>
              </TableCell>
              <TableCell onClick={() => handleClick(contact)}>
                {contact.email}
              </TableCell>
              <TableCell onClick={() => handleClick(contact)}>
                {formatPhoneNumber(contact.number || '', 'default', contact.country || '', true)}
              </TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <Edit
                    sx={{ color: 'white', '&:hover': { color: 'black' }, cursor: 'pointer' }}
                    onClick={() => handleEdit(contact)}
                  />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title="Delete">
                  <Delete
                    sx={{ color: 'white', '&:hover': { color: 'black' }, cursor: 'pointer' }}
                    onClick={() => handleDelete(contact)}
                  />
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={contact.favorite ? 'Starred' : 'Not Starred'}>
                  <span>
                    <FavoriteIcon
                      isFavorite={!!contact.favorite}
                      color="gold"
                      onClick={() => handleSaveContact(contact)}
                    />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <br />
      <Button variant="contained" color="primary" onClick={handleDeleteAll}>
        Delete All Contacts
      </Button>
      <Fab
        color="primary"
        sx={{ float: 'right' }}
        id="add-contact"
        onClick={() => navigate('/add')}
      >
        <Tooltip title="Add new contact">
          <Add sx={{ color: 'white' }} />
        </Tooltip>
      </Fab>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
}
