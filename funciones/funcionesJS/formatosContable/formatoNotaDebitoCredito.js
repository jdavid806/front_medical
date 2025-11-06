import { generatePDFFromHTMLV2 } from "../exportPDFV2.js";
import { generarTablaPaciente } from "../formatosImpresion/tablaDatosPaciente.js";
import { formatDate } from "./utilsContable.js";
import { formatCurrency } from "./utilsContable.js";

let company = {};
let cliente = {};
// let patient_id = new URLSearchParams(window.location.search).get("patient_id");

async function consultarData() {
  const response = await consultarDatosEmpresa();
  company = {
    legal_name: response.nombre_consultorio,
    document_number: response.datos_consultorio[0].RNC,
    address: response.datos_consultorio[1].Dirección,
    phone: response.datos_consultorio[2].Teléfono,
    email: response.datos_consultorio[3].Correo,
    logo: response.logo_consultorio,
    watermark: response.marca_agua
,
  };
}
document.addEventListener("DOMContentLoaded", async () => {
  await consultarData();
});
export function generarFormatoNotaDebitoCredito(nota, tipo) {
 const namePDF = `Factura ${nota.note_code}.`;
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
    
    const htmlInvoice = `
    <style>
      .nota-header { width: 100%; }
      .nota-title { margin: 0; }
      .nota-date { margin: 0; text-align: right; }
      .nota-client { margin: 0; }
      .nota-table { 
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
      <table class="nota-header">
        <tr>
          <td><h3 class="nota-title">Nota ${nota.tipo} #${
            nota.note_code
          }</h3></td>
          <td class="nota-date"><strong>Fecha:</strong> ${formatDate(nota.date)}</td>
        </tr>
        <tr>
        <small class="nota-date">Resolución: ${nota?.resolution_number || "--"}</small>
        </tr>
      </table>
      <hr style="margin: 0.25rem 0;">
      <p class="nota-client"><strong>Cliente:</strong> ${nota.cliente}</p>
      <p class="nota-client"><strong>Documento:</strong> ${nota.invoice.third_party.document_number || "--"}</p>
      <p class="nota-client"><strong>Telefono:</strong> ${nota.invoice.third_party.phone || "--"}</p>
      <hr style="margin: 0.25rem 0;">
      <p class="nota-client"><strong>Nota realizada por concepto de:</strong> ${nota.reason || "--"}</p>
      <table class="nota-table">
        <thead>
          <tr>
            <th class="table-header">Factura</th>
            <th class="table-header">Fecha</th>
            <th class="table-header">Producto</th>
            <th class="table-header">Subtotal</th>
            <th class="table-header">Descuento</th>
            <th class="table-header">Total</th>
          </tr>
        </thead>
        <tbody>
         
            <tr>
              <td class="table-cell">${nota?.invoice?.invoice_code}</td>
              <td class="table-cell">${formatDate(nota?.invoice?.created_at)}</td>
              <td class="table-cell">Producto ${nota?.details[0].product_id}</td>
              <td class="table-cell">${formatCurrency(
                nota?.invoice?.subtotal)}</td>
              <td class="table-cell">${formatCurrency(
                nota?.invoice?.discount)}</td>
              <td class="table-cell">${formatCurrency(
                nota?.invoice?.remaining_amount)}</td>
            </tr>
          
            
        </tbody>
      </table>
    </div>
    
    <table style="width: 100%; margin-top: 20px;">
      <tr>
        <td style="width: 70%; vertical-align: top;">
         <strong>Observaciones:</strong> ${nota?.observations || `Observaciones de la factura ${nota?.note_code}.`}
        </td>
    
        <td style="width: 30%; vertical-align: top; text-align: right;">
          <table style="width: 100%;">
            <tr>
              <td style="font-weight: bold;">Total: ${formatCurrency(
                nota.amount || 0
              )}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <hr style="margin: 0.25rem 0;">
   
        `;
  generatePDFFromHTMLV2(htmlInvoice, company || companyData, pdfConfig);
}
export default generarFormatoNotaDebitoCredito;
