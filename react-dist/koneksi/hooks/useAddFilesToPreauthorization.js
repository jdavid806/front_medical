import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { addFilesToPreauthorization as koneksiAddFilesToPreauthorization } from "../../../services/koneksiService.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useAddFilesToPreauthorization = () => {
  const [loading, setLoading] = useState(false);
  const addFilesToPreauthorization = async (preauthorizationId, formData, urlParams) => {
    setLoading(true);
    try {
      const response = await koneksiAddFilesToPreauthorization({
        preauthorizationId: preauthorizationId,
        formData: formData,
        urlParams: urlParams
      });
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
    addFilesToPreauthorization
  };
};