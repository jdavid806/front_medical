async function cargarEspecialidades() {
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
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#vincularHistoriasClinicas">
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

async function cargarSelectsEspecilidad() {
  let rutaHistorias = "http://dev.medicalsoft.ai/medical/clinical-record-types";

  let historias = await obtenerDatos(rutaHistorias);

  cargarSelect("historiaClinica", historias, "Seleccione una historia clínica");
}

function cargarSelectsFuncionesEspecialidades() {
  const tablaElementos = document.getElementById("tablaElementos");

  // Agregar historia clínica
  document
    .getElementById("agregarHistoriaClinica")
    .addEventListener("click", function () {
      const select = document.getElementById("historiaClinica");
      const valor = select.value;
      const texto = select.options[select.selectedIndex]?.text;

      if (valor) {
        agregarFilaTablaEspecialidad("Historia Clínica", texto);
        select.value = ""; // Reiniciar selección
      }
    });

  // Agregar CIE-11
  document
    .getElementById("agregarCie11")
    .addEventListener("click", function () {
      const select = document.getElementById("cie11");
      const valor = select.value;
      const texto = select.options[select.selectedIndex]?.text;

      if (valor) {
        agregarFilaTablaEspecialidad("CIE-11", texto);
        select.value = ""; // Reiniciar selección
      }
    });
}

function agregarFilaTablaEspecialidad(tipo, nombre) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
        <td>${tipo}</td>
        <td>${nombre}</td>
        <td><button class="btn btn-danger btn-sm eliminar">Eliminar</button></td>
    `;
  tablaElementos.appendChild(fila);

  // Agregar evento de eliminación
  fila.querySelector(".eliminar").addEventListener("click", function () {
    fila.remove();
  });
}
