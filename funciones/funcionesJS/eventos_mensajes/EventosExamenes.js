async function createOrdenMessage(orden_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "examenes-creacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Orden",
    patient_id,
    orden_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}

async function shareOrdenMessage(orden_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "examenes-compartir",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Orden",
    patient_id,
    orden_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}

async function uploadOrdenMessage(orden_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "examenes-cargue",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Orden",
    patient_id,
    orden_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}
