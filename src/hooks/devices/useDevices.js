import { useState, useEffect } from 'react';
import { getDevices } from '../../services/device.service';

export function useDevices() {
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
        const res = await getDevices();
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch devices');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return { data, loading, error };
}
