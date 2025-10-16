import { useState } from "react";
import { farmaciaService } from "../../../services/api/index.js";
export const useProductsWithAvailableStock = () => {
  const [productsWithAvailableStock, setProductsWithAvailableStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchProductsWithAvailableStock = async (productTypeNames, inventoryType) => {
    setLoading(true);
    try {
      const response = await farmaciaService.getProductsWithAvailableStock(productTypeNames, inventoryType);
      const products = response.data.map(product => {
        const concentration = product.attributes.concentration ?? "";
        return {
          id: product.id,
          name: concentration ? `${product.attributes.name} - ${concentration} | Stock: ${product.attributes.product_stock}` : `${product.attributes.name} | Stock: ${product.attributes.product_stock}`,
          product_stock: product.attributes.product_stock,
          pharmacy_product_stock: product.attributes.pharmacy_product_stock,
          sale_price: product.attributes.sale_price
        };
      });
      setProductsWithAvailableStock(products);
    } catch (error) {
      console.error("Error fetching products with available stock:", error);
    } finally {
      setLoading(false);
    }
  };
  return {
    productsWithAvailableStock,
    loading,
    fetchProductsWithAvailableStock
  };
};