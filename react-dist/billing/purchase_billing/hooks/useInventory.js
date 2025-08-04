import { ErrorHandler } from "../../../../services/errorHandler.js";
import { inventoryService } from "../../../../services/api/index.js";
import { useState } from "react";

// Cache para almacenar productos por tipo
const productCache = {};
export const useInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentType, setCurrentType] = useState(null);
  const [error, setError] = useState(null);
  const formatProducts = (products, type) => {
    if (!products || !Array.isArray(products)) return [];
    return products.map(item => ({
      id: item.id,
      label: item.name || item.label || `Producto ${item.id}`,
      value: item.id,
      price: item.sale_price || item.price || 0,
      type: type,
      ...item
    }));
  };
  const fetchProducts = async (type, fetchFunction) => {
    if (productCache[type]) {
      setProducts(productCache[type]);
      setCurrentType(type);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction();

      // Asegurarse de que response.data existe y es un array
      const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const formattedProducts = formatProducts(data, type);

      // Almacenar en caché
      productCache[type] = formattedProducts;
      setProducts(formattedProducts);
      setCurrentType(type);
    } catch (err) {
      setError(err);
      ErrorHandler.generic(err);
      // Limpiar productos si hay error
      setProducts([]);
      setCurrentType(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getSupplies = async () => {
    try {
      await fetchProducts("supplies", async () => {
        const response = await inventoryService.getSupplies();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching supplies:", err);
    }
  };
  const getMedications = async () => {
    try {
      await fetchProducts("medications", async () => {
        const response = await inventoryService.getMedications();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching medications:", err);
    }
  };
  const getVaccines = async () => {
    try {
      await fetchProducts("vaccines", async () => {
        const response = await inventoryService.getVaccines();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching vaccines:", err);
    }
  };
  const getServices = async () => {
    try {
      await fetchProducts("services", async () => {
        const response = await inventoryService.getServices();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };
  const getActivosFijos = async () => {
    try {
      await fetchProducts("activos-fijos", async () => {
        const response = await inventoryService.getActivosFijos();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching activos fijos:", err);
    }
  };
  const getInventariables = async () => {
    try {
      await fetchProducts("inventariables", async () => {
        const response = await inventoryService.getInventariables();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching inventariables:", err);
    }
  };
  const getByType = async type => {
    // No hacer nada si ya estamos mostrando este tipo
    if (currentType === type) return;
    switch (type) {
      case "supplies":
        await getSupplies();
        break;
      case "medications":
        await getMedications();
        break;
      case "vaccines":
        await getVaccines();
        break;
      case "services":
        await getServices();
        break;
      case "activos-fijos":
        await getActivosFijos();
        break;
      case "inventariables":
        await getInventariables();
        break;
      default:
        setProducts([]);
        setCurrentType(null);
        break;
    }
  };

  // Función para limpiar la caché si es necesario
  const clearCache = type => {
    if (type) {
      delete productCache[type];
    } else {
      Object.keys(productCache).forEach(key => delete productCache[key]);
    }
  };
  return {
    getSupplies,
    getMedications,
    getVaccines,
    getServices,
    getByType,
    products,
    loading,
    error,
    currentType,
    clearCache
  };
};