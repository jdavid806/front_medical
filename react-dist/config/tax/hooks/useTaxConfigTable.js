import { useState, useEffect } from 'react';
import { taxesService } from "../../../../services/api/index.js";
export const useTaxConfigTable = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchTaxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taxesService.getTaxes();
      console.log(data, "datosTaxx");
      setTaxes(data);
    } catch (err) {
      console.error('Error fetching taxes:', err);
      setError('Error al cargar los impuestos');
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