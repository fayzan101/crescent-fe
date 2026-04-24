import { useState } from 'react';
import { updateSim } from '../../services/sim.service';

export function useUpdateSim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = async (id, sim) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateSim(id, sim);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to update SIM');
      setLoading(false);
      throw err;
    }
  };

  return { update, loading, error, data };
}
