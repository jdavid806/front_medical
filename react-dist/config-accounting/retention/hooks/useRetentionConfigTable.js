import { useState, useEffect } from 'react';
import { retentionsService } from "../../../../services/api/index.js";
export const useRetentionsConfigTable = () => {
  const [retentions, setRetentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const transformRetentionData = data => {
    try {
      if (!Array.isArray(data)) {
        console.error('Expected array but received:', data);
        return [];
      }
      return data.map(retention => {
        const retentionData = retention.retention_charge || retention;
        return {
          id: retentionData?.id?.toString() || '',
          name: retentionData?.name || '',
          percentage: retentionData?.percentage || 0,
          account: retentionData?.accounting_account_id ? {
            id: retentionData.accounting_account_id.toString(),
            name: retentionData.accounting_account_name || `Cuenta ${retentionData.accounting_account_id}`
          } : null,
          returnAccount: retentionData?.accounting_account_reverse_id ? {
            id: retentionData.accounting_account_reverse_id.toString(),
            name: retentionData.accounting_account_reverse_name || `Cuenta ${retentionData.accounting_account_reverse_id}`
          } : null,
          description: retentionData?.description || 'Sin descripción'
        };
      });
    } catch (error) {
      console.error('Error transforming retention data:', error);
      return [];
    }
  };
  const fetchRetentions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await retentionsService.getRetentions();
      const data = response?.data ?? response;
      console.log('Datos recibidos del backend:', data);
      const transformedData = transformRetentionData(data);
      setRetentions(transformedData);
    } catch (err) {
      console.error('Error fetching retentions:', err);
      setError('Error al cargar las retenciones. Por favor, intente nuevamente.');
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