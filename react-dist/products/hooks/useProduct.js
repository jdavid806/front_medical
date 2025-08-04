import { useState } from "react";
import { productService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useProduct = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchProduct = async id => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    product,
    fetchProduct,
    loading
  };
};