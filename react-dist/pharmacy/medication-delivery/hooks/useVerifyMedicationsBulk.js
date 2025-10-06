import { useState } from "react";
import FarmaciaService from "../../../../services/api/classes/farmaciaService.js";
export const useVerifyMedicationsBulk = () => {
  const [result, setResult] = useState();
  const verifyMedicationsBulk = async products => {
    try {
      const service = new FarmaciaService();
      const response = await service.verifyProductsBulk({
        products
      });
      setResult(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return {
    result,
    verifyMedicationsBulk
  };
};