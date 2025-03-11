<?php
include "../menu.php";
include "../header.php";




$arrayCards = [
    [
        'icono' => 'stethoscope',
        'titulo' => 'Estética',
        'texto' => 'Crea o revisa el historial de Estetica',
        'divId' => 'cargarResultados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'estetica'
    ],
    [
        'icono' => 'stethoscope',
        'titulo' => 'Medicina General',
        'texto' => 'Crea o revisa el historial de médicina general',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'medicina_general'
    ],
    [
        'icono' => 'fas fa-pen-alt',
        'titulo' => 'Psicologia',
        'texto' => 'Crea o revisa el historial de psicologia',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'psicologia'
    ],
    [
        'icono' => 'fas fa-brain',
        'titulo' => 'Psiquiatria',
        'texto' => 'Crea o revisa el historial de psiquiatria',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'psiquiatria'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Pediatria',
        'texto' => 'Crea o revisa el historial de pediatria',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'pediatria'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Odontologia',
        'texto' => 'Crea o revisa el historial de odontologia',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'odontologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Otorrino',
        'texto' => 'Crea o revisa el historial de otorrinolaringologia',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'otorrino'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Ginecologia',
        'texto' => 'Crea o revisa el historial de ginecologia',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'ginecologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Control Prenatal',
        'texto' => 'Crea o revisa el historial de Control prenatal',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'controlPrenatal'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Ecografias',
        'texto' => 'Crea o revisa el historial de Ecografias',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'ecografia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Cardiologia',
        'texto' => 'Crea o revisa el historial de cardiologia',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'cardiologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Nutrición',
        'texto' => 'Crea o revisa el historial de nutrición',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'nutricion'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Gastroenterología',
        'texto' => 'Crea o revisa el historial de gastroenterología',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'gastroenterologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Dominicana',
        'texto' => 'Historias DO1334',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'oftalmologiaD'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Diabetes',
        'texto' => 'Crea o revisa el historial de diabetes',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'diabetes'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Endocrinología',
        'texto' => 'Crea o revisa el historial de endocrinología',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'endocrinologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Epicrisis',
        'texto' => 'Crea o revisa el historial de epicrisis',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'epicrisis'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Urología',
        'texto' => 'Crea o revisa el historial de urología',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'urologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Dermatologia',
        'texto' => 'Crea o revisa el historial de Dermatologia',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'dermatologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Cirugía Plástica',
        'texto' => 'Crea o revisa el historial de Cirugía plástica',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'cirugiaPlastica'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'SPA',
        'texto' => 'Crea o revisa el historial de SPA',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'SPA'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Informe quirúrgico',
        'texto' => 'Crea o revisa el historial de Informe quirúrgico',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'informeQuirurgico'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Oftalmología',
        'texto' => 'Crea o revisa el historial de Oftalmología',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'oftalmologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Traumatología',
        'texto' => 'Crea o revisa el historial de Traumatología',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'traumatologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Podología',
        'texto' => 'Crea o revisa el historial de Podología',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'podologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Fisioterapia',
        'texto' => 'Crea o revisa el historial de Fisioterapia',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'fisioterapia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Quiropráctica',
        'texto' => 'Crea o revisa el historial de Quiropráctica',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'quiropractica'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Neumología',
        'texto' => 'Crea o revisa el historial de Neumología',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'neumologia'
    ],
    [
        'icono' => 'kit-medical',
        'titulo' => 'Airec',
        'texto' => 'Crea o revisa el historial de Airec',
        'divId' => 'resultadosCargados',
        'url' => 'consultas-especialidad',
        'especialidad' => 'airec'
    ]
];


$consultas = [
    ['historiaId' => 1, 'fecha' => '2024-11-20', 'doctor' => 'Manuel Antonio Rosales', 'motivo' => 'Control General'],
    ['historiaId' => 2, 'fecha' => '2024-11-21', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
    ['historiaId' => 3, 'fecha' => '2024-11-21', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
    ['historiaId' => 4, 'fecha' => '2024-11-22', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
    ['historiaId' => 5, 'fecha' => '2024-11-22', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
    ['historiaId' => 6, 'fecha' => '2024-11-29', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
    ['historiaId' => 7, 'fecha' => '2024-11-29', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
    ['historiaId' => 8, 'fecha' => '2024-11-30', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
    ['historiaId' => 9, 'fecha' => '2024-12-10', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Control Cardiologico'],
];

$consultasHistorico = [
    ['fecha' => '2024-11-20', 'descripcion' => 'Consulta sobre productos'],
    ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
    ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
    ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
    ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
    ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
    ['fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos'],
];
?>

<div class="componete">
    <div class="content mb-5">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Consultas medicas</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row g-0 g-md-4 g-xl-6 p-5 justify-content-center">
                <h2 class="mb-0 patientName">Cargando...</h2>
                <div class="col-4">
                    <?php
                    include "../Pacientes/infoPaciente.php";
                    ?>
                </div>
                <div class="col-8">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-3">

                        <?php foreach ($arrayCards as $key => $card) { ?>
                            <div class="col">
                                <div class="card card-item" style="max-width:15rem;height:13em;"
                                    data-div-id="<?= $card['divId'] ?>">
                                    <div class="card-body d-flex flex-column align-items-center text-center">
                                        <div class="card-icon mb-2">
                                            <i class="fas fa-<?= $card['icono'] ?> fa-2x"></i>
                                        </div>
                                        <h5 class="card-title"><?= $card['titulo'] ?></h5>
                                        <div class="d-flex gap-2 flex-grow-1">
                                            <p class="card-text fs-9"><?= $card['texto'] ?></p>
                                        </div>
                                        <a href="<?= $card['url'] ?>?patient_id=<?= $_GET['patient_id'] ?>&especialidad=<?= $card['especialidad'] ?>"
                                            class="btn btn-primary btn-icon flex-shrink-0 mt-auto w-100">Ver más</a>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>

                    </div>

                </div>
            </div>

        </div>

    </div>







    <style>
        .active-card {
            border: 2px solid #007bff;
            /* Cambia el borde */
            background-color: #f0f8ff;
            /* Cambia el color de fondo */
            transition: all 0.3s ease;
            /* Animación suave */
        }

        .floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            background-color: #007bff;
            color: white;
            border-radius: 50px;
            padding: 10px 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            z-index: 1000;
        }

        .floating-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
        }

        .button-icon {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            border-radius: 50%;
        }
    </style>
    <style>
        .timeline {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin: 20px 0;
            padding: 0 10px;
            width: 100%;
            overflow-x: auto;
        }

        .timeline::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #0d6efd;
            z-index: -1;
        }

        .timeline-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin: 0 20px;
        }

        .timeline-item .date {
            font-weight: bold;
            padding: 5px 10px;
            border: 1px solid;
            border-radius: 5px;
            margin-bottom: 10px;
            z-index: 1;
        }

        .timeline-item .card {
            position: relative;
            border: 1px solid;
            padding: 15px;
            border-radius: 5px;
            min-width: 200px;
            text-align: center;
            z-index: 1;
        }

        .timeline-item .card::before {
            content: '';
            position: absolute;
            top: 50%;
            left: -40px;
            transform: translateY(-50%);
            width: 40px;
            height: 4px;
            background-color: #0d6efd;
        }
    </style>

    <?
    include "./modalAntencedentes.php";
    include "./modalConsulta.php";
    include "../footer.php";
    ?>