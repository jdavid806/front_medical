async function cargarEntidades() {
  let ruta = obtenerRutaPrincipal() + "/medical/entities";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaEntidades = document.getElementById("tablaEntidades");

    tablaEntidades.innerHTML = "";

    for (const producto of result.data) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.name}</td>
        <td>${producto.document_number}</td>
        <td>${producto.email}</td>
        <td>${producto.phone}</td>
        <td>${producto.address}</td>
        <td>${producto.koneksi_sponsor_slug}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarEntidad(${producto.id}, 
            '${producto.name}', '${producto.document_number}',
            '${producto.document_type}', '${producto.email}', 
            '${producto.phone}', '${producto.address}')" data-bs-toggle="modal" data-bs-target="#crearEntidad">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarEntidad(${producto.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
      `;

      tablaEntidades.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function eliminarEntidad(id) {
  let url = obtenerRutaPrincipal() + `/medical/entities/${id}`;
  EliminarDatos(url);
  cargarEntidades();
}

async function updateEntidad(id, entidad) {
  let url = obtenerRutaPrincipal() + `/medical/entities/${id}`;
  actualizarDatos(url, entidad);
  $('#crearPlantilla').modal('hide');
  cargarEntidades();
}

async function createEntidad(entidad) {
  const spinner = document.getElementById("spinnerEntidades");
  spinner.style.display = "block";

  try {
    await guardarDatos(obtenerRutaPrincipal() + "/medical/entities", entidad);
    $('#crearEntidad').modal('hide');
    await cargarEntidades(); // esperar que termine
  } catch (error) {
    throw error; // propaga el error para manejarlo en handleEntidadesForm
  } finally {
    spinner.style.display = "none";
  }
}


function editarEntidad(
  id,
  name,
  document_number,
  document_type,
  email,
  phone,
  address
) {
  document.getElementById("nombre-entidad").value = name;
  document.getElementById("numeroIdentificacion-entidad").value =
    document_number;
  document.getElementById("tipoIdentificacion-entidad").value = document_type;
  document.getElementById("email-entidad").value = email;
  document.getElementById("telefono-entidad").value = phone;
  document.getElementById("direccion-entidad").value = address;

  // Agregar un input oculto con el ID de la entidad
  let hiddenInput = document.getElementById("entity_id");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "entity_id";
    hiddenInput.name = "entity_id";
    document.getElementById("formAgregarEntidad").appendChild(hiddenInput);
  }
  hiddenInput.value = id;
}
