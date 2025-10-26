import { useState, useCallback } from "react";
import { buscarPatos, apagarPato } from "../../../lib/apiClient";

export const useDucks = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const loadDucks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await buscarPatos();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setSnack({
        open: true,
        message: e.message || "Falha ao carregar patos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDuck = useCallback(async (id) => {
    try {
      await apagarPato(id);
      setSnack({
        open: true,
        message: "Pato excluído com sucesso.",
        severity: "success",
      });
      return true;
    } catch (e) {
      setSnack({
        open: true,
        message: e.message || "Falha ao excluir pato.",
        severity: "error",
      });
      return false;
    }
  }, []);

  const closeSnack = useCallback(() => {
    setSnack((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    rows,
    loading,
    snack,
    loadDucks,
    deleteDuck,
    closeSnack,
  };
};