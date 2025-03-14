<?php
include "../menu.php";
include "../header.php";

$estadosEspecialidad = [
    "approved" => [
        "name" => "Aprobado",
        "badge-class" => "badge-phoenix-success"
    ],
    "pending-cancellation" => [
        "name" => "Pendiente por anulación",
        "badge-class" => "badge-phoenix-warning"
    ]
];

$tiposHistorias = [
    'estetica' => [
        'historiaEstetica' => 'Historia Clínica Estetica',
        'historiaEsteticaFacial' => 'Historia Clínica Facial',
        'historiaEsteticaCorporal' => 'Historia Clínica Corporal',
        'historiaEsteticaLaser' => 'Historia Estetica Laser',
        'historiaEsteticaMesoterapiaCapilar' => 'Historia Estetica Mesoterapia Capilar',
        'historiaEsteticaMesoterapiaCorporal' => 'Historia Estetica Mesoterapia Corporal',
        'historiaEsteticaMesoterapiaFacial' => 'Historia Estetica Mesoterapia Facial',

    ],
    'medicina_general' => [
        'general' => 'Historia Clínica General',
        // 'control' => 'Historia Clínica de Control'
    ],
    'psicologia' => [
        'historiaPsicologia' => 'Historia Clínica Psicológica',
        'controlPsicologiaDiagnostico' => 'Control Diagnóstico Psicológía',
        'controlPsicologiaSeguimiento' => 'Control Psicológía Seguimiento',
        'controlPsicologiaGrupal' => 'Control Psicológía Grupal',
        'historiaPsicologiaInfantil' => 'Historia Clínica Psicológica Infantil',
        'historiaPsicologiaAdultos' => 'Historia Clínica Psicológica Adultos',
        'historiaPsicologiaAdolescentes' => 'Historia Clínica Psicológica Adolescentes',
    ],
    'psiquiatria' => [
        'historiaPsiquiatria' => 'Historia Clínica Psiquiátrica Inicial',
        'historiaPsiquiatriaSeguimiento' => 'Historia Clínica de Seguimiento'
    ],
    'pediatria' => [
        'historiaPediatria' => 'Historia Clínica Pediátrica',
        // 'pediatria_neonatal' => 'Historia Clínica Neonatal'
    ],
    'nutricion' => [
        'historiaNutricion' => 'Historia Nutricion',
    ],
    'odontologia' => [
        'historiaOdontologia' => 'Historia Odontologia',
        'historiaOrtodoncia' => 'Historia Ortodoncia',
        'historiaPeriodoncia' => 'Historia Periodoncia',
        'historiaEndodoncia' => 'Historia Endodoncia'
    ],
    'otorrino' => [
        'historiaOtorrino' => 'Historia Otorrino',
    ],
    'ginecologia' => [
        'historiaGinecologia' => 'historia Ginecologia',
    ],
    'controlPrenatal' => [
        'controlPrenatal' => 'control prenatal',
    ],
    'urologia' => [
        'historiaUrologia' => 'Historia Urologia',
    ],
    'traumatologia' => [
        'historiaTraumatologia' => 'Historia Traumatologia',
    ],
    'Cardiología' => [
        'historiaCardiologia' => 'Historia Cardiologia',
    ],
    'gastroenterologia' => [
        'historiaGastroenterologia' => 'Historia Gastroenterologia',
    ],
    'oftalmologiaD' => [
        'historiaOftalmologiaD' => 'Historia Oftalmología',
        'historiaOptometriaD' => 'Historia Optometría',
    ],
    'diabetes' => [
        'historiaDiabetes' => 'Historia Diabetes',
    ],
    'endocrinologia' => [
        'historiaEndocrinologia' => 'Historia Endocrinología',
    ],
    'epicrisis' => [
        'historiaEpicrisis' => 'Historia epicrisis',
    ],
    'ecografia' => [
        'ecografiaObstetrica' => 'Ecografia Obstétrica',
        'ecografiaMorfologica' => 'Ecografia Morfológica',
        'ecografiaUltrapelvica' => 'Ecografia Ultra Pélvica',
        'ecografiaColposcopia' => 'Colposcopia',
        'ecografiaRenal' => 'Renal',
        'ecografiaMamas' => 'Mamas',
        'ecografiaAbdominal' => 'Abdominal',
    ],
    'dermatologia' => [
        'historiaDermatologia' => 'Historia Dermatología'
    ],
    'cirugiaPlastica' => [
        'historiaCirugiaPlastica' => 'Historia Cirugía plástica'
    ],
    'SPA' => [
        'pestanasSPA' => 'Tratamiento Pestañas',
        'micropigmentacionSPA' => 'Tratamiento Micropigmentación',
        'remocionSPA' => 'Tratamiento Remoción'
    ],
    'informeQuirurgico' => [
        'informeQuirurgico' => 'Informe quirúrgico'
    ],
    'oftalmologia' => [
        'historiaOftalmologia' => 'Historia Oftalmología',
        'historiaVisiometria' => 'Historia Visiometría',
        'historiaOptometria' => 'Historia Optometría'
    ],
    'podologia' => [
        'historiaPodologia' => 'Historia Podologia'
    ],
    'fisioterapia' => [
        'historiaFisioterapia' => 'Historia Fisioterapia'
    ],
    'quiropractica' => [
        'historiaQuiropractica' => 'Historia Quiropráctica'
    ],
    'airec' => [
        'historiaPediatriaA' => 'Historia Pediatría',
        'historiaRehabilitacionCardiacaPulmonar' => 'Historia Rehabilitación Cardiaca y Pulmonar',
        'historiaFisioterapiaA' => 'Historia Fisioterapia'
    ],
    'neumologia' => [
        'historiaNeumologia' => 'Historia Neumología',

    ]
];


