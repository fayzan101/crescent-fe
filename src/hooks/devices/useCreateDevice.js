import { useState } from 'react';
import { createDevice } from '../../services/device.service';

export function useCreateDevice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = async (device) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createDevice(device);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to create device');
      setLoading(false);
      throw err;
    }
  };

  return { create, loading, error, data };
}
