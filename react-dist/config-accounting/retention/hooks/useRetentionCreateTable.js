import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { retentionsService } from "../../../../services/api/index.js";
export const useRetentionCreateTable = () => {
  const [loading, setLoading] = useState(false);
  const createRetention = async data => {
    setLoading(true);
    try {
      const response = await retentionsService.storeRetention(data);
      SwalManager.success("Retención creada exitosamente");
      return response;
    } catch (error) {
      console.error("Error creating retention:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al crear retención");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createRetention
  };
};