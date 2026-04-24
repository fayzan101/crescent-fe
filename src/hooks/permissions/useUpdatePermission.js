import { useState } from 'react';
import { updatePermission } from '../../services/permissions.service';

export function useUpdatePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = async (id, permission) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updatePermission(id, permission);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to update permission');
      setLoading(false);
      throw err;
    }
  };

  return { update, loading, error, data };
}
