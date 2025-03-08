import { useState } from "react";
import { examOrderService, examTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useExam = () => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchExam = async id => {
    try {
      let data = await examOrderService.get(id);
      const examType = await examTypeService.get(data.exam_type_id);
      data.exam_type = examType;
      console.log(data);
      setExam(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    exam,
    setExam,
    fetchExam,
    loading
  };
};