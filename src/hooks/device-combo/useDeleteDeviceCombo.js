import { useState } from 'react';
import { deleteDeviceCombo } from '../../services/device-combo.service';

export function useDeleteDeviceCombo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteDeviceCombo(id);
      setData(result);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to delete device combo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error, data };
}