import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { paymentMethodService } from "../../../../services/api/index.js";
export const usePaymentMethodCreate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const createPaymentMethod = async data => {
    setLoading(true);
    setError(null);
    try {
      if (!data.method || !data.category) {
        throw new Error("Nombre y categoría son requeridos");
      }
      const response = await paymentMethodService.storePaymentMethod(data);
      SwalManager.success("Método de pago creado exitosamente");
      return response;
    } catch (error) {
      console.error("Error creating payment method:", error);
      ErrorHandler.getErrorMessage(error);
      setError("Error al crear método de pago");
      SwalManager.error("Error al crear método de pago");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    createPaymentMethod
  };
};