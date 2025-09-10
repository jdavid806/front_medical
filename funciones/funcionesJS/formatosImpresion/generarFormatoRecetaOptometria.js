import { generatePDFFromHTMLV2 } from "../exportPDFV2.js";
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
    logo: response.logo_consultorio,
    watermark: response.marca_agua,
  };
}
document.addEventListener("DOMContentLoaded", () => {
  consultarData();
});

export function generarFormatoRecetaOptometria(receta, tipo) {
  let userName = [
    receta.created_by_user?.first_name,
    receta.created_by_user?.middle_name,
    receta.created_by_user?.last_name,
    receta.created_by_user?.second_last_name,
  ]
    .filter(Boolean)
    .join(" ");

  let user = {
    nombre: userName,
    especialidad: receta.created_by_user?.user_specialty_id || "",
    registro_medico: receta.created_by_user?.clinical_record || "",
    sello: receta.created_by_user?.image_file || "",
    firma: receta.created_by_user?.firma_file || "",
  };

  const tablePatient = generarTablaPaciente(patient, {
    date: receta.created_at || "--",
  });

  const dataJson = JSON.parse(receta.optometry_item.details);

  const camposQueratometria = {
    queratometriaOjoDerecho: dataJson.queratometriaOjoDerecho,
    esferaOjoDerecho: dataJson.esferaOjoDerecho,
    cilindroOjoDerecho: dataJson.cilindroOjoDerecho,
    ejeOjoDerecho: dataJson.ejeOjoDerecho,
    adicionOjoDerecho: dataJson.adicionOjoDerecho,
    alturaOjoDerecho: dataJson.alturaOjoDerecho,
    dpOjoDerecho: dataJson.dpOjoDerecho,

    queratometriaOjoIzquierdo: dataJson.queratometriaOjoIzquierdo,
    esferaOjoIzquierdo: dataJson.esferaOjoIzquierdo,
    cilindroOjoIzquierdo: dataJson.cilindroOjoIzquierdo,
    ejeOjoIzquierdo: dataJson.ejeOjoIzquierdo,
    adicionOjoIzquierdo: dataJson.adicionOjoIzquierdo,
    alturaOjoIzquierdo: dataJson.alturaOjoIzquierdo,
    dpOjoIzquierdo: dataJson.dpOjoIzquierdo,
  };

  let contenido = `
  <h3 class="text-primary text-center" style="margin: 0; padding: 0;">Receta Optométrica</h3>
      <hr style="margin: 0.25rem 0;">
         ${tablePatient}
         <hr style="margin: 0.25rem 0;">
     <div class="table-responsive">
        <table class="table" style="width: 100%; border-collapse: collapse; border: none; table-layout: fixed;">
          <thead>
            <tr>
              <th style="padding: 4px; border: none; text-align: center; width: 5%;"></th>
              <th style="padding: 4px; border: none; text-align: center; width: 13.57%; font-size: 12px">QUERATOMETRIA</th>
              <th style="padding: 4px; border: none; text-align: center; width: 13.57%; font-size: 12px">ESFERA</th>
              <th style="padding: 4px; border: none; text-align: center; width: 13.57%; font-size: 12px">CILINDRO</th>
              <th style="padding: 4px; border: none; text-align: center; width: 13.57%; font-size: 12px">EJE</th>
              <th style="padding: 4px; border: none; text-align: center; width: 13.57%; font-size: 12px">ADICIÓN</th>
              <th style="padding: 4px; border: none; text-align: center; width: 13.57%; font-size: 12px">ALTURA</th>
              <th style="padding: 4px; border: none; text-align: center; width: 13.57%; font-size: 12px">DP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 4px; border: none; text-align: center;">OD</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.queratometriaOjoDerecho || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.esferaOjoDerecho || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.cilindroOjoDerecho || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.ejeOjoDerecho || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.adicionOjoDerecho || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.alturaOjoDerecho || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.dpOjoDerecho || ""
              }</td>
            </tr>
            <tr>
              <td style="padding: 4px; border: none; text-align: center;">OS</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.queratometriaOjoIzquierdo || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.esferaOjoIzquierdo || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.cilindroOjoIzquierdo || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.ejeOjoIzquierdo || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.adicionOjoIzquierdo || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.alturaOjoIzquierdo || ""
              }</td>
              <td style="padding: 4px; border: 1px solid #000; text-align: center;">${
                camposQueratometria.dpOjoIzquierdo || ""
              }</td>
            </tr>
          </tbody>
        </table>
      </div>



      <h3 class="text-primary" style="margin: 1.2rem 0 0.15rem 0;">Cristal recomendado</h3>
     <div class="table-responsive">
      <table class="table" style="width: 100%; border-collapse: collapse;">
        <tbody>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 20%;">
              <strong>Visión sencilla </strong>
            </td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 25%;">
            ${dataJson.visionSencilla || ""}
            </td>
            <td style="border: none; width: 10%;"></td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 40%;">
              <strong>V: </strong>${dataJson.visionSencillaV || ""}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 20%;">
              <strong>Bifocal FLTTOP</strong>
            </td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 25%;">
            ${dataJson.bifocalFLTTOP || ""}
            </td>
            <td style="border: none; width: 10%;"></td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 40%;">
              <strong>H: </strong>${dataJson.bifocalFLTTOPH || ""}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 20%;">
              <strong>Bifocal invisible </strong>
            </td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 25%;">
            ${dataJson.bifocalInvisible || ""}
            </td>
            <td style="border: none; width: 10%;"></td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 40%;">
              <strong>D: </strong>${dataJson.bifocalInvisibleD || ""}
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 20%;">
              <strong>Progresivo </strong>
            </td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 25%;">
            ${dataJson.progresivo || ""}
            </td>
            <td style="border: none; width: 10%;"></td>
            <td style="padding: 4px 8px; border: 1px solid #000; width: 40%;">
              <strong>P: </strong>${dataJson.progresivoP || "--"}
            </td>
          </tr>
          <tr>
            <td style="padding: 0; border: none;"></td>
            <td style="padding: 0; border: none;"></td>
            <td style="padding: 0; border: none;"></td>
            <td style="padding: 0; border-top: 1px solid transparent;"></td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; border: none;" colspan="2">
              <strong>Tratamiento: </strong>${
                dataJson.tratamiento || "Sin especificar"
              }
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 8px; border: none;" colspan="2">
              <strong>Montura: </strong>${dataJson.montura || "Sin especificar"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <small><strong>NOTA: </strong> No nos hacemos responsables si sus lentes no fueron hechos en nuesta óptica.</small>
    ${datosUsuario(user)}
`;

  generatePDFFromHTMLV2(contenido, company, patient);
}

export default generarFormatoRecetaOptometria;
