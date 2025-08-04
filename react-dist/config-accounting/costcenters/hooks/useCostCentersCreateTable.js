import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { costCenterService } from "../../../../services/api/index.js";
export const useCostCentersCreateTable = () => {
  const [loading, setLoading] = useState(false);
  const createCostCenter = async data => {
    setLoading(true);
    try {
      const response = await costCenterService.storeCostCenter(data);
      SwalManager.success("Centro de costo creado exitosamente");
      return response;
    } catch (error) {
      console.error("Error creating cost center:", error);
      ErrorHandler.getErrorMessage(error);
      SwalManager.error("Error al crear centro de costo");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createCostCenter
  };
};