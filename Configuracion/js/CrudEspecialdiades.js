async function cargarEspecialidades() {
  let ruta = obtenerRutaPrincipal() + "/medical/specialties";

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
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" onclick="abrirModal(${especialidad.id})"  data-bs-target="#vincularHistoriasClinicas">
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
  let rutaHistorias = obtenerRutaPrincipal() + "/medical/clinical-record-types";

  let historias = await obtenerDatos(rutaHistorias);

  cargarSelect("historiaClinica", historias, "Seleccione una historia clínica");
}

function cargarSelectsFuncionesEspecialidades() {
  document
    .getElementById("agregarHistoriaClinica")
    .addEventListener("click", function () {
      const select = document.getElementById("historiaClinica");
      const id = select.value;
      const texto = select.options[select.selectedIndex]?.text;

      if (id) {
        agregarFilaTablaEspecialidad("Historia Clínica", texto, id);
        select.value = ""; // Reiniciar selección
      }
    });

  document
    .getElementById("agregarCie11")
    .addEventListener("click", function () {
      const select = document.getElementById("cie11");
      const id = select.value;
      const texto = select.options[select.selectedIndex]?.text;

      if (id) {
        agregarFilaTablaEspecialidad("CIE-11", texto, id);
        select.value = ""; // Reiniciar selección
      }
    });

  document
    .getElementById("formVincularHistoriasClinicas")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const elementos = obtenerElementosTabla();
      const productId = document.getElementById("speciality_id")?.value;

      try {
        // if (productId && 1==3) {
        //   updateEspecilidad(productId, elementos);
        // } else {
        // }
        createEspecilidad(elementos);

        // Limpiar formulario y cerrar modal
        form.reset();
        $("#crearMetodoPago").modal("hide");
        cargarMetodosPago();
      } catch (error) {
        // alert("Error al crear el producto: " + error.message);
      }
    });
}

function agregarFilaTablaEspecialidad(tipo, nombre, id) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
        <td>${tipo}</td>
        <td>${nombre}</td>
        <td>
            <input type="hidden" class="elemento-id" value="${id}">
            <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
        </td>
    `;
  document.getElementById("tablaElementos").appendChild(fila);

  // Evento para eliminar fila
  fila.querySelector(".eliminar").addEventListener("click", function () {
    fila.remove();
  });
}

function obtenerElementosTabla() {
  const filas = document.querySelectorAll("#tablaElementos tr");
  const elementos = [];

  filas.forEach((fila) => {
    const tipo = fila.cells[0].textContent;
    const nombre = fila.cells[1].textContent;
    const id = fila.querySelector(".elemento-id").value;
    const productId = document.getElementById("speciality_id")?.value;

    elementos.push({
      tipo: tipo,
      id: id,
      specialty_id: productId,
    });
  });

  return elementos;
}

function abrirModal(id) {
  let hiddenInput = document.getElementById("speciality_id");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "speciality_id";
    hiddenInput.name = "speciality_id";
    document
      .getElementById("formVincularHistoriasClinicas")
      .appendChild(hiddenInput);
  }
  hiddenInput.value = id;
}

async function updateEspecilidad(id, especialidad) {
  console.log(especialidad);
  let url = obtenerRutaPrincipal() + `/medical/specializables/${id}`;
  actualizarDatos(url, especialidad);
}

async function createEspecilidad(especialidad) {
  console.log(especialidad);
  let url = obtenerRutaPrincipal() + "/medical/specializables/";
  guardarDatos(url, especialidad);
}
