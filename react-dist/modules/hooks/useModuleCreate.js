import { useState } from 'react';
import { moduleService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useModuleCreate = () => {
  const [loading, setLoading] = useState(false);
  const createModule = async moduleData => {
    setLoading(true);
    try {
      await moduleService.create(moduleData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createModule
  };
};