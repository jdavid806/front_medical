import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { GeneralRequestService } from "../../../services/api/classes/generalRequestService.js";
export const useResolveRequest = () => {
  const [loading, setLoading] = useState(false);
  const resolveRequest = async (requestId, requestData) => {
    setLoading(true);
    try {
      const service = new GeneralRequestService();
      const response = await service.resolveRequest(requestId, requestData);
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
    resolveRequest
  };
};