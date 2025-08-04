import { useState } from 'react';
import AccountingClosingsService from "../../../../services/api/classes/accountingClosingsService.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useAccountingClosingsUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateAccountingClosing = async (id, data) => {
    setLoading(true);
    try {
      const service = new AccountingClosingsService();
      const response = await service.update(id, data);
      SwalManager.success();
      return response;
    } catch (error) {
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    updateAccountingClosing,
    loading
  };
};