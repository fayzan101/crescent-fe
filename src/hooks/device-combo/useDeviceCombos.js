import { useState, useEffect } from 'react';
import { getDeviceCombos } from '../../services/device-combo.service';

export function useDeviceCombos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getDeviceCombos();
        setData(res);
      } catch (err) {
        setError(err?.message || 'Failed to fetch device combos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}