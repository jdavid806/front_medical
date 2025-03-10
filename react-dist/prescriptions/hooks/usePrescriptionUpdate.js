import { useState } from 'react';
import { prescriptionService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const usePrescriptionUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updatePrescription = async (id, data) => {
    setLoading(true);
    try {
      await prescriptionService.update(id, data);
      SwalManager.success();
    } catch (error) {
      ErrorHandler.generic(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    updatePrescription,
    loading
  };
};