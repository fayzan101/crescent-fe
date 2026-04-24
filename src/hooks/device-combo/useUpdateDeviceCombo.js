import { useState } from 'react';
import { updateDeviceCombo } from '../../services/device-combo.service';

export function useUpdateDeviceCombo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = async (id, combo) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateDeviceCombo(id, combo);
      setData(result);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to update device combo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error, data };
}