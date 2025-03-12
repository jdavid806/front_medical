async function guardarTemplate(datos) {
  let template = await obtenerTemplate(datos);

  let id = template.data.id;

  if (laPlantillaEstaVacia(template)) {
    let url = obtenerRutaPrincipal() + "/api/v1/firma/message-templates";
    guardarDatos(url, datos);
  } else {
    let url = obtenerRutaPrincipal() + "/api/v1/firma/message-templates/" + id;
    actualizarDatos(url, datos);
  }
}

async function obtenerTemplate(datos, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let numero_paciente = datosPaciente.telefono;
  let nombre_paciente = datosPaciente.nombre;

  const datosEmpresa = await consultarDatosEmpresa();

  let tenant = datos.tenant_id;
  let belong = datos.belongs_to;
  let type = datos.type;

  return `<p>🔔 Estimado/a ${nombre_paciente},</p>
<p>Le informamos que tiene una nueva notificación. Por favor, revise su bandeja de entrada o contáctenos para más información.</p>
<p><strong>📞 Teléfono:</strong> ${datosEmpresa.datos_consultorio.Teléfono}</p>
<p><strong>🏥 Consultorio:</strong> ${datosEmpresa.nombre_consultorio}</p>
<p>¡Estamos atentos para ayudarle!</p>`;

  // let url = obtenerRutaPrincipal() + `/api/v1/firma/message-templates/filter/${tenant}/${belong}/${type}`;
  // try {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error("Error en la solicitud");
  //   }
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error("Hubo un problema con la solicitud:", error);
  //   return null;
  // }
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
