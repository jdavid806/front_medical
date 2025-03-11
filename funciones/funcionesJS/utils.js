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

async function guardarDatos(url, datos) {
  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    // if (!respuesta.ok) {
    //   throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    // }

    const resultado = await respuesta.json();

    console.log(resultado);
    

    Swal.fire({
      icon: "success",
      title: "¡Guardado exitosamente!",
      text: "Los datos se han guardado correctamente.",
      timer: 2000,
      showConfirmButton: false,});
    // }).then(() => {
    //   location.reload();
    // });
    // return resultado;
  } catch (error) {
    console.error("Error al guardar los datos:", error);

    // Swal.fire({
    //   icon: "error",
    //   title: "Error al guardar",
    //   text: "Hubo un problema al guardar los datos.",
    //   confirmButtonText: "Aceptar",
    // });

    return null;
  }
}

async function actualizarDatos(url, datos) {
  try {
    const respuesta = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    const resultado = await respuesta.json();

    console.log(resultado);
    

    // Notificación de éxito
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

    // Notificación de error
    Swal.fire({
      icon: "error",
      title: "Error al actualizar",
      text: "Hubo un problema al actualizar los datos.",
      confirmButtonText: "Aceptar",
    });

    return null;
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
          },
        });

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "El recurso se eliminó correctamente.",
          confirmButtonText: "Aceptar",
        }).then(() => {
          location.reload();
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

function formatearFechaQuitarHora(fechaISO) {
  return new Date(fechaISO).toISOString().split("T")[0];
}

function reemplazarRuta(ruta) {
  const base = obtenerRutaPrincipal();

  return ruta.replace("../", base);
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

function convertirHtmlAWhatsapp(html) {
  return html
    .replace(/<strong>(.*?)<\/strong>/gi, "*$1*") // Negritas
    .replace(/<b>(.*?)<\/b>/gi, "*$1*") // También para <b>
    .replace(/<em>(.*?)<\/em>/gi, "_$1_") // Cursiva
    .replace(/<i>(.*?)<\/i>/gi, "_$1_") // También para <i>
    .replace(/<s>(.*?)<\/s>/gi, "~$1~") // Tachado
    .replace(/<del>(.*?)<\/del>/gi, "~$1~") // También para <del>
    .replace(/<br\s*\/?>/gi, "\n") // Saltos de línea
    .replace(/<p>(.*?)<\/p>/gi, "$1\n\n") // Párrafos con doble salto de línea
    .replace(/<[^>]+>/g, ""); // Elimina cualquier otra etiqueta HTML
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
