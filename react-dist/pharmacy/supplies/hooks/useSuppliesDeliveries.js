import { useEffect, useState } from "react";
import { suppliesService } from "../../../../services/api/index.js";
export const useSuppliesDeliveries = () => {
  const [suppliesDeliveries, setSuppliesDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchSuppliesDeliveries = async ({
    search,
    status
  }) => {
    setLoading(true);
    try {
      const response = await suppliesService.filterSupplies({
        search,
        status
      });
      setSuppliesDeliveries(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuppliesDeliveries({});
  }, []);
  return {
    suppliesDeliveries,
    fetchSuppliesDeliveries,
    loading
  };
};