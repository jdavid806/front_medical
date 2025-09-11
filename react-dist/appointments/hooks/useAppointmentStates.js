import { useEffect, useState } from "react";
import AppointmentStateService from "../../../services/api/classes/appointmentStateService.js";
export const useAppointmentStates = () => {
  const [appointmentStates, setAppointmentStates] = useState([]);
  const fetchAppointmentStates = async () => {
    try {
      const service = new AppointmentStateService();
      const response = await service.getAll();
      setAppointmentStates(response);
    } catch (error) {
      console.error('Error fetching appointment states:', error);
    }
  };
  useEffect(() => {
    fetchAppointmentStates();
  }, []);
  return {
    appointmentStates,
    fetchAppointmentStates
  };
};