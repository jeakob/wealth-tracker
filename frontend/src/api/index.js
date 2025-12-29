import axios from 'axios';
import { API_URL } from '../config';

export const getBankAccounts = async () => {
  const response = await axios.get(`${API_URL}/bankaccounts`);
  return response.data;
};

export const addBankAccount = async (account) => {
  const res = await axios.post(`${API_URL}/bankaccounts`, account);
  return res.data;
};

export const updateBankAccount = async (id, data) => {
  const res = await axios.put(`${API_URL}/bankaccounts/${id}`, data);
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

export const getNetWorthSnapshots = async () => {
  const res = await axios.get(`${API_URL}/net-worth/snapshots`);
  return res.data;
};

export const recalculateNetWorth = async () => {
  const res = await axios.post(`${API_URL}/net-worth/recalculate`);
  return res.data;
};

export const clearNetWorthSnapshots = async () => {
  const res = await axios.delete(`${API_URL}/net-worth/snapshots`);
  return res.data;
};

export const getLiabilities = async () => {
  const res = await axios.get(`${API_URL}/liabilities`);
  return res.data;
};

export const addLiability = async (liability) => {
  const res = await axios.post(`${API_URL}/liabilities`, liability);
  return res.data;
};

export const updateLiability = async (id, liability) => {
  const res = await axios.put(`${API_URL}/liabilities/${id}`, liability);
  return res.data;
};

export const deleteLiability = async (id) => {
  const res = await axios.delete(`${API_URL}/liabilities/${id}`);
  return res.data;
};

export const getSettings = async () => {
  const res = await axios.get(`${API_URL}/settings`);
  return res.data;
};

export const updateSetting = async (key, value) => {
  const res = await axios.post(`${API_URL}/settings`, { key, value });
  return res.data;
};
