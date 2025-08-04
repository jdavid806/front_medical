import { useState, useEffect } from 'react';
import { paymentMethodService } from "../../../../services/api/index.js"; // Asegúrate de tener este servicio
export const usePaymentMethodsConfigTable = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentMethodService.getPaymentMethods();
      setPaymentMethods(data);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Error al cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  return {
    paymentMethods,
    loading,
    error,
    refreshPaymentMethods: fetchPaymentMethods
  };
};