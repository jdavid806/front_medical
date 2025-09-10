import { generatePDFFromHTMLV2 } from "../exportPDFV2.js";
import { generarTablaPaciente } from "./tablaDatosPaciente.js";

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

export async function generarFormatoOrden(orden, tipo) {

  let state = getOrdenState(orden.exam_order_state.name);

  const tablePatient = generarTablaPaciente(patient, {
    date: orden.dateTime || "--",
  });

  let contenido = `
  <div class="container border rounded shadow-sm text-start">
    <h3 class="text-primary text-center" style="margin-top: 0; margin-bottom: 0;">Orden de Examen Médico</h3>
    <hr style="margin: 0.25rem 0;">
  ${tablePatient}
  <hr style="margin: 0.25rem 0;">
    <h4 class="text-secondary" style="margin-top: 0; margin-bottom: 0;">Detalles del examen:</h4>
    <div style="display: table; width: 100%;">
  <div style="display: table-row;">
    <div style="display: table-cell; width: 50%;"><p style="margin: 0;"><strong>Tipo de examen:</strong> ${orden.exam_type.name}</p></div>
    <div style="display: table-cell; width: 50%;"><p style="margin: 0;"><strong>Estado:</strong> ${state}</p></div>
  </div>
</div>
    <hr style="margin: 0.25rem 0;">
  `;

  const result = orden?.exam_result?.results || {};
  const defaultForm = orden.exam_type.form_config.values || {};
  const filledForm = { ...defaultForm };

  for (const key in result) {
    if (result.hasOwnProperty(key) && filledForm.hasOwnProperty(key)) {
      filledForm[key] = result[key];
    }
  }

  orden.exam_type.form_config.values = filledForm;

  // Iteramos por las tarjetas y campos dinámicos del examen
  orden.exam_type.form_config.tabs.forEach((tab) => {
    contenido += `<h4 class="text-secondary" style="margin-top: 0; margin-bottom: 0;">${tab.tab}</h4>`;

    tab.cards.forEach((card) => {
      contenido += `<h5 class="text-primary" style="margin-top: 0; margin-bottom: 0;">${card.title}</h5>`;

      card.fields.forEach((field) => {
        contenido += `
        <p style="margin-bottom: 0; margin-top: 0;"><strong>${
          field.label
        }</strong></p>
        <div style="margin-bottom: 0; margin-top: 0;">${
          orden.exam_type.form_config.values[field.id] || "Sin datos"
        }</div>
        `;
      });
    });
    contenido += `<hr style="margin: 0.25rem 0;">`;
  });

  contenido += `</div>`;

  await generatePDFFromHTMLV2(contenido, company, patient);
}
