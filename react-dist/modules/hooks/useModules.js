import { useState, useEffect } from 'react';
import { moduleService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchModules = async () => {
    try {
      const data = await moduleService.active();
      setModules(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchModules();
  }, []);
  return {
    modules,
    fetchModules,
    loading
  };
};