import { useState } from 'react';
import { thirdPartyService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useThirdPartyCreate = () => {
  const [loading, setLoading] = useState(false);
  const createThirdParty = async userData => {
    setLoading(true);
    try {
      const response = await thirdPartyService.create(userData);
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
    createThirdParty
  };
};