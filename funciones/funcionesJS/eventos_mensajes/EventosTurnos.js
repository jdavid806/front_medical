async function createShiftMessage(turn_id) {
  let url = obtenerRutaPrincipal() + `/medical/tickets/${turn_id}`;
  let datosTurno = await obtenerDatos(url);
  let numero_paciente = datosTurno.phone;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "turnos-creacion",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(template, "Turno", "", turn_id);

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarTexto(mensajeFinal, numero_paciente);
}

async function callShiftMessage(turn_id) {
  let url = obtenerRutaPrincipal() + `/medical/tickets/${turn_id}`;
  let datosTurno = await obtenerDatos(url);
  let numero_paciente = datosTurno.phone;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "turnos-llamado",
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(template, "Turno", "", turn_id);

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarTexto(mensajeFinal, numero_paciente);
}
