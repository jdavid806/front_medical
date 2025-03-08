<?php
include "../menu.php";
include "../header.php";


//<li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaAutorizacionv2">Autorizacion</a></li>

$dropdownNew = '<div class="dropdown">
                  <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-plus"></i> &nbsp; Nuevo
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevaAutorizacionv2">Admision</a></li>
                    <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalCargueMasivo">Cargar Excel</a></li>
                  </ul>
                </div>';


// <li><a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#">Compra</a></li>

// include "./IncludeDatosPrueba.php";
include "./datosAutorizaciones.php";
include "./datosPaises.php";
include "./Utilidades/funcionesModales.php";

?>
<div class="componete">
  <div class="content">
    <div class="container-small">
      <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
          <li class="breadcrumb-item active" onclick="location.reload()">Autorizaciones</li>
        </ol>
      </nav>
      <div class="pb-9">
        <div class="row">
          <div class="col-12">
            <div class="col-10">
              <div class="col-12 row col-md-auto">
                <div class="col-6">
                  <h2 class="mb-0">Autorizaciones y Admisiones</h2>
                </div>
                <div class="col-6 text-end" style="z-index: 999999999999999999999999999999999999999999999999999999999">

                </div>
              </div>
              <div class="col-12 col-md-auto">
                <div class="d-flex">
                  <div class="flex-1 d-md-none">
                    <button class="btn px-3 btn-phoenix-secondary text-body-tertiary me-2" data-phoenix-toggle="offcanvas"
                      data-phoenix-target="#productFilterColumn"><span class="fa-solid fa-bars"></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row g-0 g-md-4 g-xl-6">

          <div class="col-md-12 col-lg-12 col-xl-12">
            <div class="lead-details-container">
              <nav class="navbar pb-4 px-0 sticky-top bg-body nav-underline-scrollspy" id="navbar-deals-detail">
                <ul class="nav nav-underline fs-9" role="tablist">
                  <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-autorizaciones-init')">Autorizaciones</a></li>
                  <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" role="tab" aria-selected="true" onclick="showSections('content-admisiones-init')">Admisiones</a></li>
                </ul>
              </nav>
              <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0"
                data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true"
                tabindex="0">

                <div class="mb-8" id="content-autorizaciones-init">
                  <!-- Facturacion Ventas -->
                  <div class=" col-12 row mb-4"
                    id="scrollspyFacturacionVentas">
                    <div class="col-6">
                      <h4 class="mb-1" id="scrollspyFacturacionVentas">Autorizaciones</h4>
                    </div>
                    <div class="col-6 text-end">
                      <?= $dropdownNew ?>
                    </div>
                    <div class="col-2">
                      <input type="date" id="fechaInicio" onchange="filtrarPorFechas()" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                    </div>
                    <div class="col-2">
                      <input type="date" id="fechaFin" onchange="filtrarPorFechas()" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                    </div>
                  </div>
                  <!-- =========== TABLE ========== -->
                  <div class="col-12 row">
                    <div class="card mb-3">
                      <div class="card-body">
                        <div class="row gx-3">
                          <div class="col-12">
                            <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                              <thead>
                                <tr>
                                  <th class="sort border-top">Feha de Cargue</th>
                                  <th class="sort border-top">Fecha de Atencion</th>
                                  <th class="sort border-top">Nombre del paciente</th>
                                  <th class="sort border-top">Procedimiento</th>
                                  <th class="sort border-top">CUPS</th>
                                  <th class="sort border-top">No de Consulta</th>
                                  <th class="sort border-top">Autorizacion</th>
                                </tr>
                              </thead>
                              <tbody class="list" id="tbody-lista-autorizaciones">
                                <?php
                                $autorizaciones = obtenerDatosFacturas();


                                $autorizaciones = json_decode($autorizaciones, true); // convierte el JSON a un array

                                ?>
                                <?php foreach ($autorizaciones as $key => $row) { ?>
                                  <tr id="filaAuth<?= $key ?>" data-fechp="<?= $row["fechaConsulta"] ?>">
                                    <td class="sort border-top"><input class="form-control" readonly value="<?= $row["fecha_Admision"] ?>" name="ArrayProcedimientos[<?= $key ?>][Fecha_de_Atencion]"></td>
                                    <td class="sort border-top"><input class="form-control" readonly value="<?= $row["fechaConsulta"] ?>" name="ArrayProcedimientos[<?= $key ?>][Nombre]"></td>
                                    <td class="sort border-top"><input class="form-control" readonly value="<?= $row["nombre_paciente"] ?>" name="ArrayProcedimientos[<?= $key ?>][Procedimiento]"></td>
                                    <td class="sort border-top"><input class="form-control" readonly value="<?= $row["procedimiento"] ?>" name="ArrayProcedimientos[<?= $key ?>][CUPS]"></td>
                                    <td class="sort border-top"><input class="form-control" readonly value="<?= $row["cups"] ?>" name="ArrayProcedimientos[<?= $key ?>][No_Historia]"></td>
                                    <td class="sort border-top"><input class="form-control" readonly value="<?= $row["HistoriaId"] ?>" name="ArrayProcedimientos[<?= $key ?>][autorizacion]"></td>
                                    <td class="sort border-top"><input type="text" value="<?= $row["autorizacion"] ?>" class="form-control"> </td>
                                  </tr>
                                <?php } ?>

                              </tbody>
                              <tfoot>
                                <tr>
                                  <td colspan="7">
                                    <button class="btn btn-success" style="width:100%" id=""><i class="fas fa-spinner"></i> Procesar ordenes</button>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>



                <!-- </div> -->
              </div>
              <div class="scrollspy-example rounded-2" data-bs-spy="scroll" data-bs-offset="0"
                data-bs-target="#navbar-deals-detail" data-bs-root-margin="0px 0px -40%" data-bs-smooth-scroll="true"
                tabindex="0">

                <div class="mb-8" id="content-admisiones-init">
                  <!-- Facturacion Ventas -->
                  <div class=" col-12 row mb-4"
                    id="scrollspyFacturacionVentas">
                    <div class="col-6">
                      <h4 class="mb-1" id="scrollspyFacturacionVentas">Admisiones</h4>
                    </div>
                    <div class="col-6 text-end">
                      <?= $dropdownNew ?>
                    </div>
                    <div class="col-2">
                      <input type="date" id="fechaInicioAd" onchange="filtrarPorFechasAdmisiones()" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                    </div>
                    <div class="col-2">
                      <input type="date" id="fechaFinAd" onchange="filtrarPorFechasAdmisiones()" value="<?= date("Y-m-d") ?>" class="form-control col-md-6">
                    </div>
                  </div>
                  <!-- =========== TABLE ========== -->
                  <div class="col-12 row">
                    <div class="card mb-3">
                      <div class="card-body">
                        <div class="row gx-3">
                          <div class="col-12">
                            <table class="table table-sm fs-9 mb-0 tableDataTableSearch">
                              <thead>
                                <tr>
                                  <th class="sort border-top">Feha de Admision</th>
                                  <th class="sort border-top">Paciente</th>
                                  <th class="sort border-top">Documento</th>
                                  <th class="sort border-top">CUPS</th>
                                  <th class="sort border-top">Profesional</th>
                                  <th class="sort border-top">Acciones</th>
                                </tr>
                              </thead>
                              <tbody class="list" id="tbody-lista-admisiones">
                                <?php
                                $autorizaciones = obtenerDatosFacturas();


                                $autorizaciones = json_decode($autorizaciones, true); // convierte el JSON a un array

                                ?>
                                <?php foreach ($autorizaciones as $key => $row) { ?>
                                  <tr id="filaAuth<?= $key ?>" data-fechp="<?= $row["fechaConsulta"] ?>">
                                    <td class="sort border-top"><?= $row["fecha_Admision"] ?></td>
                                    <td class="sort border-top"><?= $row["nombre_paciente"] ?></td>
                                    <td class="sort border-top"><?= $row["documento_cliente"] ?></td>
                                    <td class="sort border-top"><?= $row["cups"] ?></td>
                                    <td class="sort border-top"><?= $row["fecha_Admision"] ?></td>
                                    <td class="sort border-top">
                                      <div class="d-grid gap-2 d-md-block">
                                        <!-- Ejemplo de botón "Ver" -->
                                        <!-- <button type="button" onclick="cargarDatosModal(this.value)" class="btn btn-danger btn-sm" value="<?= $row['ID'] ?>"><i
                                        class="fa fa-eye fa-xs"></i></button>
                                        <button type="button" class="btn btn-primary btn-sm"><i
                                            class="fa fa-pen fa-xs"></i></button> -->
                                        <button type="button" onclick="elimianrAdmisiion(this.value)" value="<?= $row['ID'] ?>" class="btn btn-danger btn-sm"><i
                                            class="fa fa-trash fa-xs"></i></button>
                                      </div>
                                    </td>
                                  <?php } ?>

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<script>
  function elimianrAdmisiion(params) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí se envía la solicitud AJAX
        $.ajax({
          url: 'HistoriasRips/AjaxFuncionesAdmision.php', // Cambia esto por la ruta de tu servidor
          method: 'POST', // O el método que uses (POST, GET, etc.)
          data: {
            id: params
          }, // Envia el parámetro necesario
          success: function(response) {
            Swal.fire(
              'Eliminado',
              'El registro ha sido eliminado correctamente.',
              'success'
            );
            setTimeout(() => {
              location.reload();
            }, 500);
          },
          error: function(error) {
            // Maneja errores
            Swal.fire(
              'Error',
              'Hubo un problema al intentar eliminar el registro.',
              'error'
            );
          }
        });
      }
    });


  }
