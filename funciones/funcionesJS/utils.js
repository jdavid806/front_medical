async function obtenerDatosPorId(tabla, id) {
  const apiUrl = obtenerRutaPrincipal() + `/medical/${tabla}/${id}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    return null;
  }
}

async function obtenerDatosPorTabla(tabla) {
  const apiUrl = obtenerRutaPrincipal() + `/medical/${tabla}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    return null;
  }
}

async function obtenerDatos(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    return null;
  }
}

function getDomain() {
  return window.location.hostname.split(".")[0];
}

async function guardarDatos(url, datos) {
  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DOMAIN": getDomain(),
        "X-External-ID": getJWTPayload().sub,
      },
      body: JSON.stringify(datos),
    });

    const contentType = respuesta.headers.get("content-type");
    let resultado = null;

    if (contentType && contentType.includes("application/json")) {
      resultado = await respuesta.json();
    }

    if (!respuesta.ok) {
      // Lanzar el JSON del error, para que se pueda capturar en catch
      throw (
        resultado ||
        new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
      );
    }

    Swal.fire({
      icon: "success",
      title: "¡Guardado exitosamente!",
      text: "Los datos se han guardado correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    return resultado;
  } catch (error) {
    console.error("Error al guardar los datos:", error);

    Swal.fire({
      icon: "error",
      title: "Error al guardar",
      text: error.message || "Hubo un problema al guardar los datos.",
      confirmButtonText: "Aceptar",
    });

    throw error;
  }
}

async function actualizarDatos(url, datos) {
  try {
    const respuesta = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-DOMAIN": getDomain(),
        "X-External-ID": getJWTPayload().sub,
      },
      body: JSON.stringify(datos),
    });

    const contentType = respuesta.headers.get("content-type");
    let resultado = null;

    if (contentType && contentType.includes("application/json")) {
      resultado = await respuesta.json();
    }

    if (!respuesta.ok) {
      throw (
        resultado ||
        new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
      );
    }

    Swal.fire({
      icon: "success",
      title: "¡Actualización exitosa!",
      text: "Los datos se han actualizado correctamente.",
      timer: 2000,
      showConfirmButton: false,
    });

    return resultado;
  } catch (error) {
    console.error("Error al actualizar los datos:", error);

    Swal.fire({
      icon: "error",
      title: "Error al actualizar",
      text: error.message || "Hubo un problema al actualizar los datos.",
      confirmButtonText: "Aceptar",
    });

    throw error;
  }
}

async function EliminarDatos(url) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar!",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-DOMAIN": getDomain(),
            "X-External-ID": getJWTPayload().sub,
          },
        });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El recurso se eliminó correctamente.",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        console.error("Error al eliminar el recurso:", error);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el recurso. Por favor, inténtalo de nuevo.",
          confirmButtonText: "Aceptar",
        });
      }
    }
  });
}

function unirTextos(arr) {
  return arr
    .filter(Boolean)
    .map((txt) => txt.trim())
    .join(" ");
}

function calcularEdad(fechaNacimiento) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  const diffTiempo = hoy - nacimiento; // Diferencia en milisegundos
  const diffDias = Math.floor(diffTiempo / (1000 * 60 * 60 * 24));
  const diffAnios = Math.floor(diffDias / 365.25);
  const diffMeses = Math.floor(diffDias / 30.44);

  if (diffAnios > 0) {
    return `${diffAnios} ${diffAnios === 1 ? "año" : "años"}`;
  } else if (diffMeses > 0) {
    return `${diffMeses} ${diffMeses === 1 ? "mes" : "meses"}`;
  } else {
    return `${diffDias} ${diffDias === 1 ? "día" : "días"}`;
  }
}

function traducirGenero(genero) {
  const mapaGeneros = {
    MALE: "Masculino",
    FEMALE: "Femenino",
  };

  return mapaGeneros[genero.toUpperCase()] || "Desconocido";
}

function traducirTipoExamene(examen) {
  const mapaTiposExamenes = {
    LABORATORY: "Laboratorio",
    IMAGING: "Imagenología",
  };

  return mapaTiposExamenes[examen.toUpperCase()] || "Desconocido";
}

function getOrdenState(state) {
  const statesMap = {
    PENDING: "Pendiente",
    CANCELED: "Cancelado",
    UPLOADED: "Subido",
    GENERATED: "Generado",
  };

  return statesMap[state.toUpperCase()] || "Desconocido";
}

function formatearFechaQuitarHora(fechaISO) {
  return new Date(fechaISO).toISOString().split("T")[0];
}

function reemplazarRuta(ruta) {
  const base = obtenerRutaPrincipal();

  return ruta.replace("../", base + "/");
}

