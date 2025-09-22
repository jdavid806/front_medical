import { ErrorHandler } from "../../../../services/errorHandler.js";
import { inventoryService } from "../../../../services/api/index.js";
import { useState } from "react";
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
    if (loading && currentType === type) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction();
      const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      const formattedProducts = formatProducts(data, type);

      // Almacenar en caché
      productCache[type] = formattedProducts;
      setProducts(formattedProducts);
      setCurrentType(type);
    } catch (err) {
      setError(err);
      ErrorHandler.generic(err);
      setProducts([]);
      setCurrentType(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const refreshProducts = async type => {
    const targetType = type || currentType;
    if (!targetType) return;
    delete productCache[targetType];
    await getByType(targetType, true); // true = forzar recarga
  };
  const getSupplies = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        delete productCache["supplies"];
      }
      await fetchProducts("supplies", async () => {
        const response = await inventoryService.getSupplies();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching supplies:", err);
    }
  };
  const getMedications = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        delete productCache["medications"];
      }
      await fetchProducts("medications", async () => {
        const response = await inventoryService.getMedications();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching medications:", err);
    }
  };
  const getVaccines = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        delete productCache["vaccines"];
      }
      await fetchProducts("vaccines", async () => {
        const response = await inventoryService.getVaccines();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching vaccines:", err);
    }
  };
  const getServices = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        delete productCache["services"];
      }
      await fetchProducts("services", async () => {
        const response = await inventoryService.getServices();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };
  const getActivosFijos = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        delete productCache["activos-fijos"];
      }
      await fetchProducts("activos-fijos", async () => {
        const response = await inventoryService.getActivosFijos();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching activos fijos:", err);
    }
  };
  const getInventariables = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        delete productCache["inventariables"];
      }
      await fetchProducts("inventariables", async () => {
        const response = await inventoryService.getInventariables();
        return response?.data || response;
      });
    } catch (err) {
      console.error("Error fetching inventariables:", err);
    }
  };
  const getByType = async (type, forceRefresh = false) => {
    // No hacer nada si ya estamos mostrando este tipo y no es forzado
    if (currentType === type && !forceRefresh) return;
    switch (type) {
      case "supplies":
        await getSupplies(forceRefresh);
        break;
      case "medications":
        await getMedications(forceRefresh);
        break;
      case "vaccines":
        await getVaccines(forceRefresh);
        break;
      case "services":
        await getServices(forceRefresh);
        break;
      case "activos-fijos":
        await getActivosFijos(forceRefresh);
        break;
      case "inventariables":
        await getInventariables(forceRefresh);
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
    refreshProducts,
    // 🔄 Exportar la nueva función
    products,
    loading,
    error,
    currentType,
    clearCache
  };
};