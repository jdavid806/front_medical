<?php
include "../menu.php";
include "../header.php";


$arrayCards = [
    ['icono' => 'stethoscope', 'titulo' => 'Corporal', 'texto' => 'Crea o revisa el historial de Ortodoncia', 'divId' => 'cargarResultados', 'url' => 'esteticaCorporal', 'especialidad' => 'Estética'],
    ['icono' => 'kit-medical', 'titulo' => 'Facial', 'texto' => 'Crea o revisa el historial de Odontología', 'divId' => 'resultadosCargados', 'url' => 'esteticaFacial', 'especialidad' => 'Estética'],
    ['icono' => 'book-medical', 'titulo' => 'Laser', 'texto' => 'Crea o revisa el historial de Periodoncia', 'divId' => 'orden', 'url' => 'esteticaLaser', 'especialidad' => 'Estética'],
    ['icono' => 'stethoscope', 'titulo' => 'Mesoterapia facial', 'texto' => 'Crea o revisa el historial de Endodoncia', 'divId' => 'cargarResultados', 'url' => 'esteticaMesoterapiaFacial', 'especialidad' => 'Estética'],
    ['icono' => 'kit-medical', 'titulo' => 'Mesoterapia Capilar', 'texto' => 'Crea o revisa el historial de Control de Placa', 'divId' => 'resultadosCargados', 'url' => 'esteticaMesoterapiaCorporal', 'especialidad' => 'Estética'],
    ['icono' => 'kit-medical', 'titulo' => 'Mesoterapia Corporal', 'texto' => 'Crea o revisa el historial de Control de Placa', 'divId' => 'resultadosCargados', 'url' => 'historial-control-placa.php', 'especialidad' => 'Estética'],
    ['icono' => 'stethoscope', 'titulo' => 'Ortodoncia', 'texto' => 'Crea o revisa el historial de Ortodoncia', 'divId' => 'cargarResultados', "url" => 'odontologiaHistoria', 'especialidad' => 'odontologia'],
    ['icono' => 'kit-medical', 'titulo' => 'Odontología', 'texto' => 'Crea o revisa el historial de Odontología', 'divId' => 'resultadosCargados', "url" => 'odontologiaHistoria', 'especialidad' => 'odontologia'],
    ['icono' => 'book-medical', 'titulo' => 'Periodoncia', 'texto' => 'Crea o revisa el historial de Periodoncia', 'divId' => 'orden', "url" => 'odontologiaHistoria', 'especialidad' => 'odontologia'],
    ['icono' => 'stethoscope', 'titulo' => 'Endodoncia', 'texto' => 'Crea o revisa el historial de Endodoncia', 'divId' => 'cargarResultados', "url" => 'odontologiaHistoria', 'especialidad' => 'odontologia'],
    ['icono' => 'kit-medical', 'titulo' => 'Control de Placa', 'texto' => 'Crea o revisa el historial de Control de Placa', 'divId' => 'resultadosCargados', "url" => 'odontologiaHistoria', 'especialidad' => 'odontologia'],
    ['icono' => 'book-medical', 'titulo' => 'DICOM', 'texto' => 'Visualizador DICOM', 'divId' => 'orden']
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

$especialidadSeleccionada = 'Estética';
$cardsFiltradas = array_filter($arrayCards, function ($card) use ($especialidadSeleccionada) {
    return $card['especialidad'] === $especialidadSeleccionada;
});



?>

<div class="componete">
    <div class="content mb-5">
        <div class="container-small">
            <nav class="mt-5" aria-label="breadcrumb" style="margin-top: 75px !important;">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Estetica</li>
                </ol>
            </nav>
        </div>
        <div class="row w-100">
            <div class="col-4">
                <div class="sticky-leads-sidebar mt-5">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
                        id="productFilterColumn">
                        <div class="d-flex justify-content-between align-items-center mb-2 d-md-none">
                            <h3 class="mb-0">Información del Paciente</h3>
                            <button class="btn p-0" data-phoenix-dismiss="offcanvas"><span
                                    class="uil uil-times fs-7"></span></button>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <!-- Imagen del avatar -->
                                    <div class="me-3">
                                        <div class="avatar avatar-5xl">
                                            <img class="rounded-circle" src="https://via.placeholder.com/150"
                                                alt="Avatar">
                                        </div>
                                    </div>
                                    <!-- Información personal -->
                                    <div class="flex-grow-1">
                                        <!-- Nombre -->
                                        <h5 class="fw-bold mb-2">Jefferson Dávila</h5>
                                        <!-- Datos adicionales -->
                                        <div class="d-flex flex-wrap align-items-center gap-3">
                                            <!-- RH -->
                                            <div class="d-flex align-items-center">
                                                <i class="fa-solid fa-droplet text-primary me-2"></i>
                                                <span class="fw-bold">RH:</span>
                                                <span class="text-muted ms-1">O+</span>
                                            </div>
                                            <!-- Teléfono -->
                                            <div class="d-flex align-items-center">
                                                <i class="fa-solid fa-phone text-primary me-2"></i>
                                                <span class="fw-bold">Celular:</span>
                                                <span class="text-muted ms-1 small">305357</span>
                                            </div>
                                            <!-- Correo -->
                                            <div class="d-flex align-items-center">
                                                <i class="fa-solid fa-envelope text-primary me-2"></i>
                                                <span class="fw-bold">Email:</span>
                                                <span class="text-muted ms-1 small">Email@email.com</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <!-- Encabezado con título y botón al lado -->
                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <h3>Antecendentes médicos</h3>
                                    <button class="btn text-primary p-0 d-flex align-items-center gap-2"
                                        title="ver detalles de consulta" data-value="mostrar" type="button"
                                        data-bs-toggle="modal" data-bs-target="#modalVerAntecedentesClinicos">
                                        <i class="fa-solid fa-file-medical"></i>
                                        <p class="mb-0">Ver más</p>
                                    </button>

                                </div>

                                <!-- Última consulta -->
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1">
                                        <span class="me-2 uil uil-clock"></span>
                                        <h5 class="text-body-highlight mb-0">Última Consulta</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">12 November 2021, 10:54 AM</p>
                                </div>

                                <!-- Campos básicos de antecedentes médicos -->
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1">
                                        <span class="me-2 uil uil-medkit"></span>
                                        <h5 class="text-body-highlight mb-0">Alergias</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Polen, Penicilina</p>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1">
                                        <span class="me-2 uil uil-heart"></span>
                                        <h5 class="text-body-highlight mb-0">Enfermedades Crónicas</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Hipertensión, Diabetes</p>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1">
                                        <span class="me-2 uil uil-walking"></span>
                                        <h5 class="text-body-highlight mb-0">Hábitos Relevantes</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">No fuma, realiza actividad física semanalmente
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-5">
                                    <h3>Información de Contacto</h3>
                                    <button class="btn btn-link" type="button">Edit</button>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span
                                            class="me-2 uil uil-estate"></span>
                                        <h5 class="mb-0">Dirección</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">calle 123</p>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-map"></span>
                                        <h5 class="mb-0 text-body-highlight">Ciudad</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Bogota</p>
                                </div>
                                <div>
                                    <div class="d-flex align-items-center mb-1"><span
                                            class="me-2 uil uil-windsock"></span>
                                        <h5 class="mb-0 text-body-highlight">País</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Colombia</p>
                                </div>
                                <div>
                                    <div class="d-flex align-items-center mb-1"><span class="me-2"></span>
                                        <h5 class="text-body-highlight mt-5"> Razón Ultima Consulta</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">Presentaba dolores de cabeza y abdominales</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="phoenix-offcanvas-backdrop d-lg-none top-0"
                        data-phoenix-backdrop="data-phoenix-backdrop"></div>
                </div>
            </div>
            <div class="col-8">
                <h2>Estetica</h2>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Evolucion del paciente</h5>
                        <div class="row align-items-center g-3 text-center text-xxl-start">
                            <div class="timeline">
                                <?php foreach ($consultasHistorico as $consulta) { ?>
                                    <div class="timeline-item">
                                        <div class="date"><?= $consulta['fecha'] ?></div>
                                        <div class="card">
                                            <div class="description"><?= $consulta['descripcion'] ?></div>
                                        </div>
                                    </div>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-3 mt-5">

                    <select class="form-select mb-5" id="organizerSingle" data-choices="data-choices"
                        data-options='{"removeItemButton":true,"placeholder":true}'>
                        <option value="">Seleccione una historia</option>
                        <?php foreach ($historiasFiltradas as $historia): ?>
                            <?php
                            // Recorremos los campos de la historia, buscando el primero que no sea "especialidad" ni "historiaId"
                            foreach ($historia as $key => $value) {
                                // Si no es ni "especialidad" ni "historiaId", lo mostramos como opción
                                if ($key !== 'especialidad' && $key !== 'historiaId') {
                                    // Usamos el nombre de la clave como el valor para redirigir
                                    $historiaNombre = $key;
                                    break; // Solo tomamos el primer campo que encontremos
                                }
                            }
                            ?>
                            <option value="<?= $historiaNombre; ?>">
                                <?= $value; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>

                </div>
                <div class="col-12">
                    <div id="infoContainer"
                        style="margin-top: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
                        <div id="consultas"
                            data-list="{&quot;valueNames&quot;:[&quot;fecha&quot;,&quot;doctor&quot;,&quot;motivo&quot;],&quot;page&quot;:5,&quot;pagination&quot;:{&quot;innerWindow&quot;:2,&quot;left&quot;:1,&quot;right&quot;:1}}">
                            <div class="search-box mb-3 mx-auto">
                                <form class="position-relative">
                                    <input class="form-control search-input search form-control-sm" type="search"
                                        placeholder="Search" aria-label="Search" />
                                    <span class="fas fa-search search-box-icon"></span>
                                </form>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-sm fs-9 mb-0">
                                    <thead>
                                        <tr>
                                            <th class="sort border-top border-translucent ps-3" data-sort="fecha">Fecha
                                            </th>
                                            <th class="sort border-top" data-sort="doctor">Doctor (a)</th>
                                            <th class="sort border-top" data-sort="motivo">Motivo de la consulta</th>
                                            <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="list">

                                        <?php foreach ($consultas as $consulta) { ?>

                                            <tr>
                                                <td class="align-middle ps-3 fecha"><?= $consulta['fecha'] ?></td>
                                                <td class="align-middle doctor"><?= $consulta['doctor'] ?></td>
                                                <td class="align-middle motivo"><?= $consulta['motivo'] ?></td>
                                                <td class="align-middle white-space-nowrap text-end pe-0">
                                                    <div class="d-flex justify-content-around fs-9">

                                                        <button class="btn text-primary p-0"
                                                            title="ver detalles de consulta" data-value="mostrar"
                                                            type="button" data-bs-toggle="modal"
                                                            data-bs-target="#modalVerConsulta">
                                                            <i class="fa-solid fa-up-right-from-square"></i>
                                                        </button>

                                                        <a href="#<?php echo $consulta['historiaId']; ?>"
                                                            title="impirmir consulta" class="btn text-primary p-0">
                                                            <i class="fa-solid fa-print"></i>
                                                        </a>

                                                        <a href="#<?php echo $consulta['historiaId']; ?>"
                                                            title="impirmir consulta" class="btn text-primary p-0">
                                                            <i class="fa-solid fa-download"></i>
                                                        </a>

                                                        <a class="btn text-primary p-0" href="#" role="button"
                                                            title="compartir" data-bs-toggle="dropdown"
                                                            aria-expanded="false">
                                                            <i class="fa-solid fa-share-nodes"></i>
                                                        </a>

                                                        <ul class="dropdown-menu">
                                                            <li><a class="dropdown-item" href="#"><i
                                                                        class="fa-brands fa-whatsapp"></i> Compartir por
                                                                    Whatsapp</a></li>
                                                            <li><a class="dropdown-item" href="#"><i
                                                                        class="fa-solid fa-envelope"></i> Compartir por
                                                                    Correo</a></li>
                                                        </ul>

                                                    </div>
                                                </td>
                                            </tr>
                                        <?php } ?>

                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex justify-content-center mt-3">
                                <button class="page-link disabled" data-list-pagination="prev" disabled=""><svg
                                        class="svg-inline--fa fa-chevron-left" aria-hidden="true" focusable="false"
                                        data-prefix="fas" data-icon="chevron-left" role="img"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                                        <path fill="currentColor"
                                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z">
                                        </path>
                                    </svg><!-- <span class="fas fa-chevron-left"></span> Font Awesome fontawesome.com --></button>
                                <ul class="mb-0 pagination">
                                    <li class="active"><button class="page" type="button" data-i="1"
                                            data-page="5">1</button></li>
                                    <li><button class="page" type="button" data-i="2" data-page="5">2</button></li>
                                    <li><button class="page" type="button" data-i="3" data-page="5">3</button></li>
                                    <li class="disabled"><button class="page" type="button">...</button></li>
                                    <li><button class="page" type="button" data-i="9" data-page="5">9</button></li>
                                </ul>
                                <button class="page-link pe-0" data-list-pagination="next"><svg
                                        class="svg-inline--fa fa-chevron-right" aria-hidden="true" focusable="false"
                                        data-prefix="fas" data-icon="chevron-right" role="img"
                                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="">
                                        <path fill="currentColor"
                                            d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z">
                                        </path>
                                    </svg></button>
                            </div>
                        </div>

                        <div id="cargarResultados" class="info-div d-none">
                            <h3>Cargar Resultados</h3>
                            <p>Información sobre cómo cargar resultados al sistema.</p>
                        </div>
                        <div id="resultadosCargados" class="info-div d-none">
                            <h3>Resultados Cargados</h3>
                            <p>Detalles de los resultados que ya están en el sistema.</p>
                        </div>
                        <div id="orden" class="info-div d-none">
                            <h3>Generar Orden de Laboratorio</h3>
                            <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation"><a class="nav-link active" id="home-tab"
                                        data-bs-toggle="tab" href="#tab-home" role="tab" aria-controls="tab-home"
                                        aria-selected="true">Seleccionar por Examenes</a></li>
                                <li class="nav-item" role="presentation"><a class="nav-link" id="profile-tab"
                                        data-bs-toggle="tab" href="#tab-profile" role="tab" aria-controls="tab-profile"
                                        aria-selected="false" tabindex="-1">Seleccionar por paquetes</a></li>
                                <li class="nav-item" role="presentation"><a class="nav-link" id="contact-tab"
                                        data-bs-toggle="tab" href="#tab-contact" role="tab" aria-controls="tab-contact"
                                        aria-selected="false" tabindex="-1">Seleccionar por categorías</a></li>
                            </ul>
                            <div class="tab-content mt-3" id="myTabContent">
                                <div class="tab-pane fade show active" id="tab-home" role="tabpanel"
                                    aria-labelledby="home-tab">
                                    <!-- Por examenes -->
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="card-title">Generar Orden de Laboratorio por exámenes</h5>
                                            <form action="submit" class="row">

                                                <select id="categoria" name="categoria" class="form-control mb-3">
                                                    <option value="">Seleccione una categoría</option>
                                                    <?php foreach ($arrayCategorias as $key => $categoria) { ?>
                                                        <option value="<?= $key ?>"><?= $categoria ?></option>
                                                    <?php } ?>
                                                </select>

                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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