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

  console.log(mensaje);

  // let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  // console.log(mensajeFinal);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}
