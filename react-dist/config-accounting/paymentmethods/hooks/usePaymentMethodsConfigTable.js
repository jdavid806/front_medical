import { useState, useEffect, useCallback } from 'react';
import { paymentMethodService } from "../../../../services/api/index.js";
export const usePaymentMethodsConfigTable = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentMethodService.getPaymentMethods();
      setPaymentMethods(data);
    } catch (err) {
      setError('Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  }, []);
  const refreshPaymentMethods = useCallback(async () => {
    console.log("🔄 Manual refresh triggered");
    await fetchPaymentMethods();
  }, [fetchPaymentMethods]);
  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);
  return {
    paymentMethods,
    loading,
    error,
    refreshPaymentMethods
  };
};