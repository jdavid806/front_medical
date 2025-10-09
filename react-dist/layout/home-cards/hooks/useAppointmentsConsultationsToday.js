import { useEffect, useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { appointmentService } from "../../../../services/api/index.js";
export const useAppointmentsConsultationsToday = () => {
  const [apointmentCount, setApoinmentCount] = useState(null);
  const {
    toast,
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const fetchAppointmentConsultationsToday = async () => {
    try {
      const response = await appointmentService.getAppointmentsConsultationsToday();
      const data = response.data;
      setApoinmentCount(data);
    } catch (error) {
      showServerErrorsToast(error);
    }
  };
  useEffect(() => {
    fetchAppointmentConsultationsToday();
  }, []);
  return {
    apointmentCount,
    fetchAppointmentConsultationsToday,
    toast
  };
};