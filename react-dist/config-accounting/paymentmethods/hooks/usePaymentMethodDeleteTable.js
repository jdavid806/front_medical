import { useState } from "react";
import { paymentMethodService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const usePaymentMethodDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deletePaymentMethod = async id => {
    setLoading(true);
    setError(null);
    try {
      await paymentMethodService.deletePaymentMethod(id);
      SwalManager.success("Método de pago eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error delete payment method:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al Eliminar método de pago");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    deletePaymentMethod
  };
};