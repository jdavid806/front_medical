async function enviarMensaje(tipoUrl, data) {
  let datosApi = await consultarDatosWhatssap(tipoUrl);

  try {
    const response = await fetch(datosApi.apiMensaje, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: datosApi.apiKey,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result) {
      Swal.fire({
        icon: "success",
        title: "Mensaje enviado",
        text: "El mensaje se ha enviado correctamente.",
      });
    }
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al enviar el mensaje.",
    });
  }
}

// tipos de envios

async function enviarTexto(mensaje, numero) {
  const parametrosMensaje = {
    number: numero,
    text: mensaje,
  };
  // enviarMensaje("sendText", parametrosMensaje);
}

async function enviarAnexo(mensaje, numero, urlArchivo, titulo) {
  const parametrosMensaje = {
    number: numero,
    mediatype: "document", // image, video or document
    caption: mensaje,
    media: urlArchivo /* url or base64 */,
    fileName: titulo,
  };
  // enviarMensaje("sendMedia", parametrosMensaje);
}

async function enviarImagen(mensaje, numero, urlImagen, titulo) {
  const parametrosMensaje = {
    number: numero,
    mimetype: "image/png",
    mediatype: "image", // image, video or document
    caption: mensaje,
    media: urlImagen /* url or base64 */,
    fileName: titulo,
  };
  // enviarMensaje("sendMedia", parametrosMensaje);
}

// utils
async function enviarDocumentoConvertido(
  ruta,
  patient_id,
  titulo,
  nombreObjecto,
  objectoId
) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let numero_paciente = datosPaciente.telefono;

  let rutaFinal = reemplazarRuta(ruta);

  let tipoMensaje = consultarTipoMensaje(nombreObjecto);

  const datosMensaje = {
    tenant_id: "1", // esto lo peuden mandar quemado la verad lo pedi porque no sabia como funcionaba la base XD
    type: "whatsapp",
    belongs_to: tipoMensaje,
  };

  let template = await obtenerTemplate(datosMensaje);

  let mensaje = await convertirDatosVariables(
    template,
    nombreObjecto,
    patient_id,
    objectoId
  );

  let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

  enviarAnexo(mensajeFinal, numero_paciente, rutaFinal, titulo);
}

// llamado de envios
async function enviarDocumento(
  objecto,
  tipoDocumento,
  nombreObjecto,
  tipoImpresion,
  patient_id,
  user_id,
  titulo
) {
  const datosFormato = await generarFormato(objecto, nombreObjecto);

  const formData = new FormData();
  formData.append("titulo", "Incapacidad Médica");
  formData.append("consultorio", JSON.stringify(datosFormato.consultorio)); // Enviar como JSON
  formData.append("paciente", JSON.stringify(datosFormato.paciente));
  formData.append("doctor", JSON.stringify(datosFormato.doctor));
  formData.append("tipoImpresion", tipoImpresion);
  formData.append("tipoDocumento", tipoDocumento);

  try {
    let response = await fetch("../funciones/CrearDocumentoTemporal.php", {
      method: "POST",
      body: formData,
    });

    let resultado = await response.json();

    if (resultado.ruta) {
      enviarDocumentoConvertido(
        resultado.ruta,
        patient_id,
        titulo,
        nombreObjecto,
        objecto.id
      );
    } else {
      console.error("No se generó el documento correctamente");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

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
  let urlAdmision =
    obtenerRutaPrincipal() + `/medical/admissions/by-appointment/${idCita}`;
  if (rutaPdf != null) {
    // const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
    // let numero_paciente = datosPaciente.telefono;
    // let rutaFinal = reemplazarRuta(rutaPdf);
    // const datosMensaje = {
    //   tenant_id: "1", // esto lo peuden mandar quemado la verad lo pedi porque no sabia como funcionaba la base XD
    //   type: "whatsapp",
    //   belongs_to: "facturacion-compartir",
    // };
    // let template = await obtenerTemplate(datosMensaje);
    // let mensaje = await convertirDatosVariables(
    //   template,
    //   nombreObjecto,
    //   patient_id,
    //   objectoId
    // );
    // let mensajeFinal = convertirHtmlAWhatsapp(mensaje);
    // enviarAnexo(mensajeFinal, numero_paciente, rutaFinal, titulo);
  }
}
