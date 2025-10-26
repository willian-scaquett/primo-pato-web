import { useState, useEffect } from "react";
import { buscarPatos } from "../../../lib/apiClient";

export const useDucks = (preselectId) => {
  const [ducks, setDucks] = useState([]);
  const [selectedDuck, setSelectedDuck] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await buscarPatos();
        const rows = Array.isArray(list) ? list : [];
        setDucks(rows);
        
        if (preselectId && rows.find((d) => String(d.id) === String(preselectId))) {
          setSelectedDuck(String(preselectId));
        } else {
          setSelectedDuck("");
        }
      } catch {
        setDucks([]);
        setSelectedDuck("");
      }
    })();
  }, [preselectId]);

  return { ducks, selectedDuck, setSelectedDuck };
};