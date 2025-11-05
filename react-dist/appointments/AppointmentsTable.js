import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { PreadmissionForm } from "./PreadmissionForm.js";
import { appointmentService, examOrderService, examRecipeResultService, examRecipeService } from "../../services/api/index.js";
import UserManager from "../../services/userManager.js";
import { appointmentStatesColors, appointmentStateColorsByKey, appointmentStateFilters, appointmentStatesByKeyTwo } from "../../services/commons.js";
import { ExamResultsFileForm } from "../exams/components/ExamResultsFileForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { RescheduleAppointmentModalV2 } from "./RescheduleAppointmentModalV2.js";
import { getUserLogged } from "../../services/utilidades.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { useTemplateBuilded } from "../hooks/useTemplateBuilded.js";
import { PrimeReactProvider } from "primereact/api";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { AppointmentCreateFormModalButton } from "./AppointmentCreateFormModalButton.js";
export const AppointmentsTable = () => {
  const patientId = new URLSearchParams(window.location.search).get("patient_id") || null;
  const [selectedBranch, setSelectedBranch] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState([new Date(new Date().setDate(new Date().getDate())), new Date()]);
  const [selectedAppointmentType, setSelectedAppointmentType] = React.useState(null);
  const userLogged = getUserLogged();
  const appointmentTypes = [{
    value: null,
    label: "Todos los tipos",
    icon: "📋"
  }, {
    value: "1",
    label: "🏥 Presencial",
    icon: "🏥"
  }, {
    value: "2",
    label: "💻 Virtual",
    icon: "💻"
  }, {
    value: "3",
    label: "🏠 Domiciliaria",
    icon: "🏠"
  }];
  const getCustomFilters = () => {
    const filters = {
      patientId,
      sort: "-appointment_date,appointment_time",
      appointmentState: selectedBranch,
      appointmentDate: selectedDate?.filter(date => !!date).map(date => date.toISOString().split("T")[0]).join(",")
    };
    if (selectedAppointmentType) {
      console.log("🔍 Aplicando filtro de tipo de cita:", selectedAppointmentType);
      const typeNameMap = {
        "1": "Presencial",
        "2": "Virtual",
        "3": "Domiciliaria"
      };
      const typeName = typeNameMap[selectedAppointmentType];
      if (typeName) {
        filters.appointmentType = typeName;
      }
    }
    console.log("Filtros enviados:", filters);
    return filters;
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
  const [selectedExamOrder, setSelectedExamOrder] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showLoadExamResultsFileModal, setShowLoadExamResultsFileModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const {
    fetchTemplate,
    switchTemplate
  } = useTemplateBuilded();
  const {
    sendMessage: sendMessageAppointmentHook,
    responseMsg,
    loading,
    error
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const sendMessageAppointment = useRef(sendMessageAppointmentHook);
  const toast = useRef(null);
  useEffect(() => {
    sendMessageAppointment.current = sendMessageAppointmentHook;
  }, [sendMessageAppointmentHook]);
  const getAppointmentTypeInfo = appointmentType => {
    if (!appointmentType) return {
      icon: "❓",
      name: "No definido"
    };
    const typeMap = {
      "1": {
        icon: "🏥",
        name: "Presencial"
      },
      "2": {
        icon: "💻",
        name: "Virtual"
      },
      "3": {
        icon: "🏠",
        name: "Domiciliaria"
      },
      Presencial: {
        icon: "🏥",
        name: "Presencial"
      },
      Virtual: {
        icon: "💻",
        name: "Virtual"
      },
      Domiciliaria: {
        icon: "🏠",
        name: "Domiciliaria"
      }
    };
    const typeId = appointmentType.id?.toString();
    const typeName = appointmentType.name;
    return typeMap[typeId] || typeMap[typeName] || {
      icon: "❓",
      name: typeName || "No definido"
    };
  };
  const TableMenu = ({
    rowData
  }) => {
    const menu = useRef(null);
    const handleGeneratePreadmission = () => {
      setShowFormModal({
        isShow: true,
        data: rowData
      });
    };
    const handleMakeClinicalRecord = () => {
      handleMakeClinicalRecordAction(rowData.patientId, rowData.id);
    };
    const handleLoadExamResults = () => {
      handleLoadExamResultsAction(rowData.id, rowData.patientId, rowData.productId);
    };
    const handleUploadExam = () => {
      setSelectedAppointment(rowData);
      setSelectedAppointmentId(rowData.id);
      setSelectedExamOrder(rowData.orders[0]);
      setShowPdfModal(true);
    };
    const handleRescheduleAppointment = () => {
      openRescheduleAppointmentModal(rowData.id);
    };
    const handleCancelAppointment = () => {
      handleCancelAppointmentAction(rowData);
    };
    const handleShareAppointment = async () => {
      const dataTemplate = {
        tenantId: tenant,
        belongsTo: "citas-compartir",
        type: "whatsapp"
      };
      const dataFormated = {
        patient: rowData.patient,
        assigned_user_availability: rowData.user_availability,
        appointment_date: rowData.date,
        appointment_time: rowData.time
      };
      const templateAppointments = await fetchTemplate(dataTemplate);
      const finishTemplate = await switchTemplate(templateAppointments.template, "appointments", dataFormated);
      await sendMessageWhatsapp(rowData.patient, finishTemplate, null);
    };
    const handlePrintInvoice = () => {
      //@ts-ignore
      generateInvoice(rowData.id, false);
    };
    const handleDownloadInvoice = () => {
      //@ts-ignore
      generateInvoice(rowData.id, true);
    };
    const handleShareInvoiceWhatsapp = () => {
      //@ts-ignore
      sendInvoice(rowData.id, rowData.patientId);
    };
    const handleShareInvoiceEmail = () => {
      //@ts-ignore
      sendInvoice(rowData.id, rowData.patientId);
    };

    // Construir los items del menú manteniendo la misma lógica condicional
    const menuItems = [];

    // Siempre agregar Generar preadmision
    menuItems.push({
      label: "Generar preadmision",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid far fa-hospital me-2"
      }),
      command: handleGeneratePreadmission
    });

    // Agregar Realizar consulta si cumple condiciones
    if ((rowData.stateKey === "pending_consultation" || rowData.stateKey === "called" || rowData.stateKey === "in_consultation") && rowData.attentionType === "CONSULTATION" && patientId) {
      menuItems.push({
        label: "Realizar consulta",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-stethoscope me-2"
        }),
        command: handleMakeClinicalRecord
      });
    }

    // Agregar acciones de examen si cumple condiciones
    if ((rowData.stateId === "2" || rowData.stateKey === "pending_consultation" || rowData.stateKey === "called" || rowData.stateKey === "in_consultation") && rowData.attentionType === "PROCEDURE" && patientId) {
      menuItems.push({
        label: "Realizar examen",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-stethoscope me-2"
        }),
        command: handleLoadExamResults
      }, {
        label: "Subir Examen",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-file-pdf me-2"
        }),
        command: handleUploadExam
      });
    }

    // Agregar acciones de reagendar y cancelar si cumple condiciones
    if (rowData.stateId === "1" || rowData.stateKey === "pending") {
      menuItems.push({
        label: "Reagendar cita",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-calendar-alt me-2"
        }),
        command: handleRescheduleAppointment
      }, {
        label: "Cancelar cita",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-ban me-2"
        }),
        command: handleCancelAppointment
      });
    }

    // Agregar separador y sección de Cita
    menuItems.push({
      separator: true
    });
    menuItems.push({
      label: "Cita",
      items: [{
        label: "Compartir cita",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-brands fa-whatsapp me-2"
        }),
        command: handleShareAppointment
      }]
    });

    // Agregar separador y sección de Factura
    menuItems.push({
      separator: true
    });
    menuItems.push({
      label: "Factura",
      items: [{
        label: "Imprimir factura",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-print me-2"
        }),
        command: handlePrintInvoice
      }, {
        label: "Descargar factura",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-download me-2"
        }),
        command: handleDownloadInvoice
      }, {
        label: "Compartir por WhatsApp",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-brands fa-whatsapp me-2"
        }),
        command: handleShareInvoiceWhatsapp
      }, {
        label: "Compartir por Email",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-envelope me-2"
        }),
        command: handleShareInvoiceEmail
      }]
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "btn-primary flex items-center gap-2",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.id}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: menuItems,
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.id}`,
      appendTo: document.body,
      style: {
        zIndex: 9999
      }
    }));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-end",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData
    }));
  };
  const columns = [{
    header: "Paciente",
    field: "patientName",
    body: data => /*#__PURE__*/React.createElement("a", {
      href: `verPaciente?id=${data.patientId}`
    }, data.patientName),
    sortable: true
  }, {
    header: "Número de documento",
    field: "patientDNI",
    sortable: true
  }, {
    header: "Fecha Consulta",
    field: "date",
    sortable: true
  }, {
    header: "Hora Consulta",
    field: "time",
    sortable: true
  }, {
    header: "Profesional asignado",
    field: "doctorName",
    sortable: true
  }, {
    header: "Entidad",
    field: "entity",
    sortable: true
  }, {
    header: "Tipo de Cita",
    field: "appointmentType",
    body: data => {
      const typeInfo = getAppointmentTypeInfo(data.user_availability?.appointment_type);
      return /*#__PURE__*/React.createElement("span", {
        className: "d-flex align-items-center gap-2"
      }, /*#__PURE__*/React.createElement("span", null, typeInfo.name));
    },
    sortable: true
  }, {
    header: "Estado",
    field: "status",
    body: data => {
      const color = appointmentStateColorsByKey[data.stateKey] || appointmentStatesColors[data.stateId];
      const text = appointmentStatesByKeyTwo[data.stateKey]?.[data.attentionType] || appointmentStatesByKeyTwo[data.stateKey] || "SIN ESTADO";
      return /*#__PURE__*/React.createElement("span", {
        className: `badge badge-phoenix badge-phoenix-${color}`
      }, text);
    },
    sortable: true
  }, {
    header: "Acciones",
    field: "actions",
    body: actionBodyTemplate,
    exportable: false
  }];
  const [showFormModal, setShowFormModal] = useState({
    isShow: false,
    data: {}
  });
  const handleSubmit = async () => {
    try {
      //@ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", 2);
      if (enviarPDf !== undefined) {
        const dataUpdate = {
          minio_url: enviarPDf
        };
        const examRecipeResultData = {
          exam_recipe_id: selectedAppointment?.exam_recipe_id,
          uploaded_by_user_id: userLogged.id,
          date: new Date().toISOString(),
          result_minio_url: enviarPDf
        };
        await examOrderService.updateMinioFile(selectedExamOrder?.id, dataUpdate);
        await examRecipeResultService.create(examRecipeResultData);
        await examRecipeService.changeStatus(selectedAppointment?.exam_recipe_id, "uploaded");
        SwalManager.success({
          text: "Resultados guardados exitosamente"
        });
      } else {
        console.error("No se obtuvo un resultado válido.");
      }
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
    } finally {
      setShowPdfModal(false);
      setPdfFile(null);
      setPdfPreviewUrl(null);
      refresh();
    }
  };
  useEffect(() => {
    refresh();
  }, [selectedBranch, selectedDate, selectedAppointmentType]);
  const handleMakeClinicalRecordAction = (patientId, appointmentId) => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}&appointment_id=${appointmentId}`;
      }
    });
  };
  const getAppointmentStates = () => {
    return Object.entries(appointmentStateFilters).map(([key, label]) => ({
      value: key,
      label: label
    }));
  };
  const handleCancelAppointmentAction = async data => {
    SwalManager.confirmCancel(async () => {
      await appointmentService.changeStatus(Number(data.id), "cancelled");
      const dataTemplate = {
        tenantId: tenant,
        belongsTo: "cita-canelacion",
        type: "whatsapp"
      };
      const templateAppointment = await fetchTemplate(dataTemplate);
      const finishTemplate = await switchTemplate(templateAppointment.template, "appointments", data);
      sendMessageWhatsapp(data.patient, finishTemplate, null);
      SwalManager.success({
        text: "Cita cancelada exitosamente"
      });
    });
  };
  const sendMessageWhatsapp = useCallback(async (patient, templateFormatted, dataToFile) => {
    let dataMessage = {};
    if (dataToFile !== null) {
      dataMessage = {
        channel: "whatsapp",
        recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
        message_type: "media",
        message: templateFormatted,
        attachment_url: dataToFile?.file_url,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook"
      };
    } else {
      dataMessage = {
        channel: "whatsapp",
        recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
        message_type: "text",
        message: templateFormatted,
        webhook_url: "https://example.com/webhook"
      };
    }
    await sendMessageAppointment.current(dataMessage);
  }, [sendMessageAppointmentHook]);
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
  const handleLoadExamResultsAction = (appointmentId, patientId, productId) => {
    window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&appointment_id=${appointmentId}`;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-25px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-end mb-2"
  }, /*#__PURE__*/React.createElement(AppointmentCreateFormModalButton, null)), /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
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
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "appointment_type",
    className: "form-label"
  }, "Tipo de Cita"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "appointment_type",
    options: appointmentTypes,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    placeholder: "Filtrar por tipo",
    className: "w-100",
    value: selectedAppointmentType,
    onChange: e => setSelectedAppointmentType(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
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
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
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
    onSuccess: () => {
      refresh();
      setShowRescheduleModal(false);
    }
  })));
};