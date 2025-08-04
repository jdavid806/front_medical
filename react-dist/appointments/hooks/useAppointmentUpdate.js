import { useState } from 'react';
import { appointmentService } from "../../../services/api/index.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useAppointmentUpdate = () => {
  const [loading, setLoading] = useState(true);
  const updateAppointment = async (id, data) => {
    setLoading(true);
    try {
      const response = await appointmentService.update(id, data);
      SwalManager.success();
      return response;
    } catch (error) {
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    updateAppointment,
    loading
  };
};