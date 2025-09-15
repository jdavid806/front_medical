<?php
include "../menu.php";
include "../header.php";

$tabs = [
    'citas' => [
        'title' => 'Citas',
        'botones' => 'Citas',
        'subtabs' => [
            'creacion' => 'Creación',
            'cancelacion' => 'Cancelación',
            'reagendamiento' => 'Reagendamiento',
            'compartir' => 'Compartir',
            'confirmacion' => 'Confirmación'

        ],
        'anexo' => false
    ],
    'turnos' => [
        'title' => 'Turnos',
        'botones' => 'Turnos',
        'subtabs' => [
            'creacion' => 'Creación de Turno',
            'llamado' => 'Llamado a Turno',
            'llamadoPaciente' => 'Llamado a Paciente',
        ],
        'anexo' => false
    ],
     'telemedicina' => [
        'title' => 'Telemedicina',
        'botones' => 'Telemedicina',
           'subtabs' => [
            'creacion' => 'Creación',
            'cancelacion' => 'Cancelación',
            'reagendamiento' => 'Reagendamiento',
            'compartir' => 'Compartir',
            'confirmacion' => 'Confirmación'

        ],
        'anexo' => false
    ],
    'historia_clinica' => [
        'title' => 'Historia Clínica',
        'botones' => 'Historia',
        'subtabs' => [
            'creacion' => 'Creación',
            'compartir' => 'Compartir'
        ],
        'anexo' => false
    ],
    'recetas' => [
        'title' => 'Recetas',
        'botones' => 'Recetas',
        'subtabs' => [
            'creacion' => 'Creación',
            'compartir' => 'Compartir'
        ],
        'anexo' => false
    ],
    'remiciones' => [
        'title' => 'Remiciones',
        'botones' => 'Remiciones',
        'subtabs' => [
            'creacion' => 'Creación',
            'compartir' => 'Compartir'
        ],
        'anexo' => false
    ],
    'incapacidades' => [
        'title' => 'Incapacidades',
        'botones' => 'Incapacidad',
        'subtabs' => [
            'creacion' => 'Creación',
            'compartir' => 'Compartir'
        ],
        'anexo' => false
    ],
    'facturacion' => [
        'title' => 'Facturación',
        'botones' => 'Factura',
        'subtabs' => [
            'creacion' => 'Creación',
            'anulacion' => 'Anulación',
            'compartir' => 'Compartir'
        ],
        'anexo' => false
    ],
    'examenes' => [
        'title' => 'Exámenes',
        'botones' => 'Examenes',
        'subtabs' => [
            'creacion' => 'Creación',
            'cargue' => 'Cargue de resultados',
            'compartir' => 'Compartir'
        ],
        'anexo' => false
    ],
    'vacunas' => [
        'title' => 'Vacunas',
        'botones' => 'Vacunas',
        'subtabs' => [
            'creacion' => 'Creación',
            'compartir' => 'Compartir'
        ],
        'anexo' => false
    ],
    'consentimientos' => [
        'title' => 'Consentimientos',
        'botones' => 'Consentimientos',
        'subtabs' => [
            'creacion' => 'Creación',
            'compartir' => 'Compartir',
        ],
        'anexo' => false
    ],
];
?>

<style>
    #main-tabs {
        min-width: 200px;
        max-width: 250px;
    }

    .tox .tox-notification,
    .tox-promotion {
        display: none;
    }

    .hidden {
        display: none;
    }
      .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
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
                        <div class="d-flex justify-content-between col-12 row col-md-auto"
                            id="scrollspyFacturacionVentas">
                            <div class="col-6">
                                <h2 class="mb-4">Plantillas de mensajes</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-0 g-md-4 g-xl-6">
                <div class="content-section">
                    <?php // include "../Configuracion/tabs/tab_templatesMessagesConfiguration.php"; 
                    ?>
                    <div class="card mb-3">
                        <div class="d-flex">
                            <ul class="nav nav-underline fs-9 flex-column me-3" id="main-tabs" role="tablist">
                                <?php foreach ($tabs as $key => $tab): ?>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="<?= $key ?>-tab" data-bs-toggle="collapse"
                                            data-bs-target="#<?= $key ?>-submenu" aria-expanded="false">
                                            <i class="fas fa-folder"></i> <?= $tab['title'] ?>
                                        </button>
                                    </li>
                                    <ul class="collapse list-unstyled ps-3" id="<?= $key ?>-submenu">
                                        <?php foreach ($tab['subtabs'] as $subkey => $subtitle): ?>
                                            <li>
                                                <button class="nav-link subtab-link"
                                                    onclick="cambiarContenidoEditor('<?= $key ?>-<?= $subkey ?>')"
                                                    data-bs-toggle="tab" data-bs-target="#<?= $key ?>-<?= $subkey ?>-pane"
                                                    role="tab">
                                                    <i class="fas fa-file-alt"></i> <?= $subtitle ?>
                                                </button>
                                            </li>
                                        <?php endforeach; ?>
                                    </ul>
                                <?php endforeach; ?>
                            </ul>

                            <div class="tab-content w-100" id="subtabs-content">
                                <?php foreach ($tabs as $key => $tab): ?>
                                    <?php foreach ($tab['subtabs'] as $subkey => $subtitle): ?>
                                        <div class="tab-pane fade" id="<?= $key ?>-<?= $subkey ?>-pane" role="tabpanel">
                                            <div class="card">
                                                <div class="row g-0">
                                                    <div class="col-md-8">
                                                        <div class="card-body">
                                                            <h4 class="card-title"> <?= $subtitle ?> </h4>
                                                            <?php
                                                            $url = "../Configuracion/botonesDinamicos/" . $tab['botones'] . ".php";
                                                            include $url;
                                                            ?>
                                                            <div class="rich-text-react"
                                                                id="<?= $key ?>-<?= $subkey ?>-content"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-4 pe-3 gap-3 d-flex flex-column align-items-start mt-3">
                                                        <div class="mb-2">
                                                            <label class="form-label">Tipo Plantilla</label>
                                                            <select class="form-select"
                                                                id="plantilla-<?= $key ?>-<?= $subkey ?>"
                                                                onchange="cambiarContenidoEditor('<?= $key ?>-<?= $subkey ?>')">
                                                                <option value="whatsapp">WhatsApp</option>
                                                                <option value="email">Correo</option>
                                                            </select>
                                                        </div>
                                                        <?php if ($tab['anexo']): ?>
                                                            <div class="form-check form-switch">
                                                                <input class="form-check-input" type="checkbox"
                                                                    id="adjunto-<?= $key ?>-<?= $subkey ?>">
                                                                <label class="form-check-label"
                                                                    for="adjunto-<?= $key ?>-<?= $subkey ?>">
                                                                    <i class="fas fa-paperclip"></i> Adjuntar PDF Generado
                                                                </label>
                                                            </div>
                                                        <?php endif; ?>
                                                        <button class="btn btn-success mt-3"
                                                            id="guardar-<?= $key ?>-<?= $subkey ?>"
                                                            onclick="(async () => { await guardarDataPlantilla('<?= $key ?>-<?= $subkey ?>'); })()">
                                                            <i class="fas fa-save"></i> Guardar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
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