function gerateKeys() {
  return encryptData("AntiÑeros");
}

function copiarTexto(id) {
  const texto = document.getElementById(id).innerText.trim(); // Obtiene el texto y elimina espacios extra
  const textoFormato = `[[${texto}]]`; // Asegura el formato [[CAMPO]]

  navigator.clipboard
    .writeText(textoFormato)
    .then(() => {
      // Muestra la alerta de éxito con SweetAlert
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Texto copiado: " + textoFormato,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    })
    .catch((err) => {
      console.error("Error al copiar el texto: ", err);
    });
}

async function getCountryInfo(value) {
  let url = obtenerRutaPrincipal() + "/medical/countries";
  let paises = await obtenerDatos(url);

  for (const pais of paises.data) {
    if (value.toLowerCase() === pais.name.toLowerCase()) {
      return pais.phonecode;
    }
  }
}
async function getSpecialtyName(value) {
  let url = obtenerRutaPrincipal() + "/medical/specialties";
  let especialidades = await obtenerDatos(url);

  for (const especilidad of especialidades) {
    if (value === especilidad.id) {
      return especilidad.name;
    }
  }
}

async function getUserSpecialtyName(value) {
  let url = obtenerRutaPrincipal() + "/medical/user-specialties";
  let especialidades = await obtenerDatos(url);

  for (const especilidad of especialidades) {
    if (value === especilidad.id) {
      return especilidad.name;
    }
  }
}

function convertirHtmlAWhatsapp(html) {
  return (
    html
      // **Negritas**: convierte <strong> y <b> a *texto*
      .replace(/<strong>(.*?)<\/strong>/gi, "*$1*")
      .replace(/<b>(.*?)<\/b>/gi, "*$1*")
      // _Cursiva_: convierte <em> y <i> a _texto_
      .replace(/<em>(.*?)<\/em>/gi, "_$1_")
      .replace(/<i>(.*?)<\/i>/gi, "_$1_")
      // ~Tachado~: convierte <s> y <del> a ~texto~
      .replace(/<s>(.*?)<\/s>/gi, "~$1~")
      .replace(/<del>(.*?)<\/del>/gi, "~$1~")
      // Saltos de línea: convierte <br> a una nueva línea
      .replace(/<br\s*\/?>/gi, "\n")
      // Párrafos: convierte <p> en texto con salto de línea
      .replace(/<p>(.*?)<\/p>/gi, "$1\n")
      // Elimina cualquier otra etiqueta HTML restante
      .replace(/<[^>]+>/g, "")
      // Elimina los saltos de línea sobrantes al final del texto
      .replace(/\n+$/, "")
  );
}

function cargarSelect(id, datos, placeholder) {
  const select = document.getElementById(id);
  select.innerHTML = "";

  // Agregar opción por defecto
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  // Agregar opciones desde los datos
  for (const item of datos) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    select.appendChild(option);
  }
}

function obtenerRutaPrincipal() {
  let url = window.location.origin;
  let rutaBase = url.replace(/:\d+$/, "");
  return rutaBase;
}

function obtenerTenant() {
  let url = window.location.hostname;
  let subdominio = url.split(".")[0];
  return subdominio;
}

function consultarTipoMensaje(nombreObjecto) {
  let tipoMensaje = "";
  // si ya sé que asco esto en vez de organisar esto, pero aja tengo sueño hambre
  // y estoy s guro que esto solo lo tocara aquella persona que lo vaya a migrar
  // asi que aja que sufra el otro yo lo hare facil ＼(≧▽≦)／
  switch (nombreObjecto) {
    case "Incapacidad":
      tipoMensaje = "incapacidades-compartir";
      break;

    default:
      tipoMensaje = "No definido";
      break;
  }
  return tipoMensaje;
}

// cerrarSesion

async function logoutBack() {
  const token = sessionStorage.getItem("auth_token");

  if (!token) return; // Si no hay token, no hacemos nada

  try {
    const response = await fetch(obtenerRutaPrincipal() + "/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 🔑 Mandamos el token en el header
        "X-DOMAIN": getDomain(),            // si tu backend lo requiere
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error en logout:", data);
    } else {
    }
  } catch (error) {
    console.error("Error al hacer logout:", error);
  }
}


function cerrarSesion() {
  let botonSalir = document.getElementById("btn-logout");
  console.log("botonSalirrr", botonSalir);
  

  if (botonSalir) {
    botonSalir.addEventListener("click", () => {
      Swal.fire({
        title: "¿Cerrar sesión?",
        text: "¿Seguro que quieres salir de la aplicación?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {

          await logoutBack();
          
          sessionStorage.clear();
          localStorage.clear();

          Swal.fire(
            "¡Sesión cerrada!",
            "Has salido correctamente.",
            "success"
          ).then(() => {
            window.location.href = "inicio";
          });
        }
      });
    });
  }
}

