import { useState, useEffect } from 'react';
import { getPermissionById } from '../../services/permissions.service';

export function usePermissionById(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id == null) return;
    let isMounted = true;
    (async () => {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }
      try {
        const res = await getPermissionById(id);
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch permission');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  return { data, loading, error };
}
