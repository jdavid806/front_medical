import { useEffect } from "react";
import { useState } from "react";
import { ProductTypeService } from "../../../services/api/classes/productTypeService.js";
export const useProductTypes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchProductTypes() {
    setLoading(true);
    const service = new ProductTypeService();
    const response = await service.getAll();
    setProductTypes(response.data);
    setLoading(false);
  }
  useEffect(() => {
    fetchProductTypes();
  }, []);
  return {
    productTypes,
    loading
  };
};