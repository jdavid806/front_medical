import { useState } from 'react';
import { examResultService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useExamResultCreate = () => {
  const [loading, setLoading] = useState(false);
  const createExamResult = async examResultData => {
    setLoading(true);
    try {
      await examResultService.create(examResultData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createExamResult
  };
};