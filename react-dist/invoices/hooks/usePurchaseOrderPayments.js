import { useState } from "react";
import { cashRecipes } from "../../../services/api/index.js";
export const usePurchaseOrderPayments = () => {
  const [purchaseOrderPayments, setPurchaseOrderPayments] = useState({
    data: [],
    message: '',
    status: 0
  });
  async function fetchPurchaseOrderPayments({
    purchaseOrderId
  }) {
    try {
      const data = await cashRecipes.getAdvancePaymentsOfPurchaseOrder(purchaseOrderId);
      setPurchaseOrderPayments(data);
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  return {
    purchaseOrderPayments,
    fetchPurchaseOrderPayments
  };
};