import { useState, useEffect } from 'react';
import { cashControlService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useCashControlReport = () => {
  const [cashControlReportItems, setCashControlReportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCashControlReport = async () => {
    try {
      const data = await cashControlService.getAll();
      setCashControlReportItems(data.data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCashControlReport();
  }, []);
  return {
    cashControlReportItems,
    fetchCashControlReport,
    loading
  };
};