<?php
include "../menu.php";
include "../header.php";

$recetas = [
  ['id' => 1, 'nombre' => 'Ibuprofeno', 'presentacion' => 'Tabletas 200mg', 'dosis' => '2 veces al día', 'fecha' => '2024-11-20', 'descripcion' => 'Receta para dolor de cabeza'],
  ['id' => 2, 'nombre' => 'Paracetamol', 'presentacion' => 'Tabletas 500mg', 'dosis' => 'Cada 8 horas', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para fiebre'],
  ['id' => 3, 'nombre' => 'Amoxicilina', 'presentacion' => 'Cápsulas 500mg', 'dosis' => '3 veces al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para infección respiratoria'],
  ['id' => 4, 'nombre' => 'Metformina', 'presentacion' => 'Tabletas 850mg', 'dosis' => '1 vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para diabetes tipo 2'],
  ['id' => 5, 'nombre' => 'Loratadina', 'presentacion' => 'Tabletas 10mg', 'dosis' => 'Una vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para alergias'],
  ['id' => 6, 'nombre' => 'Omeprazol', 'presentacion' => 'Tabletas 20mg', 'dosis' => '1 vez al día antes de las comidas', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para acidez estomacal'],
  ['id' => 7, 'nombre' => 'Fluconazol', 'presentacion' => 'Cápsulas 150mg', 'dosis' => 'Una sola dosis', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para infección vaginal'],
];

?>

<style type="text/css">
  .custom-btn {
    width: 150px;
    /* Establece el ancho fijo */
    height: 40px;
    /* Establece la altura fija */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 5px;
    /* Espaciado opcional entre botones */
  }

  .custom-btn i {
    margin-right: 5px;
    /* Espaciado entre el ícono y el texto */
  }
</style>
<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1">Miguel Angel Castro Franco</a></li>
        <li class="breadcrumb-item"><a href="verRecetas?1">Recetas</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Nueva Receta</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-12">
        <div class="row align-items-center justify-content-between">
          <div class="col-md-6">
            <h2 class="mb-0">Nueva Receta</h2>
            <small>
              Miguel Angel Castro Franco
            </small>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-0 g-md-4 g-xl-6 p-3">

      <div class="col-md-7 col-lg-7 col-xl-8">
        <div class="row mb-3 align-items-end">
          <div class="col p-2">
            <h4>Recetas médicas</h4>
          </div>
          <div class="col p-2 text-end"><button class="btn btn-primary" type="button" data-bs-toggle="modal"
              data-bs-target="#modalCrearReceta"> <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo
              Medicamento</button></div>
        </div>

        <div>
          <div class="d-flex align-items-center justify-content-end my-3">
            <div class="ms-3" id="bulk-select-actions">
              <div class="d-flex">
                <button class="btn btn-phoenix-danger btn-sm ms-2 d-none" type="button"
                  id="apply-action">Eliminar</button>
              </div>
            </div>
          </div>

          <div id="recetasGeneradas"
            data-list='{"valueNames":["nombre","presentacion","dosis"],"page":5,"pagination":true}'>
            <div class="table-responsive mx-n1 px-1">

              <table class="table table-sm tableDataTableSearch">
                <thead>
                  <tr>
                    <th class="white-space-nowrap fs-9 align-middle ps-0" style="max-width:20px; width:18px;">
                      <div class="form-check mb-0 fs-8">
                        <input class="form-check-input" id="bulk-select-example" type="checkbox">
                      </div>
                    </th>
                    <th class="sort align-middle ps-3" data-sort="nombre">Nombre</th>
                    <th class="sort align-middle" data-sort="presentacion">Presentación</th>
                    <th class="sort align-middle" data-sort="dosis">Dosis</th>
                    <th class="sort text-end align-middle pe-0" scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody class="list" id="bulk-select-body">
                  <?php foreach ($recetas as $receta) { ?>
                    <tr>
                      <td class="fs-9 align-middle">
                        <div class="form-check mb-0 fs-8">
                          <input class="form-check-input" type="checkbox">
                        </div>
                      </td>
                      <td class="align-middle ps-3 nombre"><?= $receta['nombre'] ?></td>
                      <td class="align-middle presentacion"><?= $receta['presentacion'] ?></td>
                      <td class="align-middle dosis"><?= $receta['dosis'] ?></td>
                      <td class="align-middle white-space-nowrap text-end pe-0">
                        <div class="d-flex justify-content-around fs-9">
                          <button class="btn text-primary p-0" title="editar receta" data-value="mostrar" type="button"
                            data-bs-toggle="modal" data-bs-target="#editarRecetaModal">
                            <i class="fa fa-pencil-alt"></i>
                          </button>
                          <button class="btn text-primary p-0" title="ver detalles de receta" data-value="mostrar"
                            type="button" data-bs-toggle="modal" data-bs-target="#modalDetalleReceta">
                            <i class="fa fa-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  <?php } ?>

                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-md-12 col-lg-12 col-xl-12 m-3">
          <div>
            <div class="container">
              <div class="text-end">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalTerminarReceta">
                  Terminar
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div class="col-md-5 col-lg-5 col-xl-4">
        <div class="sticky-leads-sidebar">
          <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
            id="productFilterColumn">
            <div class="d-flex justify-content-between align-items-center mb-2 d-md-none">
              <h3 class="mb-0">Lead Details</h3>
              <button class="btn p-0" data-phoenix-dismiss="offcanvas"><span class="uil uil-times fs-7"></span></button>
            </div>
            <div class="card mb-3">
              <div class="card-body">
                <div class="row align-items-center g-3 text-center text-xxl-start">
                  <div class="col-12 col-xxl-auto">
                    <div class="avatar avatar-5xl"><img class="rounded-circle"
                        src="<?= $ConfigNominaUser['logoBase64'] ?>" alt="" /></div>
                  </div>
                  <div class="col-12 col-sm-auto flex-1">
                    <h3 class="fw-bold mb-2">Miguel Angel Castro Franco</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mb-3">
              <div class="card-body">
                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                  <div class="fw-semibold">
                    Genero
                  </div>
                  <div>
                    Masculino
                  </div>
                </div>
                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                  <div class="fw-semibold">
                    Edad
                  </div>
                  <div>
                    21 Años
                  </div>
                </div>
                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                  <div class="fw-semibold">
                    Tipo de Sangre
                  </div>
                  <div>
                    A Positivo
                  </div>
                </div>
                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                  <div class="fw-semibold">
                    Condicion Especial
                  </div>
                  <div>
                    TDHA
                  </div>
                </div>
                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                  <div class="fw-semibold">
                    Antecedentes
                  </div>
                  <div>
                    TDHA, ASMA, HTA
                  </div>
                </div>
                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                  <div class="fw-semibold">
                    Whatsapp
                  </div>
                  <div>
                    +57350........
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const deleteButton = document.getElementById('apply-action'); // Botón "Eliminar"
      const checkboxes = document.querySelectorAll('#bulk-select-body .form-check-input'); // Todos los checkboxes de las filas
      const bulkSelect = document.getElementById('bulk-select-example'); // Checkbox general para seleccionar todos

      // Habilitar/deshabilitar botón "Eliminar" según selección
      const toggleDeleteButton = () => {
        const selectedCheckboxes = document.querySelectorAll('#bulk-select-body .form-check-input:checked');
        deleteButton.classList.toggle('d-none', selectedCheckboxes.length === 0);
      };

      // Seleccionar/deseleccionar todos los checkboxes
      bulkSelect.addEventListener('change', () => {
        const isChecked = bulkSelect.checked;
        checkboxes.forEach(checkbox => checkbox.checked = isChecked);
        toggleDeleteButton();
      });

      // Verificar cambios en cada checkbox
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleDeleteButton);
      });

      // Eliminar filas seleccionadas
      deleteButton.addEventListener('click', () => {
        const selectedCheckboxes = document.querySelectorAll('#bulk-select-body .form-check-input:checked');
        const idsToDelete = [];

        selectedCheckboxes.forEach(checkbox => {
          idsToDelete.push(checkbox.dataset.id); // Obtener el ID del medicamento
          const row = checkbox.closest('tr'); // Fila correspondiente
          row.remove(); // Eliminar fila de la tabla
        });

        console.log('IDs eliminados:', idsToDelete); // Mostrar IDs en la consola

        // Reiniciar el checkbox general y botón
        bulkSelect.checked = false;
        toggleDeleteButton();
      });

      document.getElementById("bulk-select-example").addEventListener("change", function() {
        document.querySelectorAll("#bulk-select-body input[type='checkbox']").forEach(chk => {
          chk.checked = this.checked;
        });
      });

      document.getElementById("modalTerminarReceta").addEventListener("show.bs.modal", function() {
        let selectedRows = [];
        document.querySelectorAll("#bulk-select-body tr").forEach(row => {
          if (row.querySelector("input[type='checkbox']").checked) {
            let receta = {
              nombre: row.querySelector(".nombre").innerText,
              presentacion: row.querySelector(".presentacion").innerText,
              dosis: row.querySelector(".dosis").innerText
            };
            selectedRows.push(receta);
          }
        });

        let modalBody = document.querySelector("#modalTerminarReceta .modal-body");
        modalBody.innerHTML = generarDetallesRecetas(selectedRows);
      });

      function generarDetallesRecetas(recetas) {
        if (recetas.length === 0) {
          return "<p class='text-center text-muted'>No se han seleccionado recetas.</p>";
        }

        let detalles = `<div class="row m-2">`;

        recetas.forEach((receta, index) => {
          detalles += `
                <div class="col-12 mb-3 p-3 border rounded shadow-sm bg-light">
                    <h5 class="fw-bold text-primary">${receta.nombre}</h5>
                    <p class="mb-1"><strong>Presentación:</strong> ${receta.presentacion}</p>
                    <p class="mb-1"><strong>Dosis:</strong> ${receta.dosis}</p>
                    <label for="observacion-${index}" class="form-label mt-2"><strong>Observaciones:</strong></label>
                    <textarea class="form-control" id="observacion-${index}" rows="3" placeholder="Escriba aquí..."></textarea>
                </div>
            `;
        });

        detalles += `
            <div class="col-12 mt-4 p-3 border rounded shadow-sm bg-white">
                <h5 class="fw-bold text-secondary">Observación General</h5>
                <textarea class="form-control" id="observacion-general" rows="4" placeholder="Escriba una observación general aquí..."></textarea>
            </div>
        `;

        detalles += `</div>`;
        return detalles;
      }

    });
  </script>


  <?php include "../footer.php";
  include "./modalReceta.php";
  include "./modalTerminarReceta.php";
  ?>