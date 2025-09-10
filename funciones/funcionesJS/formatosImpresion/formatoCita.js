import { generatePDFFromHTML, generatePDFReceipts } from "../exportPDF.js";
import { generarTablaPaciente } from "./tablaDatosPaciente.js";
import { datosUsuario } from "./datosUsuario.js";
import { patientService, userService } from "../../../services/api/index.js";
import { formatDate, getAge } from "../../../services/utilidades.js";

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
    logo: response.logo_consultorio,
    watermark: response.marca_agua,
  };
}
document.addEventListener("DOMContentLoaded", () => {
  consultarData();
});

export async function generarFormatoCita(
  { fechaConsulta, horaConsulta, patientId, creadoEl = null },
  tipo,
  inputId = ""
) {
  const [currentUser, patient] = await Promise.all([
    userService.getLoggedUser(),
    patientService.get(patientId),
  ]);

  console.log("currentUser", currentUser);
  console.log("patient", patient);
  console.log("fechaConsulta", fechaConsulta);
  console.log("horaConsulta", horaConsulta);

  let userName = [
    currentUser?.first_name,
    currentUser?.middle_name,
    currentUser?.last_name,
    currentUser?.second_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  let user = {
    nombre: userName,
    especialidad: currentUser?.specialty.name || "",
    registro_medico: currentUser?.clinical_record || "",
    sello:
      window.location.hostname +
      "/" +
      getUrlImage(currentUser?.image_minio_url || ""),
    firma:
      window.location.hostname +
      "/" +
      getUrlImage(currentUser?.firma_minio_url || ""),
  };

  let patientData = {
    datos_basicos: {
      nombre: [
        patient?.first_name,
        patient?.middle_name,
        patient?.last_name,
        patient?.second_last_name,
      ]
        .filter(Boolean)
        .join(" "),
      documento: patient?.document_number,
      edad: getAge(patient?.date_of_birth),
    },
    datos_generales: {
      entidad: patient?.social_security.entity.name,
      genero: {
        MALE: "Masculino",
        FEMALE: "Femenino",
      }[patient?.gender],
    },
  };

  console.log("user", user);

  const tablePatient = generarTablaPaciente(patientData, {
    date: creadoEl || formatDate(new Date()) || "--",
  });
  let contenido = `
    <div class="container border rounded shadow-sm text-start" style="margin: 0; padding: 0;">
      <h3 class="text-primary text-center" style="margin: 0; padding: 0;">Asignación de Cita</h3>
      <hr style="margin: 0.25rem 0;">
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <div style="font-size: 0.9rem; margin-bottom: 0.25rem;"><span style="font-weight: bold;">Especialidad:</span> ${user.especialidad}</div>
        <div style="font-size: 0.9rem; margin-bottom: 0.25rem;"><span style="font-weight: bold;">Paciente:</span> ${patientData.datos_basicos.nombre}</div>
        <div style="font-size: 0.9rem; margin-bottom: 0.25rem;"><span style="font-weight: bold;">Fecha:</span> ${fechaConsulta}</div>
        <div style="font-size: 0.9rem; margin-bottom: 0.25rem;"><span style="font-weight: bold;">Hora:</span> ${horaConsulta}</div>
        <div style="font-size: 0.9rem; margin-bottom: 0.25rem;"><span style="font-weight: bold;">Médico:</span> ${user.nombre}</div>
      </div>
    </div>
  `;

  contenido += `
    </div>
  `;

  let isDownload = false;
  if (tipo == "Impresion") {
    isDownload = false;
  } else if (tipo == "Descarga") {
    isDownload = true;
  }
  const pdfConfig = {
    name: `Receta_Medica_${patient.document_number}`,
    isDownload: isDownload,
    dimensions: [0, 0, 226.77, 297.77],
  };

  generatePDFReceipts(contenido, pdfConfig);
}

export default generarFormatoReceta;
