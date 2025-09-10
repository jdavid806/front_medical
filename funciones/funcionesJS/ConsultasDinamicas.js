async function consultarDatosWhatssap(tipo) {
  let url =
    obtenerRutaPrincipal() +
    `/medical/companies?include=billings,representative,communication`;
  let datosEmpresa = await obtenerDatos(url);
  console.log("datosEmpresa ", datosEmpresa);

  let datosMensajeria = datosEmpresa.data[0].includes.communication;
  let urlBase = "https://apiwhatsapp.medicalsoft.ai/";

  console.log({
    url,
    datosEmpresa,
    datosMensajeria,
    urlBase,
    apiKey: datosMensajeria?.api_key,
    apiMensaje: `${urlBase}message/${tipo}/${datosMensajeria?.instance}`,
    apiInstance: urlBase + "instance/" + tipo + "/" + datosMensajeria?.instance,
    testNumero: urlBase + "chat/whatsappNumbers/" + datosMensajeria?.instance,
  });

  return {
    apiKey: datosMensajeria?.api_key,
    apiMensaje: `${urlBase}message/${tipo}/${datosMensajeria?.instance}`,
    apiInstance: urlBase + "instance/" + tipo + "/" + datosMensajeria?.instance,
    testNumero: urlBase + "chat/whatsappNumbers/" + datosMensajeria?.instance,
  };
}

async function consultarWhatssapConectado() {
  const datosApi = await consultarDatosWhatssap("connect");

  console.log("Datos API:", datosApi);
  if (!datosApi.apiKey) {
    return "NO-CREADA";
  }

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
      return "CONECTADA";
    } else {
      return "NO-CONECTADA";
    }
  } catch (error) {
    console.error("Error al cargar el QR:", error);
  }
}

async function consultarDatosPaciente(pacienteId, fechaConsulta) {
  let data = await obtenerDatosPorId("patients", pacienteId);
  // console.log("data ", data);
  let nombre = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
  ];

  // let nombrEntidad = data.social_security.entity.name;
  let nombrEntidad = "Desconocido";

  return {
    datos_basicos: {
      nombre: unirTextos(nombre) || "Desconocido",
      documento: data.document_number || "Desconocido",
      edad: calcularEdad(data.date_of_birth) || "Desconocido",
      telefono: data.whatsapp || "Desconocido",
      correo: data.email || "Desconocido",
    },
    datos_generales: {
      direccion: data.address || "Desconocido",
      genero: traducirGenero(data.gender) || "Desconocido",
      entidad: data.social_security?.entity?.name || "Desconocido",
      // "tipo afiliado": data.social_security?.affiliate_type || "Desconocido",
      // "fecha Consulta": fechaConsulta || "Desconocido",
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
  // console.log("doctorId", doctorId);
  // console.log("Datos Doctor ", data);

  let nombre = [
    data.first_name,
    data.middle_name,
    data.last_name,
    data.second_last_name,
  ];

  let especialidad = await getUserSpecialtyName(data.user_specialty_id);
  // console.log("Especialidad Doctor ", especialidad);
  // pendiente consultar
  // Datos firma

  let firma = await getFileUrl(data.firma_minio_id);
  let sello = await getFileUrl(data.image_minio_id);
  let registro_medico = data.clinical_record;

  return {
    nombre: "Dr(a). " + unirTextos(nombre),
    especialidad,
    firma: firma,
    sello: sello,
    registro_medico: registro_medico,
  };
}

async function consultarDatosEmpresa() {
  let url = obtenerRutaPrincipal() + `/medical/companies/1`;
  let datosEmpresa = await obtenerDatos(url);
  // console.log("ruta empresa", url);
  let dataEmpresa = datosEmpresa.data.attributes;

  return {
    logo_consultorio: await getUrlImage(
      dataEmpresa.logo.replaceAll("\\", "/"),
      true
    ),
    nombre_consultorio: dataEmpresa.legal_name,
    marca_agua: await getUrlImage(
      dataEmpresa.watermark.replaceAll("\\", "/"),
      true
    ),
    datos_consultorio: [
      { RNC: dataEmpresa.document_number },
      { Dirección: dataEmpresa.address },
      { Teléfono: dataEmpresa.phone },
      { Correo: dataEmpresa.email },
    ],
  };
}