window.onload = cerrarSesion;

// cerrra sesion

function calcularDiferenciaDias(start_date, end_date) {
  const fechaInicio = new Date(start_date);
  const fechaFin = new Date(end_date);

  // Calculamos la diferencia en milisegundos y la convertimos a días
  const diferenciaTiempo = fechaFin - fechaInicio;
  const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24);

  return diferenciaDias;
}

//datos variables

async function convertirDatosVariables(
  template,
  nombreObjecto,
  patient_id,
  object_id
) {
  let mensaje = "";

  switch (nombreObjecto) {
    case "Incapacidad":
      mensaje = await reemplazarVariablesIncapacidad(
        template,
        object_id,
        patient_id
      );
      break;
    case "Cita":
      mensaje = await reemplazarVariablesCita(template, object_id, patient_id);
      break;
    case "Turno":
      mensaje = await reemplazarVariablesTurno(template, object_id);
      break;
    case "Factura":
      mensaje = await reemplazarVariablesFactura(
        template,
        object_id,
        patient_id
      );
      break;
    case "Historia":
      mensaje = await reemplazarVariablesHistoria(
        template,
        object_id,
        patient_id
      );
      break;
    case "Receta":
      mensaje = await reemplazarVariablesReceta(
        template,
        object_id,
        patient_id
      );
    case "Orden":
      mensaje = await reemplazarVariablesOrden(template, object_id, patient_id);
      break;

    default:
      mensaje = "No definido";
      break;
  }
  return mensaje;
}

async function reemplazarVariablesIncapacidad(template, object_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let nombrePaciente = datosPaciente.nombre;

  let urlIncapacidad =
    obtenerRutaPrincipal() + `/medical/disabilities/${object_id}`;

  const datosIncapacidad = await obtenerDatos(urlIncapacidad);

  let fechaIncapacidad = formatearFechaQuitarHora(datosIncapacidad.created_at);

  let especialista = [
    datosIncapacidad.user.first_name,
    datosIncapacidad.user.middle_name,
    datosIncapacidad.user.last_name,
    datosIncapacidad.user.second_last_name,
  ];

  let Especialidad = await getSpecialtyName(
    datosIncapacidad.user.user_specialty_id
  );

  let fechaInicio = datosIncapacidad.start_date;

  let fechaFin = datosIncapacidad.end_date;
  let dias = calcularDiferenciaDias(fechaInicio, fechaFin);

  let recomendaciones = datosIncapacidad.reason;

  let enlace =
    obtenerRutaPrincipal() +
    `/visualizarDocumento/${encryptData(object_id)}/${encryptData(
      "incapacidad"
    )}`;

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, nombrePaciente || "")
    .replace(/\[\[FECHA_INCAPACIDAD\]\]/g, fechaIncapacidad || "")
    .replace(/\[\[ESPECIALISTA\]\]/g, unirTextos(especialista) || "")
    .replace(/\[\[ESPECIALIDAD\]\]/g, Especialidad || "")
    .replace(/\[\[FECHA_INCIO\]\]/g, fechaInicio || "")
    .replace(/\[\[FECHA_FIN\]\]/g, fechaFin || "")
    .replace(/\[\[ENLACE DOCUMENTO\]\]/g, enlace || "")
    .replace(/\[\[DIAS_INCAPACIDAD\]\]/g, dias || "")
    .replace(/\[\[RECOMENDACIONES\]\]/g, recomendaciones || "");
}

async function reemplazarVariablesCita(template, object_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let nombrePaciente = datosPaciente.nombre;

  let urlCita = obtenerRutaPrincipal() + `/medical/appointments/${object_id}`;
  const datosCita = await obtenerDatos(urlCita);

  let fechaCita = datosCita.appointment_date;
  let HoraCita = datosCita.appointment_time;

  let especialista = [
    datosCita.user_availability.user.first_name,
    datosCita.user_availability.user.middle_name,
    datosCita.user_availability.user.last_name,
    datosCita.user_availability.user.second_last_name,
  ];

  let especilidad = await getSpecialtyName(
    datosCita.user_availability.user.user_specialty_id
  );

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, nombrePaciente || "")
    .replace(/\[\[FECHA_CITA\]\]/g, fechaCita || "")
    .replace(/\[\[HORA_CITA\]\]/g, HoraCita || "")
    .replace(/\[\[ESPECIALISTA\]\]/g, unirTextos(especialista) || "")
    .replace(/\[\[ESPECIALIDAD\]\]/g, especilidad || "")
    .replace(/\[\[MOTIVO_REAGENDAMIENTO\]\]/g, "Motivo Motivo" || "")
    .replace(/\[\[MOTIVO_CANCELACION\]\]/g, "Motivo Cancelacion" || "");
}

