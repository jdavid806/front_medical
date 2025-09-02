import { generatePDFFromHTML } from "../exportPDF.js";
import { generarTablaPaciente } from "./tablaDatosPaciente.js";
import { datosUsuario } from "./datosUsuario.js";

let company = {};
let patient = {};
let patient_id = new URLSearchParams(window.location.search).get("patient_id");
let user = {};

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

export async function generarFormatoRecetaOrden(datosExamen, tipo, inputId = "") {
  const tablePatient = generarTablaPaciente(patient, {
    date: datosExamen.created_at || "--",
  });
  user = {
    nombre: datosExamen?.doctor,
    especialidad: datosExamen.user?.user_specialty_name,
    registro_medico: datosExamen.user?.clinical_record || "",
    sello: `https://dev.monaros.co/` + getUrlImage(datosExamen.user?.image_minio_url || ""),
    firma: `https://dev.monaros.co/` + getUrlImage(datosExamen.user?.firma_minio_url || "")
  }
  let contenido = `
   <h3 class="text-primary text-center" style="margin: 0; padding: 0;">Orden de Exámenes</h3>
      <hr style="margin: 0.25rem 0;">
    <div class="container border rounded shadow-sm p-3">
    ${tablePatient}
    <hr style="margin: 0.25rem 0;">
      <h4 class="text-secondary text-start mb-2" style="margin-top: 0; margin-bottom: 5px;">Exámenes Solicitados</h4>
      <div class="card exam-card mb-3 p-2">
        <table style="border-collapse: collapse; width: 100%;">
          <thead style="background-color: #f8f9fa; border: 1px solid #dee2e6;">
            <tr>
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Nombre</th>
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Cantidad</th>
              <th style="border: 1px solid #dee2e6; padding: 8px; text-align: left;">Descripción</th>
            </tr>
          </thead>
          <tbody>
            ${
              datosExamen.details.length > 0
                ? datosExamen.details
                    .map(
                      (detalle) => `
                <tr>
                  <td style="border: 1px black; padding: 8px;">${
                    detalle.exam_type.name
                  }</td>
                  <td style="border: 1px black; padding: 8px;">1</td>
                  <td style="border: 1px black; padding: 8px;">${
                    detalle.exam_type.description || "Sin descripción"
                  }</td>
                </tr>
              `
                    )
                    .join("")
                : `<tr><td colspan="3" style="border: 1px solid #dee2e6; padding: 8px; text-align: center; color: #6c757d; font-style: italic;">No hay exámenes en esta solicitud</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </div>
    ${datosUsuario(user)}  
    `;
  await generatePDFFromHTML(contenido, company, patient, inputId);
}

export default generarFormatoRecetaOrden;
