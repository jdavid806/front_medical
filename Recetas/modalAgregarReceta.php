<?php

$medicamentos = [
  [
    "nombre" => "Aspirina",
    "concentracion" => "500 mg",
    "via" => "Oral",
    "presentacion" => "Tabletas"
  ],
  [
    "nombre" => "Paracetamol",
    "concentracion" => "500 mg",
    "via" => "Oral",
    "presentacion" => "Tabletas"
  ],
  [
    "nombre" => "Ibuprofeno",
    "concentracion" => "400 mg",
    "via" => "Oral",
    "presentacion" => "Tabletas"
  ],
  [
    "nombre" => "Amoxicilina",
    "concentracion" => "250 mg",
    "via" => "Oral",
    "presentacion" => "Cápsulas"
  ],
  [
    "nombre" => "Amoxicilina",
    "concentracion" => "125 mg/5 ml",
    "via" => "Oral",
    "presentacion" => "Jarabe"
  ],
  [
    "nombre" => "Salbutamol",
    "concentracion" => "100 mcg/dosis",
    "via" => "Inhalación",
    "presentacion" => "Inhalador"
  ],
  [
    "nombre" => "Losartán",
    "concentracion" => "50 mg",
    "via" => "Oral",
    "presentacion" => "Tabletas"
  ]
];
?>



<div class="modal fade" id="modalAgregarReceta" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCrearRecetaLabel">Nueva receta médica</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form id="formCrearReceta" class="overflow-auto">
        <div class="modal-body">
          <div class="card border border-light mb-3">
            <div class="card-body">
              <h4 class="card-title">Medicamento </h4>
              <input type="text" class="form-control" id="nombreMedicamento" placeholder="Ingrese el nombre del medicamento">
              <ul id="resultadoBusqueda" class="list-group" style="display: none; position: absolute; width: 93%; max-height: 200px; overflow-y: auto;">
                <!-- Aquí se mostrarán los resultados de los medicamentos -->
              </ul>
            </div>
          </div>

          <div class="card border border-light mb-3" id="cardTratamiento" style="display: none;">
            <div class="card-body">
              <h4 class="card-title"> Tratamiento </h4>
              <div class="row">
                <div class="col-6">
                  <span class="mt-3"> Frecuencia </span>
                  <select class="form-control" id="frecuencia">
                    <option value="">Seleccione</option>
                    <option value="diaria">Diaria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>

                <div class="col-6">
                  <span class="mt-3"> Duración </span>
                  <input type="number" class="form-control" id="duracion" min="1">
                </div>
              </div>

              <div class="row">
                <div class="col-6">
                  <span> Tipo medicamento </span>
                  <select class="form-control" id="tipoMedicamento">
                    <option value="">Seleccione</option>
                    <option value="crema">Crema</option>
                    <option value="jarabe">Jarabe</option>
                    <option value="inyeccion">Inyección</option>
                    <option value="tabletas">Tabletas</option>
                  </select>
                </div>
                <div class="col-6" id="tomarCadaHorasDiv">
                  <span> Tomar cada </span>
                  <select class="form-control" id="tomarCadaHoras">
                    <option value="">Seleccione</option>
                    <option value="1">1 Hora</option>
                    <option value="2">2 Horas</option>
                    <option value="3">3 Horas</option>
                    <option value="4">4 Horas</option>
                    <option value="5">5 Horas</option>
                    <option value="6">6 Horas</option>
                    <option value="7">7 Horas</option>
                    <option value="8">8 Horas</option>
                    <option value="10">10 Horas</option>
                    <option value="12">12 Horas</option>
                    <option value="24">24 Horas</option>
                  </select>
                </div>
                <div class="col-6" id="cantidadDiv">
                  <span> Cantidad </span>
                  <input type="number" class="form-control" id="cantidad" min="1">
                </div>
              </div>
            </div>
          </div>

          <div class="card border border-light mb-3" id="cardIndicaciones" style="display: none;">
            <div class="card-body">
              <h4 class="card-title"> Indicaciones (Opcional) </h4>
              <textarea class="form-control" id="indicaciones" rows="3" placeholder="Ingrese las indicaciones"></textarea>
            </div>
          </div>

          <div class="mb-3 text-end">
            <button class="btn btn-primary" type="button" id="agregarMedicamentoBtn">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>


          <!-- <div class="mb-3">
            <label for="cantidad" class="form-label">Cantidad (dias)</label>
            <input type="number" class="form-control" id="cantidad" placeholder="Cantidad de dias que se debe tomar el medicamento" min="1">
          </div> -->

          <!-- <div class="mb-3">
            <label for="dosis" class="form-label">Dosis (Horas)</label>
            <select class="form-control" id="dosis">
                <option value="">Seleccione</option>
                <option value="1">1 Hora</option>
                <option value="2">2 Horas</option>
                <option value="3">3 Horas</option>
                <option value="4">4 Horas</option>
                <option value="5">5 Horas</option>
                <option value="6">6 Horas</option>
                <option value="7">7 Horas</option>
                <option value="8">8 Horas</option>
                <option value="10">10 Horas</option>
                <option value="12">12 Horas</option>

            </select>
            <small id="dosisInfo" class="form-text text-muted">Cantidad de horas que se debe tomar el medicamento.</small>
          </div> -->

          <!-- <div class="mb-3">
            <label for="presentacion" class="form-label">Presentación (Opcional)</label>
            <select class="form-select" id="presentacion">
              <option value="">Seleccione una presentación</option>
              <option value="crema">Crema</option>
              <option value="jarabe">Jarabe</option>
            </select>
          </div> -->
          <!-- <div class="mb-3">
            <label for="viaAdministracion" class="form-label">Vía de administración (Opcional)</label>
            <select class="form-select" id="viaAdministracion">
              <option value="">Seleccione una vía de administración</option>
              <option value="respiratorio">Respiratorio</option>
              <option value="oral">Oral</option>
            </select>
          </div> -->
          <!-- <div class="mb-3">
            <label for="composicion" class="form-label">Composición (Opcional)</label>
            <textarea class="form-control" id="composicion" rows="3" placeholder="Ingrese la composición"></textarea>
          </div> -->
          <!-- <div class="mb-3">
            <label for="dosis" class="form-label">Dosis (Opcional)</label>
            <textarea class="form-control" id="dosis" rows="3" placeholder="Ingrese la dosis"></textarea>
          </div> -->

          <!-- <div class="mb-3">
            <label for="indicaciones" class="form-label">Indicaciones (Opcional)</label>
            <textarea class="form-control" id="indicaciones" rows="3" placeholder="Ingrese las indicaciones"></textarea>
          </div> -->


          <div class="card border border-light" id="cardMedicamentos" style="display: none;">
            <div class="card-body">
              <h4 class="card-title"> Receta medica </h4>
              <div id="medicamentosReceta"></div>
            </div>
          </div>

          <!-- <div class="mb-3">
            <label for="indicacionesGenerales" class="form-label">Indicaciones generales de la receta (Opcional)</label>
            <textarea class="form-control" id="indicacionesGenerales" rows="3"
              placeholder="Ingrese las indicaciones generales"></textarea>
          </div> -->
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</div>


