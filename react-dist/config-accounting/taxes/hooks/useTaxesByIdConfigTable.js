import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { taxesService } from "../../../../services/api/index.js";
export const useTaxesByIdConfigTable = () => {
  const [tax, setTax] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchTaxById = async id => {
    setLoading(true);
    try {
      const data = await taxesService.getTaxById(id);
      setTax(data);
      return data;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    tax,
    setTax,
    fetchTaxById,
    loading
  };
};