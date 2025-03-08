<?php
include "../menu.php";
include "../header.php";

// Definir los antecedentes divididos por categoría
$antecedentesPersonales = [
  [
    'antecedenteId' => 1,
    'fecha' => '2024-11-20',
    'doctor' => 'Manuel Antonio Rosales',
    'motivo' => 'Historia de hipertensión',
    'detalles' => 'Paciente diagnosticado con hipertensión hace 5 años',
    'diabetes' => 'No',
    'hipertension' => 'Sí, diagnosticada hace 5 años',
    'cancer' => '',
    'cardiovasculares' => 'Presión arterial alta',
    'enfermedades_previas' => 'Hipertensión crónica',
    'cirugias' => '',
    'hospitalizaciones' => '',
    'alergias' => 'Ninguna conocida',
    'medicamentos' => 'Losartán 50mg diarios',
    'habitos' => 'No fuma, bebe ocasionalmente',
    'actividad_fisica' => 'Moderada, camina diariamente',
    'vacunacion' => 'Covid-19, Hepatitis B',
    'dieta' => 'Baja en sodio',
    'menarquia' => null,
    'ciclos_menstruales' => null,
    'gestaciones' => null,
    'metodos_anticonceptivos' => null
  ],
  [
    'antecedenteId' => 2,
    'fecha' => '2024-11-21',
    'doctor' => 'Diana Maria Fernandez',
    'motivo' => 'Alergia a penicilina',
    'detalles' => 'Reacción alérgica grave a penicilina en 2018',
    'diabetes' => '',
    'hipertension' => 'No',
    'cancer' => 'No',
    'cardiovasculares' => '',
    'enfermedades_previas' => 'Asma leve en la infancia',
    'cirugias' => 'Apendicectomía en 2010',
    'hospitalizaciones' => '',
    'alergias' => 'Penicilina (reacción grave en 2018)',
    'medicamentos' => 'Antihistamínicos en caso de alergia',
    'habitos' => 'No fuma, no bebe',
    'actividad_fisica' => 'Gimnasia dos veces por semana',
    'vacunacion' => 'Influenza anual',
    'dieta' => 'Alta en proteínas',
    'menarquia' => 'A los 13 años',
    'ciclos_menstruales' => 'Regulares',
    'gestaciones' => '2',
    'metodos_anticonceptivos' => 'Píldoras anticonceptivas'
  ],
];

$antecedentesGinecoobstetricos = [
  [
    'antecedenteId' => 3,
    'fecha' => '2024-11-22',
    'doctor' => 'Carlos Ruiz',
    'motivo' => 'Cirugía previa',
    'detalles' => 'Cirugía de apendicitis en 2017',
    'diabetes' => 'No',
    'hipertension' => '',
    'cancer' => '',
    'cardiovasculares' => '',
    'enfermedades_previas' => 'Ninguna relevante',
    'cirugias' => 'Sí, apendicitis en 2017',
    'hospitalizaciones' => 'Sí, por cirugía en 2017',
    'alergias' => '',
    'medicamentos' => 'Ibuprofeno ocasional',
    'habitos' => 'No fuma',
    'actividad_fisica' => 'Ejercicio ligero',
    'vacunacion' => 'Covid-19',
    'dieta' => 'Baja en grasas',
    'menarquia' => 'A los 12 años',
    'ciclos_menstruales' => 'Regulares',
    'gestaciones' => '0',
    'metodos_anticonceptivos' => 'Condón'
  ],
];

$antecedentesFamiliares = [
  [
    'antecedenteId' => 4,
    'fecha' => '2024-11-29',
    'doctor' => 'Ana Maria García',
    'motivo' => 'Asma',
    'detalles' => 'Controlada con inhaladores',
    'diabetes' => 'No',
    'hipertension' => '',
    'cancer' => 'No',
    'cardiovasculares' => '',
    'enfermedades_previas' => 'Asma desde la infancia',
    'cirugias' => '',
    'hospitalizaciones' => '',
    'alergias' => 'Polvo, polen',
    'medicamentos' => 'Salbutamol inhalado',
    'habitos' => 'No fuma, no bebe',
    'actividad_fisica' => 'Moderada',
    'vacunacion' => 'Tétanos, Hepatitis B',
    'dieta' => 'Equilibrada',
    'menarquia' => null,
    'ciclos_menstruales' => null,
    'gestaciones' => null,
    'metodos_anticonceptivos' => null
  ],
  [
    'antecedenteId' => 5,
    'fecha' => '2024-12-10',
    'doctor' => 'Pedro Sánchez',
    'motivo' => 'Fractura de tobillo',
    'detalles' => 'Fractura sufrida en accidente hace 2 años',
    'diabetes' => '',
    'hipertension' => '',
    'cancer' => 'No',
    'cardiovasculares' => '',
    'enfermedades_previas' => 'Historial de lesiones menores',
    'cirugias' => 'Reducción quirúrgica de fractura de tobillo',
    'hospitalizaciones' => 'Sí, por fractura en 2022',
    'alergias' => '',
    'medicamentos' => 'Analgésicos post-operatorios',
    'habitos' => 'No fuma, no bebe',
    'actividad_fisica' => 'Rehabilitación post-fractura',
    'vacunacion' => 'Covid-19, Influenza',
    'dieta' => 'Alta en calcio',
    'menarquia' => null,
    'ciclos_menstruales' => null,
    'gestaciones' => null,
    'metodos_anticonceptivos' => null
  ],
];

