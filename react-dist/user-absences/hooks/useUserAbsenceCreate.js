import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { userAbsenceService } from "../../../services/api/index.js";
export const useUserAbsenceCreate = () => {
  const [loading, setLoading] = useState(false);
  const createUserAbsence = async (userAbsenceData, userId) => {
    setLoading(true);
    try {
      await userAbsenceService.createForParent(userId, userAbsenceData);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createUserAbsence
  };
};