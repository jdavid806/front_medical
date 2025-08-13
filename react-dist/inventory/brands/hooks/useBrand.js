import { useState } from "react";
import { brandService } from "../../../../services/api.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useBrand = () => {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchBrandsHook = async id => {
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
    fetchBrandsHook
  };
};