?>

<div class="content">
  <div class="container-small">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Antecedentes Personales</li>
      </ol>
    </nav>

    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-0">Antecedentes Personales</h2>
            <small class="patientName">Cargando...</small>
          </div>
          <!-- <button id="btnModalCrearAntecedente" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAntecedente">
            <i class="fa-solid fa-plus me-2"></i>Nuevo
            Antecedente
          </button> -->
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <?php
      include './formAntecedentes.php';
      ?>
      <!-- Pestañas -->
      <!-- <ul class="nav nav-underline fs-9 mb-2" id="antecedentesTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <a class="nav-link active" id="personales-tab" data-bs-toggle="tab" href="#personales" role="tab">
            <i class="fas fa-user"></i> Personales
          </a>
        </li>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="ginecoobstetricos-tab" data-bs-toggle="tab" href="#ginecoobstetricos" role="tab">
            <i class="fas fa-female"></i> Ginecoobstétricos
          </a>
        </li>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="familiares-tab" data-bs-toggle="tab" href="#familiares" role="tab">
            <i class="fas fa-users"></i> Familiares
          </a>
        </li>
      </ul> -->

      <!-- <div class="tab-content" id="antecedentesTabsContent">
        <div class="tab-pane fade show active" id="personales" role="tabpanel">
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
              <?php foreach ($antecedentesPersonales as $antecedente) {
                $datosJson = json_encode($antecedente);
              ?>
                <tr>
                  <input type="hidden" id="data_antecedente_<?= $antecedente['antecedenteId'] ?>" value="<?= htmlspecialchars($datosJson, ENT_QUOTES)  ?>">
                  <td class="fecha align-middle"><?= $antecedente['fecha'] ?></td>
                  <td class="doctor align-middle"><?= $antecedente['doctor'] ?></td>
                  <td class="motivo align-middle"><?= $antecedente['motivo'] ?></td>
                  <td class="detalles align-middle"><?= $antecedente['detalles'] ?></td>
                  <td class="text-end align-middle">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i data-feather="settings"></i> Acciones
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#" onclick="editarAntecedente(<?= $antecedente['antecedenteId'] ?>)">
                            <div class=" d-flex gap-2 align-items-center">
                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                              <span>Editar</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" onclick="eliminarAntecedente(<?= $antecedente['antecedenteId'] ?>)">
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
      </div> -->

      <!-- <div class="tab-content" id="ginecoobstetricosTab">
        <div class="tab-pane fade" id="ginecoobstetricos" role="tabpanel">
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
              <?php foreach ($antecedentesGinecoobstetricos as $antecedente) {
                $datosJson = json_encode($antecedente);
              ?>
                <tr>
                  <input type="hidden" id="data_antecedente_<?= $antecedente['antecedenteId'] ?>" value="<?= htmlspecialchars($datosJson, ENT_QUOTES)  ?>">
                  <td class="fecha align-middle"><?= $antecedente['fecha'] ?></td>
                  <td class="doctor align-middle"><?= $antecedente['doctor'] ?></td>
                  <td class="motivo align-middle"><?= $antecedente['motivo'] ?></td>
                  <td class="detalles align-middle"><?= $antecedente['detalles'] ?></td>
                  <td class="text-end align-middle">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i data-feather="settings"></i> Acciones
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#" onclick="editarAntecedente(<?= $antecedente['antecedenteId'] ?>)">
                            <div class=" d-flex gap-2 align-items-center">
                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                              <span>Editar</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" onclick="eliminarAntecedente(<?= $antecedente['antecedenteId'] ?>)">
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
      </div> -->

      <!-- <div class="tab-content" id="familiaresTab">
        <div class="tab-pane fade" id="familiares" role="tabpanel">
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
              <?php foreach ($antecedentesFamiliares as $antecedente) {
                $datosJson = json_encode($antecedente);
              ?>
                <tr>
                  <input type="hidden" id="data_antecedente_<?= $antecedente['antecedenteId'] ?>" value="<?= htmlspecialchars($datosJson, ENT_QUOTES)  ?>">
                  <td class="fecha align-middle"><?= $antecedente['fecha'] ?></td>
                  <td class="doctor align-middle"><?= $antecedente['doctor'] ?></td>
                  <td class="motivo align-middle"><?= $antecedente['motivo'] ?></td>
                  <td class="detalles align-middle"><?= $antecedente['detalles'] ?></td>
                  <td class="text-end align-middle">
                    <div class="dropdown">
                      <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i data-feather="settings"></i> Acciones
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#" onclick="editarAntecedente(<?= $antecedente['antecedenteId'] ?>)">
                            <div class=" d-flex gap-2 align-items-center">
                              <i class="fa-solid fa-pen" style="width: 20px;"></i>
                              <span>Editar</span>
                            </div>
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#" onclick="eliminarAntecedente(<?= $antecedente['antecedenteId'] ?>)">
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
      </div> -->
    </div>
  </div>

  <?php include "../footer.php"; ?>
</div>

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