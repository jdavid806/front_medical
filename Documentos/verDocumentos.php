<?php
include "../menu.php";
include "../header.php";

$consentimientos = [
  [
    'consentimientoId' => 1,
    'fecha' => '2024-11-20',
    'doctor' => 'Manuel Antonio Rosales',
    'motivo' => 'Intervención quirúrgica',
    'detalles' => 'Consentimiento para operación de apendicitis',
    'plantilla' => 'Consentimiento_Informado'
  ],
  [
    'consentimientoId' => 2,
    'fecha' => '2024-11-21',
    'doctor' => 'Diana Maria Fernandez',
    'motivo' => 'Estudio clínico',
    'detalles' =>
    'Consentimiento para biopsia',
    'plantilla' => 'Acta_de_salida'
  ],
  [
    'consentimientoId' => 3,
    'fecha' => '2024-11-22',
    'doctor' => 'Carlos Ruiz',
    'motivo' => 'Tratamiento dental',
    'detalles' =>
    'Consentimiento para endodoncia',
    'plantilla' => 'Consentimiento_Informado'
  ],
  [
    'consentimientoId' => 4,
    'fecha' => '2024-11-29',
    'doctor' => 'Ana Maria García',
    'motivo' => 'Revisión dermatológica',
    'detalles' =>
    'Consentimiento para tratamiento de manchas en la piel',
    'plantilla' => 'Acta_de_salida'
  ],
  [
    'consentimientoId' => 5,
    'fecha' => '2024-12-10',
    'doctor' => 'Pedro Sánchez',
    'motivo' => 'Estudio de resonancia',
    'detalles' =>
    'Consentimiento para resonancia magnética',
    'plantilla' => 'Consentimiento_Informado'
  ],
];

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
        <li class="breadcrumb-item active" onclick="location.reload()">Consentimientos Informados</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-0">Consentimientos Informados</h2>
            <small class="patientName">Cargando...</small>
          </div>
          <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#modalCrearDocumento">
            <span class="fa-solid fa-plus me-2 fs-9"></span> Nuevo Consentimientos</button>
        </div>
      </div>
    </div>

    <div class="row mt-4">

      <table class="table table-sm tableDataTableSearch">
        <thead>
          <tr>
            <th class="sort" data-sort="fecha">Fecha</th>
            <th class="sort" data-sort="doctor">Doctor(a)</th>
            <th class="sort" data-sort="motivo">Motivo</th>
            <th class="sort" data-sort="detalles">Detalles</th>
            <th class="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody class="list">
          <?php foreach ($consentimientos as $consentimiento) {

            $datosJson = json_encode($consentimiento);
          ?>
            <tr>
              <input type="hidden" id="data_consentimiento_<?= $consentimiento['consentimientoId'] ?>" value="<?= htmlspecialchars($datosJson, ENT_QUOTES)  ?>">
              <td class="fecha align-middle"><?= $consentimiento['fecha'] ?></td>
              <td class="doctor align-middle"><?= $consentimiento['doctor'] ?></td>
              <td class="motivo align-middle"><?= $consentimiento['motivo'] ?></td>
              <td class="detalles align-middle"><?= $consentimiento['detalles'] ?></td>
              <td class="text-end align-middle">
                <div class="dropdown">
                  <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i data-feather="settings"></i> Acciones
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a class="dropdown-item" href="#" onclick="editarConsentimiento(<?= $consentimiento['consentimientoId'] ?>)">
                        <div class="d-flex gap-2 align-items-center">
                          <i class="fa-solid fa-pen" style="width: 20px;"></i>
                          <span>Editar</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" onclick="eliminarConsentimiento(<?= $consentimiento['consentimientoId'] ?>)">
                        <div class="d-flex gap-2 align-items-center">
                          <i class="fa-solid fa-trash" style="width: 20px;"></i>
                          <span>Eliminar</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#<?= $consentimiento['consentimientoId']; ?>">
                        <div class="d-flex gap-2 align-items-center">
                          <i class="fa-solid fa-print" style="width: 20px;"></i>
                          <span>Imprimir</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#<?= $consentimiento['consentimientoId']; ?>" id="generate_consent_pdf">
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
                      <a class="dropdown-item" href="#">
                        <div class="d-flex gap-2 align-items-center">
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
          <?php } ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<?php
include "./modalDocumento.php";
?>

<script>
  function eliminarConsentimiento(id) {
    console.log('Eliminar consentimiento con ID:', id);

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
        console.log('Consentimiento eliminado con ID:', id);
        Swal.fire(
          '¡Eliminado!',
          'El consentimiento ha sido eliminado.',
          'success'
        );
      }
    });
  }

  document.getElementById("generate_consent_pdf").addEventListener("click", function() {
    fetch('./Configuracion/GeneratePDFConsent.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al generar el PDF');
        }
        return response.blob(); // Convertir la respuesta en un blob
      })
      .then((blob) => {
        // Crear una URL para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace temporal para descargar el PDF
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Consentimiento.pdf'; // Nombre del archivo para descargar
        document.body.appendChild(link);
        link.click();

        // Eliminar el enlace temporal
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Liberar memoria
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
</script>

<script type="module">
  import {
    patientService
  } from "../../services/api/index.js";

  const patientId = new URLSearchParams(window.location.search).get('patient_id');
  const patientPromise = patientService.get(patientId);

  const [patient] = await Promise.all([patientPromise]);

  document.querySelectorAll('.patientName').forEach(element => {
    element.textContent = `${patient.first_name} ${patient.last_name}`;
    if (element.tagName === 'A') {
      element.href = `verPaciente?id=${patient.id}`
    }
  })
</script>

<?php
include "../footer.php";
?>