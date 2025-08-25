import React, { useCallback, useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { useEffect } from "react";
import { useState } from "react";
import { PatientClinicalRecordsTable } from "./components/PatientClinicalRecordsTable.js";
import { OptometryBillingModal } from "./optometry/modal/OptometryBillingModal.js";
import { Button } from "primereact/button";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { MakeRequestForm } from "../general-request/components/MakeRequestForm.js";
import { useMakeRequest } from "../general-request/hooks/useMakeRequest.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { useClinicalRecordsPendingCancellation } from "./hooks/useClinicalRecordsPendingCancellation.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { useTemplate } from "../hooks/useTemplate.js";
import { formatWhatsAppMessage, getIndicativeByCountry } from "../../services/utilidades.js";
const specialtyId = new URLSearchParams(window.location.search).get("especialidad") || "";
const patientId = new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id") || "";
export const PatientClinicalRecordHistory = () => {
  const {
    clinicalRecords,
    fetchClinicalRecords,
    loading,
    totalRecords
  } = useClinicalRecordsPendingCancellation();
  const {
    makeRequest
  } = useMakeRequest();
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "historia_clinica-compartir",
    type: "whatsapp"
  };
  const {
    template,
    setTemplate,
    fetchTemplate
  } = useTemplate(data);
  const {
    sendMessage: sendMessageWpp,
    responseMsg,
    loading: loadingMessage,
    error
  } = useMassMessaging();
  const sendMessageWppRef = useRef(sendMessageWpp);
  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);
  useEffect(() => {
    fetchClinicalRecords({
      per_page: perPage,
      page: currentPage,
      search: search ?? "",
      patientId: patientId,
      forCurrentUserRole: specialtyId
    });
  }, []);
  const printClinicalRecord = (data, id, title) => {
    //@ts-ignore
    generarFormato("Consulta", data, "Impresion");
    // crearDocumento(id, "Impresion", "Consulta", "Completa", title);
  };
  const downloadClinicalRecord = (id, title) => {
    //@ts-ignore
    generarFormato("Consulta", data, "Descarga");
    // crearDocumento(id, "Descarga", "Consulta", "Completa", title);
  };
  const shareClinicalRecord = (data, type) => {
    switch (type) {
      case "whatsapp":
        sendMessageWhatsapp(data);
        break;
      default:
        break;
    }
  };
  async function generatePdfFile(recordHistory) {
    //@ts-ignore
    generarFormato("Consulta", recordHistory, "Impresion", "recordHistoryInput");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput = document.getElementById("pdf-input-hidden-to-recordHistoryInput");
        let file = fileInput?.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\ClinicalRecords");
        formData.append("model_id", recordHistory.id);
        //@ts-ignore
        guardarArchivo(formData, true).then(response => {
          resolve(response.file);
        }).catch(reject);
      }, 2500);
    });
  }
  const sendMessageWhatsapp = useCallback(async recordHistory => {
    const dataToFile = await generatePdfFile(recordHistory);
    //@ts-ignore
    const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);
    const replacements = {
      NOMBRE_PACIENTE: `${recordHistory.patient.first_name} ${recordHistory.patient.middle_name} ${recordHistory.patient.last_name} ${recordHistory.patient.second_last_name}`,
      ESPECIALISTA: `${recordHistory.user.first_name} ${recordHistory.user.middle_name} ${recordHistory.user.last_name} ${recordHistory.user.second_last_name}`,
      ESPECIALIDAD: `${recordHistory.user.specialty.name}`,
      FECHA_HISTORIA: `${recordHistory.createdAt}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(template.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      recipients: [getIndicativeByCountry(recordHistory.patient.country_id) + recordHistory.patient.whatsapp],
      message_type: "media",
      message: templateFormatted,
      attachment_url: urlPDF,
      attachment_type: "document",
      minio_model_type: dataToFile?.model_type,
      minio_model_id: dataToFile?.model_id,
      minio_id: dataToFile?.id,
      webhook_url: "https://example.com/webhook"
    };
    await sendMessageWppRef.current(dataMessage);
    SwalManager.success({
      text: "Mensaje enviado correctamente",
      title: "Éxito"
    });
    window.location.reload();
  }, [sendMessageWpp]);
  const seeDetail = (id, clinicalRecordType) => {
    window.location.href = `detalleConsulta?clinicalRecordId=${id}&patient_id=${patientId}&tipo_historia=${clinicalRecordType}&especialidad=${specialtyId}`;
  };
  const nombreEspecialidad = new URLSearchParams(window.location.search).get("especialidad");
  const requestCancellation = id => {
    setSelectedClinicalRecord(id);
    setShowCancellationModal(true);
  };
  const handleMakeRequest = async requestData => {
    try {
      if (selectedClinicalRecord) {
        await makeRequest({
          type: "cancellation",
          requestable_id: selectedClinicalRecord,
          requestable_type: "clinical_record",
          notes: requestData.notes || null
        });
        setShowCancellationModal(false);
        refresh();
      } else {
        SwalManager.error({
          text: "No se ha seleccionado ninguna historia clínica",
          title: "Error"
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageChange = page => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchClinicalRecords({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? "",
      patientId: patientId,
      forCurrentUserRole: specialtyId
    });
  };
  const handleSearchChange = _search => {
    setSearch(_search);
    fetchClinicalRecords({
      per_page: perPage,
      page: currentPage,
      search: _search,
      patientId: patientId,
      forCurrentUserRole: specialtyId
    });
  };
  const refresh = () => fetchClinicalRecords({
    per_page: perPage,
    page: currentPage,
    search: search ?? "",
    patientId: patientId,
    forCurrentUserRole: specialtyId
  });
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Historias Cl\xEDnicas - ", nombreEspecialidad)), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Factura Optom\xE9trica",
    icon: "pi pi-plus",
    className: "btn btn-primary",
    onClick: () => setShowBillingModal(true)
  })), /*#__PURE__*/React.createElement(PatientClinicalRecordsTable, {
    records: clinicalRecords,
    onSeeDetail: seeDetail,
    onPrintItem: printClinicalRecord,
    onDownloadItem: downloadClinicalRecord,
    onShareItem: shareClinicalRecord,
    onCancelItem: requestCancellation,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loading,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh
  })), /*#__PURE__*/React.createElement(OptometryBillingModal, {
    show: showBillingModal,
    onHide: () => setShowBillingModal(false),
    onSaveSuccess: () => {
      // Aquí puedes agregar lógica para refrescar datos si es necesario
    }
  }), /*#__PURE__*/React.createElement(CustomFormModal, {
    show: showCancellationModal,
    onHide: () => setShowCancellationModal(false),
    formId: "cancellationForm",
    title: "Solicitud de anulaci\xF3n"
  }, /*#__PURE__*/React.createElement(MakeRequestForm, {
    formId: "cancellationForm",
    onHandleSubmit: handleMakeRequest
  })));
};