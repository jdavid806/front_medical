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
                <button class="btn btn-primary btn-sm" data-bs-toggle="modal" onclick="abrirModal(${especialidad.id}, '${especialidad.name}')"  data-bs-target="#vincularHistoriasClinicas">
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
        agregarFilaTablaEspecialidad("Historia Clínica", texto, id, texto);
        select.value = ""; // Reiniciar selección
      }
    });

  document
    .getElementById("agregarCie11")
    .addEventListener("click", async function () {
      const select = document.getElementById("cie11");
      const texto = select.value;
      // const texto = select.options[select.selectedIndex]?.text;
      let endpointCie11 =
        obtenerRutaPrincipal() + "/medical/cie11/get-by-code/" + texto;
      let endpointExecute = await obtenerDatos(endpointCie11);
      const cie11 =
        endpointExecute[0].codigo + " - " + endpointExecute[0].descripcion;
      const id = endpointExecute[0].codigo;
      const description = endpointExecute[0].descripcion;
      if (id) {
        agregarFilaTablaEspecialidad("CIE-11", cie11, id, description);
        select.value = ""; // Reiniciar selección
      }
    });

  document
    .getElementById("formVincularHistoriasClinicas")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const elementos = obtenerElementosTabla();
      const productId = document.getElementById("speciality_id")?.value;

      console.log(elementos);

      try {
        if (productId) {
          updateEspecilidad(productId, elementos);
        } else {
          createEspecilidad(elementos);
        }

        // Limpiar formulario y cerrar modal
        form.reset();
        $("#crearMetodoPago").modal("hide");
        cargarMetodosPago();
      } catch (error) {
        // alert("Error al crear el producto: " + error.message);
      }
    });
}

function agregarFilaTablaEspecialidad(tipo, nombre, id, description = "") {
  const fila = document.createElement("tr");
  fila.innerHTML = `
        <td>${tipo}</td>
        <td>${nombre}</td>
        <td>
            <input type="hidden" class="elemento-id" value="${id}">
            <input type="hidden" class="elemento-description" value="${description}">
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
    const description = fila.querySelector(".elemento-description").value;
    const productId = document.getElementById("speciality_name")?.value;

    elementos.push({
      specializable_type: tipo,
      specializable_id: id,
      specialty_id: nameSpecialty,
      description: description,
    });
  });

  return elementos;
}

function rellenarElementos() {
  const tabla = document.getElementById("tablaElementos");
  tabla.innerHTML = "";
}

let nameSpecialty;

async function abrirModal(id, name) {
  rellenarElementos();
  let hiddenInput = document.getElementById("speciality_id");
  let hiddenName = document.getElementById("speciality_name");
  nameSpecialty = name;

  let rutaSpecializables =
    obtenerRutaPrincipal() + "/medical/specializables/by-specialty/" + name;

  let dataEspecializables = await obtenerDatos(rutaSpecializables);

  console.log("data especializable: ", dataEspecializables);

  if (dataEspecializables.length) {
    dataEspecializables.forEach((element) => {
      agregarFilaTablaEspecialidad(
        element.specializable_type,
        element.specializable_id + " - " + element.description,
        element.specializable_id,
        element.description
      );
    });
  } else {
    rellenarElementos();
  }

  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "speciality_id";
    hiddenInput.name = "speciality_id";
    document
      .getElementById("formVincularHistoriasClinicas")
      .appendChild(hiddenInput);
  }
  if (!hiddenName) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "speciality_name";
    hiddenInput.name = "speciality_name";
    document
      .getElementById("formVincularHistoriasClinicas")
      .appendChild(hiddenInput);
  }
  // hiddenInput.value = id;
  // hiddenName.value = name || "";
}

async function updateEspecilidad(id, especialidad) {
  let url = obtenerRutaPrincipal() + `/medical/specializables/${id}`;
  actualizarDatos(url, especialidad);
}

async function createEspecilidad(especialidad) {
  let url =
    obtenerRutaPrincipal() +
    "/medical/specializables/" +
    especialidad[0].specialty_id;
  actualizarDatos(url, especialidad);
  setTimeout(() => {
    window.location.href = "FE_Config";
  }, 2000);
}
