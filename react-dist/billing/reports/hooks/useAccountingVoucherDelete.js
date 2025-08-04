import { useState } from 'react';
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { accountingVouchersService } from "../../../../services/api/index.js";
export const useAccountingVoucherDelete = () => {
  const [loading, setLoading] = useState(false);
  const deleteAccountingVoucher = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await accountingVouchersService.delete(id);
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
    deleteAccountingVoucher,
    loading
  };
};