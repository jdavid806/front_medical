import { generarMensajePersonalizado } from "./FuncionesMensajes.js";

async function enviarMensaje(ruta, patient_id, user_id, titulo, nombreObjecto) {
  let rutaFinal = reemplazarRuta(ruta);

  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let numero_paciente = datosPaciente.telefono;
  let nombre_paciente = datosPaciente.nombre;

  const datosEmpresa = await consultarDatosEmpresaPorDoctorId(user_id);

  let tipoMensaje = "";
  // si ya sé que asco esto en vez de organisar esto, pero aja tengo sueño hambre
  // y estoys eguro que esto solo lo tocara aquella persona que lo vaya a migrar
  // asi que aja que sufra el otro yo lo hare facil ＼(≧▽≦)／
  switch (nombreObjecto) {
    case "Incapacidad":
      tipoMensaje = "incapacidades-compartir";
      break;
    case "Incapacidad":
      tipoMensaje = "incapacidades-compartir";
      break;

    default:
      break;
  }

  constDatosMensaje = {
    tenant_id: "1", // esto lo peuden mandar quemado la verad lo pedi porque no sabia como funcionaba la base XD
    type: "whatsapp",
    belongs_to: tipoMensaje,
  };

  let responseTemplate = await obtenerTemplate(constDatosMensaje);

  let template =
    responseTemplate.data?.template ||
    `🔔 Estimado/a ${nombre_paciente},

Le informamos que tiene una nueva notificación. Por favor, revise su bandeja de entrada o contáctenos para más información.

📞 ${datosEmpresa.datos_consultorio.Teléfono}
🏥 ${datosEmpresa.nombre_consultorio}

¡Estamos atentos para ayudarle!`;

  let mensajeFinal = convertirHtmlAWhatsapp(template);

  const parametrosMensaje = {
    number: "573502462970",
    mediatype: "document", // image, video or document
    caption: mensajeFinal,
    media: rutaFinal /* url or base64 */,
    fileName: titulo,
  };

  try {
    const response = await fetch(datosApi.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: datosApi.apiKey,
      },
      body: JSON.stringify(parametrosMensaje),
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

async function envarTexto(mensaje, numero) {
  console.log("enviado mesnaje");
}

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
      enviarMensaje(resultado.ruta, patient_id, user_id, titulo, nombreObjecto);
    } else {
      console.error("No se generó el documento correctamente");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
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

async function tonifyTurn(number, appointment) {
  console.log("cargando footer");
  
  // generarMensajeTexto();
}
