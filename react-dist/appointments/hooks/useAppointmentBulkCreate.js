import { useState } from 'react';
import { appointmentService } from "../../../services/api/index.js";
export const useAppointmentBulkCreate = () => {
  const [loading, setLoading] = useState(false);
  const createAppointmentBulk = async (appointments, patientId) => {
    setLoading(true);
    try {
      await appointmentService.bulkCreate(appointments, patientId);
    } catch (error) {
      console.log(error);
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