$historiasClinicas = [
    'estetica' => [
        [
            "id" => 1,
            'nombre' => 'Historia Clínica Estética',
            'doctor' => 'Carlos Ruiz',
            'motivo' => 'Consulta Estética',
            'estado' => 'pending-cancellation'
        ],
        [
            "id" => 2,
            'nombre' => 'Historia Clínica Estética 2',
            'doctor' => 'Carlos Ruiz',
            'motivo' => 'Consulta Estética 2',
            'estado' => 'approved'
        ]
    ],
    'medicina_general' => [
        [
            "id" => 3,
            'nombre' => 'Historia Clínica Medicina General',
            'doctor' => 'Manuel Antonio Rosales',
            'motivo' => 'Chequeo general',
            'estado' => 'approved'
        ],
        [
            "id" => 4,
            'nombre' => 'Historia Clínica Medicina General 2',
            'doctor' => 'Carlos Ruiz',
            'motivo' => 'Chequeo de control',
            'estado' => 'pending-cancellation'
        ]
    ],
    'psicologia' => [
        [
            "id" => 5,
            'nombre' => 'Historia Clínica Psicología',
            'doctor' => 'Diana Maria Fernandez',
            'motivo' => 'Evaluación psicológica',
            'estado' => 'approved'
        ]
    ],
    'psiquiatria' => [
        [
            "id" => 6,
            'nombre' => 'Historia Clínica Psiquiatría',
            'doctor' => 'Carlos Ruiz',
            'motivo' => 'Tratamiento psiquiátrico',
            'estado' => 'approved'
        ]
    ],
    'pediatria' => [
        [
            "id" => 7,
            'nombre' => 'Historia Clínica Pediatría',
            'doctor' => 'Diana Maria Fernandez',
            'motivo' => 'Consulta pediátrica',
            'estado' => 'approved'
        ]
    ]
];

