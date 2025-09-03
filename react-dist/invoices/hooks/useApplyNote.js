import { useState } from "react";
import { invoiceService } from "../../../services/api/index.js";
export function useApplyNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const applyNote = async payload => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoiceService.applyNote(payload);
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || "Error al aplicar nota");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    applyNote,
    loading,
    error,
    data
  };
}