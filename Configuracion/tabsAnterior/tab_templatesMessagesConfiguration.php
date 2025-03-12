<?php
$tabs = [
  'citas' => [
    'title' => 'Citas',
    'subtabs' => [
      'creacion' => 'Creación',
      'cancelacion' => 'Cancelación',
      'reagendamiento' => 'Reagendamiento',
      'compartir' => 'Compartir'
    ]
  ],
  'historia_clinica' => [
    'title' => 'Historia Clínica',
    'subtabs' => [
      'creacion' => 'Creación',
      'compartir' => 'Compartir'
    ]
  ],
  'recetas' => [
    'title' => 'Recetas',
    'subtabs' => [
      'creacion' => 'Creación',
      'compartir' => 'Compartir'
    ]
  ],
  'incapacidades' => [
    'title' => 'Incapacidades',
    'subtabs' => [
      'creacion' => 'Creación',
      'compartir' => 'Compartir'
    ]
  ],
  'facturacion' => [
    'title' => 'Facturación',
    'subtabs' => [
      'creacion' => 'Creación',
      'anulacion' => 'Anulación',
      'compartir' => 'Compartir'
    ]
  ],
  'examenes' => [
    'title' => 'Exámenes',
    'subtabs' => [
      'creacion' => 'Creación',
      'cargue' => 'Cargue de resultados',
      'compartir' => 'Compartir'
    ]
  ]
];
?>

<style>
  #main-tabs {
    min-width: 200px;
    max-width: 250px;
  }
</style>

<div class="row gx-3 gy-4 mb-5">
  <div class="card mb-3">
    <div class="d-flex">
      <ul class="nav nav-underline fs-9 flex-column me-3" id="main-tabs" role="tablist">
        <?php foreach ($tabs as $key => $tab): ?>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="<?= $key ?>-tab" data-bs-toggle="collapse" data-bs-target="#<?= $key ?>-submenu"
              aria-expanded="false">
              <i class="fas fa-folder"></i> <?= $tab['title'] ?>
            </button>
          </li>
          <ul class="collapse list-unstyled ps-3" id="<?= $key ?>-submenu">
            <?php foreach ($tab['subtabs'] as $subkey => $subtitle): ?>
              <li>
                <button class="nav-link subtab-link" onclick="cambiarContenidoEditor('<?= $key ?>-<?= $subkey ?>')" data-bs-toggle="tab" data-bs-target="#<?= $key ?>-<?= $subkey ?>-pane"
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
                      <div class="rich-text-react" id="<?= $key ?>-<?= $subkey ?>-content"></div>
                    </div>
                  </div>
                  <div class="col-md-4 pe-3 gap-3 d-flex flex-column align-items-start mt-3">
                    <div class="mb-2">
                      <label class="form-label">Tipo Plantilla</label>
                      <select class="form-select" id="plantilla-<?= $key ?>-<?= $subkey ?>"
                        onchange="cambiarContenidoEditor('<?= $key ?>-<?= $subkey ?>')">
                        <option value="whatsapp">WhatsApp</option>
                        <option value="correo">Correo</option>
                      </select>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" id="adjunto-<?= $key ?>-<?= $subkey ?>">
                      <label class="form-check-label" for="adjunto-<?= $key ?>-<?= $subkey ?>">
                        <i class="fas fa-paperclip"></i> Adjuntar PDF Generado
                      </label>
                    </div>
                    <button class="btn btn-success mt-3" id="guardar-<?= $key ?>-<?= $subkey ?>"
                      onclick="guardarDataPlantilla('<?= $key ?>-<?= $subkey ?>')">
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