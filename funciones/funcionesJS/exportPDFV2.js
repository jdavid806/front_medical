export async function generatePDFFromHTMLV2(
  content,
  companyInfo,
  configPDF,
  targetInputId = null
) {
  try {
    const htmlContent = `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
   @page {
      margin: 35px 28px 5px 18px;
    }
    body { 
      font-family: 'Arial', sans-serif; 
      margin: 0; 
      padding: 0px; 
      color: #333; 
    }
    .header {
      padding-bottom: 0px;
      overflow: hidden;
      height: 110px;
    }
    .logo-container {
      width: fit-content;
      height: 105px;
      float: left;
      margin-right: 20px;
    }
    .logo-container img {
      width: 100px;
      height: auto;
      border-right: 5px solid rgb(87, 99, 109);
    }
    .clinic-info-container {
      overflow: hidden;
      padding-left: 5px;
    }
    .clinic-name { 
      font-size: 18px; 
      font-weight: bold;
      margin-bottom: 5px;
      color: #333;
      margin-top: 0;
    }
    .clinic-info, .clinic-contact {
      font-size: 12px;
      line-height: 1.2;
      color: #555;
    }
    .clinic-contact {
      margin-top: 0px;
    }
    .footer {
    position: absolute;
    bottom: 0; 
    left: 0;
    width: 100%; 
    text-align: center; 
    padding: 5px 0;
    font-size: 12px;
    color: #666;
    border-top: 1px solid #eee;
    white-space: nowrap; 
}

  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <img src="${companyInfo.logo}" alt="Logo de la clínica">
    </div>
    <div class="clinic-info-container">
      <h1 class="clinic-name">${companyInfo.legal_name}</h1>
      <div class="clinic-info">
        <strong>RNC:</strong> ${companyInfo.document_number}<br>
        <strong>Dirección:</strong> ${companyInfo.address}
      </div>
      <div class="clinic-contact">
        <strong>Teléfono:</strong> ${companyInfo.phone} | 
        <strong>Correo:</strong> ${companyInfo.email}
      </div>
    </div>
  </div> ${content} 
    <div class="footer">
        ${
          companyInfo.legal_name
        } - Todos los derechos reservados © ${new Date().getFullYear()}
    </div>
    </body>
    </html>
    `;

    const scheme = window.location.protocol;

    const pdfGenerateUrl =`${scheme}//${window.location.hostname}/api/v2/mensajeria/pdf/generate`;

    if (!targetInputId) {
      // Comportamiento original (abrir en nueva ventana)
      const form = document.createElement("form");
      form.method = "POST";
      form.action = pdfGenerateUrl; // Cambiado a la ruta de Laravel
      form.target = "_blank";

      const inputHTML = document.createElement("input");
      inputHTML.type = "hidden";
      inputHTML.name = "html_content";
      inputHTML.value = htmlContent;
      form.appendChild(inputHTML);

      const inputConfig = document.createElement("input");
      inputConfig.type = "hidden";
      inputConfig.name = "pdf_config";
      inputConfig.value = JSON.stringify(configPDF);
      form.appendChild(inputConfig);

      // Agregar token CSRF para Laravel
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      )?.content;
      if (csrfToken) {
        const csrfInput = document.createElement("input");
        csrfInput.type = "hidden";
        csrfInput.name = "_token";
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } else {
      const tempInputId = `pdf-input-hidden-to-${targetInputId}`;
      const tempInput = document.createElement("input");
      tempInput.type = "file";
      tempInput.id = tempInputId;
      tempInput.accept = "application/pdf";
      tempInput.style.display = "none";
      document.body.appendChild(tempInput);

      // Preparar FormData para la petición fetch
      const formData = new FormData();
      formData.append("html_content", htmlContent);
      formData.append("pdf_config", JSON.stringify(configPDF));

      // Obtener token CSRF
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      )?.content;

      const response = await fetch(pdfGenerateUrl, {
        // Cambiado a la ruta de Laravel
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken || "", // Enviar token CSRF en headers
        },
        body: formData, // Usar FormData en lugar de URL encoded
      });

      if (!response.ok) throw new Error("Error generando PDF");

      const blob = await response.blob();
      const file = new File([blob], configPDF.name || "documento.pdf", {
        type: "application/pdf",
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      tempInput.files = dataTransfer.files;

      return tempInputId;
    }
  } catch (error) {
    console.error("Error generando PDF:", error);
    alert("Ocurrió un error al generar el documento");
  }
}

export async function generatePDFReceipts(content, configPDF, targetInputId = null) {
  try {
    const htmlContent = `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: 'Arial', sans-serif; 
      margin: 0; 
      padding: 15px; 
      color: #333; 
    }
    .footer {
    position: absolute;
    bottom: 0; 
    left: 0;
    width: 100%; 
    text-align: center; 
    padding: 10px 0;
    font-size: 12px;
    color: #666;
    border-top: 1px solid #eee;
    white-space: nowrap; 
}

  </style>
</head>
<body>
  </div> 
  ${content} 
    </div>
    </body>
    </html>
    `;
    const scheme = window.location.protocol;

    const pdfGenerateUrl =`${scheme}//${window.location.hostname}/api/v2/mensajeria/pdf/generate`;

    if (!targetInputId) {
      // Comportamiento original (abrir en nueva ventana)
      const form = document.createElement("form");
      form.method = "POST";
      form.action = pdfGenerateUrl; // Cambiado a la ruta de Laravel
      form.target = "_blank";

      const inputHTML = document.createElement("input");
      inputHTML.type = "hidden";
      inputHTML.name = "html_content";
      inputHTML.value = htmlContent;
      form.appendChild(inputHTML);

      const inputConfig = document.createElement("input");
      inputConfig.type = "hidden";
      inputConfig.name = "pdf_config";
      inputConfig.value = JSON.stringify(configPDF);
      form.appendChild(inputConfig);

      // Agregar token CSRF para Laravel
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      )?.content;
      if (csrfToken) {
        const csrfInput = document.createElement("input");
        csrfInput.type = "hidden";
        csrfInput.name = "_token";
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } else {
      const tempInputId = `pdf-input-hidden-to-${targetInputId}`;
      const tempInput = document.createElement("input");
      tempInput.type = "file";
      tempInput.id = tempInputId;
      tempInput.accept = "application/pdf";
      tempInput.style.display = "none";
      document.body.appendChild(tempInput);

      // Preparar FormData para la petición fetch
      const formData = new FormData();
      formData.append("html_content", htmlContent);
      formData.append("pdf_config", JSON.stringify(configPDF));

      // Obtener token CSRF
      const csrfToken = document.querySelector(
        'meta[name="csrf-token"]'
      )?.content;

      const response = await fetch(pdfGenerateUrl, {
        // Cambiado a la ruta de Laravel
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken || "", // Enviar token CSRF en headers
        },
        body: formData, // Usar FormData en lugar de URL encoded
      });

      if (!response.ok) throw new Error("Error generando PDF");

      const blob = await response.blob();
      const file = new File([blob], configPDF.name || "documento.pdf", {
        type: "application/pdf",
      });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      tempInput.files = dataTransfer.files;

      return tempInputId;
    }
  } catch (error) {
    console.error("Error generando PDF:", error);
    alert("Ocurrió un error al generar el documento");
  }
}
