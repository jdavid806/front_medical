async function cargarPConsentimientos() {
  let ruta = "http://dev.medicalsoft.ai/api/v1/firma/templates";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaConsentimientos = document.getElementById("tablaPlantillasC");

    tablaConsentimientos.innerHTML = "";

    for (const producto of result.data) {
      // const row = document.createElement("tr");
      // row.innerHTML = `
      //   <td>${producto.title}</td>
      //   <td>
      //       <button class="btn btn-primary btn-sm" onclick="editarConsentimiento(${producto.id}, '${producto.title}', '${producto.template}')" data-bs-toggle="modal" data-bs-target="#crearPlantilla">
      //           <i class="fa-solid fa-pen"></i>
      //       </button>
      //       <button class="btn btn-danger btn-sm" onclick="eliminarConsentimiento(${producto.id})">
      //           <i class="fa-solid fa-trash"></i>
      //       </button>
      //   </td>
      // `;

      // tablaConsentimientos.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function eliminarPConsentimiento(id) {
  let url = `http://dev.medicalsoft.ai/api/v1/firma/templates/${id}`;
  EliminarDatos(url);
  cargarMetodosPago();
}

async function updatePConsentimiento(id, consentimeinto) {
  let url = `http://dev.medicalsoft.ai/api/v1/firma/templates/${id}`;
  actualizarDatos(url, consentimeinto);
}

async function createPConsentimiento(consentimiento) {
  guardarDatos(
    "http://dev.medicalsoft.ai/api/v1/firma/templates",
    consentimiento
  );
}

// function editarConsentimiento(id, title, template) {

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
