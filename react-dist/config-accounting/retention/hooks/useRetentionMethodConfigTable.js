import { useState, useEffect } from 'react';
import { retentionsService } from "../../../../services/api/index.js";
export const useRetentionsConfigTable = () => {
  const [retentions, setRetentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRetentions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await retentionsService.getRetentions();
      setRetentions(data);
    } catch (err) {
      console.error('Error fetching retentions:', err);
      setError('Error al cargar las retenciones');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRetentions();
  }, []);
  return {
    retentions,
    loading,
    error,
    refreshRetentions: fetchRetentions
  };
};