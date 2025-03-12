import { useState, useEffect } from 'react';
import { userSpecialtyService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useUserSpecialties = () => {
  const [userSpecialties, setUserSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUserSpecialties = async () => {
    try {
      const data = await userSpecialtyService.getAll();
      setUserSpecialties(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserSpecialties();
  }, []);
  return {
    userSpecialties,
    fetchUserSpecialties,
    loading
  };
};