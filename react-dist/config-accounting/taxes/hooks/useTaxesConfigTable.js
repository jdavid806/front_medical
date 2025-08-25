import { useState, useEffect } from 'react';
import { taxesService } from "../../../../services/api/index.js";
export const useTaxesConfigTable = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const transformTaxData = data => {
    try {
      if (!Array.isArray(data)) {
        console.error('Expected array but received:', data);
        return [];
      }
      return data.map(tax => {
        // Extraer el objeto tax_charge si existe
        const taxData = tax.tax_charge || tax;
        return {
          id: taxData?.id?.toString() || '',
          name: taxData?.name || '',
          percentage: taxData?.percentage || 0,
          account: taxData?.accounting_account_id ? {
            id: taxData.accounting_account_id.toString(),
            name: taxData.account_name || `Cuenta ${taxData.accounting_account_id.toString()}`
          } : null,
          returnAccount: taxData?.accounting_account_reverse_id ? {
            id: taxData.accounting_account_reverse_id.toString(),
            name: taxData.account_name || `Cuenta ${taxData.accounting_account_reverse_id}`
          } : null,
          description: taxData?.description || 'Sin descripción'
        };
      });
    } catch (error) {
      console.error('Error transforming tax data:', error);
      return [];
    }
  };
  const fetchTaxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taxesService.getTaxes();
      const data = response?.data ?? response;
      console.log('Datos recibidos del backend:', data);
      const transformedData = transformTaxData(data);
      setTaxes(transformedData);
    } catch (err) {
      console.error('Error fetching taxes:', err);
      setError('Error al cargar los impuestos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTaxes();
  }, []);
  return {
    taxes,
    loading,
    error,
    refreshTaxes: fetchTaxes
  };
};