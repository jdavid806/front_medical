async function cargarRetenciones() {
  let ruta = obtenerRutaPrincipal() + "/api/v1/admin/tax-withholdings";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaCuenatsContables = document.getElementById("tablaRetenciones");

    tablaCuenatsContables.innerHTML = "";

    for (const producto of result.data) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.name}</td>
        <td>${producto.percentage}</td>
        <td>${producto.accountin_account}</td>
        <td>${producto.description}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarRetencion(${producto.id}, '${producto.name}','${producto.percentage}', '${producto.accountin_account}', '${producto.description}')" data-bs-toggle="modal" data-bs-target="#crearImpuestoRetencion">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarRetencion(${producto.id})">
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

async function eliminarRetencion(id) {
  let url = obtenerRutaPrincipal() + `/api/v1/admin/tax-withholdings/${id}`;
  EliminarDatos(url);
  cargarRetenciones();
}

async function updateRetencion(id, retencion) {
  let url = obtenerRutaPrincipal() + `/api/v1/admin/tax-withholdings/${id}`;
  actualizarDatos(url, retencion);
  $("#crearImpuestoRetencion").modal("hide");
  cargarRetenciones();
}

async function createRetencion(retencion) {
  guardarDatos(
    obtenerRutaPrincipal() + "/api/v1/admin/tax-withholdings/",
    retencion
  );
  $("#crearImpuestoRetencion").modal("hide");
  cargarRetenciones();
}

function editarRetencion(id, name, porcentaje, accountin_account, description) {
  document.getElementById("nombre-retencion").value = name;
  document.getElementById("porcentaje-retencion").value = porcentaje;
  document.getElementById("cuenta-contable-retencion").value =
    accountin_account;
  document.getElementById("descripcion-retencion").value = description;

  // Agregar un input oculto con el ID del producto
  let hiddenInput = document.getElementById("retencion_id");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "retencion_id";
    hiddenInput.name = "retencion_id";
    document.getElementById("formAgregarRetencion").appendChild(hiddenInput);
  }
  hiddenInput.value = id;
}
