import { useState } from "react";
import { clinicalRecordService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
export const useParaclinicalByAppointment = () => {
  const [paraclinical, setParaclinical] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchParaclinicalByAppointment = async appointmentId => {
    try {
      const data = await clinicalRecordService.getParaclinicalByAppointment(appointmentId);
      setParaclinical(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    paraclinical,
    fetchParaclinicalByAppointment,
    loading
  };
};