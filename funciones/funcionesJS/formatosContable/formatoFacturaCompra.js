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
  console.log('response', response);
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
export function generarFormatoFacturaCompra(invoice, tipo) {
  console.log("Factura", invoice);
 const namePDF = `Factura ${invoice.numeroFactura}.`;
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
          <td><h3 class="invoice-title">Factura de compra #${
            invoice.numeroFactura
          }</h3></td>
          <td class="invoice-date">Fecha: ${formatDate(invoice.fecha)}</td>
        </tr>
      </table>
      
      <p class="invoice-client">Cliente: ${invoice.proveedor}</p>
      <p class="invoice-client">Tipo: ${invoice.tipoFactura}</p>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th class="table-header">Cantidad</th>
            <th class="table-header">Descripción</th>
            <th class="table-header">Precio Unitario</th>
            <th class="table-header">ITBIS</th>
            <th class="table-header">Valor</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.detalles
            .map(
              (detail) => `
            <tr>
              <td class="table-cell">${detail.cantidad}</td>
              <td class="table-cell">${
                detail.productoNombre || "Producto sin descripción"
              }</td>
              <td class="table-cell">${formatCurrency(
                detail.precioUnitario || 0
              )}</td>
              <td class="table-cell">${formatCurrency(detail.tax || 0)}</td>
              <td class="table-cell">${formatCurrency(
                detail.precioUnitario * detail.cantidad
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
        <td style="width: 50%; vertical-align: top;">
          <div style="width: 120px; height: 120px; background-color: #f0f0f0; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            [Código QR]
          </div>
          <div style="font-weight: bold; margin-bottom: 15px;">
            Código de seguridad: S/DQdu
          </div>
        </td>
    
        <td style="width: 50%; vertical-align: top; text-align: right;">
          <table style="width: 100%;">
            <tr>
              <td style="font-weight: bold;">Total: ${formatCurrency(
                invoice.monto || 0
              )}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
        `;
  generatePDFFromHTML(htmlInvoice, companyData, pdfConfig);
}
export default generarFormatoFacturaCompra;
