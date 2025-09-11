import { useState, useEffect } from "react";
import { AppointmentTableItem, AppointmentDto } from "../../models/models";
import { appointmentService } from "../../../services/api";
const getEstado = (appointment: AppointmentDto): string => {
  const stateId = appointment.appointment_state_id.toString();
  const stateKey = appointment.appointment_state?.name;
  const attentionType = appointment.attention_type || "CONSULTATION";

  const isPending = () =>
    stateId === "1" ||
    (stateKey === "pending" && attentionType === "PROCEDURE");

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
      return "Sin Cita";
  }
};
export const useFetchAppointments = (getCustomFilters?: () => any, customMapper?: (dto: AppointmentDto) => AppointmentTableItem) => {

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  const defaultMapper = (appointment: AppointmentDto): AppointmentTableItem => {
    const doctorFirstName = appointment.user_availability.user.first_name || "";
    const doctorMiddleName =
      appointment.user_availability.user.middle_name || "";
    const doctorLastName = appointment.user_availability.user.last_name || "";
    const doctorSecondLastName =
      appointment.user_availability.user.second_last_name || "";
    const doctorName = `${doctorFirstName} ${doctorMiddleName} ${doctorLastName} ${doctorSecondLastName}`;
    let attentionType = appointment.attention_type || "CONSULTATION";

    if (attentionType === "REHABILITATION") {
      attentionType = "CONSULTATION";
    }

    const estado = getEstado(appointment);
    return {
      patient: appointment.patient,
      id: appointment.id.toString(),
      patientName: `${appointment.patient.first_name || ''} ${appointment.patient.middle_name || ''} ${appointment.patient.last_name || ''} ${appointment.patient.second_last_name || ''}`,
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
      attentionType: attentionType,
      productId: appointment.product_id,
      stateDescription: estado, 
      user_availability: appointment?.user_availability,
      orders: appointment?.exam_orders,
      exam_recipe_id: appointment?.exam_recipe_id
    };
  };

  const mapper = customMapper || defaultMapper;
  const [appointments, setAppointments] = useState<AppointmentTableItem[]>([]);

  const fetchAppointments = async (perPage: number, page = 1, _search: string | null = null) => {
    try {
      setLoading(true);

      const filters = typeof getCustomFilters === 'function' ? getCustomFilters() : {};

      const data = await appointmentService.filterAppointments({
        per_page: perPage,
        page: page,
        search: _search || "",
        ...filters,
      });

      setAppointments(
        data.data.data.map((appointment) => mapper(appointment))
      );
      setTotalRecords(data.data.total);
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchAppointments(page.rows, calculatedPage, search);
  };

  const handleSearchChange = (_search: string) => {
    setSearch(_search);
    fetchAppointments(perPage, currentPage, _search);
  };

  const refresh = () => fetchAppointments(perPage, currentPage, search);

  useEffect(() => {
    fetchAppointments(perPage);
  }, []);

  return {
    appointments,
    fetchAppointments,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    perPage,
    loading
  };
};
