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
  enviarMensaje("sendText", parametrosMensaje);
}

async function enviarAnexo(mensaje, numero, urlArchivo, titulo) {
  const parametrosMensaje = {
    number: numero,
    mediatype: "document", // image, video or document
    caption: mensaje,
    media: urlArchivo /* url or base64 */,
    fileName: titulo,
  };
  enviarMensaje("sendMedia", parametrosMensaje);
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
  enviarMensaje("sendMedia", parametrosMensaje);
}

// utils
async function enviarDocumentoConvertido(
  ruta,
  patient_id,
  titulo,
  nombreObjecto
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

  let template = await obtenerTemplate(datosMensaje, patient_id);

  let mensajeFinal = convertirHtmlAWhatsapp(template);

  enviarAnexo(mensajeFinal, numero_paciente, rutaFinal, titulo);
}

async function consultarQR(user_id) {
  const datosApi = await consultarDatosWhatssapPorDoctorId(user_id);

  const imgElement = document.getElementById("qrWhatsApp");
  const statusIcon = document.getElementById("statusIcon");
  const actionButton = document.getElementById("actionButton");

  if (!imgElement) {
    console.error("No se encontró el elemento con el ID especificado");
    return;
  }

  try {
    const response = await fetch(datosApi.apiConnect, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: datosApi.apiKey,
      },
    });

    const result = await response.json();

    if (result.instance && result.instance.state === "open") {
      imgElement.classList.add("d-none");

      statusIcon.classList.remove("d-none");
      actionButton.classList.remove("d-none");
      actionButton.onclick = () => cerrarPuerto(user_id);
    } else {
      statusIcon.classList.add("d-none");
      actionButton.classList.add("d-none");

      imgElement.classList.remove("d-none");

      imgElement.src = result.base64;
    }
  } catch (error) {
    console.error("Error al cargar el QR:", error);
  }
}

async function cerrarPuerto(user_id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción Desconectara la conexión.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, desconectar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const datosApi = await consultarDatosWhatssapPorDoctorId(user_id);
        await fetch(datosApi.apiLogOut, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            apikey: datosApi.apiKey,
          },
        });
        Swal.fire(
          "¡Desconectado exitosamente!",
          "La sesión se ha desconectado correctamente.",
          "success"
        ).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire(
          "Error",
          "No se pudo desconectar. Inténtalo de nuevo.",
          "error"
        );
      }
    }
  });
}

// funcioens globales
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
        nombreObjecto
      );
    } else {
      console.error("No se generó el documento correctamente");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

async function tonifyTurn(patient_id, appointment) {
  // const datosPaciente = await consultarDatosEnvioPaciente(patient_id);
  // const datosEmpresa = await consultarDatosEmpresaPorDoctorId("1");

  // let numero_paciente = datosPaciente.telefono;

  const datosMensaje = {
    tenant_id: "1",
    type: "whatsapp",
    belongs_to: "citas-cancelacion",
  };

  let template = await obtenerTemplate(datosMensaje, patient_id);

  let mensajeFinal = convertirHtmlAWhatsapp(template);
  enviarTexto(mensajeFinal, numero_paciente);
}
