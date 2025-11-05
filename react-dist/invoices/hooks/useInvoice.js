import { useState } from "react";
import { invoiceService } from "../../../services/api/index.js";
export const useInvoice = () => {
  const [invoice, setInvoice] = useState(null);
  const fetchInvoice = async invoiceId => {
    try {
      const response = await invoiceService.get(invoiceId);
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };
  return {
    invoice,
    fetchInvoice
  };
};