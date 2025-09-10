import { useState } from "react";
import { prescriptionService } from "../../../services/api/index.js";
export const useLastPatientPrescription = () => {
  const [lastPatientPrescription, setLastPatientPrescription] = useState(null);
  const loadLastPatientPrescription = async patientId => {
    try {
      const lastRecipe = await prescriptionService.getLastByPatientId(patientId);
      setLastPatientPrescription(lastRecipe.data);
      return lastRecipe.data;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    lastPatientPrescription,
    setLastPatientPrescription,
    loadLastPatientPrescription
  };
};