async function cargarMetodosPago() {
  let ruta = "http://dev.medicalsoft.ai/api/v1/admin/payment-methods";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaMetodosPago = document.getElementById("tablaMetodosPago");

    tablaMetodosPago.innerHTML = "";

    for (const producto of result) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.method}</td>
        <td>${producto.accounting_account}</td> 
        <td>N/A</td>
        <td>${producto.description || "N/A"}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarMetodo(${
              producto.id
            }, '${producto.method}', '${
        producto.accounting_account
      }', 'N/A', '${
        producto.description
      }')" data-bs-toggle="modal" data-bs-target="#crearMetodoPago">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarMetodo(${
              producto.id
            })">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
      `;

      tablaMetodosPago.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function eliminarMetodo(id) {
  let url = `http://dev.medicalsoft.ai/api/v1/admin/payment-methods/${id}`;
  EliminarDatos(url);
  cargarMetodosPago()
}

async function updateMetodoPago(id, metodoPago) {
  let url = `http://dev.medicalsoft.ai/api/v1/admin/payment-methods/${id}`;
  actualizarDatos(url, metodoPago);
  cargarMetodosPago()
}

async function createMetodoPago(metodoPago) {
  guardarDatos(
    "http://dev.medicalsoft.ai/api/v1/admin/payment-methods/",
    metodoPago
  );
  cargarMetodosPago()
}

function editarMetodo(id, method, accounting_account, bank, description) {
  document.getElementById("nombre-metodo").value = method;
  document.getElementById("numero-cuenta").value = accounting_account;
  document.getElementById("banco-metodo").value = bank;
  document.getElementById("descripcion-metodo").value = description;

  // Agregar un input oculto con el ID del producto
  let hiddenInput = document.getElementById("method_id");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "method_id";
    hiddenInput.name = "method_id";
    document.getElementById("formAgregarMetodoPago").appendChild(hiddenInput);
  }
  hiddenInput.value = id;
}
