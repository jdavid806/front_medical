import { useState } from 'react';
import { userAbsenceService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useUserAbsenceUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateUserAbsence = async (id, data) => {
    setLoading(true);
    try {
      await userAbsenceService.update(id, data);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updateUserAbsence,
    loading
  };
};