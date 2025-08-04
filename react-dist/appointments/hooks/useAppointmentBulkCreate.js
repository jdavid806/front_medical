import { useState } from 'react';
import { appointmentService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
export const useAppointmentBulkCreate = () => {
  const [loading, setLoading] = useState(false);
  const createAppointmentBulk = async (appointments, patientId) => {
    setLoading(true);
    try {
      await appointmentService.bulkCreate(appointments, patientId);
      SwalManager.success();
    } catch (error) {
      console.log(error);
      ErrorHandler.generic(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createAppointmentBulk
  };
};