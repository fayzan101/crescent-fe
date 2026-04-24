import { useState } from 'react';
import { updateAccountsStage } from '../../services/sales.service';

export function useUpdateAccountsStage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAccountsStage(id, payload);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to update accounts stage');
      setLoading(false);
      throw err;
    }
  };

  return { update, loading, error, data };
}
