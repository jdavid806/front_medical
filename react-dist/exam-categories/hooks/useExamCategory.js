import { useState } from "react";
import { examCategoryService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useExamCategory = () => {
  const [examCategory, setExamCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchExamCategory = async id => {
    try {
      const data = await examCategoryService.get(id);
      setExamCategory(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    examCategory,
    setExamCategory,
    fetchExamCategory,
    loading
  };
};