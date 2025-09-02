import { generatePDFFromHTML } from "../exportPDF.js";
import { generarTablaPaciente } from "./tablaDatosPaciente.js";
import { datosUsuario } from "./datosUsuario.js";

let companyData = {};
let patientData = {};
let usersMap = {};
let user = {};
let patient_id = new URLSearchParams(window.location.search).get("patient_id");

async function consultarData() {
  const response = await consultarDatosEmpresa();
  const responePatient = await consultarDatosPaciente(patient_id);

  // console.log("usersData", globalThis);

  patientData = responePatient;
  companyData = {
    legal_name: response.nombre_consultorio,
    document_number: response.datos_consultorio[0].RNC,
    address: response.datos_consultorio[1].Dirección,
    phone: response.datos_consultorio[2].Teléfono,
    email: response.datos_consultorio[3].Correo,
  };

  // Promise.all(globalThis.usersData).then((resultados) => {
  //   console.log("resultados", resultados);
  // });
  // usersMap = await globalThis.usersData;
  // console.log("usersMap", usersMap);
}
document.addEventListener("DOMContentLoaded", () => {
  consultarData();
});

export async function generarFormatoIncapacidad(incapacidad, tipo, inputId = "") {
  console.log(incapacidad);
  const tablePatient = generarTablaPaciente(patientData, {
    date: formatearFechaQuitarHora(incapacidad.created_at || "--"),
  });
  let userName = [
  incapacidad.user?.first_name,
  incapacidad.user?.middle_name,
  incapacidad.user?.last_name,
  incapacidad.user?.second_last_name
].filter(Boolean).join(" ");

  let user = {
    nombre: userName,
    especialidad: incapacidad.user?.user_specialty_name || "",
    registro_medico: incapacidad.user?.clinical_record || "",
    sello: `https://dev.monaros.co/` + getUrlImage(incapacidad.user?.image_minio_url || ""),
    firma: `https://dev.monaros.co/` + getUrlImage(incapacidad.user?.firma_minio_url || "")
  }

  let contenido = `
    <h3 class="text-primary" style="margin-top: 0; margin-bottom: 5px;">Certificado de Incapacidad</h3>
      <hr style="margin: 0.25rem 0;">
      ${tablePatient}
  </table>
    <div class="container p-2 border rounded shadow-sm">
      <hr style="margin: 0.25rem 0;">
      <div style="width: 100%; margin-bottom: 0; margin-top: 0">
          <p style="display: inline-block; width: 49%; margin-bottom: 5px"><strong>Desde:</strong> ${incapacidad.start_date}</p>
          <p style="display: inline-block; width: 49%; margin-bottom: 5px"><strong>Hasta:</strong> ${incapacidad.end_date}</p>
      </div>
      <div style="margin-top: 0;">
      <p style="margin: 0;"><strong>Motivo de Incapacidad: </strong> ${incapacidad.reason}</p>
      </div>
    </div>
    <div style="font-size: 12px;">
    ${datosUsuario(user)}
    </div>`;
    

  let isDownload = false;
  if (tipo == "Impresion") {
    isDownload = false;
  } else if (tipo == "Descarga") {
    isDownload = true;
  }
  const pdfConfig = {
    name: `Incapacidad_Médica_${patientData.datos_basicos.documento}`,
    isDownload: isDownload,
     dimensions: [0, 0, 396, 612],
    orientation: "landscape",
  };

  await generatePDFFromHTML(contenido, companyData, pdfConfig, inputId);
}

export default generarFormatoIncapacidad;
