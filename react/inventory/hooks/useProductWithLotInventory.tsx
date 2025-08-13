import { useState, useEffect } from "react";
import { ErrorHandler } from "../../../services/errorHandler";
import { inventoryService } from "../../../services/api";

export const useProductWithLotInventory = (type: string) => {
  const [productInventory, setProductInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductWithLotInventory = async () => {
    setLoading(true);
    let data: any[] = [];
    try {
        console.log("type:", type);
      switch (type) {
        case "medications":
          data = await inventoryService.getDepositsInventories({productType: "Medicamentos"});
          break;
        case "vaccines":
          data = await inventoryService.getDepositsInventories({productType: "Vacunas"});
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
    loading,
  };
};
