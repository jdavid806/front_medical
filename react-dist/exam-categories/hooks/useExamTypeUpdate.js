import { useState } from 'react';
import { examTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useExamTypeUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateExamType = async (id, data) => {
    setLoading(true);
    try {
      await examTypeService.update(id, data);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateExamType,
    loading
  };
};