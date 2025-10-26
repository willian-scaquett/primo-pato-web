import { useState, useEffect } from 'react';
import { buscarPatos } from '../../../lib/apiClient';

export const useDucks = (searchParams) => {
  const [ducks, setDucks] = useState([]);
  const [selectedDuck, setSelectedDuck] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await buscarPatos({ capturado: false });
        const rows = Array.isArray(list) ? list : [];
        setDucks(rows);
        const pre = searchParams.get('id');
        const exists = pre && rows.find((d) => String(d.id) === String(pre));
        setSelectedDuck(exists ? String(pre) : '');
      } catch {
        setDucks([]);
        setSelectedDuck('');
      }
    })();
  }, [searchParams]);

  const refreshDucks = async () => {
    try {
      const updated = await buscarPatos({ capturado: false });
      const rows = Array.isArray(updated) ? updated : [];
      setDucks(rows);
      if (!rows.find((d) => String(d.id) === String(selectedDuck))) {
        setSelectedDuck(rows[0] ? String(rows[0].id) : '');
      }
    } catch {}
  };

  return { ducks, selectedDuck, setSelectedDuck, refreshDucks };
};
