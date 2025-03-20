import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useCashControlCreate = () => {
  const [loading, setLoading] = useState(false);
  const createCashControl = async data => {
    setLoading(true);
    try {
      // await cashControlService.create(cashControlData)
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createCashControl
  };
};