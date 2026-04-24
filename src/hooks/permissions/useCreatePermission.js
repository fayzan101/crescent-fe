import { useState } from 'react';
import { createPermission } from '../../services/permissions.service';

export function useCreatePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = async (permission) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPermission(permission);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to create permission');
      setLoading(false);
      throw err;
    }
  };

  return { create, loading, error, data };
}
