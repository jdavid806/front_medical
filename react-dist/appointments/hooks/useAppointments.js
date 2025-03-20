import { useState, useEffect } from "react";
import { appointmentService } from "../../../services/api.js";
export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const fetchAppointments = async () => {
    const data = await appointmentService.active();
    console.log(data);
    setAppointments(data.map(appointment => {
      const doctorFirstName = appointment.user_availability.user.first_name;
      const doctorMiddleName = appointment.user_availability.user.middle_name;
      const doctorLastName = appointment.user_availability.user.last_name;
      const doctorSecondLastName = appointment.user_availability.user.second_last_name;
      const doctorName = `${doctorFirstName} ${doctorMiddleName} ${doctorLastName} ${doctorSecondLastName}`;
      return {
        id: appointment.id.toString(),
        patientName: `${appointment.patient.first_name} ${appointment.patient.last_name}`,
        patientDNI: appointment.patient.document_number,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        doctorName,
        entity: appointment.patient.social_security?.eps || "",
        status: appointment.is_active ? "Activo" : "Inactivo"
      };
    }));
  };
  useEffect(() => {
    fetchAppointments();
  }, []);
  return {
    appointments,
    fetchAppointments
  };
};