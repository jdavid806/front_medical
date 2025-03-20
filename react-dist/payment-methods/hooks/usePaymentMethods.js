import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { paymentMethodService } from "../../../services/api/index.js";
export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPaymentMethods = async () => {
    try {
      let data = await paymentMethodService.getAll();
      setPaymentMethods(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  return {
    paymentMethods,
    setPaymentMethods,
    fetchPaymentMethods,
    loading
  };
};