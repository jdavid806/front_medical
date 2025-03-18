async function createAppointmentMessage(appointment_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "citas-creacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Cita",
    patient_id,
    appointment_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarTexto(mensajeFinal, numero_paciente);
}

async function cancelAppointmentMessage(appointment_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "citas-cancelacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Cita",
    patient_id,
    appointment_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarTexto(mensajeFinal, numero_paciente);
}

async function schedulingAppointmentMessage(appointment_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "citas-reagendamiento",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Cita",
    patient_id,
    appointment_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarTexto(mensajeFinal, numero_paciente);
}

async function cancelAppointmentMessage(appointment_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "citas-cancelacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Cita",
    patient_id,
    appointment_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarTexto(mensajeFinal, numero_paciente);
}

async function shareAppointmentMessage(appointment_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "citas-compartir",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    "Cita",
    patient_id,
    appointment_id
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarTexto(mensajeFinal, numero_paciente);
}
