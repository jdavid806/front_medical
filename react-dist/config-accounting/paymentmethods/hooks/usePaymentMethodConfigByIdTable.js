import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { paymentMethodService } from "../../../../services/api/index.js";
export const usePaymentMethodById = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchPaymentMethodById = async id => {
    setLoading(true);
    try {
      const data = await paymentMethodService.getPaymentMethodById(id);
      setPaymentMethod(data);
      return data;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    paymentMethod,
    setPaymentMethod,
    fetchPaymentMethodById,
    loading
  };
};