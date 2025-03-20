async function createInvoiceMessage(invoiceId, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "facturacion-creacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Factura",
    patient_id,
    invoiceId
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}

async function voidInvoiceMessage(invoiceId, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "facturacion-anulacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Factura",
    patient_id,
    invoiceId
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}

async function shareInvoiceMessage(invoiceId, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "facturacion-compartir",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Factura",
    patient_id,
    invoiceId
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}
