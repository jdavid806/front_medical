import { useState } from "react";
import AssetsService from "../../../../services/api/classes/assetsService.js";
import { ErrorHandler } from "../../../../services/errorHandler.js";
export const useUpdateAssetStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const updateAssetStatus = async (assetId, body) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const service = new AssetsService();
      await service.updateAssetStatus(assetId, body);
      setSuccess(true);
    } catch (err) {
      setError(err);
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateAssetStatus,
    loading,
    error,
    success
  };
};