<!-- ver datalles -->
<!-- <div class="modal fade" id="modalDetalleReceta" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalDetalleRecetaLabel">Detalle de la receta</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <strong>Nombre del medicamento:</strong>
          <p>Ibuprofeno</p>
        </div>
        <div class="mb-3">
          <strong>Cantidad:</strong>
          <p>30 tabletas</p>
        </div>
        <div class="mb-3">
          <strong>Presentación:</strong>
          <p>Tabletas 200mg</p>
        </div>
        <div class="mb-3">
          <strong>Vía de administración:</strong>
          <p>Oral</p>
        </div>
        <div class="mb-3">
          <strong>Composición:</strong>
          <p>Ibuprofeno 200mg por tableta</p>
        </div>
        <div class="mb-3">
          <strong>Dosis:</strong>
          <p>Tomar 1 tableta cada 8 horas con alimentos.</p>
        </div>
        <div class="mb-3">
          <strong>Indicaciones:</strong>
          <p>No consumir en caso de alergia a los antiinflamatorios. Mantener fuera del alcance de los niños.</p>
        </div>
        <div class="mb-3">
          <strong>Indicaciones generales:</strong>
          <p>Si los síntomas persisten después de 5 días, consulte a su médico.</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
      </div>
    </div>
  </div>
</div> -->

<style>
  #resultadoBusqueda li {
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  #resultadoBusqueda li:hover {
    background-color: #8a94ad;
  }

  #resultadoBusqueda {
    position: relative;
    z-index: 1050;
  }
</style>


