import { useState, useEffect } from 'react';
import { getDeviceComboById } from '../../services/device-combo.service';

export function useDeviceComboById(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id == null) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getDeviceComboById(id);
        setData(res);
      } catch (err) {
        setError(err?.message || 'Failed to fetch device combo');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
}