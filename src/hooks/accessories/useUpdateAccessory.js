import { useState } from 'react';
import { updateAccessory, Accessory } from '../../services/accessories.service';

export function useUpdateAccessory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = async (id, accessory) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateAccessory(id, accessory);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to update accessory');
      setLoading(false);
      throw err;
    }
  };

  return { update, loading, error, data };
}
