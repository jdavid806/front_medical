import { useState } from 'react';
import { paymentMethodService } from "../../../../services/api/index.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const usePaymentMethodUpdate = () => {
  const [loading, setLoading] = useState(false);
  const updatePaymentMethod = async (id, data) => {
    setLoading(true);
    try {
      const response = await paymentMethodService.updatePaymentMethod(id, data);
      console.log('responseUpdate', response);
      return response;
    } catch (error) {
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    updatePaymentMethod,
    loading
  };
};