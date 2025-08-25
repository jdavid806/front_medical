import { useState } from 'react';
import { productService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const usePriceConfigDelete = () => {
  const [loading, setLoading] = useState(false);
  const deleteProduct = async id => {
    setLoading(true);
    try {
      const confirmed = await SwalManager.confirmDelete(async () => {
        await productService.deleteProductById(id);
        SwalManager.success();
      });
      return confirmed;
    } catch (error) {
      ErrorHandler.generic(error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    deleteProduct,
    loading
  };
};