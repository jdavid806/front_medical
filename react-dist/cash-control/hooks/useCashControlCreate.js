import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { cashControlService } from "../../../services/api/index.js";
import { getJWTPayload } from "../../../services/utilidades.js";
export const useCashControlCreate = () => {
  const [loading, setLoading] = useState(false);
  const createCashControl = async data => {
    setLoading(true);
    try {
      const finalData = {
        ...data,
        who_validate: getJWTPayload().sub.toString(),
        payments: data.payments || []
      };
      await cashControlService.create(finalData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createCashControl
  };
};