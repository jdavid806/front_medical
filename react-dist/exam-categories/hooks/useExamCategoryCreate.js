import { useState } from 'react';
import { examCategoryService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useExamCategoryCreate = () => {
  const [loading, setLoading] = useState(false);
  const createExamCategory = async examCategoryData => {
    setLoading(true);
    try {
      await examCategoryService.create(examCategoryData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createExamCategory
  };
};