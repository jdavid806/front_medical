<?php
include "../menu.php";
include "../header.php";
?>

<style>
    .tox .tox-notification,
    .tox-promotion {
        display: none;
    }

    .hidden {
        display: none;
    }
</style>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Plantillas mensajes</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="col-10">
                        <div class="d-flex justify-content-between col-12 row col-md-auto" id="scrollspyFacturacionVentas">
                            <div class="col-6">
                                <h2 class="mb-4">Plantillas de mensajes</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-0 g-md-4 g-xl-6">
                <div class="content-section">
                    <?php include "../Configuracion/tabs/tab_templatesMessagesConfiguration.php"; ?>
                </div>
            </div>
        </div>
    </div>
</div>
<?php include "../footer.php"; ?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js"></script>

<style>
    .custom-th {
        padding: 0.25rem;
        height: 40px;
        font-size: 16px;
    }

    .custom-td {
        padding: 0.25rem;
        height: 40px;
        font-size: 16px;
    }
</style>