import { useState } from "react";
import AccountingClosingsService from "../../../../services/api/classes/accountingClosingsService.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useAccountingClosing = () => {
  const [accountingClosing, setAccountingClosing] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchAccountingClosing = async id => {
    try {
      const service = new AccountingClosingsService();
      const data = await service.get(id);
      setAccountingClosing(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    accountingClosing,
    setAccountingClosing,
    fetchAccountingClosing,
    loading
  };
};