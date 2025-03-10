async function cargarPlantillas() {
  let ruta = "http://dev.medicalsoft.ai/api/v1/firma/consents";
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
    selectPlantillas.appendChild(option);
  }

  selectPlantillas.onchange = function () {
    const selectedId = this.value;
    const selectedPlantilla = Plantillas.data.find((p) => p.id == selectedId);
    const patientId = new URLSearchParams(window.location.search).get(
      "patient_id"
    );

    let texto = `Estimado(a) [[NOMBRE_PACIENTE]],

Su cita médica ha sido agendada exitosamente. A continuación, le proporcionamos los detalles:

- Nombre del paciente: [[NOMBRE_PACIENTE]]
- Documento de identidad: [[DOCUMENTO]]
- Edad: [[EDAD]]
- Fecha de nacimiento: [[FECHANACIMIENTO]]
- Teléfono de contacto: [[TELEFONO]]
- Correo electrónico: [[CORREOELECTRONICO]]
- Ciudad: [[CIUDAD]]
- Fecha de la cita: [[FECHAACTUAL]]

El doctor encargado de su consulta será el/la [[NOMBRE_DOCTOR]].

Por favor, asegúrese de llegar al menos 15 minutos antes de la hora programada.

Atentamente,  
Clínica Ejemplo`;

    let consentimiento = reemplazarVariables(
      patientId,
      texto
    );

    console.log(consentimiento);

    // if (selectedPlantilla) {
    //   const editorContainer = document.querySelector(
    //     `#info-plantilla .ql-editor`
    //   );
    //   editorContainer.innerHTML = consentimiento;
    // }
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

    const productId = document.getElementById("consent_id")?.value;
    const productData = {
      title: document.getElementById("template-plantilla").value,
      template,
    };

    console.log(productData);

    // Validación básica
    if (!productData.title || !productData.template) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "La plantilla y su Contenido es obligatorio.",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // try {
    //   if (productId) {
    //     updateConsentimiento(productId, productData);
    //   } else {
    //     createConsentimiento(productData);
    //   }

    //   // Limpiar formulario y cerrar modal
    //   form.reset();
    //   $('#crearPlantilla').modal('hide');
    //   cargarConsentimientos();
    // } catch (error) {
    //   alert('Error al crear el producto: ' + error.message);
    // }
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
    .replace(/\[\[FECHAACTUAL\]\]/g, new Date() || "")
    .replace(/\[\[FECHANACIMIENTO\]\]/g, datos.date_of_birth || "")
    .replace(/\[\[TELEFONO\]\]/g, datos.whatsapp || "")
    .replace(/\[\[CORREOELECTRONICO\]\]/g, datos.email || "")
    .replace(/\[\[CIUDAD\]\]/g, datos.city_id || "");
}
