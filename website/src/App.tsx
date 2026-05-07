import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { ContactList } from './components/ContactList';
import { ContactDetail } from './components/ContactDetail';
import { ContactEdit } from './components/ContactEdit';
import { NewContact } from './components/NewContact';
import { PageNotFound } from './components/PageNotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/contacts"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            Contacts
          </Typography>
        </Toolbar>
      </AppBar>
      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/" element={<ContactList />} />
          <Route path="/add" element={<NewContact />} />
          <Route path="/contacts" element={<ContactList />} />
          <Route path="/contact/:id" element={<ContactDetail />} />
          <Route path="/edit/:id" element={<ContactEdit />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
