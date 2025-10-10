import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { authService } from "../../../services/api/index.js";
export const useUserCreate = () => {
  const [loading, setLoading] = useState(false);
  const createUser = async userData => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
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
    createUser
  };
};