import { useState } from 'react';
import AccountingClosingsService from "../../../../services/api/classes/accountingClosingsService.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useAccountingClosingsCreate = () => {
  const [loading, setLoading] = useState(false);
  const createAccountingClosing = async userData => {
    setLoading(true);
    try {
      const service = new AccountingClosingsService();
      const response = await service.create(userData);
      SwalManager.success();
      return response;
    } catch (error) {
      console.log(error);
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createAccountingClosing
  };
};