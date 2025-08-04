import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { costCenterService } from "../../../../services/api/index.js";
export const useCostCentersByIdConfigTable = () => {
  const [costCenter, setCostCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchCostCenterById = async id => {
    setLoading(true);
    try {
      const data = await costCenterService.getCostCenterById(id);
      setCostCenter(data);
      return data;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    costCenter,
    setCostCenter,
    fetchCostCenterById,
    loading
  };
};