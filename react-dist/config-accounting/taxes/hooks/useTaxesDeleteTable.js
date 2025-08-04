import { useState } from "react";
import { taxesService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useTaxesDeleteTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteTax = async id => {
    setLoading(true);
    setError(null);
    try {
      await taxesService.deleteTax(id);
      SwalManager.success("Impuesto eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error delete taxes :", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al Eliminar Impuesto");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    deleteTax
  };
};