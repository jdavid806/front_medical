async function cargarEspecialidades() {
  console.log("Cargando especialidades...");
  let ruta = "http://dev.medicalsoft.ai/medical/specialties";

  try {
    const response = await fetch(ruta);
    if (!response.ok) throw new Error("Error en la solicitud");
    const result = await response.json();

    const tablaEspecialidades = document.getElementById("tablaEspecialidades");
    tablaEspecialidades.innerHTML = "";

    for (const especialidad of result) {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td class="name">${especialidad.name}</td>
            <td>
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#vincularEspecialidades">
                  <i class="fa-solid fa-gears"></i>
                </button></th>
            </td>
        `;
      tablaEspecialidades.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}
