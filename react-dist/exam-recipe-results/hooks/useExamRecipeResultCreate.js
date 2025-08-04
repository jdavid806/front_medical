import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { examRecipeResultService } from "../../../services/api/index.js";
export const useExamRecipeResultCreate = () => {
  const [loading, setLoading] = useState(false);
  const createExamRecipeResult = async userData => {
    setLoading(true);
    try {
      const response = await examRecipeResultService.create(userData);
      SwalManager.success();
      return response;
    } catch (error) {
      console.log(error);
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createExamRecipeResult
  };
};