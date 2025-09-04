<?php
$campos = [
  "NOMBRE_PACIENTE",
  "FECHA_CITA",
  "HORA_CITA",
  "ESPECIALIDAD",
  "ESPECIALISTA",
  "MOTIVO_REAGENDAMIENTO",
  "MOTIVO_CANCELACION",
  "ENLACE_TELEMEDICINA",
];
?>

<div class="row gap-2 m-2">
  <?php foreach ($campos as $campo): ?>
    <div class="col-auto field">
      <span id="<?= $campo ?>"><?= $campo ?></span>
      <button type="button" class="btn btn-outline-secondary btn-sm" onclick="copiarTexto('<?= $campo ?>')">
        <i class="far fa-copy"></i>
      </button>
    </div>
  <?php endforeach; ?>
</div>