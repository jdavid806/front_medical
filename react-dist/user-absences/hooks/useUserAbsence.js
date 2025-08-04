import { useState } from "react";
import { userAbsenceService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useUserAbsence = () => {
  const [userAbsence, setUserAbsence] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserAbsence = async id => {
    try {
      const data = await userAbsenceService.get(id);
      setUserAbsence(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    userAbsence,
    setUserAbsence,
    fetchUserAbsence,
    loading
  };
};