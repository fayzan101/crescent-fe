import { useState } from 'react';
import { deletePermission } from '../../services/permissions.service';

export function useDeletePermission() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deletePermission(id);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err?.message || 'Failed to delete permission');
      setLoading(false);
      throw err;
    }
  };

  return { remove, loading, error, data };
}
