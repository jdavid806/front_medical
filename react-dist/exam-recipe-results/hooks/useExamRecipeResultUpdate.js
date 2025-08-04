import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { examRecipeResultService } from "../../../services/api/index.js";
export const useExamRecipeResultUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateExamRecipeResult = async (id, data) => {
    setLoading(true);
    try {
      const response = await examRecipeResultService.update(id, data);
      SwalManager.success();
      return response;
    } catch (error) {
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    updateExamRecipeResult,
    loading
  };
};