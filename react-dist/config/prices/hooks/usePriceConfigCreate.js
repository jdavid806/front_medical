import { useState } from 'react';
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { productService } from "../../../../services/api/index.js";
export const usePriceConfigCreate = () => {
  const [loading, setLoading] = useState(false);
  const createProduct = async data => {
    setLoading(true);
    try {
      const response = await productService.storeProductEntity(data);
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
    createProduct
  };
};