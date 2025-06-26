import axios from 'axios';

const API_URL = window.RUNTIME_CONFIG?.API_URL || 'http://localhost:4000';

export const getBankAccounts = async () => {
  const response = await axios.get(`${API_URL}/bankaccounts`);
  return response.data;
};

export const addBankAccount = async (name) => {
  const res = await axios.post(`${API_URL}/bankaccounts`, { name });
  return res.data;
};

export const deleteBankAccount = async (id) => {
  const res = await axios.delete(`${API_URL}/bankaccounts/${id}`);
  return res.data;
};

export const getAssets = async () => {
  const res = await axios.get(`${API_URL}/assets`);
  return res.data;
};

export const addAsset = async (asset) => {
  const res = await axios.post(`${API_URL}/assets`, asset);
  return res.data;
};

export const updateAsset = async (id, asset) => {
  const res = await axios.put(`${API_URL}/assets/${id}`, asset);
  return res.data;
};

export const deleteAsset = async (id) => {
  const res = await axios.delete(`${API_URL}/assets/${id}`);
  return res.data;
};
