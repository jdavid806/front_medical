import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { userAssistantService } from "../../../services/api/index.js";
export const useUserAssistantBulkCreate = () => {
  const [loading, setLoading] = useState(false);
  const createUserAssistantBulk = async (supervisorUserId, assistants) => {
    setLoading(true);
    try {
      const response = await userAssistantService.bulkCreate({
        supervisor_user_id: supervisorUserId,
        assistants
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
    createUserAssistantBulk
  };
};