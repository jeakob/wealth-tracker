import { useState } from 'react';
import api from '../api';

export default function useAuth() {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    // Store JWT securely (e.g., httpOnly cookie or secure storage)
  };

  const logout = () => {
    setUser(null);
    // Remove JWT from storage
  };

  return { user, login, logout };
}
