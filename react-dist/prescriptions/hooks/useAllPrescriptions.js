import { useState, useEffect } from 'react';
import { prescriptionService } from "../../../services/api/index.js";
export const useAllPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const fetchPrescriptions = async () => {
    try {
      const {
        data: prescriptionData
      } = await prescriptionService.getPrescriptions();
      const finalData = prescriptionData.filter(recipe => recipe.is_active);
      setPrescriptions(finalData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };
  useEffect(() => {
    fetchPrescriptions();
  }, []);
  return {
    prescriptions,
    fetchPrescriptions
  };
};