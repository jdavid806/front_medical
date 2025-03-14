<?php
include "../menu.php";
include "../header.php";

?>

<style>
  .custom-btn {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }

  .custom-btn i {
    margin-right: 5px;
  }
</style>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Incapacidades</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-0">Incapacidades</h2>
            <small class="patientName">Cargando...</small>
          </div>
          <!-- <button id="btnModalCrearIncapacidad" type="button" class="btn btn-primary">
            <i class="fa-solid fa-plus me-2"></i>Nueva incapacidad
          </button> -->
        </div>
      </div>
    </div>

    <div class="row mt-4">

      <table class="table table-sm">
        <thead>
          <tr>
            <th>Desde</th>
            <th>Hasta</th>
            <th>Días de incapacidad</th>
            <th>Registrado por</th>
            <th>Motivo</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody class="list" id="tableIncapacidades">
        </tbody>
      </table>
    </div>

  </div>

  <?php
  include './modalIncapacidad.php'
  ?>

  <template id="templateIncapacidad">
    <tr>
      <td class="desde align-middle"></td>
      <td class="hasta align-middle"></td>
      <td class="dias-incapacidad align-middle"></td>
      <td class="registrado-por align-middle"></td>
      <td class="comentarios align-middle"></td>
      <td class="text-end align-middle">
        <div class="dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i data-feather="settings"></i> Acciones
          </button>
          <ul class="dropdown-menu" style="z-index: 10000;">
            <li>
              <a class="dropdown-item" href="#" id="btnModalEditarIncapacidad" onclick="editarIncapacidad()">
                <div class=" d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-pen" style="width: 20px;"></i>
                  <span>Editar</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" id="btnModalEliminarIncapacidad" onclick="eliminarIncapacidad()">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-trash" style="width: 20px;"></i>
                  <span>Eliminar</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" id="btnImpimirIncapacidad" onclick="imprimirIncapacidad()">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-print" style="width: 20px;"></i>
                  <span>Imprimir</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" id="btnDescargarIncapacidad" onclick="descargarIncapacidad()">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-download" style="width: 20px;"></i>
                  <span>Descargar</span>
                </div>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li class="dropdown-header">Compartir</li>
            <li>
              <a class="dropdown-item" href="#" id="btnCWIncapacidad" onclick="compartirIncapacidad()">
                <div class=" d-flex gap-2 align-items-center">
                  <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                  <span>Compartir por Whatsapp</span>
                </div>
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                <div class="d-flex gap-2 align-items-center">
                  <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                  <span>Compartir por Correo</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  </template>

  <script type="module">
    import {
      patientDisabilityService,
      patientService
    } from "../services/api/index.js";
    import {
      formatDate,
      calcularDiasEntreFechas,
      rellenarFormularioConObjeto
    } from "../services/utilidades.js";

    function agregarIncapacidad() {
      $("#modalCrearIncapacidadLabel").html(`Nueva Incapacidad`);
      $("#accionModalCrearIncapacidad").val('crear');
      $("#modalCrearIncapacidad").modal('show');
    }

    function editarIncapacidad(incapacidad) {
      $("#modalCrearIncapacidadLabel").html(`Editar Incapacidad`);

      rellenarFormularioConObjeto(incapacidad)
      $("#dias").val(calcularDiasEntreFechas(
        new Date(incapacidad.start_date),
        new Date(incapacidad.end_date)
      ) + 1);

      $("#accionModalCrearIncapacidad").val('editar');
      $("#modalCrearIncapacidad").modal('show');
    }

    async function imprimirIncapacidad(incapacidad) {
      crearDocumento(incapacidad, "Impresion", "Incapacidad", "Completa", "Incapacidad Médica");
    }

    async function descargarIncapacidad(incapacidad) {
      crearDocumento(incapacidad, "Descarga", "Incapacidad", "Completa", "Incapacidad Médica");
    }

    async function compartirIncapacidad(incapacidad) {
      enviarDocumento(incapacidad, "Descarga", "Incapacidad", "Completa", incapacidad.patient_id, incapacidad.user_id, "Incapacidad_Médica.pdf");
    }

    function eliminarIncapacidad(id) {

      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          patientDisabilityService.delete(id)
            .then(() => {
              Swal.fire(
                '¡Eliminado!',
                'La incapacidad ha sido eliminada.',
                'success'
              );
              window.location.reload();
            });
        }
      });
    }

    //document.getElementById('btnModalCrearIncapacidad').addEventListener('click', agregarIncapacidad);

    const template = document.getElementById("templateIncapacidad");
    const table = document.getElementById("tableIncapacidades");
    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const incapacidadesPromise = patientDisabilityService.ofParent(patientId);
    const patientPromise = patientService.get(patientId);

    const [patient, incapacidades] = await Promise.all([patientPromise, incapacidadesPromise]);

    document.querySelectorAll('.patientName').forEach(element => {
      element.textContent = `${patient.first_name} ${patient.last_name}`;
      if (element.tagName === 'A') {
        element.href = `verPaciente?id=${patient.id}`
      }
    })

    renderIncapacidades(incapacidades);

    function renderIncapacidades(incapacidades) {
      table.innerHTML = "";
      incapacidades.forEach(incapacidad => {
        const clone = template.content.cloneNode(true);

        const row = clone.querySelector('tr');
        const startDate = formatDate(incapacidad.start_date).split(',')[0]
        const endDate = formatDate(incapacidad.end_date).split(',')[0]

        clone.querySelector(".desde").textContent = startDate;
        clone.querySelector(".hasta").textContent = endDate;
        clone.querySelector(".dias-incapacidad").textContent = calcularDiasEntreFechas(
          new Date(incapacidad.start_date),
          new Date(incapacidad.end_date)
        ) + 1;
        clone.querySelector(".registrado-por").textContent = `${incapacidad.user.first_name} ${incapacidad.user.middle_name} ${incapacidad.user.last_name} ${incapacidad.user.second_last_name}`;
        clone.querySelector(".comentarios").textContent = incapacidad.reason;

        clone.querySelector('#btnImpimirIncapacidad').onclick = () => imprimirIncapacidad(incapacidad);
        clone.querySelector('#btnDescargarIncapacidad').onclick = () => descargarIncapacidad(incapacidad);

        clone.querySelector('#btnCWIncapacidad').onclick = () => compartirIncapacidad(incapacidad);


        clone.querySelector('#btnModalEditarIncapacidad').onclick = () => editarIncapacidad(incapacidad);
        clone.querySelector('#btnModalEliminarIncapacidad').onclick = () => eliminarIncapacidad(incapacidad.id);

        table.appendChild(clone);
      });
    }

    new DataTable('.table');
  </script>

  <script>
    // document.getElementById('btnModalCrearIncapacidad').addEventListener('click', function() {
    //   $("#modalCrearIncapacidadLabel").html(`Crear Incapacidad`);

    //   document.getElementById("formCrearIncapacidad").reset();
    //   checkRecurrencia(document.getElementById('recurrencia'))
    // })
  </script>

  <?php include "../footer.php"; ?>