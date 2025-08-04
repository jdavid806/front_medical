import { useState } from 'react';
import { SwalManager } from "../../../../services/alertManagerImported.js";
import AccountingClosingsService from "../../../../services/api/classes/accountingClosingsService.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useAccountingClosingDelete = () => {
  const [loading, setLoading] = useState(false);
  const deleteAccountingClosing = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        const service = new AccountingClosingsService();
        await service.delete(id);
        confirmed = true;
      });
      return confirmed;
    } catch (err) {
      ErrorHandler.generic(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    deleteAccountingClosing,
    loading
  };
};