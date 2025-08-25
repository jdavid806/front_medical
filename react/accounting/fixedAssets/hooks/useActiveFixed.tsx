import { useState } from "react";
import ProductService from "../../../../services/api/classes/productService";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useActiveFixed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeFixedAssets, setActiveFixedAssets] = useState<any[]>([]);

  const getActiveFixed = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {

      console.log("+++++++++++");
      const service = new ProductService();
      console.log("---------------",service);
      const response = await service.getProductsServicesActiveFixed();
      console.log("response", response); 
      const data = response?.data || response || [];
      setActiveFixedAssets(data);
      setSuccess(true);
      return data; // Retornamos los datos
    } catch (err) {
      setError(err as Error);
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
    activeFixedAssets,
  };
};
