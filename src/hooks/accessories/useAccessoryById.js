import { useState, useEffect } from 'react';
import { getAccessoryById } from '../../services/accessories.service';

export function useAccessoryById(id) {
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
        const res = await getAccessoryById(id);
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch accessory');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  return { data, loading, error };
}
