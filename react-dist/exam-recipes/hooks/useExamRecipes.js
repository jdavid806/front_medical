import { useState, useEffect } from 'react';
import { ErrorHandler } from "../../../services/errorHandler.js";
import { examRecipeService } from "../../../services/api/index.js";
export const useExamRecipes = patientId => {
  const [examRecipes, setExamRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchExamRecipes = async patientId => {
    try {
      let data = await examRecipeService.ofPatient(patientId);
      setExamRecipes(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (patientId) fetchExamRecipes(patientId);
  }, [patientId]);
  return {
    examRecipes,
    fetchExamRecipes,
    loading
  };
};