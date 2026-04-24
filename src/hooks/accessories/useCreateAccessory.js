import { useState } from 'react';
import { createAccessory, Accessory } from '../../services/accessories.service';

export function useCreateAccessory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = async (accessory) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createAccessory(accessory);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to create accessory');
      setLoading(false);
      throw err;
    }
  };

  return { create, loading, error, data };
}
