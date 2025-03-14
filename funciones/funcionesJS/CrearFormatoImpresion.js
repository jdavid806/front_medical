async function generarFormato(objecto, nombreObjecto) {
  let formatoAImprimir = {};
  // esto es asi ya que no sé exactamente como esten construidos los objectos
  // y no sé si se respeta la regla de mantener ciertos datos iguales ejemplo
  // user_id y para evitar errores mejor se escribe más codigo pwro avmos a la fija c;
  switch (nombreObjecto) {
    case "Incapacidad":
      formatoAImprimir = await generarFormatoIncapacidad(objecto);
      break;
    case "Consentimiento":
      formatoAImprimir = await generarFormatoConsentimiento(objecto);
      break;
    case "Consulta":
      formatoAImprimir = await generarFormatoConsulta(objecto);
      break;
      break;
    case "Receta":
      formatoAImprimir = await generarFormatoReceta(objecto);
      break;
    case "ordenMedica":
      formatoAImprimir = await generarFormatoOrden(objecto);
      break;

    default:
      break;
  }

  return formatoAImprimir;
}

async function generarFormatoIncapacidad(incapacidad) {
  let contenido = `
  <div class="container p-3 border rounded shadow-sm">
    <h3 class="text-primary">Certificado de Incapacidad</h3>
    <hr>
    <div class="mb-3">
      <h5 class="fw-bold">Motivo de Incapacidad:</h5>
      <p class="text-muted">${incapacidad.reason}</p>
    </div>
    <div class="row">
      <div class="col-md-6">
        <p><strong>Desde:</strong> ${incapacidad.start_date}</p>
      </div>
      <div class="col-md-6">
        <p><strong>Hasta:</strong> ${incapacidad.end_date}</p>
      </div>
    </div>
  </div>`;
  let datosPaciente = await consultarDatosPaciente(
    incapacidad.patient_id,
    formatearFechaQuitarHora(incapacidad.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(incapacidad.user_id);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoConsentimiento(consentimeinto) {
  let contenido = `
  <div class="container p-3 border rounded shadow-sm">
    <h3 class="text-primary text-center">${consentimeinto.title}</h3>
    <hr>

    <div class="mb-3">
      ${consentimeinto.description}
    </div>
  </div>
  `;
  let datosPaciente = await consultarDatosPaciente(
    consentimeinto.patient_id,
    formatearFechaQuitarHora(consentimeinto.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor("1");

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoConsulta(consulta_id) {
  let url = obtenerRutaPrincipal() + `/medical/clinical-records/${consulta_id}`;
  let datosConsulta = await obtenerDatos(url);

  let urlTipoHistoria =
    obtenerRutaPrincipal() +
    `/medical/clinical-record-types/${datosConsulta.clinical_record_type_id}`;
  let tipoHistoria = await obtenerDatos(urlTipoHistoria);

  let contenido = `
<div class="container p-3 border rounded shadow-sm text-start">
  <h3 class="text-primary text-center">${tipoHistoria.name}</h3>
  <hr>
  <h4 class="text-secondary">Descripción:</h4>
  <p>${datosConsulta.description || "Sin descripción"}</p>
  <hr>
  <h4 class="text-secondary mb-3">Detalles de la historia clínica:</h4>
`;

  let tieneContenido = false;

  for (let clave in datosConsulta.data) {
    let valor = datosConsulta.data[clave];
    if (valor !== null && valor !== "") {
      tieneContenido = true;
      contenido += `
    <div class="mb-2">
      <h4 class="fw-bold text-capitalize">${clave
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()}</h4>
      <p>${valor}</p>
    </div>`;
    }
  }

  if (!tieneContenido) {
    contenido += `
  <p class="text-muted fst-italic">Historia creada sin contenido</p>`;
  }

  contenido += `
</div>`;

  let datosPaciente = await consultarDatosPaciente(
    datosConsulta.patient_id,
    formatearFechaQuitarHora(datosConsulta.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(
    datosConsulta.created_by_user_id
  );

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoReceta(recetaId) {
  let url = obtenerRutaPrincipal() + `/medical/recipes/${recetaId}`;
  let resultado = await obtenerDatos(url);

  let datosReceta = resultado.data;

  let contenido = `
  <div class="container p-3 border rounded shadow-sm text-start">
    <h3 class="text-primary text-center">Receta Médica</h3>
    <h4 class="text-secondary mb-3">Detalles de la receta:</h4>
`;

  // Generamos el contenido en formato horizontal y agrupado
  if (datosReceta.recipe_items.length > 0) {
    datosReceta.recipe_items.forEach((item, index) => {
      contenido += `
      <div class="mb-4">
        <h5 class="text-primary">Medicamento ${index + 1}:</h5>
        <p><strong>Nombre:</strong> ${
          item.medication
        } - <strong>Concentración:</strong> ${
        item.concentration
      } - <strong>Tipo:</strong> ${item.medication_type}</p>
        <p><strong>Frecuencia:</strong> ${
          item.frequency
        } - <strong>Duración:</strong> ${
        item.duration
      } días - <strong>Toma cada:</strong> ${item.take_every_hours} horas</p>
        <p><strong>Cantidad:</strong> ${item.quantity}</p>
        <p><strong>Observaciones:</strong> ${
          item.observations || "Sin observaciones"
        }</p>
      </div>
      <hr>`;
    });
  } else {
    contenido += `
    <p class="text-muted fst-italic">No hay medicamentos en esta receta</p>`;
  }

  contenido += `
  </div>`;

  let datosPaciente = await consultarDatosPaciente(
    datosReceta.patient_id,
    formatearFechaQuitarHora(datosReceta.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(datosReceta.prescriber.id);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}

async function generarFormatoOrden(ordenId) {
  let url = obtenerRutaPrincipal() + `/medical/exam-orders/${ordenId}`;
  let resultado = await obtenerDatos(url);

  // console.log(resultado);
  

  // let contenido = `
  // <div>
  // </div>`;

  // let datosPaciente = await consultarDatosPaciente(
  //   datosReceta.patient_id,
  //   formatearFechaQuitarHora(datosReceta.created_at)
  // );
  // let datosEmpresa = await consultarDatosEmpresa();
  // let datosDoctor = await consultarDatosDoctor(datosReceta.prescriber.id);

  // return {
  //   consultorio: datosEmpresa,
  //   paciente: datosPaciente,
  //   contenido,
  //   doctor: datosDoctor,
  // };
}
