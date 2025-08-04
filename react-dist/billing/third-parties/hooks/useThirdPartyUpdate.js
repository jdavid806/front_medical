import { useState } from 'react';
import { thirdPartyService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useThirdPartyUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateThirdParty = async (id, data) => {
    setLoading(true);
    try {
      const response = await thirdPartyService.update(id, data);
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
    updateThirdParty,
    loading
  };
};