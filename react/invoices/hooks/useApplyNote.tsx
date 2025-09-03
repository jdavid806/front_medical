import { useState } from "react";
import { invoiceService } from "../../../services/api";

export function useApplyNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const applyNote = async (payload: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await invoiceService.applyNote(payload);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al aplicar nota");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { applyNote, loading, error, data };
}
