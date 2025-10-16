import { useState } from "react";
import { prescriptionService } from "../../../services/api/index.js";
export const usePrescription = () => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchPrescription = async id => {
    try {
      const data = await prescriptionService.get(id);
      setPrescription(data.data);
    } catch (err) {
      console.log(err);

      //ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    prescription,
    setPrescription,
    fetchPrescription,
    loading
  };
};