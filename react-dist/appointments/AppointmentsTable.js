import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { PreadmissionForm } from "./PreadmissionForm.js";
import { PrintTableAction } from "../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../components/table-actions/ShareTableAction.js";
import { appointmentService, templateService } from "../../services/api/index.js";
import UserManager from "../../services/userManager.js";
import { appointmentStatesColors, appointmentStateColorsByKey, appointmentStateFilters, appointmentStatesByKeyTwo } from "../../services/commons.js";
import { ExamResultsFileForm } from "../exams/components/ExamResultsFileForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { RescheduleAppointmentModalV2 } from "./RescheduleAppointmentModalV2.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { useTemplate } from "../hooks/useTemplate.js";
import { formatWhatsAppMessage, getIndicativeByCountry, formatDate } from "../../services/utilidades.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
export const AppointmentsTable = () => {
  const patientId = new URLSearchParams(window.location.search).get("patient_id") || null;
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState([new Date(new Date().setDate(new Date().getDate())), new Date()]);
  const getCustomFilters = () => {
    return {
      patientId,
      sort: "-appointment_date,appointment_time",
      appointmentState: selectedBranch,
      appointmentDate: selectedDate?.filter(date => !!date).map(date => date.toISOString().split("T")[0]).join(",")
    };
  };
  const {
    appointments,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loading: loadingAppointments,
    perPage
  } = useFetchAppointments(getCustomFilters);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showLoadExamResultsFileModal, setShowLoadExamResultsFileModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null); // Para almacenar el archivo PDF
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // Para la previsualización del PDF
  const [showPdfModal, setShowPdfModal] = useState(false); // Para controlar la visibilidad del modal de PDF

  const {
    sendMessage: sendMessageAppointmentHook,
    responseMsg,
    loading,
    error
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const dataTemplateShareAppointment = {
    tenantId: tenant,
    belongsTo: "citas-compartir",
    type: "whatsapp"
  };
  const {
    template: templateShareAppointmen,
    setTemplate,
    fetchTemplate
  } = useTemplate(dataTemplateShareAppointment);
  const sendMessageAppointment = useRef(sendMessageAppointmentHook);
  useEffect(() => {
    sendMessageAppointment.current = sendMessageAppointmentHook;
  }, [sendMessageAppointmentHook]);
  const columns = [{
    header: "Paciente",
    field: "patientName",
    body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: `verPaciente?id=${data.patientId}`
    }, data.patientName))
  }, {
    header: "Número de documento",
    field: "patientDNI"
  }, {
    header: "Fecha Consulta",
    field: "date"
  }, {
    header: "Hora Consulta",
    field: "time"
  }, {
    header: "Profesional asignado",
    field: "doctorName"
  }, {
    header: "Entidad",
    field: "entity"
  }, {
    header: "Estado",
    field: "status",
    body: data => {
      const color = appointmentStateColorsByKey[data.stateKey] || appointmentStatesColors[data.stateId];
      const text = appointmentStatesByKeyTwo[data.stateKey]?.[data.attentionType] || appointmentStatesByKeyTwo[data.stateKey] || "SIN ESTADO";
      return /*#__PURE__*/React.createElement("span", {
        className: `badge badge-phoenix badge-phoenix-${color}`
      }, text);
    }
  }, {
    header: "",
    field: "",
    body: data => /*#__PURE__*/React.createElement("div", {
      className: "text-end align-middle"
    }, /*#__PURE__*/React.createElement("div", {
      className: "dropdown"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn btn-primary dropdown-toggle",
      type: "button",
      "data-bs-toggle": "dropdown",
      "aria-expanded": "false"
    }, /*#__PURE__*/React.createElement("i", {
      "data-feather": "settings"
    }), " Acciones"), /*#__PURE__*/React.createElement("ul", {
      className: "dropdown-menu",
      style: {
        zIndex: 10000
      }
    }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: () => setShowFormModal({
        isShow: true,
        data: data
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid far fa-hospital",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Generar preadmision")))), (data.stateKey === "pending_consultation" || data.stateKey === "called" || data.stateKey === "in_consultation") && data.attentionType === "CONSULTATION" && patientId && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleMakeClinicalRecord(data.patientId, data.id);
      },
      "data-column": "realizar-consulta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Realizar consulta")))), (data.stateId === "2" || data.stateKey === "pending_consultation" || data.stateKey === "called" || data.stateKey === "in_consultation") && data.attentionType === "PROCEDURE" && patientId && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleLoadExamResults(data.id, data.patientId, data.productId);
      },
      "data-column": "realizar-consulta"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Realizar examen"))), /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      onClick: () => {
        setSelectedAppointmentId(data.id);
        setShowPdfModal(true);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-pdf",
      style: {
        width: "20px",
        cursor: "pointer"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        cursor: "pointer"
      }
    }, "Subir Examen"))))), data.stateId === "1" || data.stateKey === "pending" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => openRescheduleAppointmentModal(data.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-calendar-alt",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Reagendar cita")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        handleCancelAppointment(data);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-ban",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Cancelar cita"))))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Cita"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: e => {
        e.preventDefault();
        sendMessageWhatsapp(data, "share");
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-whatsapp",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Compartir cita")))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Factura"), /*#__PURE__*/React.createElement(PrintTableAction, {
      onTrigger: () => {
        //@ts-ignore
        generateInvoice(data.id, false);
      }
    }), /*#__PURE__*/React.createElement(DownloadTableAction, {
      onTrigger: () => {
        //@ts-ignore
        generateInvoice(data.id, true);
      }
    }), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "whatsapp",
      onTrigger: () => {
        //@ts-ignore
        sendInvoice(data.id, data.patientId);
      }
    }), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "email",
      onTrigger: () => {
        //@ts-ignore
        sendInvoice(data.id, data.patientId);
      }
    }))))
  }];
  const [showFormModal, setShowFormModal] = useState({
    isShow: false,
    data: {}
  });
  const handleSubmit = async () => {
    try {
      // Llamar a la función guardarArchivoExamen
      //@ ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", 2);

      // Acceder a la PromiseResult
      if (enviarPDf !== undefined) {
        await appointmentService.changeStatus(selectedAppointmentId, "consultation_completed");
        SwalManager.success({
          text: "Resultados guardados exitosamente"
        });
      } else {
        console.error("No se obtuvo un resultado válido.");
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    } finally {
      // Limpiar el estado después de la operación
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
      refresh();
    }
  };
  useEffect(() => {
    refresh();
  }, [selectedBranch, selectedDate]);
  const handleMakeClinicalRecord = (patientId, appointmentId) => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}&appointment_id=${appointmentId}`;
      }
    });
  };

  //filtrar objecto en el select
  const getAppointmentStates = () => {
    return Object.entries(appointmentStateFilters).map(([key, label]) => ({
      value: key,
      label: label
    }));
  };
  const handleCancelAppointment = async data => {
    SwalManager.confirmCancel(async () => {
      await appointmentService.changeStatus(Number(data.id), "cancelled");
      sendMessageWhatsapp(data, "cancel");
      SwalManager.success({
        text: "Cita cancelada exitosamente"
      });
    });
  };
  const sendMessageWhatsapp = useCallback(async (appointment, type) => {
    const appointmentData = await appointmentService.get(Number(appointment.id));
    const replacements = {
      NOMBRE_PACIENTE: `${appointmentData?.patient?.first_name ?? ""} ${appointmentData?.patient?.middle_name ?? ""} ${appointmentData?.patient?.last_name ?? ""} ${appointmentData?.patient?.second_last_name ?? ""}`,
      ESPECIALISTA: `${appointmentData?.user_availability?.user.first_name ?? ""} ${appointmentData?.user_availability?.user?.middle_name ?? ""} ${appointmentData?.user_availability?.user?.last_name ?? ""} ${appointmentData?.user_availability?.user?.second_last_name ?? ""}`,
      ESPECIALIDAD: `${appointmentData?.user_availability?.user?.specialty?.name ?? ""}`,
      FECHA_CITA: `${formatDate(appointmentData.appointment_date, true)}`,
      HORA_CITA: `${appointmentData.appointment_time}`,
      MOTIVO_REAGENDAMIENTO: "",
      MOTIVO_CANCELACION: ""
    };
    const templateFormatted = await handleSwitchTemplate(type, replacements);
    const dataMessage = {
      channel: "whatsapp",
      message_type: "text",
      recipients: [getIndicativeByCountry(appointmentData.patient.country_id) + appointmentData.patient.whatsapp],
      message: templateFormatted,
      webhook_url: "https://example.com/webhook"
    };
    await sendMessageAppointment.current(dataMessage);
    refresh();
  }, [sendMessageAppointmentHook]);
  async function handleSwitchTemplate(type, replacements) {
    let templateFormatted = null;
    switch (type) {
      case "share":
        templateFormatted = formatWhatsAppMessage(templateShareAppointmen.template, replacements);
        break;
      case "cancel":
        const tenant = window.location.hostname.split(".")[0];
        const dataTemplateCancelAppointment = {
          tenantId: tenant,
          belongsTo: "citas-cancelacion",
          type: "whatsapp"
        };
        const dataTemplateCancel = await templateService.getTemplate(dataTemplateCancelAppointment);
        templateFormatted = formatWhatsAppMessage(dataTemplateCancel.data.template, replacements);
        break;
    }
    return templateFormatted;
  }
  const openRescheduleAppointmentModal = appointmentId => {
    setSelectedAppointmentId(appointmentId);
    setShowRescheduleModal(true);
  };
  const handleHideFormModal = () => {
    setShowFormModal({
      isShow: false,
      data: {}
    });
  };
  const handleLoadExamResults = (appointmentId, patientId, productId) => {
    window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&appointment_id=${appointmentId}`;
  };
  const handleLoadExamResultsFile = () => {
    setShowLoadExamResultsFileModal(true);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtrar citas")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "branch_id",
    className: "form-label"
  }, "Estados"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "branch_id",
    options: getAppointmentStates(),
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    placeholder: "Filtrar por estado",
    className: "w-100",
    value: selectedBranch,
    onChange: e => setSelectedBranch(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "300px"
    }
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: appointments,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingAppointments,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh
  }))), showPdfModal && /*#__PURE__*/React.createElement("div", {
    className: "modal fade show",
    style: {
      display: "block",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered modal-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, "Previsualizaci\xF3n de PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: () => {
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, pdfPreviewUrl ? /*#__PURE__*/React.createElement("embed", {
    src: pdfPreviewUrl,
    width: "100%",
    height: "500px",
    type: "application/pdf"
  }) : /*#__PURE__*/React.createElement("p", null, "Por favor, seleccione un archivo PDF.")), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".pdf",
    id: "inputPdf",
    onChange: e => {
      const file = e.target.files?.[0] || null;
      if (file) {
        setPdfFile(file);
        setPdfPreviewUrl(URL.createObjectURL(file));
      }
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => {
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: () => {
      handleSubmit();
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
    }
  }, "Confirmar"))))), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "createPreadmission",
    show: showFormModal.isShow,
    onHide: handleHideFormModal,
    title: "Crear Preadmision" + " - " + showFormModal.data["patientName"]
  }, /*#__PURE__*/React.createElement(PreadmissionForm, {
    initialValues: showFormModal.data,
    formId: "createPreadmission"
  })), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "loadExamResultsFile",
    show: showLoadExamResultsFileModal,
    onHide: () => setShowLoadExamResultsFileModal(false),
    title: "Subir resultados de examen"
  }, /*#__PURE__*/React.createElement(ExamResultsFileForm, null)), /*#__PURE__*/React.createElement(RescheduleAppointmentModalV2, {
    isOpen: showRescheduleModal,
    onClose: () => setShowRescheduleModal(false),
    appointmentId: selectedAppointmentId,
    onSuccess: () => refresh()
  }));
};