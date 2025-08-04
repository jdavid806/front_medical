import { useState, useEffect } from 'react';
import { productService } from "../../../../services/api/index.js";
export const usePricesConfigTable = () => {
  const [products, setProduct] = useState([]);
  const fetchProducts = async () => {
    try {
      const data = await productService.getProductsServices();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching users:', error);
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