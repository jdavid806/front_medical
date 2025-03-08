import { useState } from 'react';
import { examCategoryService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';
export const useExamCategoryDelete = () => {
  const [loading, setLoading] = useState(false);
  const deleteExamCategory = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await examCategoryService.delete(id);
        confirmed = true;
      });
      return confirmed;
    } catch (err) {
      ErrorHandler.generic(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    deleteExamCategory,
    loading
  };
};