import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { entitiesService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useEntitiesConfigUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateEntities = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await entitiesService.updateEntity(id, data);
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
    updateEntities,
    loading,
    error
  };
};