import { useState } from 'react';
import { productService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const usePriceConfigUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateProduct = async (id, data) => {
    setLoading(true);
    try {
      const response = await productService.updateProduct(id, data);
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
    updateProduct,
    loading
  };
};