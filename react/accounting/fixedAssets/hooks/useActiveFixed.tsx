import { useState } from "react";
import ProductService from "../../../../services/api/classes/productService";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useActiveFixed = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const getActiveFixed = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const service = new ProductService();
      await service.getProductsServicesActiveFixed();
      setSuccess(true);
    } catch (err) {
      setError(err as Error);
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    getActiveFixed,
    loading,
    error,
    success,
  };
};