</script>

<script>
  function cargarDatosModal(id) {
    // Muestra un loader o deshabilita el botón mientras se hace la consulta
    document.getElementById('button-save-Authv2').disabled = true;

    // Consulta a la base de datos
    fetch(`HistoriasRips/obtener_info_admision.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            // Verifica si la consulta fue exitosa
            if (data.success) {
                // Llena los campos del modal con los datos recibidos
                document.getElementById('clienteId').value = data.cliente_id;
                document.getElementById('numRegistro').value = data.numRegistro;
                document.getElementById('fecha').value = data.fecha;
                document.getElementById('identificacion').value = data.identificacion;
                document.getElementById('regimenPaciene').value = data.regimen;
                document.getElementById('numAutorizacion').value = data.numAutorizacion;
                document.getElementById('fechaConsulta').value = data.fechaConsulta;
                document.getElementById('sede').value = data.sede_id;
                document.getElementById('profesionalRealizo').value = data.profesional_id;
                document.getElementById('entidadFacturar').value = data.entidadFacturar;

                // Abre el modal
                new bootstrap.Modal(document.getElementById('modalNuevaAutorizacionv2')).show();
            } else {
                alert('Error al cargar los datos.');
            }
        })
        .catch(error => {
            console.error('Error en la consulta:', error);
        })
        .finally(() => {
            document.getElementById('button-save-Authv2').disabled = false;
        });
}
</script>


<?php include "../footer.php"; ?>
<script>
  function showSections(idVisible) {
    let todos = ["content-autorizaciones-init", "content-admisiones-init"];
    todos.forEach(element => {
      if (element == idVisible) {
        document.getElementById(element).style.display = "block";
      } else {
        document.getElementById(element).style.display = "none";
      }
    });
  }

  showSections("content-autorizaciones-init");

  // let indiceTabla = <?= $key ?>;
  // indiceTabla = Number(indiceTabla) + 0;



  function filtrarPorFechas() {
    // Obtener las fechas desde los inputs
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;

    // Si alguna de las fechas está vacía, mostrar alerta
    if (!fechaInicio || !fechaFin) {
      // alert('Por favor, selecciona ambas fechas');
      return;
    }

    // Convertir las fechas a objetos Date para facilitar la comparación
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // Iterar sobre las filas de la tabla
    const filas = document.querySelectorAll('#tbody-lista-autorizaciones tr');
    filas.forEach(fila => {
      // Obtener la fecha de atención desde el atributo data-fechp de la fila
      const fechaAtencion = fila.getAttribute('data-fechp');
      const fechaAtencionDate = new Date(fechaAtencion);

      // Comparar las fechas: si está dentro del rango, mostrar la fila, si no, ocultarla
      if (fechaAtencionDate >= fechaInicioDate && fechaAtencionDate <= fechaFinDate) {
        fila.style.display = ''; // Mostrar fila
      } else {
        fila.style.display = 'none'; // Ocultar fila
      }
    });
  }

  function filtrarPorFechasAdmisiones() {
    // Obtener las fechas desde los inputs
    const fechaInicio = document.getElementById('fechaInicioAd').value;
    const fechaFin = document.getElementById('fechaFinAd').value;

    // Si alguna de las fechas está vacía, mostrar alerta
    if (!fechaInicio || !fechaFin) {
      // alert('Por favor, selecciona ambas fechas');
      return;
    }

    // Convertir las fechas a objetos Date para facilitar la comparación
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    // Iterar sobre las filas de la tabla
    const filas = document.querySelectorAll('#tbody-lista-admisiones tr');
    filas.forEach(fila => {
      // Obtener la fecha de atención desde el atributo data-fechp de la fila
      const fechaAtencion = fila.getAttribute('data-fechp');
      const fechaAtencionDate = new Date(fechaAtencion);

      // Comparar las fechas: si está dentro del rango, mostrar la fila, si no, ocultarla
      if (fechaAtencionDate >= fechaInicioDate && fechaAtencionDate <= fechaFinDate) {
        fila.style.display = ''; // Mostrar fila
      } else {
        fila.style.display = 'none'; // Ocultar fila
      }
    });
  }
</script>

<?php

include "./FE_ModalCargueMasivo.php";
include "./ModalNuevaAutorizacion.php";
include "./ModalVerEditar.php";
// include "./ModalAutorizacion.php";
?>