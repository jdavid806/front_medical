import React, { useCallback, useEffect, useRef, useState } from "react";
import { useExamRecipes } from "./hooks/useExamRecipes.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { PrintTableAction } from "../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../components/table-actions/ShareTableAction.js";
import CustomDataTable from "../components/CustomDataTable.js";
import { examRecipeService } from "../../services/api/index.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { examRecipeStatus, examRecipeStatusColors } from "../../services/commons.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { useTemplate } from "../hooks/useTemplate.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { formatWhatsAppMessage, getIndicativeByCountry } from "../../services/utilidades.js";
const patientId = new URLSearchParams(window.location.search).get("patient_id");
export const ExamRecipesApp = () => {
  const {
    examRecipes,
    fetchExamRecipes
  } = useExamRecipes(patientId);
  const [tableExamRecipes, setTableExamRecipes] = useState([]);
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
    const mappedExamRecipes = examRecipes.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)).map(prescription => {
      return {
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
        patient: prescription.patient
      };
    });
    setTableExamRecipes(mappedExamRecipes);
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
  const seeExamRecipeResults = async minioUrl => {
    if (minioUrl) {
      //@ts-ignore
      const url = await getUrlImage(minioUrl);
      window.open(url, "_blank");
    }
  };
  async function generatePdfFile(exam) {
    if (exam.resultMinioUrl) {
      //@ts-ignore
      return {
        file_url: exam.resultMinioUrl,
        model_type: "xxxxxxx",
        model_id: 0,
        id: 0
      };
    } else {
      //@ts-ignore
      generarFormato("RecetaExamen", exam, "Impresion", "examInput");
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let fileInput = document.getElementById("pdf-input-hidden-to-examInput");
          let file = fileInput?.files[0];
          if (!file) {
            resolve(null);
            return;
          }
          let formData = new FormData();
          formData.append("file", file);
          formData.append("model_type", "App\\Models\\exam");
          formData.append("model_id", exam.id);
          //@ts-ignore
          guardarArchivo(formData, true).then(response => {
            resolve(response.file);
          }).catch(reject);
        }, 2000);
      });
    }
  }
  const sendMessageWhatsapp = useCallback(async exam => {
    console.log("Sending message for exam", exam);
    const templateExam = await fetchTemplateRef.current();
    const dataToFile = await generatePdfFile(exam);
    console.log("dataToFile", dataToFile);
    const replacements = {
      NOMBRE_PACIENTE: `${exam.patient.first_name ?? ""} ${exam.patient.middle_name ?? ""} ${exam.patient.last_name ?? ""} ${exam.patient.second_last_name ?? ""}`,
      NOMBRE_EXAMEN: `${exam.details.map(detail => detail.exam_type.name).join(" ,")}`,
      FECHA_EXAMEN: `${exam.created_at}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(templateExam.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      recipients: [getIndicativeByCountry(exam.patient.country_id) + exam.patient.whatsapp],
      message_type: "media",
      message: templateFormatted,
      //@ts-ignore
      attachment_url: await getUrlImage(dataToFile.file_url, true).replace(/\\/g, "/"),
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
    data: "doctor"
  }, {
    data: "exams"
  }, {
    data: "created_at"
  }, {
    data: "status"
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    3: (cell, data) => {
      const color = examRecipeStatusColors[data.status];
      const text = examRecipeStatus[data.status] || "SIN ESTADO";
      return /*#__PURE__*/React.createElement("span", {
        className: `badge badge-phoenix badge-phoenix-${color}`
      }, text);
    },
    4: (cell, data) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "text-end flex justify-cointent-end"
    }, /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement(PrintTableAction, {
      onTrigger: () => {
        //@ts-ignore
        generarFormato("RecetaExamen", data, "Impresion");
        // crearDocumento(
        //   data.id,
        //   "Impresion",
        //   "RecetaExamen",
        //   "Completa",
        //   "Receta_de_examenes"
        // );
      }
    }), /*#__PURE__*/React.createElement(DownloadTableAction, {
      onTrigger: () => {
        //@ts-ignore
        generarFormato("RecetaExamen", data, "Descarga");
        // crearDocumento(
        //   data.id,
        //   "Descarga",
        //   "RecetaExamen",
        //   "Completa",
        //   "Receta_de_examenes"
        // );
      }
    }), data.status === "uploaded" && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      id: "cargarResultadosBtn",
      onClick: () => seeExamRecipeResults(data.resultMinioUrl)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-eye",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Visualizar resultados")))), data.status === "pending" && /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => cancelPrescription(data.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-ban",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Anular receta")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("hr", {
      className: "dropdown-divider"
    })), /*#__PURE__*/React.createElement("li", {
      className: "dropdown-header"
    }, "Compartir"), /*#__PURE__*/React.createElement(ShareTableAction, {
      shareType: "whatsapp",
      onTrigger: async () => {
        sendMessageWhatsapp(data);
      }
    }))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: tableExamRecipes,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Doctor"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Examenes recetados"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};