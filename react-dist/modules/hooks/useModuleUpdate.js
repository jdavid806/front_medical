import { useState } from 'react';
import { moduleService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useModuleUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateModule = async (id, data) => {
    setLoading(true);
    try {
      await moduleService.update(id, data);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateModule,
    loading
  };
};