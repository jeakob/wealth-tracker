import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider"
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import ManageAssetsPage from './ManageAssetsPage';
import GraphsPage from './GraphsPage';
import SettingsPage from './SettingsPage';
import BankAccountsPage from './BankAccountsPage';
import LiabilitiesPage from './LiabilitiesPage';
import AddAssetPage from './AddAssetPage';
import { getBankAccounts, getAssets, addAsset, updateAsset, deleteAsset } from './api/index';
// Styles are now via index.css/tailwind

function AppContent() {
  const [assets, setAssets] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [defaultCurrency, setDefaultCurrency] = useState(() => localStorage.getItem('defaultCurrency') || 'USD');
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('defaultCurrency', defaultCurrency);
  }, [defaultCurrency]);

  // Fetch logic
  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const fetchData = async () => {
    await Promise.all([fetchAssets(), fetchBankAccounts()]);
  };

  const fetchAssets = async () => {
    try {
      const data = await getAssets();
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAssets(data);
    } catch (e) {
      console.error(e);
      setAssets([]);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const accounts = await getBankAccounts();
      setBankAccounts(accounts);
    } catch (e) {
      console.error(e);
      setBankAccounts([]);
    }
  };

  const handleAddAsset = async (assetData) => {
    try {
      await addAsset(assetData);
      fetchAssets();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateAsset = async (assetData) => {
    try {
      // Assuming assetData has id or we use editingAsset.id
      // In component we pass the full object which has id
      await updateAsset(assetData.id, assetData);
      fetchAssets();
      setEditingAsset(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAsset = async (id) => {
    try {
      await deleteAsset(id);
      fetchAssets();
      if (editingAsset && editingAsset.id === id) setEditingAsset(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MainLayout>
        <Routes>
          <Route path="/" element={
            <Dashboard
              assets={assets}
              onAdd={handleAddAsset}
              onUpdate={handleUpdateAsset}
              onDelete={handleDeleteAsset}
              bankAccounts={bankAccounts}
              defaultCurrency={defaultCurrency}
            />
          } />
          <Route path="/assets" element={<ManageAssetsPage assets={assets} onUpdate={handleUpdateAsset} onDelete={handleDeleteAsset} />} />
          <Route path="/add-asset" element={<AddAssetPage onAdd={handleAddAsset} bankAccounts={bankAccounts} defaultCurrency={defaultCurrency} />} />
          <Route path="/liabilities" element={<LiabilitiesPage />} />
          <Route path="/bank-accounts" element={<BankAccountsPage />} />
          <Route path="/graphs" element={<GraphsPage assets={assets} defaultCurrency={defaultCurrency} />} />
          <Route path="/settings" element={<SettingsPage defaultCurrency={defaultCurrency} setDefaultCurrency={setDefaultCurrency} />} />
        </Routes>
      </MainLayout>
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
