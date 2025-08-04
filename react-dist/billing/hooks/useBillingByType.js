import { useState } from 'react';
import { billingService } from "../../../services/api/index.js";
export const useBillingByType = () => {
  const [billing, setBilling] = useState(null);
  const fetchBillingByType = async type => {
    try {
      const data = await billingService.getBillingByType(type);
      setBilling(data);
      return data;
    } catch (error) {
      console.error('Error fetching billing:', error);
    }
  };
  return {
    billing,
    fetchBillingByType
  };
};