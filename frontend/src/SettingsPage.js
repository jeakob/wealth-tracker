import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, List, ListItem, ListItemText } from '@mui/material';
import { getBankAccounts, addBankAccount, deleteBankAccount } from './api/index';
import { Link } from 'react-router-dom';

function SettingsPage() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    setError('');
    try {
      const accounts = await getBankAccounts();
      setBankAccounts(accounts);
    } catch (error) {
      let msg = 'Failed to fetch bank accounts.';
      if (error.response) {
        msg += ` Server responded with status ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        msg += ' No response from server. Check backend connection, ensure API_URL is set correctly.';
      } else {
        msg += ` ${error.message}`;
      }
      setError(msg);
      console.error(msg, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newAccount.trim()) return;
    setLoading(true);
    setError('');
    try {
      await addBankAccount(newAccount.trim());
      setNewAccount('');
      fetchAccounts();
    } catch (error) {
      let msg = 'Failed to add bank account.';
      if (error.response) {
        msg += ` Server responded with status ${error.response.status}: ${error.response.statusText}`;
        if (error.response.data && error.response.data.message) {
          msg += ` - ${error.response.data.message}`;
        }
      } else if (error.request) {
        msg += ' No response from server. Check backend connection.';
      } else {
        msg += ` ${error.message}`;
      }
      setError(msg);
      console.error(msg, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      await deleteBankAccount(id);
      fetchAccounts();
    } catch (error) {
      let msg = 'Failed to delete bank account.';
      if (error.response) {
        msg += ` Server responded with status ${error.response.status}: ${error.response.statusText}`;
        if (error.response.data && error.response.data.message) {
          msg += ` - ${error.response.data.message}`;
        }
      } else if (error.request) {
        msg += ' No response from server. Check backend connection.';
      } else {
        msg += ` ${error.message}`;
      }
      setError(msg);
      console.error(msg, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 4, background: '#232a36' }}>
        {error && (
          <Box mb={2}>
            <Typography color="error" variant="body1">{error}</Typography>
          </Box>
        )}
        <Typography variant="h5" fontWeight={700} gutterBottom>Settings</Typography>
        <Typography variant="h6" fontWeight={600} gutterBottom>Add Bank Account</Typography>
        <Box display="flex" gap={2} mb={2}>
          <TextField label="Bank Account Name" value={newAccount} onChange={e => setNewAccount(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleAdd} disabled={loading || !newAccount.trim()}>Add</Button>
        </Box>
        <List>
          {bankAccounts.length === 0 ? (
            <ListItem><ListItemText primary="No bank accounts yet." /></ListItem>
          ) : (
            bankAccounts.map(acc => (
              <ListItem key={acc.id} secondaryAction={
                <Button color="error" onClick={() => handleDelete(acc.id)} disabled={loading}>
                  Remove
                </Button>
              }>
                <ListItemText primary={acc.name} />
              </ListItem>
            ))
          )}
        </List>
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          <Button variant="outlined" component={Link} to="/" sx={{ px: 4, fontWeight: 600 }}>Home</Button>
          <Button variant="outlined" component={Link} to="/graphs" sx={{ px: 4, fontWeight: 600 }}>Graphs</Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SettingsPage;
