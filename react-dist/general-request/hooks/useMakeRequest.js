import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { GeneralRequestService } from "../../../services/api/classes/generalRequestService.js";
export const useMakeRequest = () => {
  const [loading, setLoading] = useState(false);
  const makeRequest = async requestData => {
    setLoading(true);
    try {
      const service = new GeneralRequestService();
      const response = await service.makeRequest(requestData);
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
    makeRequest
  };
};