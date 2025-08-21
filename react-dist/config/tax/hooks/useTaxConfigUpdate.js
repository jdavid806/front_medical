import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { taxesService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useTaxConfigUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateTax = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taxesService.updateTax(id, data);
      SwalManager.success("Impuesto actualizado correctamente");
      return response;
    } catch (error) {
      console.error("Error updating tax:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al eliminar el impuesto");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    updateTax,
    loading,
    error
  };
};