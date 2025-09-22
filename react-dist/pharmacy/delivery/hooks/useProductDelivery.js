import { useState } from "react";
import { suppliesService } from "../../../../services/api/index.js";
export const useProductDelivery = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(false);
  const getDelivery = async deliveryId => {
    setLoading(true);
    try {
      const data = await suppliesService.getSuppliesById(deliveryId);
      setDelivery(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    delivery,
    loading,
    getDelivery
  };
};