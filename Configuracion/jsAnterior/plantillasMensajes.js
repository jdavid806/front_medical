function guardarDataPlantilla(tabId) {
  const editorContainer = document.querySelector(
    `#${tabId}-content .ql-editor`
  );

  if (editorContainer) {
    const contenido = editorContainer.innerHTML;

    const select = document.querySelector(`#plantilla-${tabId}`);
    const opcionSeleccionada = select ? select.value : null;

    const adjuntoSwitch = document.querySelector(`#adjunto-${tabId}`);
    const adjuntoSeleccionado = adjuntoSwitch ? adjuntoSwitch.checked : false;

    const datos = {
      tenant_id: "1",
      template: contenido,
      type: opcionSeleccionada,
      belongs_to: tabId,
      attached: adjuntoSeleccionado,
    };

    guardarTemplate(datos);
  } else {
    console.error("No se encontró el editor Quill para el tab:", tabId);
  }
}

async function cambiarContenidoEditor(tabId) {
  const editorContainer = document.querySelector(
    `#${tabId}-content .ql-editor`
  );
  
  const select = document.querySelector(`#plantilla-${tabId}`);
  const opcionSeleccionada = select ? select.value : null;

  const adjuntoSwitch = document.querySelector(`#adjunto-${tabId}`);
  const adjuntoSeleccionado = adjuntoSwitch ? adjuntoSwitch.checked : false;

  const datos = {
    tenant_id: "1",
    type: opcionSeleccionada,
    belongs_to: tabId,
    attached: adjuntoSeleccionado,
  };

  let response = await obtenerTemplate(datos);
  let template =
    response.data?.template || "<p>Todavía no has creado un mensaje</p>";

  if (editorContainer) {
    editorContainer.innerHTML = template;
  } else {
    console.error("No se encontró el editor Quill para el tab:", tabId);
  }
}

// Alternativa para TinyMCE si decides volver a usarlo
function guardarDataPlantillaTiny(tabId) {
  const editor = tinymce.get(`${tabId}-content`);

  if (editor) {
    const contenido = editor.getContent();

    const select = document.querySelector(`#plantilla-${tabId}`);
    const opcionSeleccionada = select ? select.value : null;

    console.log("Tab activo:", tabId);
    console.log("Contenido del editor TinyMCE:", contenido);
    console.log("Opción seleccionada:", opcionSeleccionada);
  } else {
    console.error("No se encontró el editor TinyMCE para el tab:", tabId);
  }
}

function cambiarContenidoEditorTiny(tabId) {
  const editor = tinymce.get(`${tabId}-content`);

  if (editor) {
    editor.setContent("<p>Hola mundo</p>");
  } else {
    console.error("No se encontró el editor TinyMCE para el tab:", tabId);
  }
}
