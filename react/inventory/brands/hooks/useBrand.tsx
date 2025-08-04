import { useState } from "react";
import { brandService } from "../../../../services/api";
import { ErrorHandler } from "../../../../services/errorHandler";

export const useBrand = () => {
  const [brand, setBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBrandsHook = async (id) => {
    try {
      const data = await brandService.get(id);
      setBrand(data.data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    brand,
    setBrand,
    fetchBrandsHook,
  };
};
