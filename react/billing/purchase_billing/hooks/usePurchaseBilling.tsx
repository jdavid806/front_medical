import { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import {
  invoiceService,
  depositService,
} from "../../../../services/api/index.js";

export const useInvoicePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState([]);

  const storeInvoice = async (invoiceData) => {
    setLoading(true);
    try {
      const response = await invoiceService.storePurcharseInvoice(invoiceData);
      return response;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAllDeposits = async () => {
    setLoading(true);
    try {
      const response = await depositService.getAllDeposits();
      setDeposits(response.data); 
      return response.data;
    } catch (err) {
      ErrorHandler.generic(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    storeInvoice,
    loading,
    getAllDeposits,
    deposits,
  };
};
