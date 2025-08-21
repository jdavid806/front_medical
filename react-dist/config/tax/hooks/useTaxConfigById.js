import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { taxesService } from "../../../../services/api/index.js";
export const useTaxConfigById = () => {
  const [taxById, setTaxById] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchTaxById = async id => {
    setLoading(true);
    try {
      const data = await taxesService.getTaxById(id);
      setTaxById(data);
      return data;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    taxById,
    setTaxById,
    fetchTaxById,
    loading
  };
};