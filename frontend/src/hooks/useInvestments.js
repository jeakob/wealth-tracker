import { useState, useEffect } from 'react';
import api from '../api';

export default function useInvestments() {
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    api.get('/investments').then(({ data }) => setInvestments(data));
  }, []);

  return investments;
}
