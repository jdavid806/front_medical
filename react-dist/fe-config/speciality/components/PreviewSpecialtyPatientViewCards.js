import React, { useEffect, useState } from "react";
import { useLoadUserPatientViewCards } from "../hooks/useLoadUserPatientViewCards.js";
import { appointmentService, infoCompanyService, patientService, templateService, ticketService } from "../../../../services/api/index.js";
import { formatWhatsAppMessage, getIndicativeByCountry } from "../../../../services/utilidades.js";
import { createMassMessaging } from "../../../../funciones/funcionesJS/massMessage.js";
import { useLoggedUser } from "../../../users/hooks/useLoggedUser.js";
export const PreviewSpecialtyPatientViewCards = props => {
  const urlParams = new URLSearchParams(window.location.search);
  const {
    patientId = urlParams.get("patient_id") || urlParams.get("id"),
    disableRedirects = false,
    availableCardsIds,
    userId
  } = props;
  const {
    patientViewCards,
    fetchUserPatientViewCards
  } = useLoadUserPatientViewCards();
  const {
    loggedUser
  } = useLoggedUser();
  const [finalAvailableCardsIds, setFinalAvailableCardsIds] = useState();
  const [messaging, setMessaging] = useState(null);
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    const asyncScope = async () => {
      const tenant = window.location.hostname.split(".")[0];
      const data = {
        tenantId: tenant,
        belongsTo: "turnos-llamadoPaciente",
        type: "whatsapp"
      };
      const companies = await infoCompanyService.getCompany();
      const communications = await infoCompanyService.getInfoCommunication(companies.data[0].id);
      let template;
      try {
        template = await templateService.getTemplate(data);
      } catch (error) {
        console.error('Error al obtener template:', error);
      }
      const infoInstance = {
        api_key: communications.api_key,
        instance: communications.instance
      };
      const messaging = createMassMessaging(infoInstance);
      setMessaging(messaging);
      setTemplate(template);
    };
    asyncScope();
  }, []);
  useEffect(() => {
    if (availableCardsIds) {
      setFinalAvailableCardsIds(availableCardsIds);
    }
  }, [availableCardsIds]);
  useEffect(() => {
    if (userId) {
      console.log("patientViewCards", patientViewCards);
      setFinalAvailableCardsIds(patientViewCards);
    }
  }, [patientViewCards]);
  useEffect(() => {
    console.log("userId", userId);
    fetchUserPatientViewCards();
  }, [userId]);
  const cards = [{
    "id": "consulta",
    "icono": "fas fa-address-book",
    "titulo": "Consultas medicas",
    "texto": "Revisa o crea historias médicas",
    "url": "consulta?patient_id=" + patientId
  }, {
    "id": "citas",
    "icono": "calendar-days",
    "titulo": "Citas",
    "texto": "Agenda una nueva cita o revisa todas las citas agendadas a este paciente",
    "url": "verCitas?patient_id=" + patientId
  }, {
    "id": "llamar-paciente",
    "icono": "fas fa-address-book",
    "titulo": "Llamar al paciente",
    "texto": "Revisa o crea historias médicas",
    "url": "llamar_paciente"
  }, {
    "id": "ordenes-medicas",
    "icono": "file-circle-plus",
    "titulo": "Ordenes médicas",
    "texto": "Revisa todos los exámenes clínicos recetados a este paciente",
    "url": "verExamenes?patient_id=" + patientId
  }, {
    "id": "ordenes-laboratorio",
    "icono": "fas fa-microscope",
    "titulo": "Laboratorio",
    "texto": "Revisa todos los exámenes de laboratorio ordenados a este paciente",
    "url": "verOrdenesExamenes?patient_id=" + patientId
  }, {
    "id": "recetas",
    "icono": "kit-medical",
    "titulo": "Recetas médicas",
    "texto": "Genera y revisa todas las recetas médicas para este paciente",
    "url": "verRecetas?patient_id=" + patientId
  }, {
    "id": "recetas-optometria",
    "icono": "kit-medical",
    "titulo": "Recetas Optometría",
    "texto": "Genera y revisa todas las recetas médicas de optometría para este paciente",
    "url": "verRecetasOptometria?patient_id=" + patientId + "&especialidad=Optometria"
  }, {
    "id": "incapacidades",
    "icono": "wheelchair",
    "titulo": "Incapacidades clínicas",
    "texto": "Consulta todas las incapacidades clínicas para este paciente",
    "url": "verIncapacidades?patient_id=" + patientId
  }, {
    "id": "antecedentes",
    "icono": "hospital",
    "titulo": "Antecedentes personales",
    "texto": "Revisa todos los antecedentes personales registrados para este paciente",
    "url": "verAntecedentes?patient_id=" + patientId
  }, {
    "id": "consentimientos",
    "icono": "book-medical",
    "titulo": "Consentimientos",
    "texto": "Genera y revisa todos los consentimientos y certificados registrados para este paciente",
    "url": "verConcentimientos?patient_id=" + patientId
  }, {
    "id": "presupuestos",
    "icono": "file-invoice-dollar",
    "titulo": "Presupuestos",
    "texto": "Genera y revisa todos los presupuestos elaborados para este paciente",
    "url": "registros-presupuestos?patient_id=" + patientId
  }, {
    "id": "esquema-vacunacion",
    "icono": "syringe",
    "titulo": "Esquema de vacunación",
    "texto": "Revisa el esquema de vacunación o genera un nuevo esquema",
    "url": "esquemaVacunacion?patient_id=" + patientId
  }, {
    "id": "notas-enfermeria",
    "icono": "fas fa-user-nurse",
    "titulo": "Notas de Enfermeria",
    "texto": "Revisa las notas de enfermeria del paciente",
    "url": "enfermeria?patient_id=" + patientId
  }, {
    "id": "evoluciones",
    "icono": "fas fa-external-link-alt",
    "titulo": "Evoluciones",
    "texto": "Revisa la evoluciones del paciente",
    "url": "evoluciones?patient_id=" + patientId
  }, {
    "id": "remisiones",
    "icono": "fas fa-retweet",
    "titulo": "Remisiones",
    "texto": "Revisa la remisiones del paciente",
    "url": "remisiones?patient_id=" + patientId
  }, {
    "id": "preadmisiones",
    "icono": "far fa-address-book",
    "titulo": "Preadmisiones",
    "texto": "Revisa las preadmisiones del paciente",
    "url": "preadmisiones?patient_id=" + patientId
  }];
  function sendMessageWhatsapp(data, currentAppointment) {
    const replacements = {
      NOMBRE_PACIENTE: `${data?.patient?.first_name ?? ""} ${data?.patient?.middle_name ?? ""} ${data?.patient?.last_name ?? ""} ${data?.patient?.second_last_name ?? ""}`,
      TICKET: `${data?.ticket_number ?? ""}`,
      MODULO: `${data?.module?.name ?? ""}`,
      ESPECIALISTA: `${currentAppointment?.user_availability?.user?.specialty?.name ?? ""}`,
      CONSULTORIO: `${data?.branch?.address ?? ""}`
    };
    const templateFormatted = formatWhatsAppMessage(template?.data?.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      message_type: "text",
      recipients: [getIndicativeByCountry(data?.patient.country_id) + data?.patient.whatsapp],
      message: templateFormatted,
      webhook_url: "https://example.com/webhook"
    };
    messaging?.sendMessage(dataMessage).then(() => {});
  }

  // Llamar paciente
  const llamarPaciente = async patientId => {
    //@ts-ignore
    Swal.fire({
      title: '¿Estás seguro de llamar al paciente al consultorio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, llamar'
    }).then(async result => {
      if (result.isConfirmed) {
        const patient = await patientService.get(patientId);
        const currentAppointment = patient.appointments.find(appointment => appointment.appointment_state.name === 'pending_consultation' && appointment.appointment_date == new Date().toISOString().split('T')[0]);
        if (currentAppointment) {
          await appointmentService.changeStatus(currentAppointment.id, 'called');
          await ticketService.lastByPatient(patientId).then(response => {
            if (response?.patient?.whatsapp_notifications) {
              sendMessageWhatsapp(response, currentAppointment);
            }
            //@ts-ignore
            Swal.fire('¡Paciente llamado!', 'Se ha llamado al paciente para que se acerque al consultorio.', 'success');
          });
        } else {
          //@ts-ignore
          Swal.fire('Error', 'El paciente no está en espera de consulta.', 'error');
        }
      }
    });
  };
  const handleCardClick = async card => {
    switch (card.id) {
      case "llamar-paciente":
        if (!patientId) return;
        llamarPaciente(patientId);
        break;
      case 'consulta':
        if (!patientId) return;
        window.location.href = `historialConsultasEspecialidad?patient_id=${patientId}&especialidad=${loggedUser?.specialty?.name}`;
        break;
      default:
        window.location.href = card.url;
        break;
    }
  };
  console.log("finalAvailableCardsIds", finalAvailableCardsIds);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "patient-cards-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "patient-cards-grid"
  }, cards.filter(card => finalAvailableCardsIds?.includes(card.id)).map(card => /*#__PURE__*/React.createElement("div", {
    className: "patient-card",
    key: card.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas fa-${card.icono} fa-2x`
  })), /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, card.titulo), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, card.texto), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-icon mt-auto",
    onClick: () => handleCardClick(card),
    disabled: disableRedirects
  }, /*#__PURE__*/React.createElement("span", {
    className: "fa-solid fa-chevron-right"
  }))))))));
};