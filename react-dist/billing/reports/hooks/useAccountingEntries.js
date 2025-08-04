import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import BillingReportService from "../../../../services/api/classes/billingReportService.js";
export const useAccountingEntries = () => {
  const baseData = {
    data: []
  };
  const [accountingEntries, setAccountingEntries] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchAccountingEntries = async () => {
    try {
      const service = new BillingReportService();
      const data = await service.getAccountingEntries();
      if (!data.data) {
        setAccountingEntries(baseData);
      }
      setAccountingEntries(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAccountingEntries();
  }, []);
  return {
    accountingEntries,
    fetchAccountingEntries,
    loading
  };
};