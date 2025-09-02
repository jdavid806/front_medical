import { generatePDFFromHTML } from "../exportPDF.js";
import { generarTablaPaciente } from "./tablaDatosPaciente.js";
import { datosUsuario } from "./datosUsuario.js";

let companyData = {};
let patientData = {};

async function consultarData() {
    const response = await consultarDatosEmpresa();
    companyData = {
        legal_name: response.nombre_consultorio,
        document_number: response.datos_consultorio[0].RNC,
        address: response.datos_consultorio[1].Dirección,
        phone: response.datos_consultorio[2].Teléfono,
        email: response.datos_consultorio[3].Correo,
    };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

export async function generarFormatoFactura(facturaData, tipo, inputId = "") {
    await consultarData();

    console.log('entroo aquuiiii');
    const {
        empresa,
        factura,
        paciente,
        metodos_pago,
        total_pagado,
        detalles
    } = facturaData;

    // Determinar el tipo de factura
    const tipoFactura = factura.numero_autorizacion && factura.total == 0
        ? "RECIBO DE CAJA"
        : "FACTURA DE VENTA";

    // Construir HTML para los detalles de la factura
    let detallesHTML = detalles.map(detalle => `
    <div style="border-bottom: 1px dashed #ccc; padding: 5px 0;">
      <strong>${detalle.producto}</strong><br>
      Cantidad: ${detalle.cantidad}<br>
      ${!factura.numero_autorizacion ? `
        Precio Unitario: $${formatCurrency(detalle.precio_unitario)}<br>
        Subtotal: $${formatCurrency(detalle.subtotal)}<br>
        Descuento: $${formatCurrency(detalle.descuento)}<br>
        Total: $${formatCurrency(detalle.total)}<br>
      ` : ''}
    </div>
  `).join('');

    let metodosPagoHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #000;">
      <tr>
        <th style="text-align: left; border-bottom: 1px solid #000; padding: 5px;">Método de Pago</th>
        <th style="text-align: right; border-bottom: 1px solid #000; padding: 5px;">Monto</th>
      </tr>
      ${metodos_pago.map(metodo => `
        <tr>
          <td style="padding: 5px;">${metodo.metodo}</td>
          <td style="text-align: right; padding: 5px;">$${formatCurrency(metodo.monto)}</td>
        </tr>
      `).join('')}
      <tr>
        <td style="padding: 5px; font-weight: bold;">Total</td>
        <td style="text-align: right; padding: 5px; font-weight: bold;">$${formatCurrency(total_pagado)}</td>
      </tr>
    </table>
  `;

    // Construir el contenido HTML completo
    const contenido = `
    <div style="font-family: Arial, sans-serif; max-width: 235px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 15px;">
        <h2 style="margin: 0; font-size: 18px;">${companyData.legal_name}</h2>
        <p style="margin: 5px 0; font-size: 12px;">${companyData.address}</p>
        <p style="margin: 5px 0; font-size: 12px;">Tel: ${companyData.phone} | Email: ${companyData.email}</p>
        <p style="margin: 5px 0; font-size: 12px;">RNC: ${companyData.document_number}</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 15px;">
        <h3 style="margin: 0; font-size: 16px;">${tipoFactura}</h3>
        <p style="margin: 5px 0; font-size: 12px;">No: ${factura.numero_comprobante}</p>
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formatDate(factura.fecha_factura)}</p>
        ${factura.numero_autorizacion ? `
          <p style="margin: 5px 0;"><strong>Autorización:</strong> ${factura.numero_autorizacion}</p>
          <p style="margin: 5px 0;"><strong>Fecha Autorización:</strong> ${formatDate(factura.fecha_autorizacion)}</p>
        ` : ''}
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Paciente:</strong> ${paciente.paciente_nombre.join(' ')}</p>
        <p style="margin: 5px 0;"><strong>Documento:</strong> ${paciente.paciente_documento}</p>
        <p style="margin: 5px 0;"><strong>Dirección:</strong> ${paciente.paciente_direccion}</p>
        <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${paciente.paciente_telefono}</p>
        ${factura.entidad ? `<p style="margin: 5px 0;"><strong>Entidad:</strong> ${factura.entidad}</p>` : ''}
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <h4 style="margin: 10px 0 5px 0; font-size: 12px;">Detalles:</h4>
        ${detallesHTML}
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${formatCurrency(factura.subtotal)}</p>
        <p style="margin: 5px 0;"><strong>Descuento:</strong> $${formatCurrency(factura.descuento)}</p>
        <p style="margin: 5px 0;"><strong>IVA:</strong> $${formatCurrency(factura.iva)}</p>
        <p style="margin: 5px 0; font-weight: bold;"><strong>Total:</strong> $${formatCurrency(factura.total)}</p>
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <h4 style="margin: 10px 0 5px 0; font-size: 12px;">Métodos de Pago:</h4>
        ${metodosPagoHTML}
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Facturador:</strong> ${factura.facturador}</p>
        <p style="margin: 5px 0;"><strong>Fecha de Impresión:</strong> ${formatDate(new Date())}</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px;">
        <p>¡Gracias por su visita!</p>
      </div>
    </div>
  `;

    let isDownload = false;
    if (tipo === "Descarga") {
        isDownload = true;
    }

    const pdfConfig = {
        name: `${tipoFactura.toLowerCase().replace(/\s/g, '_')}_${formatDate(factura.fecha_factura).replace(/\//g, '')}_${paciente.paciente_documento}.pdf`,
        isDownload: isDownload,
        dimensions: [0, 0, 235, 750],
        orientation: "portrait"
    };

    await generatePDFFromHTML(contenido, companyData, pdfConfig, inputId);
}

export default generarFormatoFactura;