import { useState } from "react";
import { moduleService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useModule = () => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchModule = async id => {
    try {
      const data = await moduleService.get(id);
      setModule(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    module,
    fetchModule,
    loading
  };
};