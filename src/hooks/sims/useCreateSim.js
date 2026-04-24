import { useState } from 'react';
import { createSim } from '../../services/sim.service';

export function useCreateSim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = async (sim) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createSim(sim);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to create SIM');
      setLoading(false);
      throw err;
    }
  };

  return { create, loading, error, data };
}