async function reemplazarVariablesTurno(template, object_id) {
  let urlTurno = obtenerRutaPrincipal() + `/medical/tickets/${object_id}`;
  const datosTurno = await obtenerDatos(urlTurno);

  let nombrePaciente = datosTurno.patient_name;
  let ticket = datosTurno.ticket_number;

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, nombrePaciente || "")
    .replace(/\[\[TICKET\]\]/g, ticket || "");
}

async function reemplazarVariablesFactura(template, object_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let nombrePaciente = datosPaciente.nombre;

  let urlFactura =
    obtenerRutaPrincipal() + `/api/v1/admin/invoices/${object_id}`;
  const datosFactura = await obtenerDatos(urlFactura);

  let fechaFactura = formatearFechaQuitarHora(datosFactura.created_at);

  let montoFacturado = datosFactura.total_amount;

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, nombrePaciente || "")
    .replace(/\[\[FECHA_FACTURA\]\]/g, fechaFactura || "")
    .replace(/\[\[MONTO_FACTURADO\]\]/g, montoFacturado || "");
}

async function reemplazarVariablesHistoria(template, object_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let nombrePaciente = datosPaciente.nombre;

  let url = obtenerRutaPrincipal() + `/medical/clinical-records/${object_id}`;
  let datosConsulta = await obtenerDatos(url);

  let datosDoctor = await consultarDatosDoctor(
    datosConsulta.created_by_user_id
  );

  let fechaHistoria = formatearFechaQuitarHora(datosConsulta.created_at);

  let especialista = datosDoctor.nombre;

  let especilidad = datosDoctor.especialidad;

  let enlace =
    obtenerRutaPrincipal() +
    `/visualizarDocumento/${encryptData(object_id)}/${encryptData("consulta")}`;

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, nombrePaciente || "")
    .replace(/\[\[FECHA_HISTORIA\]\]/g, fechaHistoria || "")
    .replace(/\[\[ENLACE DOCUMENTO\]\]/g, enlace || "")
    .replace(/\[\[ESPECIALISTA\]\]/g, especialista || "")
    .replace(/\[\[ESPECIALIDAD\]\]/g, especilidad || "");
}

async function reemplazarVariablesReceta(template, object_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let nombrePaciente = datosPaciente.nombre;

  let url = obtenerRutaPrincipal() + `/medical/recipes/${object_id}`;
  let datosReceta = await obtenerDatos(url);

  let data = datosReceta.data;

  let datosDoctor = await consultarDatosDoctor(data.prescriber.id);

  let fechaHistoria = formatearFechaQuitarHora(data.created_at);

  let especialista = datosDoctor.nombre;

  let especilidad = datosDoctor.especialidad;

  let recomendaciones = data.recipe_items.observations;

  let enlace =
    obtenerRutaPrincipal() +
    `/visualizarDocumento/${encryptData(object_id)}/${encryptData("receta")}`;

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, nombrePaciente || "")
    .replace(/\[\[FECHA_RECETA\]\]/g, fechaHistoria || "")
    .replace(/\[\[ESPECIALISTA\]\]/g, especialista || "")
    .replace(/\[\[ESPECIALIDAD\]\]/g, especilidad || "")
    .replace(/\[\[ENLACE DOCUMENTO\]\]/g, enlace || "")
    .replace(/\[\[RECOMENDACIONES\]\]/g, recomendaciones || "");
}

async function reemplazarVariablesOrden(template, object_id, patient_id) {
  const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

  let nombrePaciente = datosPaciente.nombre;

  let url = obtenerRutaPrincipal() + `/medical/exam-orders/${object_id}`;
  let datosOrden = await obtenerDatos(url);

  let fechaOrden = formatearFechaQuitarHora(datosOrden.created_at);

  let nombreExamen = datosOrden.exam_type.name;

  let enlace =
    obtenerRutaPrincipal() +
    `/visualizarDocumento/${encryptData(object_id)}/${encryptData("orden")}`;

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, nombrePaciente || "")
    .replace(/\[\[FECHA_EXAMEN\]\]/g, fechaOrden || "")
    .replace(/\[\[ENLACE DOCUMENTO\]\]/g, enlace || "")
    .replace(/\[\[NOMBRE_EXAMEN\]\]/g, nombreExamen || "");
}

function getJWTPayload() {
  const token = sessionStorage.getItem("auth_token");

  if (token) {
    const payloadBase64 = token.split(".")[1];
    return JSON.parse(atob(payloadBase64));
  }

  return null;
}
