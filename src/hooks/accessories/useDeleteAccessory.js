import { useState } from 'react';
import { deleteAccessory } from '../../services/accessories.service';

export function useDeleteAccessory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteAccessory(id);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to delete accessory');
      setLoading(false);
      throw err;
    }
  };

  return { remove, loading, error, data };
}
