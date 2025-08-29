<?php
include "../../menu.php";
include "../../header.php";

$tabs = [
    ['icono' => 'user-plus', 'titulo' => 'Usuarios', 'texto' => 'Crea y actualiza las reglas para el manejo de los usuarios', 'url' => 'cardUsers'],
    ['icono' => 'users', 'titulo' => 'Roles de Usuario', 'texto' => 'Crear y actualiza los examenes del centro medico', 'url' => 'cardRoles'],
    ['icono' => 'calendar-days', 'titulo' => 'Horarios de Atención', 'texto' => 'Crea y actualiza los precios a facturar', 'url' => 'cardHorarios'],
    ['icono' => 'calendar-xmark', 'titulo' => 'Ausencias Programadas', 'texto' => 'Importa datos al sistema en formato csv', 'url' => 'cardAusencias'],
    ['icono' => 'hand-holding-dollar', 'titulo' => 'Comisiones', 'texto' => 'Crear y actualiza los formatos de consentimiento', 'url' => 'cardComisiones'],
    ['icono' => 'tablet-screen-button', 'titulo' => 'Modulos', 'texto' => 'Crear y actualiza los formatos de consentimiento', 'url' => 'cardModulos'],
    ['icono' => 'user-doctor', 'titulo' => 'Especialidades Medicas', 'texto' => 'Crear y actualiza los formatos de consentimiento', 'url' => 'cardEspecialidades'],
    ['icono' => 'clipboard-question', 'titulo' => 'Motivo de Consulta', 'texto' => 'Crear y actualiza los motivos de consulta', 'url' => 'cardMotivoConsulta'],
    

];

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
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeConfiguracion">Configuración</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Usuarios</li>
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

<?php
include "../../footer.php";
?>