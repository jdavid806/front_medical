import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { categoryProductsService } from "../../../../services/api";

export const useCategory = () => {
  const [category, setCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCategoriesHook = async (id) => {
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
    fetchCategoriesHook,
  };
};
