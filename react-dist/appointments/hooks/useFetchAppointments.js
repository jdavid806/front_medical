import { useState, useEffect } from 'react';
export const useFetchAppointments = (fetchPromise, customMapper) => {
  const defaultMapper = appointment => {
    const doctorFirstName = appointment.user_availability.user.first_name;
    const doctorMiddleName = appointment.user_availability.user.middle_name;
    const doctorLastName = appointment.user_availability.user.last_name;
    const doctorSecondLastName = appointment.user_availability.user.second_last_name;
    const doctorName = `${doctorFirstName} ${doctorMiddleName} ${doctorLastName} ${doctorSecondLastName}`;
    console.log('Citas', appointment);
    return {
      id: appointment.id.toString(),
      patientName: `${appointment.patient.first_name} ${appointment.patient.last_name}`,
      patientDNI: appointment.patient.document_number,
      patientId: appointment.patient_id.toString(),
      date: appointment.appointment_date,
      time: appointment.appointment_time,
      doctorName,
      entity: appointment.patient.social_security?.entity?.name || '--',
      status: appointment.is_active ? 'Activo' : 'Inactivo',
      branchId: appointment.user_availability.branch_id?.toString() || null,
      isChecked: false,
      stateId: appointment.appointment_state_id.toString(),
      stateKey: appointment.appointment_state?.name,
      attentionType: appointment.attention_type,
      productId: appointment.product_id
    };
  };
  const mapper = customMapper || defaultMapper;
  const [appointments, setAppointments] = useState([]);
  const fetchAppointments = async () => {
    const data = await fetchPromise;
    const patientId = +(new URLSearchParams(window.location.search).get('patient_id') || "0");
    setAppointments(data.filter(appointment => {
      return appointment.is_active;
    }).filter(appointment => {
      if (patientId <= 0) return true;
      return appointment.patient_id == patientId;
    }).map(appointment => mapper(appointment)));
  };
  useEffect(() => {
    fetchAppointments();
  }, []);
  return {
    appointments,
    fetchAppointments
  };
};