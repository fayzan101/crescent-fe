import { useState } from 'react';
import { deleteSim } from '../../services/sim.service';

export function useDeleteSim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteSim(id);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to delete SIM');
      setLoading(false);
      throw err;
    }
  };

  return { remove, loading, error, data };
}
