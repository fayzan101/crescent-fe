import { useState, useEffect } from 'react';
import { getPermissions } from '../../services/permissions.service';

export function usePermissions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        setLoading(true);
        setError(null);
      }
      try {
        const res = await getPermissions();
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch permissions');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return { data, loading, error };
}
