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

  let template = await obtenerTemplate(datos, true);

  if (editorContainer) {
    editorContainer.innerHTML = template;
  } else {
    console.error("No se encontró el editor Quill para el tab:", tabId);
  }
}