import { useState } from "react";
import { taxesService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useTaxConfigDelete = () => {
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
      console.error("Error deleting tax:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al eliminar el impuesto");
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