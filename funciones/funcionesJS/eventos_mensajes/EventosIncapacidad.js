async function createInabilityMessage(inability_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "incapacidades-creacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Incapacidad",
    patient_id,
    inability_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}

async function shareInabilityMessage(inability_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "incapacidades-compartir",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Incapacidad",
    patient_id,
    inability_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);
  console.log(mensajeFinal);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}
