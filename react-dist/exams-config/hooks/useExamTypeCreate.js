import { useState } from 'react';
import { examTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useExamTypeCreate = () => {
  const [loading, setLoading] = useState(false);
  const createExamType = async examTypeData => {
    setLoading(true);
    try {
      await examTypeService.create(examTypeData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createExamType
  };
};