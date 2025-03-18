async function guardarTemplate(datos) {
  let template = await obtenerTemplate(datos, true);

  let id = await obtenerIdTemplate(datos);

  // Aja esto tiene este if porque me pues de opendejo a modificar la función de arriba
  // si pues esto es lo maś facil y me da pereza crear una nueva (ᗒᗣᗕ)՞
  if (template == "<p>Todavía no has creado un mensaje</p>") {
    let url = obtenerRutaPrincipal() + "/api/v1/firma/message-templates";
    guardarDatos(url, datos);
  } else {
    let url = obtenerRutaPrincipal() + "/api/v1/firma/message-templates/" + id;
    actualizarDatos(url, datos);
  }
  // Nota final lo importante es que funciona <(￣︶￣)>
}

async function obtenerTemplate(datos, plantillaConfiguracion = false) {
  let tenant = datos.tenant_id;
  let belong = datos.belongs_to;
  let type = datos.type;

  let url =
    obtenerRutaPrincipal() +
    `/api/v1/firma/message-templates/filter/${tenant}/${belong}/${type}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const repuesta = await response.json();

    let plantilla = repuesta.data;

    let mensaje = "";

    if (Object.keys(repuesta.data).length === 0) {
      if (plantillaConfiguracion) {
        mensaje = "<p>Todavía no has creado un mensaje</p>";
      } else {
        mensaje = `<p>🔔 Estimado/a [[NOMBRE_PACIENTE]],</p>
<p>Le informamos que tiene una nueva notificación. Por favor, revise su bandeja de entrada o contáctenos para más información.</p>
<p><strong>📞 Teléfono:</strong> [[TELEFONO_CONSULTORIO]]</p>
<p><strong>🏥 Consultorio:</strong> [[NOMBRE_CONSULTORIO]]</p>
<p>¡Estamos atentos para ayudarle!</p>`;
      }
    } else {
      mensaje = plantilla.template;
    }

    return mensaje;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    return null;
  }
}

async function enviarArchivoWhatssap(datos) {
  let tenant = datos.tenant_id;
  let belong = datos.belongs_to;
  let type = datos.type;

  let url =
    obtenerRutaPrincipal() +
    `/api/v1/firma/message-templates/filter/${tenant}/${belong}/${type}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const repuesta = await response.json();

    let plantilla = repuesta.data;

    let respuesta = "";

    if (Object.keys(repuesta.data).length === 0) {
      repuesta = false;
    } else {
      respuesta = plantilla.attached;
    }

    return respuesta;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    return null;
  }
}

async function obtenerIdTemplate(datos) {
  let tenant = datos.tenant_id;
  let belong = datos.belongs_to;
  let type = datos.type;

  let url =
    obtenerRutaPrincipal() +
    `/api/v1/firma/message-templates/filter/${tenant}/${belong}/${type}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const repuesta = await response.json();

    let plantilla = repuesta.data;

    let templateID = "";

    if (Object.keys(repuesta.data).length === 0) {
      templateID = 0;
    } else {
      templateID = plantilla.id;
    }

    return templateID;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    return null;
  }
}

function laPlantillaEstaVacia(obj) {
  return Object.values(obj).every(
    (valor) =>
      valor === null ||
      valor === undefined ||
      (typeof valor === "string" && valor.trim() === "") ||
      (Array.isArray(valor) && valor.length === 0) ||
      (typeof valor === "object" && Object.keys(valor).length === 0)
  );
}
