import { generatePDFFromHTML } from "../exportPDF.js";
import { generarTablaPaciente } from "./tablaDatosPaciente.js";

let company = {};
let patient = {};
let patient_id = new URLSearchParams(window.location.search).get("patient_id");

async function consultarData() {
  //   const response = await consultarDatosEmpresa();
  //   const responePatient = await consultarDatosPaciente(patient_id);
  //   patient = responePatient;
  // console.log(patient);
  //   company = {
  //     legal_name: response.nombre_consultorio,
  //     document_number: response.datos_consultorio[0].RNC,
  //     address: response.datos_consultorio[1].Dirección,
  //     phone: response.datos_consultorio[2].Teléfono,
  //     email: response.datos_consultorio[3].Correo,
  //   };
}
document.addEventListener("DOMContentLoaded", () => {
  consultarData();
});
export function generarFormatoReciboCaja(recibo, tipo) {
  console.log("recibo caja", recibo);
  const contenido = `
      <style>
      .logo-container {
          margin-bottom: 15px;
      }
  
      .logo {
          width: 150px;
          height: auto;
      }
  
      .separador-superior {
          margin: 20px 0 10px 0;
          border: 0;
          border-top: 1px solid #132030;
      }
  
      .separador-inferior {
          margin: 15px 0 10px 0;
          border: 0;
          border-top: 1px solid #132030;
      }
  
      table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
      }
  
      th {
          background-color: #132030;
          color: white;
          text-align: left;
          padding: 8px;
          font-weight: bold;
      }
  
      td {
          padding: 8px;
          border-bottom: 1px solid #ddd;
          vertical-align: top;
      }
  
       .table-sin-borde td {
          border-bottom: none;
      }
  
      .titulo-factura {
          color: #132030;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
      }
  
      .detalle-info {
          font-size: 14px;
          margin-bottom: 3px;
      }
  
      .datos-cliente {
          margin-bottom: 15px;
      }
  
      .datos-cliente h3 {
          color: #132030;
          margin-bottom: 10px;
          font-size: 16px;
      }
  
      .datos-cliente p {
          margin: 5px 0;
      }
  
      .concepto {
          margin-bottom: 15px;
          font-style: italic;
      }
  
      .seccion-final {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
      }
  
      .info-qr {
          width: 40%;
      }
  
      .qr-image {
          width: 120px;
          height: 120px;
          background-color: #f0f0f0;
          border: 1px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
      }
  
      .codigo-seguridad {
          font-weight: bold;
          margin-bottom: 15px;
      }
  
      .fecha-firma {
          font-style: italic;
      }
  
      .totales {
          width: 65%;
          text-align: right;
      }
  
      .fila-total {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 5px;
      }
  
      .etiqueta-total {
          font-weight: bold;
      }
  
      .valor-total {
          text-align: right;
      }
  
      .tabla-pago {
          width: 50%;
          margin: 20px 0 30px 0;
      }
  
      .firma {
          margin-top: 40px;
          text-align: center;
          width: 100%;
          padding-top: 80px;
      }
  
      .texto-firma {
          text-align: center;
          font-weight: bold;
          margin-bottom: 10px;
      }
  </style>
  
  <table class="table-sin-borde">
      <tr>
          <td style="width: 60%;">
              <div class="nombre-empresa"><strong>Cliente: </strong>${
                recibo?.client?.name || ""
              }</div>
              <div><strong>Identificacion: </strong> ${
                recibo?.client?.document_type || "N/A"
              }-${recibo?.client?.document_number || "-"}</div>
              <div><strong>Direccion: </strong> ${
                recibo?.client?.address || ""
              }</div>
              <div><strong>Correo: </strong> ${
                recibo?.client?.email || ""
              }</div>
          </td>
          <td style="width: 40%; text-align: right;">
              <div class="titulo-factura">Recibo de Caja</div>
              <div class="detalle-info">No. ${recibo.numeroRecibo}</div>
              <div class="detalle-info"><strong>Fecha: </strong> ${formatDate(
                recibo.fechaElaboracion
              )}</div>
          </td>
      </tr>
  </table>
  
  <hr class="separador-superior">
  
  <div class="concepto">
        <strong>Valor en letras:</strong> ${numeroALetras(
          recibo.total || 0
        )} pesos
  </div>
  
  <table class="invoice-table">
      <thead>
        <tr>
          <th class="table-header">Tipo</th>
          <th class="table-header">Factura</th>
          <th class="table-header">Centro de Costo</th>
          <th class="table-header">Valor</th>
        </tr>
      </thead>
      <tbody>
        ${recibo.details
          .map(
            (detail) => `
          <tr>
            <td class="table-cell">${recibo.tipoRecibo}</td>
            <td class="table-cell">${detail.invoice || ""}</td>
            <td class="table-cell">${recibo.centroCosto || ""}</td>
            <td class="table-cell">${formatCurrency(
              parseFloat(detail.amount) || 0
            )}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  
  <hr class="separador-inferior">
  
  <table class="tabla-pago">
      <thead>
          <tr>
              <th>Forma de pago</th>
              <th>Valor</th>
          </tr>
      </thead>
      <tbody>
          ${recibo.payments
            .map(
              (payment) => `
              <tr>
                  <td>${payment.payment_method_id}</td><td>${formatCurrency(
                parseFloat(payment.amount)
              )}</td></tr>`
            )
            .join("")}</td>
              </tr>
      </tbody>
  </table>
  
  <div> 
          <p></p><strong>Observaciones: </strong>${
            recibo.observaciones || ""
          }</p>
  </div>
  
  <table>
      <tr>
          <td style="width: 40%;">
          </td>
          <td style="width: 60%; text-align: right;">
              <div class="fila-total">
                  <div><strong>Subtotal Gravado: </strong>${formatCurrency(
                    recibo.subtotal || 0
                  )}</div>
              </div>
              <div class="fila-total">
                  <div><strong>Descuento: </strong>${formatCurrency(
                    recibo.discount || 0
                  )}</div>
              </div>
              <div class="fila-total">
                  <div><strong>Total: </strong>${formatCurrency(
                    recibo.valor || 0
                  )}</div>
              </div>
          </td>
      </tr>
  </table>
  
  <hr class="separador-inferior">
  
  <div class="texto-firma">FIRMA DE RECIBO</div>
  <div class="firma">
      __________________________<br>
      CC O NIT
  </div>
  `;

  generatePDFFromHTML(contenido, company, patient);
}
export default formatoReciboCaja;
