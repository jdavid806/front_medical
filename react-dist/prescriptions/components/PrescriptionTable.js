import React, { useCallback, useEffect, useRef, useState } from "react";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF.js";
import { useTemplate } from "../../hooks/useTemplate.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";
import { formatWhatsAppMessage, getIndicativeByCountry } from "../../../services/utilidades.js";
import { SwalManager } from "../../../services/alertManagerImported.js";

// PrimeReact imports
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomPRTable } from "../../components/CustomPRTable.js";
const PrescriptionTable = ({
  prescriptions,
  onEditItem,
  onDeleteItem
}) => {
  const [tablePrescriptions, setTablePrescriptions] = useState([]);
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
  async function generatePdfFile(prescription) {
    //@ts-ignore
    await generarFormato("Receta", prescription, "Impresion", "prescriptionInput");
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
      }, 1000);
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
      FECHA_RECETA: `${prescription.created_at}`,
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
  const columns = [{
    field: "doctor",
    header: "Doctor",
    sortable: true,
    width: '200px'
  }, {
    field: "created_at",
    header: "Fecha de creación",
    sortable: true,
    width: '200px'
  }, {
    field: "actions",
    header: "Acciones",
    width: '10%',
    body: data => /*#__PURE__*/React.createElement(TableActionsMenu, {
      data: data,
      onPrint: () => {
        generarFormato("Receta", data, "Impresion");
      },
      onDownload: () => {
        generarFormato("Receta", data, "Descarga");
      },
      onShare: () => {
        sendMessageWhatsapp(data);
      },
      onEdit: () => onEditItem(data.id),
      onDelete: () => onDeleteItem(data.id)
    })
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card p-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tablePrescriptions,
    lazy: false
  }))), /*#__PURE__*/React.createElement("style", null, `
             .table-actions-menu{
             }
      `));
};
const TableActionsMenu = ({
  data,
  onPrint,
  onDownload,
  onShare,
  onEdit,
  onDelete
}) => {
  const menu = useRef(null);
  const items = [{
    label: "Imprimir",
    icon: "pi pi-print",
    command: () => {
      onPrint();
    }
  }, {
    label: "Descargar",
    icon: "pi pi-download",
    command: () => {
      onDownload();
    }
  }, {
    separator: true
  }, {
    label: "Compartir",
    icon: "pi pi-share-alt",
    items: [{
      label: "WhatsApp",
      icon: "pi pi-whatsapp",
      command: () => {
        onShare();
      }
    }]
  }, {
    separator: true
  }, {
    label: "Editar",
    icon: "pi pi-pencil",
    command: () => {
      onEdit();
    }
  }, {
    label: "Eliminar",
    icon: "pi pi-trash",
    command: () => {
      onDelete();
    }
  }];
  const handleMenuHide = () => {
    // Función para manejar el cierre del menú
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "table-actions-menu"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-ellipsis-v",
    className: "p-button-rounded btn-primary",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${data.id}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog ml-2"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: items,
    popup: true,
    ref: menu,
    id: `popup_menu_${data.id}`,
    onHide: handleMenuHide,
    appendTo: typeof document !== 'undefined' ? document.body : undefined
  }));
};
export default PrescriptionTable;