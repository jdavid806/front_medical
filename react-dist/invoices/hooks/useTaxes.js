import { useEffect } from "react";
import { taxesService } from "../../../services/api/index.js";
import { useState } from "react";
export const useTaxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchTaxes() {
    const taxes = await taxesService.getTaxes();
    setTaxes(taxes.data);
  }
  useEffect(() => {
    fetchTaxes();
  }, []);
  return {
    taxes,
    loading,
    fetchTaxes
  };
};