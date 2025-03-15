import { useState, useEffect } from 'react';
import { examTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useExamTypes = () => {
  const [examTypes, setExamsTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchExamTypes = async () => {
    try {
      let data = await examTypeService.getAll();
      data = data.filter(item => item.is_active);
      // console.log('Examenes', data);
      setExamsTypes(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExamTypes();
  }, []);
  return {
    examTypes,
    fetchExamTypes,
    loading
  };
};