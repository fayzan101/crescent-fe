import { useState, useEffect } from 'react';
import { getSims } from '../../services/sim.service';

export function useSims() {
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
        const res = await getSims();
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch SIMs');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return { data, loading, error };
}
