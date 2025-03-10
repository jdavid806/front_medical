import { useState } from 'react';
import { examCategoryService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useExamCategoryUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateExamCategory = async (id, data) => {
    setLoading(true);
    try {
      await examCategoryService.update(id, data);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateExamCategory,
    loading
  };
};