import { useState, useEffect } from 'react';
import { getAccessories } from '../../services/accessories.service';

export function useAccessories() {
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
        const res = await getAccessories();
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch accessories');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return { data, loading, error };
}
