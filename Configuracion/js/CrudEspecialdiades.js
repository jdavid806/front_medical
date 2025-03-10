async function cargarEspecilialidades() {
  console.log("cargando");

  let ruta = "http://dev.medicalsoft.ai/medical/specialties";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaEntidades = document.getElementById("tablaEntidades");

    tablaEntidades.innerHTML = "";

    // console.log(result);
    // Nota si no soy yo el que lo arregla
    // primero descomenta result para ver que trae ya que aveces varias
    // y toca colocarle el .data y aveces solo es result ┐(￣ヮ￣)┌ ᕕ( ᐛ )ᕗ
    //
    for (const producto of result.data) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${producto.name}</td>
      `;

      tablaEntidades.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}
