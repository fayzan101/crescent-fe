import { useState } from 'react';
import { createDeviceCombo } from '../../services/device-combo.service';

export function useCreateDeviceCombo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = async (combo) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createDeviceCombo(combo);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to create device combo');
      setLoading(false);
      throw err;
    }
  };

  return { create, loading, error, data };
}