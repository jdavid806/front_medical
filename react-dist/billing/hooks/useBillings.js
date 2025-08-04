import { useState } from 'react';
import { billingService } from "../../../services/api/index.js";
export const useBillings = () => {
  const [billings, setBillings] = useState([]);
  const fetchBillings = async () => {
    try {
      const data = await billingService.getBillings();
      setBillings(data);
      return data;
    } catch (error) {
      console.error('Error fetching billing:', error);
    }
  };
  return {
    billings,
    fetchBillings
  };
};