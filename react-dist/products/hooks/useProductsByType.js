import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { inventoryService } from "../../../services/api/index.js";
export const useProductsByType = () => {
  const [productsByType, setProductsByType] = useState([]);
  const [loading, setLoading] = useState(true);
  const getPromise = type => {
    switch (type) {
      case "Medicamentos":
        return inventoryService.getMedications();
      case "Insumos":
        return inventoryService.getSupplies();
      case "Vacunas":
        return inventoryService.getVaccines();
      case "Servicios":
        return inventoryService.getServices();
      default:
        return null;
    }
  };
  const fetchProductsByType = async type => {
    setLoading(true);
    try {
      const promise = getPromise(type);
      if (!promise) {
        return;
      }
      const data = await promise;
      const mappedData = data.map(item => {
        return {
          ...item,
          label: item.name
        };
      });
      setProductsByType(mappedData);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    productsByType,
    fetchProductsByType,
    loading
  };
};