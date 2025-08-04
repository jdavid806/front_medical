import { useState } from "react";
import { categoryProductsService } from "../../../../services/api/index.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useCategory = () => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchCategoriesHook = async id => {
    try {
      const data = await categoryProductsService.get(id);
      setCategory(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    category,
    setCategory,
    fetchCategoriesHook
  };
};