import React, { useCallback, useEffect, useRef } from "react";
import CustomDataTable from "../../components/CustomDataTable.js";
import { PrintTableAction } from "../../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../../components/table-actions/ShareTableAction.js";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper.js";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF.js";
import { useTemplate } from "../../hooks/useTemplate.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";
import { formatWhatsAppMessage, getIndicativeByCountry } from "../../../services/utilidades.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
const PrescriptionTable = ({
  prescriptions,
  onEditItem,
  onDeleteItem
}) => {
  const [tablePrescriotions, setTablePrescriptions] = React.useState([]);
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "recetas-compartir",
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
  const fetchTemplateRef = useRef(fetchTemplate);
  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);
  useEffect(() => {
    fetchTemplateRef.current = fetchTemplate;
  }, [fetchTemplate]);
  useEffect(() => {
    const mappedPrescriptions = prescriptions.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).map(prescription => ({
      id: prescription.id,
      doctor: `${prescription.prescriber.first_name} ${prescription.prescriber.last_name}`,
      prescriber: prescription.prescriber,
      patient: prescription.patient,
      recipe_items: prescription.recipe_items,
      clinical_record: prescription.clinical_record,
      created_at: new Intl.DateTimeFormat("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(prescription.created_at))
    }));
    setTablePrescriptions(mappedPrescriptions);
  }, [prescriptions]);
  const columns = [{
    data: "doctor"
  }, {
    data: "created_at"
  }, {
    orderable: false,
    searchable: false
  }];
  async function generatePdfFile(prescription) {
    //@ts-ignore
    generarFormato("Receta", prescription, "Impresion", "prescriptionInput");
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput = document.getElementById("pdf-input-hidden-to-prescriptionInput");
        let file = fileInput?.files[0];
        if (!file) {
          resolve(null);
          return;
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\ClinicalRecords");
        formData.append("model_id", prescription.id);
        //@ts-ignore
        guardarArchivo(formData, true).then(response => {
          resolve(response.file);
        }).catch(reject);
      }, 1500);
    });
  }
  const sendMessageWhatsapp = useCallback(async prescription => {
    const templatePrescriptions = await fetchTemplateRef.current();
    const dataToFile = await generatePdfFile(prescription);
    //@ts-ignore
    const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);
    const replacements = {
      NOMBRE_PACIENTE: `${prescription.patient.first_name} ${prescription.patient.middle_name} ${prescription.patient.last_name} ${prescription.patient.second_last_name}`,
      ESPECIALISTA: `${prescription.prescriber.first_name} ${prescription.prescriber.middle_name} ${prescription.prescriber.last_name} ${prescription.prescriber.second_last_name}`,
      ESPECIALIDAD: `${prescription.prescriber.specialty.name}`,
      RECOMENDACIONES: `${prescription.clinical_record.description}`,
      FECHA_RECETA: `${prescription.createdAt}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(templatePrescriptions.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      recipients: [getIndicativeByCountry(prescription.patient.country_id) + prescription.patient.whatsapp],
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
  }, [sendMessageWpp, fetchTemplate]);
  const slots = {
    2: (cell, data) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "text-end flex justify-cointent-end"
    }, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(PrintTableAction, {
      onTrigger: () => {
        //@ts-ignore
        // crearDocumento(data.id, "Impresion", "Receta", "Completa", "Receta");
        // console.log("data", data);
        generarFormato("Receta", data, "Impresion");
      }
    }), /*#__PURE__*/React.createElement(DownloadTableAction, {
      onTrigger: () => {
        //@ts-ignore
        generarFormato("Receta", data, "Descarga");
      }
    }), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("hr", {
      className: "dropdown-divider"
    })), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Compartir"), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "whatsapp",
      onTrigger: () => {
        sendMessageWhatsapp(data);
      }
    }))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tablePrescriotions,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Doctor"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};
export default PrescriptionTable;