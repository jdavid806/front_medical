import { useState } from "react";
import ProductService from "../../../../services/api/classes/productService.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useActiveFixed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeFixedAssets, setActiveFixedAssets] = useState([]);
  const getActiveFixed = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      console.log("+++++++++++");
      const service = new ProductService();
      console.log("---------------", service);
      const response = await service.getProductsServicesActiveFixed();
      console.log("response", response);
      const data = response?.data || response || [];
      setActiveFixedAssets(data);
      setSuccess(true);
      return data; // Retornamos los datos
    } catch (err) {
      setError(err);
      ErrorHandler.generic(err);
      return []; // Retornamos array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };
  return {
    getActiveFixed,
    loading,
    error,
    success,
    activeFixedAssets
  };
};