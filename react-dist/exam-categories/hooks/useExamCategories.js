import { useState, useEffect } from 'react';
import { examCategoryService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useExamCategories = () => {
  const [examCategories, setExamCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchExamCategories = async () => {
    try {
      let data = await examCategoryService.getAll();
      data = data.filter(item => item.is_active);
      setExamCategories(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExamCategories();
  }, []);
  return {
    examCategories,
    fetchExamCategories,
    loading
  };
};