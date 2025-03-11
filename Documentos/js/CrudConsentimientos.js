async function cargarPConsentimientos() {
  let ruta = obtenerRutaPrincipal() + "/api/v1/firma/templates";
  const patient_id = new URLSearchParams(window.location.search).get(
    "patient_id"
  );

  // let ruta = obtenerRutaPrincipal() + `/api/v1/firma/templates/${patient_id}/patient`;
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaConsentimientos = document.getElementById("tablaPlantillasC");

    tablaConsentimientos.innerHTML = "";

    for (const producto of result.data) {
      const fecha = new Date(producto.created_at).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${fecha}</td>
      <td>${producto.title}</td>
      <td class="text-end align-middle">
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i data-feather="settings"></i> Acciones
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#" onclick="editarPConsentimiento(${producto.id},${producto.title},${producto.description})">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-pen" style="width: 20px;"></i>
                  <span>Editar</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" onclick="eliminarPConsentimiento(${producto.id})">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-trash" style="width: 20px;"></i>
                  <span>Eliminar</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" onclick="imprimirConsentimiento(${producto.id})">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-print" style="width: 20px;"></i>
                  <span>Imprimir</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" id="generate_consent_pdf" onclick="descargarConsentimiento(${producto.id})">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-download" style="width: 20px;"></i>
                  <span>Descargar</span>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li class="dropdown-header">Compartir</li>
            <li>
              <a class="dropdown-item" href="#" onclick="compartirConsentimiento(${producto.id})">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                  <span>Compartir por Whatsapp</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                  <span>Compartir por Correo</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </td>
    `;

      tablaConsentimientos.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function eliminarPConsentimiento(id) {
  let url = obtenerRutaPrincipal() + `/api/v1/firma/templates/${id}`;
  EliminarDatos(url);
  cargarMetodosPago();
}

async function updatePConsentimiento(id, consentimeinto) {
  let url = obtenerRutaPrincipal() + `/api/v1/firma/templates/${id}`;
  actualizarDatos(url, consentimeinto);
}

async function createPConsentimiento(consentimiento) {
  guardarDatos(
    obtenerRutaPrincipal() + "/api/v1/firma/templates",
    consentimiento
  );
}

async function imprimirConsentimiento(id) {
  console.log("impirmiendo" + id);
  let url = obtenerRutaPrincipal() + `/api/v1/firma/templates/${id}`;
  let consentimeinto = await obtenerDatos(url);
  crearDocumento(
    consentimeinto,
    "Impresion",
    "Consentimiento",
    "Completa",
    consentimeinto.title
  );
}

async function descargarConsentimiento(id) {
  let url = obtenerRutaPrincipal() + `/api/v1/firma/templates/${id}`;
  let consentimeinto = await obtenerDatos(url);
  crearDocumento(
    consentimeinto,
    "Descarga",
    "Consentimiento",
    "Completa",
    consentimeinto.title
  );
}

async function compartirConsentimiento(id) {
  let url = obtenerRutaPrincipal() + `/api/v1/firma/templates/${id}`;
  let consentimeinto = await obtenerDatos(url);
  enviarDocumento(
    consentimeinto,
    "Descarga",
    "Consentimiento",
    "Completa",
    consentimeinto.patient_id,
    "1",
    consentimeinto.title
  );
}

// function editarPConsentimiento(id, title, template) {

//   const editorContainer = document.querySelector(
//     `#contenido-plantilla .ql-editor`
//   );
//   editorContainer.innerHTML = template;
//   document.getElementById("titulo-plantilla").value = title;

//   // Agregar un input oculto con el ID del producto
//   let hiddenInput = document.getElementById("consent_id");
//   if (!hiddenInput) {
//     hiddenInput = document.createElement("input");
//     hiddenInput.type = "hidden";
//     hiddenInput.id = "consent_id";
//     hiddenInput.name = "consent_id";
//     document.getElementById("formAgregarPlantilla").appendChild(hiddenInput);
//   }
//   hiddenInput.value = id;
// }
