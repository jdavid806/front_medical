<?php
include "../menu.php";
include "../header.php";

// Función para generar un nombre aleatorio
function generarNombreAleatorio() {
    $nombres = ['Miguel', 'Ana', 'Luis', 'Sofía', 'Carlos', 'Lucía', 'Juan', 'María'];
    $apellidos = ['Castro', 'López', 'González', 'Hernández', 'Martínez', 'Rodríguez', 'Pérez', 'Sánchez'];
    return $nombres[array_rand($nombres)] . ' ' . $apellidos[array_rand($apellidos)];
}

// Función para generar una fecha al azar
function generarFechaAleatoria($startDate, $endDate) {
    $timestamp = mt_rand(strtotime($startDate), strtotime($endDate));
    return date("Y-m-d", $timestamp);
}

// Función para generar edad al azar
function generarEdadAleatoria() {
    return rand(18, 80);
}

// Generar un arreglo de pacientes dinámicamente
$pacientes = [];
for ($i = 1; $i <= 8; $i++) { // Genera 8 registros
    $pacientes[] = [
        'id' => $i,
        'nombre' => generarNombreAleatorio(),
        'fecha' => generarFechaAleatoria('1990-01-01', '2024-12-31'),
        'edad' => generarEdadAleatoria(),
        'descripcion' => 'Paciente generado aleatoriamente'
    ];
}
?>

<style type="text/css">
  .custom-btn {
    width: 150px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 5px;
  }

  .custom-btn i {
    margin-right: 5px;
  }
</style>
<div class="componete">
  <div class="content">
    <div class="container-small">
      <nav class="mb-3" aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
          <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
        </ol>
      </nav>
      <div class="pb-9">
        <div class="row">
          <div class="col-12">
            <div class="row align-items-center justify-content-between">
              <div class="col-md-6">
                <h2 class="mb-0">Pacientes</h2>
              </div>
              <div class="col-md-6 text-md-end text-start mt-2 mt-md-0">
                <button class="btn btn-primary"  type="button" data-bs-toggle="modal"
                data-bs-target="#modalCrearPaciente"> <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo Paciente</button>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-0 g-md-4 g-xl-6 p-5">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-9 mt-5">
            <?php
            foreach ($pacientes as $paciente) {
              ?>
              <div class="col">
                <div class="card h-100 hover-actions-trigger">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="avatar-group">
                        <a class="d-inline-block" href="#" role="button">
                          <div class="avatar avatar-m rounded-circle">
                            <img class="rounded-circle" src="https://via.placeholder.com/150" alt="Avatar" />
                          </div>
                        </a>
                      </div>
                      <h4 class="mb-2 line-clamp-1 lh-sm flex-1 me-5">
                        <?= $paciente['nombre'] ?>
                      </h4>
                      <div class="hover-actions top-0 end-0 mt-4 me-4">
                        <button class="btn btn-primary btn-icon flex-shrink-0" onclick="window.location.href='verPaciente?<?= $paciente['id'] ?>'">
                          <span class="fa-solid fa-chevron-right"></span>
                        </button>
                      </div>
                    </div>
                    <span class="badge badge-phoenix fs-10 mb-4 badge-phoenix-success">Activo</span>
                    <div class="d-flex flex-column align-items-start mb-2">
                      <div class="d-flex align-items-center">
                        <span class="fa-solid fa-calendar-alt me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0 text-truncate lh-1">Fecha:</p>
                      </div>
                      <div>
                        <p class="text-body-emphasis ms-1 mb-0">
                          <?= $paciente['fecha'] ?>
                        </p>
                      </div>
                    </div>
                    <div class="d-flex flex-column align-items-start mb-2">
                      <div class="d-flex align-items-center">
                        <span class="fa-solid fa-user me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0 text-truncate lh-1">Edad:</p>
                      </div>
                      <div>
                        <p class="text-body-emphasis ms-1 mb-0">
                          <?= $paciente['edad'] ?> años
                        </p>
                      </div>
                    </div>
                    <div class="d-flex flex-column align-items-start mb-2">
                      <div class="d-flex align-items-center">
                        <span class="fa-solid fa-info-circle me-2 text-body-tertiary fs-9 fw-extra-bold"></span>
                        <p class="fw-bold mb-0 text-truncate lh-1">Descripción:</p>
                      </div>
                      <div>
                        <p class="text-body-emphasis ms-1 mb-0">
                          <?= $paciente['descripcion'] ?>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <?php
            }
            ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<?php include "../footer.php";
include "./modalPacientes.php";
?>
