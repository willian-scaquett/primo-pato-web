import { useState, useEffect } from 'react';
import { buscarClassificacaoPato } from '../../../lib/apiClient';

export const useClassification = (selectedDuck) => {
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDuck) {
      setClassification(null);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const data = await buscarClassificacaoPato(selectedDuck);
        setClassification(data);
      } catch {
        setClassification(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDuck]);

  return { classification, loading };
};