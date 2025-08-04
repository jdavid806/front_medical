import { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { examRecipeService } from "../../../services/api/index.js";
export const usePatientExamRecipes = () => {
  const [patientExamRecipes, setPatientExamRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPatientExamRecipes = async patientId => {
    try {
      let data = await examRecipeService.pendingOfPatient(patientId);
      const mappedData = data.map(item => {
        return {
          ...item,
          label: item.details.map(detail => detail.exam_type.name).join(', ')
        };
      });
      setPatientExamRecipes(mappedData);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    patientExamRecipes,
    setPatientExamRecipes,
    fetchPatientExamRecipes,
    loading
  };
};