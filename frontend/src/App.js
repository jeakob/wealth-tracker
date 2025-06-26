import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import GraphsPage from './GraphsPage';
import SettingsPage from './SettingsPage';
import { getBankAccounts, getAssets, addAsset, updateAsset, deleteAsset } from './api/index';
import Pagination from '@mui/material/Pagination';

const assetTypes = [
  { value: 'crypto', label: 'Crypto' },
  { value: 'bank', label: 'Bank Account' },
  { value: 'other', label: 'Other' },
];

const currencies = ['USD', 'EUR', 'GBP', 'PLN', 'BTC', 'ETH'];

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181c24',
      paper: '#232a36',
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function AppContent() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({
    type: 'crypto',
    name: '',
    value: '',
    currency: 'USD',
    date: new Date().toISOString().slice(0, 10),
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [assetIds, setAssetIds] = useState([]); // Track asset IDs for edit/delete
  const location = useLocation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [assetsPerPage] = useState(5); // Number of assets per page

  // Filters state
  const [assetTypeFilter, setAssetTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  // Fetch assets and bank accounts on mount
  useEffect(() => {
    fetchAssets();
    fetchBankAccounts();
  }, []);

  // Refetch bank accounts when returning to the main page or when location changes
  useEffect(() => {
    fetchBankAccounts();
    fetchAssets();
  }, [location]);

  const fetchAssets = async () => {
    try {
      const data = await getAssets();
      // Sort assets by date descending so latest is first
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAssets(data);
      setAssetIds(data.map(a => a.id));
    } catch (e) {
      setAssets([]);
      setAssetIds([]);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const accounts = await getBankAccounts();
      setBankAccounts(accounts);
    } catch (e) {
      setBankAccounts([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.value) return;
    try {
      await addAsset(form);
      fetchAssets();
    } catch (e) {}
    setForm({ type: 'crypto', name: '', value: '', currency: defaultCurrency, date: new Date().toISOString().slice(0, 10) });
  };

  const handleEdit = (idx) => {
    setEditingIndex(idx);
    setForm(assets[idx]);
  };

  const handleSave = async () => {
    try {
      await updateAsset(assets[editingIndex].id, form);
      fetchAssets();
    } catch (e) {}
    setEditingIndex(null);
    setForm({ type: 'crypto', name: '', value: '', currency: defaultCurrency, date: new Date().toISOString().slice(0, 10) });
  };

  const handleDelete = async (idx) => {
    try {
      await deleteAsset(assets[idx].id);
      fetchAssets();
    } catch (e) {}
    if (editingIndex === idx) setEditingIndex(null);
  };

  const handleDefaultCurrency = (e) => {
    setDefaultCurrency(e.target.value);
    setForm({ ...form, currency: e.target.value });
  };

  // Calculate assets to display on the current page
  const indexOfLastAsset = currentPage * assetsPerPage;
  const indexOfFirstAsset = indexOfLastAsset - assetsPerPage;
  const currentAssets = assets.slice(indexOfFirstAsset, indexOfLastAsset);

  // Change page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filter assets based on type and date
  const filteredAssets = assets.filter(asset => {
    const matchesType = assetTypeFilter === 'all' || asset.type === assetTypeFilter;
    const matchesDate = (!dateFilter.start || new Date(asset.date) >= new Date(dateFilter.start)) &&
                        (!dateFilter.end || new Date(asset.date) <= new Date(dateFilter.end));
    return matchesType && matchesDate;
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box position="fixed" top={0} left={0} width="100vw" height="100vh" minHeight="100vh" minWidth="100vw" display="flex" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg, #232a36 0%, #181c24 100%)', m: 0, p: 0, zIndex: 0 }}>
        <Container maxWidth="xl" disableGutters sx={{ px: 0, m: 0 }}>
          <Routes>
            <Route path="/" element={
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: '#232a36', border: 'none', boxShadow: 'none', outline: 'none' }}>
                <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
                  Wealth Tracker
                </Typography>
                <Box display="flex" justifyContent="center" mb={2}>
                  <FormControl fullWidth>
                    <InputLabel>Default Currency</InputLabel>
                    <Select value={defaultCurrency} label="Default Currency" onChange={handleDefaultCurrency}>
                      {currencies.map((cur) => (
                        <MenuItem key={cur} value={cur}>{cur}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box display="flex" gap={2} mb={2}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select name="type" value={form.type} label="Type" onChange={handleChange}>
                      {assetTypes.map((t) => (
                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {form.type === 'bank' ? (
                    <FormControl fullWidth>
                      <InputLabel>Bank Account</InputLabel>
                      <Select name="name" value={form.name} label="Bank Account" onChange={handleChange}>
                        {bankAccounts.map((acc) => (
                          <MenuItem key={acc.id} value={acc.name}>{acc.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <TextField name="name" label="Asset Name" value={form.name} onChange={handleChange} fullWidth />
                  )}
                </Box>
                <Box display="flex" gap={2} mb={2}>
                  <TextField name="value" label="Value" type="number" value={form.value} onChange={handleChange} fullWidth />
                  <FormControl sx={{ minWidth: 100 }}>
                    <InputLabel>Currency</InputLabel>
                    <Select name="currency" value={form.currency} label="Currency" onChange={handleChange}>
                      {currencies.map((cur) => (
                        <MenuItem key={cur} value={cur}>{cur}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField name="date" label="Date" type="date" value={form.date} onChange={handleChange} sx={{ minWidth: 140 }} InputLabelProps={{ shrink: true }} />
                </Box>
                <Box display="flex" justifyContent="center" mb={3}>
                  {editingIndex === null ? (
                    <Button variant="contained" color="primary" onClick={handleAdd} sx={{ px: 4, fontWeight: 600 }}>
                      Add Asset
                    </Button>
                  ) : (
                    <Button variant="contained" color="secondary" onClick={handleSave} startIcon={<SaveIcon />} sx={{ px: 4, fontWeight: 600 }}>
                      Save
                    </Button>
                  )}
                </Box>
                <Box display="flex" justifyContent="center" mb={3} gap={2}>
                  <Button variant="outlined" component={Link} to="/graphs" sx={{ px: 4, fontWeight: 600 }}>
                    View Graphs
                  </Button>
                  <Button variant="outlined" component={Link} to="/settings" sx={{ px: 4, fontWeight: 600 }}>
                    Settings
                  </Button>
                </Box>
                {/* Asset list filters moved just above the asset list */}
                <Box display="flex" gap={2} mb={2} justifyContent="center">
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel>Asset Type</InputLabel>
                    <Select value={assetTypeFilter} label="Asset Type" onChange={e => setAssetTypeFilter(e.target.value)}>
                      <MenuItem value="all">All</MenuItem>
                      {assetTypes.map(t => (
                        <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Start Date"
                    type="date"
                    value={dateFilter?.start || ''}
                    onChange={e => setDateFilter(df => ({ ...df, start: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 140 }}
                  />
                  <TextField
                    label="End Date"
                    type="date"
                    value={dateFilter?.end || ''}
                    onChange={e => setDateFilter(df => ({ ...df, end: e.target.value }))}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 140 }}
                  />
                </Box>
                <Box>
                  {assets.length === 0 ? (
                    <Typography align="center" color="text.secondary">No assets added yet.</Typography>
                  ) : (
                    currentAssets.map((asset) => (
                      <Paper key={asset.id} sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', background: '#232a36' }}>
                        <Box flexGrow={1}>
                          <Typography variant="subtitle1" fontWeight={600}>{asset.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {asset.type === 'crypto' ? 'Cryptocurrency' : asset.type === 'bank' ? 'Bank Account' : 'Other'}
                          </Typography>
                          <Typography variant="h6" color="primary.main">
                            {asset.value} {asset.currency} {asset.date && (<span style={{fontSize:12, color:'#aaa'}}>({asset.date})</span>)}
                          </Typography>
                        </Box>
                        <IconButton color="primary" onClick={() => handleEdit(assets.findIndex(a => a.id === asset.id))} sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(assets.findIndex(a => a.id === asset.id))}>
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    ))
                  )}
                </Box>

                {assets.length > assetsPerPage && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={Math.ceil(assets.length / assetsPerPage)}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}

              </Paper>
            } />
            <Route path="/graphs" element={<GraphsPage assets={assets} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
