import { useState, useEffect } from "react";
import { buscarClassificacaoPato } from "../../../lib/apiClient";

export const useMission = (selectedDuck) => {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDuck) {
      setMission(null);
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const data = await buscarClassificacaoPato(selectedDuck);
        setMission(data);
      } catch {
        setMission(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedDuck]);

  return { mission, loading };
};