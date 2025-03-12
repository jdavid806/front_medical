import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { authService } from "../../../services/api/index.js";
export const useUserCreate = () => {
  const [loading, setLoading] = useState(false);
  const createUser = async userData => {
    setLoading(true);
    try {
      await authService.register(userData);
      SwalManager.success();
    } catch (error) {
      console.log(error);
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createUser
  };
};