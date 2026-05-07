import { useEffect, useState } from 'react';
import {
  DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemText, LinearProgress,
} from '@mui/material';
import { subscribeFeed } from '../services/contact-feed.service';

interface ContactFeedDialogProps {
  name: string;
  onClose: () => void;
}

export function ContactFeedDialog({ name, onClose }: ContactFeedDialogProps) {
  const [updates, setUpdates] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeFeed((update) => {
      setUpdates((prev) => {
        const next = [...prev, update];
        if (next.length > 4) next.shift();
        return next;
      });
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <DialogTitle>Latest posts from {name}</DialogTitle>
      <DialogContent>
        {updates.length > 0 ? (
          <List>
            {updates.map((update, i) => (
              <ListItem key={i}>
                <ListItemText primary={update} secondary="at Wed 12:00" />
              </ListItem>
            ))}
          </List>
        ) : (
          <LinearProgress color="secondary" />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" color="primary" disabled={updates.length < 2}>
          Follow
        </Button>
      </DialogActions>
    </>
  );
}
