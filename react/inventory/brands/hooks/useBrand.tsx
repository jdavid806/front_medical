import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { brandService } from "../../../../services/api";

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
