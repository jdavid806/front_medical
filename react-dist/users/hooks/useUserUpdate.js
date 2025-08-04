import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { userService } from "../../../services/api/index.js";
export const useUserUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateUser = async (id, data) => {
    setLoading(true);
    try {
      const response = await userService.update(id, data);
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
    updateUser,
    loading
  };
};