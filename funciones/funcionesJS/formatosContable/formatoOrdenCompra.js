import { parse } from "uuid";
import { generatePDFFromHTML } from "../exportPDF.js";
import { generarTablaPaciente } from "../formatosImpresion/tablaDatosPaciente.js";
import { formatDate } from "./utilsContable.js";
import { formatCurrency } from "./utilsContable.js";

let company = {};
let cliente = {};
// let patient_id = new URLSearchParams(window.location.search).get("patient_id");

async function consultarData() {
  const response = await consultarDatosEmpresa();
  // const responePatient = await consultarDatosPaciente(patient_id);
  // patient = responePatient;
  // console.log(patient);
  console.log("response", response);
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
export function generarFormatoOrdenCompra(orden, tipo) {
  console.log("Orden", orden);
  let typeOrder = orden.type;
  let label = "";
  if (typeOrder === "purchase") {
    label = "Orden de compra";
  } else if (typeOrder === "quote_of") {
    label = "Cotización";
  }

  const namePDF = `${label} ${orden.orderNumber}.`;
  const companyData = {
    legal_name: "Centro Oriental de Diabetes y Endocrinologia",
    document_type: "RNC",
    document_number: "123003994",
    address: "Avenida Presidente Estrella Ureña No. 109",
    phone: "8095961335",
    email: "info@cenode.com.do",
  };
  let dataCompany = {};
  if (company) {
    dataCompany = company;
  } else {
    dataCompany = companyData;
  }
  let isDownload = null;
  if (tipo === "Impresion") {
    isDownload = false;
  } else {
    isDownload = true;
  }
  const pdfConfig = {
    name: namePDF,
    isDownload: isDownload,
  };

  // const subtotalGravado = orden.details.reduce((acc, detail) => {
  //   const subtotal = parseFloat(detail.subtotal) || 0;
  //   const descuento = parseFloat(detail.discount) || 0;
  //   return acc + (subtotal - descuento);
  // }, 0);

  // const totalITBIS = orden.details.reduce((acc, detail) => {
  //   const itbis = parseFloat(detail.total_taxes) || 0;
  //   return acc + itbis;
  // }, 0);

  const htmlInvoice = `
    <style>
      .orden-header { width: 100%; }
      .orden-title { margin: 0; }
      .orden-date { margin: 0; text-align: right; }
      .orden-client { margin: 0; }
      .orden-table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 1rem; 
      }
      .table-header {
        background-color: #132030;
        color: white;
        padding: 8px;
        text-align: left;
      }
      .table-cell {
        padding: 8px;
        border-bottom: 1px solid #ccc;
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
                text-align: right;
                width: 65%;
            }
    
            .fila-total {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 5px;
            }
    
            .etiqueta-total {
                font-weight: bold;
                width: 150px;
            }
    
            .valor-total {
                width: 120px;
                text-align: right;
            }
    </style>
    
    <div>
      <table class="orden-header">
        <tr>
          <td><h3 class="orden-title">${label} #00${orden.orderNumber}</h3></td>
          <td class="orden-date"><strong>Fecha:</strong> ${orden.createdAt}</td>
        </tr>
      </table>
      <hr style="margin: 0.25rem 0;">
      <p class="orden-client"><strong>Cliente:</strong> ${
        orden.thirdPartyName
      }</p>
      <p class="orden-client"><strong>Documento:</strong> ${
        orden?.thirdParty?.document_number || "--"
      }</p>
      <p class="orden-client"><strong>Telefono:</strong> ${
        orden?.thirdParty?.phone || "--"
      }</p>
      <hr style="margin: 0.25rem 0;">
      <table class="orden-table">
        <thead>
          <tr>
            <th class="table-header">Cantidad</th>
            <th class="table-header">Descripción</th>
            <th class="table-header">Subtotal</th>
            <th class="table-header">ITBIS</th>
            <th class="table-header">Descuento</th>
            <th class="table-header">Total</th>
          </tr>
        </thead>
        <tbody>
         ${orden.details
           .map(
             (detail) => `
                <tr>
                  <td class="table-cell">${detail.quantity}</td>
                  <td class="table-cell">${
                    detail?.product?.name || "Sin descripcion"
                  }</td>
                  <td class="table-cell">${formatCurrency(detail.subtotal)}</td>
                  <td class="table-cell">${formatCurrency(
                    detail.total_taxes
                  )}</td>
                  <td class="table-cell">${formatCurrency(detail.discount)}</td>
                  <td class="table-cell">${formatCurrency(
                    detail.subtotal + detail.total_taxes - detail.discount
                  )}</td>
                </tr>
              `
           )
           .join("")}
            
        </tbody>
      </table>
    </div>
    
    <table style="width: 100%; margin-top: 20px;">
      <tr>
        <td style="width: 60%; vertical-align: top;">
        </td>
    
        <td style="width: 40%; vertical-align: top; text-align: right;">
          <table style="width: 100%;">
           <tr>
            <td style="font-weight: bold;">Subtotal Gravado: ${formatCurrency(
              parseFloat(orden.total - orden.iva)
            )}</td>
           </tr>
           <tr>
            <td style="font-weight: bold;">ITBIS: ${formatCurrency(
             parseFloat(orden.iva)
            )}</td>
           </tr>
            <tr>
              <td style="font-weight: bold;">Total: ${formatCurrency(
                parseFloat(orden.total) || 0
              )}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
   
        `;
  generatePDFFromHTML(htmlInvoice, companyData, pdfConfig);
}
export default generarFormatoOrdenCompra;
