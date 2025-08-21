import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { entitiesService } from "../../../../services/api/index.js";
export const useEntitieConfigCreate = () => {
  const [loading, setLoading] = useState(false);
  const createEntities = async data => {
    setLoading(true);
    try {
      const response = await entitiesService.storeEntity(data);
      SwalManager.success("Impuesto creado exitosamente");
      return response;
    } catch (error) {
      console.error("Error creating tax:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al crear el impuesto");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createEntities
  };
};