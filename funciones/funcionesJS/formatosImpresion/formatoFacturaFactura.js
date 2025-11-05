import { generatePDFReceipts } from "../exportPDFV2.js";

let companyData = {};

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

export async function generarFormatoFacturaFactura(facturaData, tipo, inputId = null) {
  await consultarData();

  console.log("C");

  // Determinar el tipo de factura
  const tipoFactura = "FACTURA DE VENTA";

  // Construir HTML para los detalles de la factura
  let detallesHTML = facturaData.details.map(detalle => {
    const subtotal = Number(detalle.unit_price) * Number(detalle.quantity);
    return `
    <div style="border-bottom: 1px dashed #ccc; padding: 5px 0;">
      <strong>${detalle.product.name}</strong><br>
      Cantidad: ${detalle.quantity}<br>
      ${`
        Precio Unitario: $${formatCurrency(detalle.unit_price)}<br>
        Subtotal: $${formatCurrency(subtotal.toFixed(2))}<br>
        Descuento: $${formatCurrency(Number(detalle.discount).toFixed(2))}<br>
        Total: $${formatCurrency(Number(detalle.amount).toFixed(2))}<br>
      `}
    </div>
  `
  }).join('');

  let metodosPagoHTML = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #000;">
      <tr>
        <th style="text-align: left; border-bottom: 1px solid #000; padding: 5px;">Método de Pago</th>
        <th style="text-align: right; border-bottom: 1px solid #000; padding: 5px;">Monto</th>
      </tr>
      ${facturaData.payments.map(metodo => `
        <tr>
          <td style="padding: 5px;">${metodo.payment_method.method}</td>
          <td style="text-align: right; padding: 5px;">$${formatCurrency(Number(metodo.amount).toFixed(2))}</td>
        </tr>
      `).join('')}
      <tr>
        <td style="padding: 5px; font-weight: bold;">Total</td>
        <td style="text-align: right; padding: 5px; font-weight: bold;">$${formatCurrency((+facturaData.total_amount).toFixed(2))}</td>
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
        <p style="margin: 5px 0; font-size: 12px;">No: ${facturaData.invoice_code}</p>
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${formatDate(facturaData.created_at)}</p>
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Paciente:</strong> ${facturaData.patient.first_name ?? ""} ${facturaData.patient.middle_name ?? ""} ${facturaData.patient.last_name ?? ""} ${facturaData.patient.second_last_name ?? ""}</p>
        <p style="margin: 5px 0;"><strong>Documento:</strong> ${facturaData.patient.document_number}</p>
        <p style="margin: 5px 0;"><strong>Dirección:</strong> ${facturaData.patient.address}</p>
        <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${facturaData.patient.phone || facturaData.patient.whatsapp}</p>
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <h4 style="margin: 10px 0 5px 0; font-size: 12px;">Detalles:</h4>
        ${detallesHTML}
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Subtotal:</strong> $${formatCurrency(facturaData.subtotal)}</p>
        <p style="margin: 5px 0;"><strong>Descuento:</strong> $${formatCurrency(facturaData.discount)}</p>
        <p style="margin: 5px 0;"><strong>IVA:</strong> $${formatCurrency(facturaData.iva)}</p>
        <p style="margin: 5px 0; font-weight: bold;"><strong>Total:</strong> $${formatCurrency(+facturaData.total_amount)}</p>
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <h4 style="margin: 10px 0 5px 0; font-size: 12px;">Métodos de Pago:</h4>
        ${metodosPagoHTML}
      </div>
      
      <div style="margin-bottom: 15px; font-size: 12px;">
        <p style="margin: 5px 0;"><strong>Facturador:</strong> ${facturaData.user.first_name ?? ""} ${facturaData.user.middle_name ?? ""} ${facturaData.user.last_name ?? ""} ${facturaData.user.second_last_name ?? ""}</p>
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
    name: `Recibo_caja`,
    isDownload: isDownload,
    dimensions: [0, 0, 226.77, 730],
  };

  await generatePDFReceipts(contenido, pdfConfig, inputId);
}