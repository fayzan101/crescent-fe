import { useState } from 'react';
import { updateOperationsStage } from '../../services/sales.service';

export function useUpdateOperationsStage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateOperationsStage(id, payload);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to update operations stage');
      setLoading(false);
      throw err;
    }
  };

  return { update, loading, error, data };
}
