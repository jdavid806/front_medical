import { useState, useEffect } from 'react';
import { userAbsenceService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useUserAbsences = () => {
  const [userAbsences, setUserAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUserAbsences = async () => {
    try {
      const data = await userAbsenceService.active();
      setUserAbsences(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserAbsences();
  }, []);
  return {
    userAbsences,
    fetchUserAbsences,
    loading
  };
};