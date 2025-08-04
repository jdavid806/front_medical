import { useState } from "react";
import { comissionConfig } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useCommission = () => {
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchCommissionsHook = async id => {
    try {
      const data = await comissionConfig.comissionConfigGetById(id);
      setCommission(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    commission,
    setCommission,
    fetchCommissionsHook,
    loading
  };
};