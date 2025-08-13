import { useState, useEffect } from "react";
import { ErrorHandler } from "../../../services/errorHandler";
import { inventoryService } from "../../../services/api";

export const useProductInventoryOnlyDeposits = (type: string) => {
  const [productInventory, setProductInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductInventoryOnlyDeposits = async () => {
    setLoading(true);
    let data: any[] = [];
    try {
        console.log("type:", type);
      switch (type) {
        case "supplies":
          data = await inventoryService.getDepositsInventoriesOnlyDeposits({productType: "Insumos"});
          break;
        case "inventariables":
          data = await inventoryService.getDepositsInventoriesOnlyDeposits({productType: "Inventariable"});
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
    loading,
  };
};
