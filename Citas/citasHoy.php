<?php
include "../menu.php";
include "../header.php";
$arraytest = [
    [
        "Nombre" => "Juan Pérez",
        "Numero de documento" => "108574152",
        "Fecha Consulta" => "2025-10-18",
        "Hora Consulta" => "08:00 AM",
        "Profesional asignado" => "Camilo Villacorte",
        "Entidad" => "Entidad 1",
        "Estado" => "Pendiente"
    ],

];

// Datos de ejemplo
$consultas = [
    ['id' => 1, 'fecha' => '2024-11-20', 'descripcion' => 'Consulta sobre productos', 'estado' => 'Pendientes'],
    ['id' => 2, 'fecha' => '2024-11-25', 'descripcion' => 'Consulta sobre envíos', 'estado' => 'En espera de consulta'],
    ['id' => 3, 'fecha' => '2024-11-26', 'descripcion' => 'Consulta médica', 'estado' => 'En consulta'],
    ['id' => 4, 'fecha' => '2024-11-27', 'descripcion' => 'Seguimiento', 'estado' => 'Consulta finalizada'],
];

$recetas = [
    ['id' => 1, 'nombre' => 'Ibuprofeno', 'presentacion' => 'Tabletas 200mg', 'dosis' => '2 veces al día', 'fecha' => '2024-11-20', 'descripcion' => 'Receta para dolor de cabeza'],
    ['id' => 2, 'nombre' => 'Paracetamol', 'presentacion' => 'Tabletas 500mg', 'dosis' => 'Cada 8 horas', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para fiebre'],
    ['id' => 3, 'nombre' => 'Amoxicilina', 'presentacion' => 'Cápsulas 500mg', 'dosis' => '3 veces al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para infección respiratoria'],
    ['id' => 4, 'nombre' => 'Metformina', 'presentacion' => 'Tabletas 850mg', 'dosis' => '1 vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para diabetes tipo 2'],
    ['id' => 5, 'nombre' => 'Loratadina', 'presentacion' => 'Tabletas 10mg', 'dosis' => 'Una vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para alergias'],
    ['id' => 6, 'nombre' => 'Omeprazol', 'presentacion' => 'Tabletas 20mg', 'dosis' => '1 vez al día antes de las comidas', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para acidez estomacal'],
    ['id' => 7, 'nombre' => 'Fluconazol', 'presentacion' => 'Cápsulas 150mg', 'dosis' => 'Una sola dosis', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para infección vaginal'],
];

// Agrupar consultas por estado
$estados = ['Pendientes', 'En espera de consulta', 'En consulta', 'Consulta finalizada'];
$consultasPorEstado = [];
foreach ($estados as $estado) {
    $consultasPorEstado[$estado] = array_filter($consultas, fn($consulta) => $consulta['estado'] === $estado);
}


$tabs = [
    ['icono' => 'file-invoice-dollar', 'titulo' => 'Facturación', 'texto' => 'Crear facturas para admisionar al paciente', 'url' => 'facturacionAdmisiones'],
    ['icono' => 'person-walking-arrow-right', 'titulo' => 'Pacientes', 'texto' => 'Visualiza los pacientes y accede a su información', 'url' => 'pacientescontrol'],
    ['icono' => 'calendar-days', 'titulo' => 'Citas', 'texto' => 'Gestión y control de citas', 'url' => 'gestioncitas'],
    ['icono' => 'hospital', 'titulo' => 'Sala de Espera', 'texto' => 'Visualiza los pacientes por el estado de su cita', 'url' => 'salaEspera'],
    ['icono' => 'file-prescription', 'titulo' => 'Post - Consulta', 'texto' => 'Visualiza los pacientes que finalizarón consulta', 'url' => 'postconsultaControl'],
    ['icono' => 'house-chimney-medical', 'titulo' => 'Admisiones', 'texto' => 'Visualiza el historial de adminisiones', 'url' => 'controlAdmisiones'],
    ['icono' => 'house-chimney-medical', 'titulo' => 'Consentimientos', 'texto' => 'Visualiza consentimientos pendientes de firma', 'url' => 'controlAdmisiones'],
];
?>

<link rel="stylesheet" href="./assets/css/styles.css">
<style>
    .board {
        display: flex;
        gap: 20px;
        overflow-x: auto;
    }

    .column-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .column-title {
        font-size: 18px;
        margin-bottom: 10px;
        text-align: center;
    }

    .column {
        width: 250px;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 20em;
    }

    .task {
        border-radius: 5px;
        padding: 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        /* cursor: grab; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        text-align: center;
    }

    .task strong {
        display: block;
    }

    .task p {
        margin: 5px 0;
    }

    .view-patient-btn {
        margin-top: 10px;
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        text-align: center;
        display: block;
    }

    .view-patient-btn:hover {
        background-color: #0056b3;
    }

    /* Estilos por estado */
    .column[data-status="1"] .task {
        background-color: #d3d3d3;
    }

    .column[data-status="2"] .task {
        background-color: #add8e6;
    }

    .column[data-status="3"] .task {
        background-color: #90ee90;
    }

    .column[data-status="4"] .task {
        background-color: #32cd32;
    }

    .column[data-status="Pre admisión"] .task {
        background-color: rgb(220, 94, 153);
    }

    /* Tema oscuro */
    html[data-bs-theme="dark"] .task {
        color: #000;
    }
</style>

<div class="componente">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Control de citas</li>
                </ol>
            </nav>
            <div class="row g-0 g-md-4 g-xl-6 p-5 justify-content-center">
                <div class="col-md-9">
                    <div class="row row-cols-1 row-cols-md-3 g-3 mb-3 mt-2">
                        <?php foreach ($tabs as $tab) { ?>
                            <div class="col">
                                <div class="card text-center" style="min-height: 15em;">
                                    <div class="card-body d-flex flex-column justify-content-between align-items-center"
                                        style="height: 100%;">
                                        <!-- Icono en la parte superior -->
                                        <div class="mb-2">
                                            <i class="fas fa-<?= $tab['icono'] ?> fa-2x"></i>
                                        </div>
                                        <!-- Título -->
                                        <h5 class="card-title"><?= $tab['titulo'] ?></h5>
                                        <!-- Texto -->
                                        <p class="card-text fs-9 text-center">
                                            <?= $tab['texto'] ?>
                                        </p>
                                        <!-- Botón -->
                                        <a href="<?= $tab['url'] ?>" class="btn btn-primary mt-auto">
                                            <i class="fas fa-chevron-right"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
include "../footer.php";
?>