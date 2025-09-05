import { useState } from "react";
import { accountingAccountsService } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useAccountingAccountCreate = () => {
  const [loading, setLoading] = useState(false);
  const createAccount = async account => {
    setLoading(true);
    try {
      const response = await accountingAccountsService.createAccount(account);
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
    createAccount
  };
};