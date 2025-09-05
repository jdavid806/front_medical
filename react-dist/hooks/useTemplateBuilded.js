import { templateService } from "../../services/api/index.js";
import { formatDate, formatWhatsAppMessage } from "../../services/utilidades.js";
export const useTemplateBuilded = () => {
  async function fetchTemplate(data) {
    try {
      const response = await templateService.getTemplate(data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async function switchTemplate(template, templateType, data) {
    switch (templateType) {
      case "examenes":
        return templateBuildedExams(template, data);
      case "disabilities":
        return templateBuildedDisabilities(template, data);
      case "recipes":
        return templateBuildedRecipes(template, data);
      case "remissions":
        return templateBuildedRemissions(template, data);
      case "appointments":
        return templateBuildedAppoinment(template, data);
      case "clinical_records":
        return templateBuildedClinicalRecords(template, data);
      default:
        break;
    }
  }
  function templateBuildedExams(template, data) {
    const replacements = {
      NOMBRE_PACIENTE: `${data.patient.first_name ?? ""} ${data.patient.middle_name ?? ""} ${data.patient.last_name ?? ""} ${data.patient.second_last_name ?? ""}`,
      NOMBRE_EXAMEN: data.details.map(detail => detail.exam_type.name).join(", "),
      FECHA_EXAMEN: `${formatDate(data.created_at)}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(template, replacements);
    return templateFormatted;
  }
  function templateBuildedDisabilities(template, data) {
    const replacements = {
      NOMBRE_PACIENTE: `${data.patient.first_name} ${data.patient.middle_name} ${data.patient.last_name} ${data.patient.second_last_name}`,
      ESPECIALISTA: `${data.user.first_name} ${data.user.middle_name} ${data.user.last_name} ${data.user.second_last_name}`,
      ESPECIALIDAD: `${data.user.specialty.name}`,
      FECHA_INCIO: `${data.start_date}`,
      FECHA_FIN: `${data.end_date}`,
      DIAS_INCAPACIDAD: `${Math.ceil((new Date(data.end_date).getTime() - new Date(data.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1}`,
      RECOMENDACIONES: `${data.reason}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(template, replacements);
    return templateFormatted;
  }
  function templateBuildedRecipes(template, data) {
    const replacements = {
      NOMBRE_PACIENTE: `${data.patient.first_name} ${data.patient.middle_name} ${data.patient.last_name} ${data.patient.second_last_name}`,
      ESPECIALISTA: `${data.prescriber.first_name} ${data.prescriber.middle_name} ${data.prescriber.last_name} ${data.prescriber.second_last_name}`,
      ESPECIALIDAD: `${data.prescriber.specialty.name}`,
      RECOMENDACIONES: `${convertRichTextToPlainText(data.clinical_record.description)}`,
      FECHA_RECETA: `${formatDate(data.created_at)}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(template, replacements);
    return templateFormatted;
  }
  function templateBuildedRemissions(template, data) {
    const nameRemitterUser = `${data?.remitter_by_user?.first_name ?? ""} ${data?.remitter_by_user?.middle_name ?? ""} ${data?.remitter_by_user?.last_name ?? ""} ${data?.remitter_by_user?.second_last_name ?? ""}`;
    const replacements = {
      NOMBRE_PACIENTE: `${data?.clinical_record?.patient?.first_name ?? ""} ${data?.clinical_record?.patient?.middle_name ?? ""} ${data?.clinical_record?.patient?.last_name ?? ""} ${data?.clinical_record?.patient?.second_last_name ?? ""}`,
      ESPECIALISTA: `${nameRemitterUser}`,
      ESPECIALIDAD: `${data.remitter_by_user.specialty.name}`,
      RECOMENDACIONES: `${data.note}`,
      FECHA_RECETA: `${formatDate(data.created_at)}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(template, replacements);
    return templateFormatted;
  }
  function templateBuildedAppoinment(template, data) {
    const replacements = {
      NOMBRE_PACIENTE: `${data.patient?.first_name ?? ""} ${data.patient?.middle_name ?? ""} ${data.patient?.last_name ?? ""} ${data.patient?.second_last_name ?? ""}`,
      ESPECIALISTA: `${data?.assigned_user_availability?.user?.first_name ?? ""} ${data?.assigned_user_availability?.user?.middle_name ?? ""} ${data?.assigned_user_availability?.user?.second_last_name ?? ""} ${data?.assigned_user_availability?.user?.last_name ?? ""}`,
      ESPECIALIDAD: `${data.assigned_user_availability.user.specialty.name}`,
      FECHA_CITA: `${formatDate(data.appointment_date, true)}`,
      HORA_CITA: `${data.appointment_time}`
    };
    const templateFormatted = formatWhatsAppMessage(template, replacements);
    return templateFormatted;
  }
  function templateBuildedClinicalRecords(template, data) {
    const replacements = {
      NOMBRE_PACIENTE: `${data.patient.first_name ?? ""} ${data.patient.middle_name ?? ""} ${data.patient.last_name ?? ""} ${data.patient.second_last_name ?? ""}`,
      ESPECIALISTA: `${data.appointment.assigned_user_availability.user.first_name ?? ""} ${data.appointment.assigned_user_availability.user.middle_name ?? ""} ${data.appointment.assigned_user_availability.user.last_name ?? ""} ${data.appointment.assigned_user_availability.user.second_last_name ?? ""}`,
      ESPECIALIDAD: `${data.appointment.assigned_user_availability.user.specialty.name}`,
      FECHA_HISTORIA: `${formatDate(data.created_at)}`,
      "ENLACE DOCUMENTO": ""
    };
    const templateFormatted = formatWhatsAppMessage(template, replacements);
    return templateFormatted;
  }
  function convertRichTextToPlainText(richText) {
    if (!richText || typeof richText !== "string") {
      return "";
    }

    // Convertir etiquetas <p> a texto en negrita
    let plainText = richText.replace(/<p>(.*?)<\/p>/gi, "**$1**\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<strong>(.*?)<\/strong>/gi, "**$1**").replace(/<b>(.*?)<\/b>/gi, "**$1**").replace(/<em>(.*?)<\/em>/gi, "*$1*").replace(/<i>(.*?)<\/i>/gi, "*$1*");

    // Eliminar todas las demás etiquetas HTML
    plainText = plainText.replace(/<[^>]*>/g, "");

    // Decodificar entidades HTML
    const textArea = document.createElement("textarea");
    textArea.innerHTML = plainText;
    return textArea.value.trim();
  }
  return {
    fetchTemplate,
    switchTemplate
  };
};