import { useState } from 'react';
import { createSale } from '../../services/sales.service';

export function useCreateSale() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createSale(payload);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to create sale');
      setLoading(false);
      throw err;
    }
  };

  return { create, loading, error, data };
}
