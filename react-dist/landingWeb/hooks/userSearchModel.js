import { useState, useCallback } from "react";
import { genericFilterServices } from "../../../services/api/index.js";
export function useGenericFilter(model) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const search = useCallback(async (filters = {}, sort = {
    field: "created_at",
    direction: "desc"
  }, per_page = 10, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const payload = {
        filters,
        sort,
        per_page,
        limit
      };
      const response = await genericFilterServices.searchModel(model, payload);
      setData(response.data?.data || response.data || []);
    } catch (err) {
      setError(err.message || "Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  }, [model]);
  return {
    data,
    loading,
    error,
    search
  };
}