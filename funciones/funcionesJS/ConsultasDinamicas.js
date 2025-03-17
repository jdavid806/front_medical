async function consultarDatosWhatssap(tipo) {
  let url = obtenerRutaPrincipal() + `/medical/companies/1`;
  let datosEmpresa = await obtenerDatos(url);

  let datosMensajeria = datosEmpresa.data.communication;
  let urlBase = "https://apiwhatsapp.medicalsoft.ai/";

  return {
    apiKey: datosMensajeria.api_key,
    apiMensaje: `${urlBase}message/${tipo}/${datosMensajeria.instance}`,
    apiInstance: urlBase + "instance/" + tipo + "/" + datosMensajeria.instance,
  };
}

async function consultarWhatssapConectado() {
  const datosApi = await consultarDatosWhatssap("connect");

  try {
    const response = await fetch(datosApi.apiInstance, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: datosApi.apiKey,
      },
    });

    const result = await response.json();

    if (result.instance && result.instance.state === "open") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error al cargar el QR:", error);
  }
}

async function consultarDatosPaciente(pacienteId, fechaConsulta) {
  let data = await obtenerDatosPorId("patients", pacienteId);

  let nombre = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
  ];

  // let nombrEntidad = data.social_security.entity.name;
  let nombrEntidad = "test";

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

  return {
    nombre: "Dr(a). " + unirTextos(nombre),
    especialidad: data.specialty.name,
    firma: "",
  };
}

async function consultarDatosEmpresa() {
  let url = obtenerRutaPrincipal() + `/medical/companies/1`;
  let datosEmpresa = await obtenerDatos(url);

  let dataEmpresa = datosEmpresa.data;

  return {
    logo_consultorio: "",
    nombre_consultorio: dataEmpresa.name,
    marca_agua: dataEmpresa.watermark,
    datos_consultorio: [
      { Dirección: dataEmpresa.address },
      { Teléfono: dataEmpresa.phone },
      { Correo: dataEmpresa.email },
    ],
  };
}
