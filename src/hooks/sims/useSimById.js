import { useState, useEffect } from 'react';
import { getSimById } from '../../services/sim.service';

export function useSimById(id) {
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
        const res = await getSimById(id);
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch SIM');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  return { data, loading, error };
}
