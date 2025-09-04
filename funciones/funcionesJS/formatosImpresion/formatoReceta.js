import { generatePDFFromHTML } from "../exportPDF.js";
import { generarTablaPaciente } from "./tablaDatosPaciente.js";
import { datosUsuario } from "./datosUsuario.js";

let company = {};
let patient = {};
let patient_id = new URLSearchParams(window.location.search).get("patient_id");

async function consultarData() {
  const response = await consultarDatosEmpresa();
  const responePatient = await consultarDatosPaciente(patient_id);

  patient = responePatient;
  company = {
    legal_name: response.nombre_consultorio,
    document_number: response.datos_consultorio[0].RNC,
    address: response.datos_consultorio[1].Dirección,
    phone: response.datos_consultorio[2].Teléfono,
    email: response.datos_consultorio[3].Correo,
  };
}
document.addEventListener("DOMContentLoaded", () => {
  consultarData();
});

export async function generarFormatoReceta(
  receta,
  tipo,
  inputId = "",
  configDefault = false
) {
  let userName = [
    receta.prescriber?.first_name,
    receta.prescriber?.middle_name,
    receta.prescriber?.last_name,
    receta.prescriber?.second_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  let user = {
    nombre: userName,
    especialidad: receta.prescriber?.specialty.name || "",
    registro_medico: receta.prescriber?.clinical_record || "",
    sello:
      `https://dev.monaros.co/` +
      getUrlImage(receta.prescriber?.image_minio_url || ""),
    firma:
      `https://dev.monaros.co/` +
      getUrlImage(receta.prescriber?.firma_minio_url || ""),
  };

  const tablePatient = generarTablaPaciente(patient, {
    date: receta.created_at || "--",
  });
  let contenido = `
    <div class="container border rounded shadow-sm text-start" style="margin: 0; padding: 0;">
    <h3 class="text-primary text-center" style="margin: 0; padding: 0;">Receta Médica</h3>
      <hr style="margin: 0.25rem 0;">
         ${tablePatient}
  `;

  if (receta.recipe_items.length > 0) {
    receta.recipe_items.forEach((item, index) => {
      contenido += `
      <hr style="margin: 0.25rem 0;">
          <div style="margin-bottom: 5px; font-size: 12px">
            <p style="margin: 0;"><strong>${index + 1}. Nombre:</strong> ${
        item.medication
      } - ${item.concentration} - <strong>Tipo:</strong> ${item.medication_type}
            <strong>Frecuencia:</strong> ${
              item.frequency
            } - <strong>Duración:</strong> ${
        item.duration
      } días - <strong>Toma cada:</strong> ${
        item.take_every_hours
      } horas - <strong>Cantidad:</strong> ${item.quantity}</p>
            <p style="margin: 0;"><strong>Observaciones:</strong> ${
              item.observations || "Sin observaciones"
            }</p>
          </div>
          <hr>`;
    });
  } else {
    contenido += `
        <p class="text-muted fst-italic">No hay medicamentos en esta receta</p>`;
  }

  contenido += `
    </div>
  </div>
  <div style="font-size: 12px">
  ${datosUsuario(user)}
  </div>
  `;

  let isDownload = false;
  if (tipo == "Impresion") {
    isDownload = false;
  } else if (tipo == "Descarga") {
    isDownload = true;
  }

  let pdfConfig = {};
  if (configDefault) {
    pdfConfig = {
      name: `Receta_Medica_${patient.datos_basicos.documento}`,
      isDownload: isDownload,
      orientation: "landscape",
    };
  } else {
    pdfConfig = {
      name: `Receta_Medica_${patient.datos_basicos.documento}`,
      isDownload: isDownload,
      dimensions: [0, 0, 396, 612],
      orientation: "landscape",
    };
  }

  await generatePDFFromHTML(contenido, company, pdfConfig, inputId);
}

export default generarFormatoReceta;
