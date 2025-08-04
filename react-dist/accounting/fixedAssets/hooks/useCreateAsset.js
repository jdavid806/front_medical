import { useState } from "react";
import { assetsService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useCreateAsset = () => {
  const [loading, setLoading] = useState(false);
  const createAsset = async userData => {
    setLoading(true);
    try {
      const response = await assetsService.create(userData);
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
    createAsset
  };
};