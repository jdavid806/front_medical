import { useState, useEffect } from "react";
import { AppointmentTableItem, AppointmentDto } from "../../models/models";
const getEstado = (appointment: AppointmentDto): string => {
  const stateId = appointment.appointment_state_id.toString();
  const stateKey = appointment.appointment_state?.name;
  const attentionType = appointment.attention_type;

  // Función auxiliar para simplificar las condiciones
  const isPending = () =>
    stateId === "1" || (stateKey === "pending" && attentionType === "PROCEDURE");

  const isWaitingForConsultation = () =>
    (stateId === "2" ||
      stateKey === "pending_consultation" ||
      stateKey === "in_consultation") &&
    attentionType === "CONSULTATION";

  const isWaitingForExam = () =>
    (stateId === "2" || stateKey === "pending_consultation") &&
    attentionType === "PROCEDURE";

  const isConsultationCompleted = () =>
    stateId === "8" ||
    (stateKey === "consultation_completed" && attentionType === "CONSULTATION");

  const isInConsultation = () =>
    stateId === "7" ||
    (stateKey === "in_consultation" && attentionType === "CONSULTATION");

  // Usar switch-case para determinar el estado
  switch (true) {
    case isPending():
      return "Pendiente";
    case isWaitingForConsultation():
      return "En espera de consulta";
    case isWaitingForExam():
      return "En espera de examen";
    case isConsultationCompleted():
      return "Consulta Finalizada";
    case isInConsultation():
      return "En Consulta";
    default:
      return "Desconocido"; // Estado por defecto
  }
};
export const useFetchAppointments = (
  fetchPromise: Promise<AppointmentDto[]>,
  customMapper?: (dto: AppointmentDto) => AppointmentTableItem
) => {
  const defaultMapper = (appointment: AppointmentDto): AppointmentTableItem => {
    const doctorFirstName = appointment.user_availability.user.first_name;
    const doctorMiddleName = appointment.user_availability.user.middle_name;
    const doctorLastName = appointment.user_availability.user.last_name;
    const doctorSecondLastName =
      appointment.user_availability.user.second_last_name;
    const doctorName = `${doctorFirstName} ${doctorMiddleName} ${doctorLastName} ${doctorSecondLastName}`;

    const estado = getEstado(appointment);
    console.log("appointments", appointment);
    return {
      id: appointment.id.toString(),
      patientName: `${appointment.patient.first_name} ${appointment.patient.last_name}`,
      patientDNI: appointment.patient.document_number,
      patientId: appointment.patient_id.toString(),
      date: appointment.appointment_date,
      time: appointment.appointment_time,
      doctorName,
      entity: appointment.patient.social_security?.entity?.name || "--",
      status: appointment.is_active ? "Activo" : "Inactivo",
      branchId: appointment.user_availability.branch_id?.toString() || null,
      isChecked: false,
      stateId: appointment.appointment_state_id.toString(),
      stateKey: appointment.appointment_state?.name,
      attentionType: appointment.attention_type,
      productId: appointment.product_id,
      stateDescription: estado,// Nuevo campo agregado
    };
  };

  const mapper = customMapper || defaultMapper;
  const [appointments, setAppointments] = useState<AppointmentTableItem[]>([]);

  const fetchAppointments = async () => {
    const data = (await fetchPromise) as AppointmentDto[];
    const patientId = +(
      new URLSearchParams(window.location.search).get("patient_id") || "0"
    );

    setAppointments(
      data
        .filter((appointment) => {
          return appointment.is_active;
        })
        .filter((appointment) => {
          if (patientId <= 0) return true;
          return appointment.patient_id == patientId;
        })
        .map((appointment) => mapper(appointment))
    );
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // console.log('appointmentsxx', appointments);

  return { appointments, fetchAppointments };
};