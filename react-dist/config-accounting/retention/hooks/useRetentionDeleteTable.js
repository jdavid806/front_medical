import { useState } from "react";
import { retentionsService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useRetentionDeleteTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteRetention = async id => {
    setLoading(true);
    setError(null);
    try {
      await retentionsService.deleteRetention(id);
      SwalManager.success("Retención eliminada correctamente");
      return true;
    } catch (error) {
      console.error('Error eliminar retention:', error);
      ErrorHandler.generic(error);
      SwalManager.error("Error al eliminar retención");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    deleteRetention
  };
};