$especialidad = $_GET['especialidad'] ?? '';
$nombreEspecialidad = array_key_exists($especialidad, $tiposHistorias) ? ucfirst(str_replace('_', ' ', $especialidad)) : 'Especialidad Desconocida';
$historiasFiltradas = $historiasClinicas[$especialidad] ?? [];
$tiposEspecialidad = $tiposHistorias[$especialidad] ?? [];
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item active especialidadName" onclick="location.reload()"></li>
            </ol>
        </nav>

        <div class="row">
            <div id="patientClinicalRecordAppReact"></div>
            <!-- <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-0">Historias Clínicas - <?= $nombreEspecialidad ?></h2>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Crear Historia Clínica
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <?php foreach ($tiposEspecialidad as $key => $tipo) { ?>
                                <li><a class="dropdown-item" href="consultas?patient_id=<?= $_GET['patient_id'] ?>&especialidad=<?= $especialidad ?>&tipo_historia=<?= $key; ?>">Crear <?= $tipo ?></a></li>
                            <?php } ?>
                        </ul>
                    </div>
                </div>
            </div> -->
        </div>

        <!-- <div class="row mt-4">
            <table class="table table-sm tableDataTableSearch">
                <thead>
                    <tr>
                        <th>Nombre de la Historia</th>
                        <th>Doctor(a)</th>
                        <th>Motivo de Consulta</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($historiasFiltradas as $historia) { ?>
                        <tr>
                            <td class="align-middle"><?= $historia['nombre'] ?></td>
                            <td class="align-middle"><?= $historia['doctor'] ?></td>
                            <td class="align-middle"><?= $historia['motivo'] ?></td>
                            <td class="align-middle">
                                <span class="badge badge-phoenix <?= $estadosEspecialidad[$historia['estado']]['badge-class'] ?>"><?= $estadosEspecialidad[$historia['estado']]['name'] ?></span>
                            </td>
                            <td class="text-end align-middle">
                                <div class="dropdown">
                                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i data-feather="settings"></i> Acciones
                                    </button>
                                    <ul class="dropdown-menu" style="z-index: 10000;">
                                        <?php
                                        if ($historia['estado'] == 'approved') {
                                        ?>
                                            <li>
                                                <a class="dropdown-item" href="#" onclick="solicitarAnulacion(<?= $historia['id'] ?>)">
                                                    <div class="d-flex gap-2 align-items-center">
                                                        <i class="fa-solid fa-ban" style="width: 20px;"></i>
                                                        <span>Solicitar anulación</span>
                                                    </div>
                                                </a>
                                            </li>
                                        <?php
                                        }
                                        ?>
                                        <li>
                                            <a class="dropdown-item" href="#<?= $historia['id']; ?>">
                                                <div class="d-flex gap-2 align-items-center">
                                                    <i class="fa-solid fa-print" style="width: 20px;"></i>
                                                    <span>Imprimir</span>
                                                </div>
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="#<?= $historia['id']; ?>" id="generate_consent_pdf">
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
        </div> -->
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.especialidadName').forEach(div => {
                div.textContent = new URLSearchParams(window.location.search).get('especialidad');
            })
        })

        function solicitarAnulacion(id) {
            console.log('Solicitando anulación para historia clinica con ID:', id);

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, solicitar anulación',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Antecedente eliminado con ID:', id);
                    Swal.fire(
                        '¡Solicitado!',
                        'Se ha solicitado la anulación de la historia clinica.',
                        'success'
                    );
                }
            });
        }
    </script>

    <?php include "../footer.php"; ?>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        PatientClinicalRecordApp
    } from './react-dist/clinical-records/PatientClinicalRecordApp.js';

    ReactDOMClient.createRoot(document.getElementById('patientClinicalRecordAppReact')).render(React.createElement(PatientClinicalRecordApp));
</script>

<script type="module">
    import {
        patientService
    } from "../../services/api/index.js";
    import {
        clinicalRecordService
    } from './services/api/index.js';

    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const patientPromise = patientService.get(patientId);
    const clinicalRecordPromise = clinicalRecordService.ofParent(patientId);

    const [patient, clinicalRecords] = await Promise.all([patientPromise, clinicalRecordPromise]);

    console.log('Paciente:', patient);
    console.log('Historias Clínicas:', clinicalRecords);

    document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`
        }
    })
</script>