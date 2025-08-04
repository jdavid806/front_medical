import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { costCenterService } from "../../../../services/api/index.js";
export const useCostCentersDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const deleteCostCenter = async id => {
    setLoading(true);
    setError(null);
    try {
      await costCenterService.deleteCostCenter(id);
      SwalManager.success("Centro de costo eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error al eliminar centro de costo:", error);
      SwalManager.error("Error al crear centro de costo");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    error,
    deleteCostCenter
  };
};