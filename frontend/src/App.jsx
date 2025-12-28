import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import ManageAssetsPage from './ManageAssetsPage';
import GraphsPage from './GraphsPage';
import SettingsPage from './SettingsPage';
import BankAccountsPage from './BankAccountsPage';
import LiabilitiesPage from './LiabilitiesPage';
import AddAssetPage from './AddAssetPage';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import { getBankAccounts, getAssets, addAsset, updateAsset, deleteAsset } from './api/index';
// Styles are now via index.css/tailwind

function AppContent() {
  const [assets, setAssets] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [defaultCurrency, setDefaultCurrency] = useState(() => localStorage.getItem('defaultCurrency') || 'USD');
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    localStorage.setItem('defaultCurrency', defaultCurrency);
  }, [defaultCurrency]);

  // Fetch logic
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [location.pathname, isAuthenticated]);

  const fetchData = async () => {
    await Promise.all([fetchAssets(), fetchBankAccounts()]);
  };

  const fetchAssets = async () => {
    try {
      const data = await getAssets();
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
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard
                assets={assets}
                onAdd={handleAddAsset}
                onUpdate={handleUpdateAsset}
                onDelete={handleDeleteAsset}
                bankAccounts={bankAccounts}
                defaultCurrency={defaultCurrency}
              />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/assets" element={
          <ProtectedRoute>
            <MainLayout>
              <ManageAssetsPage assets={assets} onUpdate={handleUpdateAsset} onDelete={handleDeleteAsset} />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/add-asset" element={
          <ProtectedRoute>
            <MainLayout>
              <AddAssetPage onAdd={handleAddAsset} bankAccounts={bankAccounts} defaultCurrency={defaultCurrency} />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/liabilities" element={
          <ProtectedRoute>
            <MainLayout>
              <LiabilitiesPage defaultCurrency={defaultCurrency} />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/bank-accounts" element={
          <ProtectedRoute>
            <MainLayout>
              <BankAccountsPage defaultCurrency={defaultCurrency} />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/graphs" element={
          <ProtectedRoute>
            <MainLayout>
              <GraphsPage assets={assets} defaultCurrency={defaultCurrency} />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute adminOnly={true}>
            <MainLayout>
              <UserManagementPage />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage defaultCurrency={defaultCurrency} setDefaultCurrency={setDefaultCurrency} />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
