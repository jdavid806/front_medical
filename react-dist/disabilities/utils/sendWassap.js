import { formatWhatsAppMessage, getIndicativeByCountry } from "../../../services/utilidades.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF.js";
async function generatePdfFile(disabilityHistory) {
  //@ts-ignore
  await generarFormato("Incapacidad", disabilityHistory, "Impresion", "recordDisabilityInput");
  return new Promise((resolve, reject) => {
    const checkForFile = (attempts = 0) => {
      const maxAttempts = 20; // Máximo 10 segundos (20 * 500ms)

      let fileInput = document.getElementById("pdf-input-hidden-to-recordDisabilityInput");
      let file = fileInput?.files[0];
      if (file) {
        // Archivo encontrado, proceder con el guardado
        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\Disabilities");
        formData.append("model_id", disabilityHistory.id);
        //@ts-ignore
        guardarArchivo(formData, true).then(response => {
          resolve(response.file);
        }).catch(reject);
      } else if (attempts < maxAttempts) {
        // Reintentar después de 500ms
        setTimeout(() => checkForFile(attempts + 1), 500);
      } else {
        // Se agotaron los intentos
        console.error("PDF generation timed out after", maxAttempts * 500, "ms");
        resolve(null);
      }
    };

    // Iniciar verificación después de 1 segundo inicial
    setTimeout(() => checkForFile(), 1000);
  });
}
export const sendMessageWhatsapp = async (recordHistory, template, sendMessageWppRef) => {
  const dataToFile = await generatePdfFile(recordHistory);
  //@ts-ignore
  const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);
  const replacements = {
    NOMBRE_PACIENTE: `${recordHistory.patient.first_name} ${recordHistory.patient.middle_name} ${recordHistory.patient.last_name} ${recordHistory.patient.second_last_name}`,
    ESPECIALISTA: `${recordHistory.user.first_name} ${recordHistory.user.middle_name} ${recordHistory.user.last_name} ${recordHistory.user.second_last_name}`,
    ESPECIALIDAD: `${recordHistory.user.specialty.name}`,
    FECHA_INCIO: `${recordHistory.start_date}`,
    FECHA_FIN: `${recordHistory.end_date}`,
    DIAS_INCAPACIDAD: `${Math.ceil((new Date(recordHistory.end_date).getTime() - new Date(recordHistory.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1}`,
    RECOMENDACIONES: `${recordHistory.reason}`,
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
};