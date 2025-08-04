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
export function generarFormatoFacturaEntidad(invoice, tipo) {
  console.log("Factura", invoice);
  const namePDF = `Factura ${invoice.invoice_code}.`;
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

  // Facturacion por entidad para Colombia
  // const htmlInvoice = `
  // <style>
  //   .invoice-header { width: 100%; }
  //   .invoice-title { margin: 0; }
  //   .invoice-date { margin: 0; text-align: right; }
  //   .invoice-client { margin: 0; }
  //   .invoice-table {
  //     width: 100%;
  //     border-collapse: collapse;
  //     margin-top: 1rem;
  //   }
  //   .table-header {
  //     background-color: #132030;
  //     color: white;
  //     padding: 8px;
  //     text-align: left;
  //   }
  //   .table-cell {
  //     padding: 8px;
  //     border-bottom: 1px solid #ccc;
  //   }

  //   .seccion-final {
  //             display: flex;
  //             justify-content: space-between;
  //             margin-top: 20px;
  //         }

  //         .info-qr {
  //             width: 40%;
  //         }

  //         .qr-image {
  //             width: 120px;
  //             height: 120px;
  //             background-color: #f0f0f0;
  //             border: 1px dashed #ccc;
  //             display: flex;
  //             align-items: center;
  //             justify-content: center;
  //             margin-bottom: 10px;
  //         }

  //         .codigo-seguridad {
  //             font-weight: bold;
  //             margin-bottom: 15px;
  //         }

  //         .fecha-firma {
  //             font-style: italic;
  //         }

  //         .totales {
  //             text-align: right;
  //             width: 65%;
  //         }

  //         .fila-total {
  //             display: flex;
  //             justify-content: flex-end;
  //             margin-bottom: 5px;
  //         }

  //         .etiqueta-total {
  //             font-weight: bold;
  //             width: 150px;
  //         }

  //         .valor-total {
  //             width: 120px;
  //             text-align: right;
  //         }
  // </style>

  // <div>
  //   <table class="invoice-header">
  //     <tr>
  //       <td><h3 class="invoice-title">Factura entidad #${
  //         invoice.invoice_code
  //       }</h3></td>
  //       <td class="invoice-date"><strong>Fecha de vencimiento:</strong> ${invoice.due_date}</td>
  //     </tr>
  //   </table>
  //   <hr style="margin: 0.25rem 0;">
  //   <p class="invoice-client"><strong>Entidad:</strong> ${invoice.entity.name}</p>
  //   <p class="invoice-client"><strong>Documento:</strong> ${invoice.entity.document_type || ""}-${invoice.entity.document_number || ""}</p>
  //   <p class="invoice-client"><strong>Dirección:</strong> ${invoice.entity.address || ""}</p>
  //   <p class="invoice-client"><strong>Correo:</strong> ${invoice.entity.email || ""}</p>

  //   <table class="invoice-table">
  //     <thead>
  //       <tr>
  //         <th class="table-header">Factura</th>
  //         <th class="table-header">Fecha</th>
  //         <th class="table-header">Paciente</th>
  //         <th class="table-header">Producto</th>
  //         <th class="table-header">Subtotal</th>
  //         <th class="table-header">Descuento</th>
  //         <th class="table-header">Total</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       ${invoice.invoice_linked
  //         .map(
  //           (detail) => `
  //         <tr>
  //           <td class="table-cell">${detail?.invoice_code}</td>
  //           <td class="table-cell">${
  //             detail?.due_date || "--"
  //           }</td>
  //           <td class="table-cell">${detail?.patient_full_name}</td>
  //           <td class="table-cell">${detail?.products}</td>
  //           <td class="table-cell">${formatCurrency(
  //             detail?.subtotal)}</td>
  //           <td class="table-cell">${formatCurrency(
  //             detail?.discount)}</td>
  //           <td class="table-cell">${formatCurrency(
  //             detail?.total_amount)}</td>
  //         </tr>
  //       `
  //         )
  //         .join("")}
  //     </tbody>
  //   </table>
  // </div>

  // <table style="width: 100%; margin-top: 20px;">
  //   <tr>
  //     <td style="width: 70%; vertical-align: top;">
  //      <strong>Observaciones:</strong> ${invoice?.observations || `Observaciones de la factura ${invoice.invoice_code}.`}
  //     </td>

  //     <td style="width: 30%; vertical-align: top; text-align: right;">
  //       <table style="width: 100%;">
  //         <tr>
  //           <td style="font-weight: bold;">Total: ${formatCurrency(
  //             invoice.total_amount || 0
  //           )}</td>
  //         </tr>
  //       </table>
  //     </td>
  //   </tr>
  // </table>
  // <hr style="margin: 0.25rem 0;">
  // <strong>Facturado por:</strong> ${invoice.biller || ""} - ${formatDate(invoice.elaboration_date || "")}.
  //     `;
  const htmlInvoice = `
    <style>
      .invoice-header { width: 100%; }
      .invoice-title { margin: 0; }
      .invoice-date { margin: 0; text-align: right; }
      .invoice-client { margin: 0; }
      .invoice-table { 
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
      <table class="invoice-header">
        <tr>
          <td><h3 class="invoice-title">Factura entidad #${
            invoice.invoice_code
          }</h3></td>
          <td class="invoice-date"><strong>Fecha de vencimiento:</strong> ${
            invoice.due_date
          }</td>
        </tr>
      </table>
      <hr style="margin: 0.25rem 0;">
      <p class="invoice-client"><strong>Entidad:</strong> ${
        invoice.entity.name
      }</p>
      <p class="invoice-client"><strong>Documento:</strong> ${
        invoice.entity.document_type || ""
      }-${invoice.entity.document_number || ""}</p>
      <p class="invoice-client"><strong>Dirección:</strong> ${
        invoice.entity.address || ""
      }</p>
      <p class="invoice-client"><strong>Correo:</strong> ${
        invoice.entity.email || ""
      }</p>
      <hr style="margin: 0.25rem 0;">
      <p class="invoice-client"><strong>Nº resolución: </strong>${invoice.resolution || ""}</p>
      <p class="invoice-client"><strong>Observaciones:</strong> ${
        invoice?.observations ||
        `Observaciones de la factura ${invoice.invoice_code}.`
      }</p>
    
    <table style="width: 100%; margin-top: 20px;">
      <tr>
        <td style="width: 70%; vertical-align: top;">
        </td>
    
        <td style="width: 30%; vertical-align: top; text-align: right;">
          <table style="width: 100%;">
          <tr>
            <td style="font-weight: bold;">Subtotal: ${formatCurrency(
              invoice.subtotal || 0
            )}</td></tr>
          <tr>
            <td style="font-weight: bold;">Descuento: ${formatCurrency(
              invoice.discount || 0
            )}</td></tr>
            <tr>
            <td style="font-weight: bold;">IVA: ${formatCurrency(
              invoice.iva || 0
            )}</td></tr>
            <tr>
              <td style="font-weight: bold;">Total: ${formatCurrency(
                invoice.total_amount || 0
              )}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <hr style="margin: 0.25rem 0; height: 1px; background-color: #ccc; border: none;">
    <small><strong>Facturado por:</strong> ${
      invoice.biller || ""
    } - ${formatDate(invoice.elaboration_date || "")}.</small>
        `;
  generatePDFFromHTML(htmlInvoice, companyData, pdfConfig);
}
export default generarFormatoFacturaEntidad;
