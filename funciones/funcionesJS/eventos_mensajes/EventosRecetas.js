async function createPrescriptionMessage(prescription_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "recetas-creacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Receta",
    patient_id,
    prescription_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}

async function sharePrescriptionMessage(prescription_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "recetas-creacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Receta",
    patient_id,
    prescription_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  if (await enviarArchivoWhatssap(datosMensaje)) {
    console.log("Archivo enviado");
  } else {
    enviarTexto(mensajeFinal, numero_paciente);
  }
}
