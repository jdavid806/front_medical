async function tonifyTurn(patient_id, appointment_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "citas-turno",
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

async function sendInvoice(idCita, patient_id) {
  let rutaPdf = await generarFacturaTemporal(idCita);
  if (rutaPdf != null) {
    const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

    let numero_paciente = datosPaciente.telefono;

    let rutaFinal = reemplazarRuta(rutaPdf);

    const datosMensaje = {
      tenant_id: "1", // esto lo peuden mandar quemado la verad lo pedi porque no sabia como funcionaba la base XD
      type: "whatsapp",
      belongs_to: "facturacion-compartir",
    };

    let template = await obtenerTemplate(datosMensaje);

    let facturaId = await obtenerFacturaIdByCitaId(idCita);

    let mensaje = await convertirDatosVariables(
      template,
      "Factura",
      patient_id,
      facturaId
    );

    // let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

    // enviarAnexo(mensajeFinal, numero_paciente, rutaFinal, titulo);
  }
}