<script>
  // Convertir el array PHP a JSON y guardarlo en una variable JavaScript
  const medicamentos = <?php echo json_encode($medicamentos); ?>;


  // Función para mostrar/ocultar el div 'tomarCadaHorasDiv' según el valor de 'tipoMedicamento'
  function controlarVisibilidadHoras() {
    const tipoMedicamento = document.getElementById("tipoMedicamento").value;
    const tomarCadaHoras = document.getElementById("tomarCadaHorasDiv");

    // Si el tipo de medicamento es 'tabletas', mostramos el select 'tomarCadaHoras', sino lo ocultamos
    if (tipoMedicamento === "tabletas") {
      tomarCadaHoras.style.display = "block";
    } else {
      tomarCadaHoras.style.display = "none";
    }
  }

  document.getElementById("tipoMedicamento").addEventListener("change", controlarVisibilidadHoras);


  controlarVisibilidadHoras();

  // Función para mostrar/ocultar el div 'tomarCadaHorasDiv' según el valor de 'tipoMedicamento'
  function controlarVisibilidadCantidad() {
    const tipoMedicamento = document.getElementById("tipoMedicamento").value;
    const cantidadDiv = document.getElementById("cantidadDiv");

    // Si el tipo de medicamento es 'tabletas', mostramos el select 'tomarCadaHoras', sino lo ocultamos
    if (tipoMedicamento !== "tabletas" && tipoMedicamento !== "") {
      cantidadDiv.style.display = "block";
    } else {
      cantidadDiv.style.display = "none";
    }
  }


  document.getElementById("tipoMedicamento").addEventListener("change", controlarVisibilidadCantidad);


  controlarVisibilidadCantidad();



  // Función para buscar medicamentos
  function buscarMedicamento() {
    const input = document.getElementById("nombreMedicamento");
    const filtro = input.value.toLowerCase(); // Se convierete a minúsculas para que la búsqueda no sea sensible a mayúsculas/minúsculas

    if (filtro === "") {
      document.getElementById("resultadoBusqueda").style.display = "none";
      return;
    }

    // Filtrar los medicamentos por nombre
    const resultados = medicamentos.filter(medicamento => medicamento.nombre.toLowerCase().includes(filtro));

    mostrarResultados(resultados);
  }

  // Función para mostrar los resultados de la búsqueda de medicamentos
  function mostrarResultados(resultados) {
    const lista = document.getElementById("resultadoBusqueda");
    lista.innerHTML = ""; // Limpiar resultados previos

    if (resultados.length > 0) {
      lista.style.display = "block";

      resultados.forEach(medicamento => {
        const item = document.createElement("li");
        item.classList.add("list-group-item");
        item.textContent = `${medicamento.nombre} - ${medicamento.concentracion} - ${medicamento.via} - ${medicamento.presentacion}`;

        item.addEventListener("click", () => seleccionarMedicamento(medicamento));

        lista.appendChild(item);
      });
    } else {
      lista.style.display = "none"; // Ocultar la lista si no hay resultados
    }
  }

  // Función para seleccionar un medicamento de la lista
  function seleccionarMedicamento(medicamento) {
    // Rellenar el input con toda la información del medicamento
    const input = document.getElementById("nombreMedicamento");
    const cardTratamiento = document.getElementById("cardTratamiento").style.display;
    const cardIndicaciones = document.getElementById("cardIndicaciones").style.display;
    // console.log(cardTratamiento);
    input.value = `${medicamento.nombre} - ${medicamento.concentracion} - ${medicamento.via} - ${medicamento.presentacion}`;


    document.getElementById("resultadoBusqueda").style.display = "none";
    document.getElementById("cardTratamiento").style.display = "block";
    document.getElementById("cardIndicaciones").style.display = "block";
  }

  document.getElementById("nombreMedicamento").addEventListener("input", buscarMedicamento);

  // Opcional: cerrar la lista si el usuario hace clic fuera del campo de búsqueda
  document.addEventListener("click", (event) => {
    const lista = document.getElementById("resultadoBusqueda");
    const input = document.getElementById("nombreMedicamento");

    // Verificar si el clic no fue en el input ni en la lista de resultados
    if (!input.contains(event.target) && !lista.contains(event.target)) {
      lista.style.display = "none";
    }
  });

  // Array para almacenar los medicamentos que se han agregado
  let medicamentosAgregados = [];

  // Función para capturar los valores y agregar el medicamento al array
  function agregarMedicamento() {
    // Capturar los valores de los campos del formulario
    const nombre = document.getElementById("nombreMedicamento").value;
    const frecuencia = document.getElementById("frecuencia").value;
    const duracion = document.getElementById("duracion").value;
    const tipoMedicamento = document.getElementById("tipoMedicamento").value;
    const indicaciones = document.getElementById("indicaciones").value;

    // Variables para cantidad y tomarCadaHoras
    let cantidad = null;
    let tomarCadaHoras = null;

    // Verificamos si los campos cantidad y tomarCadaHoras están visibles
    if (document.getElementById("cantidadDiv").style.display === "block") {
      cantidad = document.getElementById("cantidad").value;
    }

    if (document.getElementById("tomarCadaHorasDiv").style.display === "block") {
      tomarCadaHoras = document.getElementById("tomarCadaHoras").value;
    }

    let tabletasTotales = null;

    if (frecuencia === "diaria" && tipoMedicamento === "tabletas" && tomarCadaHoras) {
      const cantidadPorDia = 24 / tomarCadaHoras;
      tabletasTotales = cantidadPorDia * duracion;
    } else if (frecuencia === "semanal" && tipoMedicamento === "tabletas" && tomarCadaHoras) {
      const cantidadPorSemana = (24 / tomarCadaHoras) * 7;
      tabletasTotales = cantidadPorSemana * duracion;
    } else if (frecuencia === "mensual" && tipoMedicamento === "tabletas" && tomarCadaHoras) {
      const cantidadPorMes = (24 / tomarCadaHoras) * 30;
      tabletasTotales = cantidadPorMes * duracion;
    }

    let cantidadMedicamento = null;


    // Crear un objeto con los datos del medicamento
    const medicamento = {
      nombre: nombre,
      frecuencia: frecuencia,
      duracion: duracion,
      tipoMedicamento: tipoMedicamento,
      cantidad: cantidad,
      tomarCadaHoras: tomarCadaHoras,
      tabletasTotales: tabletasTotales,
      indicaciones: indicaciones
    };

    // Agregar el medicamento al array
    medicamentosAgregados.push(medicamento);

    // Mostrar un mensaje de confirmación 
    alert("Medicamento agregado correctamente.");

    // Limpiar los campos del formulario después de agregar el medicamento
    document.getElementById("nombreMedicamento").value = "";
    document.getElementById("frecuencia").value = "";
    document.getElementById("duracion").value = "";
    document.getElementById("tipoMedicamento").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("tomarCadaHoras").value = "";
    document.getElementById("indicaciones").value = "";

    console.log(medicamentosAgregados);

    const cardMedicamentos = document.getElementById("cardMedicamentos");
    cardMedicamentos.style.display = "block";
    const cardTratamiento = document.getElementById("cardTratamiento");
    cardTratamiento.style.display = "none";
    const cardIndicaciones = document.getElementById("cardIndicaciones");
    cardIndicaciones.style.display = "none";
    const cantidadDiv = document.getElementById("cantidadDiv");
    cantidadDiv.style.display = "none";
    const tomarCadaHorasDiv = document.getElementById("tomarCadaHorasDiv");
    tomarCadaHorasDiv.style.display = "none";

    // Mostrar los medicamentos en la lista
    mostrarMedicamentos();
  }

  // Función para mostrar los medicamentos en la lista
  function mostrarMedicamentos() {
    const lista = document.getElementById("medicamentosReceta");
    lista.innerHTML = "";

    // Se recorre el array y mostramos cada medicamento
    medicamentosAgregados.forEach((medicamento, index) => {
      // Variables para modificar el texto de la duración
      let duracionTexto = medicamento.duracion;
      let duracionUnidad = "";

      // Verificamos el valor de la frecuencia para agregar el complemento a la duracion
      if (medicamento.frecuencia === "diaria") {
        duracionUnidad = medicamento.duracion > 1 ? "días" : "día";
      } else if (medicamento.frecuencia === "semanal") {
        duracionUnidad = medicamento.duracion > 1 ? "semanas" : "semana";
      } else if (medicamento.frecuencia === "mensual") {
        duracionUnidad = medicamento.duracion > 1 ? "meses" : "mes";
      }

      // Se agrega la unidad correcta a la duración
      duracionTexto = `${medicamento.duracion} ${duracionUnidad}`;

      const medicamentoDiv = document.createElement("div");
      medicamentoDiv.classList.add("medicamento-item");
      medicamentoDiv.innerHTML = `
      <div class="row">
      <p><strong>${index + 1}. ${medicamento.nombre}</strong></p>
      <div class="col-6">
        <p><strong>Frecuencia: </strong> ${medicamento.frecuencia}</p>
        <p><strong>Tipo: </strong> ${medicamento.tipoMedicamento}</p>
      </div>
      <div class="col-6">
        <p><strong>Duración: </strong> ${duracionTexto}</p>
        ${medicamento.cantidad ? `<p><strong># medicamentos: </strong> ${medicamento.cantidad}</p>` : ""}
        ${medicamento.tabletasTotales ? `<p><strong># Tabletas: </strong> ${medicamento.tabletasTotales}</p>` : ""}
        </div>
        ${medicamento.tomarCadaHoras ? `<p><strong>Tomar 1 dosis cada:</strong> ${medicamento.tomarCadaHoras} horas</p>` : ""}
        <p><strong>Indicaciones: </strong> ${medicamento.indicaciones}</p>
      </div>
      <hr>
    `;
      lista.appendChild(medicamentoDiv);
    });
  }

  document.getElementById("agregarMedicamentoBtn").addEventListener("click", agregarMedicamento);

  // console.log(medicamentosAgregados);
</script>