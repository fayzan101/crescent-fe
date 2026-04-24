import { useState } from 'react';
import { deleteDevice } from '../../services/device.service';

export function useDeleteDevice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteDevice(id);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to delete device');
      setLoading(false);
      throw err;
    }
  };

  return { remove, loading, error, data };
}
