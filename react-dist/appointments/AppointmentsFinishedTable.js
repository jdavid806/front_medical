import React, { useEffect, useState } from "react";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { Calendar } from "primereact/calendar";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { PreadmissionForm } from "./PreadmissionForm.js";
import { appointmentService } from "../../services/api/index.js";
import { appointmentStatesColors, appointmentStateColorsByKey, appointmentStatesByKeyTwo } from "../../services/commons.js";
import { ExamResultsFileForm } from "../exams/components/ExamResultsFileForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { PrimeReactProvider } from "primereact/api";
export const AppointmentsFinishedTable = () => {
  const patientId = new URLSearchParams(window.location.search).get("patient_id") || null;
  const startDate = new Date(new Date().setDate(new Date().getDate() - 7));
  const endDate = new Date();
  const [selectedDate, setSelectedDate] = React.useState([startDate, endDate]);
  const getCustomFilters = () => {
    return {
      patientId,
      sort: "-appointment_date,-appointment_time",
      appointmentState: "consultation_completed",
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
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showLoadExamResultsFileModal, setShowLoadExamResultsFileModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null); // Para almacenar el archivo PDF
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // Para la previsualización del PDF
  const [showPdfModal, setShowPdfModal] = useState(false); // Para controlar la visibilidad del modal de PDF

  const columns = [{
    header: "Paciente",
    field: "patientName",
    body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: `postConsultationGestion?patientId=${data.patientId}`
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
  const handleHideFormModal = () => {
    setShowFormModal({
      isShow: false,
      data: {}
    });
  };
  useEffect(() => {
    refresh();
  }, [selectedDate]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
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
    placeholder: "Seleccione un rango",
    appendTo: "self",
    panelStyle: {
      zIndex: 100000
    }
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
  }, /*#__PURE__*/React.createElement(ExamResultsFileForm, null))));
};