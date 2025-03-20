async function verificarNumero(numero) {
  let datosApi = await consultarDatosWhatssap();

  let data = {
    numbers: [numero],
  };

  try {
    const response = await fetch(datosApi.testNumero, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: datosApi.apiKey,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result[0].exists;
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al enviar el mensaje.",
    });
  }
}

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
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Mensaje Enviado: ",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
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
  if (await verificarNumero(numero)) {
    enviarMensaje("sendText", parametrosMensaje);
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El número de teléfono no es válido.",
    });
  }
}

async function enviarAnexo(mensaje, numero, urlArchivo, titulo) {
  const parametrosMensaje = {
    number: numero,
    mediatype: "document", // image, video or document
    caption: mensaje,
    media: urlArchivo /* url or base64 */,
    fileName: titulo,
  };
  if (await verificarNumero(numero)) {
    enviarMensaje("sendMedia", parametrosMensaje);
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El número de teléfono no es válido.",
    });
  }
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
  if (await verificarNumero(numero)) {
    enviarMensaje("sendMedia", parametrosMensaje);
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "El número de teléfono no es válido.",
    });
  }
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
