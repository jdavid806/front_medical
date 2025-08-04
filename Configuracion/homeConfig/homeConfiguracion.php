<?php
include "../../menu.php";
include "../../header.php";

$tabs = [
    ['icono' => 'toolbox', 'titulo' => 'Configuración Empresa', 'texto' => 'Ver y configurar los detalles del centro medico', 'url' => 'configuracionEmpresa'],
    ['icono' => 'building-columns', 'titulo' => 'Entidades', 'texto' => 'Crear y actualiza info de las ARS', 'url' => 'configEntidades'],
    ['icono' => 'users', 'titulo' => 'Usuarios', 'texto' => 'Crea y actualiza las reglas para el maenjo de los usuarios', 'url' => 'configUsuarios'],
    ['icono' => 'file-invoice', 'titulo' => 'Examenes', 'texto' => 'Crear y actualiza los examenes del centro medico', 'url' => 'configExamenes'],
    ['icono' => 'money-bill-1-wave', 'titulo' => 'Precios', 'texto' => 'Crea y actualiza los precios a facturar', 'url' => 'configPrecios'],
    ['icono' => 'upload', 'titulo' => 'Importaciones', 'texto' => 'Importa datos al sistema en formato csv', 'url' => 'configImportaciones'],
    ['icono' => 'file-word', 'titulo' => 'Consentimientos', 'texto' => 'Crear y actualiza los formatos de consentimiento', 'url' => 'configConsentimientos'],

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
                <li class="breadcrumb-item active" onclick="location.reload()" id="nameBradcumb"></li>
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