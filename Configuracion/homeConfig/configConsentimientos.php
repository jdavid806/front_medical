<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeConfiguracion">Configuración</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Configuración de Precios</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <h2>Configuración de Consentimientos</h2>
                </div>
                <?php include "../tabs/tab_consentTemplatesConfiguration.php";?>
            </div>
        </div>
    </div>
</div>

<?php
include "../modales/modalAgregarPlantillaConsentimiento.php";
include "../../footer.php";
?>