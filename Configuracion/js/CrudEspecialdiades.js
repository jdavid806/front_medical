async function cargarEspecilialidades() {
  console.log("cargando");

  let ruta = "http://dev.medicalsoft.ai/medical/specialties";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaEspecialiades = document.getElementById("tablaEspecialidades");

    tablaEspecialiades.innerHTML = "";

    for (const producto of result) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.name}</td>
      `;

      tablaEspecialiades.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}
