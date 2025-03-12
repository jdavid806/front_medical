async function cargarPlantillas() {
  let ruta = obtenerRutaPrincipal() + "/api/v1/firma/consents";
  let Plantillas = await obtenerDatos(ruta);

  const selectPlantillas = document.getElementById("template-plantilla");
  selectPlantillas.innerHTML = "";

  // Agregar opción por defecto
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Seleccione una plantilla";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectPlantillas.appendChild(defaultOption);

  for (const producto of Plantillas.data) {
    const option = document.createElement("option");
    option.value = producto.id;
    option.textContent = producto.title;
    option.dataset.title = producto.title; // Agregar el título como data-attribute
    selectPlantillas.appendChild(option);
  }

  selectPlantillas.onchange = function () {
    const selectedOption = this.selectedOptions[0]; // Obtener la opción seleccionada
    const selectedId = selectedOption.value;
    const selectedTitle = selectedOption.dataset.title; // Obtener el título desde data-title
    const selectedPlantilla = Plantillas.data.find((p) => p.id == selectedId);
    const patientId = new URLSearchParams(window.location.search).get(
      "patient_id"
    );

    let texto = selectedPlantilla.template;

    reemplazarVariables(patientId, texto).then((consentimiento) => {
      if (selectedPlantilla) {
        const editorContainer = document.querySelector(
          `#info-plantilla .ql-editor`
        );
        editorContainer.innerHTML = consentimiento;

        // Almacenar el título en un atributo del select
        selectPlantillas.dataset.selectedTitle = selectedTitle;
      }
    });
  };
}

function handleGenerarConsentimientosForm() {
  const form = document.getElementById("formCrearIncapacidad");

  if (!form) {
    console.warn("El formulario de creación no existe en el DOM");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editorContainer = document.querySelector(
      `#info-plantilla .ql-editor`
    );

    let template = editorContainer.innerHTML;
    const patientId = new URLSearchParams(window.location.search).get(
      "patient_id"
    );

    const productId = document.getElementById("consentP_id")?.value;
    const selectPlantillas = document.getElementById("template-plantilla");
    const plantillaTitle = selectPlantillas.dataset.selectedTitle;

    const productData = {
      // template_type_id: selectPlantillas.value,
      template_type_id: 1, // por el momento lo quemamos igual tampoco lo necesitamos
      title: plantillaTitle,
      description: template,
      data: ["variable 1, variable 2"], // por el momento lo quemamos igual tampoco lo necesitamos
      tenant_id: "0", // por el momento lo quemamos igual tampoco lo necesitamos
      patient_id: patientId,
    };

    console.log(productData);

    // Validación básica
    // if (!plantillaTitle || !productData.template) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error al guardar",
    //     text: "La plantilla y su Contenido es obligatorio.",
    //     confirmButtonText: "Aceptar",
    //   });
    //   return;
    // }

    try {
      if (productId) {
        updatePConsentimiento(productId, productData);
      } else {
        createPConsentimiento(productData);
      }

      // Limpiar formulario y cerrar modal
      form.reset();
      $("#modalCrearDocumento").modal("hide");
      cargarConsentimientos();
    } catch (error) {
      alert("Error al crear el producto: " + error.message);
    }
  });
}

async function reemplazarVariables(id, template) {
  let datos = await obtenerDatosPorId("patients", id);

  let nombre = [
    datos.first_name,
    datos.middle_name,
    datos.last_name,
    datos.second_last_name,
  ];

  return template
    .replace(/\[\[NOMBRE_PACIENTE\]\]/g, unirTextos(nombre) || "")
    .replace(/\[\[DOCUMENTO\]\]/g, datos.document_number || "")
    .replace(/\[\[NOMBRE_DOCTOR\]\]/g, datos.nombreDoctor || "")
    .replace(/\[\[EDAD\]\]/g, calcularEdad(datos.date_of_birth) || "")
    .replace(
      /\[\[FECHAACTUAL\]\]/g,
      new Date().toLocaleDateString("es-CO") || ""
    )
    .replace(/\[\[FECHANACIMIENTO\]\]/g, datos.date_of_birth || "")
    .replace(/\[\[TELEFONO\]\]/g, datos.whatsapp || "")
    .replace(/\[\[CORREOELECTRONICO\]\]/g, datos.email || "")
    .replace(/\[\[CIUDAD\]\]/g, datos.city_id || "");
}
