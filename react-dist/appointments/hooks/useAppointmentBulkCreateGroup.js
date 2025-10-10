import { useState } from 'react';
import { appointmentService } from "../../../services/api/index.js";
export const useAppointmentBulkCreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const createAppointmentBulkGroup = async appointments => {
    setLoading(true);
    try {
      await appointmentService.bulkCreateGroup(appointments);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createAppointmentBulkGroup
  };
};