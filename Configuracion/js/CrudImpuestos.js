async function cargarImpuestos() {
  let ruta = obtenerRutaPrincipal() + "/api/v1/admin/tax-charges";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaCuenatsContables = document.getElementById("tablaImpuestos");

    tablaCuenatsContables.innerHTML = "";

    for (const producto of result.data) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.name}</td>
        <td>${producto.percentage}</td>
        <td>${producto.accountin_account}</td>
        <td>${producto.description}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarImpuesto(${producto.id}, '${producto.name}','${producto.percentage}', '${producto.accountin_account}', '${producto.description}')" data-bs-toggle="modal" data-bs-target="#crearImpuesto">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarImpuesto(${producto.id})">
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

async function eliminarImpuesto(id) {
  let url = obtenerRutaPrincipal() + `/api/v1/admin/tax-charges/${id}`;
  EliminarDatos(url);
  cargarImpuestos();
}

async function updateImpuesto(id, impuesto) {
  let url = obtenerRutaPrincipal() + `/api/v1/admin/tax-charges/${id}`;
  actualizarDatos(url, impuesto);
  $("#crearImpuesto").modal("hide");
  cargarImpuestos();
}

async function createImpuesto(impuesto) {
  guardarDatos(obtenerRutaPrincipal() + "/api/v1/admin/tax-charges/", impuesto);
  $("#crearImpuesto").modal("hide");
  cargarImpuestos();
}

function editarImpuesto(id, name, porcentaje, accountin_account, description) {
  document.getElementById("nombre-impuesto").value = name;
  document.getElementById("porcentaje-impuesto").value = porcentaje;
  document.getElementById("cuenta-contable-impuesto").value = accountin_account;
  document.getElementById("descripcion-impuesto").value = description;

  // Agregar un input oculto con el ID del producto
  let hiddenInput = document.getElementById("impuesto_id");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "impuesto_id";
    hiddenInput.name = "impuesto_id";
    document.getElementById("formAgregarImpuesto").appendChild(hiddenInput);
  }
  hiddenInput.value = id;
}
