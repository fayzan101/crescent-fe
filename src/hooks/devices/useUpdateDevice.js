import { useState } from 'react';
import { updateDevice } from '../../services/device.service';

export function useUpdateDevice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = async (id, device) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateDevice(id, device);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to update device');
      setLoading(false);
      throw err;
    }
  };

  return { update, loading, error, data };
}
