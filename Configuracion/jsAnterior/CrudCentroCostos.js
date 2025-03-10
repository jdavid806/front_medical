async function cargarCentrosCosto() {
  let ruta = "http://dev.medicalsoft.ai/api/v1/admin/centres-cost";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaCuenatsContables = document.getElementById("tablaCentrosCostos");

    tablaCuenatsContables.innerHTML = "";

    for (const producto of result.data) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.name}</td>
        <td>${producto.code}</td> 
        <td>${producto.description}</td> 
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarCentroC(${producto.id}, '${producto.name}', '${producto.code}', '${producto.description}')" data-bs-toggle="modal" data-bs-target="#crearCentroCostos">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarCentroC(${producto.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
      `;

      tablaCuenatsContables.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function eliminarCentroC(id) {
  let url = `http://dev.medicalsoft.ai/api/v1/admin/centres-cost/${id}`;
  EliminarDatos(url);
  cargarCentrosCosto();
}

async function updateCentroCosto(id, centroCosto) {
  let url = "http://dev.medicalsoft.ai/api/v1/admin/centres-cost/" + id;
  actualizarDatos(url, centroCosto);
  cargarCentrosCosto();
}

async function createCentroCosto(centroCosto) {
  guardarDatos(
    "http://dev.medicalsoft.ai/api/v1/admin/centres-cost",
    centroCosto
  );
}

function editarCentroC(id, name, code, description) {

  document.getElementById("nombre-centro").value = name;
  document.getElementById("codigo-centro").value = code;
  document.getElementById("descripcion-centro").value = description;

  // Agregar un input oculto con el ID del producto
  let hiddenInput = document.getElementById("centro_id");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "centro_id";
    hiddenInput.name = "centro_id";
    document.getElementById("formAgregarCentroCostos").appendChild(hiddenInput);
  }
  hiddenInput.value = id;
}
