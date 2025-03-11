async function consultarDatosWhatssapPorDoctorId(doctorId) {
  // pendiente esta data
  return {
    apiKey: "75C2D69C6DB2-4F15-BDB2-706F6F28B605",
    apiUrl: "https://apiwhatsapp.medicalsoft.ai/message/sendMedia/testMiguel",
    apiConnect:
      "https://apiwhatsapp.medicalsoft.ai/instance/connect/testMiguel",
    apiLogOut: "https://apiwhatsapp.medicalsoft.ai/instance/logout/testMiguel",
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

  let url = `http://dev.medicalsoft.ai/medical/entities/${data.social_security.entity_id}`;
  let entidad = await obtenerDatos(url);

  let nombrEntidad = entidad.data.name;

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
    telefono: indicativo+ data.whatsapp,
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

async function consultarDatosEmpresaPorDoctorId(doctorId) {
  // Pendiente Consultar esta data
  return {
    logo_consultorio: "",
    nombre_consultorio: "Consultorio de Prueba",
    marca_agua: "",
    datos_consultorio: [
      { Dirección: "Calle Falsa 123 del doctor: " + doctorId },
      { Teléfono: 123456789 },
      { Correo: "consultorio@prueba.com" },
    ],
  };
}
