async function guardarTemplate(datos) {
  let template = await obtenerTemplate(datos);

  let id = template.data.id;

  if (laPlantillaEstaVacia(template)) {
    let url = "http://dev.medicalsoft.ai/api/v1/firma/message-templates";
    await guardarDatos(url, datos);
  } else {
    let url = "http://dev.medicalsoft.ai/api/v1/firma/message-templates/" + id;
    await actualizarDatos(url, datos);
  }
}

async function obtenerTemplate(datos) {
  let tenant = datos.tenant_id;
  let belong = datos.belongs_to;
  let type = datos.type;

  let url = `http://dev.medicalsoft.ai/api/v1/firma/message-templates/filter/${tenant}/${belong}/${type}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
    return null;
  }
}

function laPlantillaEstaVacia(obj) {
  return Object.values(obj).every(
    (valor) =>
      valor === null ||
      valor === undefined ||
      (typeof valor === "string" && valor.trim() === "") ||
      (Array.isArray(valor) && valor.length === 0) ||
      (typeof valor === "object" && Object.keys(valor).length === 0)
  );
}
