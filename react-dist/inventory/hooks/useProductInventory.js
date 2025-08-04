import { useState, useEffect } from "react";
import { inventoryService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useProductInventory = type => {
  const [productInventory, setProductInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchProductInventory = async () => {
    setLoading(true);
    let data = [];
    try {
      console.log("type:", type);
      switch (type) {
        case "medications":
          data = await inventoryService.getMedications();
          break;
        case "vaccines":
          data = await inventoryService.getVaccines();
          break;
        case "supplies":
          data = await inventoryService.getSupplies();
          break;
        default:
          break;
      }
      setProductInventory(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductInventory();
  }, []);
  return {
    productInventory,
    fetchProductInventory,
    loading
  };
};