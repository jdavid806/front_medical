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
    case "Examen":
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
  <hr>`;

  const estructura = {
    "Información de la Consulta": [
      { titulo: "Motivo de la consulta", campos: ["motivoConsulta"] },
      { titulo: "Evolución de los síntomas", campos: ["evolucionSintomas"] },
      { titulo: "Contexto de los síntomas", campos: ["contextoSintoma"] },
      { titulo: "¿Qué ha tomado?", campos: ["manejoSintoma"] },
    ],
    "Signos vitales": [
      {
        titulo: "Medidas corporales",
        campos: ["peso", "altura", "imc", "porcentajeGrasaCorporal"],
      },
      {
        titulo: "Presión y saturación",
        campos: [
          "presionArterialDiastolica",
          "presionArterialSistolica",
          "tensionArterialMedia",
          "saturacion",
        ],
      },
      {
        titulo: "Circunferencias",
        campos: [
          "circunferenciaAbdominal",
          "circunferenciaCintura",
          "perimetroCefalico",
        ],
      },
      {
        titulo: "Frecuencia y temperatura",
        campos: ["frecuenciaRespiratoria", "frecuenciaCardiaca", "temperatura"],
      },
    ],
  };

  // Función para capitalizar la primera letra de cada palabra
  const capitalizar = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Función para verificar si un campo ya está en la estructura
  const campoEnEstructura = (campo) => {
    for (let seccion in estructura) {
      for (let grupo of estructura[seccion]) {
        if (grupo.campos.includes(campo)) {
          return true;
        }
      }
    }
    return false;
  };

  // Recorrer la estructura y generar el contenido
  for (let seccion in estructura) {
    contenido += `<h3 class="text-primary mt-2">${seccion}</h3><hr>`;
    estructura[seccion].forEach((grupo) => {
      contenido += `<h4 class="fw-bold text-secondary">${grupo.titulo}</h4><div class="row">`;
      grupo.campos.forEach((campo) => {
        let valor = datosConsulta.data[campo];
        // Omitir campos con valor null
        if (valor === null || valor === undefined) {
          return;
        }
        let tituloCampo = capitalizar(
          campo.replace(/([A-Z])/g, " $1").toLowerCase()
        );
        // Evitar mostrar el título redundante
        // if (grupo.titulo.toLowerCase() === tituloCampo.toLowerCase()) {
        if (
          grupo.titulo == "Motivo de la consulta" ||
          grupo.titulo == "Evolución de los síntomas" ||
          grupo.titulo == "Contexto de los síntomas"
        ) {
          contenido += `
            <div class="col-md-6">
              ${valor}
            </div>`;
        } else {
          contenido += `
            <div class="col-md-6">
              <strong>${tituloCampo}</strong>: ${valor}
            </div>`;
        }
      });
      contenido += `</div>`;
    });
  }

  // Mostrar datos adicionales no mapeados
  // contenido += `<h3 class="text-primary mt-4">Datos Adicionales</h3><hr><div class="row">`;
  for (let campo in datosConsulta.data) {
    if (!campoEnEstructura(campo)) {
      let valor = datosConsulta.data[campo];
      // Omitir campos con valor null
      if (valor === null || valor === undefined) {
        continue;
      }
      let tituloCampo = capitalizar(
        campo.replace(/([A-Z])/g, " $1").toLowerCase()
      );
      contenido += `
        <div class="col-md-6">
          <strong>${tituloCampo}</strong>: ${valor}
        </div>`;
    }
  }
  contenido += `</div>`;

  contenido += `</div>`;

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
  <div class="container border rounded shadow-sm text-start">
    <h3 class="text-primary text-center">Receta Médica</h3>
    <h4 class="text-secondary">Detalles de la receta:</h4>
`;

  // Generamos el contenido en formato horizontal y agrupado
  if (datosReceta.recipe_items.length > 0) {
    datosReceta.recipe_items.forEach((item, index) => {
      contenido += `
      <div class="mb-2">
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
  let dataState = await obtenerDatos(url);

  let state = getOrdenState(dataState.exam_order_state.name);

  let contenido = `
  <div class="container border rounded shadow-sm text-start">
    <h3 class="text-primary text-center">Orden de Examen Médico</h3>
    <h4 class="text-secondary">Detalles del examen:</h4>
    <p><strong>Tipo de examen:</strong> ${dataState.exam_type.name}</p>
    <p><strong>Estado:</strong> ${state}</p>
    <hr>
  `;

  // Iteramos por las tarjetas y campos dinámicos del examen
  dataState.exam_type.form_config.tabs.forEach((tab) => {
    contenido += `<h4 class="text-secondary">${tab.tab}</h4>`;

    tab.cards.forEach((card) => {
      contenido += `<h5 class="text-primary">${card.title}</h5>`;

      card.fields.forEach((field) => {
        contenido += `
        <p><strong>${field.label}</strong></p>
        <div>${
          dataState.exam_type.form_config.values[field.id] || "Sin datos"
        }</div>
        `;
      });
    });
    contenido += "<hr>";
  });

  contenido += `</div>`;

  let datosPaciente = await consultarDatosPaciente(
    dataState.patient_id,
    formatearFechaQuitarHora(dataState.created_at)
  );
  let datosEmpresa = await consultarDatosEmpresa();
  let datosDoctor = await consultarDatosDoctor(1);

  return {
    consultorio: datosEmpresa,
    paciente: datosPaciente,
    contenido,
    doctor: datosDoctor,
  };
}
