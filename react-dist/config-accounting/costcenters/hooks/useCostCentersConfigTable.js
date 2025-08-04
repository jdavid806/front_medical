import { useState, useEffect } from 'react';
import { costCenterService } from "../../../../services/api/index.js";
export const useCostCentersConfigTable = () => {
  const [costCenters, setCostCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const transformCostCenterData = data => {
    try {
      if (!Array.isArray(data)) {
        console.error('Expected array but received:', data);
        return [];
      }
      return data.map(costCenter => {
        return {
          id: costCenter?.id?.toString() || '',
          name: costCenter?.name || '',
          code: costCenter?.code || '',
          description: costCenter?.description || 'Sin descripción'
        };
      });
    } catch (error) {
      console.error('Error transforming cost center data:', error);
      return [];
    }
  };
  const fetchCostCenters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await costCenterService.getCostCenterAll();
      const data = response?.data ?? response;
      console.log('Datos recibidos del backend:', data);
      const transformedData = transformCostCenterData(data);
      setCostCenters(transformedData);
    } catch (err) {
      console.error('Error fetching cost centers:', err);
      setError('Error al cargar los centros de costo. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCostCenters();
  }, []);
  return {
    costCenters,
    loading,
    error,
    refreshCostCenters: fetchCostCenters
  };
};