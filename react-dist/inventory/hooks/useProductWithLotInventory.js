import { useState, useEffect } from "react";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { inventoryService } from "../../../services/api/index.js";
export const useProductWithLotInventory = type => {
  const [productInventory, setProductInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchProductWithLotInventory = async () => {
    setLoading(true);
    let data = [];
    try {
      console.log("type:", type);
      switch (type) {
        case "medications":
          data = await inventoryService.getDepositsInventories({
            productType: "Medicamentos"
          });
          break;
        case "vaccines":
          data = await inventoryService.getDepositsInventories({
            productType: "Vacunas"
          });
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
    fetchProductWithLotInventory();
  }, []);
  return {
    productInventory,
    fetchProductWithLotInventory,
    loading
  };
};