import { useState, useEffect } from 'react';
import { specializablesService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useSpecializables = () => {
  const [specializables, setSpecializables] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchSpecializables = async () => {
    try {
      const data = await specializablesService.getAll();
      setSpecializables(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSpecializables();
  }, []);
  return {
    specializables,
    fetchSpecializables,
    loading
  };
};