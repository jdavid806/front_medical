import { useState } from 'react';
import { appointmentService } from "../../../services/api/index.js";
export const useValidateBulkAppointments = () => {
  const [loading, setLoading] = useState(false);
  const validateBulkAppointments = async appointments => {
    setLoading(true);
    try {
      return await appointmentService.bulkValidate({
        appointments
      });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    validateBulkAppointments
  };
};