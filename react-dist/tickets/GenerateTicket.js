import React, { useState, useEffect } from "react";
import { patientService } from "../../services/api/index.js";
import { SelectButton } from "primereact/selectbutton";
import { classNames } from "primereact/utils";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { formatWhatsAppMessage, getIndicativeByCountry } from "../../services/utilidades.js";
import { useTemplate } from "../hooks/useTemplate.js";
import { generatePDFReceipts } from "../../funciones/funcionesJS/exportPDF.js";
import { useCompany } from "../hooks/useCompany.js";
import { TicketService } from "../../services/api/classes/ticketService.js";
export const GenerateTicket = () => {
  const [formData, setFormData] = useState({
    patient_name: "",
    phone: "",
    reason: "",
    priority: "NONE"
  });
  const [ticket, setTicket] = useState(null); // <-- STATE DEFINIDO
  const [patient, setPatient] = useState(null);
  const [patientDni, setPatientDni] = useState("");
  const [loading, setLoading] = useState({
    ticket: false,
    patient: false
  });
  const [error, setError] = useState("");
  const [showPatientInputs, setShowPatientInputs] = useState(false);
  const {
    sendMessage,
    responseMsg,
    loading: loadingMsg,
    error: errorMsg
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "turnos-creacion",
    type: "whatsapp"
  };
  const {
    template,
    setTemplate,
    fetchTemplate
  } = useTemplate(data);
  const {
    company
  } = useCompany();
  const ticketService = new TicketService();
  const [reasons, setReasons] = useState([]);
  // Opciones compatibles con el backend
  const REASON_OPTIONS = [{
    value: "ADMISSION_PRESCHEDULED",
    label: "Admisión (Cita Programada)",
    icon: "fas fa-calendar"
  }, {
    value: "EXIT_CONSULTATION",
    label: "Salida de Consulta",
    icon: "fas fa-sign-out-alt"
  }, {
    value: "CONSULTATION_GENERAL",
    label: "Consulta General",
    icon: "fas fa-file"
  }, {
    value: "SPECIALIST",
    label: "Especialista",
    icon: "fas fa-user-md"
  }, {
    value: "VACCINATION",
    label: "Vacunación",
    icon: "fas fa-syringe"
  }, {
    value: "LABORATORY",
    label: "Laboratorio",
    icon: "fas fa-flask"
  }];
  const PRIORITY_OPTIONS = [{
    value: "NONE",
    label: "Sin Prioridad",
    icon: "fas fa-circle"
  }, {
    value: "PREGNANT",
    label: "Embarazada",
    icon: "fas fa-heart"
  }, {
    value: "SENIOR",
    label: "Adulto Mayor",
    icon: "fas fa-user"
  }, {
    value: "DISABILITY",
    label: "Discapacidad",
    icon: "fas fa-wheelchair"
  }, {
    value: "CHILDREN_BABY",
    label: "Niño/bebé",
    icon: "fas fa-child"
  }];

  //llamar a las opciones de motivo y prioridad
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await ticketService.getAllTicketReasons();
        console.log(response);
        setReasons(response.data);
      } catch (error) {
        console.error("Error fetching ticket reasons:", error);
      }
    };
    fetchReasons();
  }, []);

  // Buscar paciente cuando cambia el ID
  const handleSearchPatient = async () => {
    if (!patientDni) return;
    setLoading(prev => ({
      ...prev,
      patient: true
    }));
    setError("");
    try {
      const response = await patientService.findByField({
        field: "document_number",
        value: patientDni
      });
      setPatient(response);
      setFormData(prev => ({
        ...prev,
        patient_name: `${response.first_name ?? ""} ${response.middle_name ?? ""} ${response.last_name ?? ""} ${response.second_last_name ?? ""}`,
        phone: response.whatsapp
      }));
      setShowPatientInputs(true);
    } catch (err) {
      setPatient(null);
      setShowPatientInputs(true);
      setFormData(prev => ({
        ...prev,
        patient_name: "",
        phone: ""
      }));
      setError("Paciente no encontrado, ingrese número telefónico manualmente");
    } finally {
      setLoading(prev => ({
        ...prev,
        patient: false
      }));
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(prev => ({
      ...prev,
      ticket: true
    }));
    setError("");
    try {
      const ticketData = {
        ...formData,
        branch_id: 3,
        patient_id: patient?.id
      };
      const response = await ticketService.create(ticketData);
      setTicket(response);
    } catch (err) {
      setError(err.response?.data?.message || "Error generando turno");
    } finally {
      setLoading(prev => ({
        ...prev,
        ticket: false
      }));
    }
  };
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const printElement = element => {
    // Clonar el elemento para no modificar el DOM original
    const clone = element.cloneNode(true);
    // Eliminar los botones dentro del clon
    clone.querySelectorAll("button").forEach(btn => btn.remove());
    // Agregar estilos para mejorar la apariencia del ticket
    clone.style.border = "2px dashed #007bff";
    clone.style.padding = "24px";
    clone.style.margin = "16px auto";
    clone.style.maxWidth = "350px";
    clone.style.background = "#f8f9fa";
    clone.style.borderRadius = "12px";
    clone.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
    const printContents = clone.innerHTML;
    const configPDF = {
      name: "ticket",
      dimensions: [0, 0, 212.6, 210]
    };
    generatePDFReceipts(printContents, configPDF);
  };
  const BadgeTemplate = option => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: classNames("pi", option.icon)
    }), /*#__PURE__*/React.createElement("span", null, option.label));
  };
  const options = ["Off", "On"];
  const [value, setValue] = useState(options[0]);
  async function sendMessageWhatsapp() {
    const replacements = {
      NOMBRE_PACIENTE: `${ticket?.patient_name}`,
      TICKET: `${ticket?.ticket_number}`
    };
    const templateFormatted = formatWhatsAppMessage(template.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      message_type: "text",
      recipients: [getIndicativeByCountry(patient?.country_id || "Dominican Republic") + ticket.phone],
      message: templateFormatted,
      webhook_url: "https://example.com/webhook"
    };
    await sendMessage(dataMessage);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "container mt-5"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-center mb-4"
  }, "Generar Nuevo Turno"), /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 card p-4"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de Identificaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "input-group"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    placeholder: "Ingrese identificaci\xF3n",
    value: patientDni,
    onChange: e => setPatientDni(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-secondary",
    onClick: handleSearchPatient,
    disabled: !patientDni || loading.patient
  }, loading.patient ? "Buscando..." : "Buscar"))), showPatientInputs && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre del paciente *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    name: "patient_name",
    value: formData.patient_name,
    onChange: handleChange,
    required: showPatientInputs,
    disabled: !!patient
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tel\xE9fono *"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    className: "form-control",
    name: "phone",
    value: formData.phone,
    onChange: handleChange,
    required: showPatientInputs,
    disabled: !!patient
  }))), formData.phone && formData.phone !== "" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header text-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium mb-2"
  }, "Motivo de la Visita")), /*#__PURE__*/React.createElement("div", {
    className: "card-body d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(SelectButton, {
    value: formData.reason,
    onChange: e => setFormData({
      ...formData,
      reason: e.value
    }),
    options: REASON_OPTIONS,
    optionLabel: "label",
    itemTemplate: BadgeTemplate,
    pt: {
      root: {
        className: "d-flex flex-wrap gap-2 justify-content-center"
      },
      button: options => ({
        className: classNames("rounded", {
          "btn btn-outline-secondary": !options?.context.selected,
          "btn btn-primary": options?.context.selected
        })
      })
    },
    required: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header text-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm font-medium mb-2"
  }, "Prioridad")), /*#__PURE__*/React.createElement("div", {
    className: "card-body d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(SelectButton, {
    value: formData.priority,
    onChange: e => setFormData({
      ...formData,
      priority: e.value
    }),
    options: PRIORITY_OPTIONS,
    optionLabel: "label",
    itemTemplate: BadgeTemplate,
    pt: {
      root: {
        className: "d-flex flex-wrap gap-2 justify-content-center"
      },
      button: options => ({
        className: classNames("rounded", {
          "btn btn-outline-secondary": !options?.context.selected,
          "btn btn-primary": options?.context.selected
        })
      })
    },
    required: true
  })))), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger"
  }, error), formData.phone && formData.phone !== "" && /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary w-100",
    disabled: loading.ticket
  }, loading.ticket ? "Generando..." : "Generar Turno")))), ticket && /*#__PURE__*/React.createElement("div", {
    id: "ticket-printable",
    className: "mt-4 p-4 bg-light rounded text-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-success"
  }, "Turno Generado"), /*#__PURE__*/React.createElement("div", {
    className: "h2 fw-bold text-primary"
  }, ticket.ticket_number), /*#__PURE__*/React.createElement("div", {
    className: "text-muted"
  }, "Prioridad:", " ", PRIORITY_OPTIONS.find(p => p.value === ticket.priority)?.label), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-secondary me-2",
    onClick: () => printElement(document.getElementById("ticket-printable"))
  }, "Imprimir"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-success",
    onClick: async () => {
      const ticketPrintable = document.getElementById("ticket-printable");
      if (ticketPrintable) {
        sendMessageWhatsapp();
      }
    }
  }, "Enviar por WhatsApp"))));
};