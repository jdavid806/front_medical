import { useState } from "react";
import { useInventory } from "../hooks/useInventory.js";
import { useProductTypes } from "../../product-types/hooks/useProductTypes.js";
const PRODUCT_TYPE_MAP = {
  '1': 'medications',
  '2': 'supplies',
  '3': 'vaccines',
  '4': 'services'
};
export const useProductLoader = () => {
  const {
    getSupplies,
    getMedications,
    getVaccines,
    getServices
  } = useInventory();
  const {
    productTypes: rawProductTypes,
    loading: loadingProductTypes
  } = useProductTypes();
  const [products, setProducts] = useState([]);
  const [productsArray, setProductsArray] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const loadProductsByType = async typeId => {
    if (!typeId) return;
    try {
      setLoadingInventory(true);
      const endpointType = PRODUCT_TYPE_MAP[typeId];
      let response;
      switch (endpointType) {
        case 'supplies':
          response = await getSupplies();
          break;
        case 'medications':
          response = await getMedications();
          break;
        case 'vaccines':
          response = await getVaccines();
          break;
        case 'services':
          response = await getServices();
          break;
        default:
          response = [];
      }
      const formattedProducts = response.map(item => ({
        id: item.id,
        label: item.name,
        value: item.id,
        price: item.sale_price || 0,
        ...item
      }));
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoadingInventory(false);
    }
  };
  const handleTypeChange = (rowId, value) => {
    const typeId = value?.id || value;
    if (!typeId) return;
    setProductsArray(prev => prev.map(p => p.id === rowId ? {
      ...p,
      typeProduct: typeId,
      product: null,
      price: 0,
      description: ""
    } : p));
    loadProductsByType(typeId);
  };
  const handleProductChange = (id, field, value) => {
    setProductsArray(prevProducts => prevProducts.map(product => product.id === id ? {
      ...product,
      [field]: value
    } : product));
  };
  const addProduct = () => {
    setProductsArray([...productsArray, {
      id: generateId(),
      typeProduct: null,
      product: null,
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      iva: null,
      withholdingtax: null
    }]);
  };
  const removeProduct = id => {
    if (productsArray.length > 1) {
      setProductsArray(productsArray.filter(product => product.id !== id));
    }
  };
  const generateId = () => Math.random().toString(36).substr(2, 9);
  return {
    products,
    productsArray,
    loadingInventory,
    loadingProductTypes,
    productTypes: rawProductTypes,
    handleProductChange,
    handleTypeChange,
    addProduct,
    removeProduct,
    setProductsArray
  };
};