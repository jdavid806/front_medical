import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { useExamRecipes } from "./hooks/useExamRecipes.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { examRecipeService } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { examRecipeStatus, examRecipeStatusColors } from "../../services/commons.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { Menu } from "primereact/menu";
import { useTemplate } from "../hooks/useTemplate.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { formatDate, formatWhatsAppMessage, getIndicativeByCountry } from "../../services/utilidades.js";
const patientId = new URLSearchParams(window.location.search).get("patient_id");
export const ExamRecipesApp = () => {
  const {
    examRecipes,
    fetchExamRecipes
  } = useExamRecipes(patientId);
  const [tableExamRecipes, setTableExamRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "examenes-compartir",
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
    const mappedExamRecipes = examRecipes.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).map(prescription => ({
      id: prescription.id,
      doctor: `${prescription.user.first_name || ""} ${prescription.user.middle_name || ""} ${prescription.user.last_name || ""} ${prescription.user.second_last_name || ""}`,
      exams: prescription.details.map(detail => detail.exam_type.name).join(", "),
      patientId: prescription.patient_id,
      created_at: new Intl.DateTimeFormat("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(prescription.created_at)),
      status: prescription.status,
      resultMinioUrl: prescription.result?.result_minio_url,
      user: prescription.user,
      details: prescription.details,
      original: prescription,
      updated_at: prescription.result_updated_at_formatted
    }));
    setTableExamRecipes(mappedExamRecipes);
    setTotalRecords(mappedExamRecipes.length);
  }, [examRecipes]);
  const cancelPrescription = async id => {
    SwalManager.confirmCancel(async () => {
      try {
        await examRecipeService.cancel(id);
        SwalManager.success({
          title: "Receta anulada",
          text: "La receta ha sido anulada correctamente."
        });
        fetchExamRecipes(patientId);
      } catch (error) {
        SwalManager.error({
          title: "Error",
          text: "No se pudo anular la receta."
        });
      }
    });
  };
  async function generatePdfFile(prescription) {
    if (prescription?.result?.result_minio_url) {
      //@ts-ignore
      const url = await getUrlImage(prescription.result.result_minio_url, true);
      return {
        file_url: url,
        model_type: "xxxxxxx",
        model_id: 0,
        id: 0
      };
    } else {
      //@ts-ignore
      await generarFormato("RecetaExamen", prescription, "Impresion", "prescriptionInput");
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
          formData.append("model_type", "App\\Models\\ExamRecipes");
          formData.append("model_id", prescription.id);
          //@ts-ignore
          guardarArchivo(formData, true).then(async response => {
            resolve({
              file_url: await getUrlImage(response.file.file_url.replaceAll("\\", "/"), true),
              model_type: response.file.model_type,
              model_id: response.file.model_id,
              id: response.file.id
            });
          }).catch(reject);
        }, 1000);
      });
    }
  }
  const sendMessageWhatsapp = useCallback(async exam => {
    const templateExam = await fetchTemplateRef.current();
    const dataToFile = await generatePdfFile(exam);
    const replacements = {
      NOMBRE_PACIENTE: `${exam.patient.first_name ?? ""} ${exam.patient.middle_name ?? ""} ${exam.patient.last_name ?? ""} ${exam.patient.second_last_name ?? ""}`,
      NOMBRE_EXAMEN: exam.details.map(detail => detail.exam_type.name).join(", "),
      FECHA_EXAMEN: `${formatDate(exam.created_at)}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(templateExam.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      recipients: [getIndicativeByCountry(exam.patient.country_id) + exam.patient.whatsapp],
      message_type: "media",
      message: templateFormatted,
      attachment_url: dataToFile?.file_url,
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
  const seeExamRecipeResults = async minioUrl => {
    if (minioUrl) {
      //@ts-ignore
      const url = await getUrlImage(minioUrl);
      window.open(url, "_blank");
    }
  };
  const handlePageChange = event => {
    setFirst(event.first);
    setRows(event.rows);
  };
  const handleSearchChange = value => {
    setGlobalFilter(value);
  };
  const handleReload = () => {
    fetchExamRecipes(patientId);
  };
  const columns = [{
    field: "doctor",
    header: "Doctor",
    sortable: true
  }, {
    field: "exams",
    header: "Exámenes recetados",
    sortable: true
  }, {
    field: "created_at",
    header: "Fecha de creación",
    sortable: true
  }, {
    field: "updated_at",
    header: "Fecha de subida",
    sortable: true
  }, {
    field: "status",
    header: "Estado",
    body: rowData => {
      const color = examRecipeStatusColors[rowData.status];
      const text = examRecipeStatus[rowData.status] || "SIN ESTADO";

      // Mapear colores de Phoenix a PrimeReact
      const severityMap = {
        success: "success",
        warning: "warning",
        danger: "danger",
        info: "info",
        primary: null,
        // No hay equivalente directo, usar secondary
        secondary: null
      };
      const severity = severityMap[color] || "secondary";
      return /*#__PURE__*/React.createElement(Badge, {
        value: text,
        severity: severity,
        className: "p-badge-lg"
      });
    }
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(TableActionsMenu, {
      rowData: rowData,
      onPrint: () => {
        generarFormato("RecetaExamen", rowData, "Impresion");
      },
      onDownload: () => {
        generarFormato("RecetaExamen", rowData, "Descarga");
      },
      onViewResults: () => {
        seeExamRecipeResults(rowData.resultMinioUrl);
      },
      onCancel: () => cancelPrescription(rowData.id),
      onShare: async () => {
        sendMessageWhatsapp(rowData.original);
        // const user = await userService.getLoggedUser();

        //@ts-ignore
        // enviarDocumento(
        //   rowData.id,
        //   "Descarga",
        //   "RecetaExamen",
        //   "Completa",
        //   rowData.patientId,
        //   user.id,
        //   "Receta_de_examenes"
        // );
      }
    })
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableExamRecipes,
    lazy: false,
    first: first,
    rows: rows,
    totalRecords: totalRecords,
    loading: loading,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: handleReload
  }))));
};
const TableActionsMenu = ({
  rowData,
  onPrint,
  onDownload,
  onViewResults,
  onCancel,
  onShare
}) => {
  const menu = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const items = [...(rowData.status === "pending" ? [{
    label: "Anular receta",
    icon: "pi pi-times",
    command: () => {
      onCancel();
    }
  }] : []), ...(rowData.status === "uploaded" ? [{
    label: "Visualizar resultados",
    icon: "pi pi-eye",
    command: () => {
      onViewResults();
    }
  }, {
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
  }] : [])];
  const handleMenuHide = () => {
    setOpenMenuId(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "table-actions-menu"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded btn-primary",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${rowData.id}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fa fa-cog ml-2"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: items,
    popup: true,
    ref: menu,
    id: `popup_menu_${rowData.id}`,
    onHide: handleMenuHide,
    appendTo: typeof document !== "undefined" ? document.body : undefined
  }));
};