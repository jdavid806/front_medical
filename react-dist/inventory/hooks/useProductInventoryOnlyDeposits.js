import { useState, useEffect } from "react";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { inventoryService } from "../../../services/api/index.js";
export const useProductInventoryOnlyDeposits = type => {
  const [productInventory, setProductInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchProductInventoryOnlyDeposits = async () => {
    setLoading(true);
    let data = [];
    try {
      console.log("type:", type);
      switch (type) {
        case "supplies":
          data = await inventoryService.getDepositsInventoriesOnlyDeposits({
            productType: "Insumos"
          });
          break;
        case "inventariables":
          data = await inventoryService.getDepositsInventoriesOnlyDeposits({
            productType: "Inventariable"
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
    fetchProductInventoryOnlyDeposits();
  }, []);
  return {
    productInventory,
    fetchProductInventoryOnlyDeposits,
    loading
  };
};