async function consultarDatosWhatssap(tipo) {
  let url = obtenerRutaPrincipal() + `/medical/companies/1`;
  let datosEmpresa = await obtenerDatos(url);

  let datosMensajeria = datosEmpresa.data.communications;
  let urlBase = "https://apiwhatsapp.medicalsoft.ai/";

  // consulta inatcncia
  // "https://apiwhatsapp.medicalsoft.ai/instance/connect/testMiguel"

  return {
    apiKey: datosMensajeria.api_key,
    apiMensaje: `${urlBase}message/${tipo}/${datosMensajeria.instance}`,
    apiInstance: urlBase + "instance/" + tipo + "/" + datosMensajeria.instance,
  };
}

async function consultarDatosPaciente(pacienteId, fechaConsulta) {
  let data = await obtenerDatosPorId("patients", pacienteId);

  let nombre = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
  ];

  // let url =
  //   obtenerRutaPrincipal() +
  //   `/medical/entities/${data.social_security.entity_id}`;
  // let entidad = await obtenerDatos(url);

  // let nombrEntidad = entidad.data.name;
  let nombrEntidad = "Test";

  return {
    datos_basicos: {
      nombre: unirTextos(nombre),
      documento: data.document_type + "-" + data.document_number,
      edad: calcularEdad(data.date_of_birth),
      telefono: data.whatsapp,
      correo: data.email,
    },
    datos_generales: {
      direccion: data.address,
      genero: traducirGenero(data.gender),
      entidad: nombrEntidad,
      "tipo afiliado": data.social_security.affiliate_type,
      fecha_consulta: fechaConsulta,
    },
  };
}

async function consultarDatosEnvioPaciente(pacienteId) {
  let data = await obtenerDatosPorId("patients", pacienteId);

  let nombre = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
  ];

  let indicativo = await getCountryInfo(data.country_id);

  return {
    nombre: unirTextos(nombre),
    documento: data.document_type + "-" + data.document_number,
    telefono: indicativo + data.whatsapp,
  };
}

async function consultarDatosDoctor(doctorId) {
  let data = await obtenerDatosPorId("users", doctorId);

  let nombre = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
  ];

  // pendiente consultar
  // Datos firma
  // Datos de especialidad

  return {
    nombre: "Dr(a). " + unirTextos(nombre),
    especialidad: data.user_specialty_id,
    firma: "",
  };
}

async function consultarDatosEmpresa() {
  // Pendiente Consultar esta data
  let url = obtenerRutaPrincipal() + `/medical/companies/1`;
  let datosEmpresa = await obtenerDatos(url);

  let nombre_consultorio = datosEmpresa.name;

  console.log(datosEmpresa); 

  return {
    logo_consultorio: "",
    nombre_consultorio: datosEmpresa.data.offices[0].commercial_name,
    marca_agua: "",
    datos_consultorio: [
      { Dirección: "Calle Falsa 123 del doctor: "},
      { Teléfono: 123456789 },
      { Correo: "consultorio@prueba.com" },
    ],
  };
}
