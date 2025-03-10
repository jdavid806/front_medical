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
  let datosEmpresa = await consultarDatosEmpresaPorDoctorId(
    incapacidad.user_id
  );
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
    <h3 class="text-primary text-center">Consentimiento Informado</h3>
    <hr>

    <div class="mb-3">
      <p>
        Declaro haber sido informado/a de manera clara y comprensible sobre el procedimiento a realizar, sus riesgos y beneficios. 
        Autorizo voluntariamente la realización del mismo.
      </p>
    </div>
  </div>
  `;
  // let datosPaciente = await consultarDatosPaciente(
  //   incapacidad.patient_id,
  //   formatearFechaQuitarHora(incapacidad.created_at)
  // );
  // let datosEmpresa = await consultarDatosEmpresaPorDoctorId(
  //   incapacidad.user_id
  // );
  // let datosDoctor = await consultarDatosDoctor(incapacidad.user_id);

  // return {
  //   consultorio: datosEmpresa,
  //   paciente: datosPaciente,
  //   contenido,
  //   doctor: datosDoctor,
  // };
}
