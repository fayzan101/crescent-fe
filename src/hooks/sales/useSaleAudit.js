import { useState, useEffect } from 'react';
import { getSaleAudit } from '../../services/sales.service';

export function useSaleAudit(id) {
  const [data, setData] = useState([]);
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
        const res = await getSaleAudit(id);
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to fetch sale audit log');
          setLoading(false);
        }
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  return { data, loading, error };
}
