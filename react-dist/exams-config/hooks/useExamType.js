import { useState } from "react";
import { examTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useExamType = () => {
  const [examType, setExamType] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchExamType = async id => {
    try {
      const data = await examTypeService.get(id);
      setExamType(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    examType,
    setExamType,
    fetchExamType,
    loading
  };
};