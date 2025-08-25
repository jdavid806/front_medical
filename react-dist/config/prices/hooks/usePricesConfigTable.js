import { useState, useEffect } from 'react';
import { productService } from "../../../../services/api/index.js";
export const usePricesConfigTable = () => {
  const [products, setProduct] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await productService.getProductsServices();
      const data = response.data || response;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return {
    products,
    fetchProducts
  };
};