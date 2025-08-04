import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { productService } from "../../../../services/api/index.js";
export const usePriceConfigById = () => {
  const [priceById, setPriceById] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchPriceById = async id => {
    try {
      const data = await productService.getProductById(id);
      setPriceById(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    priceById,
    setPriceById,
    fetchPriceById,
    loading
  };
};