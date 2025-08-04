import { useState } from 'react';
import { productService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useProductUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateProduct = async (id, data) => {
    setLoading(true);
    try {
      await productService.updateProduct(id, data);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateProduct,
    loading
  };
};